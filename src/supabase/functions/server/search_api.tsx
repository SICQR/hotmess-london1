/**
 * HOTMESS Global Search API
 * Search across beacons, records, products, events, venues, and more
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.tsx';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();
app.use('*', cors());

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export interface SearchResult {
  id: string;
  type: 'beacon' | 'release' | 'product' | 'event' | 'venue' | 'show' | 'vendor';
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  route: string; // Navigation route
  routeParams?: Record<string, string>;
  metadata?: Record<string, any>;
  relevanceScore?: number;
}

/**
 * GET /search - Universal search endpoint
 */
app.get('/', async (c) => {
  try {
    const query = c.req.query('q')?.toLowerCase().trim();
    const type = c.req.query('type'); // Optional filter: 'beacon', 'release', 'product', etc.
    const limit = parseInt(c.req.query('limit') || '50');

    if (!query) {
      return c.json({ error: 'Query parameter required' }, 400);
    }

    console.log(`🔍 Search query: "${query}", type: ${type || 'all'}`);

    const results: SearchResult[] = [];

    // Search beacons
    if (!type || type === 'beacon') {
      const beacons = await searchBeacons(query);
      results.push(...beacons);
    }

    // Search records/releases
    if (!type || type === 'release') {
      const releases = await searchReleases(query);
      results.push(...releases);
    }

    // Search marketplace products
    if (!type || type === 'product') {
      const products = await searchMarketplaceProducts(query);
      results.push(...products);
    }

    // Search events/tickets
    if (!type || type === 'event') {
      const events = await searchEvents(query);
      results.push(...events);
    }

    // Search radio shows
    if (!type || type === 'show') {
      const shows = await searchShows(query);
      results.push(...shows);
    }

    // Search vendors
    if (!type || type === 'vendor') {
      const vendors = await searchVendors(query);
      results.push(...vendors);
    }

    // Sort by relevance score (if available)
    results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    // Apply limit
    const limited = results.slice(0, limit);

    return c.json({
      success: true,
      query,
      results: limited,
      total: limited.length,
      hasMore: results.length > limit
    });

  } catch (error: any) {
    console.error('❌ Search error:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Search beacons
 */
async function searchBeacons(query: string): Promise<SearchResult[]> {
  try {
    const allBeacons = await kv.getByPrefix<any>('beacon:');
    const results: SearchResult[] = [];

    for (const beacon of allBeacons) {
      const score = calculateRelevance(query, [
        beacon.name,
        beacon.description,
        beacon.code,
        beacon.location?.venue,
        beacon.location?.city,
        ...(beacon.tags || [])
      ]);

      if (score > 0) {
        results.push({
          id: beacon.code,
          type: 'beacon',
          title: beacon.name,
          description: beacon.description,
          imageUrl: beacon.imageUrl,
          tags: beacon.tags,
          route: 'beaconScan',
          routeParams: { code: beacon.code },
          metadata: {
            xpReward: beacon.xpReward,
            location: beacon.location
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Beacon search error:', error);
    return [];
  }
}

/**
 * Search releases/records
 */
async function searchReleases(query: string): Promise<SearchResult[]> {
  try {
    const allRecords = await kv.getByPrefix<any>('record:');
    const results: SearchResult[] = [];

    for (const record of allRecords) {
      const score = calculateRelevance(query, [
        record.title,
        record.artist,
        record.tagline,
        ...(record.tags || [])
      ]);

      if (score > 0) {
        results.push({
          id: record.slug,
          type: 'release',
          title: record.title,
          description: `by ${record.artist}`,
          imageUrl: record.coverUrl,
          tags: record.tags,
          route: 'recordsRelease',
          routeParams: { slug: record.slug },
          metadata: {
            artist: record.artist,
            releaseDate: record.releaseDate,
            type: record.type
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Release search error:', error);
    return [];
  }
}

/**
 * Search marketplace products
 */
async function searchMarketplaceProducts(query: string): Promise<SearchResult[]> {
  try {
    const allListings = await kv.getByPrefix<any>('listing:');
    const results: SearchResult[] = [];

    for (const listing of allListings) {
      if (listing.status !== 'active') continue;

      const score = calculateRelevance(query, [
        listing.title,
        listing.description,
        listing.category,
        listing.public_brand_name,
        ...(listing.tags || [])
      ]);

      if (score > 0) {
        results.push({
          id: listing.id,
          type: 'product',
          title: listing.title,
          description: listing.description,
          imageUrl: listing.media?.[0]?.storage_path,
          tags: listing.tags,
          route: 'messmarketProduct',
          routeParams: { slug: listing.slug || listing.id },
          metadata: {
            price: listing.price_pence,
            currency: listing.currency,
            category: listing.category
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Product search error:', error);
    return [];
  }
}

/**
 * Search events/tickets
 */
async function searchEvents(query: string): Promise<SearchResult[]> {
  try {
    // Mock implementation - replace with actual event data
    const mockEvents = [
      {
        id: 'klub-mess-001',
        title: 'KLUB MESS',
        description: 'Weekly Thursday night at The Glory',
        imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
        tags: ['club', 'recurring', 'hackney'],
        venue: 'The Glory'
      },
      {
        id: 'mess-fest-2025',
        title: 'MESS FEST 2025',
        description: 'Annual summer festival',
        imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        tags: ['festival', 'outdoor', 'summer'],
        venue: 'Victoria Park'
      }
    ];

    const results: SearchResult[] = [];

    for (const event of mockEvents) {
      const score = calculateRelevance(query, [
        event.title,
        event.description,
        event.venue,
        ...(event.tags || [])
      ]);

      if (score > 0) {
        results.push({
          id: event.id,
          type: 'event',
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl,
          tags: event.tags,
          route: 'tickets',
          metadata: {
            venue: event.venue
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Event search error:', error);
    return [];
  }
}

/**
 * Search radio shows
 */
async function searchShows(query: string): Promise<SearchResult[]> {
  try {
    // Mock implementation - replace with actual show data
    const mockShows = [
      {
        id: 'wake-the-mess',
        slug: 'wake-the-mess',
        title: 'Wake the Mess',
        description: 'Morning growl. Coffee, sweat, sin remnants.',
        tags: ['morning', 'weekday'],
        host: 'DJ Dominik'
      },
      {
        id: 'dial-daddy',
        slug: 'dial-daddy',
        title: 'Dial Daddy',
        description: 'Call-in show for queer advice and realness',
        tags: ['talk', 'advice', 'live'],
        host: 'Marcus Ray'
      }
    ];

    const results: SearchResult[] = [];

    for (const show of mockShows) {
      const score = calculateRelevance(query, [
        show.title,
        show.description,
        show.host,
        ...(show.tags || [])
      ]);

      if (score > 0) {
        results.push({
          id: show.id,
          type: 'show',
          title: show.title,
          description: show.description,
          tags: show.tags,
          route: 'radioShow',
          routeParams: { slug: show.slug },
          metadata: {
            host: show.host
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Show search error:', error);
    return [];
  }
}

/**
 * Search vendors
 */
async function searchVendors(query: string): Promise<SearchResult[]> {
  try {
    const allVendors = await kv.getByPrefix<any>('vendor:');
    const results: SearchResult[] = [];

    for (const vendor of allVendors) {
      if (vendor.status !== 'approved') continue;

      const score = calculateRelevance(query, [
        vendor.display_name,
        vendor.bio,
        vendor.categories?.join(' '),
        vendor.city
      ]);

      if (score > 0) {
        results.push({
          id: vendor.id,
          type: 'vendor',
          title: vendor.display_name,
          description: vendor.bio,
          tags: vendor.categories,
          route: 'vendorProfile',
          routeParams: { vendorId: vendor.id },
          metadata: {
            city: vendor.city,
            whiteLabel: vendor.white_label_enabled
          },
          relevanceScore: score
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Vendor search error:', error);
    return [];
  }
}

/**
 * Calculate relevance score for search
 */
function calculateRelevance(query: string, fields: (string | undefined)[]): number {
  let score = 0;
  const queryWords = query.toLowerCase().split(/\s+/);

  for (const field of fields) {
    if (!field) continue;
    const fieldLower = field.toLowerCase();

    for (const word of queryWords) {
      // Exact match: highest score
      if (fieldLower === word) {
        score += 100;
      }
      // Starts with: high score
      else if (fieldLower.startsWith(word)) {
        score += 50;
      }
      // Contains: medium score
      else if (fieldLower.includes(word)) {
        score += 25;
      }
    }
  }

  return score;
}

export default app;
