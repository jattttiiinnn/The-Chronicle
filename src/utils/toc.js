/**
 * Table of Contents & Heading ID Generator Utility
 * Pure JavaScript, zero new dependencies, handles collisions/duplicates.
 */

export function slugifyHeading(text = '') {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // Remove special punctuation
    .replace(/[\s_-]+/g, '-')       // Swap spaces/underscores for single dash
    .replace(/^-+|-+$/g, '') || 'heading'; // Trim leading/trailing dashes
}

/**
 * Creates a stateful slug generator to guarantee identical IDs between
 * markdown heading extraction and DOM heading elements.
 */
export function createHeadingIdGenerator() {
  const seen = new Map();

  return function generateId(rawText = '') {
    const baseSlug = slugifyHeading(rawText);
    const count = seen.get(baseSlug) || 0;
    seen.set(baseSlug, count + 1);

    if (count === 0) {
      return baseSlug;
    }
    return `${baseSlug}-${count}`;
  };
}

/**
 * Extracts h2 and h3 headings from Markdown text
 * @param {string} markdown
 * @returns {Array<{ id: string, title: string, level: number }>}
 */
export function extractHeadings(markdown = '') {
  if (!markdown) return [];

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings = [];
  const generateId = createHeadingIdGenerator();
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const hashes = match[1];
    const rawTitle = match[2].trim();
    // Strip markdown formatting from heading text if any (e.g. bold, italics, backticks)
    const cleanTitle = rawTitle
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');

    const level = hashes.length; // 2 for h2, 3 for h3
    const id = generateId(cleanTitle);

    headings.push({
      id,
      title: cleanTitle,
      level,
    });
  }

  return headings;
}
