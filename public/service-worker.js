const FILES_TO_CACHE = [
    '/offline.html'



];

const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data=cache-v1';

// install
self.addEventListener("install", function (evt) {
// pre cache all static assets
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('files pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
// activate service worker
    self.skipWaiting();
});