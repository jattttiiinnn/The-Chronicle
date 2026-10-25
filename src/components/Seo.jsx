import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_CONFIG } from '../config/site.js';

export function Seo({
  title,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.defaultCover,
  type = 'website',
  canonicalUrl,
  preloadImage,
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — An Independent Journal`;
  const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {preloadImage && <link rel="preload" as="image" href={preloadImage} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
