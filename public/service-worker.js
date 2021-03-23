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
    self.ClientRectList.claim();
})