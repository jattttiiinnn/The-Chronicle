import React from 'react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo.jsx';
import { Button } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="py-20 sm:py-32 flex flex-col items-center justify-center text-center">
      <Seo title="404 — Folio Not Found" />
      <span className="font-mono text-xs uppercase tracking-meta text-accent mb-3">
        ERROR CODE 404 &bull; MISSING LEAF
      </span>
      <h1 className="font-display font-black text-7xl sm:text-9xl text-ink tracking-tight mb-4">
        404
      </h1>
      <p className="font-serif italic text-xl sm:text-2xl text-ink-soft max-w-md mb-8">
        This dispatch appears to have slipped out of the press before print.
      </p>
      <Link to="/">
        <Button variant="solid">Return to Front Page</Button>
      </Link>
    </div>
  );
}

export default NotFoundPage;
