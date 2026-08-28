const CACHE = 'a11y-trace-site-v8';
const PAGES = ['/', '/demo/', '/privacy/', '/terms/', '/lab/', '/404.html'];
const SHELL = [...PAGES, '/trace-mark.svg', '/apple-touch-icon.png', '/social-card.jpg', '/assets/trace-slab-720.webp', '/assets/trace-slab.webp'];

async function cacheShell() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);

  const discovered = new Set();
  for (const path of PAGES) {
    const response = await cache.match(path);
    if (!response) continue;
    const html = await response.text();
    for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) discovered.add(match[1]);
  }

  const queued = [...discovered];
  const cached = new Set();
  while (queued.length) {
    const path = queued.shift();
    if (!path || cached.has(path)) continue;
    cached.add(path);
    try {
      const response = await fetch(path);
      if (!response.ok) continue;
      await cache.put(path, response.clone());
      const contentType = response.headers.get('content-type') ?? '';
      if (contentType.includes('javascript') || /\.[cm]?[jt]s(?:\?|$)/.test(path)) {
        const source = await response.text();
        for (const match of source.matchAll(/(?:from\s*|import\s*)["'](\/[^"']+)["']/g)) queued.push(match[1]);
      }
    } catch {
      // Source modules exist in local development; hashed bundles exist in production.
    }
  }
}

self.addEventListener('install', event => event.waitUntil(cacheShell().then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('message', event => {
  if (event.data?.type === 'OFFLINE_READY') event.ports[0]?.postMessage({ cache: CACHE });
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
      return response;
    } catch {
      if (event.request.mode === 'navigate') return caches.match('/');
      return Response.error();
    }
  })());
});
