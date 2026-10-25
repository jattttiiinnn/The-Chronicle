import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';

export function ForbiddenPage() {
  return (
    <div className="py-20 sm:py-32 flex flex-col items-center justify-center text-center">
      <Seo title="403 — Unauthorized Archive Access" />
      <span className="font-mono text-xs uppercase tracking-meta text-destructive mb-3">
        ERROR CODE 403 &bull; RESTRICTED FOLIO
      </span>
      <h1 className="font-display font-black text-7xl sm:text-9xl text-ink tracking-tight mb-4">
        403
      </h1>
      <p className="font-serif italic text-xl sm:text-2xl text-ink-soft max-w-md mb-8">
        These galley proofs are reserved for editors with explicit clearance.
      </p>
      <div className="flex gap-4">
        <Link to="/">
          <Button variant="solid">Return to Front Page</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline">Sign in with Credentials</Button>
        </Link>
      </div>
    </div>
  );
}

export default ForbiddenPage;
