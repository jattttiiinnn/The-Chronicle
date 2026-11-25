import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminComments, approveComment } from '../api/admin.js';
import { deleteComment } from '../api/comments.js';
import { useToast } from '../components/ui/Toast.jsx';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { MarkdownRenderer } from '../components/post/MarkdownRenderer.jsx';
import { IconCheck, IconTrash } from '../components/ui/Icons.jsx';

export default function AdminCommentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const statusTab = searchParams.get('status') || 'pending';
  const searchQuery = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const isSimulatedError = searchParams.get('_error') === 'true';

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Sync search input with URL
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

  // Query comments
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-comments', { status: statusTab, q: searchQuery, page: currentPage, error: isSimulatedError }],
    queryFn: () =>
      getAdminComments({
        status: statusTab,
        q: searchQuery || undefined,
        page: currentPage,
        limit: 10,
        _error: isSimulatedError ? 'true' : undefined
      }),
    keepPreviousData: true
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (commentId) => approveComment(commentId),
    onSuccess: (updatedComment) => {
      toast.success('Comment approved and published to the journal.');
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to approve comment.');
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: (result) => {
      if (result?.tombstoned) {
        toast.info('Comment removed with tombstone placeholder preserved for thread replies.');
      } else {
        toast.success('Comment deleted permanently.');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setCommentToDelete(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to remove comment.');
      setCommentToDelete(null);
    }
  });

  const handleTabChange = (status) => {
    const next = new URLSearchParams(searchParams);
    if (status === 'pending') {
      next.delete('status');
    } else {
      next.set('status', status);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    const next = new URLSearchParams();
    setSearchParams(next);
  };

  const comments = data?.comments || [];
  const counts = data?.counts || { pending: 0, approved: 0, all: 0 };
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const diff = (Date.now() - new Date(isoString).getTime()) / 1000;
    if (diff < 60) return 'JUST NOW';
    if (diff < 3600) return `${Math.floor(diff / 60)}M AGO`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}H AGO`;
    return `${Math.floor(diff / 86400)}D AGO`;
  };

  return (
    <div className="space-y-6">
      <Seo title="Commentary Moderation — Admin" noindex={true} />

      {/* Screen Reader Live Region */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading
          ? 'Loading commentary moderation queue'
          : `${pagination.total} comments in queue. Page ${currentPage} of ${pagination.totalPages}.`}
      </div>

      {/* Header Row */}
      <div className="border-b border-rule pb-4">
        <span className="font-mono text-xs uppercase tracking-meta text-destructive block mb-1">
          COMMUNITY & DISCOURSE
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink">
            Reader Commentary Queue
          </h1>
          <span className="font-mono text-xs text-ink-soft uppercase tracking-meta">
            {counts.pending} pending moderation
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Status Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Debounced Search */}
        <div className="relative w-full md:w-80">
          <input
            id="comment-search-input"
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search comment or author..."
            aria-label="Search comments by body or author"
            className="w-full bg-paper border border-rule px-3 py-2 text-sm text-ink rounded-[2px] font-sans placeholder:text-ink-soft/60 focus:outline-none focus:border-ink transition-colors"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-soft hover:text-ink"
              aria-label="Clear search query"
            >
              ×
            </button>
          )}
        </div>

        {/* Status Filter Tabs with Live Counts */}
        <div
          role="tablist"
          aria-label="Filter comments by status"
          className="flex items-center gap-1 font-mono text-xs uppercase tracking-meta overflow-x-auto no-scrollbar"
        >
          {[
            { id: 'pending', label: 'Pending', count: counts.pending },
            { id: 'approved', label: 'Approved', count: counts.approved },
            { id: 'all', label: 'All', count: counts.all }
          ].map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-[2px] transition-colors border flex items-center gap-2 ${
                  isActive
                    ? 'bg-ink text-paper border-ink font-semibold'
                    : 'bg-paper text-ink-soft hover:text-ink border-rule'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[0.625rem] px-1 py-0.2 rounded-full ${
                    isActive ? 'bg-paper text-ink' : 'bg-paper-2 text-ink-soft'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 border border-rule bg-paper space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State with Retry */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to Load Commentary"
          message={error?.response?.data?.message || error?.message || 'Unable to retrieve comments queue.'}
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
      {!isLoading && !isError && comments.length === 0 && (
        <EmptyState
          title="Queue Empty"
          description={
            statusTab === 'pending'
              ? 'No reader commentary is currently awaiting moderation.'
              : 'No comments found matching your active criteria.'
          }
          actionLabel={searchQuery ? 'Reset Search' : undefined}
          onAction={handleResetFilters}
        />
      )}

      {/* Comments List */}
      {!isLoading && !isError && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isPending = !comment.isApproved && !comment.isDeleted;
            const isRemoved = comment.isDeleted;
            const isApproved = comment.isApproved && !comment.isDeleted;

            return (
              <div
                key={comment.id}
                className="p-5 border border-rule bg-paper rounded-[2px] transition-colors hover:border-ink/40 space-y-4"
              >
                {/* Meta Row: Author, Status, Post link, Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rule/60 text-xs">
                  <div className="flex items-center gap-3">
                    {/* Author Avatar & Name */}
                    {comment.author?.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-rule shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-mono text-[0.625rem] uppercase font-bold text-ink-soft shrink-0">
                        {comment.author?.name?.charAt(0) || 'R'}
                      </div>
                    )}
                    <span className="font-serif font-bold text-ink">
                      {comment.author?.name || 'Anonymous'}
                    </span>
                    <span className="font-mono text-[0.6875rem] text-ink-soft hidden sm:inline">
                      ({comment.author?.email || 'reader'})
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`font-mono text-[0.625rem] uppercase tracking-meta px-2 py-0.5 border rounded-[2px] ${
                        isPending
                          ? 'border-accent text-accent font-semibold'
                          : isApproved
                          ? 'border-rule text-ink-soft'
                          : 'border-destructive text-destructive font-medium'
                      }`}
                    >
                      {isPending
                        ? 'AWAITING APPROVAL'
                        : isApproved
                        ? 'APPROVED'
                        : 'REMOVED'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[0.6875rem] text-ink-soft uppercase tracking-meta">
                    <span title={comment.createdAt}>
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                    <span>•</span>
                    <Link
                      to={`/posts/${comment.post?.slug}`}
                      className="text-accent hover:underline line-clamp-1 max-w-[200px]"
                      title={`View Story: ${comment.post?.title}`}
                    >
                      On: {comment.post?.title || 'Story'}
                    </Link>
                  </div>
                </div>

                {/* Comment Body Rendered through shared MarkdownRenderer in compact mode */}
                <div className="font-serif text-sm text-ink leading-relaxed prose-sm pl-1 border-l-2 border-rule">
                  <MarkdownRenderer content={comment.body} compact={true} />
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {/* Approve Button (Visible for pending only) */}
                  {isPending && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => approveMutation.mutate(comment.id)}
                      disabled={approveMutation.isLoading || deleteMutation.isLoading}
                      className="flex items-center gap-1.5"
                    >
                      <IconCheck className="w-3.5 h-3.5" />
                      {approveMutation.isLoading ? 'Approving...' : 'Approve'}
                    </Button>
                  )}

                  {/* Remove Button */}
                  {!isRemoved && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommentToDelete(comment)}
                      disabled={approveMutation.isLoading || deleteMutation.isLoading}
                      className="text-destructive hover:bg-destructive/10 flex items-center gap-1.5"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

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
        </div>
      )}

      {/* Remove Comment Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(commentToDelete)}
        onClose={() => setCommentToDelete(null)}
        onConfirm={() => {
          if (commentToDelete) {
            deleteMutation.mutate(commentToDelete.id);
          }
        }}
        title="Remove Comment"
        message={`Are you sure you want to remove this comment by "${commentToDelete?.author?.name || 'Reader'}"? If it has replies, a moderator placeholder will be retained to keep the thread intact.`}
        confirmText="Remove Comment"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
}
