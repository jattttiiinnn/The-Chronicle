import { Router } from 'express';
import { Comment, Post, User, serialize } from '../models.js';
import { requireAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler } from '../lib/helpers.js';

const router = Router();

// POST /api/comments
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { postId, body, parentId } = req.body || {};
    if (!postId || !body || !String(body).trim()) {
      throw new HttpError(400, 'A comment body is required.');
    }

    const post = await Post.findById(postId);
    if (!post) throw new HttpError(404, 'Post not found');

    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent) throw new HttpError(404, 'Parent comment not found');
    }

    const comment = await Comment.create({
      postId: String(post._id),
      userId: String(req.user._id),
      parentId: parentId || null,
      body: String(body),
      // Editorial staff comments publish immediately; readers are held for moderation.
      isApproved: req.user.role === 'admin' || req.user.role === 'author',
    });

    return res.status(201).json({
      ...serialize(comment),
      user: {
        id: String(req.user._id),
        name: req.user.name,
        role: req.user.role,
        bio: req.user.bio,
        avatarUrl: req.user.avatarUrl,
      },
    });
  })
);

// Shared by DELETE /api/comments/:id and DELETE /api/admin/comments/:id
export async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new HttpError(404, 'Comment not found');

  if (!req.user || (req.user.role !== 'admin' && comment.userId !== String(req.user._id))) {
    throw new HttpError(403, 'Forbidden: You do not have permission to delete this comment.');
  }

  // Preserve thread continuity: tombstone a comment that still has live replies.
  const hasReplies = await Comment.exists({ parentId: String(comment._id), isDeleted: false });
  if (hasReplies) {
    comment.isDeleted = true;
    comment.body = '[This comment was removed by a moderator]';
    await comment.save();
  } else {
    await comment.deleteOne();
  }

  return res.json({ success: true, id: req.params.id, tombstoned: Boolean(hasReplies) });
}

router.delete('/:id', requireAuth, asyncHandler(deleteComment));

export default router;
