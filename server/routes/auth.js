import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, serialize, serializeUser } from '../models.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { asyncHandler } from '../lib/helpers.js';

const router = Router();

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password, bio } = req.body || {};

    // Readers comment and save stories; writers also publish. Admin is never self-assigned.
    const requestedRole = String(req.body?.role || 'reader').toLowerCase();
    if (!['reader', 'author'].includes(requestedRole)) {
      return res.status(400).json({ message: 'Choose to join as either a reader or a writer.' });
    }

    if (!email || !EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: String(name || 'New Reader').trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(String(password), 10),
      role: requestedRole,
      bio: bio || '',
      avatarUrl: DEFAULT_AVATAR,
    });

    return res.status(201).json({ token: signToken(user), user: serialize(user) });
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(String(password), user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({ token: signToken(user), user: serialize(user) });
  })
);

// GET /api/auth/me
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    return res.json({ user: serializeUser(req.user) });
  })
);

export default router;
