const content=require('./use-cases-content.json');
const workflowContent=require('./workflows-content.json');
const {workflowsEnabled}=require('./site-publication.cjs');
const fs=require('node:fs');
const path=require('node:path');

module.exports=function renderUseCases(ui){
  const {esc,hero,jump,section,paragraphs,button,link,table,stepper,industries}=ui;
  const records=content.records.filter(c=>c.publicationStatus==='Published'&&c.productStatus!=='Roadmap');
  const image=(record,eager=false)=>{
    const file=record.image+'-v1.png',bytes=fs.readFileSync(path.join(__dirname,'../dist/assets/use-cases',file));
    return `<img src="/assets/use-cases/${file.replace('.png','-1280.webp')}" srcset="/assets/use-cases/${file.replace('.png','-640.webp')} 640w, /assets/use-cases/${file.replace('.png','-1280.webp')} 1280w" sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 40vw" width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}" alt="Conceptual illustration of ${esc(record.name)}; not a software screenshot or a measured result." loading="${eager?'eager':'lazy'}" decoding="async"${eager?' fetchpriority="high"':''}>`;
  };
  const heroVisual=`<figure class="uc-hero-art">${image(records[0],true)}<figcaption><strong>${esc(records[0].question)}</strong><span>Illustrative</span></figcaption></figure>`;
  const grid=records.map((c,index)=>`<article class="uc-question-card" data-use-case="${c.id}" data-position="${index+1}" data-fallback="${!c.detailUrl}" data-destination="detail"><div class="uc-card-image">${image(c)}<span class="uc-illustrative">Illustrative</span></div><div class="uc-card-copy"><span class="hub-tag">${esc(c.productStatus)}</span><h3>${esc(c.name)}</h3><p class="uc-question">${esc(c.question)}</p><p>${esc(c.evidence)}</p>${link('Explore a Use Case',c.detailUrl||c.fallbackUrl)}</div></article>`).join('');
  const decisionGrid=content.patterns.rows.map(([name,means,examples])=>`<article class="uc-pattern"><h3>${esc(name)}</h3>${paragraphs(means)}<p class="hub-small">${esc(examples)}</p><div class="uc-related-links">${records.filter(c=>c.patterns.includes(name)).map(c=>link(c.name,c.detailUrl)).join('')}</div></article>`).join('');
  const stories=records.map((c,i)=>`<article class="uc-proof-story" id="${c.id}"><div class="uc-proof-copy"><span class="eyebrow">${esc(c.name)}</span><h3>${esc(c.proofTitle)}</h3>${paragraphs(c.paragraphs)}${c.sequence.length?`<ol class="uc-proof-sequence">${c.sequence.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}<div class="uc-related-links">${link('Explore a Use Case',c.detailUrl)}</div></div><figure class="uc-proof-image">${image(c)}<figcaption>Illustrative</figcaption></figure></article>`).join('');
  const workflowCards=content.workflows.rows.flatMap(([name,useCase,copy],index)=>{const w=workflowContent.records.find(w=>w.name===name);if(!w||w.publicationStatus!=='Published'||!['Live','Beta','Example'].includes(w.status))return [];return `<article class="hub-card uc-workflow-card" data-workflow="${w.id}" data-position="${index+1}"><span class="eyebrow">${esc(useCase)}</span><span class="hub-tag">${esc(w.status)}</span><h3>${esc(name)}</h3>${paragraphs(copy)}${link('View Workflow','/workflows/#'+w.id)}</article>`;}).join('');
  const industryCards=content.industries.rows.map(([name,copy],index)=>`<article class="hub-card" data-industry="${industries[index].id}"><h3>${esc(name)}</h3>${paragraphs(copy)}</article>`).join('');
  const questionTargets=['use-case-definition','use-case-process','use-case-review','site-selection','coverage','flood-coastal','hydrology','vegetation','use-case-data','use-case-review'];
  const questions=content.questions.map(([question],index)=>{const record=records.find(c=>c.id===questionTargets[index]);return `<li>${link(question,record?record.detailUrl:'#'+questionTargets[index])}</li>`;}).join('');
  return hero(content.hero.eyebrow,content.hero.title,content.hero.copy,button('Explore a Use Case','#use-case-library')+button('Start for Free','https://app.griidai.com',false),heroVisual)+
    `<div class="container uc-context-link">${link('See How GriidAi Works','/platform/')}</div>`+
    jump([['Use Cases','use-case-library'],['From Question to Result','use-case-process'],['Proof Stories','use-case-proof'],['Data and Method','use-case-data'],['Human Review','use-case-review'],['FAQ','use-case-faq']])+
    section('use-case-definition','',content.definition.title,`<div class="hub-reading">${paragraphs(content.definition.paragraphs)}</div>`)+
    section('use-case-library','',content.grid.title,`<div class="uc-question-grid">${grid}</div>`,{intro:content.grid.intro,pale:true})+
    section('use-case-process','',content.process.title,`${stepper(content.process.steps)}<div class="uc-section-links">${link('Spatial Analysis','/spatial-analysis/')}</div>`)+
    section('use-case-patterns','',content.patterns.title,`<div class="uc-pattern-grid">${decisionGrid}</div>`,{pale:true})+
    section('use-case-proof','',content.proofTitle,`<div class="uc-proof-list">${stories}</div>`)+
    section('use-case-data','',content.data.title,`${table(['Check','Why it matters'],content.data.checks.map(row=>row.map(esc)))}<div class="uc-section-links">${link('Data','/data/')}${link('Bring Your Own Data','/data/#bring-your-data')}${link('Supported Formats','/data/#supported-formats')}</div>`,{pale:true})+
    section('use-case-review','',content.review.title,`${table(['Review moment','What to inspect'],content.review.moments.map(row=>row.map(esc)))}<div class="uc-section-links">${link('Agentic GeoAI','/agentic-geoai/')}</div>`)+
    (workflowsEnabled?section('use-case-workflows','',content.workflows.title,`<div class="uc-workflow-grid">${workflowCards}</div>`,{pale:true}):'')+
    section('use-case-industries','',content.industries.title,`<div class="hub-grid cols-2">${industryCards}</div>`)+
    section('use-case-enterprise','',content.enterprise.title,`<div class="hub-reading">${paragraphs(content.enterprise.copy)}</div><div class="actions">${button('Talk to Sales','/contact-sales.html')}${link('Enterprise','/enterprise/')}</div>`,{pale:true})+
    section('use-case-faq','','Frequently asked questions',`<ul class="uc-question-index">${questions}</ul>`)+
    `<section class="hub-closing" id="use-case-next-step"><div class="container"><h2>${esc(content.final.title)}</h2>${paragraphs(content.final.copy)}<div class="actions">${button('Start for Free','https://app.griidai.com')}${button('Talk to Sales','/contact-sales.html',false)}</div></div></section>`;
};
