import { apiClient } from './client.js';

/**
 * Admin API contract
 * Endpoints:
 * - GET /api/admin/users
 * - PATCH /api/admin/users/:id/role
 * - PATCH /api/admin/posts/:id/featured (TODO(backend): featured toggle)
 */

export async function getAdminUsers() {
  const response = await apiClient.get('/api/admin/users');
  return response.data;
}

export async function updateUserRole(userId, role) {
  const response = await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
  return response.data;
}

export async function toggleFeaturedPost(postId, featured) {
  const response = await apiClient.patch(`/api/admin/posts/${postId}/featured`, { featured });
  return response.data;
}
