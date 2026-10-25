import React from 'react';
import { cn } from '../../utils/cn.js';
import { IconAlertTriangle } from './Icons.jsx';

export const Textarea = React.forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    rows = 4,
    className = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="font-mono text-[0.75rem] uppercase tracking-meta text-ink-soft">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          "w-full bg-paper px-3.5 py-2.5 text-sm text-ink border rounded-[2px] transition-colors duration-150 focus:outline-none focus:border-accent resize-y",
          error ? "border-destructive" : "border-rule",
          className
        )}
        {...props}
      />
      {error && (
        <p className="flex items-center gap-1 font-mono text-xs text-destructive mt-0.5">
          <IconAlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p className="font-mono text-xs text-ink-soft/75 mt-0.5">
          {helperText}
        </p>
      )}
    </div>
  );
});
