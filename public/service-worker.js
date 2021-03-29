const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/manifest.webmanifest",
    "/index.js",
    "db.js",
    "/styles.css"
];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data=cache-v1';

// install
self.addEventListener("install", function (evt) {
// pre cache all static assets
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
// activate service worker
    self.skipWaiting();
});

// activate
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(evt) {
    // cache to API
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                  .then(response => {
                      if (response.status === 200) {
                          cache.put(evt.request.url, response.clone());
                      }
                return response;
                
                })
                .catch(err => {
                    return cache.match(evt.request);
                });
            }).catch(err => console.log(errr))
        );
        return;
    }
    // offline approach
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            })
        })
    );
});