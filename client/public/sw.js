// Service Worker for Destiny Hacking PWA
const CACHE_NAME = 'destiny-hacking-v2';
const RUNTIME_CACHE = 'destiny-hacking-runtime-v2';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first for all requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Skip caching Vite dev server assets (node_modules, @vite, @fs, @react-refresh, HMR)
  if (
    url.pathname.includes('node_modules') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('.vite') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('__vite')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // For navigation requests, try network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/') || caches.match(request);
        })
    );
    return;
  }

  // For static assets (images, fonts, etc.), use stale-while-revalidate
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from client (for notification scheduling)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const { hour, minute } = event.data;
    console.log(`Reminder scheduled for ${hour}:${minute}`);
  } else if (event.data && event.data.type === 'CANCEL_REMINDER') {
    console.log('Reminder cancelled');
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Destiny Hacking';
  const options = {
    body: data.body || 'Time for your daily practice',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-slider-states') {
    event.waitUntil(syncSliderStates());
  }
});

async function syncSliderStates() {
  console.log('Syncing slider states...');
}
