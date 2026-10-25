import React from 'react';
import { cn } from '../../utils/cn.js';
import { IconAlertTriangle, IconChevronDown } from './Icons.jsx';

export const Select = React.forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    className = '',
    id,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="font-mono text-[0.75rem] uppercase tracking-meta text-ink-soft">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full bg-paper px-3.5 py-2.5 text-sm text-ink border rounded-[2px] transition-colors duration-150 appearance-none focus:outline-none focus:border-accent pr-10",
            error ? "border-destructive" : "border-rule",
            className
          )}
          {...props}
        >
          {options.length > 0
            ? options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-soft">
          <IconChevronDown className="w-4 h-4" />
        </div>
      </div>
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
