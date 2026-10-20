(() => {
  const root=document.querySelector('.hub-use-cases');
  if(!root)return;
  const event=(name,properties)=>window.griidaiEvents?.push({event:name,...properties});
  root.addEventListener('click',e=>{
    const anchor=e.target.closest('a');if(!anchor)return;
    const hero=anchor.closest('.hub-hero'),final=anchor.closest('#use-case-next-step');
    const label=anchor.textContent.trim(),card=anchor.closest('.uc-question-card');
    const workflow=anchor.closest('.uc-workflow-card'),industry=anchor.closest('#use-case-industries .hub-card'),pattern=anchor.closest('.uc-pattern');
    if(hero&&label.startsWith('Start for Free'))event('use_cases_hero_start_free',{source:'hero'});
    else if(hero&&anchor.hash==='#use-case-library')event('use_cases_explore_anchor',{source:'hero'});
    else if(card)event('use_case_card_click',{use_case_id:card.dataset.useCase,slug:card.dataset.useCase,card_position:Number(card.dataset.position),destination_type:card.dataset.destination,fallback_used:card.dataset.fallback==='true'});
    else if(pattern)event('use_case_pattern_click',{pattern_name:pattern.querySelector('h3').textContent});
    else if(workflow)event('use_cases_workflow_click',{workflow_id:workflow.dataset.workflow,slug:workflow.dataset.workflow,card_position:Number(workflow.dataset.position)});
    else if(industry)event('use_cases_industry_click',{industry_id:industry.dataset.industry,slug:industry.dataset.industry});
    else if(final&&label.startsWith('Start for Free'))event('use_cases_final_start_free',{source:'final_cta'});
    else if(final&&label.startsWith('Talk to Sales'))event('use_cases_final_talk_sales',{source:'final_cta'});
    else if(anchor.closest('#use-case-enterprise'))event('use_cases_enterprise_click',{source_section:'use-case-enterprise'});
  });
})();
