import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';

  return (
    <div className="py-20 text-center space-y-4">
      <Seo title={`Search Results: ${query || 'Index'}`} />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">INDEX & SEARCH</span>
      <h1 className="type-article-title text-ink">
        {query ? `Search Query: "${query}"` : 'Browse Journal Archive'}
      </h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 2]
      </p>
    </div>
  );
}
