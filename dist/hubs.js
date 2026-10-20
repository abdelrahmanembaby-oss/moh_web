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
  const form=document.getElementById('ecosystem-interest-form');if(!form)return;
  const paths=[...form.querySelectorAll('input[name="paths"]')],specifics=[...form.querySelectorAll('[data-path]')];
  const pathStatus=document.getElementById('path-status'),status=document.getElementById('interest-status'),submit=document.getElementById('interest-submit');
  const participant=form.elements.participant_type,organization=form.elements.organization;
  function syncPaths(changed){
    if(changed?.value==='help_me_choose'&&changed.checked){paths.filter(p=>p!==changed).forEach(p=>p.checked=false);pathStatus.textContent='Help me choose selected. Named paths and specific interests have been cleared.';}
    else if(changed?.checked){paths.find(p=>p.value==='help_me_choose').checked=false;pathStatus.textContent='You can select more than one named path.';}
    specifics.forEach(group=>{const selected=paths.some(p=>p.checked&&p.value===group.dataset.path);group.hidden=!selected;group.disabled=!selected;if(!selected)group.querySelectorAll('input').forEach(input=>input.checked=false);});
    paths[0].setCustomValidity(paths.some(p=>p.checked)?'':'Choose at least one path, or select Help me choose.');
  }
  paths.forEach(p=>p.addEventListener('change',()=>syncPaths(p)));
  const syncOrg=()=>{organization.required=participant.value==='organization';if(!organization.required)organization.setCustomValidity('');organization.labels[0].textContent='Organization or institution'+(organization.required?' *':' (optional)');};participant.addEventListener('change',syncOrg);syncOrg();
  const params=new URLSearchParams(location.search),preselect=paths.find(p=>p.value===params.get('path'));
  if(preselect){preselect.checked=true;syncPaths();const specific=specifics.find(s=>s.dataset.path===preselect.value);const candidate=[...(specific?.querySelectorAll('input')||[])].find(i=>i.value===params.get('interest'));if(candidate)candidate.checked=true;}syncPaths();
  const message=form.elements.message,counter=document.getElementById('message-count');message.addEventListener('input',()=>counter.textContent=`${message.value.length.toLocaleString('en')} / 2,000 characters`);
  try{const names=new Intl.DisplayNames(['en'],{type:'region'});const codes='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');const list=document.getElementById('country-options');codes.map(c=>names.of(c)).sort().forEach(name=>{const option=document.createElement('option');option.value=name;list.append(option);});}catch{}
  let inFlight=false,sent=false;
  function showStatus(title,body,error=false){status.replaceChildren();const heading=document.createElement('h3');heading.textContent=title;const text=document.createElement('p');text.textContent=body;const email=document.createElement('a');email.href='mailto:contact@griidai.com';email.textContent='Contact contact@griidai.com';status.append(heading,text,email);status.classList.toggle('error',error);status.hidden=false;status.focus();}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(inFlight||sent)return;syncOrg();syncPaths();
    ['full_name','message','country',...(organization.required?['organization']:[])].forEach(name=>{const input=form.elements[name];input.setCustomValidity(input.value.trim()?'':'Please complete this field.');input.addEventListener('input',()=>input.setCustomValidity(''),{once:true});});
    const profile=form.elements.profile_url;profile.setCustomValidity(!profile.value||/^https?:\/\//i.test(profile.value)?'':'Enter a complete website address, such as https://example.com.');profile.addEventListener('input',()=>profile.setCustomValidity(''),{once:true});
    if(!form.reportValidity())return;
    if(form.elements.company_website.value){showStatus('We could not send your request.','Please leave the hidden anti-spam field empty and try again.',true);return;}
    const selectedPaths=paths.filter(p=>p.checked).map(p=>p.value),selectedInterests=[...form.querySelectorAll('input[name="interests"]:checked')].map(i=>i.value),receivedAt=new Date().toISOString();
    const details=['Ecosystem expression of interest','Participant: '+participant.selectedOptions[0].textContent,'Paths: '+selectedPaths.join(', '),'Interests: '+(selectedInterests.join(', ')||'Not specified'),'Idea: '+message.value.trim(),'Permission to respond: agreed; privacy wording v1, '+receivedAt,'Source: ecosystem / express-interest'].join('\n');
    // Keep the existing Contact Sales field contract. Additional context goes
    // into gisUsage so the existing Sheet/email handler can retain it.
    const payload={fullName:form.elements.full_name.value.trim(),email:form.elements.email.value.trim(),phone:'',city:'',country:form.elements.country.value.trim(),organization:organization.value.trim()||'Individual',role:form.elements.role.value.trim()||'Ecosystem inquiry',linkedin:form.elements.profile_url.value.trim(),gisUsage:details,timestamp:receivedAt};
    inFlight=true;submit.disabled=true;submit.textContent='Sending your interest…';status.hidden=true;
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),25000);
    try{const response=await fetch(form.dataset.endpoint,{method:'POST',mode:'no-cors',credentials:'omit',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload),signal:controller.signal});if(response.type!=='opaque'&&!response.ok)throw new Error('Contact service rejected request');sent=true;showStatus('Request sent — receipt unconfirmed','Your request was sent through our contact service. This browser cannot confirm that it was saved or that an email was delivered. Your answers remain here. If you do not hear from us, contact the team directly. Submission does not confirm acceptance into a program.');submit.textContent='Request sent';}
    catch{showStatus('We could not confirm your submission.','Your answers are still here. Please try again, or contact the team directly. A timed-out request may still have reached the service.',true);submit.textContent='Send Expression of Interest';}
    finally{clearTimeout(timeout);inFlight=false;submit.disabled=sent;}
  });
})();
