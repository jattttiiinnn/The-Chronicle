// Vercel Edge Middleware for Crawler Detection & Meta Delivery
export const config = {
  matcher: '/posts/:slug*'
};

const BOT_USER_AGENTS = /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|slackbot|whatsapp|telegrambot|linkedinbot|discordbot|applebot/i;

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!BOT_USER_AGENTS.test(userAgent)) {
    // Regular human visitor: pass through to client-side Vite SPA
    return;
  }

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const slug = segments[1]; // /posts/:slug

  if (!slug) return;

  // Rewrite crawlers to the og-meta serverless handler with slug parameter
  url.pathname = '/api/og-meta';
  url.searchParams.set('slug', slug);
  return Response.redirect(url.toString(), 307);
}
