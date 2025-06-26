
const CACHE_NAME = 'breus-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache only URLs that are likely to exist
        return cache.addAll(urlsToCache.filter(url => {
          // Skip bundled assets as they change frequently
          return !url.includes('/static/') && !url.includes('bundle.js') && !url.includes('main.css');
        }));
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
        // Continue without caching if there's an error
        return Promise.resolve();
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('Failed to fetch:', error);
          // Return a basic response for navigation requests if offline
          if (event.request.mode === 'navigate') {
            return new Response('App is offline. Please check your connection.', {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            });
          }
          throw error;
        });
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync offline actions when back online
    const pendingActions = await getStoredActions();
    for (const action of pendingActions) {
      try {
        await syncAction(action);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getStoredActions() {
  try {
    // Get actions from localStorage
    const stored = localStorage.getItem('breus_pending_actions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get stored actions:', error);
    return [];
  }
}

async function syncAction(action) {
  // Implement the actual sync logic here
  return fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(action)
  });
}
