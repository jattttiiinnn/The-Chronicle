import { apiClient } from './client.js';

/**
 * Image upload contract
 * Endpoint: POST /api/uploads/image (multipart/form-data)
 * Response: { url, public_id }
 */
export async function uploadImage(file, onProgress) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/api/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });

  return response.data;
}
