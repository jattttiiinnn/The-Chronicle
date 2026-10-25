import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button.jsx';

export function EmptyState({
  title = "No stories found",
  message = "There are no dispatches matching the requested criteria.",
  actionText = "Return to Front Page",
  actionHref = "/",
  onAction,
}) {
  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-4">
      <span className="font-mono text-xs uppercase tracking-meta text-ink-soft">
        EMPTY DESK &bull; 0 STORIES
      </span>
      <h3 className="font-display font-bold text-2xl text-ink">
        {title}
      </h3>
      <p className="font-serif italic text-base text-ink-soft leading-relaxed">
        {message}
      </p>
      <div className="pt-2">
        {actionHref ? (
          <Link to={actionHref}>
            <Button variant="outline">{actionText}</Button>
          </Link>
        ) : onAction ? (
          <Button variant="outline" onClick={onAction}>{actionText}</Button>
        ) : null}
      </div>
    </div>
  );
}
