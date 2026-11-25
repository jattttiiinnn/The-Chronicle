import { apiClient } from './client.js';

/**
 * Admin API contract (Section 2, 7 & 9.5)
 * All routes require Administrator authorization token (HTTP 401 if unauthenticated, 403 if non-admin)
 *
 * Endpoints:
 * - GET /api/admin/users?q=&role=&page=&limit=
 * - PATCH /api/admin/users/:id/role
 * - GET /api/admin/comments?status=&q=&page=&limit=
 * - PATCH /api/admin/comments/:id/approve (TODO(backend): approve pending comment)
 * - DELETE /api/comments/:id (tombstones if replies exist, hard deletes if leaf)
 * - GET /api/admin/posts?status=&category=&featured=&q=&page=&limit=
 * - PATCH /api/admin/posts/:id/featured (TODO(backend): toggle featured, max 3 limit, published only)
 */

export async function getAdminUsers(params = {}) {
  const response = await apiClient.get('/api/admin/users', { params });
  return response.data;
}

export async function updateUserRole(userId, role) {
  const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
  return response.data;
}

export async function getAdminComments(params = {}) {
  const response = await apiClient.get('/api/admin/comments', { params });
  return response.data;
}

export async function approveComment(commentId) {
  const response = await apiClient.patch(`/api/admin/comments/${commentId}/approve`);
  return response.data;
}

export async function getAdminPosts(params = {}) {
  const response = await apiClient.get('/api/admin/posts', { params });
  return response.data;
}

export async function toggleFeaturedPost(postId, featured) {
  const response = await apiClient.patch(`/api/admin/posts/${postId}/featured`, { featured });
  return response.data;
}
