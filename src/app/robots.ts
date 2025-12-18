/**
 * HOTMESS LONDON - Robots.txt Generator
 * Controls search engine crawling
 * 
 * Note: This file was for Next.js. For Vite, create a static public/robots.txt instead.
 */

// Removed Next.js dependency
// import { MetadataRoute } from 'next';

export default function robots() {
  const baseUrl = 'https://hotmess.london';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/account/*',
          '/settings/*',
          '/api/*',
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'GPTBot', // OpenAI's crawler
        disallow: '/', // Block AI scraping if desired
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
