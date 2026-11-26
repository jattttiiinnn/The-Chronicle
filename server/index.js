// Production entry point: one Node process serves both the API and the built SPA.
// Used by Render (`npm start`); locally `npm run api` (server/dev.js) is the
// frontend-friendly variant that prints the Vite dev-server hint.
import fs from 'fs';
import app from './app.js';

// Hosts such as Render inject environment variables. A local .env still wins
// for anyone running `npm start` on their machine.
if (fs.existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Ignore malformed .env files; a missing MONGODB_URI surfaces on first request.
  }
}

const port = Number(process.env.PORT) || 5000;
// Render (and most PaaS hosts) route traffic to the container's external
// interface, so bind 0.0.0.0 rather than localhost.
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(`Chronicle listening on http://${host}:${port}`);
  console.log(`Health check: http://${host}:${port}/api/health`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use by another process.`);
    process.exit(1);
  }
  throw error;
});

// Render sends SIGTERM before replacing an instance; close the listener so
// in-flight requests finish instead of being cut off.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} received, shutting down.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 8000).unref();
  });
}
