const CACHE_NAME = "postway-runtime-v1";
const TILE_HOST_PATTERN = /tile\.openstreetmap\.org$/;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Runtime cache: same-origin app assets (Next.js static chunks, pages, icons)
// and OpenStreetMap map tiles are cached as they're fetched, so pages and
// map areas you've already opened keep working with no signal. This is a
// "cache what you use" strategy rather than a precached app shell, since
// Next.js build output filenames are content-hashed and unknown ahead of time.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isMapTile = TILE_HOST_PATTERN.test(url.hostname);

  if (!isSameOrigin && !isMapTile) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      // Map tiles and static chunks: serve from cache instantly if we have it,
      // refresh in the background. Everything else: prefer the network.
      if (cached && (isMapTile || url.pathname.startsWith("/_next/static/"))) {
        fetchPromise.catch(() => {});
        return cached;
      }
      return fetchPromise.then((r) => r || cached);
    })
  );
});
