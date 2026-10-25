import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function SinglePostPage() {
  const { slug } = useParams();
  return (
    <div className="py-20 text-center space-y-4">
      <Seo title={`Reading: ${slug}`} />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">SINGLE POST</span>
      <h1 className="type-article-title text-ink">Folio: {slug}</h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 3]
      </p>
    </div>
  );
}
