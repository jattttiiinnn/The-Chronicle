import React from 'react';
import { cn } from '../../utils/cn.js';

export function Badge({ children, variant = 'default', className = '' }) {
  const variantStyles = {
    default: "border-rule text-ink-soft",
    published: "border-accent text-accent",
    scheduled: "border-ink-soft text-ink-soft",
    draft: "border-rule text-ink-soft/70 border-dashed",
    admin: "border-ink text-ink font-semibold",
    author: "border-accent text-accent",
    reader: "border-rule text-ink-soft",
  };

  const currentStyle = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-meta border rounded-[2px] bg-transparent select-none",
        currentStyle,
        className
      )}
    >
      {children}
    </span>
  );
}
