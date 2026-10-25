import React from 'react';
import { Seo } from '../components/Seo.jsx';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Seo title="Admin — User Folio Management & Roles" />
      <div className="pb-4 border-b border-rule">
        <h1 className="font-display font-bold text-2xl text-ink">User Directory & Role Assignments</h1>
        <p className="font-serif italic text-sm text-ink-soft">Inspect all registered personas and configure permissions.</p>
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Admin Users Directory to be completed in Stage 6]
      </p>
    </div>
  );
}
