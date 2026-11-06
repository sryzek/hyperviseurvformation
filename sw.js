const CACHE_NAME = 'sigf-planif-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation du Service Worker et mise en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes (Stratégie: Cache falling back to network)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la version en cache si trouvée, sinon fait la requête réseau
        return response || fetch(event.request);
      })
  );
});

// Nettoyage des anciens caches lors d'une mise à jour
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
