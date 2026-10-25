import React from 'react';
import { cn } from '../../utils/cn.js';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn("bg-paper-2 animate-pulse", className)}
      {...props}
    />
  );
}

export function SkeletonPostCard({ variant = 'standard' }) {
  if (variant === 'lead') {
    return (
      <div className="flex flex-col gap-4 pb-8 border-b border-rule">
        <Skeleton className="w-full aspect-[16/9]" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-4 py-4 border-b border-rule">
        <Skeleton className="h-6 w-8 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="grid grid-cols-12 gap-4 py-6 border-b border-rule">
        <div className="col-span-4">
          <Skeleton className="w-full aspect-[4/3]" />
        </div>
        <div className="col-span-8 flex flex-col gap-2.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-32 mt-auto" />
        </div>
      </div>
    );
  }

  // standard
  return (
    <div className="flex flex-col gap-3 pb-6 border-b border-rule">
      <Skeleton className="w-full aspect-[16/9]" />
      <Skeleton className="h-3.5 w-20 mt-1" />
      <Skeleton className="h-6 w-11/12" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-36 mt-2" />
    </div>
  );
}
