import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function BookmarksPage() {
  return (
    <div className="py-20 text-center space-y-4">
      <Seo title="Saved Folios & Bookmarks" />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">ARCHIVE COLLECTION</span>
      <h1 className="type-article-title text-ink">Saved Stories</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 2]
      </p>
    </div>
  );
}
