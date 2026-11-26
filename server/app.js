import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDb } from './db.js';
import { ogPreview } from './og.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import bookmarkRoutes from './routes/bookmarks.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';

const app = express();

// When `npm run build` has produced a bundle, this process also serves the
// frontend. That makes a single Render web service enough: one origin, no CORS
// setup and no VITE_API_URL. Vercel serves the SPA from its own static layer,
// so the folder is absent there and these blocks are skipped.
const distDir = path.resolve(process.cwd(), 'dist');
const hasBuild = fs.existsSync(path.join(distDir, 'index.html'));

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health is answered before the database middleware so an unreachable Atlas
// cluster reports itself here instead of masking the endpoint behind a 503
// connection error.
app.get('/api/health', async (_req, res) => {
  // Render's health check hits this before any other traffic, so the handler
  // must open the connection itself instead of waiting for another request.
  try {
    await connectDb();
  } catch (error) {
    console.error('[health] database connection failed:', error.message);
  }

  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: mongoose.connection.name || null,
    uptime: Math.round(process.uptime()),
  });
});

// API requests need a live database connection (cached across invocations).
// Scoped to /api on purpose: the static bundle and SPA shell must still load —
// with the frontend's own error states — when the database is unavailable.
app.use('/api', async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    res.status(503).json({ message: `Database unavailable: ${error.message}` });
  }
});

// Without a build, visiting the port directly should explain itself instead of
// "Cannot GET /". With a build, the SPA fallback below serves the app here.
if (!hasBuild) {
  app.get('/', (_req, res) => {
    res.json({
      name: 'The Chronicle API',
      status: 'running',
      health: '/api/health',
      note: 'The app itself runs on http://localhost:5173 (or run `npm run build` to serve it here)',
    });
  });
}


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// Social/search crawlers don't run the SPA, so story URLs get server-rendered
// preview tags. Humans fall through to the static app below.
app.get('/posts/:slug', ogPreview);

app.use('/api', (req, res) => {
  res.status(404).json({ message: `No API route for ${req.method} ${req.originalUrl}` });
});

if (hasBuild) {
  // Hashed bundles never change contents, so they can be cached forever.
  app.use(
    '/assets',
    express.static(path.join(distDir, 'assets'), { immutable: true, maxAge: '1y' })
  );
  // index.html is served by the fallback below, never by the static layer.
  app.use(express.static(distDir, { index: false }));

  // Client-side routes (/posts/:slug, /dashboard, /admin/…) need the shell.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Wrap async route handlers' errors into the frontend's expected { message } shape.
app.use((error, _req, res, _next) => {
  if (error?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size exceeds the 5MB maximum limit.' });
  }

  const status = error.status || error.statusCode || 500;
  const payload = { message: error.message || 'Internal Server Error' };
  if (error.conflict) payload.conflict = true;
  if (error.suggestedSlug) payload.suggestedSlug = error.suggestedSlug;

  if (status >= 500) {
    console.error('[api]', error);
  }

  return res.status(status).json(payload);
});

export default app;
