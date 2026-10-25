import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import { IconArrowLeft, IconArrowRight } from './Icons.jsx';

export function Pagination({ currentPage = 1, totalPages = 1, className = '' }) {
  const location = useLocation();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber) => {
    const searchParams = new URLSearchParams(location.search);
    if (pageNumber === 1) {
      searchParams.delete('page');
    } else {
      searchParams.set('page', pageNumber.toString());
    }
    const queryString = searchParams.toString();
    return `${location.pathname}${queryString ? `?${queryString}` : ''}`;
  };

  // Generate page array (e.g. [1, 2, 3, 4])
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-rule mt-12", className)}
    >
      {/* Newer Stories / Previous Button */}
      <div className="w-full sm:w-auto flex justify-start">
        {hasPrevious ? (
          <Link
            to={createPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-meta border border-rule text-ink hover:border-ink hover:bg-paper-2 transition-colors rounded-[2px]"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Newer Stories</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-meta border border-rule/40 text-ink-soft/40 cursor-not-allowed rounded-[2px] select-none">
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Newer Stories</span>
          </span>
        )}
      </div>

      {/* Numerical Page Indicators */}
      <div className="flex items-center gap-1 font-mono text-xs">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-ink-soft select-none">
                &hellip;
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <Link
              key={`page-${p}`}
              to={createPageUrl(p)}
              aria-current={isCurrent ? 'page' : undefined}
              className={cn(
                "min-w-[32px] h-8 flex items-center justify-center px-2 border rounded-[2px] transition-colors",
                isCurrent
                  ? "bg-ink text-paper border-ink font-bold pointer-events-none"
                  : "border-rule text-ink-soft hover:text-ink hover:border-ink hover:bg-paper-2"
              )}
            >
              {String(p).padStart(2, '0')}
            </Link>
          );
        })}
      </div>

      {/* Older Stories / Next Button */}
      <div className="w-full sm:w-auto flex justify-end">
        {hasNext ? (
          <Link
            to={createPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-meta border border-rule text-ink hover:border-ink hover:bg-paper-2 transition-colors rounded-[2px]"
          >
            <span>Older Stories</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-meta border border-rule/40 text-ink-soft/40 cursor-not-allowed rounded-[2px] select-none">
            <span>Older Stories</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </nav>
  );
}
