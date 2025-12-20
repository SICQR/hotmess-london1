/**
 * Frontend API for Global Search
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

export type SearchResultType = 'beacon' | 'release' | 'product' | 'event' | 'venue' | 'show' | 'vendor';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  route: string;
  routeParams?: Record<string, string>;
  metadata?: Record<string, any>;
  relevanceScore?: number;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-a670c824/api/search`;

/**
 * Search across all content types
 */
export async function search(
  query: string,
  options?: {
    type?: SearchResultType;
    limit?: number;
  }
): Promise<{
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}> {
  const params = new URLSearchParams({ q: query });
  if (options?.type) params.set('type', options.type);
  if (options?.limit) params.set('limit', options.limit.toString());

  const url = `${API_BASE}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return {
    results: data.results || [],
    total: data.total || 0,
    hasMore: data.hasMore || false,
  };
}

// Icon mapping for result types
export const RESULT_TYPE_ICONS: Record<SearchResultType, string> = {
  beacon: '📍',
  release: '🎵',
  product: '🛍️',
  event: '🎟️',
  venue: '🏛️',
  show: '📻',
  vendor: '🏪',
};

// Color mapping for result types
export const RESULT_TYPE_COLORS: Record<SearchResultType, string> = {
  beacon: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
  release: 'from-pink-500/20 to-red-500/20 border-pink-500/30',
  product: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  event: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30',
  venue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  show: 'from-red-500/20 to-pink-500/20 border-red-500/30',
  vendor: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
};

// Label mapping for result types
export const RESULT_TYPE_LABELS: Record<SearchResultType, string> = {
  beacon: 'Beacon',
  release: 'Release',
  product: 'Product',
  event: 'Event',
  venue: 'Venue',
  show: 'Radio Show',
  vendor: 'Vendor',
};
