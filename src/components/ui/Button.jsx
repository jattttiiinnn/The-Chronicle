import React from 'react';
import { cn } from '../../utils/cn.js';

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'solid', // 'solid' | 'accent' | 'outline' | 'destructive' | 'link'
    size = 'md',       // 'sm' | 'md' | 'lg'
    className = '',
    disabled = false,
    type = 'button',
    onClick,
    ...props
  },
  ref
) {
  const baseStyles = "inline-flex items-center justify-center font-sans font-semibold tracking-wider uppercase transition-colors duration-150 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-[0.8125rem]",
    lg: "px-7 py-3.5 text-sm",
  };

  const variantStyles = {
    solid: "bg-ink text-paper hover:bg-ink-soft active:bg-ink",
    accent: "bg-accent text-white hover:opacity-90 active:opacity-100",
    outline: "border border-rule text-ink bg-transparent hover:bg-paper-2 active:bg-paper",
    destructive: "border border-destructive text-destructive bg-transparent hover:bg-destructive hover:text-white transition-colors duration-150",
    link: "text-accent bg-transparent p-0 underline underline-offset-4 hover:opacity-80 font-normal capitalize tracking-normal",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        baseStyles,
        variant !== 'link' && sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
