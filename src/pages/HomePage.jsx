import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function HomePage() {
  return (
    <div className="py-20 text-center space-y-4">
      <Seo />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">FRONT PAGE</span>
      <h1 className="type-section-title text-ink">The Chronicle Front Page</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 2]
      </p>
      <div className="pt-4">
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
