self.addEventListener('install', event => {
    console.log('Installing service worker');
    const cacheName = 'pokemon-cache'
    const urlsToCache = [
        '/',
        './javascripts/list.js'
    ]
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            cache.addAll(urlsToCache)
        })
    )
});

self.addEventListener('activate', (event) => {
    self.skipWaiting()
    console.log('Activating service worker...')
    const cacheWhitelist = ['pokemon-cache']
    event.waitUntil(
        caches.keys()
            .then (cacheNames => {
                return Promise.all(
                    cacheNames.map (cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open('pokemon-cache')
        .then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    console.log('cache Hot! Fetching response from cache', event.request.url);
                    return response
                }
                fetch(event.request).then(response => {
                    cache.put(event.request, response.clone());
                    console.log('content cached');
                    return response;
                })
            })
        })
    )
})