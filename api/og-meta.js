// Vercel Serverless / Edge Function for Social & Crawler Bot Meta Interception
import fs from 'fs';
import path from 'path';

const BOT_USER_AGENTS = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|slackbot|whatsapp|telegrambot|linkedinbot|discordbot|applebot/i;
const SITE_NAME = 'THE CHRONICLE';
const SITE_URL = 'https://chronicle.press';

export default async function handler(req, res) {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BOT_USER_AGENTS.test(userAgent);
  const slug = req.query.slug || (req.url || '').split('/').pop()?.split('?')[0];

  // If not a crawler, serve regular SPA or pass through
  if (!isBot) {
    return res.redirect(302, `/posts/${slug}`);
  }

  let post = null;

  // 1. Try real API if configured
  const apiUrl = process.env.VITE_API_URL || process.env.API_URL;
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/posts/${slug}`);
      if (response.ok) {
        post = await response.json();
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Demo / Mock Mode Fallback: read from pre-cached seed data
  if (!post) {
    try {
      const cachePath = path.join(process.cwd(), 'public', 'meta-cache.json');
      if (fs.existsSync(cachePath)) {
        const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        post = cache[slug];
      }
    } catch (e) {}
  }

  const title = post ? `${post.title} — ${SITE_NAME}` : `${SITE_NAME} — An Independent Journal`;
  const description = post ? (post.excerpt || post.title) : 'An independent digital journal of essays, culture, critical inquiry, and ideas unfolded.';
  const image = post?.coverUrl || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80';
  const postUrl = `${SITE_URL}/posts/${slug}`;
  const publishedDate = post?.publishedAt || new Date().toISOString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${postUrl}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${postUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="article:published_time" content="${publishedDate}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${postUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${image}" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ${JSON.stringify(post?.title || title)},
    "description": ${JSON.stringify(description)},
    "image": [${JSON.stringify(image)}],
    "datePublished": ${JSON.stringify(publishedDate)},
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": ${JSON.stringify(postUrl)}
    }
  }
  </script>
</head>
<body>
  <h1>${escapeHtml(post?.title || title)}</h1>
  <p>${escapeHtml(description)}</p>
  <a href="${postUrl}">View story on ${SITE_NAME}</a>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
