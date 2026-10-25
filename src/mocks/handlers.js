import { mockUsers, mockPosts, mockComments } from './data.js';

// In-memory / localStorage store
const STORAGE_PREFIX = 'chronicle_mock_';

function getStorage(key, fallback) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {}
}

const MOCK_VERSION = 'v5_stage3_longform_800';
try {
  const storedVersion = localStorage.getItem(STORAGE_PREFIX + 'version');
  if (storedVersion !== MOCK_VERSION) {
    localStorage.setItem(STORAGE_PREFIX + 'version', MOCK_VERSION);
    localStorage.setItem(STORAGE_PREFIX + 'posts', JSON.stringify(mockPosts));
    localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(mockUsers));
    localStorage.setItem(STORAGE_PREFIX + 'comments', JSON.stringify(mockComments));
  }
} catch (e) {}

let posts = getStorage('posts', mockPosts);
let users = getStorage('users', mockUsers);
let comments = getStorage('comments', mockComments);
let bookmarks = getStorage('bookmarks', ['post_1']);

/**
 * Custom Mock Router matching Section 11
 */
export async function handleMockRequest(config) {
  const url = new URL(config.url, 'http://localhost');
  const pathname = url.pathname;
  const method = (config.method || 'get').toUpperCase();

  // Combine query string parameters and Axios config.params
  const mergedParams = new URLSearchParams(url.search);
  if (config.params) {
    if (config.params instanceof URLSearchParams) {
      for (const [key, val] of config.params.entries()) {
        mergedParams.set(key, val);
      }
    } else if (typeof config.params === 'object') {
      for (const [key, val] of Object.entries(config.params)) {
        if (val !== undefined && val !== null) {
          mergedParams.set(key, String(val));
        }
      }
    }
  }

  // Throttle simulation support
  const throttleMs = parseInt(mergedParams.get('_throttle') || '0', 10);
  const latency = throttleMs > 0 ? throttleMs : 120;
  await new Promise(resolve => setTimeout(resolve, latency));

  // Simulated error support
  if (mergedParams.get('_error') === 'true' || config.headers?.['X-Mock-Error'] === 'true') {
    const error = new Error('Simulated upstream gateway transmission failure.');
    error.response = {
      data: { message: 'Simulated upstream gateway transmission failure.' },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config
    };
    throw error;
  }

  // Extract auth token
  const authHeader = config.headers?.Authorization || config.headers?.authorization;
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  const currentUser = users.find(u => u.id === token) || null;

  // Helpers
  const jsonResponse = (data, status = 200) => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'content-type': 'application/json' },
    config
  });

  const errorResponse = (message, status = 400) => {
    const error = new Error(message);
    error.response = {
      data: { message },
      status,
      statusText: status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Error',
      headers: {},
      config
    };
    throw error;
  };

  // --- AUTH ENDPOINTS ---
  // POST /api/auth/login
  if (pathname === '/api/auth/login' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    const user = users.find(u => u.email.toLowerCase() === (body.email || '').toLowerCase());
    if (!user) {
      return errorResponse('Invalid email or password.', 401);
    }
    return jsonResponse({
      token: user.id, // In mock, userId acts as bearer token
      user
    });
  }

  // GET /api/auth/me
  if (pathname === '/api/auth/me' && method === 'GET') {
    if (!currentUser) return errorResponse('Unauthorized', 401);
    return jsonResponse({ user: currentUser });
  }

  // POST /api/auth/register
  if (pathname === '/api/auth/register' && method === 'POST') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    const newUser = {
      id: `usr_${Date.now()}`,
      name: body.name || 'New Reader',
      email: body.email,
      role: 'reader',
      bio: body.bio || '',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`
    };
    users.push(newUser);
    setStorage('users', users);
    return jsonResponse({ token: newUser.id, user: newUser }, 201);
  }

  // --- POSTS ENDPOINTS ---
  // GET /api/posts?page=&category=&tag=&search=&status=&authorId=&sort=
  if (pathname === '/api/posts' && method === 'GET') {
    const page = parseInt(mergedParams.get('page') || '1', 10);
    const limit = parseInt(mergedParams.get('limit') || '8', 10);
    const category = mergedParams.get('category')?.toLowerCase().trim();
    const tag = mergedParams.get('tag')?.toLowerCase().trim().replace(/^#/, '');
    const search = mergedParams.get('search')?.toLowerCase().trim();
    const status = mergedParams.get('status')?.toLowerCase().trim();
    const authorId = mergedParams.get('authorId');
    const sort = mergedParams.get('sort')?.toLowerCase().trim();

    let filtered = [...posts];

    // Author filter (for Dashboard or Author profile)
    if (authorId) {
      filtered = filtered.filter(p => p.authorId === authorId);
    }

    // Status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    } else if (!status && !authorId) {
      // Public feed: only published posts or scheduled posts whose publish time has arrived
      const now = new Date().getTime();
      filtered = filtered.filter(p => {
        if (p.status === 'published') return true;
        if (p.status === 'scheduled' && p.publishAt && new Date(p.publishAt).getTime() <= now) {
          return true;
        }
        return false;
      });
    }

    if (category) {
      filtered = filtered.filter(p =>
        p.categories && p.categories.some(c => c.toLowerCase() === category)
      );
    }

    if (tag) {
      filtered = filtered.filter(p =>
        p.tags && p.tags.some(t => t.toLowerCase() === tag)
      );
    }

    if (search) {
      filtered = filtered.filter(p => {
        const titleMatch = p.title && p.title.toLowerCase().includes(search);
        const excerptMatch = p.excerpt && p.excerpt.toLowerCase().includes(search);
        const tagsMatch = p.tags && p.tags.some(t => t.toLowerCase().includes(search));
        return Boolean(titleMatch || excerptMatch || tagsMatch);
      });
    }

    // Sorting
    if (sort === 'views') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.publishAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.publishAt || b.createdAt || 0).getTime();
        return dateA - dateB;
      });
    } else {
      // Default: newest first
      filtered.sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.publishAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.publishedAt || b.publishAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return jsonResponse({
      posts: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  }

  // GET /api/posts/:slugOrId
  const singlePostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (singlePostMatch && method === 'GET') {
    const slugOrId = singlePostMatch[1];
    // First try exact ID match (author/admin editor lookup)
    const isIdQuery = slugOrId.startsWith('post_');
    const post = posts.find(p => isIdQuery ? p.id === slugOrId : (p.slug === slugOrId || p.id === slugOrId));
    if (!post) return errorResponse('Post not found', 404);

    // If fetched by ID (editor flow), verify author ownership or admin role
    if (isIdQuery) {
      if (!currentUser || (currentUser.role !== 'admin' && post.authorId !== currentUser.id)) {
        return errorResponse('Forbidden: You can only edit your own posts', 403);
      }
      const author = users.find(u => u.id === post.authorId);
      return jsonResponse({
        ...post,
        author: author || { name: 'Editorial Desk', bio: 'Chronicle Staff Writer' }
      });
    }

    // Public slug-based lookup: check draft & future-scheduled permissions
    const now = new Date().getTime();
    const isFutureScheduled = post.status === 'scheduled' && post.publishAt && new Date(post.publishAt).getTime() > now;
    const isDraft = post.status === 'draft';

    if (isDraft || isFutureScheduled) {
      const isOwner = currentUser && currentUser.id === post.authorId;
      const isAdmin = currentUser && currentUser.role === 'admin';
      if (!isOwner && !isAdmin) {
        return errorResponse('Post not found', 404);
      }
    }

    const author = users.find(u => u.id === post.authorId);
    return jsonResponse({
      ...post,
      author: author || { name: 'Editorial Desk', bio: 'Chronicle Staff Writer' }
    });
  }

  // POST /api/posts/:slug/view
  const viewPostMatch = pathname.match(/^\/api\/posts\/([^/]+)\/view$/);
  if (viewPostMatch && method === 'POST') {
    const slugOrId = viewPostMatch[1];
    const post = posts.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (post) {
      post.views = (post.views || 0) + 1;
      setStorage('posts', posts);
      return jsonResponse({ views: post.views });
    }
    return errorResponse('Post not found', 404);
  }

  // POST /api/posts/:id/like
  const likePostMatch = pathname.match(/^\/api\/posts\/([^/]+)\/like$/);
  if (likePostMatch && method === 'POST') {
    if (!currentUser) return errorResponse('Must be logged in to like', 401);
    const postId = likePostMatch[1];
    const post = posts.find(p => p.id === postId || p.slug === postId);
    if (!post) return errorResponse('Post not found', 404);

    const hasLiked = post.likes.includes(currentUser.id);
    if (hasLiked) {
      post.likes = post.likes.filter(id => id !== currentUser.id);
    } else {
      post.likes.push(currentUser.id);
    }
    setStorage('posts', posts);
    return jsonResponse({ likes: post.likes, hasLiked: !hasLiked });
  }

  // POST /api/posts/:id/bookmark (TODO backend fallback)
  const bookmarkPostMatch = pathname.match(/^\/api\/posts\/([^/]+)\/bookmark$/);
  if (bookmarkPostMatch && method === 'POST') {
    if (!currentUser) return errorResponse('Must be logged in to bookmark', 401);
    const postId = bookmarkPostMatch[1];
    const hasBookmarked = bookmarks.includes(postId);
    if (hasBookmarked) {
      bookmarks = bookmarks.filter(id => id !== postId);
    } else {
      bookmarks.push(postId);
    }
    setStorage('bookmarks', bookmarks);
    return jsonResponse({ bookmarks, hasBookmarked: !hasBookmarked });
  }

  // GET /api/bookmarks
  if (pathname === '/api/bookmarks' && method === 'GET') {
    if (!currentUser) return errorResponse('Unauthorized', 401);
    const bookmarkedPosts = posts.filter(p => bookmarks.includes(p.id));
    return jsonResponse({ posts: bookmarkedPosts });
  }

  // POST /api/posts
  if (pathname === '/api/posts' && method === 'POST') {
    if (!currentUser || (currentUser.role !== 'author' && currentUser.role !== 'admin')) {
      return errorResponse('Unauthorized to create posts', 403);
    }
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    const slug = body.slug || (body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `story-${Date.now()}`);

    // Check slug conflict
    if (posts.some(p => p.slug === slug)) {
      return errorResponse({
        message: `Slug taken, try ${slug}-2`,
        conflict: true,
        suggestedSlug: `${slug}-2`
      }, 409);
    }

    const newPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      title: body.title || 'Untitled',
      slug,
      content: body.content || '',
      excerpt: body.excerpt || '',
      coverUrl: body.coverUrl || '',
      categories: body.categories || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      publishAt: body.status === 'scheduled' ? body.publishAt : null,
      featured: false,
      publishedAt: body.status === 'published' ? new Date().toISOString() : null,
      views: 0,
      likes: []
    };
    posts.unshift(newPost);
    setStorage('posts', posts);
    return jsonResponse(newPost, 201);
  }

  // PUT /api/posts/:id
  const updatePostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (updatePostMatch && method === 'PUT') {
    const id = updatePostMatch[1];
    const post = posts.find(p => p.id === id);
    if (!post) return errorResponse('Post not found', 404);
    if (!currentUser || (currentUser.role !== 'admin' && post.authorId !== currentUser.id)) {
      return errorResponse('Forbidden', 403);
    }
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};

    // Check slug conflict on update
    if (body.slug && body.slug !== post.slug) {
      if (posts.some(p => p.id !== id && p.slug === body.slug)) {
        return errorResponse({
          message: `Slug taken, try ${body.slug}-2`,
          conflict: true,
          suggestedSlug: `${body.slug}-2`
        }, 409);
      }
    }

    Object.assign(post, body);
    if (body.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date().toISOString();
    }
    if (body.status !== 'scheduled') {
      post.publishAt = null;
    }
    setStorage('posts', posts);
    return jsonResponse(post);
  }

  // DELETE /api/posts/:id
  const deletePostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (deletePostMatch && method === 'DELETE') {
    const id = deletePostMatch[1];
    const post = posts.find(p => p.id === id);
    if (!post) return errorResponse('Post not found', 404);
    if (!currentUser || (currentUser.role !== 'admin' && post.authorId !== currentUser.id)) {
      return errorResponse('Forbidden', 403);
    }
    posts = posts.filter(p => p.id !== id);
    setStorage('posts', posts);
    return jsonResponse({ success: true, id });
  }

  // POST /api/uploads/image
  if (pathname === '/api/uploads/image' && method === 'POST') {
    if (!currentUser) return errorResponse('Unauthorized', 401);

    // Validate uploaded file if present in FormData
    const formData = config.data;
    if (formData && typeof formData.get === 'function') {
      const file = formData.get('image');
      if (file) {
        const name = (file.name || '').toLowerCase();
        const type = (file.type || '').toLowerCase();

        // Strictly reject SVG and non-images
        if (name.endsWith('.svg') || type.includes('svg') || (!type.startsWith('image/') && type !== '')) {
          return errorResponse('Invalid file type. SVG and non-images are strictly prohibited.', 400);
        }

        // Validate allowed MIME types: jpeg, png, webp
        if (type && !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(type)) {
          return errorResponse('Invalid image format. Allowed formats: JPEG, PNG, WebP.', 400);
        }

        // Size limit: 5 MB (5 * 1024 * 1024 bytes)
        if (file.size && file.size > 5 * 1024 * 1024) {
          return errorResponse('File size exceeds the 5MB maximum limit.', 400);
        }
      }
    }

    return jsonResponse({
      secure_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
      public_id: `img_${Date.now()}`
    }, 201);
  }

  // --- COMMENTS ENDPOINTS ---
  // GET /api/posts/:id/comments
  const postCommentsMatch = pathname.match(/^\/api\/posts\/([^/]+)\/comments$/);
  if (postCommentsMatch && method === 'GET') {
    const postId = postCommentsMatch[1];
    const postComments = comments
      .filter(c => c.postId === postId)
      .map(c => ({
        ...c,
        user: users.find(u => u.id === c.userId) || { name: 'Anonymous' }
      }));
    return jsonResponse({ comments: postComments });
  }

  // POST /api/comments
  if (pathname === '/api/comments' && method === 'POST') {
    if (!currentUser) return errorResponse('Must be logged in to comment', 401);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    const newComment = {
      id: `cmt_${Date.now()}`,
      postId: body.postId,
      userId: currentUser.id,
      parentId: body.parentId || null,
      body: body.body,
      isApproved: currentUser.role === 'admin' || currentUser.role === 'author', // authors/admins auto-approved
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    setStorage('comments', comments);
    return jsonResponse({
      ...newComment,
      user: currentUser
    }, 201);
  }

  // DELETE /api/comments/:id
  const deleteCommentMatch = pathname.match(/^\/api\/comments\/([^/]+)$/);
  if (deleteCommentMatch && method === 'DELETE') {
    const commentId = deleteCommentMatch[1];
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return errorResponse('Comment not found', 404);
    if (!currentUser || (currentUser.role !== 'admin' && comment.userId !== currentUser.id)) {
      return errorResponse('Forbidden', 403);
    }
    comments = comments.filter(c => c.id !== commentId && c.parentId !== commentId);
    setStorage('comments', comments);
    return jsonResponse({ success: true, id: commentId });
  }

  // PATCH /api/admin/comments/:id/approve (TODO backend fallback)
  const approveCommentMatch = pathname.match(/^\/api\/admin\/comments\/([^/]+)\/approve$/);
  if (approveCommentMatch && method === 'PATCH') {
    if (!currentUser || currentUser.role !== 'admin') return errorResponse('Admin only', 403);
    const commentId = approveCommentMatch[1];
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return errorResponse('Comment not found', 404);
    comment.isApproved = true;
    setStorage('comments', comments);
    return jsonResponse(comment);
  }

  // --- ADMIN USERS ENDPOINTS ---
  // GET /api/admin/users
  if (pathname === '/api/admin/users' && method === 'GET') {
    if (!currentUser || currentUser.role !== 'admin') return errorResponse('Admin only', 403);
    return jsonResponse({ users });
  }

  // PATCH /api/admin/users/:id/role
  const userRoleMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)\/role$/);
  if (userRoleMatch && method === 'PATCH') {
    if (!currentUser || currentUser.role !== 'admin') return errorResponse('Admin only', 403);
    const userId = userRoleMatch[1];
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    const user = users.find(u => u.id === userId);
    if (!user) return errorResponse('User not found', 404);
    user.role = body.role;
    setStorage('users', users);
    return jsonResponse(user);
  }

  // PATCH /api/admin/posts/:id/featured (TODO backend fallback)
  const featuredPostMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)\/featured$/);
  if (featuredPostMatch && method === 'PATCH') {
    if (!currentUser || currentUser.role !== 'admin') return errorResponse('Admin only', 403);
    const postId = featuredPostMatch[1];
    const post = posts.find(p => p.id === postId);
    if (!post) return errorResponse('Post not found', 404);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {};
    post.featured = typeof body.featured === 'boolean' ? body.featured : !post.featured;
    setStorage('posts', posts);
    return jsonResponse(post);
  }

  // Default 404 for unmatched mock route
  return errorResponse(`Mock handler not found for ${method} ${pathname}`, 404);
}
