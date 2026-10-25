import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { usePosts } from '../features/posts/usePosts.js';
import { Seo } from '../components/Seo.jsx';
import { PostCardLead } from '../components/cards/PostCardLead.jsx';
import { PostCardStandard } from '../components/cards/PostCardStandard.jsx';
import { PostCardCompact } from '../components/cards/PostCardCompact.jsx';
import { AnimatedCard } from '../components/cards/AnimatedCard.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SkeletonPostCard } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { SITE_CONFIG } from '../config/site.js';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const isSimulatedError = searchParams.get('_error') === 'true';
  const throttleMs = searchParams.get('_throttle');

  // We fetch stories for this page (limit 8 per page)
  const { data, isLoading, isError, refetch } = usePosts({
    page: currentPage,
    limit: 8,
    _error: isSimulatedError ? 'true' : undefined,
    _throttle: throttleMs || undefined,
  });

  const handleRetry = () => {
    if (searchParams.get('_error')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('_error');
      setSearchParams(nextParams, { replace: true });
    }
    refetch();
  };

  const posts = data?.posts || [];
  const pagination = data?.pagination || { page: 1, limit: 8, total: 0, totalPages: 1 };
  const { totalPages, total } = pagination;

  // Lead and secondary stories on first page
  const leadPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const secondaryPosts = currentPage === 1 && posts.length > 2 ? [posts[1], posts[2]] : [];
  const feedPosts = currentPage === 1 ? posts.slice(3) : posts;

  // Most Read stories (sorted by views descending from mock dataset)
  const mostReadPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Friendly out-of-range check
  const isOutOfRange = !isLoading && totalPages > 0 && currentPage > totalPages;

  return (
    <div className="space-y-16 py-6">
      <Seo
        title={currentPage > 1 ? `Stories — Page ${currentPage}` : undefined}
        preloadImage={leadPost?.coverUrl || undefined}
      />

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-12">
          <SkeletonPostCard variant="lead" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SkeletonPostCard variant="standard" />
            <SkeletonPostCard variant="standard" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-rule">
            <div className="lg:col-span-8 space-y-8">
              <SkeletonPostCard variant="standard" />
              <SkeletonPostCard variant="standard" />
            </div>
            <div className="lg:col-span-4 space-y-4">
              <SkeletonPostCard variant="compact" />
              <SkeletonPostCard variant="compact" />
              <SkeletonPostCard variant="compact" />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Archive Unavailable"
          message="Unable to communicate with the dispatch service. Please retry."
          onRetry={handleRetry}
        />
      )}

      {/* Out of Range Friendly State */}
      {isOutOfRange && (
        <div className="py-20 text-center space-y-4 border border-rule bg-paper-2 p-8 rounded-[2px] max-w-lg mx-auto">
          <span className="font-mono text-xs uppercase tracking-meta text-destructive">
            OUT OF BOUNDS
          </span>
          <h2 className="font-display font-bold text-2xl text-ink">
            Page {currentPage} Does Not Exist
          </h2>
          <p className="font-serif italic text-sm text-ink-soft">
            The archive currently spans {totalPages} pages ({total} stories total).
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-ink text-paper font-mono text-xs uppercase tracking-meta hover:bg-ink-soft transition-colors rounded-[2px]"
            >
              Return to Page 01
            </Link>
            <Link
              to={`/?page=${totalPages}`}
              className="px-4 py-2 border border-rule text-ink font-mono text-xs uppercase tracking-meta hover:bg-paper transition-colors rounded-[2px]"
            >
              Go to Final Page ({totalPages})
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && !isOutOfRange && posts.length === 0 && (
        <EmptyState
          title="Press Is Quiet"
          message="No published stories are currently indexed in the journal archive."
        />
      )}

      {/* Main Content when stories exist and not out of range */}
      {!isLoading && !isError && !isOutOfRange && posts.length > 0 && (
        <>
          {/* Page 1: Hero Section with Lead & Secondary Stories */}
          {currentPage === 1 && (
            <section className="space-y-12">
              {/* Lead Story */}
              {leadPost && (
                <AnimatedCard index={0}>
                  <PostCardLead post={leadPost} priority={true} />
                </AnimatedCard>
              )}

              {/* Secondary Stories Row */}
              {secondaryPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-4">
                  {secondaryPosts.map((post, idx) => (
                    <AnimatedCard key={post.id} index={idx + 1}>
                      <PostCardStandard post={post} />
                    </AnimatedCard>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Page > 1 Header */}
          {currentPage > 1 && (
            <div className="pb-6 border-b border-rule">
              <span className="font-mono text-xs uppercase tracking-meta text-accent">
                CHRONICLE ARCHIVE
              </span>
              <h2 className="type-section-title text-ink mt-1">
                Dispatches &bull; Page {currentPage}
              </h2>
              <p className="font-mono text-xs text-ink-soft mt-1">
                Showing {posts.length} stories of {total} total
              </p>
            </div>
          )}

          {/* Asymmetric Feed Grid + Sidebar */}
          <section className="pt-8 border-t border-rule">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Asymmetric Grid Feed */}
              <div className="lg:col-span-8 space-y-10">
                <div className="flex items-center justify-between pb-2 border-b border-rule">
                  <h3 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
                    {currentPage === 1 ? 'Latest Stories' : `Stories (${posts.length})`}
                  </h3>
                  <span className="font-mono text-xs text-ink-soft">
                    {total} stories in archive
                  </span>
                </div>

                {/* Alternating Wide & Two-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {feedPosts.map((post, idx) => {
                    // Alternate: every 3rd card spans 2 columns on desktop
                    const isWide = idx % 3 === 0;
                    return (
                      <AnimatedCard
                        key={post.id}
                        index={idx}
                        className={isWide ? "md:col-span-2" : "md:col-span-1"}
                      >
                        <PostCardStandard post={post} />
                      </AnimatedCard>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sidebar (Most Read & Department Directory) */}
              <aside className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-rule space-y-10">
                {/* Most Read Stories */}
                <div>
                  <div className="pb-2 mb-4 border-b border-rule">
                    <h3 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
                      Most Read
                    </h3>
                  </div>
                  <div className="divide-y divide-rule/60">
                    {mostReadPosts.map((post, idx) => (
                      <AnimatedCard key={`most-read-${post.id}`} index={idx}>
                        <PostCardCompact post={post} index={idx + 1} />
                      </AnimatedCard>
                    ))}
                  </div>
                </div>

                {/* Category Shelf Links */}
                <div className="bg-paper-2 p-5 border border-rule rounded-[2px] space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
                    Departments
                  </h4>
                  <ul className="space-y-2.5 font-mono text-xs uppercase tracking-meta">
                    {SITE_CONFIG.categories.map((cat) => (
                      <li key={cat.slug} className="flex items-center justify-between">
                        <Link
                          to={`/category/${cat.slug}`}
                          className="text-ink-soft hover:text-accent transition-colors"
                        >
                          {cat.name}
                        </Link>
                        <span className="text-ink-soft/40">&rarr;</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </section>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
