import DOMPurify from 'dompurify';

/**
 * Validates and sanitizes link and media URLs
 * Disallows javascript:, vbscript:, and arbitrary data: protocols
 */
export function sanitizeUrl(url = '') {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  // Strip invisible control characters
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  const lower = sanitized.toLowerCase();

  // Block dangerous script execution protocols
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    (lower.startsWith('data:') && !lower.startsWith('data:image/'))
  ) {
    return '#blocked-unsafe-protocol';
  }

  return sanitized;
}

/**
 * Strict sanitizer for user-authored Markdown & HTML output
 * Strips script tags, unsafe protocols (javascript:), inline execution handlers
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i',
      'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'a', 'img', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
}
