(()=>{
  const $=s=>document.querySelector(s);

  const addFastCategories=()=>{
    const host=$('#quickHome');
    if(!host || host.querySelector('[data-fast-category]'))return;
    const items=[
      ['Carne','Carne'],
      ['Pesce','Pesce'],
      ['Patate e verdure','Verdure']
    ];
    const frag=document.createDocumentFragment();
    items.forEach(([category,label])=>{
      const b=document.createElement('button');
      b.className='pill fastCategory';
      b.dataset.fastCategory=category;
      b.textContent=label;
      b.onclick=()=>{
        try{
          activeCategory=category;
          activeFilter='Tutte';
          if(typeof renderCategories==='function')renderCategories();
          if(typeof switchView==='function')switchView('explore');
          if(typeof renderExplore==='function')renderExplore();
        }catch(_e){}
      };
      frag.appendChild(b);
    });
    host.prepend(frag);
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

    const featured=[...document.querySelectorAll('.sectionhead h2')].find(x=>x.textContent.trim()==='In evidenza' || x.textContent.trim()==='Scelte rapide');
    if(featured)featured.textContent='Consigliate';
    const exploreHead=[...document.querySelectorAll('.sectionhead h2')].find(x=>x.textContent.trim()==='Esplora');
    if(exploreHead)exploreHead.textContent='Tutte le ricette';

    const nav=[...document.querySelectorAll('[data-view="explore"]')];
    nav.forEach((x,i)=>{if(i===0)x.textContent='Ricette';});
    const bottomExplore=document.querySelector('.bottomnav [data-view="explore"]');
    if(bottomExplore)bottomExplore.innerHTML='<span>⌕</span>Ricette';

    addFastCategories();
    try{
      if(typeof renderFilters==='function' && !renderFilters.__minimalWrapped){
        const original=renderFilters;
        const wrapped=function(){original();addFastCategories();};
        wrapped.__minimalWrapped=true;
        renderFilters=wrapped;
      }
    }catch(_e){}
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
