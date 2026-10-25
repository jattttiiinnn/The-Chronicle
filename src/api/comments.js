import { apiClient } from './client.js';

/**
 * Comments API contract
 * Endpoints:
 * - GET /api/posts/:id/comments
 * - POST /api/comments
 * - DELETE /api/comments/:id
 * - PATCH /api/admin/comments/:id/approve (TODO(backend): approve pending comment)
 */

export async function getComments(postId) {
  const response = await apiClient.get(`/api/posts/${postId}/comments`);
  return response.data;
}

export async function createComment(commentData) {
  const response = await apiClient.post('/api/comments', commentData);
  return response.data;
}

export async function deleteComment(id) {
  const response = await apiClient.delete(`/api/comments/${id}`);
  return response.data;
}

export async function approveComment(id) {
  const response = await apiClient.patch(`/api/admin/comments/${id}/approve`);
  return response.data;
}
