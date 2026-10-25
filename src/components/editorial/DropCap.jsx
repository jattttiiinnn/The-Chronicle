import React from 'react';
import { cn } from '../../utils/cn.js';

export function DropCap({ children, className = '' }) {
  return (
    <div className={cn("drop-cap type-body text-ink leading-body", className)}>
      {children}
    </div>
  );
}
