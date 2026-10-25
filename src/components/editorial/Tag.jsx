import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';

export function Tag({ name, href, className = '' }) {
  const formatted = name.startsWith('#') ? name : `#${name}`;
  const classes = cn(
    "font-mono text-xs uppercase tracking-meta text-ink-soft hover:text-accent transition-colors duration-150 inline-block",
    className
  );

  if (href) {
    return (
      <Link to={href} className={classes}>
        {formatted}
      </Link>
    );
  }

  return <span className={classes}>{formatted}</span>;
}
