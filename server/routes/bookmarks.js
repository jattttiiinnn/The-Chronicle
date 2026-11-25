import { Router } from 'express';
import { Post, serialize, serializeMany } from '../models.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../lib/helpers.js';

const router = Router();

// GET /api/bookmarks — the signed-in reader's saved stories, newest save first.
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const ids = req.user.bookmarks || [];
    if (!ids.length) return res.json({ posts: [] });

    const posts = await Post.find({ _id: { $in: ids } }).lean();
    const order = new Map(ids.map((id, index) => [id, index]));
    posts.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));

    return res.json({ posts: serializeMany(posts) });
  })
);

export default router;
