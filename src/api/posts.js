import { apiClient } from './client.js';

/**
 * Posts API contract
 * Endpoints:
 * - GET /api/posts?page=&category=&tag=&search=
 * - GET /api/posts/:slug
 * - POST /api/posts
 * - PUT /api/posts/:id
 * - DELETE /api/posts/:id
 * - POST /api/posts/:id/like
 * - POST /api/posts/:slug/view (TODO(backend): single view increment)
 * - POST /api/posts/:id/bookmark (TODO(backend): bookmarks)
 * - GET /api/bookmarks (TODO(backend): fetch bookmarks)
 */

export async function getPosts(params = {}) {
  const response = await apiClient.get('/api/posts', { params });
  return response.data;
}

export async function getPostBySlug(slug) {
  const response = await apiClient.get(`/api/posts/${slug}`);
  return response.data;
}

export async function createPost(postData) {
  const response = await apiClient.post('/api/posts', postData);
  return response.data;
}

export async function updatePost(id, postData) {
  const response = await apiClient.put(`/api/posts/${id}`, postData);
  return response.data;
}

export async function deletePost(id) {
  const response = await apiClient.delete(`/api/posts/${id}`);
  return response.data;
}

export async function likePost(id) {
  const response = await apiClient.post(`/api/posts/${id}/like`);
  return response.data;
}

export async function recordPostView(slug) {
  const response = await apiClient.post(`/api/posts/${slug}/view`);
  return response.data;
}

export async function bookmarkPost(id) {
  const response = await apiClient.post(`/api/posts/${id}/bookmark`);
  return response.data;
}

export async function getBookmarkedPosts() {
  const response = await apiClient.get('/api/bookmarks');
  return response.data;
}
