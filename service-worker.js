self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('lumiprints-cache').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/app.js',
          '/styles.css',
          '/LogoTitile.png',
          '/lumiprintsLogo.png'
        ]);
      })
    );
  });
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });