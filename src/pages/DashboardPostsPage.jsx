import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { getPosts, deletePost } from '../api/posts.js';
import { Seo } from '../components/Seo.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { IconEdit, IconTrash, IconPlus, IconEye } from '../components/ui/Icons.jsx';
import { formatDate } from '../utils/date.js';

export default function DashboardPostsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch author posts
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-posts', user?.id, statusFilter, sortBy],
    queryFn: () =>
      getPosts({
        authorId: user?.id,
        status: statusFilter,
        sort: sortBy,
        limit: 100,
      }),
    enabled: Boolean(user?.id),
  });

  const posts = data?.posts || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Story deleted permanently.');
      setDeleteTarget(null);
    },
    onError: (err) => {
      toast.error(err?.message || 'Failed to delete story.');
    },
  });

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge variant="published">PUBLISHED</Badge>;
      case 'scheduled':
        return <Badge variant="scheduled">SCHEDULED</Badge>;
      default:
        return <Badge variant="draft">DRAFT</Badge>;
    }
  };

  const formatDisplayDate = (post) => {
    if (post.status === 'scheduled' && post.publishAt) {
      return `Sched: ${formatDate(post.publishAt)}`;
    }
    if (post.publishedAt) {
      return formatDate(post.publishedAt);
    }
    return formatDate(post.createdAt || post.publishedAt || new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      <Seo title="Author Stories — Back of House" />

      {/* Top Header & New Story Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-rule">
        <div>
          <span className="font-mono text-xs uppercase tracking-meta text-accent">BACK OF HOUSE</span>
          <h1 className="font-display font-bold text-3xl text-ink tracking-tight">Your Stories</h1>
          <p className="font-sans text-sm text-ink-soft mt-1">
            Manage your drafts, dispatches, and scheduled releases.
          </p>
        </div>
        <div>
          <Button
            onClick={() => navigate('/dashboard/new')}
            className="flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            <span>New story</span>
          </Button>
        </div>
      </div>

      {/* Filters and Sorting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 border-b sm:border-b-0 border-rule pb-2 sm:pb-0 overflow-x-auto">
          {['all', 'draft', 'scheduled', 'published'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-meta rounded-[2px] transition-colors whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-ink text-paper font-semibold'
                  : 'text-ink-soft hover:text-ink hover:bg-paper-2'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <label htmlFor="sort-select" className="text-ink-soft uppercase tracking-meta whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-paper border border-rule px-2.5 py-1 text-ink rounded-[2px] focus:outline-none focus:border-ink font-mono text-xs cursor-pointer"
          >
            <option value="newest">Date (Newest)</option>
            <option value="oldest">Date (Oldest)</option>
            <option value="views">Most Views</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : isError ? (
        <ErrorState
          message={error?.message || 'Failed to load stories.'}
          onRetry={refetch}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No stories found"
          description={
            statusFilter === 'all'
              ? 'You have not drafted any stories yet. Start writing today.'
              : `No stories found with status "${statusFilter}".`
          }
          actionLabel="Draft a story"
          onAction={() => navigate('/dashboard/new')}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-rule rounded-[2px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-rule bg-paper-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
                  <th className="py-3 px-4 font-normal">Title</th>
                  <th className="py-3 px-4 font-normal w-32">Status</th>
                  <th className="py-3 px-4 font-normal w-24 text-right">Views</th>
                  <th className="py-3 px-4 font-normal w-36">Date</th>
                  <th className="py-3 px-4 font-normal w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule font-sans text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-paper-2/50 transition-colors">
                    <td className="py-4 px-4 font-serif font-bold text-ink">
                      <Link
                        to={`/dashboard/edit/${post.id}`}
                        className="hover:text-accent transition-colors block line-clamp-1"
                        title={post.title}
                      >
                        {post.title}
                      </Link>
                      <span className="block font-mono text-[0.6875rem] text-ink-soft font-normal mt-0.5">
                        /{post.slug}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-ink-soft text-right whitespace-nowrap">
                      {post.views ?? 0}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-ink-soft whitespace-nowrap">
                      {formatDisplayDate(post)}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/dashboard/edit/${post.id}`}
                          aria-label={`Edit ${post.title}`}
                          className="p-1.5 text-ink-soft hover:text-ink hover:border-ink border border-transparent rounded-[2px] transition-colors"
                        >
                          <IconEdit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          aria-label={`Delete ${post.title}`}
                          className="p-1.5 text-ink-soft hover:text-destructive hover:border-destructive border border-transparent rounded-[2px] transition-colors"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="block md:hidden space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-rule p-4 bg-paper rounded-[2px] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-base text-ink line-clamp-2">
                    <Link to={`/dashboard/edit/${post.id}`} className="hover:text-accent">
                      {post.title}
                    </Link>
                  </h3>
                  {getStatusBadge(post.status)}
                </div>

                <div className="flex items-center justify-between font-mono text-xs text-ink-soft pt-1 border-t border-rule/50">
                  <span>{formatDisplayDate(post)}</span>
                  <span className="flex items-center gap-1">
                    <IconEye className="w-3.5 h-3.5" />
                    {post.views ?? 0} views
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-rule">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/edit/${post.id}`)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <IconEdit className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(post)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Story"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete story"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
