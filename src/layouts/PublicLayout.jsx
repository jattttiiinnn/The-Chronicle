import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Masthead } from '../components/layout/Masthead.jsx';
import { Navigation } from '../components/layout/Navigation.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export function PublicLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-200">
      {/* Accessible Skip-to-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:font-mono focus:text-xs focus:rounded-[2px] focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
      >
        Skip to main content
      </a>

      <Masthead isHomePage={isHomePage} />
      <Navigation />

      {/* Primary Semantic Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-site w-full mx-auto px-4 sm:px-6 outline-none">
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
          {/* 150ms Route Cross-Fade */}
          <motion.div
            key={location.pathname}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
