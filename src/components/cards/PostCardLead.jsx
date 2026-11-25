import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getReadingTime } from '../../utils/date.js';

export function PostCardLead({ post, priority = true }) {
  if (!post) return null;

  const readingTime = getReadingTime(post.content || post.excerpt || '');
  const primaryCategory = post.categories?.[0] || 'ESSAYS';

  const getSrcSet = (url) => {
    if (!url || !url.includes('images.unsplash.com')) return undefined;
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=480&q=75 480w, ${base}?auto=format&fit=crop&w=800&q=80 800w, ${base}?auto=format&fit=crop&w=1200&q=80 1200w`;
  };

  return (
    <article className="group flex flex-col pb-8 border-b border-rule">
      {/* Cover Image Frame */}
      {post.coverUrl && (
        <div className="w-full overflow-hidden aspect-[16/9] bg-paper-2 mb-6">
          <Link to={`/posts/${post.slug}`} tabIndex={-1}>
            <img
              src={post.coverUrl}
              srcSet={getSrcSet(post.coverUrl)}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              alt={post.title}
              width={1200}
              height={675}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </Link>
        </div>
      )}

      {/* Category Eyebrow */}
      <div className="mb-2">
        <Link
          to={`/category/${primaryCategory.toLowerCase()}`}
          className="font-mono text-xs uppercase tracking-meta text-accent hover:underline"
        >
          {primaryCategory}
        </Link>
      </div>

      {/* Lead Headline */}
      <h2 className="type-lead-headline text-ink mb-4">
        <Link
          to={`/posts/${post.slug}`}
          className="hover-underline-animation"
        >
          {post.title}
        </Link>
      </h2>

      {/* Deck / Excerpt */}
      {post.excerpt && (
        <p className="font-serif italic text-lg md:text-xl text-ink-soft leading-relaxed mb-4 max-w-prose">
          {post.excerpt}
        </p>
      )}

      {/* Meta Row */}
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-meta text-ink-soft/80 pt-2 border-t border-rule/50">
        <span>{formatDate(post.publishedAt)}</span>
        <span aria-hidden="true">&bull;</span>
        <span>{readingTime}</span>
        {post.views > 0 && (
          <>
            <span aria-hidden="true">&bull;</span>
            <span>{post.views.toLocaleString()} VIEWS</span>
          </>
        )}
      </div>
    </article>
  );
}
