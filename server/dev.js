import fs from 'fs';
import app from './app.js';

// Load .env for local development (Node 20.12+). Vercel injects env vars itself.
if (fs.existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Ignore malformed .env files and let the connection error surface.
  }
}

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log('');
  console.log(`  API ready  →  http://localhost:${port}/api/health`);
  console.log('  Frontend   →  http://localhost:5173  (run `npm run dev` in a second terminal)');
  console.log('  Leave this terminal open. Press Ctrl+C to stop.');
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use by another process.`);
    console.error(`Find it with:  netstat -ano | findstr :${port}`);
    console.error('Then stop it:   taskkill /PID <pid> /F');
    process.exit(1);
  }
  throw error;
});
