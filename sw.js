/* Ankara Katmanları — Service Worker
   Amaç: uygulamayı telefona yüklenebilir yapmak, açılışı hızlandırmak ve internet kesilince de açılmasını sağlamak.
   - Sayfa ve simgeler: önce cihazdaki kopya (anında açılır), arka planda yenisini kontrol eder; yeni sürüm bulunursa sayfaya haber verir.
   - Firebase giriş betikleri (gstatic): çevrimdışı açılışta oturum yönetimi çalışsın diye saklanır.
   - Veritabanı, giriş, Wikipedia, Nominatim vb. diğer bütün istekler ELLENMEZ (doğrudan ağa gider); kişisel veri bu katmanda saklanmaz. */
const VERSION = 'v6-2026-10-26';
const SHELL_CACHE = 'ankara-shell-' + VERSION, EXT_CACHE = 'ankara-ext-' + VERSION;
const SHELL = ['./', './index.html', './manifest.webmanifest', './gizlilik.html', './data/ankara.json', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
const EXT = ['https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js', 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app-check.js'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL_CACHE); await Promise.all(SHELL.map(u => c.add(new Request(u, { cache:'reload' })).catch(() => {})));
    const x = await caches.open(EXT_CACHE);
    await Promise.all(EXT.map(async u => { try { const r = await fetch(u, { mode:'cors' }); if(r.ok) await x.put(u, r); } catch(err){ try { await x.put(u, await fetch(u, { mode:'no-cors' })); } catch(e2){} } }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = [SHELL_CACHE, EXT_CACHE]; for(const k of await caches.keys()) if(!keep.includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Yeni sürüm gerçekten değişti mi? Üstbilgiler (ETag/Last-Modified) CDN uçlarına göre değişebildiği için İÇERİĞİN özeti karşılaştırılır
async function hashOf(r){
  const buf = await r.clone().arrayBuffer(); const d = new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
  return Array.from(d, x => x.toString(16).padStart(2, '0')).join('');
}
let lastNotified = '';
async function revalidate(req, cache, key){
  try {
    const net = await fetch(req, { cache:'no-cache' }); if(!net || !net.ok) return;
    const old = await cache.match(key);
    const h = await hashOf(net), changed = !!old && (await hashOf(old)) !== h;
    await cache.put(key, net.clone());
    if(changed && h !== lastNotified){ lastNotified = h; for(const c of await self.clients.matchAll()) c.postMessage({ type:'update' }); }
  } catch(err){ /* çevrimdışı: sessizce geç */ }
}
self.addEventListener('fetch', e => {
  const req = e.request; if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // 1) Sitenin kendi sayfaları: önce cihazdaki kopya, arka planda yenile
  if(url.origin === self.location.origin){
    const isPage = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
    const key = isPage && !url.pathname.endsWith('gizlilik.html') ? './index.html' : req;
    e.respondWith((async () => {
      const cache = await caches.open(SHELL_CACHE); const hit = await cache.match(key, { ignoreSearch:true });
      if(hit){ e.waitUntil(revalidate(req, cache, key)); return hit; }
      try { const net = await fetch(req); if(net && net.ok) cache.put(key, net.clone()); return net; }
      catch(err){ return (await cache.match('./index.html')) || Response.error(); }
    })());
    return;
  }
  // 2) Firebase betikleri: önce cihazdaki kopya
  if(EXT.includes(req.url)){
    e.respondWith((async () => { const hit = await (await caches.open(EXT_CACHE)).match(req.url); return hit || fetch(req); })());
  }
  // 3) Diğer her şey (Firestore, giriş, fotoğraflar, harita sorguları): hiç dokunma
});
