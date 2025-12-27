/// <reference lib="webworker" />

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
};

precacheAndRoute(self.__WB_MANIFEST);

// Cache Mapbox Tiles/Styles for 30 days
registerRoute(
  ({ url }) => url.host === 'api.mapbox.com',
  new CacheFirst({ cacheName: 'mapbox-cache' }),
);

// NetworkFirst for live Beacon data (fallback to last-known heat)
registerRoute(
  ({ url }) => url.pathname.includes('/rest/v1/beacons'),
  new NetworkFirst({ cacheName: 'beacon-pulse-cache' }),
);
