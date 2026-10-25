/**
 * Slugify text: lowercase, ASCII transliteration, hyphens, collapse repeats, trim.
 * No external dependencies.
 */
export function slugify(text = '') {
  if (!text || typeof text !== 'string') return '';

  return text
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // keep only alphanumeric, space, hyphen
    .trim()
    .replace(/[\s_]+/g, '-') // replace whitespace & underscore with hyphen
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // strip leading/trailing hyphens
}
