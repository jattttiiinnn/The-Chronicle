import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function SinglePostPage() {
  const { slug } = useParams();
  return (
    <div className="py-12">
      <Seo title={`Reading: ${slug}`} />
      <p className="font-mono text-xs uppercase tracking-meta text-accent">Single Post Stage 3 Placeholder</p>
      <h1 className="type-article-title text-ink mt-2">Folio: {slug}</h1>
    </div>
  );
}
