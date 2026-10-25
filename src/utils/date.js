/**
 * Calculate week number of the year (1-52)
 */
export function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Format issue line: VOL. 01 — NO. {week} — {MONTH DD, YYYY}
 */
export function getIssueLine(volume = 'VOL. 01') {
  const now = new Date();
  const week = String(getWeekNumber(now)).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const day = String(now.getDate()).padStart(2, '0');
  const year = now.getFullYear();

  return `${volume} — NO. ${week} — ${month} ${day}, ${year}`;
}

/**
 * Format publication date in editorial style: OCTOBER 25, 2026
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Calculate reading time in minutes from word count
 */
export function getReadingTime(text = '') {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${minutes} MIN READ`;
}
