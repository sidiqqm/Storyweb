// src/service-worker.js

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache assets injected by Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Runtime caching for API story
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new StaleWhileRevalidate({
    cacheName: 'story-api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

// Caching for images (story photos)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 24 * 60 * 60 }), // 1 day
    ],
  })
);

// Caching for OpenStreetMap tiles
registerRoute(
  ({ url }) => url.hostname.includes('tile.openstreetmap.org'),
  new CacheFirst({
    cacheName: 'osm-tiles-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);



self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  return self.clients.claim();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TEST_PUSH") {
    const { title, body, url } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      data: { url },
    });
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});

// Listen for online event to trigger sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-stories') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        if (clients && clients.length) {
          clients[0].postMessage({ type: 'SYNC_PENDING_STORIES' });
        }
      })
    );
  }
});