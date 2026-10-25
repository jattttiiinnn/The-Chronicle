import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function DashboardPostsPage() {
  return (
    <div className="space-y-6">
      <Seo title="Author Dashboard — Stories" />
      <div className="flex items-center justify-between pb-4 border-b border-rule">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">Author Folios</h1>
          <p className="font-serif italic text-sm text-ink-soft">Manage drafts, scheduled issues, and publications.</p>
        </div>
        <Link to="/dashboard/new">
          <Button variant="accent">+ Write New Folio</Button>
        </Link>
      </div>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-meta">
        [Author Dashboard table to be completed in Stage 5]
      </p>
    </div>
  );
}
