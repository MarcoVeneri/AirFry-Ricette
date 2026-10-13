(()=>{
  const $=s=>document.querySelector(s);
  const addFastCategories=()=>{
    const host=$('#quickHome');
    if(!host || host.querySelector('[data-fast-category]'))return;
    [['Carne','Carne'],['Pesce','Pesce'],['Patate e verdure','Verdure']].forEach(([category,label])=>{
      const b=document.createElement('button');
      b.className='pill fastCategory';
      b.dataset.fastCategory=category;
      b.textContent=label;
      b.onclick=()=>{try{activeCategory=category;activeFilter='Tutte';renderCategories?.();switchView?.('explore');renderExplore?.();}catch(_e){}};
      host.appendChild(b);
    });
  };
  const ready=()=>{
    document.title='Ricette';
    const brand=$('.brandtext b'); if(brand)brand.textContent='Ricette';
    const sub=$('.brandtext span'); if(sub)sub.textContent='Friggitrice ad aria';
    const heroTitle=$('.hero h1'); if(heroTitle)heroTitle.textContent='Cosa cucini oggi?';
    const heroText=$('.hero p'); if(heroText)heroText.textContent='Cerca una ricetta oppure scegli una categoria.';
    const explore=$('#heroExplore'); if(explore)explore.textContent='Tutte le ricette';
    const finder=$('#heroFinder'); if(finder)finder.textContent='Ho questi ingredienti';
    const search=$('#homeSearch'); if(search)search.placeholder='Cerca ricetta o ingrediente';
    const search2=$('#search'); if(search2)search2.placeholder='Cerca ricetta o ingrediente';
    const finderTop=$('#finderTop'); if(finderTop)finderTop.textContent='Ingredienti';
    [...document.querySelectorAll('.sectionhead h2')].forEach(h=>{
      const t=h.textContent.trim();
      if(t==='In evidenza'||t==='Scelte rapide')h.textContent='Consigliate';
      if(t==='Esplora')h.textContent='Tutte le ricette';
    });
    const bottomExplore=document.querySelector('.bottomnav [data-view="explore"]');
    if(bottomExplore)bottomExplore.innerHTML='<span>⌕</span>Ricette';
    addFastCategories();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
