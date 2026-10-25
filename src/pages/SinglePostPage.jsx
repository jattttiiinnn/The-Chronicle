import React, { useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost, usePosts } from '../features/posts/usePosts.js';
import { recordPostView } from '../api/posts.js';
import { extractHeadings } from '../utils/toc.js';
import { formatDate, getReadingTime } from '../utils/date.js';
import { Seo } from '../components/Seo.jsx';
import { ReadingProgressBar } from '../components/post/ReadingProgressBar.jsx';
import { TableOfContents } from '../components/post/TableOfContents.jsx';
import { PostActionsRail } from '../components/post/PostActionsRail.jsx';
import { MarkdownRenderer } from '../components/post/MarkdownRenderer.jsx';
import { AuthorBox } from '../components/post/AuthorBox.jsx';
import { Tag } from '../components/editorial/Tag.jsx';
import { PostCardHorizontal } from '../components/cards/PostCardHorizontal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';

export default function SinglePostPage() {
  const { slug } = useParams();
  const { data: post, isLoading, isError, error, refetch } = usePost(slug);

  // Single view increment ref (guards against React 18 StrictMode double-invocation)
  const recordedSlugs = useRef(new Set());

  useEffect(() => {
    if (post && slug && !recordedSlugs.current.has(slug)) {
      recordedSlugs.current.add(slug);
      recordPostView(slug).catch(() => {});
    }
  }, [slug, post]);

  // Extract TOC headings from markdown
  const headings = useMemo(() => {
    return post?.content ? extractHeadings(post.content) : [];
  }, [post?.content]);

  // Fetch related stories from the same primary category
  const primaryCategory = post?.categories?.[0];
  const { data: relatedData } = usePosts({
    category: primaryCategory,
    limit: 4,
  });

  const relatedPosts = (relatedData?.posts || [])
    .filter((p) => p.id !== post?.id && p.slug !== post?.slug)
    .slice(0, 3);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="py-12 max-w-prose mx-auto space-y-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="h-12 border-y border-rule py-2 flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="w-full aspect-[16/9]" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </div>
    );
  }

  // Not Found / 404 State (or unpublished post inaccessible to guest)
  if (isError && error?.response?.status === 404) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto space-y-4">
        <Seo title="404 — Story Not Found" />
        <span className="font-mono text-xs uppercase tracking-meta text-accent">
          MISSING DISPATCH &bull; 404
        </span>
        <h1 className="font-display font-black text-4xl text-ink">
          Folio Unavailable
        </h1>
        <p className="font-serif italic text-base text-ink-soft">
          This dispatch is either restricted or has not yet been set to the press.
        </p>
        <div className="pt-4">
          <Link to="/">
            <Button variant="solid">Return to Front Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  // General Error State
  if (isError || !post) {
    return (
      <div className="py-16">
        <ErrorState
          title="Transmission Disrupted"
          message="Could not retrieve the requested article. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const readingTime = getReadingTime(post.content || post.excerpt || '');
  const publishedDate = formatDate(post.publishedAt);
  const authorName = post.author?.name || 'The Chronicle Desk';

  return (
    <article className="py-8 relative">
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.coverUrl || undefined}
        type="article"
        preloadImage={post.coverUrl || undefined}
      />

      {/* 2px Fixed Accent Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Article Header Container (max 800px) */}
      <header className="max-w-3xl mx-auto space-y-6 text-center">
        {/* Category Eyebrow */}
        {primaryCategory && (
          <div>
            <Link
              to={`/category/${primaryCategory.toLowerCase()}`}
              className="font-mono text-xs uppercase tracking-meta text-accent hover:underline font-semibold"
            >
              {primaryCategory}
            </Link>
          </div>
        )}

        {/* Article Headline */}
        <h1 className="type-article-title text-ink font-bold tracking-headline">
          {post.title}
        </h1>

        {/* Deck / Excerpt */}
        {post.excerpt && (
          <p className="font-serif italic text-lg sm:text-xl text-ink-soft leading-relaxed max-w-prose mx-auto">
            {post.excerpt}
          </p>
        )}

        {/* Editorial Byline Row between two hairlines */}
        <div className="py-3 border-y border-rule flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-meta text-ink-soft">
          <div className="flex items-center gap-3">
            {post.author?.avatarUrl && (
              <img
                src={post.author.avatarUrl}
                alt={authorName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-rule"
              />
            )}
            <span className="text-ink font-semibold">{authorName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{publishedDate}</span>
            <span aria-hidden="true">&bull;</span>
            <span>{readingTime}</span>
          </div>
        </div>
      </header>

      {/* Hero Cover Image Container (full width inside max-w-site) */}
      {post.coverUrl && (
        <figure className="my-10 max-w-4xl mx-auto">
          <div className="w-full aspect-[16/9] overflow-hidden bg-paper-2 border border-rule">
            <img
              src={post.coverUrl}
              alt={post.title}
              width={1200}
              height={675}
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="mt-2.5 text-center font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft">
            &mdash; The Chronicle Photo Archive &bull; Plates No. {post.id}
          </figcaption>
        </figure>
      )}

      {/* Main Reading Column (strictly 68ch measure) */}
      <div className="max-w-prose mx-auto relative pt-4">
        {/* Table of Contents (Sticky left on desktop, collapsible above body on mobile) */}
        <TableOfContents headings={headings} />

        {/* Actions Rail (Sticky left on desktop, fixed bottom on mobile) */}
        <PostActionsRail post={post} />

        {/* Sanitized Markdown Content */}
        <MarkdownRenderer content={post.content} headings={headings} />

        {/* Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 mt-12 border-t border-rule space-y-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft block">
              Filed Topics
            </span>
            <div className="flex flex-wrap gap-4">
              {post.tags.map((t) => (
                <Tag key={t} name={t} href={`/tag/${t.toLowerCase()}`} />
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <AuthorBox author={post.author} />

        {/* Comments Area Placeholder */}
        <section
          aria-label="Discussion"
          className="my-16 p-8 border border-rule bg-paper-2 text-center rounded-[2px] space-y-2"
        >
          <span className="font-mono text-xs uppercase tracking-meta text-accent block">
            READERSHIP FORUM
          </span>
          <h3 className="font-display font-bold text-xl text-ink">
            Reader Discussion
          </h3>
          <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
            [Comments & Discussion — Scheduled for stage 4]
          </p>
        </section>

        {/* Related Stories (3 Horizontal Cards) */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-rule space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-rule">
              <h3 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold">
                Related Dispatches
              </h3>
              <span className="font-mono text-xs text-ink-soft">
                More in {primaryCategory}
              </span>
            </div>
            <div className="divide-y divide-rule">
              {relatedPosts.map((related) => (
                <PostCardHorizontal key={related.id} post={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
