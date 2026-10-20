const config=require('./site-publication.cjs');
const cases=require('./use-cases-content.json').records;
module.exports=function publicationRules(html,route){
 if(!config.workflowsEnabled&&route==='solutions')html=html.replace(/<section\b[^>]*id="workflow-proof"[^>]*>[\s\S]*?<\/section>/g,'');
 const isUseCase=route==='use-cases'||route.startsWith('use-cases/'),isIndustry=route==='industries'||route.startsWith('industries/');
 // Remove entire opposite-category menu groups, including their empty headings.
 if(isUseCase)html=html.replace(/<div><span>By Industry<\/span>[\s\S]*?<\/div>/g,'');
 if(isIndustry)html=html.replace(/<div><span>By Use Case<\/span>[\s\S]*?<\/div>/g,'');
 let result=html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,anchor=>{
  const match=anchor.match(/\bhref=(["'])(.*?)\1/);if(!match)return anchor;
  let url;try{url=new URL(match[2],'https://site.invalid/'+route+'/')}catch{return anchor;}
  const pathname=url.pathname.replace(/^\/moh_web(?=\/)/,'');
  const ownOrigin=['https://site.invalid','https://griidai-homepage-review.griidai-9992.chatgpt.site','https://abdelrahmanembaby-oss.github.io'].includes(url.origin);
  if(!ownOrigin)return anchor;
  if(!config.workflowsEnabled&&(/^\/workflows(?:\/|$)/.test(pathname)||/^#workflow-(?:proof|\d+)$/.test(url.hash)))return '';
  if(isUseCase&&/^\/industries(?:\/|$)/.test(pathname))return '';
  if(isIndustry&&/^\/use-cases(?:\/|$)/.test(pathname))return '';
  if(pathname==='/use-cases/'&&url.hash){const record=cases.find(c=>'#'+c.id===url.hash&&c.detailUrl);if(record)return anchor.replace(match[0],`href="${record.detailUrl}"`);}
  return anchor;
 });
 // Hiding an anchor-wrapped legacy card can also remove its ID. Remove local
 // jump links to those absent targets, so no control points at missing content.
 result=result.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,anchor=>{
  const href=anchor.match(/\bhref=(["'])(.*?)\1/);if(!href)return anchor;
  let url;try{url=new URL(href[2],'https://site.invalid/'+route+'/')}catch{return anchor;}
  const pathname=url.pathname.replace(/^\/moh_web(?=\/)/,'').replace(/\/$/,'');
  if(url.origin==='https://site.invalid'&&pathname===('/'+route).replace(/\/$/,'')&&url.hash){let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{return anchor;}if(!result.includes('id="'+id+'"')&&!result.includes("id='"+id+"'"))return '';}
  return anchor;
 });
 return result;
};
