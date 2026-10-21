/* One visual identity per session, reused across every resource type. */
(()=>{'use strict';
const topics={
youtube:{alt:'Channel research, identity, video thumbnails and a channel launch.',steps:'Research · Identity · Launch'},
short:{alt:'A camera, storyboard frames and an editing timeline for an AI movie short.',steps:'Frame · Sound · Edit'},
advertisement:{alt:'A product hero frame between studio lights, ready for image-to-video production.',steps:'Product · Frames · Motion'},
story:{alt:'A character sheet connects to a screenplay, colour palette and shot planning.',steps:'Character · Script · Shots'},
production:{alt:'A production clapperboard for an upcoming lesson.',steps:'Your next creative chapter'}
};
const root=new URL('../',document.querySelector('script[src*="library/site.js"]').src);
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=s=>Object.hasOwn(topics,s?.visual)?s.visual:'production';
const icons={session:'<path d="m9 6 10 6-10 6z"/>',playbook:'<path d="M12 6c-3-2-6-2-9-1v13c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zM12 6v13"/>',homework:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2m-7 7 2 2 4-4m-6 8h8"/>'};
const labels={session:'SESSION / LEARN',playbook:'PLAYBOOK / FOLLOW THE STEPS',homework:'HOMEWORK / BUILD & SUBMIT'};
function html(s,type='session',lazy=false){const topic=topics[key(s)];return '<figure class="studio-topic-figure studio-topic-'+type+'" data-topic="'+key(s)+'"><div class="studio-topic-canvas"><img src="'+new URL('assets/illustrations/'+key(s)+'.svg',root).href+'" alt="'+escape(topic.alt)+'" width="560" height="320" '+(lazy?'loading="lazy"':'')+' decoding="async"><span class="studio-topic-kind" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+(icons[type]||icons.session)+'</svg></span></div><figcaption><span>'+labels[type]+'</span><strong>'+escape(topic.steps)+'</strong></figcaption></figure>';}
function resolveLink(href){const url=new URL(href,root);return window.BMAI_SESSIONS.find(s=>[s.session,s.playbook].filter(Boolean).some(p=>url.pathname===new URL(p,root).pathname)||(s.homework&&url.hostname==='docs.google.com'&&url.pathname.split('/d/')[1]?.split('/')[0]===new URL(s.homework).pathname.split('/d/')[1]?.split('/')[0]));}
function decorateCards(){
 document.querySelectorAll('#playbooks article.card,#homework article.card').forEach(card=>{const type=card.closest('#homework')?'homework':'playbook';const s=[...card.querySelectorAll('a[href]')].map(a=>resolveLink(a.href)).find(Boolean);if(!s)return;card.dataset.sessionId=s.id;if(card.querySelector('.studio-topic-figure'))return;card.querySelector('.library-card-icon')?.remove();card.insertAdjacentHTML('afterbegin',html(s,type));});
}
function addMissingCards(section,type){
 const grid=section.querySelector('.grid');if(!grid)return;
 const known=new Set([...grid.querySelectorAll('article.card')].map(card=>card.dataset.sessionId).filter(Boolean));
 window.BMAI_SESSIONS.filter(s=>s.session&&s.playbook&&!known.has(s.id)).forEach(s=>{
  const card=document.createElement('article');card.className='card'+(type==='homework'?' featured':'');card.dataset.sessionId=s.id;
  const href=type==='homework'?s.playbook+'#share':s.playbook;
  const heading=s.week.replace(/^WEEK (\d+) · DAY (\d+)$/,'Week $1 Day $2')+' '+(type==='homework'?'Homework':'Playbook')+' · '+s.title;
  card.innerHTML='<div class="tag">'+escape(s.week)+' · '+(type==='homework'?'HOMEWORK':'PLAYBOOK')+'</div><h3>'+escape(heading)+'</h3><p>'+escape(s.description)+'</p><div class="actions"><a class="btn '+(type==='homework'?'':'secondary')+'" href="'+escape(href)+'">'+(type==='homework'?'OPEN PLAYBOOK HOMEWORK':'OPEN PLAYBOOK')+'</a></div>';
  grid.append(card);
 });
}
function library(){
 document.querySelectorAll('#playbooks,#homework').forEach(section=>{
  const type=section.id==='homework'?'homework':'playbook',sessions=window.BMAI_SESSIONS.filter(s=>s.session&&s.playbook),grid=section.querySelector('.grid');if(!grid)return;
  let controls=section.querySelector('.bmai-session-picker');if(!controls){controls=document.createElement('div');controls.className='bmai-session-picker';controls.innerHTML='<label>Choose a session<select aria-label="Choose '+type+' session"></select></label><p role="status"></p>';grid.before(controls);const select=controls.querySelector('select');sessions.forEach(s=>{const o=document.createElement('option');o.value=s.id;select.append(o)});select.value=sessions.filter(s=>Date.parse(s.unlock)<=Date.now()).at(-1)?.id||sessions[0].id;select.addEventListener('change',update);}
  const select=controls.querySelector('select');
  function update(){sessions.forEach(s=>{select.querySelector('option[value="'+s.id+'"]').textContent=s.week+' · '+s.title+(Date.parse(s.unlock)>Date.now()?' (locked)':'')});const s=sessions.find(s=>s.id===select.value)||sessions[0],locked=Date.parse(s.unlock)>Date.now(),date=new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(s.unlock)),href=s.playbook+(type==='homework'?'#share':'');grid.innerHTML='<article class="card bmai-selection-card" data-session-id="'+s.id+'"><div class="tag">'+escape(s.week)+' · '+type.toUpperCase()+'</div><h3>'+escape(s.title)+'</h3><p>'+escape(s.description)+'</p>'+(locked?'<p class="bmai-availability">Locked · Opens '+escape(date)+' IST</p>':'')+'<div class="actions"><a class="btn '+(locked?'secondary':'')+'" href="'+new URL(href,root).href+'">'+(locked?'View locked lesson':type==='homework'?'Open playbook homework':'Open playbook')+'</a></div></article>';controls.querySelector('p').textContent=locked?'This lesson is scheduled and remains locked.':'Available now. '+(type==='homework'?'Homework submission is separate from browser checkpoints.':'Follow the tasks, then review your output.');document.dispatchEvent(new Event('bmai:library-change'));}
  update();
 });
}
function intro(){
 if(document.body.dataset.pageType==='home'){library();return;}
 const s=window.BMAI_SESSIONS.find(s=>s.id===document.body.dataset.sessionId);if(!s)return;
 const type=['playbook','homework'].includes(document.body.dataset.pageType)?document.body.dataset.pageType:'session';
 const lock=document.querySelector('.bmai-lock-card');if(lock){if(!lock.querySelector('.studio-topic-figure'))lock.insertAdjacentHTML('afterbegin',html(s,type,false));return;}
 const host=document.querySelector('main>.hero .visual,.studio-session-image,.bmai-session-hero-visual,.bmai-resource-hero-visual,.bmai-playbook-hero-image');
 const overview=document.querySelector('main #overview');
 // A page-authored hero image already explains the lesson; avoid adding a second visual above it.
 if(host||overview?.querySelector('img'))return;
 if(overview&&!overview.querySelector('.studio-topic-figure'))overview.insertAdjacentHTML('afterbegin',html(s,type,false));
}
window.BMAI_VISUALS={topics,html,library,intro};
})();
