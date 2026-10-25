import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getReadingTime } from '../../utils/date.js';

export function PostCardHorizontal({ post }) {
  if (!post) return null;

  const readingTime = getReadingTime(post.content || post.excerpt || '');
  const primaryCategory = post.categories?.[0] || 'ESSAYS';

  return (
    <article className="group grid grid-cols-12 gap-4 md:gap-6 py-6 border-b border-rule items-center">
      {/* Thumbnail Frame on left */}
      {post.coverUrl && (
        <div className="col-span-4 sm:col-span-3 overflow-hidden aspect-[4/3] bg-paper-2">
          <Link to={`/posts/${post.slug}`} tabIndex={-1}>
            <img
              src={post.coverUrl}
              alt={post.title}
              width={300}
              height={225}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            />
          </Link>
        </div>
      )}

      {/* Content on right */}
      <div className={post.coverUrl ? "col-span-8 sm:col-span-9 flex flex-col justify-center" : "col-span-12"}>
        <div className="mb-1">
          <Link
            to={`/category/${primaryCategory.toLowerCase()}`}
            className="font-mono text-[0.6875rem] uppercase tracking-meta text-accent hover:underline"
          >
            {primaryCategory}
          </Link>
        </div>

        <h3 className="font-display font-bold text-lg md:text-xl text-ink leading-snug mb-2">
          <Link to={`/posts/${post.slug}`} className="hover-underline-animation">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && (
          <p className="font-serif text-sm text-ink-soft line-clamp-2 mb-2 hidden sm:block">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft/75">
          <span>{formatDate(post.publishedAt)}</span>
          <span aria-hidden="true">&bull;</span>
          <span>{readingTime}</span>
        </div>
      </div>
    </article>
  );
}
