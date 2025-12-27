/**
 * HOTMESS LONDON - SEO Utilities
 * Meta tags, Open Graph, structured data, and SEO helpers
 */

// NOTE: This app is Vite/React (not Next.js). We keep the public API of this
// module but provide a lightweight local `Metadata` type.
export type Metadata = Record<string, any>;

// Base SEO configuration
const BASE_URL = 'https://hotmess.london';
const SITE_NAME = 'HOTMESS LONDON';
const DEFAULT_TITLE = 'HOTMESS LONDON | Masculine Nightlife OS';
const DEFAULT_DESCRIPTION = 'Men-only. 18+. The nightlife OS built for real connection. Radio, events, beacons, marketplace, and community for queer men.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = '@hotmesslondon';

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  url?: string;
  noIndex?: boolean;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
}

/**
 * Generate Next.js metadata object with full SEO tags
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    imageAlt = 'HOTMESS LONDON - Masculine Nightlife OS',
    type = 'website',
    url,
    noIndex = false,
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
  } = config;

  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | HOTMESS`;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  return {
    title: fullTitle,
    description,
    keywords: [
      'queer nightlife',
      'gay events london',
      'mens only events',
      'kink community',
      'lgbtq nightlife',
      'gay radio',
      'queer marketplace',
      ...keywords,
    ],
    authors: author ? [{ name: author }] : undefined,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    
    // Robots
    robots: noIndex ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: 'en_GB',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: fullTitle,
      description,
      images: [image],
    },

    // Additional
    alternates: {
      canonical: fullUrl,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    themeColor: '#FF006E', // HOTMESS hot pink
  };
}

/**
 * Generate structured data (JSON-LD) for rich snippets
 */
export function generateStructuredData(type: 'Organization' | 'Event' | 'Product' | 'Article', data: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseSchema,
        '@type': 'Organization',
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
          'https://twitter.com/hotmesslondon',
          'https://instagram.com/hotmesslondon',
          'https://t.me/hotmesslondon',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'hello@hotmess.london',
        },
      };

    case 'Event':
      return {
        ...baseSchema,
        '@type': 'Event',
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: {
          '@type': 'Place',
          name: data.venueName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.venueAddress,
            addressLocality: 'London',
            addressCountry: 'GB',
          },
        },
        image: data.image,
        organizer: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: BASE_URL,
        },
        offers: data.price ? {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'GBP',
          availability: 'https://schema.org/InStock',
        } : undefined,
      };

    case 'Product':
      return {
        ...baseSchema,
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          '@type': 'Brand',
          name: data.brand || SITE_NAME,
        },
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: data.currency || 'GBP',
          availability: data.inStock 
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount || 0,
        } : undefined,
      };

    case 'Article':
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        description: data.description,
        image: data.image,
        author: {
          '@type': 'Person',
          name: data.author || SITE_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${BASE_URL}/logo.png`,
          },
        },
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime || data.publishedTime,
      };

    default:
      return baseSchema;
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * SEO-optimized page titles by route
 */
export const PAGE_TITLES: Record<string, string> = {
  // Core
  home: 'HOTMESS LONDON | Masculine Nightlife OS',
  about: 'About Us | HOTMESS',
  
  // Nightlife
  tickets: 'Events & Tickets | HOTMESS',
  map: 'Nightlife Map | HOTMESS',
  beacons: 'Beacons Network | HOTMESS',
  
  // Commerce
  shop: 'Shop | HOTMESS',
  messmarket: 'Marketplace | HOTMESS',
  
  // Media
  radio: 'Radio | HOTMESS',
  records: 'Records Label | HOTMESS',
  
  // Community
  connect: 'Connect | HOTMESS',
  
  // Account
  account: 'Account | HOTMESS',
  rewards: 'XP & Rewards | HOTMESS',
  drops: 'Drops | HOTMESS',
  settings: 'Settings | HOTMESS',
  
  // Admin
  admin: 'Admin Dashboard | HOTMESS',
  adminModeration: 'Moderation | Admin | HOTMESS',
  adminBeacons: 'Beacons | Admin | HOTMESS',
  adminUsers: 'Users | Admin | HOTMESS',
  adminRecords: 'Records | Admin | HOTMESS',
  
  // Legal
  legal: 'Legal & Policies | HOTMESS',
  privacy: 'Privacy Policy | HOTMESS',
  terms: 'Terms of Service | HOTMESS',
  
  // Auth
  login: 'Login | HOTMESS',
  register: 'Register | HOTMESS',
};

/**
 * SEO-optimized descriptions by route
 */
export const PAGE_DESCRIPTIONS: Record<string, string> = {
  home: 'Men-only. 18+. The nightlife OS built for real connection. Radio, events, beacons, marketplace, and community for queer men.',
  tickets: 'Discover and book tickets for mens-only nightlife events in London. Kink parties, club nights, and queer community events.',
  radio: 'Listen to HOTMESS Radio - 24/7 streaming radio for the masculine nightlife community. House, techno, and underground beats.',
  shop: 'Official HOTMESS merchandise and queer streetwear. Limited edition drops and community merch.',
  messmarket: 'Community marketplace for tickets, merch, and experiences. Buy, sell, and trade within the HOTMESS network.',
  connect: 'Connect with other members of the masculine nightlife community. Real connections, real conversations.',
  beacons: 'Discover HOTMESS beacons across London. Scan to earn XP, unlock rewards, and connect with the community.',
  rewards: 'Track your XP, level up, and unlock exclusive rewards. Earn points for engagement and participation.',
  admin: 'Admin dashboard for HOTMESS platform management. Moderation, analytics, and system controls.',
};

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

/**
 * Check if page should be indexed
 */
export function shouldIndexPage(path: string): boolean {
  const noIndexPaths = [
    '/admin',
    '/settings',
    '/account',
    '/login',
    '/register',
    '/api',
  ];
  
  return !noIndexPaths.some(noIndexPath => path.startsWith(noIndexPath));
}
