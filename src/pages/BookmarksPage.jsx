import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBookmarkedPosts } from '../api/posts.js';
import { Seo } from '../components/Seo.jsx';
import { PostCardHorizontal } from '../components/cards/PostCardHorizontal.jsx';
import { AnimatedCard } from '../components/cards/AnimatedCard.jsx';
import { SkeletonPostCard } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';

export default function BookmarksPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarkedPosts,
  });

  const posts = data?.posts || [];

  return (
    <div className="py-8 space-y-10">
      <Seo title="Saved Stories & Bookmarks" />

      {/* Header */}
      <header className="pb-6 border-b border-rule">
        <span className="font-mono text-xs uppercase tracking-meta text-accent">
          READING LIST
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
          <h1 className="type-lead-headline text-ink">
            Saved Stories
          </h1>
          <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">
            {isLoading ? 'SYNCING...' : `${posts.length} ${posts.length === 1 ? 'story' : 'stories'} saved`}
          </span>
        </div>
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 max-w-4xl">
          <SkeletonPostCard variant="horizontal" />
          <SkeletonPostCard variant="horizontal" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Bookmarks Inaccessible"
          message="Could not load your saved dispatches. Please retry."
          onRetry={refetch}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && posts.length === 0 && (
        <EmptyState
          title="No Saved Stories"
          message="You have not added any dispatches to your reading list yet. Click the bookmark ribbon on any story to save it for later."
          actionText="Browse Journal Stories"
          actionHref="/"
        />
      )}

      {/* List of Bookmarked Stories */}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="max-w-4xl divide-y divide-rule">
          {posts.map((post, idx) => (
            <AnimatedCard key={post.id} index={idx}>
              <PostCardHorizontal post={post} />
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
