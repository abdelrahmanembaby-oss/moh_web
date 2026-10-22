const content=require('./enterprise-content.json');
const industryContent=require('./industries-content.json');
const workflowContent=require('./workflows-content.json');
const fs=require('node:fs');
const path=require('node:path');

module.exports=function renderEnterprise(ui){
  const {esc,hero,jump,section,paragraphs,button,link,table}=ui;
  const sales=(label,source,primary=true)=>button(label,'/contact-sales.html?audience=enterprise&source='+source+'&topic=Enterprise%20workflow%20pilot',primary);
  function image(folder,key,alt,eager=false){const file=key+'-v1',bytes=fs.readFileSync(path.join(__dirname,'../dist/assets',folder,file+'.png'));return `<img src="/assets/${folder}/${file}-1280.webp" srcset="/assets/${folder}/${file}-640.webp 640w, /assets/${folder}/${file}-1280.webp 1280w" sizes="(max-width: 767px) 100vw, (max-width: 1050px) 50vw, 40vw" width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}" alt="${esc(alt)}" loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;}
  const figure=(key,alt,cls='',eager=false)=>`<figure class="ep-concept ${cls}">${image('enterprise',key,alt,eager)}<figcaption>Illustrative</figcaption></figure>`;
  const heroVisual=figure('expert-control','Conceptual terrain study with aligned spatial layers and map fragments representing inspectable inputs and a reviewed method; not software UI or a measured result.','ep-hero-art',true);
  const problems=`<div class="ep-problem-grid">${content.problem.rows.map(([name,symptom,message])=>`<article><h3>${esc(name)}</h3>${paragraphs(symptom)}<p class="ep-value-response">${esc(message)}</p></article>`).join('')}</div>`;
  const operating=`<ol class="ep-operating-flow">${content.operating.steps.map(([step,meaning,control])=>`<li><h3>${esc(step)}</h3>${paragraphs(meaning)}<div class="ep-control"><strong>${esc(content.operating.headers[2])}</strong><p>${esc(control)}</p></div></li>`).join('')}</ol>`;
  const reviewCopies=[content.operating.steps[1][2],content.operating.steps[2][1],content.operating.steps[5][1],content.proof.outputs.rows[0][1]];
  const reviewImages=[
    ['inputs','Stacked terrain, parcel and boundary layers representing inspectable source data.'],
    ['method','Connected terrain tiles and a drafting compass representing a planned analytical method.'],
    ['validation','Magnifying glass over a terrain map representing expert validation.'],
    ['output','Finished thematic map and report representing a spatial result ready to communicate.']
  ];
  const review=`<div class="hub-reading">${paragraphs(content.review.copy)}</div><dl class="ep-review-checks">${content.review.checkpoints.map((name,index)=>{const [key,alt]=reviewImages[index];return `<div><dt><img class="ep-review-image" src="/assets/enterprise/review-${key}-v1-320.webp" width="128" height="128" alt="${esc(alt)}" loading="lazy" decoding="async"><span>${esc(name)}</span></dt><dd>${esc(reviewCopies[index])}</dd></div>`;}).join('')}</dl><div class="ep-section-links">${link('Agentic GeoAI','/agentic-geoai/')}</div>`;
  const reuse=`<div class="ep-split"><div>${paragraphs(content.reuse.copy)}<ul class="ep-statement-list">${content.reuse.safeStatements.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></div>${figure('reviewed-methods','Conceptual illustration of the same reviewed spatial method applied to different terrain study areas; not a workflow-builder interface or an executed analysis.')}</div><ol class="ep-reuse-flow">${content.reuse.stages.map(text=>`<li>${esc(text)}</li>`).join('')}</ol>`;
  const collaboration=`<div class="hub-reading">${paragraphs(content.reuse.collaboration.safeCopy)}<span class="ep-status">Planned</span>${paragraphs(content.reuse.collaboration.roadmapCopy)}</div>`;
  const stack=content.data.stack.publicRows;
  const positioning=`<div class="hub-reading">${paragraphs(content.data.stack.copy)}</div>${table(['System category','Positioning'],stack.map(row=>row.map(esc)))}`;
  const outputs=table(['Output type','Enterprise use'],content.proof.outputs.rows.map(row=>row.slice(0,2).map(esc)));
  const data=`<div class="ep-split"><div>${paragraphs(content.data.copy)}<ul class="ep-statement-list">${content.data.messages.map(text=>`<li>${esc(text)}</li>`).join('')}</ul><div class="ep-section-links">${link('Data','/data/')}${link('Bring Your Own Data','/data/#bring-your-data')}${link('Supported Formats','/data/#supported-formats')}</div></div>${figure('workspace-context','Conceptual aligned elevation, feature and data layers for one area of interest; not a software workspace screenshot.')}</div>`;
  const domains=`<div class="ep-domain-grid">${content.domains.records.map((domain,index)=>{const industry=industryContent.records.find(i=>i.id===domain.industryId&&i.publicationStatus==='Published');if(!industry)return '';return `<article class="ep-domain-card" data-industry="${industry.id}" data-position="${index+1}"><div class="ep-domain-copy"><h3>${esc(domain.name)}</h3>${paragraphs(domain.question)}${link(industry.cta,industry.url)}<div class="ep-related-workflows">${domain.relatedWorkflows.map(id=>{const w=workflowContent.records.find(w=>w.id===id&&w.publicationStatus==='Published'&&['Live','Beta','Example'].includes(w.status));return w?`<a class="text-link" data-workflow="${w.id}" href="/workflows/#${w.id}">${esc(w.name)} <span class="hub-tag">${esc(w.status)}</span><span aria-hidden="true">↗</span></a>`:'';}).join('')}</div></div><figure class="ep-domain-art">${image('industries',industry.image,'Conceptual illustration of '+industry.name+'; not a measured analytical result.')}<figcaption>Illustrative</figcaption></figure></article>`;}).join('')}</div><div class="ep-section-links">${link('Workflows','/workflows/')}</div>`;
  const integrationRows=content.integrations.records.filter(r=>r.publicationStatus==='Published').map(r=>[esc(r.name),`<span class="ep-status">${esc(r.publicStatus)}</span>`]);
  const integrations=`${table(['Integration area','Status'],integrationRows)}<p class="ep-requirements-copy">${esc(content.requirementsCopy)}</p>${sales(content.security.requirementsCTA,'requirements',false)}`;
  const approvedControls=content.security.records.filter(r=>r.publicApproved&&r.documentationUrl&&r.lastVerified);
  const security=`<div class="hub-reading">${paragraphs(content.security.copy)}</div>${approvedControls.length?table(['Control','Documentation'],approvedControls.map(r=>[esc(r.name),link('Documentation',r.documentationUrl)])):''}<div class="ep-section-links">${sales(content.security.requirementsCTA,'requirements')}</div><p class="ep-small">${esc(content.security.cta)}</p>`;
  const pilot=`<ol class="ep-pilot-flow">${content.pilot.stages.map(([stage,action,evidence])=>`<li><h3>${esc(stage)}</h3>${paragraphs(action)}<div class="ep-control"><strong>${esc(content.pilot.headers[2])}</strong><p>${esc(evidence)}</p></div></li>`).join('')}</ol><div class="ep-section-links">${sales(content.pilot.cta,'pilot')}</div><p class="ep-small">${esc(content.pilot.ctaDescription)}</p>`;
  const personas=`<div class="ep-persona-grid">${content.personas.rows.map(([role,value,proof])=>`<article><h3>${esc(role)}</h3>${paragraphs(value)}<p class="ep-persona-proof">${esc(proof)}</p></article>`).join('')}</div>`;
  const workflow=workflowContent.records.find(w=>w.id===content.proof.workflowId&&w.publicationStatus==='Published');
  const proofBodies=[`<p class="ep-proof-question">${esc(workflow.question)}</p><dl><dt>Inputs</dt><dd>${esc(workflow.input)}</dd></dl>`,`<ol class="ep-method-steps">${workflow.methodSteps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`,`${paragraphs(content.operating.steps[3][1])}<p class="ep-control-copy">${esc(content.operating.steps[3][2])}</p>`,`<figure class="ep-proof-art">${image('workflows',workflow.image,'Illustrative drainage and stream-network concept, not the result of an executed enterprise workflow.')}<figcaption>Illustrative</figcaption></figure>${paragraphs(workflow.output)}`,`${paragraphs(content.operating.steps[5][1])}<p class="ep-control-copy">${esc(content.operating.steps[5][2])}</p>`,`${paragraphs(content.operating.steps[6][1])}${link('Data exports','/data/#data-reuse')}`];
  const proof=`<div class="ep-proof-intro"><span class="hub-tag">${esc(content.proof.status)}</span><h3>${esc(workflow.name)}</h3><span class="ep-illustrative">Illustrative</span></div><div class="ep-proof-gallery">${content.proof.frames.map(([number,label,why],index)=>`<details class="ep-proof-frame" id="enterprise-proof-${number}" open><summary><span>${number}</span><h4>${esc(label)}</h4><b aria-hidden="true">+</b></summary><div class="ep-proof-frame-body" data-proof-frame="${number}">${proofBodies[index]}</div></details>`).join('')}</div><div class="ep-section-links">${link('View Workflow','/workflows/#'+workflow.id)}${link('Explore Spatial Analysis','/spatial-analysis/')}</div>`;
  const faq=`<div class="hub-faq">${content.faqs.map(([question,answer],index)=>`<details data-enterprise-faq="${index+1}"><summary>${esc(question)}<span aria-hidden="true">+</span></summary><div>${paragraphs(answer)}${index===2?`<div class="ep-section-links">${link('Bring Your Own Data','/data/#bring-your-data')}${link('Supported Formats','/data/#supported-formats')}</div>`:[3,4,5,6].includes(index)?sales('Talk to Sales','requirements',false):''}</div></details>`).join('')}</div>`;
  const sections={
    hero: hero('Enterprise',content.hero.title,content.hero.copy,sales(content.hero.primaryCTA,'hero')+button(content.hero.secondaryCTA,'/platform/',false),heroVisual),
    definition: section('enterprise-definition','',content.definition.title,`<div class="hub-reading">${paragraphs(content.definition.copy)}${paragraphs(content.definition.boundary)}</div>`),
    problem: section('enterprise-problem','',content.problem.title,problems,{pale:true}),
    operating: section('enterprise-operating-model','',content.operating.title,operating),
    review: section('enterprise-validation','',content.review.title,review,{pale:true}),
    reuse: section('enterprise-reuse','',content.reuse.title,reuse),
    data: section('enterprise-data','',content.data.title,data,{pale:true}),
    collaboration: section('enterprise-collaboration','',content.reuse.collaboration.title,collaboration,{pale:true}),
    outputs: section('enterprise-outputs','',content.proof.outputs.title,outputs),
    positioning: section('enterprise-positioning','',content.data.stack.title,positioning,{pale:true}),
    domains: section('enterprise-domains','',content.domains.title,domains),
    integrations: section('enterprise-integrations','',content.integrations.title,integrations,{pale:true}),
    security: section('enterprise-security','',content.security.title,security),
    pilot: section('enterprise-pilot','',content.pilot.title,pilot,{pale:true}),
    personas: section('enterprise-stakeholders','',content.personas.title,personas),
    proof: section('enterprise-proof','',content.proof.title,proof,{pale:true}),
    faqs: section('enterprise-faq','','Frequently asked questions',faq,{pale:true}),
    final: `<section class="hub-closing" id="enterprise-next-step"><div class="container"><h2>${esc(content.final.title)}</h2>${paragraphs(content.final.copy)}<div class="actions">${sales(content.final.primaryCTA,'final')}${button(content.final.secondaryCTA,'https://app.griidai.com',false)}</div></div></section>`
  };
  // Follow the numbered content chapters as clarified by the user.
  // Keep their H2 sections separate instead of grouping them by the summary blueprint.
  const order=content.sectionOrder.map(item=>item.key);
  if(order.length!==Object.keys(sections).length||new Set(order).size!==order.length||order.some(key=>!Object.hasOwn(sections,key)))throw new Error('Invalid Enterprise document section order');
  return order.map(key=>sections[key]+(key==='hero'?jump([['Operating Model','enterprise-operating-model'],['Human Review','enterprise-validation'],['Requirements','enterprise-integrations'],['Workflows','enterprise-domains'],['Pilot','enterprise-pilot'],['FAQ','enterprise-faq']]):'')).join('');
};
