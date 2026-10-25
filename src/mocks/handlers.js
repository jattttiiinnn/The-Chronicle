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

let posts = getStorage('posts', mockPosts);
let users = getStorage('users', mockUsers);
let comments = getStorage('comments', mockComments);
let bookmarks = getStorage('bookmarks', ['post_1']);

/**
 * Custom Mock Router matching Section 11
 */
export async function handleMockRequest(config) {
  // Simulate 120ms network latency for realism
  await new Promise(resolve => setTimeout(resolve, 120));

  const url = new URL(config.url, 'http://localhost');
  const pathname = url.pathname;
  const method = (config.method || 'get').toUpperCase();
  const searchParams = url.searchParams;

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
  // GET /api/posts?page=&category=&tag=&search=
  if (pathname === '/api/posts' && method === 'GET') {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const category = searchParams.get('category')?.toLowerCase();
    const tag = searchParams.get('tag')?.toLowerCase();
    const search = searchParams.get('search')?.toLowerCase();
    const status = searchParams.get('status');

    let filtered = [...posts];

    // Status filter (default to published for public queries)
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    } else {
      // By default, public list only shows published
      filtered = filtered.filter(p => p.status === 'published');
    }

    if (category) {
      filtered = filtered.filter(p => p.categories.some(c => c.toLowerCase() === category));
    }

    if (tag) {
      filtered = filtered.filter(p => p.tags.some(t => t.toLowerCase() === tag));
    }

    if (search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.excerpt.toLowerCase().includes(search) ||
        p.content.toLowerCase().includes(search)
      );
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

  // GET /api/posts/:slug
  const singlePostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
  if (singlePostMatch && method === 'GET') {
    const slugOrId = singlePostMatch[1];
    const post = posts.find(p => p.slug === slugOrId || p.id === slugOrId);
    if (!post) return errorResponse('Post not found', 404);
    const author = users.find(u => u.id === post.authorId);
    return jsonResponse({
      ...post,
      author: author || { name: 'Unknown Author' }
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
    const newPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: body.content || '',
      excerpt: body.excerpt || '',
      coverUrl: body.coverUrl || '',
      categories: body.categories || [],
      tags: body.tags || [],
      status: body.status || 'draft',
      featured: false,
      publishedAt: body.status === 'published' ? new Date().toISOString() : body.publishedAt || null,
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
    Object.assign(post, body);
    if (body.status === 'published' && !post.publishedAt) {
      post.publishedAt = new Date().toISOString();
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
    // In mock, return simulated Cloudinary / S3 URL and public_id
    return jsonResponse({
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
