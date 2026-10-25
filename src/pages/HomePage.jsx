import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function HomePage() {
  return (
    <div className="py-12 text-center space-y-4">
      <Seo />
      <h2 className="type-section-title text-ink">The Chronicle Front Page</h2>
      <p className="font-serif italic text-ink-soft">
        Stage 1 Foundation complete. View the comprehensive component inventory at:
      </p>
      <div>
        <Link
          to="/styleguide"
          className="inline-block px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-meta hover:bg-ink-soft transition-colors"
        >
          Explore Styleguide & Design System &rarr;
        </Link>
      </div>
    </div>
  );
}
