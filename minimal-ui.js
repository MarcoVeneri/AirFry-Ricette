(()=>{
  const $=s=>document.querySelector(s);
  const ready=()=>{
    document.title='Ricette';
    const brand=$('.brandtext b'); if(brand)brand.textContent='Ricette';
    const sub=$('.brandtext span'); if(sub)sub.textContent='Friggitrice ad aria';
    const heroTitle=$('.hero h1'); if(heroTitle)heroTitle.innerHTML='Scegli.<br>Cucina.';
    const heroText=$('.hero p'); if(heroText)heroText.textContent='Tempi, temperatura e ingredienti subito visibili.';
    const explore=$('#heroExplore'); if(explore)explore.textContent='Tutte le ricette';
    const finder=$('#heroFinder'); if(finder)finder.textContent='Cerca per ingredienti';
    const search=$('#homeSearch'); if(search)search.placeholder='Cerca una ricetta o un ingrediente…';
    const search2=$('#search'); if(search2)search2.placeholder='Cerca ricetta, ingrediente o modalità…';
    const finderTop=$('#finderTop'); if(finderTop)finderTop.textContent='Cosa cucino?';
    const featured=[...document.querySelectorAll('.sectionhead h2')].find(x=>x.textContent.trim()==='In evidenza'); if(featured)featured.textContent='Scelte rapide';
    const exploreHead=[...document.querySelectorAll('.sectionhead h2')].find(x=>x.textContent.trim()==='Esplora'); if(exploreHead)exploreHead.textContent='Tutte le ricette';
    const nav=[...document.querySelectorAll('[data-view="explore"]')]; nav.forEach((x,i)=>{if(i===0)x.textContent='Ricette';});
    const bottomExplore=document.querySelector('.bottomnav [data-view="explore"]');
    if(bottomExplore)bottomExplore.innerHTML='<span>⌕</span>Ricette';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
