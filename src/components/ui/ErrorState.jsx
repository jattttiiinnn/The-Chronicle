import React from 'react';
import { Button } from './Button.jsx';
import { IconAlertTriangle } from './Icons.jsx';

export function ErrorState({
  title = "Dispatch Error",
  message = "Failed to load stories from the press archive.",
  onRetry,
}) {
  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-4">
      <span className="flex items-center justify-center gap-1.5 font-mono text-xs uppercase tracking-meta text-destructive">
        <IconAlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>TRANSMISSION INTERRUPTION</span>
      </span>
      <h3 className="font-display font-bold text-2xl text-ink">
        {title}
      </h3>
      <p className="font-serif italic text-base text-ink-soft leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="pt-2">
          <Button variant="solid" onClick={onRetry}>
            Retry Dispatch
          </Button>
        </div>
      )}
    </div>
  );
}
