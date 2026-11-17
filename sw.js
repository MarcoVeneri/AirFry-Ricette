const CACHE="airfry-studio-v8-20261117";
const CORE=["./","./index.html","./studio.css?v=8","./studio-recipes.js?v=8","./studio.js?v=8","./manifest.webmanifest?v=8","./recipes.json","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n!==CACHE).map(n=>caches.delete(n)));await self.clients.claim();})()));
self.addEventListener("fetch",e=>{
 const req=e.request;if(req.method!=="GET"||new URL(req.url).origin!==location.origin)return;
 if(req.mode==="navigate"){
  e.respondWith(fetch(req).then(res=>{if(res.ok){let cp=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp)).catch(()=>{});}return res;}).catch(async()=>await caches.match("./index.html")||await caches.match("./")));
  return;
 }
 e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp)).catch(()=>{});}return res;})));
});
