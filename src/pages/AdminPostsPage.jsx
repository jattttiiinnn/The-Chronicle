import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminPosts, toggleFeaturedPost } from '../api/admin.js';
import { deletePost } from '../api/posts.js';
import { useToast } from '../components/ui/Toast.jsx';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { IconEdit, IconTrash, IconEye, IconSparkles } from '../components/ui/Icons.jsx';
import { CATEGORIES } from '../config/site.js';

export default function AdminPostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const statusFilter = searchParams.get('status') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';
  const featuredFilter = searchParams.get('featured') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const isSimulatedError = searchParams.get('_error') === 'true';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [postToDelete, setPostToDelete] = useState(null);

  // Sync search input
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        const next = new URLSearchParams(searchParams);
        if (localSearch.trim()) {
          next.set('q', localSearch.trim());
        } else {
          next.delete('q');
        }
        next.set('page', '1');
        setSearchParams(next, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, searchParams, setSearchParams]);

  // Query posts
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [
      'admin-posts',
      {
        status: statusFilter,
        category: categoryFilter,
        featured: featuredFilter,
        q: searchQuery,
        page: currentPage,
        error: isSimulatedError
      }
    ],
    queryFn: () =>
      getAdminPosts({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        featured: featuredFilter === 'true' ? 'true' : featuredFilter === 'false' ? 'false' : undefined,
        q: searchQuery || undefined,
        page: currentPage,
        limit: 10,
        _error: isSimulatedError ? 'true' : undefined
      }),
    keepPreviousData: true
  });

  // Optimistic Toggle Featured Mutation
  const featuredMutation = useMutation({
    mutationFn: ({ postId, featured }) => toggleFeaturedPost(postId, featured),
    onMutate: async ({ postId, featured }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-posts'] });
      const previousData = queryClient.getQueryData([
        'admin-posts',
        {
          status: statusFilter,
          category: categoryFilter,
          featured: featuredFilter,
          q: searchQuery,
          page: currentPage,
          error: isSimulatedError
        }
      ]);

      queryClient.setQueryData(
        [
          'admin-posts',
          {
            status: statusFilter,
            category: categoryFilter,
            featured: featuredFilter,
            q: searchQuery,
            page: currentPage,
            error: isSimulatedError
          }
        ],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            posts: old.posts.map((p) => (p.id === postId ? { ...p, featured } : p))
          };
        }
      );

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [
            'admin-posts',
            {
              status: statusFilter,
              category: categoryFilter,
              featured: featuredFilter,
              q: searchQuery,
              page: currentPage,
              error: isSimulatedError
            }
          ],
          context.previousData
        );
      }
      const msg = err?.response?.data?.message || err?.message || 'Failed to update featured story status.';
      toast.error(msg);
    },
    onSuccess: (updatedPost) => {
      toast.success(
        updatedPost.featured
          ? `Story "${updatedPost.title}" is now featured on the journal cover.`
          : `Story "${updatedPost.title}" removed from featured cover.`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      toast.success('Manuscript permanently deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setPostToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to delete manuscript.');
      setPostToDelete(null);
    }
  });

  const handleStatusTab = (status) => {
    const next = new URLSearchParams(searchParams);
    if (status === 'all') {
      next.delete('status');
    } else {
      next.set('status', status);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleCategoryFilter = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleFeaturedToggleFilter = (e) => {
    const checked = e.target.checked;
    const next = new URLSearchParams(searchParams);
    if (checked) {
      next.set('featured', 'true');
    } else {
      next.delete('featured');
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    const next = new URLSearchParams();
    setSearchParams(next);
  };

  const posts = data?.posts || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const counts = data?.counts || { all: 0, published: 0, draft: 0, scheduled: 0, featured: 0 };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  return (
    <div className="space-y-6">
      <Seo title="Folio Curations & Featured Stories — Admin" noindex={true} />

      {/* Screen Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? 'Loading folios registry'
          : `${pagination.total} stories in registry. Page ${currentPage} of ${pagination.totalPages}.`}
      </div>

      {/* Header Row */}
      <div className="border-b border-rule pb-4">
        <span className="font-mono text-xs uppercase tracking-meta text-destructive block mb-1">
          CURATION & EDITORIAL
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Master Story Folios
          </h1>
          <div className="flex items-center gap-3 font-mono text-xs text-ink-soft uppercase tracking-meta">
            <span>{counts.published} published</span>
            <span>•</span>
            <span className="text-accent font-semibold">{counts.featured}/3 featured</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <input
            id="post-search-input"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search by story title..."
            aria-label="Search stories by title"
            className="w-full bg-paper border border-rule px-3 py-2 text-sm text-ink rounded-[2px] font-sans placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-soft hover:text-ink"
              aria-label="Clear title search"
            >
              ×
            </button>
          )}
        </div>

        {/* Filters Group: Status Tabs + Category Select + Featured Only Checkbox */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-meta">
          {/* Status Tabs */}
          <div role="tablist" aria-label="Filter posts by status" className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'published', label: 'Published', count: counts.published },
              { id: 'draft', label: 'Draft', count: counts.draft },
              { id: 'scheduled', label: 'Scheduled', count: counts.scheduled }
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleStatusTab(tab.id)}
                  className={`px-3 py-1.5 rounded-[2px] transition-colors border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-ink text-paper border-ink font-semibold'
                      : 'bg-paper text-ink-soft hover:text-ink border-rule'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[0.625rem] opacity-75">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            aria-label="Filter by editorial category"
            className="bg-paper border border-rule px-2.5 py-1.5 rounded-[2px] text-ink focus:outline-none focus:border-ink"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Featured Only Filter */}
          <label className="flex items-center gap-2 cursor-pointer bg-paper border border-rule px-2.5 py-1.5 rounded-[2px] hover:border-ink transition-colors">
            <input
              type="checkbox"
              checked={featuredFilter === 'true'}
              onChange={handleFeaturedToggleFilter}
              className="accent-accent w-3.5 h-3.5"
            />
            <span className="text-ink">Featured Only</span>
          </label>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border border-rule bg-paper space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to Load Stories"
          message={error?.response?.data?.message || error?.message || 'Unable to retrieve editorial folios.'}
          onRetry={() => {
            if (searchParams.get('_error')) {
              const next = new URLSearchParams(searchParams);
              next.delete('_error');
              setSearchParams(next, { replace: true });
            }
            refetch();
          }}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState
          title="No Stories Located"
          description="No story folios match your current search and filter selections."
          actionLabel={searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? 'Reset Filters' : undefined}
          onAction={handleResetFilters}
        />
      )}

      {/* Posts Table (Desktop) */}
      {!isLoading && !isError && posts.length > 0 && (
        <>
          <div className="hidden sm:block border border-rule bg-paper rounded-[2px] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rule bg-paper-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
                  <th scope="col" className="py-3 px-4">Title & Story</th>
                  <th scope="col" className="py-3 px-4">Author</th>
                  <th scope="col" className="py-3 px-4">Category</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-center">Views</th>
                  <th scope="col" className="py-3 px-4">Date</th>
                  <th scope="col" className="py-3 px-4 text-center">Cover Feature</th>
                  <th scope="col" className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-sans text-sm">
                {posts.map((post) => {
                  const isPublished = post.status === 'published';
                  const isFeatured = Boolean(post.featured);

                  return (
                    <tr key={post.id} className="hover:bg-paper-2/50 transition-colors">
                      {/* Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="font-serif font-bold text-ink hover:text-accent transition-colors line-clamp-1 block text-base leading-snug"
                          title={post.title}
                        >
                          {post.title}
                        </Link>
                        <span className="font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
                          slug: {post.slug}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 font-mono text-xs text-ink-soft">
                        <span className="text-ink font-medium">{post.author?.name || 'Staff Writer'}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">
                          {(post.categories || ['Design'])[0]}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono text-[0.6875rem] uppercase tracking-meta px-2 py-0.5 border rounded-[2px] ${
                            post.status === 'published'
                              ? 'border-ink text-ink font-bold'
                              : post.status === 'scheduled'
                              ? 'border-accent text-accent font-semibold'
                              : 'border-rule text-ink-soft'
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-ink">
                        {post.views || 0}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-mono text-xs text-ink-soft whitespace-nowrap">
                        {formatDate(post.publishedAt || post.publishAt || post.createdAt)}
                      </td>

                      {/* Feature Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        {isPublished ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isFeatured}
                            aria-label={`Toggle featured status for ${post.title}`}
                            disabled={featuredMutation.isLoading}
                            onClick={() =>
                              featuredMutation.mutate({
                                postId: post.id,
                                featured: !isFeatured
                              })
                            }
                            className={`px-2.5 py-1 rounded-[2px] font-mono text-[0.6875rem] uppercase tracking-meta border transition-colors inline-flex items-center gap-1.5 ${
                              isFeatured
                                ? 'bg-accent text-white border-accent font-bold'
                                : 'bg-paper text-ink-soft border-rule hover:border-ink'
                            }`}
                          >
                            <IconSparkles className="w-3 h-3" />
                            {isFeatured ? 'Featured' : 'Standard'}
                          </button>
                        ) : (
                          <span
                            className="font-mono text-[0.625rem] text-ink-soft/70 uppercase tracking-meta border border-rule/50 px-2 py-1 rounded-[2px] bg-paper-2 cursor-not-allowed inline-block"
                            title="Only published stories can be featured on the cover"
                          >
                            Published Only
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* View public post */}
                          <Link
                            to={`/posts/${post.slug}`}
                            className="p-1.5 border border-rule hover:border-ink rounded-[2px] text-ink-soft hover:text-ink transition-colors"
                            title="View Story"
                            aria-label={`View story ${post.title}`}
                          >
                            <IconEye className="w-4 h-4" />
                          </Link>

                          {/* Edit story (Admins can edit any post) */}
                          <Link
                            to={`/dashboard/edit/${post.id}`}
                            className="p-1.5 border border-rule hover:border-ink rounded-[2px] text-ink-soft hover:text-ink transition-colors"
                            title="Edit Story as Admin"
                            aria-label={`Edit story ${post.title}`}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Link>

                          {/* Delete story */}
                          <button
                            type="button"
                            onClick={() => setPostToDelete(post)}
                            disabled={deleteMutation.isLoading}
                            className="p-1.5 border border-rule hover:border-destructive hover:text-destructive rounded-[2px] text-ink-soft transition-colors"
                            title="Delete Story"
                            aria-label={`Delete story ${post.title}`}
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Stacked Rows for Mobile */}
          <div className="sm:hidden space-y-4">
            {posts.map((post) => {
              const isPublished = post.status === 'published';
              const isFeatured = Boolean(post.featured);

              return (
                <div
                  key={post.id}
                  className="p-4 border border-rule bg-paper rounded-[2px] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="font-mono text-[0.625rem] uppercase tracking-meta text-accent">
                        {(post.categories || ['Design'])[0]}
                      </span>
                      <Link
                        to={`/posts/${post.slug}`}
                        className="font-serif font-bold text-ink text-base line-clamp-2 block hover:text-accent"
                      >
                        {post.title}
                      </Link>
                      <span className="font-mono text-xs text-ink-soft block">
                        By {post.author?.name || 'Staff Writer'}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[0.6875rem] uppercase tracking-meta px-2 py-0.5 border rounded-[2px] shrink-0 ${
                        post.status === 'published'
                          ? 'border-ink text-ink font-bold'
                          : post.status === 'scheduled'
                          ? 'border-accent text-accent font-semibold'
                          : 'border-rule text-ink-soft'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-rule text-xs font-mono">
                    <span className="text-ink-soft">
                      Views: <strong className="text-ink">{post.views || 0}</strong>
                    </span>

                    {/* Featured Button Mobile */}
                    {isPublished ? (
                      <button
                        type="button"
                        onClick={() =>
                          featuredMutation.mutate({
                            postId: post.id,
                            featured: !isFeatured
                          })
                        }
                        className={`px-2 py-0.5 rounded-[2px] text-[0.625rem] uppercase tracking-meta border ${
                          isFeatured
                            ? 'bg-accent text-white border-accent font-bold'
                            : 'bg-paper text-ink-soft border-rule'
                        }`}
                      >
                        {isFeatured ? '★ Featured' : '☆ Standard'}
                      </button>
                    ) : (
                      <span className="text-[0.625rem] text-ink-soft/70 uppercase">
                        Published Only
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-rule/50">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="px-2.5 py-1 text-xs border border-rule rounded-[2px] text-ink-soft hover:text-ink font-mono uppercase"
                    >
                      View
                    </Link>
                    <Link
                      to={`/dashboard/edit/${post.id}`}
                      className="px-2.5 py-1 text-xs border border-rule rounded-[2px] text-ink-soft hover:text-ink font-mono uppercase"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPostToDelete(post)}
                      className="px-2.5 py-1 text-xs border border-rule hover:border-destructive text-destructive rounded-[2px] font-mono uppercase"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pt-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  const next = new URLSearchParams(searchParams);
                  next.set('page', String(p));
                  setSearchParams(next);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Story Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(postToDelete)}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => {
          if (postToDelete) {
            deleteMutation.mutate(postToDelete.id);
          }
        }}
        title="Delete Story Permanently"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? All article content and revisions will be destroyed.`}
        confirmText="Delete permanently"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
}
