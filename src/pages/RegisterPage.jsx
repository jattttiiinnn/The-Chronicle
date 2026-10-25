import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function RegisterPage() {
  return (
    <div className="py-20 text-center space-y-4">
      <Seo title="Register — Readers Circle" />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">
        MEMBERSHIP ENROLLMENT
      </span>
      <h1 className="type-article-title text-ink">Register</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 2]
      </p>
      <div className="pt-4">
        <Link
          to="/styleguide"
          className="font-mono text-xs text-accent hover:underline uppercase tracking-meta"
        >
          &larr; Return to Design System Styleguide
        </Link>
      </div>
    </div>
  );
}
