import fs from 'fs';
import mongoose from 'mongoose';

// Load .env before anything reads process.env (local dev + seeding).
// Vercel injects environment variables itself, so a missing file is fine.
if (fs.existsSync('.env')) {
  try {
    process.loadEnvFile('.env');
  } catch {
    // Ignore malformed .env files and let the missing-uri error surface below.
  }
}

function getUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and add your Atlas connection string.');
  }
  return uri;
}

// Reuse the connection across serverless invocations (Vercel) and hot reloads.
const cache = globalThis.__chronicleMongo || (globalThis.__chronicleMongo = { conn: null, promise: null });

export async function connectDb() {
  const uri = getUri();
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    mongoose.set('strictQuery', true);
    cache.promise = mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'chronicle',
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
