
(function(){
"use strict";
const fresh=(window.STUDIO_RECIPES||[]).map(x=>Object.assign({source:"fresh"},x));
let archive=[];
const state={view:"discover",category:"Tutte",query:"",fast:false,archiveQuery:"",open:null};
const byId=()=>fresh.concat(archive);
const KEY="airfry-studio-2026-";
function load(k,fallback){try{const v=localStorage.getItem(KEY+k);return v?JSON.parse(v):fallback}catch(e){return fallback}}
function save(k,v){try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}
let favorites=new Set(load("favorites",[]));
let shopping=new Set(load("shopping",[]));
let checked=new Set(load("checked",[]));
const cats=["Tutte","Pollo","Patate","Verdure","Sfiziosità","Pesce","Formaggio","Dolci"];
const tones={"Pollo":"#f8dec6","Patate":"#f8e7ac","Verdure":"#dcead5","Sfiziosità":"#f2d5d5","Pesce":"#d9eaf1","Formaggio":"#f9e1c4","Dolci":"#e7ddf4","Aperitivi e snack":"#f0dbc8"};
const $=id=>document.getElementById(id);
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=v=>String(v||"").toLocaleLowerCase("it").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const minutes=v=>{if(typeof v==="number")return v;let n=parseInt(String(v||"0").match(/\d+/)?.[0]||"0",10);return Number.isFinite(n)?n:0};
const find=id=>byId().find(x=>x.id===id);
const total=r=>r.source==="fresh"?r.prep+r.cook:(minutes(r.prep)+minutes(r.cook));
const temp=r=>String(r.temp||"180 °C").replace(/\s*°?\s*C/i,"")+"°C";
const cooking=r=>typeof r.cook==="number"?r.cook+" min":(r.cook||"—");
const prepping=r=>typeof r.prep==="number"?r.prep+" min":(r.prep||"—");
const shape=r=>r.shape||"Facile";
const photo=r=>r.image||"";
function toast(message){const t=$("toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2700)}
function toggleFav(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);save("favorites",[...favorites]);refresh();toast(favorites.has(id)?"Aggiunta alle preferite ♥":"Rimossa dalle preferite")}
function toggleShopping(id){if(shopping.has(id))shopping.delete(id);else shopping.add(id);save("shopping",[...shopping]);refresh();toast(shopping.has(id)?"Ingredienti aggiunti alla spesa ✓":"Rimossa dalla spesa")}
function card(r){
 const loved=favorites.has(r.id),tone=tones[r.category]||"#e9e3d7";
 const art=photo(r)?'<span class="photo-unavailable">Foto non disponibile</span><img loading="lazy" decoding="async" src="'+esc(photo(r))+'" alt="Foto illustrativa del piatto cotto: '+esc(r.title)+'" onerror="this.remove()">':'<span class="photo-unavailable">Foto non disponibile</span>';
 return '<article class="recipe-card"><button class="card-open" data-open="'+esc(r.id)+'" aria-label="Apri ricetta: '+esc(r.title)+'"><div class="card-art" style="--tone:'+tone+'">'+art+'<span class="shape-label">'+esc(shape(r))+'</span></div><div class="card-content"><span class="card-category">'+esc(r.category)+'</span><h3 class="card-title">'+esc(r.title)+'</h3><div class="card-meta"><span>⏱ '+esc((total(r)||minutes(r.minutes))+" min")+'</span><span>♨ '+esc(temp(r))+'</span></div></div></button><button class="card-heart '+(loved?"loved":"")+'" data-fav="'+esc(r.id)+'" aria-label="'+(loved?"Rimuovi dai preferiti":"Aggiungi ai preferiti")+'" aria-pressed="'+loved+'">'+(loved?"♥":"♡")+'</button></article>'
}
function empty(icon,title,sub){return '<div class="empty-state"><span class="empty-emoji">'+icon+'</span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></div>'}
function renderCards(target,list,emptyTitle,emptySub){$(target).innerHTML=list.length?list.map(card).join(""):empty("🍽️",emptyTitle,emptySub)}
function renderChips(){
 $("categoryChips").innerHTML=cats.map(c=>'<button class="chip '+(state.category===c?"active":"")+'" data-category="'+esc(c)+'" aria-pressed="'+(state.category===c)+'">'+(c==="Tutte"?"✨ ":c==="Pollo"?"🍗 ":c==="Patate"?"🥔 ":c==="Verdure"?"🥦 ":c==="Sfiziosità"?"🥟 ":c==="Pesce"?"🍤 ":c==="Formaggio"?"🧀 ":"🍫 ")+esc(c)+'</button>').join("");
}
function renderDiscover(){
 renderChips();
 const q=norm(state.query).trim();
 let res=fresh.filter(r=>(state.category==="Tutte"||r.category===state.category)&&(!state.fast||total(r)<=20)&&(!q||norm([r.title,r.category,r.shape,r.emoji].concat(r.ingredients).join(" ")).includes(q)));
 const exact=res.length;
 $("resultCount").textContent=exact+" ricette";
 $("fastFilter").classList.toggle("active",state.fast);
 $("fastFilter").setAttribute("aria-pressed",String(state.fast));
 renderCards("recipeGrid",res,"Nessuna ricetta trovata","Prova un ingrediente diverso oppure disattiva i filtri.");
}
function renderFav(){
 const list=byId().filter(r=>favorites.has(r.id));
 $("favCount").textContent=list.length+" ricette salvate";
 renderCards("favGrid",list,"Qui metti le tue preferite","Tocca il cuoricino sulle ricette che vuoi ritrovare al volo.");
}
function renderArchive(){
 const q=norm(state.archiveQuery.trim());
 const list=archive.filter(r=>!q||norm([r.title,r.category].concat(r.ingredients).join(" ")).includes(q));
 $("archiveCount").textContent=archive.length+" ricette nell’archivio";
 renderCards("archiveGrid",list,"Niente nell’archivio","Riprova con un altro nome o ingrediente.");
}
function renderShopping(){
 const all=byId().filter(r=>shopping.has(r.id));
 $("shoppingCount").textContent=all.length+" ricette selezionate";
 $("shoppingActions").hidden=!all.length;
 $("shoppingGroups").innerHTML=all.length?all.map(r=>'<section class="list-card"><div class="list-head"><b>'+esc(r.emoji||"🍽️")+' '+esc(r.title)+'</b><button data-drop="'+esc(r.id)+'">Rimuovi</button></div>'+r.ingredients.map((ing,i)=>{const key=r.id+"|"+i;return '<label class="list-item '+(checked.has(key)?"done":"")+'"><input type="checkbox" data-check="'+esc(key)+'" '+(checked.has(key)?"checked":"")+'><span>'+esc(ing)+'</span></label>'}).join("")+'</section>').join(""):empty("🧺","La lista è vuota","Apri una ricetta e premi «Aggiungi alla spesa» per ricordarti gli ingredienti.");
}
function refresh(){renderDiscover();renderFav();renderShopping();renderArchive();if(state.open)renderDetail(state.open)}
function navigate(view){
 if(!["discover","favorites","shopping","archive"].includes(view))view="discover";
 state.view=view;document.querySelectorAll(".view").forEach(v=>v.classList.toggle("is-active",v.id==="view-"+view));
 document.querySelectorAll("[data-view]").forEach(v=>{v.classList.toggle("is-active",v.dataset.view===view);v.setAttribute("aria-current",v.dataset.view===view?"page":"false")});
 window.scrollTo({top:0,behavior:"instant"});
 if(view==="favorites")renderFav();if(view==="shopping")renderShopping();if(view==="archive")renderArchive();
}
function renderDetail(id){
 let r=find(id);if(!r)return;
 const art=photo(r)?'<span class="photo-unavailable">Foto non disponibile</span><img src="'+esc(photo(r))+'" alt="Foto illustrativa del piatto finito: '+esc(r.title)+'" onerror="this.remove()">':'<span class="photo-unavailable">Foto non disponibile</span>';
 const note=r.source==="fresh"?"Ricetta creativa • pronta in mezz’ora":"Dal catalogo originale • ricetta indicativa";
 const cover='<div class="sheet-cover" style="--tone:'+(tones[r.category]||"#ecdcca")+'">'+art+'<span class="photo-watermark">'+(r.id==="c1"?"Le tue foto":"Foto illustrativa")+'</span></div>';
 const ingredients=(r.ingredients||[]).map(x=>'<label class="ingredient-check"><input type="checkbox"><span>'+esc(x)+'</span></label>').join("");
 const steps=(r.steps||[]).map((x,i)=>'<div class="step"><span class="step-num">'+(i+1)+'</span><span>'+esc(x)+'</span></div>').join("");
 let photos=r.id==="c1"?'<div class="before-after"><figure><img src="ciambelle-prima.webp" alt="Ciambelline prima della cottura"><figcaption>01 · Prima</figcaption></figure><figure><img src="ciambelle-dopo.webp" alt="Ciambelline dorate"><figcaption>02 · Dopo</figcaption></figure></div>':"";
 $("detailContent").innerHTML=cover+'<div class="sheet-main"><div class="sheet-kicker">'+esc(note)+(r.photoSource?' · <a class="photo-source" href="'+esc(r.photoSource)+'" target="_blank" rel="noopener noreferrer">Fonte foto ↗</a>':"")+'</div><h2 class="sheet-title" id="detailTitle">'+esc(r.title)+'</h2><div class="metrics"><div class="metric"><small>PREPARI</small><b>'+esc(prepping(r))+'</b></div><div class="metric"><small>CUOCI</small><b>'+esc(cooking(r))+'</b></div><div class="metric"><small>TEMPERATURA</small><b>'+esc(temp(r))+'</b></div><div class="metric"><small>PORZIONI</small><b>'+esc(r.portions||"2")+'</b></div></div><div class="detail-actions"><button data-fav="'+esc(r.id)+'">'+(favorites.has(r.id)?"♥ Salvata":"♡ Preferita")+'</button><button class="add-to-list" data-add="'+esc(r.id)+'">'+(shopping.has(r.id)?"✓ Nella spesa":"+ Aggiungi alla spesa")+'</button><button data-share="'+esc(r.id)+'">↗ Condividi</button></div><div class="detail-columns"><div><h3>🧺 Cosa ti serve</h3>'+ingredients+photos+'</div><div><h3>👩‍🍳 Come si fa</h3>'+steps+(r.tip?'<div class="tip">💡 <b>Il trucco:</b> '+esc(r.tip)+'</div>':"")+'<p class="safety">Tempi indicativi: controlla sempre la cottura al cuore, soprattutto per pollo, carne e pesce. Non riempire troppo il cestello.</p></div></div></div>';
}
function openDetail(id){
 if(!find(id))return;
 state.open=id;renderDetail(id);$("detailBackdrop").classList.add("open");$("detailBackdrop").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 $("detailClose").focus();
}
function closeDetail(){state.open=null;$("detailBackdrop").classList.remove("open");$("detailBackdrop").setAttribute("aria-hidden","true");document.body.style.overflow=""}
function listText(){
 const all=byId().filter(r=>shopping.has(r.id));
 return "LISTA DELLA SPESA • AIRFRY\n\n"+all.map(r=>r.title+"\n"+r.ingredients.map((ing,i)=>(checked.has(r.id+"|"+i)?"☑ ":"☐ ")+ing).join("\n")).join("\n\n");
}
async function copyList(){
 const value=listText();
 try{await navigator.clipboard.writeText(value);toast("Lista copiata! 📋")}catch(e){const t=document.createElement("textarea");t.value=value;document.body.appendChild(t);t.select();try{document.execCommand("copy");toast("Lista copiata! 📋")}catch(e2){toast("Copia non disponibile")}t.remove()}
}
async function shareRecipe(id){
 const r=find(id);if(!r)return;
 const msg=r.title+" • "+prepping(r)+" preparazione, "+cooking(r)+" cottura a "+temp(r)+"\n"+r.ingredients.join(", ")+".";
 const url=location.origin+location.pathname+"#ricetta="+encodeURIComponent(id);
 if(navigator.share){try{await navigator.share({title:r.title,text:msg,url});return}catch(e){if(e.name==="AbortError")return}}
 try{await navigator.clipboard.writeText(msg+"\n"+url);toast("Ricetta copiata!")}catch(e){toast("Condivisione non disponibile")}
}
function attachEvents(){
 document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return}
  const cat=e.target.closest("[data-category]");if(cat){state.category=cat.dataset.category;renderDiscover();return}
  const fav=e.target.closest("[data-fav]");if(fav){toggleFav(fav.dataset.fav);return}
  const add=e.target.closest("[data-add]");if(add){toggleShopping(add.dataset.add);return}
  const drop=e.target.closest("[data-drop]");if(drop){toggleShopping(drop.dataset.drop);return}
  const open=e.target.closest("[data-open]");if(open){openDetail(open.dataset.open);return}
  const share=e.target.closest("[data-share]");if(share){shareRecipe(share.dataset.share);return}
 });
 document.addEventListener("change",e=>{
  if(e.target.matches("[data-check]")){const key=e.target.dataset.check;if(e.target.checked)checked.add(key);else checked.delete(key);save("checked",[...checked]);renderShopping()}
 });
 $("searchInput").addEventListener("input",e=>{state.query=e.target.value;renderDiscover();$("clearSearch").hidden=!e.target.value});
 $("clearSearch").addEventListener("click",()=>{$("searchInput").value="";state.query="";$("clearSearch").hidden=true;renderDiscover();$("searchInput").focus()});
 $("archiveSearch").addEventListener("input",e=>{state.archiveQuery=e.target.value;renderArchive()});
 $("fastFilter").addEventListener("click",()=>{state.fast=!state.fast;renderDiscover()});
 $("surpriseBtn").addEventListener("click",()=>{const pool=fresh.filter(r=>state.category==="Tutte"||r.category===state.category);openDetail(pool[Math.floor(Math.random()*pool.length)].id)});
 $("heroRecipe").addEventListener("click",()=>openDetail("c1"));
 $("heroBrowse").addEventListener("click",()=>{$("catalogue").scrollIntoView({behavior:"smooth",block:"start"})});
 $("detailClose").addEventListener("click",closeDetail);
 $("detailBackdrop").addEventListener("click",e=>{if(e.target===$("detailBackdrop"))closeDetail()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.open)closeDetail()});
 $("copyShopping").addEventListener("click",copyList);
 $("clearShopping").addEventListener("click",()=>{if(!confirm("Vuoi svuotare tutta la lista della spesa?"))return;shopping.clear();checked.clear();save("shopping",[]);save("checked",[]);renderShopping();toast("Lista svuotata")});
}
async function loadArchive(){
 try{
  const response=await fetch("./recipes.json",{cache:"no-cache"});if(!response.ok)throw Error("fetch");
  const json=await response.json();
  archive=(Array.isArray(json)?json:[]).map(x=>({
    id:"a"+x.id,title:x.title,category:x.category,emoji:x.emoji||"🍽️",shape:"Archivio",prep:x.prep,cook:x.cook,temp:x.temp,
    ingredients:x.ingredients||[],steps:x.steps||[],tip:x.tip||"",image:x.image||"",portions:x.portions||2,minutes:x.minutes,source:"archive"
  }));
 }catch(e){archive=[];$("archiveNotice").textContent="L’archivio non è al momento disponibile offline. Le 26 ricette creative funzionano comunque."}
 renderArchive();renderFav();renderShopping();
}
function init(){
 attachEvents();renderDiscover();renderFav();renderShopping();renderArchive();navigate("discover");loadArchive();
 if(location.hash.startsWith("#ricetta=")){const id=decodeURIComponent(location.hash.slice(9));if(fresh.some(x=>x.id===id))openDetail(id)}
 if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
