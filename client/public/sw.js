// Service Worker for Destiny Hacking PWA
const CACHE_NAME = 'destiny-hacking-v3';
const RUNTIME_CACHE = 'destiny-hacking-runtime-v3';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
];

// Scheduled reminder timers (in-memory, reset on SW restart)
const scheduledTimers = {};

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

  // Skip caching Vite dev server assets
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

  // For static assets, use stale-while-revalidate
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

/**
 * Calculate milliseconds until the next occurrence of a given hour:minute (local time).
 */
function msUntilNextOccurrence(hour, minute) {
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

/**
 * Schedule a daily notification at a given hour:minute.
 * Uses setTimeout to fire once, then reschedules for the next day.
 */
function scheduleDailyReminder(id, hour, minute, title, body) {
  // Clear any existing timer for this id
  if (scheduledTimers[id]) {
    clearTimeout(scheduledTimers[id]);
    delete scheduledTimers[id];
  }

  const delay = msUntilNextOccurrence(hour, minute);

  scheduledTimers[id] = setTimeout(() => {
    // Show the notification
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://dados.destinyhacking.com/images/icon-192x192.png',
      badge: 'https://dados.destinyhacking.com/images/icon-192x192.png',
      tag: id,
      renotify: true,
      data: { url: '/' },
    });

    // Reschedule for the next day
    scheduleDailyReminder(id, hour, minute, title, body);
  }, delay);
}

// Handle messages from client (for notification scheduling)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  switch (event.data.type) {
    case 'SCHEDULE_REMINDER': {
      const { id, hour, minute, title, body } = event.data;
      scheduleDailyReminder(
        id || 'default',
        hour,
        minute,
        title || 'Destiny Hacking',
        body || 'Time for your daily practice'
      );
      break;
    }

    case 'CANCEL_REMINDER': {
      const cancelId = event.data.id || 'default';
      if (scheduledTimers[cancelId]) {
        clearTimeout(scheduledTimers[cancelId]);
        delete scheduledTimers[cancelId];
      }
      break;
    }

    case 'CANCEL_ALL_REMINDERS': {
      Object.keys(scheduledTimers).forEach((id) => {
        clearTimeout(scheduledTimers[id]);
        delete scheduledTimers[id];
      });
      break;
    }

    case 'GET_SCHEDULED': {
      // Report back which reminders are active
      event.source.postMessage({
        type: 'SCHEDULED_REMINDERS',
        ids: Object.keys(scheduledTimers),
      });
      break;
    }
  }
});

// Handle push notifications (from server-side push)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Destiny Hacking';
  const options = {
    body: data.body || 'Time for your daily practice',
    icon: 'https://dados.destinyhacking.com/images/icon-192x192.png',
    badge: 'https://dados.destinyhacking.com/images/icon-192x192.png',
    data: { url: data.url || '/' },
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
