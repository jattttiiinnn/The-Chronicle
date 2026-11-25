import jwt from 'jsonwebtoken';
import { User } from '../models.js';

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set. Add it to your .env file (use a long random string).');
  return secret;
};

export function signToken(user) {
  return jwt.sign({ sub: String(user._id) }, jwtSecret(), { expiresIn: '7d' });
}

function readToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

async function resolveUser(req) {
  const token = readToken(req);
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret());
    const user = await User.findById(payload.sub);
    return user || null;
  } catch {
    return null;
  }
}

// Attaches req.user when a valid token is present; never rejects.
export async function optionalAuth(req, _res, next) {
  try {
    req.user = await resolveUser(req);
  } catch {
    req.user = null;
  }
  next();
}

export async function requireAuth(req, res, next) {
  const user = req.user || (await resolveUser(req));
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  req.user = user;
  next();
}

export async function requireAdmin(req, res, next) {
  const user = req.user || (await resolveUser(req));
  if (!user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Administrator privileges required.' });
  }
  req.user = user;
  next();
}
