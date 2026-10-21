/* Identity and schedule are supplied by the authenticated server before this file. */
(() => {
  const context = window.BMAI_BATCH_CONTEXT;
  if (!context) return;
  const anchor = performance.now();
  window.BMAI_NOW = () => context.serverTime + performance.now() - anchor;
  const ready = () => {
    const header = document.querySelector('.bmai-global-header .studio-nav');
    if (!header || header.querySelector('[data-batch-label]')) return;
    const badge = document.createElement('span');
    badge.className = 'bmai-batch-label';
    badge.dataset.batchLabel = '';
    badge.textContent = context.role==='admin' ? 'Admin · '+context.batch+(context.mode==='student'?' student preview':' · All materials') : context.batch + ' · Your batch schedule';
    header.append(badge);
    if(context.role==='admin'){
      const form=document.createElement('form');form.className='bmai-admin-view';form.method='post';form.action='/api/admin/batch';
      for(const [name,label,options] of [['batch','Preview batch',['B11','B12']],['mode','Access view',['admin','student']]]){
        const select=document.createElement('select');select.name=name;select.setAttribute('aria-label',label);
        options.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value==='admin'?'All materials':value==='student'?'Student locks':value;option.selected=value===context[name];select.append(option)});form.append(select);
      }
      const button=document.createElement('button');button.type='submit';button.textContent='Apply view';form.append(button);header.append(form);
    }
    // Content removed by the server is fetched again at the next release boundary.
    const upcoming = window.BMAI_SESSIONS.map(s => Date.parse(s.unlock)).filter(t => t > context.serverTime);
    if (upcoming.length) {
      const boundary = Math.min(...upcoming);
      const tick = () => { if (window.BMAI_NOW() >= boundary) location.reload(); };
      setInterval(tick, 1000);
      document.addEventListener('visibilitychange', tick);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
