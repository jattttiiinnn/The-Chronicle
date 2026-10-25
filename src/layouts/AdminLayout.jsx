import React, { Suspense } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_NAME } from '../config/site.js';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function AdminLayout() {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      {/* Dense Admin Header */}
      <header className="border-b border-rule bg-paper">
        <div className="max-w-site mx-auto px-4 sm:px-6 h-12 flex items-center justify-between font-mono text-xs uppercase tracking-meta">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-bold text-base text-ink tracking-tight">
              {SITE_NAME} <span className="font-mono text-xs font-normal text-destructive">/ ADMIN</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              <NavLink
                to="/admin/posts"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'}`
                }
              >
                Posts & Featured
              </NavLink>
              <NavLink
                to="/admin/comments"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'}`
                }
              >
                Comments
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'}`
                }
              >
                Users & Roles
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-ink-soft hidden md:inline">{user?.name} (Administrator)</span>
            <Link to="/dashboard" className="text-ink-soft hover:text-ink">
              Author Dashboard
            </Link>
            <Link to="/" className="text-ink-soft hover:text-ink">
              View Journal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-site w-full mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
