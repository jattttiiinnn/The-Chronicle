import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getReadingTime } from '../../utils/date.js';

export function PostCardCompact({ post, index = 1 }) {
  if (!post) return null;

  const readingTime = getReadingTime(post.content || post.excerpt || '');
  const primaryCategory = post.categories?.[0] || 'ESSAYS';
  const paddedIndex = String(index).padStart(2, '0');

  return (
    <article className="group flex items-start gap-4 py-4 border-b border-rule">
      {/* Mono Number */}
      <span className="font-mono text-xl font-bold text-ink-soft/40 group-hover:text-accent transition-colors duration-150 select-none pt-0.5">
        {paddedIndex}
      </span>

      <div className="flex-1 min-w-0">
        {/* Category Eyebrow */}
        <div className="mb-1">
          <Link
            to={`/category/${primaryCategory.toLowerCase()}`}
            className="font-mono text-[0.6875rem] uppercase tracking-meta text-accent hover:underline"
          >
            {primaryCategory}
          </Link>
        </div>

        {/* Title */}
        <h4 className="font-display font-bold text-base md:text-lg text-ink leading-snug mb-1">
          <Link to={`/posts/${post.slug}`} className="hover-underline-animation">
            {post.title}
          </Link>
        </h4>

        {/* Meta */}
        <div className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft/70">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </article>
  );
}
