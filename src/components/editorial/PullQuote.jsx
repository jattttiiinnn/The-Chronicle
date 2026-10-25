import React from 'react';
import { cn } from '../../utils/cn.js';

export function PullQuote({ quote, attribution, className = '' }) {
  return (
    <figure className={cn("my-8 pl-6 border-l-2 border-accent md:-mx-6", className)}>
      <blockquote className="font-display italic text-[1.75rem] leading-[1.25] text-ink">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {attribution && (
        <figcaption className="mt-3 font-mono text-xs uppercase tracking-meta text-ink-soft">
          &mdash; {attribution}
        </figcaption>
      )}
    </figure>
  );
}
