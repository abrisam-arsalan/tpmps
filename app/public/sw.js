// Service worker minimal — cache app shell agar bisa dibuka offline.
// Data dokumen tetap di IndexedDB (Dexie), tidak ikut di-cache di sini.
const CACHE = "tpmps-v1";
const CORE = ["/", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  // Navigasi halaman: network dulu, fallback ke cache (Beranda)
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).catch(() => caches.match("/")));
    return;
  }
  // Aset statis: cache dulu, isi latar dari network
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const go = fetch(e.request).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || go;
    })
  );
});
