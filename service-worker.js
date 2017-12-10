var dataCacheName = 'minkData-v1';
var cacheName = 'minkPWA-1';

var filesToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/style.css',
  '/img/ACC-logo.png',
  '/img/acc-star-color.svg',
  '/img/acc-star.svg',
  '/img/bg-pattern.svg',
  '/img/li-profile.png',
  '/img/linkedIn-profile-image.jpg',
  '/img/logo_linkedin.png',
  '/img/music-app-logo.png',
  '/img/music-app.png',
  '/img/Optimus-logo.png',
  '/img/robot-eyes.svg',
  '/img/star-loader.svg',
  '/img/stellar-cellar-logo.png',
  '/img/stellar-cellar.png',
  '/img/TLED-logo.png',
  '/img/TLED.png',
  '/img/TLED_white.svg'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  )
  return self.clients.claim();
});
