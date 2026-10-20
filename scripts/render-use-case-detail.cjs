const fs=require('node:fs'),path=require('node:path');
module.exports=function renderUseCaseDetail(ui,record){
 const {esc,hero,section,paragraphs,button,link}=ui;
 const file=record.image+'-v1',bytes=fs.readFileSync(path.join(__dirname,'../dist/assets/use-cases',file+'.png'));
 const art=`<figure class="uc-hero-art"><img src="/assets/use-cases/${file}-1280.webp" srcset="/assets/use-cases/${file}-640.webp 640w, /assets/use-cases/${file}-1280.webp 1280w" sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 40vw" width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}" alt="Conceptual illustration of ${esc(record.name)}; not a software screenshot or a measured result." loading="eager" fetchpriority="high" decoding="async"><figcaption>Illustrative</figcaption></figure>`;
 let introduction=hero(record.name,record.name,record.question,button('Start for Free','https://app.griidai.com')+button('Talk to Sales','/contact-sales.html',false),art);
 introduction=introduction.replace('<span>'+esc(record.name)+'</span></div>',`<a href="/use-cases/">Use Cases</a><span aria-hidden="true">/</span><span>${esc(record.name)}</span></div>`);
 const body=`<span class="hub-tag">${esc(record.productStatus)}</span><div class="uc-detail-copy">${paragraphs(record.paragraphs)}<p class="uc-detail-evidence">${esc(record.evidence)}</p>${record.sequence.length?`<ol class="uc-proof-sequence">${record.sequence.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}</div>`;
 // Each record's existing paragraphs and sequence remain the editable source.
 // Future use-case content can be added here without changing the hub or industry page.
 return introduction+section('use-case-overview','',record.proofTitle,body)+`<section class="hub-section pale uc-detail-return"><div class="container">${link('All Use Cases','/use-cases/')}</div></section>`;
};
