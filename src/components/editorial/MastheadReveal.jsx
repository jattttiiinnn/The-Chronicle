import React, { useState, useEffect, useCallback } from 'react';

export function MastheadReveal() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      const alreadyRevealed = sessionStorage.getItem('chronicle_revealed');
      if (!alreadyRevealed) {
        setIsActive(true);
        sessionStorage.setItem('chronicle_revealed', 'true');
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = () => handleDismiss();
    window.addEventListener('keydown', onKeyDown, { once: true });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isActive, handleDismiss]);

  if (!isActive) return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={handleDismiss}
      className="fixed inset-0 z-50 pointer-events-auto cursor-pointer overflow-hidden flex select-none"
    >
      {/* Left Parting Panel */}
      <div
        onAnimationEnd={handleDismiss}
        className="w-1/2 h-full bg-paper border-r border-rule flex items-center justify-end pr-4 animate-reveal-left"
      >
        <span className="font-serif font-black text-2xl sm:text-4xl text-ink tracking-tight opacity-30 uppercase">
          The
        </span>
      </div>

      {/* Right Parting Panel */}
      <div
        className="w-1/2 h-full bg-paper border-l border-rule flex items-center justify-start pl-4 animate-reveal-right"
      >
        <span className="font-serif font-black text-2xl sm:text-4xl text-ink tracking-tight opacity-30 uppercase">
          Chronicle
        </span>
      </div>
    </div>
  );
}
