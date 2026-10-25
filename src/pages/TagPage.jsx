import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { usePosts } from '../features/posts/usePosts.js';
import { Seo } from '../components/Seo.jsx';
import { PostCardHorizontal } from '../components/cards/PostCardHorizontal.jsx';
import { AnimatedCard } from '../components/cards/AnimatedCard.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SkeletonPostCard } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';

export default function TagPage() {
  const { name } = useParams();
  const [searchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const { data, isLoading, isError, refetch } = usePosts({
    tag: name,
    page: currentPage,
    limit: 6,
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination || { page: 1, limit: 6, total: 0, totalPages: 1 };
  const { totalPages, total } = pagination;

  const isOutOfRange = !isLoading && totalPages > 0 && currentPage > totalPages;

  return (
    <div className="py-8 space-y-12">
      <Seo
        title={`#${name} — Tag Index`}
        description={`Read stories and essays tagged with #${name}.`}
      />

      {/* Typographic Header */}
      <header className="pb-6 border-b border-rule">
        <span className="font-mono text-xs uppercase tracking-meta text-accent">
          INDEX TOPIC
        </span>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-1">
          <h1 className="type-lead-headline text-ink">
            Tag / #{name}
          </h1>
          <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">
            {isLoading ? 'INDEXING...' : `${total} ${total === 1 ? 'story' : 'stories'}`}
          </span>
        </div>
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <SkeletonPostCard variant="horizontal" />
          <SkeletonPostCard variant="horizontal" />
          <SkeletonPostCard variant="horizontal" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Tag Index Unavailable"
          message={`Unable to retrieve stories tagged with #${name}.`}
          onRetry={refetch}
        />
      )}

      {/* Out of Range Friendly State */}
      {isOutOfRange && (
        <div className="py-16 text-center space-y-4 border border-rule bg-paper-2 p-8 rounded-[2px] max-w-lg mx-auto">
          <span className="font-mono text-xs uppercase tracking-meta text-destructive">
            OUT OF BOUNDS
          </span>
          <h2 className="font-display font-bold text-2xl text-ink">
            Page {currentPage} Does Not Exist
          </h2>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to={`/tag/${name}`}
              className="px-4 py-2 bg-ink text-paper font-mono text-xs uppercase tracking-meta hover:bg-ink-soft transition-colors rounded-[2px]"
            >
              Return to Page 01
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && !isOutOfRange && posts.length === 0 && (
        <EmptyState
          title={`No stories tagged #${name}`}
          message="No published articles currently carry this index tag."
          actionText="Browse Front Page"
          actionHref="/"
        />
      )}

      {/* Horizontal Story Cards */}
      {!isLoading && !isError && !isOutOfRange && posts.length > 0 && (
        <div className="max-w-4xl divide-y divide-rule">
          {posts.map((post, idx) => (
            <AnimatedCard key={post.id} index={idx}>
              <PostCardHorizontal post={post} />
            </AnimatedCard>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
