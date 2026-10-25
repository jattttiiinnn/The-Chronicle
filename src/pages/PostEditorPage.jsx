import React from 'react';
import { useParams } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';

export default function PostEditorPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <div className="space-y-6">
      <Seo title={isEditing ? "Edit Folio" : "New Folio — Split Editor"} />
      <div className="flex items-center justify-between pb-4 border-b border-rule">
        <h1 className="font-display font-bold text-2xl text-ink">
          {isEditing ? `Edit Folio (${id})` : 'Draft New Dispatch'}
        </h1>
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Split-pane Markdown editor with live preview & auto-save to be completed in Stage 5]
      </p>
    </div>
  );
}
