/* Red primero: el caché es solo respaldo sin conexión. Al revés te quedas viendo la versión vieja. */
const CACHE='imperio-v4';
const ASSETS=['./','./index.html','./engine.js','./ui.js',
  './data/concepts.js','./data/sales.js','./data/people.js','./data/world.js','./data/misiones.js',
  './oficina.js','./manifest.json'];
self.addEventListener('install',e=>{ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
