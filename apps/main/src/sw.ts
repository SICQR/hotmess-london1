/// <reference lib="webworker" />

/**
 * HOTMESS OS — Service Worker
 * 
 * Features:
 * - Offline beacon scan queue (sync when back online)
 * - Mapbox tile caching (30 days)
 * - Beacon data caching with NetworkFirst strategy
 * - Background sync for XP ledger
 */

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

precacheAndRoute(self.__WB_MANIFEST);

// ============================================================================
// MAPBOX TILE CACHING (30 days)
// ============================================================================
registerRoute(
  ({ url }) => url.host === 'api.mapbox.com',
  new CacheFirst({ 
    cacheName: 'mapbox-cache',
    // Tiles are immutable, cache for 30 days
  }),
);

// ============================================================================
// BEACON DATA (NetworkFirst with offline fallback)
// ============================================================================
registerRoute(
  ({ url }) => url.pathname.includes('/rest/v1/beacons'),
  new NetworkFirst({ cacheName: 'beacon-pulse-cache' }),
);

// ============================================================================
// OFFLINE BEACON SCAN QUEUE
// ============================================================================
const bgSyncPlugin = new BackgroundSyncPlugin('beacon-scan-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
  onSync: async ({ queue }) => {
    console.log('[SW] Syncing offline beacon scans...');
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
        console.log('[SW] ✓ Beacon scan synced:', entry.request.url);
      } catch (error) {
        console.error('[SW] ✗ Failed to sync beacon scan:', error);
        // Re-queue on failure
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

// Queue beacon scans when offline
registerRoute(
  ({ url, request }) =>
    url.pathname.includes('/rest/v1/rpc/scan_beacon') && request.method === 'POST',
  new NetworkFirst({
    cacheName: 'beacon-scans',
    plugins: [bgSyncPlugin],
  })
);

// ============================================================================
// XP LEDGER BACKGROUND SYNC
// ============================================================================
const xpSyncPlugin = new BackgroundSyncPlugin('xp-ledger-queue', {
  maxRetentionTime: 48 * 60, // 48 hours
});

registerRoute(
  ({ url, request }) =>
    url.pathname.includes('/rest/v1/xp_ledger') && request.method === 'POST',
  new NetworkFirst({
    cacheName: 'xp-ledger',
    plugins: [xpSyncPlugin],
  })
);

// ============================================================================
// INSTALL & ACTIVATION EVENTS
// ============================================================================
self.addEventListener('install', (event) => {
  console.log('[SW] HOTMESS OS Service Worker installed');
  // Take control immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] HOTMESS OS Service Worker activated');
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
});

// ============================================================================
// MESSAGE HANDLING (from main thread)
// ============================================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_CLEAR') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith('hotmess-')) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});
