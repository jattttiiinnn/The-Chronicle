import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { createHeadingIdGenerator } from '../../utils/toc.js';
import { sanitizeUrl } from '../../utils/sanitize.js';
import { cn } from '../../utils/cn.js';

export function MarkdownRenderer({ content = '' }) {
  // Check if content starts with a heading or image
  const trimmed = content.trim();
  const startsWithHeadingOrImage = trimmed.startsWith('#') || trimmed.startsWith('!');

  // Stateful heading ID generator for matching DOM headings with TOC anchors
  const headingIdGen = useMemo(() => createHeadingIdGenerator(), [content]);


  const components = {
    // Top-level headings attach anchor IDs
    h2: ({ node, children, ...props }) => {
      const text = children?.toString() || '';
      const id = headingIdGen(text);
      return (
        <h2
          id={id}
          className="type-section-title text-ink mt-12 mb-4 scroll-mt-24 border-b border-rule/50 pb-2"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      const text = children?.toString() || '';
      const id = headingIdGen(text);
      return (
        <h3
          id={id}
          className="font-display font-bold text-xl text-ink mt-8 mb-3 scroll-mt-24"
          {...props}
        >
          {children}
        </h3>
      );
    },

    // Paragraphs with drop-cap on first paragraph only
    p: ({ node, children, ...props }) => {
      const isFirstParagraph = !startsWithHeadingOrImage && (node?.position?.start?.line === 1);

      return (
        <p
          className={cn(
            "type-body text-ink leading-body my-6",
            isFirstParagraph && "drop-cap"
          )}
          {...props}
        >
          {children}
        </p>
      );
    },

    // Blockquotes render as Editorial Pull Quotes
    blockquote: ({ node, children, ...props }) => {
      return (
        <figure className="my-10 pl-6 border-l-2 border-accent md:-mx-6">
          <blockquote className="font-display italic text-2xl md:text-[1.75rem] leading-[1.3] text-ink">
            {children}
          </blockquote>
        </figure>
      );
    },

    // Code blocks with syntax highlighting & horizontal scroll
    pre: ({ node, children, ...props }) => {
      return (
        <div className="my-8 overflow-hidden border border-rule rounded-[2px] bg-paper-2">
          <pre
            className="p-4 overflow-x-auto font-mono text-xs sm:text-sm text-ink leading-relaxed"
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },

    code: ({ node, inline, className, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="px-1.5 py-0.5 font-mono text-xs bg-paper-2 border border-rule text-ink rounded-[2px]"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={cn("font-mono text-xs", className)} {...props}>
          {children}
        </code>
      );
    },

    // Lists
    ul: ({ node, children, ...props }) => {
      return (
        <ul className="my-6 pl-6 list-disc space-y-2 type-body text-ink" {...props}>
          {children}
        </ul>
      );
    },
    ol: ({ node, children, ...props }) => {
      return (
        <ol className="my-6 pl-6 list-decimal space-y-2 type-body text-ink" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }) => {
      return (
        <li className="leading-relaxed pl-1" {...props}>
          {children}
        </li>
      );
    },

    // Links: Strictly sanitized protocols
    a: ({ node, href, children, ...props }) => {
      const safeHref = sanitizeUrl(href);
      const isBlocked = safeHref.startsWith('#blocked');

      if (isBlocked) {
        return (
          <span
            className="text-destructive font-mono text-xs underline decoration-dotted cursor-not-allowed"
            title="Blocked unsafe protocol"
          >
            {children} [Blocked Unsafe Link]
          </span>
        );
      }

      return (
        <a
          href={safeHref}
          className="text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
          target={safeHref.startsWith('http') ? '_blank' : undefined}
          rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // Images: Explicit dimensions & sanitized source
    img: ({ node, src, alt, ...props }) => {
      const safeSrc = sanitizeUrl(src);
      if (safeSrc.startsWith('#blocked')) {
        return null;
      }

      return (
        <figure className="my-10">
          <img
            src={safeSrc}
            alt={alt || 'Article illustration'}
            loading="lazy"
            className="w-full h-auto object-cover border border-rule"
            {...props}
          />
          {alt && (
            <figcaption className="mt-2 font-mono text-xs uppercase tracking-meta text-ink-soft text-center">
              &mdash; {alt}
            </figcaption>
          )}
        </figure>
      );
    },

    // Horizontal Rule
    hr: () => <hr className="my-10 border-t border-rule" />,
  };

  return (
    <div className="prose-magazine max-w-prose">
      {/* 
        NO rehype-raw is passed! 
        Raw HTML tags in content will be treated as literal escaped text by react-markdown 
      */}
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {trimmed}
      </ReactMarkdown>
    </div>
  );
}
