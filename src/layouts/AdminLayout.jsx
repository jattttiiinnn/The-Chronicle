import React, { Suspense } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_NAME } from '../config/site.js';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function AdminLayout() {
  const { user } = useAuth();

  const navLinks = [
    { to: '/admin/posts', label: 'Posts & Featured' },
    { to: '/admin/comments', label: 'Comments Moderation' },
    { to: '/admin/users', label: 'Users & Roles' }
  ];

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-mono focus:text-xs focus:rounded-[2px] focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to main content
      </a>
      {/* Dense Back-of-House Header */}
      <header className="border-b border-rule bg-paper sticky top-0 z-30">
        <div className="max-w-site mx-auto px-4 sm:px-6 h-12 flex items-center justify-between font-mono text-xs uppercase tracking-meta">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-bold text-base text-ink tracking-tight flex items-center gap-2">
              <span>{SITE_NAME}</span>
              <span className="font-mono text-[0.6875rem] font-medium text-destructive px-1.5 py-0.5 border border-destructive/40 rounded-[2px]">
                ADMIN
              </span>
            </Link>
            <nav className="hidden sm:flex items-center gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `py-1 border-b-2 transition-colors ${
                      isActive
                        ? 'text-accent border-accent font-semibold'
                        : 'text-ink-soft hover:text-ink border-transparent'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-ink-soft hidden md:inline truncate max-w-[160px]">
              {user?.name}
            </span>
            <Link
              to="/dashboard"
              className="text-ink-soft hover:text-ink transition-colors hidden sm:inline"
            >
              Author Desk
            </Link>
            <Link
              to="/"
              className="text-ink-soft hover:text-ink transition-colors"
            >
              Journal
            </Link>
          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        <div className="sm:hidden flex items-center gap-4 px-4 h-10 border-t border-rule overflow-x-auto font-mono text-[0.6875rem] uppercase tracking-meta no-scrollbar bg-paper-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap py-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-accent border-accent font-semibold'
                    : 'text-ink-soft hover:text-ink border-transparent'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Administrative Workplace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-site w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 outline-none">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
