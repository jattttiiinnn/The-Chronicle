import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function AdminCommentsPage() {
  return (
    <div className="py-20 text-center space-y-4">
      <Seo title="Admin — Reader Commentary Moderation" />
      <span className="font-mono text-xs uppercase tracking-meta text-destructive">ADMINISTRATION</span>
      <h1 className="font-display font-bold text-2xl text-ink">Commentary Moderation Queue</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 6]
      </p>
    </div>
  );
}
