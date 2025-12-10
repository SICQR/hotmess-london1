/**
 * HOTMESS LONDON - Robots.txt Generator
 * Controls search engine crawling
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
