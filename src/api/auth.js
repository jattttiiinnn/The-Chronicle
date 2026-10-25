import { apiClient } from './client.js';

/**
 * Auth API endpoints
 * TODO(backend): Verify auth response shape matches { token, user: { id, name, email, role, bio, avatarUrl } }
 */

export async function login(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials);
  return response.data;
}

export async function register(userData) {
  const response = await apiClient.post('/api/auth/register', userData);
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
}
