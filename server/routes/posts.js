import { Router } from 'express';
import { Comment, Post, Upload, User, serialize } from '../models.js';
import { optionalAuth } from '../middleware/auth.js';
import { HttpError, asyncHandler, escapeRegex, paginate, slugify, toInt } from '../lib/helpers.js';

const router = Router();

// Public feeds include published stories plus scheduled stories whose publish time has arrived.
function publicVisibility() {
  return { $or: [{ status: 'published' }, { status: 'scheduled', publishAt: { $lte: new Date() } }] };
}

function postFilter({ category, tag, search, status, authorId }) {
  const filter = {};

  if (authorId) filter.authorId = authorId;

  if (status && status !== 'all') {
    filter.status = status;
  } else if (!status && !authorId) {
    Object.assign(filter, publicVisibility());
  }

  if (category) filter.categories = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
  if (tag) filter.tags = { $regex: `^${escapeRegex(tag)}$`, $options: 'i' };

  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$and = [{ $or: [{ title: rx }, { excerpt: rx }, { tags: rx }] }];
  }

  return filter;
}

function sortFor({ authorId, category, tag, search, sort }) {
  if (sort === 'views') return { views: -1, sortDate: -1 };
  if (sort === 'oldest') return { sortDate: 1 };
  const isHomeFeed = !authorId && !category && !tag && !search;
  return isHomeFeed
    ? { featured: -1, sortDate: -1 }
    : { sortDate: -1 };
}

// GET /api/posts
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = toInt(req.query.page, 1);
    const limit = toInt(req.query.limit, 8);
    const filter = postFilter(req.query);

    const [total, posts] = await Promise.all([
      Post.countDocuments(filter),
      Post.find(filter)
        .sort(sortFor(req.query))
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return res.json({ posts: posts.map(serialize), pagination: paginate(total, page, limit) });
  })
);

// GET /api/posts/:slugOrId
router.get(
  '/:slugOrId',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const { slugOrId } = req.params;
    const isIdQuery = slugOrId.startsWith('post_');

    const post = isIdQuery
      ? await Post.findById(slugOrId)
      : await Post.findOne({ $or: [{ slug: slugOrId }, { _id: slugOrId }] });

    if (!post) throw new HttpError(404, 'Post not found');

    if (isIdQuery) {
      // Editor lookup: only the owning author or an admin may read by id.
      if (!req.user || (req.user.role !== 'admin' && post.authorId !== String(req.user._id))) {
        throw new HttpError(403, 'Forbidden: You can only edit your own posts');
      }
    } else {
      const now = Date.now();
      const isFutureScheduled =
        post.status === 'scheduled' && post.publishAt && new Date(post.publishAt).getTime() > now;
      const isDraft = post.status === 'draft';
      if (isDraft || isFutureScheduled) {
        const isOwner = req.user && String(req.user._id) === post.authorId;
        const isAdmin = req.user && req.user.role === 'admin';
        if (!isOwner && !isAdmin) throw new HttpError(404, 'Post not found');
      }
    }

    const author = await User.findById(post.authorId).lean();
    return res.json({
      ...serialize(post),
      author: authorizeFallback(author),
    });
  })
);

function authorizeFallback(author) {
  if (!author) return { name: 'Editorial Desk', bio: 'Chronicle Staff Writer' };
  return {
    id: String(author._id),
    name: author.name,
    email: author.email,
    role: author.role,
    bio: author.bio,
    avatarUrl: author.avatarUrl,
  };
}

// POST /api/posts/:slugOrId/view
router.post(
  '/:slugOrId/view',
  asyncHandler(async (req, res) => {
    const { slugOrId } = req.params;
    const post = await Post.findOneAndUpdate(
      { $or: [{ slug: slugOrId }, { _id: slugOrId }] },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    );
    if (!post) throw new HttpError(404, 'Post not found');
    return res.json({ views: post.views });
  })
);

// POST /api/posts/:id/like
router.post(
  '/:id/like',
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) throw new HttpError(401, 'Must be logged in to like');
    const userId = String(req.user._id);
    const post = await Post.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });
    if (!post) throw new HttpError(404, 'Post not found');

    const hasLiked = post.likes.includes(userId);
    post.likes = hasLiked ? post.likes.filter((id) => id !== userId) : [...post.likes, userId];
    await post.save();

    return res.json({ likes: post.likes, hasLiked: !hasLiked });
  })
);

// POST /api/posts/:id/bookmark
router.post(
  '/:id/bookmark',
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) throw new HttpError(401, 'Must be logged in to bookmark');
    const postId = req.params.id;
    const post = await Post.findOne({ $or: [{ _id: postId }, { slug: postId }] });
    if (!post) throw new HttpError(404, 'Post not found');

    const targetId = String(post._id);
    const hasBookmarked = req.user.bookmarks.includes(targetId);
    req.user.bookmarks = hasBookmarked
      ? req.user.bookmarks.filter((id) => id !== targetId)
      : [...req.user.bookmarks, targetId];
    await req.user.save();

    return res.json({ bookmarks: req.user.bookmarks, hasBookmarked: !hasBookmarked });
  })
);

// POST /api/posts
router.post(
  '/',
  optionalAuth,
  asyncHandler(async (req, res) => {
    if (!req.user || (req.user.role !== 'author' && req.user.role !== 'admin')) {
      throw new HttpError(403, 'Unauthorized to create posts');
    }

    const body = req.body || {};
    const slug = body.slug ? slugify(body.slug) : slugify(body.title || '') || `story-${Date.now()}`;

    const conflict = await Post.exists({ slug });
    if (conflict) {
      throw new HttpError(409, `Slug taken, try ${slug}-2`, {
        conflict: true,
        suggestedSlug: `${slug}-2`,
      });
    }

    const now = new Date();
    const status = normaliseStatus(body.status);
    const publishAt = status === 'scheduled' && body.publishAt ? new Date(body.publishAt) : null;
    const publishedAt = status === 'published' ? now : null;

    const post = await Post.create({
      authorId: String(req.user._id),
      title: body.title || 'Untitled',
      slug,
      content: body.content || '',
      excerpt: body.excerpt || '',
      coverUrl: body.coverUrl || '',
      categories: Array.isArray(body.categories) ? body.categories : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      status,
      publishAt,
      publishedAt,
      featured: false,
      sortDate: publishedAt || publishAt || now,
      views: 0,
      likes: [],
    });

    return res.status(201).json(serialize(post));
  })
);

function normaliseStatus(status) {
  return ['draft', 'published', 'scheduled'].includes(status) ? status : 'draft';
}

// PUT /api/posts/:id
router.put(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new HttpError(404, 'Post not found');

    if (!req.user || (req.user.role !== 'admin' && post.authorId !== String(req.user._id))) {
      throw new HttpError(403, 'Forbidden');
    }

    const body = req.body || {};

    if (body.slug && body.slug !== post.slug) {
      const nextSlug = slugify(body.slug);
      const conflict = await Post.exists({ slug: nextSlug, _id: { $ne: post._id } });
      if (conflict) {
        throw new HttpError(409, `Slug taken, try ${nextSlug}-2`, {
          conflict: true,
          suggestedSlug: `${nextSlug}-2`,
        });
      }
      post.slug = nextSlug;
    }

    const editable = ['title', 'content', 'excerpt', 'coverUrl', 'categories', 'tags', 'status', 'publishAt'];
    for (const field of editable) {
      if (body[field] !== undefined) post[field] = body[field];
    }

    if (body.status !== undefined) post.status = normaliseStatus(body.status);

    if (post.status === 'published' && !post.publishedAt) post.publishedAt = new Date();
    if (post.status !== 'scheduled') post.publishAt = null;

    post.sortDate = post.publishedAt || post.publishAt || post.createdAt || new Date();
    await post.save();

    return res.json(serialize(post));
  })
);

// DELETE /api/posts/:id
router.delete(
  '/:id',
  optionalAuth,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) throw new HttpError(404, 'Post not found');

    if (!req.user || (req.user.role !== 'admin' && post.authorId !== String(req.user._id))) {
      throw new HttpError(403, 'Forbidden');
    }

    await post.deleteOne();
    return res.json({ success: true, id: req.params.id });
  })
);

// GET /api/posts/:id/comments
router.get(
  '/:id/comments',
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: 1 }).lean();
    const userIds = [...new Set(comments.map((c) => c.userId))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const byId = new Map(users.map((u) => [String(u._id), u]));

    return res.json({
      comments: comments.map((comment) => {
        const author = byId.get(comment.userId);
        return {
          ...serialize(comment),
          user: author
            ? {
                id: String(author._id),
                name: author.name,
                role: author.role,
                bio: author.bio,
                avatarUrl: author.avatarUrl,
              }
            : { name: 'Anonymous' },
        };
      }),
    });
  })
);

export default router;
