// Winter Arc — service worker
// Caches the whole app on install so it works fully offline afterwards,
// including on a cold launch from the home-screen icon with no network at all.

var CACHE_NAME = 'winter-arc-v4';
var APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(APP_FILES);
    }).then(function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(
        names.filter(function(n){ return n !== CACHE_NAME; })
             .map(function(n){ return caches.delete(n); })
      );
    }).then(function(){
      return self.clients.claim();
    })
  );
});

// Cache-first: serve from cache instantly, fall back to network,
// and cache anything new we successfully fetch (same-origin GET only).
self.addEventListener('fetch', function(event){
  if(event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached){
      if(cached) return cached;
      return fetch(event.request).then(function(response){
        if(response && response.status === 200 && response.type === 'basic'){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        // Offline and not cached: for a navigation, fall back to the app shell.
        if(event.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
      });
    })
  );
});
