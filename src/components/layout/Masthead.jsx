import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_NAME } from '../../config/site.js';
import { getIssueLine } from '../../utils/date.js';

export function Masthead({ isHomePage = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const issueLine = getIssueLine();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 160) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Compact Masthead on Scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-paper/95 backdrop-none border-b border-rule transition-transform duration-300 ${
          isScrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-site mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link
            to="/"
            className="font-display font-black text-xl tracking-tight text-ink hover:text-accent transition-colors"
          >
            {SITE_NAME}
          </Link>
          <span className="font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft hidden sm:inline">
            {issueLine}
          </span>
        </div>
      </div>

      {/* Main Editorial Masthead */}
      <header className="pt-8 sm:pt-12 pb-4 text-center">
        <div className="max-w-site mx-auto px-4 sm:px-6">
          {/* Main Wordmark */}
          {isHomePage ? (
            <h1 className="type-masthead text-ink font-black hover:opacity-95 transition-opacity tracking-tight">
              <Link to="/">{SITE_NAME}</Link>
            </h1>
          ) : (
            <div className="type-masthead text-ink font-black hover:opacity-95 transition-opacity tracking-tight">
              <Link to="/">{SITE_NAME}</Link>
            </div>
          )}

          {/* Editorial Issue Line */}
          <div className="mt-2 sm:mt-3">
            <p className="font-mono text-xs sm:text-[0.8125rem] uppercase tracking-meta text-ink-soft">
              {issueLine}
            </p>
          </div>

          {/* Editorial Double Rule */}
          <div className="double-rule mt-4 sm:mt-6" />
        </div>
      </header>
    </>
  );
}
