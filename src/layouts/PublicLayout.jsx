import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Masthead } from '../components/layout/Masthead.jsx';
import { Navigation } from '../components/layout/Navigation.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-200">
      <Masthead isHomePage={isHomePage} />
      <Navigation />
      <main className="flex-1 max-w-site w-full mx-auto px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="py-12 space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
