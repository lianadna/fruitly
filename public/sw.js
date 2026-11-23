// Service worker minimal agar Fruitly memenuhi syarat dipasang (installable).
// Sengaja tidak menyimpan cache apa pun, jadi versi terbaru selalu dimuat dari jaringan.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
