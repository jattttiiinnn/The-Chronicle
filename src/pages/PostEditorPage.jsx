import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div className="py-20 text-center space-y-4">
      <Seo title={isEditing ? "Edit Folio" : "New Folio — Split Editor"} />
      <span className="font-mono text-xs uppercase tracking-meta text-accent">BACK OF HOUSE</span>
      <h1 className="font-display font-bold text-2xl text-ink">
        {isEditing ? `Edit Folio (${id})` : 'Draft New Dispatch'}
      </h1>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Scheduled for stage 5]
      </p>
    </div>
  );
}
