import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function CategoryPage() {
  const { name } = useParams();
  return (
    <div className="py-12">
      <Seo title={`Department / ${name}`} />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">DEPARTMENT</span>
      <h1 className="type-article-title text-ink mt-2">Category: {name}</h1>
    </div>
  );
}
