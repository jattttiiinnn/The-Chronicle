import { useQuery } from '@tanstack/react-query';
import { getPosts, getPostBySlug } from '../../api/posts.js';

export function usePosts({ page = 1, limit = 8, category, tag, search, status, _error, _throttle } = {}) {
  return useQuery({
    queryKey: ['posts', { page, limit, category, tag, search, status, _error, _throttle }],
    queryFn: () => getPosts({ page, limit, category, tag, search, status, _error, _throttle }),
    keepPreviousData: true,
  });
}

export function usePost(slug) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 1;
    },
  });
}
