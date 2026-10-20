(() => {
 const root=document.querySelector('.hub-data');if(!root)return;
 const emit=(event,data={})=>window.griidaiEvents?.push({event,page_key:'data',...data});
 const normalize=s=>s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
 const filters=new Map(),states={};
 root.querySelectorAll('[data-data-filter]').forEach(form=>{
  const kind=form.dataset.dataFilter,items=[...root.querySelectorAll(kind==='format'?'[data-format-id]':'[data-provider-id]')],empty=root.querySelector(`[data-${kind}-empty]`),count=form.querySelector('.dp-filter-count'),query=form.elements.q;
  const groups=new Map();form.querySelectorAll('input[type=checkbox]').forEach(input=>{if(!groups.has(input.name))groups.set(input.name,[]);groups.get(input.name).push(input);});
  const selected=name=>(groups.get(name)||[]).filter(i=>i.checked).map(i=>i.value);
  const selections=()=>Object.fromEntries([...groups].map(([name])=>[name,selected(name)]));
  const update=(message='')=>{
   const words=normalize(query.value.trim()).split(/\s+/).filter(Boolean),chosen=selections();let visible=0;
   items.forEach(item=>{
    let match=words.every(word=>normalize(item.dataset.search||'').includes(word));
    if(kind==='format'){
     if(chosen.family.length&&!chosen.family.includes(item.dataset.family))match=false;
     const directions=chosen.direction.length?chosen.direction.map(v=>v.toLowerCase()):['upload','inspect','analyze','export'];
     if(chosen.status.length&&!directions.some(d=>chosen.status.includes(item.dataset[d])))match=false;
     if(chosen.direction.length&&!chosen.status.length&&!directions.some(d=>['Supported','Limited','Beta'].includes(item.dataset[d])))match=false;
    }else{
     const values={type:JSON.parse(item.dataset.types),coverage:JSON.parse(item.dataset.coverage),access:[item.dataset.access],provider_type:[item.dataset.providerType],status:[item.dataset.status]};
     for(const [key,options]of Object.entries(chosen))if(options.length&&!options.some(value=>values[key].includes(value)))match=false;
    }
    item.hidden=!match;if(match)visible++;
   });
   if(kind==='format')root.querySelectorAll('[data-format-group]').forEach(group=>group.hidden=![...group.querySelectorAll('[data-format-id]')].some(i=>!i.hidden));
   empty.hidden=visible!==0||items.length===0;count.textContent=message||`${visible} of ${items.length} ${kind==='format'?'formats':'sources'}`;return visible;
  };
  const clear=(message='')=>{query.value='';groups.forEach(inputs=>inputs.forEach(i=>i.checked=false));return update(message);};
  let timer;form.hidden=items.length===0;update();
  form.addEventListener('submit',e=>{e.preventDefault();const n=update();emit(kind==='source'?'data_source_search':'data_format_filter',{result_count:n,...(kind==='format'?{filter_name:'search'}:{})});});
  query.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{const n=update();emit(kind==='source'?'data_source_search':'data_format_filter',{result_count:n,...(kind==='format'?{filter_name:'search'}:{})});},280);});
  form.addEventListener('change',e=>{if(e.target.type!=='checkbox')return;clearTimeout(timer);const n=update();emit('data_'+kind+'_filter',{filter_name:e.target.name,values:selected(e.target.name),result_count:n});});
  form.addEventListener('reset',e=>{e.preventDefault();clearTimeout(timer);const n=clear();query.focus();emit('data_'+kind+'_filter',{filter_name:'reset',values:[],result_count:n});});
  filters.set(kind,{items,update,clear,query,form,groups});
 });
 function toggle(button,open){button.setAttribute('aria-expanded',String(open));const panel=document.getElementById(button.getAttribute('aria-controls'));panel.hidden=!open;return panel;}
 root.querySelectorAll('[data-format-toggle],.dp-provider-toggle').forEach(button=>{button.disabled=false;toggle(button,false);button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';toggle(button,open);if(button.matches('.dp-provider-toggle')){button.textContent=open?'Hide Source Details':'View Source Details';if(open)emit('data_source_expand',{provider_id:button.closest('[data-provider-id]').dataset.providerId});}else if(open)emit('data_format_expand',{format_id:button.dataset.formatToggle});});});
 const focusTarget=target=>{const heading=target.querySelector('h2,h3,h4')||target;heading.tabIndex=-1;requestAnimationFrame(()=>{target.scrollIntoView({block:'start',behavior:'instant'});heading.focus({preventScroll:true});});};
 function reveal(focus=false){
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}if(!id)return;
  const target=document.getElementById(id);
  for(const kind of ['source','format']){const note=root.querySelector(`[data-${kind}-fragment]`);if(note)note.hidden=true;}
  if(!target){const kind=id.startsWith('provider-')||id.startsWith('dataset-')?'source':id.startsWith('format-')?'format':null;if(kind){const note=root.querySelector(`[data-${kind}-fragment]`);note.hidden=false;focusTarget(root.querySelector(kind==='source'?'#data-sources':'#supported-formats'));}return;}
  const record=target.closest('[data-format-id],[data-provider-id]');
  if(record){const kind=record.dataset.formatId?'format':'source',controller=filters.get(kind);if(record.hidden)controller.clear(`Filters cleared to show the linked ${kind==='format'?'format':'source'}.`);const button=record.querySelector(kind==='format'?'[data-format-toggle]':'.dp-provider-toggle');toggle(button,true);if(kind==='source')button.textContent='Hide Source Details';}
  if(target.tagName==='DETAILS')target.open=true;
  if(focus)focusTarget(target);
 }
 addEventListener('hashchange',()=>reveal(true));reveal(Boolean(location.hash));
 root.addEventListener('click',e=>{
  const family=e.target.closest('[data-family] a,a[data-family]');if(family?.matches('a[data-family]')){const controller=filters.get('format');controller.clear();controller.groups.get('family').forEach(input=>input.checked=input.value===family.dataset.family);controller.update();emit('data_family_interaction',{family:family.dataset.family});}
  const link=e.target.closest('a');if(!link)return;
  const section=link.closest('section')?.id||'hero';
  if(link.dataset.dataCta){const target=new URL(link.href),type=target.origin===location.origin?(target.hash?'section':'contact'):'signup';emit('cta_click',{section_key:section,cta_id:link.dataset.dataCta,destination_type:type});}
  if(link.dataset.imageViewer!==undefined)emit('data_proof_expand',{asset_id:link.dataset.assetId,section_key:section});
  const workflow=link.closest('[data-workflow-id]');if(workflow)emit('data_workflow_click',{workflow_id:workflow.dataset.workflowId,section_key:section});
  if(link.dataset.officialProvider)emit('data_source_official_click',{provider_id:link.dataset.officialProvider,placement:'source_details'});
  if(link.getAttribute('href')?.startsWith('#'))setTimeout(()=>reveal(true),0);
 });
 root.querySelectorAll('[data-data-faq]').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)emit('data_faq_expand',{question_id:detail.dataset.dataFaq});}));
 root.querySelectorAll('[data-dataset-id]').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)emit('data_source_dataset_expand',{provider_id:detail.closest('[data-provider-id]').dataset.providerId,dataset_id:detail.dataset.datasetId});}));
 let referrer='direct';try{if(document.referrer)referrer=new URL(document.referrer).origin===location.origin?'internal':'external';}catch{}
 emit('data_page_view',{locale:document.documentElement.lang,referrer_category:referrer});
})();
