(() => {
  const toggle = document.getElementById('billing-toggle');
  if (!toggle) return;
  const fallback = {
    starter_access: {starter_credits:200,storage_limit_gb:5,max_file_upload_size_gb:2},
    tiers: [
      {tier:'analyst',monthly_price:20,yearly_price:192,allocated_credits:800,storage_limit_bytes:53687091200,max_file_upload_bytes:10737418240},
      {tier:'pro',monthly_price:100,yearly_price:960,allocated_credits:3500,storage_limit_bytes:214748364800,max_file_upload_bytes:53687091200}
    ]
  };
  let data = fallback;
  const initialCycle = new URLSearchParams(location.search).get('cycle');
  let cycle = initialCycle === 'monthly' ? 'monthly' : 'yearly';
  const money = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
  const number = value => Number(value).toLocaleString('en-US', {maximumFractionDigits:2});
  const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
  function render(announce = false) {
    const annual = cycle === 'yearly';
    toggle.setAttribute('aria-checked', String(annual));
    document.getElementById('monthly-label').classList.toggle('is-selected', !annual);
    document.getElementById('annual-label').classList.toggle('is-selected', annual);
    const savings = [];
    for (const tier of data.tiers) {
      if (!['analyst','pro'].includes(tier.tier)) continue;
      const saved = Math.max(0, Math.round((1 - tier.yearly_price / (tier.monthly_price * 12)) * 100));
      savings.push(saved);
      setText(`[data-plan-price="${tier.tier}"]`, money(annual ? tier.yearly_price / 12 : tier.monthly_price));
      const billed = document.querySelector(`[data-plan-billing="${tier.tier}"]`);
      billed.textContent = `Billed ${money(tier.yearly_price)} annually · Save ${saved}%`;
      billed.hidden = !annual;
      setText(`[data-storage="${tier.tier}"]`, `${number(tier.storage_limit_bytes / 1073741824)} GB`);
      setText(`[data-upload="${tier.tier}"]`, `${number(tier.max_file_upload_bytes / 1073741824)} GB`);
      setText(`[data-credits="${tier.tier}"]`, `${Math.round(tier.allocated_credits).toLocaleString('en-US')} credits`);
      document.querySelector(`[data-plan-link="${tier.tier}"]`).href = `https://app.griidai.com/pricing?plan=${tier.tier}&cycle=${cycle}`;
    }
    const starter = data.starter_access;
    setText('[data-storage="starter"]', `${number(starter.storage_limit_gb)} GB`);
    setText('[data-upload="starter"]', `${number(starter.max_file_upload_size_gb)} GB`);
    setText('[data-credits="starter"]', `${Math.round(starter.starter_credits).toLocaleString('en-US')} starter credits (one-time)`);
    setText('[data-save]', `Save ${savings[0] || savings[1] || 0}%`);
    setText('[data-renewal]', annual ? 'annually' : 'monthly');
    document.querySelector('[data-platform-pricing]').href = `https://app.griidai.com/pricing?cycle=${cycle}`;
    if (announce) setText('#pricing-status', `${annual ? 'Annual' : 'Monthly'} pricing selected.`);
  }
  toggle.addEventListener('click', () => { cycle = cycle === 'yearly' ? 'monthly' : 'yearly'; render(true); });
  render();
  const validTier = tier => ['analyst','pro'].includes(tier.tier) && ['monthly_price','yearly_price','allocated_credits','storage_limit_bytes','max_file_upload_bytes'].every(key => typeof tier[key] === 'number' && Number.isFinite(tier[key]) && tier[key] > 0);
  const validStarter = starter => starter && ['starter_credits','storage_limit_gb','max_file_upload_size_gb'].every(key => typeof starter[key] === 'number' && Number.isFinite(starter[key]) && starter[key] > 0);
  async function loadPrices() {
    try {
      const snapshot = await fetch('/pricing-data.json');
      if (snapshot.ok) {
        const saved = await snapshot.json();
        if (Array.isArray(saved.tiers) && saved.tiers.length === 2 && saved.tiers.every(validTier) && validStarter(saved.starter_access)) {data = saved; render();}
      }
    } catch (_) { /* The rendered snapshot also works offline. */ }

  }
  const help = document.querySelector('.pricing-help');
  document.addEventListener('click', event => { if (help.open && !help.contains(event.target)) help.open = false; });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && help.open) { help.open = false; help.querySelector('summary').focus(); } });
  loadPrices();
})();
