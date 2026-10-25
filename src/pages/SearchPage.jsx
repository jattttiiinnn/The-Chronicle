import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../features/posts/usePosts.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { Seo } from '../components/Seo.jsx';
import { PostCardHorizontal } from '../components/cards/PostCardHorizontal.jsx';
import { AnimatedCard } from '../components/cards/AnimatedCard.jsx';
import { Pagination } from '../components/ui/Pagination.jsx';
import { SkeletonPostCard } from '../components/ui/Skeleton.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { IconSearch, IconClose } from '../components/ui/Icons.jsx';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Controlled input value
  const [inputValue, setInputValue] = useState(urlQuery);

  // Sync input value when back/forward navigation alters URL query
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  // Debounce the input by 300ms
  const debouncedQuery = useDebounce(inputValue, 300);

  // Synchronize debounced query with URL using REPLACE (not push) and reset page to 1
  useEffect(() => {
    const currentUrlQ = searchParams.get('q') || '';
    if (debouncedQuery !== currentUrlQ) {
      const newParams = new URLSearchParams();
      if (debouncedQuery.trim()) {
        newParams.set('q', debouncedQuery.trim());
      }
      // Page resets to 1 when search changes
      setSearchParams(newParams, { replace: true });
    }
  }, [debouncedQuery, searchParams, setSearchParams]);

  // Query posts matching urlQuery and currentPage
  const { data, isLoading, isError, refetch } = usePosts({
    search: urlQuery,
    page: currentPage,
    limit: 6,
  });

  const posts = data?.posts || [];
  const pagination = data?.pagination || { page: 1, limit: 6, total: 0, totalPages: 1 };
  const { totalPages, total } = pagination;

  const handleClear = () => {
    setInputValue('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="py-8 space-y-10">
      <Seo
        title={urlQuery ? `Search: "${urlQuery}"` : 'Index & Search'}
        description="Search across essays, cultural commentary, and architectural inquiries in The Chronicle."
      />

      {/* Search Header & Input */}
      <header className="pb-8 border-b border-rule space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-meta text-accent">
            ARCHIVE SEARCH
          </span>
          <h1 className="type-lead-headline text-ink mt-1">
            Index & Inquiry
          </h1>
        </div>

        {/* Large Editorial Search Box */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-ink-soft">
            <IconSearch className="w-5 h-5" />
          </div>
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by title, subject, or excerpt..."
            className="w-full pl-12 pr-12 py-3.5 bg-paper text-ink border border-ink text-base rounded-[2px] focus:outline-none focus:border-accent transition-colors"
            autoFocus
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-soft hover:text-ink"
            >
              <IconClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {urlQuery && (
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-meta text-ink-soft">
            <span>RESULTS FOR: &ldquo;{urlQuery}&rdquo;</span>
            <span aria-hidden="true">&bull;</span>
            <span>{isLoading ? 'SEARCHING...' : `${total} ${total === 1 ? 'story' : 'stories'} found`}</span>
          </div>
        )}
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 max-w-4xl">
          <SkeletonPostCard variant="horizontal" />
          <SkeletonPostCard variant="horizontal" />
          <SkeletonPostCard variant="horizontal" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Search Disrupted"
          message="An error interrupted the index lookup. Please try again."
          onRetry={refetch}
        />
      )}

      {/* Empty State when a search has been executed but no results */}
      {!isLoading && !isError && urlQuery && posts.length === 0 && (
        <EmptyState
          title="No Matching Stories"
          message={`No dispatches matching "${urlQuery}" were discovered in the press catalog.`}
          actionText="Clear Search Query"
          onAction={handleClear}
        />
      )}

      {/* Initial Prompt when no search query has been typed */}
      {!isLoading && !isError && !urlQuery && (
        <div className="py-12 text-center text-ink-soft font-mono text-xs uppercase tracking-meta space-y-2">
          <p>Type keywords to search across titles, excerpts, and bodies.</p>
          <p className="text-ink-soft/60">Sample topics: typography, solitude, bauhaus, software, minimalism</p>
        </div>
      )}

      {/* Search Results */}
      {!isLoading && !isError && posts.length > 0 && (
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
