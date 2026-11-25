import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, SITE_CONFIG } from '../config/site.js';

const SITE_ORIGIN = 'https://chronicle.press';

export function Seo({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.defaultCover,
  type = 'website',
  canonicalUrl,
  preloadImage,
  noindex = false,
  publishedTime,
  author,
  jsonLd
}) {
  let locationPath = '/';
  try {
    const loc = useLocation();
    locationPath = loc.pathname || '/';
  } catch (e) {
    if (typeof window !== 'undefined') {
      locationPath = window.location.pathname || '/';
    }
  }

  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — An Independent Journal`;
  const canonical = canonicalUrl || `${SITE_ORIGIN}${locationPath}`;

  // Ensure absolute image URL
  let absoluteImage = image;
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    absoluteImage = `${SITE_ORIGIN}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  // Generate structured data if not explicitly provided
  let structuredData = jsonLd;
  if (!structuredData) {
    if (type === 'article') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title || SITE_NAME,
        description,
        image: absoluteImage ? [absoluteImage] : undefined,
        datePublished: publishedTime || undefined,
        author: [
          {
            '@type': 'Person',
            name: author || 'Editorial Staff'
          }
        ],
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_ORIGIN
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical
        }
      };
    } else if (locationPath === '/' || locationPath === '') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: `${SITE_ORIGIN}/`,
        description,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_ORIGIN}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      };
    }
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Robots indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Preload critical assets */}
      {preloadImage && (
        <link
          rel="preload"
          as="image"
          href={preloadImage}
          imagesrcset={
            preloadImage.includes('images.unsplash.com')
              ? `${preloadImage.split('?')[0]}?auto=format&fit=crop&w=480&q=75 480w, ${preloadImage.split('?')[0]}?auto=format&fit=crop&w=800&q=80 800w, ${preloadImage.split('?')[0]}?auto=format&fit=crop&w=1200&q=80 1200w`
              : undefined
          }
          imagesizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
          fetchpriority="high"
        />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      <meta property="og:url" content={canonical} />

      {/* Article specific OG metadata */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
