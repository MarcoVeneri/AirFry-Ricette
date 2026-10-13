const CACHE='airfry-ricette-v2026-6-clean-ui-v4';
const CORE=['./?ui=4','./index.html?ui=4','./clean-ui-v4.css?v=4','./clean-ui-v4.js?v=4','./manifest.webmanifest?v=4','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();const clients=await self.clients.matchAll({type:'window'});for(const client of clients){try{const u=new URL(client.url);u.searchParams.set('ui','4');await client.navigate(u.toString());}catch(_e){}}})());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html?ui=4',copy)).catch(()=>{});return r;}).catch(()=>caches.match('./index.html?ui=4')));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request)));
});
