self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('lumiprints-cache').then(cache => {
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