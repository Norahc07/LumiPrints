const CACHE_NAME = 'lumiprints-cache-v3';

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        // Only cache files that we know exist
        const filesToCache = [
          '/',
          '/index.html',
          '/app.js',
          '/styles.css'
        ];
        
        // Add each file individually to handle failures gracefully
        return Promise.allSettled(
          filesToCache.map(url => 
            cache.add(url).catch(error => {
              console.log('Failed to cache:', url, error);
              return null; // Continue with other files even if one fails
            })
          )
        );
      })
    );
  });

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      }).catch(error => {
        console.log('Fetch failed:', error);
        return fetch(event.request);
      })
    );
  });