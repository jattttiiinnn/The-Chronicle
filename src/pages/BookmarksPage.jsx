import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function BookmarksPage() {
  return (
    <div className="py-12">
      <Seo title="Saved Folios & Bookmarks" />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">ARCHIVE COLLECTION</span>
      <h1 className="type-article-title text-ink mt-2">Saved Stories</h1>
    </div>
  );
}
