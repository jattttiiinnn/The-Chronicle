import React, { useState, useEffect } from 'react';
import { IconChevronDown } from '../ui/Icons.jsx';
import { cn } from '../../utils/cn.js';

export function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id || '');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (headings.length > 0 && !activeId) {
      setActiveId(headings[0].id);
    }
  }, [headings, activeId]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible heading nearest top
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: [0, 1.0],
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const handleHeadingClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Account for sticky masthead
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile Collapsible Accordion (<1280px) */}
      <div className="xl:hidden w-full my-8 bg-paper-2 border border-rule rounded-[2px] p-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          aria-expanded={isOpenMobile}
          className="w-full flex items-center justify-between font-mono text-xs uppercase tracking-meta text-ink"
        >
          <span className="font-semibold flex items-center gap-2">
            <span>Table of Contents</span>
            <span className="text-ink-soft">({headings.length})</span>
          </span>
          <span
            className={cn(
              "text-ink-soft transition-transform duration-200",
              isOpenMobile && "rotate-180"
            )}
          >
            <IconChevronDown className="w-4 h-4" />
          </span>
        </button>

        {isOpenMobile && (
          <nav aria-label="Mobile Table of Contents" className="mt-4 pt-3 border-t border-rule space-y-2">
            {headings.map(({ id, title, level }) => {
              const isActive = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleHeadingClick(e, id)}
                  className={cn(
                    "block text-sm font-sans transition-colors leading-snug",
                    level === 3 ? "pl-4 text-xs" : "",
                    isActive
                      ? "text-accent font-semibold"
                      : "text-ink-soft hover:text-ink"
                  )}
                >
                  {title}
                </a>
              );
            })}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar (>=1280px) in left margin */}
      <aside className="hidden xl:block absolute -left-[17.5rem] top-0 w-48">
        <div className="sticky top-24 space-y-3">
          <p className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft pb-1 border-b border-rule font-semibold">
            Contents
          </p>
          <nav aria-label="Table of Contents" className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-2">
            {headings.map(({ id, title, level }) => {
              const isActive = activeId === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleHeadingClick(e, id)}
                  className={cn(
                    "block text-xs font-sans transition-all leading-normal relative py-0.5",
                    level === 3 ? "pl-3 text-[0.8125rem]" : "",
                    isActive
                      ? "text-accent font-semibold pl-2 border-l-2 border-accent"
                      : "text-ink-soft hover:text-ink"
                  )}
                >
                  {title}
                </a>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
