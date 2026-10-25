import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getReadingTime } from '../../utils/date.js';

export function PostCardStandard({ post }) {
  if (!post) return null;

  const readingTime = getReadingTime(post.content || post.excerpt || '');
  const primaryCategory = post.categories?.[0] || 'ESSAYS';

  return (
    <article className="group flex flex-col pb-6 border-b border-rule h-full">
      {/* Cover Image Frame */}
      {post.coverUrl && (
        <div className="w-full overflow-hidden aspect-[16/9] bg-paper-2 mb-4">
          <Link to={`/posts/${post.slug}`} tabIndex={-1}>
            <img
              src={post.coverUrl}
              alt={post.title}
              width={640}
              height={360}
              loading="lazy"
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

      {/* Card Title */}
      <h3 className="type-card-title text-ink mb-2 flex-shrink-0">
        <Link to={`/posts/${post.slug}`} className="hover-underline-animation">
          {post.title}
        </Link>
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="font-serif text-sm md:text-base text-ink-soft leading-relaxed mb-4 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
      )}

      {/* Meta Row */}
      <div className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft/80 mt-auto pt-2 border-t border-rule/40">
        <span>{formatDate(post.publishedAt)}</span>
        <span aria-hidden="true">&bull;</span>
        <span>{readingTime}</span>
      </div>
    </article>
  );
}
