import { Router } from 'express';
import { Comment, Post, User, serialize, serializeUser } from '../models.js';
import { requireAdmin } from '../middleware/auth.js';
import { HttpError, asyncHandler, escapeRegex, paginate, toInt } from '../lib/helpers.js';
import { deleteComment } from './comments.js';

const router = Router();

// Every route below requires an administrator session.
router.use(requireAdmin);

// --- Users -----------------------------------------------------------------

// GET /api/admin/users?q=&role=&page=&limit=
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 10);
    const role = String(req.query.role || '').toLowerCase().trim();
    const q = String(req.query.q || '').trim();

    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const ids = users.map((u) => String(u._id));
    const counts = await Post.aggregate([
      { $match: { authorId: { $in: ids } } },
      { $group: { _id: '$authorId', count: { $sum: 1 } } },
    ]);
    const countById = new Map(counts.map((row) => [row._id, row.count]));

    return res.json({
      users: users.map((user) => ({
        ...serializeUser(serialize(user)),
        postCount: countById.get(String(user._id)) || 0,
      })),
      pagination: paginate(total, page, limit),
    });
  })
);

// PATCH /api/admin/users/:id/role
router.patch(
  '/users/:id/role',
  asyncHandler(async (req, res) => {
    const target = await User.findById(req.params.id);
    if (!target) throw new HttpError(404, 'User not found');

    // Safeguard: an administrator cannot change their own role.
    if (String(req.user._id) === String(target._id)) {
      throw new HttpError(403, 'Administrators cannot alter their own role permissions.');
    }

    const { role } = req.body || {};
    if (!['reader', 'author', 'admin'].includes(role)) {
      throw new HttpError(400, 'Invalid role: Must be reader, author, or admin.');
    }

    // Safeguard: never leave the platform without an administrator.
    if (target.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        throw new HttpError(409, 'Operation denied: Cannot demote the last remaining administrator.');
      }
    }

    target.role = role;
    await target.save();

    return res.json(serialize(target));
  })
);

// --- Comment moderation -----------------------------------------------------

// GET /api/admin/comments?status=&q=&page=&limit=
router.get(
  '/comments',
  asyncHandler(async (req, res) => {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 10);
    const status = String(req.query.status || 'pending').toLowerCase().trim();
    const q = String(req.query.q || '').trim();

    const [pendingCount, approvedCount, allCount] = await Promise.all([
      Comment.countDocuments({ isApproved: false, isDeleted: false }),
      Comment.countDocuments({ isApproved: true, isDeleted: false }),
      Comment.countDocuments({}),
    ]);

    const filter = {};
    if (status === 'pending') filter.$and = [{ isApproved: false }, { isDeleted: false }];
    else if (status === 'approved') filter.$and = [{ isApproved: true }, { isDeleted: false }];

    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      const matchingUsers = await User.find({ name: rx }).select('_id').lean();
      const or = [{ body: rx }];
      if (matchingUsers.length) or.push({ userId: { $in: matchingUsers.map((u) => String(u._id)) } });
      filter.$and = [...(filter.$and || []), { $or: or }];
    }

    const [total, comments] = await Promise.all([
      Comment.countDocuments(filter),
      Comment.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    const userIds = [...new Set(comments.map((c) => c.userId))];
    const postIds = [...new Set(comments.map((c) => c.postId))];
    const [users, posts] = await Promise.all([
      User.find({ _id: { $in: userIds } }).lean(),
      Post.find({ _id: { $in: postIds } }).select('title slug').lean(),
    ]);
    const usersById = new Map(users.map((u) => [String(u._id), u]));
    const postsById = new Map(posts.map((p) => [String(p._id), p]));

    return res.json({
      comments: comments.map((comment) => {
        const author = usersById.get(comment.userId);
        const post = postsById.get(comment.postId);
        return {
          ...serialize(comment),
          author: author
            ? {
                id: String(author._id),
                name: author.name,
                email: author.email,
                role: author.role,
                avatarUrl: author.avatarUrl,
              }
            : { id: comment.userId, name: 'Anonymous Reader', role: 'reader' },
          post: {
            id: post ? String(post._id) : comment.postId,
            title: post ? post.title : 'Unknown Story',
            slug: post ? post.slug : 'unknown',
          },
        };
      }),
      counts: { pending: pendingCount, approved: approvedCount, all: allCount },
      pagination: paginate(total, page, limit),
    });
  })
);

// PATCH /api/admin/comments/:id/approve
router.patch(
  '/comments/:id/approve',
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) throw new HttpError(404, 'Comment not found');

    comment.isApproved = true;
    comment.isDeleted = false;
    await comment.save();

    return res.json(serialize(comment));
  })
);

// DELETE /api/admin/comments/:id (shares tombstone logic with the public route)
router.delete('/comments/:id', asyncHandler(deleteComment));

// --- Cover curation ---------------------------------------------------------

// GET /api/admin/posts?status=&category=&featured=&q=&page=&limit=
router.get(
  '/posts',
  asyncHandler(async (req, res) => {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 10);
    const status = String(req.query.status || 'all').toLowerCase().trim();
    const category = String(req.query.category || '').toLowerCase().trim();
    const featured = req.query.featured;
    const q = String(req.query.q || '').trim();

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (category && category !== 'all') {
      filter.categories = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
    }
    if (featured === 'true') filter.featured = true;
    else if (featured === 'false') filter.featured = false;
    if (q) filter.title = { $regex: escapeRegex(q), $options: 'i' };

    const [total, posts, allCount, published, draft, scheduled, featuredCount] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .sort({ sortDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Post.countDocuments({}),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Post.countDocuments({ status: 'scheduled' }),
      Post.countDocuments({ featured: true }),
    ]);

    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authors = await User.find({ _id: { $in: authorIds } }).lean();
    const authorsById = new Map(authors.map((a) => [String(a._id), a]));

    return res.json({
      posts: posts.map((post) => {
        const author = authorsById.get(post.authorId);
        return {
          ...serialize(post),
          author: author
            ? {
                id: String(author._id),
                name: author.name,
                email: author.email,
                role: author.role,
                avatarUrl: author.avatarUrl,
              }
            : null,
        };
      }),
      pagination: paginate(total, page, limit),
      counts: {
        all: allCount,
        published,
        draft,
        scheduled,
        featured: featuredCount,
      },
    });
  })
);

// PATCH /api/admin/posts/:id/featured
router.patch(
  '/posts/:id/featured',
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new HttpError(404, 'Post not found');

    const body = req.body || {};
    const target = typeof body.featured === 'boolean' ? body.featured : !post.featured;

    if (target && post.status !== 'published') {
      throw new HttpError(400, 'Only published stories can be featured on the cover.');
    }

    if (target) {
      const featuredCount = await Post.countDocuments({ featured: true, _id: { $ne: post._id } });
      if (featuredCount >= 3) {
        throw new HttpError(400, 'Maximum of 3 featured stories reached. Unfeature another story first.');
      }
    }

    post.featured = target;
    await post.save();

    return res.json(serialize(post));
  })
);

export default router;
