/* 
  Lightweight service worker for full offline/asset-caching support (PWA).
  Based on standard CRA configuration adapted for Jeopardy game.
*/

const CACHE_NAME = "jeopardy-pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/static/js/bundle.js",
];

// Caching application shell & static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((c) => c !== CACHE_NAME)
          .map((c) => caches.delete(c))
      )
    )
  );
});

// Serve cached files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});
