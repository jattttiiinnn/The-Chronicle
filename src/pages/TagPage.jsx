import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function TagPage() {
  const { name } = useParams();
  return (
    <div className="py-20 text-center space-y-4">
      <Seo title={`Tag / #${name}`} />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">TAG ARCHIVE</span>
      <h1 className="type-article-title text-ink">#{name}</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 2]
      </p>
    </div>
  );
}
