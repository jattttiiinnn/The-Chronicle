import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <Seo title="Admin — Posts & Featured Editorial" />
      <div className="pb-4 border-b border-rule">
        <h1 className="font-display font-bold text-2xl text-ink">Folio Curations & Featured Stories</h1>
        <p className="font-serif italic text-sm text-ink-soft">Review global publications and assign featured flags.</p>
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Admin Posts Panel to be completed in Stage 6]
      </p>
    </div>
  );
}
