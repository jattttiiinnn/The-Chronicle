/**
 * Lightweight class names helper
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
