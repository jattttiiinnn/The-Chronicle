// Crawler preview tags for single stories.
//
// On Vercel this was handled by middleware.js + api/og-meta.js at the edge.
// Render serves everything from Express, so the same HTML generator is mounted
// here as a route handler that looks the story up in Mongo directly.
import handler from '../api/og-meta.js';
import { connectDb } from './db.js';
import { Post } from './models.js';

const BOT_USER_AGENTS =
  /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|slackbot|whatsapp|telegrambot|linkedinbot|discordbot|applebot/i;

export function isCrawler(userAgent = '') {
  return BOT_USER_AGENTS.test(userAgent);
}

export async function ogPreview(req, res, next) {
  if (!isCrawler(req.headers['user-agent'] || '')) {
    // Humans get the normal SPA; let the static fallback handle it.
    return next();
  }

  const { slug } = req.params;

  try {
    await connectDb();
    const post = await Post.findOne({ slug, status: 'published' }).lean();
    if (post) {
      req.ogPost = {
        title: post.title,
        excerpt: post.excerpt,
        coverUrl: post.coverUrl,
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      };
    }
  } catch {
    // Fall through to the generic preview rather than failing the crawler.
  }

  return handler(req, res);
}
