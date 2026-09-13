/* Red primero: el caché es solo respaldo sin conexión. Al revés te quedas viendo la versión vieja. */
const CACHE='imperio-v6';
const ASSETS=['./','./index.html','./engine.js?v=6','./ui.js?v=6',
  './data/concepts.js?v=6','./data/sales.js?v=6','./data/people.js?v=6','./data/world.js?v=6','./data/misiones.js?v=6',
  './oficina.js?v=6','./manifest.json'];
self.addEventListener('install',e=>{ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // la página en sí se pide siempre saltándose el caché del navegador: si no, se sirve HTML viejo
  const opts = e.request.mode==='navigate' ? {cache:'reload'} : undefined;
  e.respondWith(
    fetch(e.request, opts).then(r=>{
      const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
