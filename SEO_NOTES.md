# SEO & Crawler Metadata Architecture: The Chronicle

This document outlines the SEO implementation, crawler metadata strategy, and backend integration requirements for **The Chronicle** digital publication.

---

## 1. The Core Challenge: The Known SPA Limitation

Modern Single Page Applications (SPAs) built with React and Vite deliver a single root HTML document (`index.html`) containing an empty application root (`<div id="root"></div>`). Client-side libraries such as `react-helmet-async` dynamically manipulate `<head>` elements in the browser DOM upon route transitions.

While modern search engine bots (such as Googlebot) execute client-side JavaScript, **social sharing crawlers and messaging scrapers do not run client JavaScript**. These include:
* **Twitter / X:** `Twitterbot/1.0`
* **Facebook / Meta / Instagram:** `facebookexternalhit/1.1`
* **LinkedIn:** `LinkedInBot/1.0`
* **Slack:** `Slackbot-LinkExpanding 1.0`
* **Discord:** `Discordbot/2.0`
* **WhatsApp & Telegram:** `WhatsApp/2.0`, `TelegramBot`
* **Apple Messages:** `Applebot`

When a link to `/posts/architecture-of-the-printed-page` is pasted into Twitter, Slack, or LinkedIn, the scraper requests the raw HTML over HTTP without evaluating JavaScript. In a naive SPA, it reads only the fallback static `<title>THE CHRONICLE</title>` and fails to generate a rich card with the article's specific headline, deck, and cover photography.

---

## 2. Chosen Solution: Vercel Edge Middleware & Metadata Proxy

To solve this without abandoning the lightweight Vite/React architecture, we implement an **Edge Middleware & Metadata Proxy** (`middleware.js` and `api/og-meta.js`).

### Architecture & Request Flow
```
User / Bot Request: /posts/:slug
         │
         ▼
[Vercel Edge Layer / middleware.js]
         │
    Is User-Agent
   a known crawler?
      ├── NO (Human Browser) ────────> Passes through to Vite SPA (/index.html)
      │                                (Instant client-side React hydration)
      │
      └── YES (Bot / Social Scraper) ─> Evaluates api/og-meta.js
                                        - Resolves post metadata
                                        - Returns static minimal HTML:
                                          * <title>
                                          * <meta property="og:*">
                                          * <meta name="twitter:*">
                                          * <link rel="canonical">
                                          * <script type="application/ld+json">
```

### Architectural Trade-offs
1. **vs. Full HTML Prerendering (e.g. Prerender.io / Puppeteer Build Snapshotting):**
   * *Prerendering:* Requires running headless Chrome during build or paying an external SaaS proxy to render body content. Prerendering full body text can lead to DOM hydration mismatches or stale cached HTML when posts are updated.
   * *Edge Meta Proxy:* Responds in $<20\text{ms}$ with zero DOM hydration complexity. Search engines that render JS receive the full reactive experience, while social cards are 100% reliable.
2. **vs. Next.js Migration (SSG / App Router):**
   * *Next.js:* Offers native SSR/ISR out of the box. However, migrating an existing Vite React 18 codebase requires rewriting the routing model, replacing client data queries with server components, and adopting Next.js-specific build infrastructure.
   * *Edge Meta Proxy:* Delivers the exact same social card fidelity while retaining the speed, simplicity, and standalone DX of Vite.

---

## 3. Dual-Mode Resolution: Mock Fallback vs. Real Backend API

### When Running Against the Real Backend (`VITE_API_URL` configured)
The serverless function queries the live REST endpoint:
```http
GET ${VITE_API_URL}/api/posts/:slug
```
It reads the live `title`, `excerpt`, `coverUrl`, `publishedAt`, and author details directly from MongoDB/Express, ensuring social cards update the second an author edits a story.

### When Running in Standalone Mock Mode (`VITE_API_URL` empty)
In mock mode, the API lives entirely inside browser memory and `localStorage`. A serverless edge function running on Vercel's servers cannot read a client's local browser storage.
* **Fallback Implementation:** During the build step (`npm run build`), `scripts/generate-sitemap.js` generates `public/meta-cache.json` containing the pre-rendered metadata catalog of all seed stories.
* The edge function seamlessly falls back to `public/meta-cache.json` if `VITE_API_URL` is unset or unreachable.

---

## 4. Verification & Testing Procedures

### A. Testing with `curl` using Crawler User-Agents
To verify crawler responses locally or against production, send a request with a crawler User-Agent header:

```bash
# 1. Test as Twitterbot
curl -i -A "Twitterbot/1.0" http://localhost:5173/posts/architecture-of-the-printed-page

# 2. Test as Facebook External Hit
curl -i -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" https://your-deployment.vercel.app/posts/architecture-of-the-printed-page

# 3. Test as Slackbot
curl -i -A "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)" https://your-deployment.vercel.app/posts/architecture-of-the-printed-page
```

**Expected Response:**
* HTTP status `200 OK`.
* Content-Type: `text/html; charset=utf-8`.
* Clean `<head>` containing:
  * `<title>The Architecture of the Printed Page in the Digital Era — THE CHRONICLE</title>`
  * `<meta property="og:type" content="article" />`
  * `<meta property="og:title" content="..." />`
  * `<meta property="og:image" content="https://images.unsplash.com/..." />`
  * `<meta name="twitter:card" content="summary_large_image" />`
  * `<link rel="canonical" href="https://chronicle.press/posts/architecture-of-the-printed-page" />`

### B. Online Social Debuggers
When deployed to a public URL:
1. **Twitter / X Card Validator:** Paste article URL to preview summary large image card.
2. **Facebook Sharing Debugger:** `https://developers.facebook.com/tools/debug/` — verifies `og:image`, `og:title`, and `og:description`.
3. **LinkedIn Post Inspector:** `https://www.linkedin.com/post-inspector/` — inspects title, image dimensions, and publisher attributes.

---

## 5. Next.js Migration Stretch Path (Phase 2+)

If the publication scales to hundreds of thousands of daily visitors or requires full-text server rendering for non-JS search engines (e.g. Baidu, Yandex), migrating to Next.js SSG / ISR represents the logical architectural evolution:
1. **Incremental Static Regeneration (ISR):**
   * Pre-render popular posts at build time (`getStaticPaths`).
   * Revalidate stale posts on-demand via webhook upon editor save (`revalidatePath('/posts/:slug')`).
2. **Dynamic Route Segment Config:**
   * Use Next.js `generateMetadata({ params })` to export dynamic Open Graph tags natively without edge redirects.
3. **Server Components:**
   * Offload Markdown parsing (`react-markdown` + `rehype-highlight`) to the Node runtime, streaming static HTML to the client and reducing client JavaScript bundle size to $<50\text{kB}$.

---

## 6. Backend Integration Responsibilities

When connecting the frontend to a real backend gateway (`VITE_API_URL`):
1. **Dynamic `sitemap.xml`:** The backend must expose `GET /sitemap.xml` or write to a shared CDN bucket, reflecting real-time published, scheduled, and updated folios with accurate `<lastmod>` timestamps.
2. **Canonical Host Header:** The backend should ensure all absolute links use the configured production domain (e.g. `https://chronicle.press`).
3. **Cache-Control Headers:**
   * Public posts API: `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`.
   * User/Dashboard API: `Cache-Control: private, no-cache, no-store`.
