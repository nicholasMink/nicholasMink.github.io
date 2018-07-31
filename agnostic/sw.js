var staticCacheName = 'dog-cache-v0.1';

const allCaches = [
  staticCacheName,
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'index.html',
        'js/jquery.js',
        'js/index.js',
        'css/index.css',
        'img/dog-marker.svg',
        'favicon.png',
        'manifest.json'
      ]).catch((error) => console.log('caches open:', error));
    })
  );
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('dog-') && !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.startsWith('/dog/')) {
    return;
  }

  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
