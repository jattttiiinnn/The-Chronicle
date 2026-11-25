import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDb } from './db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import bookmarkRoutes from './routes/bookmarks.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/uploads.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Every API request needs a live database connection (cached across invocations).
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    res.status(503).json({ message: `Database unavailable: ${error.message}` });
  }
});

// Visiting the API port directly should explain itself instead of "Cannot GET /".
app.get('/', (_req, res) => {
  res.json({
    name: 'The Chronicle API',
    status: 'running',
    health: '/api/health',
    note: 'The app itself runs on http://localhost:5173',
  });
});

app.get('/api/health', async (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: mongoose.connection.name || null,
    uptime: Math.round(process.uptime()),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: `No API route for ${req.method} ${req.originalUrl}` });
});

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
