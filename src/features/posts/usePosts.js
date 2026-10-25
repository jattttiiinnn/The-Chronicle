import { useQuery } from '@tanstack/react-query';
import { getPosts, getPostBySlug } from '../../api/posts.js';

export function usePosts({ page = 1, limit = 8, category, tag, search, status } = {}) {
  return useQuery({
    queryKey: ['posts', { page, limit, category, tag, search, status }],
    queryFn: () => getPosts({ page, limit, category, tag, search, status }),
    keepPreviousData: true,
  });
}

export function usePost(slug) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
  });
}
