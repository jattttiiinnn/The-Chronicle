import fs from 'fs';
import { mockPosts } from '../src/mocks/data.js';
import { CATEGORIES } from '../src/config/site.js';

// Canonical origin for <loc> entries. Set SITE_URL on the host (e.g. your
// Render URL) so the sitemap points at the domain that actually serves the site.
const SITE_URL = (process.env.SITE_URL || 'https://chronicle.press').replace(/\/$/, '');

// Filter only published posts
const publishedPosts = mockPosts.filter((p) => p.status === 'published');

// Extract unique tags
const tagSet = new Set();
publishedPosts.forEach((p) => {
  if (Array.isArray(p.tags)) {
    p.tags.forEach((t) => tagSet.add(t.toLowerCase().replace(/^#/, '')));
  }
});
const tags = Array.from(tagSet);

// Build sitemap XML
const urls = [];

// 1. Home
urls.push(`
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

// 2. Categories
CATEGORIES.forEach((cat) => {
  urls.push(`
  <url>
    <loc>${SITE_URL}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// 3. Tags
tags.forEach((tag) => {
  urls.push(`
  <url>
    <loc>${SITE_URL}/tag/${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`);
});

// 4. Published Posts
publishedPosts.forEach((post) => {
  const dateStr = (post.publishedAt || post.createdAt || new Date().toISOString()).split('T')[0];
  urls.push(`
  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', sitemapXml.trim(), 'utf8');
console.log(`Generated public/sitemap.xml with ${urls.length} entries.`);

// Also generate public/meta-cache.json for edge function fallback
const metaCache = {};
publishedPosts.forEach((p) => {
  metaCache[p.slug] = {
    title: p.title,
    excerpt: p.excerpt,
    coverUrl: p.coverUrl,
    publishedAt: p.publishedAt,
    authorName: 'Editorial Staff',
    categories: p.categories || ['Essays'],
    tags: p.tags || []
  };
});

fs.writeFileSync('public/meta-cache.json', JSON.stringify(metaCache, null, 2), 'utf8');
console.log(`Generated public/meta-cache.json with ${Object.keys(metaCache).length} cached post records.`);
