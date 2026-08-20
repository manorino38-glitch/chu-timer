// CHU-TIMER PWA service worker — オフライン起動用。画面を上げるとき番号を上げる。
const CACHE = 'chu-timer-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.hostname.indexOf('script.google.com') !== -1) return; // GAS通信はキャッシュしない
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
