// Vercel serverless entry: routes every /api/* request (except /api/og-meta) here.
import app from '../server/app.js';

export default function handler(req, res) {
  return app(req, res);
}
