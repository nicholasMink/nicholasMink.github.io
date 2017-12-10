var dataCacheName = 'portfolioData-v1';
var cacheName = 'portfolioPWA-final-1';

var filesToCache = [
  '/portfolio/',
  '/portfolio/index.html',
  '/portfolio/style.css',
  '/portfolio/app.js',
  '/portfolio/index.js',
  '/portfolio/image-list.js',
  '/portfolio/img/ACC-logo.png',
  '/portfolio/img/acc-star-color.svg',
  '/portfolio/img/acc-star.svg',
  '/portfolio/img/bg-pattern.svg',
  '/portfolio/img/li-profile.png',
  '/portfolio/img/linkedIn-profile-image.jpg',
  '/portfolio/img/logo_linkedin.png',
  '/portfolio/img/music-app-logo.png',
  '/portfolio/img/music-app.png',
  '/portfolio/img/Optimus-logo.png',
  '/portfolio/img/robot-eyes.svg',
  '/portfolio/img/star-loader.svg',
  '/portfolio/img/stellar-cellar-logo.png',
  '/portfolio/img/stellar-cellar.png',
  '/portfolio/img/TLED-logo.png',
  '/portfolio/img/TLED.png',
  '/portfolio/img/TLED_white.svg'
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
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});
