/* Prompt Vault search, release locks, editable fields and one-click copy. */
(()=>{
  'use strict';
  const page=document.querySelector('[data-vault-sessions]');
  if(!page)return;
  const groups=[...page.querySelectorAll('[data-vault-session]')];
  const cards=[...page.querySelectorAll('.prompt-vault-card')];
  const buttons=[...document.querySelectorAll('[data-vault-session-button]')];
  const search=document.querySelector('[data-vault-search]');
  const kind=document.querySelector('[data-vault-kind]');
  const results=document.querySelector('[data-vault-results]');
  const decode=value=>String(value||'').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  const rendered=card=>{let text=card.dataset.promptTemplate||'';card.querySelectorAll('[data-prompt-field]').forEach(input=>{const key=input.dataset.promptField;if(input.value.trim()){const value=input.dataset.promptFormat==='json-string'?JSON.stringify(input.value.trim()).slice(1,-1):input.value.trim();text=text.split(key).join(value);}});return text;};
  const missing=card=>[...card.querySelectorAll('[data-prompt-field]')].filter(input=>!input.value.trim());
  const fieldStatus=card=>{const status=card.querySelector('[data-prompt-field-status]');if(status){const count=missing(card).length;status.textContent=count?`${count} field${count===1?'':'s'} to fill. Copy the original template if you want to edit elsewhere.`:'Working copy ready. The original source stays unchanged.';}};
  const announce=message=>{let live=document.querySelector('.prompt-vault-live');if(!live){live=document.createElement('p');live.className='prompt-vault-live';live.setAttribute('aria-live','polite');document.querySelector('.prompt-vault-page')?.prepend(live);}live.textContent=message;};
  const dateLabel=iso=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(iso))+' IST';
  const isLocked=group=>Date.parse(group.dataset.vaultRelease)>Date.now();
  let selected='';

  function syncLocks(){
    groups.forEach(group=>{
      const locked=isLocked(group),body=group.querySelector('[data-vault-session-body]'),notice=group.querySelector('[data-vault-locked]');
      group.classList.toggle('is-locked',locked);body.hidden=locked;notice.hidden=!locked;
      if(locked)notice.querySelector('[data-vault-lock-date]').textContent='Opens '+dateLabel(group.dataset.vaultRelease)+'.';
    });
    buttons.forEach(button=>{const group=groups.find(item=>item.dataset.vaultSession===button.dataset.vaultSessionButton);const locked=group&&isLocked(group);button.classList.toggle('is-locked',!!locked);button.setAttribute('aria-label',(button.textContent.trim()||'Session')+(locked?' — locked':''));});
  }

  buttons.forEach(button=>{button.id='vault-tab-'+(button.dataset.vaultSessionButton||'all');button.setAttribute('aria-controls','vault-results');});
  page.id='vault-results';page.setAttribute('role','tabpanel');
  const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';
  function updateUrl(){
    const url=new URL(location.href);url.searchParams.delete('session');if(selected)url.searchParams.set('lesson',window.BMAI_SESSIONS.find(s=>s.id===selected)?.route||selected);else url.searchParams.delete('lesson');url.hash='';history.replaceState(null,'',url);
  }

  function filter({updateHistory=false}={}){
    const query=search.value.trim().toLowerCase(),type=kind.value;
    let visible=0,lockedCount=0;
    groups.forEach(group=>{
      const locked=isLocked(group),sessionMatch=!selected||selected===group.dataset.vaultSession;
      if(locked)lockedCount++;
      let matches=0;
      group.querySelectorAll('.prompt-vault-card').forEach(card=>{
        const show=sessionMatch&&!locked&&(!query||(card.dataset.promptSearch||'').includes(query))&&(!type||card.dataset.promptKind===type);
        card.hidden=!show;if(show){matches++;visible++;}
      });
      group.querySelectorAll('[data-vault-kind-section]').forEach(section=>{section.hidden=!locked&&![...section.querySelectorAll('.prompt-vault-card')].some(card=>!card.hidden);});
      const groupSearch=!query||group.querySelector('.prompt-vault-session-head').textContent.toLowerCase().includes(query);
      group.hidden=!sessionMatch||(!locked&&matches===0)||(locked&&!groupSearch);
    });
    buttons.forEach(button=>{const active=button.dataset.vaultSessionButton===selected;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    page.setAttribute('aria-labelledby',buttons.find(button=>button.dataset.vaultSessionButton===selected).id);
    results.textContent=`${visible} prompt${visible===1?'':'s'} shown${selected?' for this session':''}. ${lockedCount} session${lockedCount===1?' is':'s are'} still locked.`;
    if(updateHistory)updateUrl();
  }

  cards.forEach(card=>{
    const pre=card.querySelector('[data-prompt-text]');
    const copy=async(original=false)=>{if(!original&&missing(card).length){fieldStatus(card);missing(card)[0].focus();announce('Fill the remaining fields, or choose Copy original template.');return;}const text=original?card.dataset.promptTemplate:rendered(card);try{await navigator.clipboard.writeText(text);announce(original?'Original template copied.':'Prompt copied to your clipboard.');}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();const copied=document.execCommand('copy');area.remove();announce(copied?'Prompt copied to your clipboard.':'Copy failed. Open the full prompt and select its text.');}};
    card.querySelectorAll('[data-prompt-field]').forEach(input=>input.addEventListener('input',()=>{if(pre)pre.textContent=rendered(card);fieldStatus(card);}));
    card.querySelector('[data-prompt-copy]')?.addEventListener('click',()=>copy());
    card.querySelector('[data-prompt-original]')?.addEventListener('click',()=>copy(true));
    card.querySelector('[data-prompt-reset]')?.addEventListener('click',()=>{card.querySelectorAll('[data-prompt-field]').forEach(input=>input.value='');if(pre)pre.textContent=card.dataset.promptTemplate||'';fieldStatus(card);announce('Prompt fields reset.');});
    fieldStatus(card);
  });

  const select=button=>{selected=button.dataset.vaultSessionButton;search.value='';kind.value='';filter({updateHistory:true});};
  buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>{select(button);if(selected)document.querySelector(`[data-vault-session="${selected}"]`)?.scrollIntoView({block:'start',behavior:motion()});});
    button.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=(index+1)%buttons.length;else if(event.key==='ArrowLeft')target=(index+buttons.length-1)%buttons.length;else if(event.key==='Home')target=0;else if(event.key==='End')target=buttons.length-1;else return;event.preventDefault();select(buttons[target]);buttons[target].focus();buttons[target].scrollIntoView({block:'nearest',inline:'nearest',behavior:motion()});});
  });
  search.addEventListener('input',()=>filter());kind.addEventListener('change',()=>filter());
  document.querySelector('[data-vault-clear]')?.addEventListener('click',()=>{selected='';search.value='';kind.value='';filter({updateHistory:true});search.focus();});
  document.querySelectorAll('[data-vault-scroll]').forEach(button=>button.addEventListener('click',()=>document.querySelector('[data-vault-session-tabs]').scrollBy({left:Number(button.dataset.vaultScroll)*360,behavior:'smooth'})));

  syncLocks();
  const target=location.hash?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;
  const params=new URL(location.href).searchParams;const requested=params.has('lesson')?window.BMAI_SESSIONS.find(s=>(s.route||s.id)===params.get('lesson'))?.id:params.get('session');
  selected=target?.closest('[data-vault-session]')?.dataset.vaultSession||((requested&&groups.some(group=>group.dataset.vaultSession===requested))?requested:'');
  filter();
  if(target){const group=target.closest('[data-vault-session]');const destination=isLocked(group)?group.querySelector('[data-vault-locked]'):target;if(!isLocked(group))target.querySelector('details')?.setAttribute('open','');requestAnimationFrame(()=>{destination.scrollIntoView({block:'center'});if(!isLocked(group)){target.tabIndex=-1;target.focus({preventScroll:true});}});}
  setInterval(()=>{const before=groups.map(isLocked).join(',');syncLocks();const after=groups.map(isLocked).join(',');if(before!==after)filter();},1000);
})();
