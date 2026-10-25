import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function AdminCommentsPage() {
  return (
    <div className="space-y-6">
      <Seo title="Admin — Reader Commentary Moderation" />
      <div className="pb-4 border-b border-rule">
        <h1 className="font-display font-bold text-2xl text-ink">Commentary Moderation Queue</h1>
        <p className="font-serif italic text-sm text-ink-soft">Approve or expunge reader responses across all folios.</p>
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Admin Comments Panel to be completed in Stage 6]
      </p>
    </div>
  );
}
