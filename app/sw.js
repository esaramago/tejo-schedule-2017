self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('horariostejo').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/dist/main.css',
                '/dist/bundle.js'
            ]);
        })
    );
});
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
    );
});