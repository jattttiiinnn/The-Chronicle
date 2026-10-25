import React from 'react';
import { Badge } from '../ui/Badge.jsx';

export function AuthorBox({ author }) {
  if (!author) return null;

  return (
    <div className="my-12 p-6 md:p-8 bg-paper-2 border border-rule rounded-[2px] flex flex-col sm:flex-row items-start gap-6">
      {author.avatarUrl && (
        <img
          src={author.avatarUrl}
          alt={author.name}
          width={80}
          height={80}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border border-rule flex-shrink-0"
        />
      )}
      <div className="space-y-2 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display font-bold text-lg sm:text-xl text-ink">
            {author.name}
          </h3>
          {author.role && (
            <Badge variant={author.role}>
              {author.role}
            </Badge>
          )}
        </div>
        {author.bio && (
          <p className="font-serif italic text-sm text-ink-soft leading-relaxed">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
}
