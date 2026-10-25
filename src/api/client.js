import axios from 'axios';
import { handleMockRequest } from '../mocks/handlers.js';

const baseURL = import.meta.env.VITE_API_URL || '';
export const isMockMode = !baseURL;

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // If no VITE_API_URL is configured, use the mock adapter to fulfill requests
  // while retaining full Axios interceptor pipeline execution
  adapter: isMockMode
    ? async (config) => {
        try {
          return await handleMockRequest(config);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    : undefined,
});

// Request Interceptor: Attach JWT Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chronicle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401 handler clears auth & redirects to login
let onUnauthorizedCallback = null;

export function setOnUnauthorizedCallback(cb) {
  onUnauthorizedCallback = cb;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('chronicle_token');
      localStorage.removeItem('chronicle_user');
      if (typeof onUnauthorizedCallback === 'function') {
        onUnauthorizedCallback();
      } else {
        // Fallback redirection if outside React tree
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?from=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
