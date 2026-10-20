(() => {
  const normalize=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
  const controllers=new Map();
  document.querySelectorAll('[data-filter-for]').forEach(form=>{
    const id=form.dataset.filterFor,list=document.getElementById(id),items=[...list.querySelectorAll('.hub-filter-item')],controls=[...form.querySelectorAll('input,select')];
    const count=form.querySelector('.hub-filter-count'),empty=document.querySelector(`[data-empty-for="${id}"]`);
    const syncFromURL=()=>{const params=new URLSearchParams(location.search);controls.forEach(control=>{const value=params.get(control.name)||'';control.value=control.tagName==='SELECT'&&![...control.options].some(o=>o.value===value)?'':value;});};
    const update=(writeURL=false,announcement='')=>{
      const words=normalize(form.elements.q.value.trim()).split(/\s+/).filter(Boolean);let visible=0;
      items.forEach(item=>{const search=normalize(item.dataset.search||item.textContent);const match=words.every(word=>search.includes(word))&&controls.filter(c=>c.name!=='q').every(c=>!c.value||item.dataset[c.name]===c.value);item.hidden=!match;if(match)visible++;});
      count.textContent=announcement||`${visible} of ${items.length} ${id==='format-list'?'formats':id==='case-list'?'use cases':'workflow examples'}`;empty.hidden=visible!==0;
      if(writeURL){const url=new URL(location.href);controls.forEach(c=>c.value?url.searchParams.set(c.name,c.value):url.searchParams.delete(c.name));history.replaceState(null,'',url);}
    };
    const clear=(writeURL=true,announcement='')=>{controls.forEach(c=>c.value='');update(writeURL,announcement);};
    form.hidden=false;syncFromURL();update();form.addEventListener('submit',event=>{event.preventDefault();update(true);});
    form.addEventListener('input',()=>update(true));form.addEventListener('change',()=>update(true));
    form.addEventListener('reset',event=>{event.preventDefault();clear();form.elements.q.focus();});
    document.querySelector(`[data-reset="${id}"]`)?.addEventListener('click',()=>{clear();form.elements.q.focus();});
    window.addEventListener('popstate',()=>{syncFromURL();update();revealHash();});controllers.set(id,{items,clear});
  });
  function revealHash(){
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(!id)return;const target=document.getElementById(id);if(!target)return;
    const hiddenItem=target.closest('.hub-filter-item[hidden]');if(hiddenItem){for(const controller of controllers.values())if(controller.items.includes(hiddenItem))controller.clear(true,'Filters cleared to show the linked record.');}
    let parent=target;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
    requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
  }
  window.addEventListener('hashchange',revealHash);revealHash();
  const pageNav=document.querySelector('.hub-jump details');if(pageNav){const wide=matchMedia('(min-width:900px)');const set=()=>pageNav.open=wide.matches;set();wide.addEventListener('change',set);pageNav.addEventListener('click',event=>{if(event.target.closest('a')&&!wide.matches)pageNav.open=false;});}
})();
