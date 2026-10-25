import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_CONFIG } from '../../config/site.js';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-rule bg-paper py-12">
      <div className="max-w-site mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-rule">
          {/* Masthead Colophon */}
          <div className="md:col-span-5">
            <h2 className="font-display font-black text-2xl text-ink tracking-tight mb-2">
              {SITE_NAME}
            </h2>
            <p className="font-serif italic text-sm text-ink-soft leading-relaxed max-w-sm mb-4">
              {SITE_CONFIG.description}
            </p>
            <p className="font-mono text-xs uppercase tracking-meta text-ink-soft">
              {SITE_CONFIG.volume} &bull; PRINTED DIGITALLY
            </p>
          </div>

          {/* Categories */}
          <div className="md:col-span-4">
            <h3 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold mb-3">
              Departments
            </h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs uppercase tracking-meta">
              {SITE_CONFIG.categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="text-ink-soft hover:text-accent transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Editorial Links & Styleguide */}
          <div className="md:col-span-3">
            <h3 className="font-mono text-xs uppercase tracking-meta text-ink font-semibold mb-3">
              Journal
            </h3>
            <ul className="flex flex-col gap-2 font-mono text-xs uppercase tracking-meta">
              <li>
                <Link to="/styleguide" className="text-ink-soft hover:text-accent transition-colors">
                  Design System & Styleguide
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-ink-soft hover:text-accent transition-colors">
                  Index & Search
                </Link>
              </li>
              <li>
                <span className="text-ink-soft/60">Colophon & Imprint</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Imprint */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[0.6875rem] uppercase tracking-meta text-ink-soft/75">
          <p>&copy; {currentYear} {SITE_NAME}. ALL RIGHTS RESERVED.</p>
          <p>SET IN PLAYFAIR DISPLAY & SOURCE SERIF 4</p>
        </div>
      </div>
    </footer>
  );
}
