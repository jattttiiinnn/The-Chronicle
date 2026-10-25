import React, { Suspense } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SITE_NAME } from '../config/site.js';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      {/* Dense Top Header */}
      <header className="border-b border-rule bg-paper">
        <div className="max-w-site mx-auto px-4 sm:px-6 h-12 flex items-center justify-between font-mono text-xs uppercase tracking-meta">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-bold text-base text-ink tracking-tight">
              {SITE_NAME} <span className="font-mono text-xs font-normal text-ink-soft">/ AUTHOR</span>
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'}`
                }
              >
                Stories
              </NavLink>
              <NavLink
                to="/dashboard/new"
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-accent font-semibold' : 'text-ink-soft hover:text-ink'}`
                }
              >
                + Write
              </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-ink-soft hidden md:inline">{user?.name} ({role})</span>
            {role === 'admin' && (
              <Link to="/admin/posts" className="text-ink-soft hover:text-accent">
                Admin Panel &rarr;
              </Link>
            )}
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
