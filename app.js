(function(){'use strict';
const siteRoot=new URL('../',document.querySelector('script[src*="library/site.js"]').src);
const page=location.pathname.startsWith(siteRoot.pathname)?location.pathname.slice(siteRoot.pathname.length)||'index.html':'index.html';

const S=window.BMAI_SESSIONS;
// Migrate saved navigation once; overlapping old week/day paths now name different lessons.
try{if(localStorage.getItem('bmai:route-version')!=='20261028'){
 const last=localStorage.getItem('bmai:lastPath');
 for(const s of S)for(const field of ['session','playbook'])if(last&&s.previousRoutes?.[field]===last)localStorage.setItem('bmai:lastPath',s[field]);
 localStorage.setItem('bmai:route-version','20261028');
}}catch(e){}




function isUnlocked(x){return !!x&&((x.kind==='orientation'&&x.access==='completed')||(!!x.unlock&&new Date(x.unlock).getTime()<=now()))}
function sessionIdFromHref(href){
 try{
  const u=new URL(href,location.href);
  const markerIndex=u.pathname.startsWith(siteRoot.pathname)?0:-1;
  if(u.origin===location.origin){
   const rel=(markerIndex>=0?u.pathname.slice(siteRoot.pathname.length):u.pathname).replace(/^\/+|\/+$/g,"");
   const matched=S.find(x=>[x.session,x.playbook].filter(Boolean).includes(rel));
   if(matched)return matched.id;
   const sessionPath=rel.match(/^sessions\/(week-\d+-day-\d+)(?:\/|$)/);
   if(sessionPath){const directory='sessions/'+sessionPath[1]+'/';return S.find(x=>x.session?.startsWith(directory))?.id||null;}
  }
  const external=u.href.replace(/\/$/,"");
  const docId=u.hostname==="docs.google.com"?u.pathname.match(/^\/document\/d\/([^/]+)/)?.[1]:null;
  const matched=S.find(x=>x.homework&&(docId?new URL(x.homework).pathname.includes("/document/d/"+docId):x.homework.replace(/\/$/,"")===external));
  return matched?matched.id:null
 }catch(e){return null}
}

const stages=["IDEA","BLUEPRINT","CHARACTERS","VISUAL WORLD","STORY","SHOTS","MOTION","EDIT","REVIEW","MOVIE"];

function now(){return Date.now()}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function byId(id){return S.find(x=>x.id===id)}
function pageId(){return document.body.dataset.sessionId||null}
function pageSession(){const id=pageId();return id?byId(id):null}
function pageLabel(){return ({session:"SESSION GUIDE",playbook:"PLAYBOOK",homework:"HOMEWORK",resource:"RESOURCE"})[document.body.dataset.pageType]||"SESSION GUIDE"}
function current(){let found=null;for(const x of S)if(x.kind!=='orientation'&&x.session&&new Date(x.unlock).getTime()<=now())found=x;return found}
function next(){return S.find(x=>new Date(x.start).getTime()>now())}
function basePath(){return siteRoot.href}
function dateParts(iso){return new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Kolkata"}).format(new Date(iso))}
function timeParts(iso){return new Intl.DateTimeFormat("en-IN",{hour:"numeric",minute:"2-digit",hour12:true,timeZone:"Asia/Kolkata"}).format(new Date(iso))}
function releaseLabel(x){return dateParts(x.unlock)+' · '+timeParts(x.unlock)+' IST'}
function dateRange(x){if(!x.start)return '';const start=dateParts(x.start).replace(/ /g,"\u00a0"),time=timeParts(x.start),tz="\u00a0IST";return x.end?start+" · "+time+" to "+timeParts(x.end)+tz:start+" · "+time+tz}
function countdown(iso){let d=new Date(S.find(x=>x.start===iso)?.unlock||iso).getTime()-now();if(d<=0)return"AVAILABLE NOW";const days=Math.floor(d/86400000);d%=86400000;const h=Math.floor(d/3600000);d%=3600000;const m=Math.floor(d/60000);d%=60000;const s=Math.floor(d/1000);return(days?days+"d ":"")+String(h).padStart(2,"0")+"h "+String(m).padStart(2,"0")+"m "+String(s).padStart(2,"0")+"s"}
function sessionUrl(x){return x.session?basePath()+x.session:null}
function lockPage(){
if(document.body.dataset.pageType&&document.body.dataset.pageType.startsWith('prompt-vault'))return false;
const x=pageSession();if(!x)return false;
if(isUnlocked(x))return false;
const hub=basePath()+"index.html";
document.documentElement.classList.add("bmai-locking");
document.querySelectorAll("body > *").forEach(el=>{if(!el.classList.contains("bmai-global-header")&&!el.classList.contains("bmai-skip-link")&&!el.classList.contains("studio-site-footer"))el.remove()});
document.body.className="bmai-locked-page";
const skip=document.querySelector(".bmai-skip-link")||document.createElement("a");
skip.className="bmai-skip-link";
skip.href="#main-content";
skip.textContent="Skip to main content";
if(!skip.isConnected)document.body.appendChild(skip);
const main=document.createElement("main");
main.id="main-content";
main.className="bmai-lock-screen";
main.innerHTML='<div class="bmai-lock-card"><div class="bmai-lock-avatars"><div class="studio-avatar ready" aria-label="Alexx ready for your next creative step"></div></div><div class="bmai-lock-kicker">BUILD MY AI MOVIE · SESSION LOCKED</div><div class="bmai-lock-week">'+esc(x.week)+'</div><div class="bmai-lock-date">'+esc(dateRange(x))+'</div><h1>'+esc(x.title)+'</h1><p>All session materials unlock one hour before class so you can read ahead.</p><div class="bmai-lock-count" id="bmaiLockCount">'+esc(countdown(x.unlock))+'</div><div class="bmai-lock-note">The page will unlock automatically when the countdown reaches zero. You do not need to refresh.</div><a class="btn btn-primary bmai-lock-home" aria-label="Back to Home" title="Back to home" href="'+hub+'"><svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="20"><path d="M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9"></path></svg> Back to Home</a></div>';
document.body.insertBefore(main,document.querySelector(".studio-site-footer"));
function tick(){const el=document.getElementById("bmaiLockCount");if(!el)return;el.textContent=countdown(x.unlock);if(new Date(x.unlock).getTime()<=now())location.reload()}
tick();setInterval(tick,1000);return true
}
function applyBrandMark(){const iconHref=basePath()+"assets/brand/build-my-ai-movie-mark.svg";if(!document.querySelector("link[data-bmai-favicon]")){const icon=document.createElement("link");icon.rel="icon";icon.type="image/svg+xml";icon.href=iconHref;icon.setAttribute("data-bmai-favicon","true");document.head.appendChild(icon)}const brand=document.querySelector("header .brand");if(!brand||brand.querySelector(".bmai-brand-mark"))return;const mark=document.createElement("img");mark.className="bmai-brand-mark";mark.src=basePath()+"assets/brand/build-my-ai-movie-mark.svg";mark.alt="";mark.setAttribute("aria-hidden","true");brand.insertBefore(mark,brand.firstChild)}
function enhanceLongText(){
 document.querySelectorAll('.code-block,pre').forEach((el,i)=>{
   if(el.closest('details')||el.dataset.bmaiLongText==='true')return;
   const text=(el.innerText||'').trim();
   if(text.length<500)return;
   const d=document.createElement('details');
   d.className='bmai-long-text';
   const s=document.createElement('summary');
   s.textContent=text.length>3000?'Open full prompt / text':'Open full text';
   el.parentNode.insertBefore(d,el);
   d.appendChild(s);
   d.appendChild(el);
   el.dataset.bmaiLongText='true';
 });
}
function applyPageIdentity(){
 document.documentElement.dataset.bmaiPage=document.body.dataset.pageId||"hub";
}
function setupHeaderActions(){
 const icon=(name)=>{
  const common='aria-hidden="true" class="bmai-header-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  if(/session|guide/i.test(name))return `<svg ${common}><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18M7 5l4 5m3-5 4 5m-8 3 5 3-5 3z"/></svg>`;
  if(/playbook/i.test(name))return `<svg ${common}><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1zM12 6v14"/></svg>`;
  if(/homework/i.test(name))return `<svg ${common}><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2m-7 8 3 3 5-6"/></svg>`;
  if(/prompt|vault/i.test(name))return `<svg ${common}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8m-4-4h8"/></svg>`;
  if(/resource|tool/i.test(name))return `<svg ${common}><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12h18m-9 0v3"/></svg>`;
  return `<svg ${common}><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-5"/></svg>`;
 };
 document.querySelectorAll('.bmai-global-header .studio-nav').forEach(nav=>{
  const actions=nav.querySelector('.nav-links,.bmai-session-top-actions'),home=nav.querySelector(':scope > .bmai-header-home');
  if(actions&&home)actions.prepend(home);
 });
 document.querySelectorAll('.bmai-global-header :is(.nav-links,.bmai-session-top-actions) a').forEach(a=>{
  a.classList.add('bmai-header-action');
  const label=(a.textContent||'').trim();
  const existing=a.querySelector('svg');
  if(existing){existing.classList.add('bmai-header-action-icon');return}
  a.insertAdjacentHTML('afterbegin',icon(label));
 });
}
function setupMobileHeader(){
document.querySelectorAll("header .studio-nav,header .nav,.topbar .nav,.top .nav").forEach((nav,index)=>{
 const links=nav.querySelector(".nav-links,.bmai-session-top-actions");
 if(!links||links.classList.contains("brand")||nav.querySelector(".bmai-mobile-menu"))return;
 if(links.querySelector("a")===null)return;
 if(!links.id)links.id="bmai-mobile-nav-"+index;
 const btn=document.createElement("button");btn.type="button";btn.className="bmai-mobile-menu";btn.setAttribute("aria-label","Open navigation");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-controls",links.id);
 btn.innerHTML='<span></span><span></span><span></span>';
 const close=()=>{nav.classList.remove("mobile-nav-open");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Open navigation")};
 btn.addEventListener("click",()=>{
   const open=nav.classList.toggle("mobile-nav-open");btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Close navigation":"Open navigation");
   if(open){const first=links.querySelector("a");if(first)setTimeout(()=>first.focus(),0)}
 });
 links.querySelectorAll("a").forEach(a=>a.addEventListener("click",close));
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("mobile-nav-open")){close();btn.focus()}});
 document.addEventListener("click",e=>{if(nav.classList.contains("mobile-nav-open")&&!nav.contains(e.target))close()});
 nav.appendChild(btn);
});
}
function setupScrollControls(){
const targets=[...document.querySelectorAll(".bmai-production-pipeline,.sc,.scroll,.flow,[data-horizontal-scroll],table")];
targets.forEach(el=>{
 if(el.closest(".bmai-scroll-shell")||el.dataset.scrollEnhanced==="true")return;
 const shell=document.createElement("div");shell.className="bmai-scroll-shell";shell.dataset.scrollEnhanced="true";
 const viewport=document.createElement("div");viewport.className="bmai-scroll-viewport";
 el.parentNode.insertBefore(shell,el);viewport.appendChild(el);shell.appendChild(viewport);
 const prev=document.createElement("button"),next=document.createElement("button");
 prev.type="button";next.type="button";prev.className="bmai-scroll-control prev";next.className="bmai-scroll-control next";
 prev.setAttribute("aria-label","Scroll left");next.setAttribute("aria-label","Scroll right");prev.innerHTML="‹";next.innerHTML="›";
 shell.append(prev,next);
 const sync=()=>{const max=Math.max(0,viewport.scrollWidth-viewport.clientWidth);shell.classList.toggle("has-overflow",max>4);shell.classList.toggle("at-start",viewport.scrollLeft<=4);shell.classList.toggle("at-end",viewport.scrollLeft>=max-4)};
 prev.addEventListener("click",()=>viewport.scrollBy({left:-Math.max(220,viewport.clientWidth*.72),behavior:"smooth"}));
 next.addEventListener("click",()=>viewport.scrollBy({left:Math.max(220,viewport.clientWidth*.72),behavior:"smooth"}));
 viewport.addEventListener("scroll",sync,{passive:true});window.addEventListener("resize",sync);sync();
});
}
function progress(){
const boxes=[...document.querySelectorAll('main input[type="checkbox"]')];if(!boxes.length)return;
const state=window.BMAI_PROGRESS, session=pageId(), isPlaybook=document.body.dataset.pageType==='playbook';
const mainBoxes=[...document.querySelectorAll('#checklist input[type="checkbox"], main input[type="checkbox"][data-index]')];
boxes.forEach(b=>{const text=b.getAttribute('aria-label')||b.closest('label')?.textContent||b.parentElement.textContent;
 if(!b.closest('label')&&!b.hasAttribute('aria-label'))b.setAttribute('aria-label',text.trim());
 const spec=window.BMAI_LESSON||(typeof sessionData!=='undefined'?sessionData:null),index=Number(b.dataset.index);
 const criterion=b.hasAttribute('data-index')&&spec?.checklist?.[index]?spec.checklist[index]:text;
 b.dataset.legacyTaskKey=state.legacyFor(session,criterion);b.dataset.taskKey=state.keyFor(session,criterion);
});
function update(){const primary=mainBoxes.length?mainBoxes:boxes,done=primary.filter(b=>b.checked).length,pct=Math.round(done/primary.length*100);
document.querySelectorAll('.bmai-progress-value,#progressNumber').forEach(el=>el.textContent=pct+'%');
document.querySelectorAll('.bmai-progress-fill,#progressFill').forEach(el=>el.style.width=pct+'%');
const text=document.getElementById('progressText');if(text)text.textContent=done===primary.length?'All self-review checkpoints complete. Record and share your work using the homework instructions.':(primary.length-done)+' self-review checkpoints left.';
const status=document.getElementById('homeworkStatus');if(status)status.textContent=done+' / '+primary.length+' checkpoints';
primary.forEach(b=>b.closest('label')?.classList.toggle('done',b.checked));
const guideFill=document.getElementById('pb')||document.getElementById('prog'),guideText=document.getElementById('pt');if(guideFill)guideFill.style.width=pct+'%';if(guideText)guideText.textContent=done+' of '+primary.length+' tasks done';
}
const legacyBoxes=[...document.querySelectorAll('.checklist input[type="checkbox"], input[type="checkbox"][data-index]')];
const key=isPlaybook?'bmai-tasks:'+session:'bmai-page-tasks:'+page;
const guideKey=({'sessions/week-1-day-2/index.html':'w2d1-session','sessions/week-2-day-1/index.html':'w2d2'})[page];state.bind(boxes,{key,legacyKey:guideKey||'bmai-progress:'+(pageSession()?.previousRoutes?.[isPlaybook?'playbook':'session']||page),legacyBoxes:guideKey?boxes:legacyBoxes,update});
}
function renderCard(x){
const cur=current(),unlocked=isUnlocked(x),isCurrent=cur&&cur.id===x.id,isNext=next()&&next().id===x.id;
let action;
if(x.session){const badge=unlocked?'':'<span class="bmai-availability">Locked · Opens '+esc(releaseLabel(x))+'</span>';action=badge+'<a class="btn '+(unlocked?"":"secondary")+'" href="'+esc(sessionUrl(x))+'">'+(unlocked?'Session guide':'View locked lesson')+'</a>'+(unlocked&&x.playbook?'<a class="btn secondary" href="'+esc(basePath()+x.playbook)+'">Playbook</a><a class="btn secondary" href="'+esc(basePath()+x.playbook)+'#share">Homework</a>':'');}
else action='<span class="lock-label">'+(unlocked?"CONTENT COMING SOON":"CONTENT NOT RELEASED")+'</span>';
const status=isCurrent?"CURRENT SESSION":!x.session?"UNRELEASED":new Date(x.start).getTime()>now()?(unlocked?"REVIEW OPEN":"UPCOMING"):"AVAILABLE NOW";
const extra='';
return '<article class="session schedule-row '+(isCurrent?"is-current ":"")+(unlocked?"":"upcoming")+'"><div class="session-rail">'+window.BMAI_VISUALS.html(x,'session')+'<div class="session-number">'+esc(x.week)+'</div><div class="session-date">'+esc(dateRange(x))+'</div></div><div><div class="session-status">'+status+(isNext&&!isCurrent?" · NEXT":"")+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.description)+'</p></div><div class="actions">'+action+extra+'</div></article>'
}
function homepage(){
if(document.body.dataset.pageType!=="home")return;
const reviewBanner=document.getElementById("bmaiReviewBanner");if(reviewBanner)reviewBanner.hidden=true;
const cur=current(),nxt=next();
const heroAction=document.querySelector('[data-current-action]');if(heroAction&&cur){heroAction.href=basePath()+cur.playbook;heroAction.querySelector('span').textContent='CONTINUE LEARNING';heroAction.querySelector('strong').textContent=cur.title;}
const heroNext=document.querySelector('[data-next-date]');if(heroNext)heroNext.textContent=nxt?'Next class: '+dateRange(nxt):'All scheduled lessons are available.';
try{const last=localStorage.getItem('bmai:lastPath'),session=S.find(x=>[x.session,x.playbook].includes(last));
 if(heroAction&&last&&session&&isUnlocked(session)){heroAction.href=basePath()+last;heroAction.querySelector('span').textContent='RESUME WHERE YOU LEFT OFF';heroAction.querySelector('strong').textContent=session.title;}
}catch{}
const title=document.querySelector(".bmai-studio-card h2"),desc=document.querySelector(".bmai-studio-card p.muted"),links=document.querySelectorAll(".bmai-studio-card .btn");
if(cur&&title){
title.innerHTML=esc(cur.week)+"<br><span>"+esc(cur.title)+"</span>";
if(desc)desc.textContent=cur.session?"Ready to keep creating? Revisit the lesson, open your playbook, and turn the next step into a finished piece.":"This session is now on the cohort schedule. Session materials will appear here as they are released.";
const status=document.querySelector(".bmai-studio-card .bmai-chip.active");if(status)status.textContent=cur.session?"CURRENT SESSION":"CURRENT · CONTENT COMING SOON";
const stageChip=document.querySelector(".bmai-studio-card .bmai-chip[data-session-stage]");if(stageChip)stageChip.textContent=cur.stage||"PRODUCTION";const stageTitle=document.getElementById("bmaiCurrentStage");if(stageTitle)stageTitle.textContent=cur.stage||"PRODUCTION";
const currentImage=document.getElementById("bmaiCurrentImage");if(currentImage){currentImage.hidden=!cur.hero;if(cur.hero){currentImage.src=basePath()+cur.hero;currentImage.alt=cur.title+" - session hero image";}}
const numberChip=document.querySelector(".bmai-studio-card .bmai-chip[data-session-number]");if(numberChip)numberChip.textContent="SESSION "+String(cur.number).padStart(2,"0");
if(links[0]){if(cur.session){links[0].href=sessionUrl(cur);links[0].textContent="REVIEW SESSION GUIDE →";links[0].style.display="inline-block";links[0].classList.remove("secondary")}else{links[0].removeAttribute("href");links[0].textContent="SESSION CONTENT COMING SOON";links[0].style.display="inline-block";links[0].classList.add("secondary")}}
if(links[1]){if(cur.playbook){links[1].href=basePath()+cur.playbook;links[1].textContent="WORK THROUGH PLAYBOOK →";links[1].style.display="inline-block"}else links[1].style.display="none"}
}
const stageWrap=document.querySelector(".bmai-production-pipeline");
if(stageWrap){stageWrap.innerHTML=stages.map((s,i)=>'<div class="stage '+(cur&&cur.stage===s?"active":"")+'">'+String(i+1).padStart(2,"0")+'<br>'+s+'</div>').join("")}
const sched=document.getElementById("bmaiSchedule");
const listed=S.filter(x=>x.kind!=='orientation');
const unreleased=S.filter(x=>!x.session&&x.id!==nxt?.id);
if(sched){const openWeeks=new Set([...sched.querySelectorAll('details[open]')].map(d=>d.dataset.week));const weeks=[...new Set(listed.map(s=>s.week.match(/WEEK (\d+)/i)[1]))];sched.innerHTML=weeks.map(week=>{const lessons=listed.filter(s=>s.week.match(/WEEK (\d+)/i)[1]===week);const open=openWeeks.has(week)||lessons.some(s=>s.id===cur?.id);return '<details class="bmai-week" data-week="'+week+'"'+(open?' open':'')+'><summary><strong>Week '+week+'</strong><span>'+lessons.length+' '+(lessons.length===1?'lesson':'lessons')+' · '+(lessons.every(isUnlocked)?'Available now':'Scheduled lessons')+'</span></summary><div class="bmai-week-lessons">'+lessons.map(renderCard).join('')+'</div></details>'}).join('');}
const unreleasedList=document.getElementById("bmaiUnreleasedSessions");if(unreleasedList){const weeks=[...new Set(unreleased.map(x=>x.week.match(/WEEK (\d+)/i)[1]))];unreleasedList.innerHTML=weeks.map(week=>'<article class="studio-unreleased-week"><div class="studio-unreleased-week-head"><h3>Week '+week+'</h3><span>Materials coming soon</span></div>'+unreleased.filter(x=>x.week.match(/WEEK (\d+)/i)[1]===week).map(x=>'<div class="studio-unreleased-day"><span>Day '+x.week.match(/DAY (\d+)/i)[1]+'</span><time datetime="'+esc(x.start)+'">'+esc(new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',timeZone:'Asia/Kolkata'}).format(new Date(x.start)))+' · '+esc(timeParts(x.start))+' IST</time></div>').join('')+'</article>').join('');}
const unreleasedCount=document.getElementById("bmaiUnreleasedCount");if(unreleasedCount)unreleasedCount.textContent=unreleased.length+" sessions";
const cd=[...document.querySelectorAll(".countdown")];cd.forEach(el=>el.textContent=countdown(el.dataset.unlock));
const nextBox=document.getElementById("bmaiNextSession");
if(nextBox){
 if(nxt){
  const outcomes={"week-2-day-1":"You have the idea. Next, bring it to life with your first AI movie short: generate a shot, build the sound, and make your first cut.","week-2-day-2":"Make an ad that feels real. Build a consistent product world, then turn your strongest frames into controlled motion.","week-3-day-1":"Think like a director. Build a character, a visual world, and a story blueprint before your next generation."};
  const reviewOpen=isUnlocked(nxt)&&!!nxt.session;
  const access=reviewOpen?'<div class="studio-teaser-lock"><span>REVIEW ACCESS OPEN</span></div><div class="studio-teaser-actions"><a class="btn" href="'+esc(sessionUrl(nxt))+'">OPEN SESSION</a>'+(nxt.playbook?'<a class="btn secondary" href="'+basePath()+esc(nxt.playbook)+'">OPEN PLAYBOOK</a>':'')+'</div>':'<div class="studio-teaser-lock"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>CLASS LOCKED · OPENS IN <b data-teaser-countdown>'+esc(countdown(nxt.unlock))+'</b></span></div><small>Your next chapter unlocks automatically. Get your current project ready.</small>';
  nextBox.className="studio-teaser-card";
  nextBox.innerHTML='<div class="studio-teaser-copy"><div class="kicker">NEXT UP / '+esc(nxt.week)+'</div><h2>'+esc(nxt.title)+'</h2><p>'+esc(outcomes[nxt.id]||nxt.description||"Your next creative challenge is on its way. Bring what you have built so far and get ready to take the next step.")+'</p><div class="studio-teaser-date">'+esc(dateRange(nxt))+'</div>'+access+'</div>'+(nxt.hero?'<div class="studio-teaser-image"><img src="'+basePath()+esc(nxt.hero)+'" alt="'+esc(nxt.title)+' - next class preview" loading="lazy"></div>':'');
 }else nextBox.closest('section').hidden=true;
}
}

let homepageStateId=null;
function updateHomepageCountdowns(){
document.querySelectorAll(".countdown[data-unlock]").forEach(el=>el.textContent=countdown(el.dataset.unlock));
const nextBox=document.getElementById("bmaiNextSession");
if(nextBox){
 const nxt=next();
 if(nxt){
  const count=nextBox.querySelector('[data-teaser-countdown]');if(count)count.textContent=countdown(nxt.unlock);
 }
}
}
function enhanceAvatarFallbacks(){
 const imgs=[...document.querySelectorAll('.bmai-character-card img')];
 imgs.forEach(img=>{
   const fail=()=>{img.style.display='none';img.parentElement.classList.add('is-fallback')};
   img.addEventListener('error',fail,{once:true});
   if(img.complete&&img.naturalWidth===0)fail();
 });
}
function injectInstructorIdentity(){
 if(document.querySelector(".bmai-instructor-card"))return;
 const target=document.querySelector(".hero-copy .hero-meta")||document.querySelector("main .hero")||document.querySelector("header");
 if(!target)return;
 const card=document.createElement("div");
 card.className="bmai-instructor-card";
 card.innerHTML='<div class="bmai-instructor-avatar"><img src="'+basePath()+'assets/alexx-avatar.webp?v=20261005-avatar-v1" alt="Alexx Roy, instructor for Build My AI Movie" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'is-fallback\')"></div><div class="bmai-instructor-copy"><span>INSTRUCTOR</span><strong>Alexx Roy</strong><small>Build My AI Movie · Studio Lead</small></div>';
 if(target.classList.contains("hero-meta"))target.insertAdjacentElement("afterend",card);
 else target.insertAdjacentElement("afterend",card);
}
function siteUtilities(){
const old=document.getElementById("bmai-site-utilities");if(old)old.remove();
const wrap=document.createElement("div");wrap.id="bmai-site-utilities";wrap.innerHTML='<button class="bmai-float-btn bmai-top-btn" type="button" aria-label="Scroll to top" title="Scroll to top"><span class="bmai-icon" aria-hidden="true">↑</span><span>TOP</span></button>';
document.body.appendChild(wrap);
const top=wrap.querySelector(".bmai-top-btn");
const toggle=()=>top.classList.toggle("is-visible",window.scrollY>500);
window.addEventListener("scroll",toggle,{passive:true});toggle();
top.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}
function guardLockedLinks(){
 document.querySelectorAll("a[data-bmai-lock-guard]").forEach(a=>{if(isUnlocked(byId(sessionIdFromHref(a.href)))){a.removeAttribute("aria-disabled");a.classList.remove("bmai-locked-link")}});
 document.querySelectorAll("a[href]").forEach(a=>{
  if(a.dataset.bmaiLockGuard==="true")return;
  const targetId=sessionIdFromHref(a.href);
  if(!targetId)return;
  const target=byId(targetId);
  if(!target||isUnlocked(target))return;
  a.dataset.bmaiLockGuard="true";
  a.setAttribute("aria-disabled","true");
  a.classList.add("bmai-locked-link");
  a.addEventListener("click",e=>{
   if(isUnlocked(target))return;
   e.preventDefault();
   const targetUrl=target.session?basePath()+target.session:null;
   if(targetUrl)location.href=targetUrl;
   else alert("This cohort material is not released yet. Return to the Student Hub for the release time.");
  });
 });
}
function enhanceNextButton(){
const x=pageSession();if(!x)return;
const index=S.findIndex(s=>s.id===x.id);const nxt=index>=0?S[index+1]:null;
document.querySelectorAll('button').forEach(btn=>{
if(!/CONTINUE TO NEXT SESSION/i.test(btn.textContent||""))return;
if(!nxt)return;
const a=document.createElement("a");a.className=btn.className;a.textContent=nxt.session?"CONTINUE TO NEXT SESSION →":"RETURN TO STUDENT HUB";
a.href=nxt.session?sessionUrl(nxt):basePath()+"index.html";
if(!nxt.session)a.classList.add("secondary");
btn.replaceWith(a);
})
}
function accessibility(){
 const main=document.querySelector("main");
 if(main&&!main.id)main.id="main-content";
 if(main&&!document.querySelector(".bmai-skip-link")){
   const a=document.createElement("a");a.className="bmai-skip-link";a.href="#main-content";a.textContent="Skip to main content";document.body.insertBefore(a,document.body.firstChild);
 }
 document.querySelectorAll('a[target="_blank"]').forEach(a=>{if(!a.rel.includes("noopener"))a.rel=(a.rel+" noopener").trim();if(!a.rel.includes("noreferrer"))a.rel=(a.rel+" noreferrer").trim()});
 document.querySelectorAll("button").forEach(b=>{if(!b.hasAttribute("type"))b.type="button"});
}
function revealReferenceAnchor(){
 if(!location.hash)return;
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const target=document.getElementById(id);if(!target)return;
 let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}
 requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
}
window.addEventListener('hashchange',revealReferenceAnchor);
function homepageProgress(){
 if(document.body.dataset.pageType!=='home')return;
 const identities=window.BMAI_TASK_IDENTITIES||{},available=S.filter(s=>s.session&&isUnlocked(s));let total=0,done=0;
 available.forEach(session=>{const tasks=identities[session.id]||[],saved=window.BMAI_PROGRESS?.read('bmai-tasks:'+session.id)||{};total+=tasks.length;done+=tasks.filter(task=>saved[task.id]===true).length});
 const pct=total?Math.round(done/total*100):0,fill=document.querySelector('[data-home-progress-fill]'),value=document.querySelector('[data-home-progress-value]'),detail=document.querySelector('[data-home-progress-detail]'),copy=document.querySelector('[data-home-progress-copy]');
 if(fill)fill.style.width=pct+'%';if(value)value.textContent=pct+'%';if(detail)detail.textContent=done+' of '+total+' available checkpoints completed';
 if(copy)copy.textContent=done===total&&total?'Every available checkpoint is complete. Open your homework and share your finished work.':done?'You have momentum. Resume your latest lesson or finish the next unchecked playbook task.':'Start with the current playbook and mark each review checkpoint as you finish it.';
}
function siteSearch(){
 const form=document.querySelector('[data-site-search]');if(!form)return;
 const input=form.querySelector('input[type=search]'),results=form.querySelector('[data-site-search-results]'),status=form.querySelector('[role=status]');
 const filter=document.createElement('label');filter.className='bmai-search-availability';filter.innerHTML='Search availability<select data-site-search-availability><option value="available">Available now</option><option value="all">Include scheduled content</option></select>';status.before(filter);const availability=filter.querySelector('select');
 const entries=[];S.forEach(s=>{if(s.session)entries.push({kind:'Session',session:s,title:s.title,detail:s.week+' · '+s.description,url:sessionUrl(s)});if(s.playbook)entries.push({kind:'Playbook',session:s,title:s.title,detail:s.week+' · Step-by-step production workflow',url:basePath()+s.playbook});if(s.homework&&s.playbook)entries.push({kind:'Homework',session:s,title:s.title,detail:s.week+' · Assignment and submission instructions',url:basePath()+s.playbook+'#share'});if(s.promptbook)entries.push({kind:'Prompt Vault',session:s,title:s.title,detail:s.week+' · Prompts and practice recipes',url:basePath()+s.promptbook})});
 document.querySelectorAll('.studio-resource-card').forEach(card=>{const title=card.querySelector('summary strong')?.textContent.trim();if(!title)return;const source=card.querySelector('.studio-resource-source'),session=byId(card.dataset.resourceSession);entries.push({kind:'Resource',session,title,detail:card.querySelector('.studio-resource-body p')?.textContent.trim()||'Studio resource',text:card.querySelector('pre')?.textContent||card.querySelector('.studio-resource-body')?.textContent||'',url:source?.href||('#'+card.id)})});
 const render=()=>{
  const query=input.value.trim().toLowerCase();if(query.length<2){results.hidden=true;results.innerHTML='';status.textContent='Enter at least two letters to search sessions, playbooks, homework, prompts, and resources.';return;}
  const words=query.split(/\s+/),matches=entries.filter(entry=>(availability.value==='all'||!entry.session||isUnlocked(entry.session))&&words.every(word=>(entry.title+' '+entry.kind+' '+entry.detail+' '+(entry.text||'')).toLowerCase().includes(word))).map(entry=>({...entry,score:(entry.title.toLowerCase().includes(query)?50:0)+words.reduce((score,word)=>score+(entry.title.toLowerCase().includes(word)?4:1),0)})).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title)).slice(0,10);
  status.textContent=matches.length?matches.length+' best matches shown.':availability.value==='available'?'No available matches. Try another term or include scheduled content.':'No matches found. Try a broader term.';
  results.innerHTML=matches.map(entry=>{const locked=entry.session&&!isUnlocked(entry.session),label=locked?'Locked · Opens '+releaseLabel(entry.session):'Available now';return '<a href="'+esc(entry.url)+'"><span>'+esc(entry.kind)+'</span><strong>'+esc(entry.title)+'</strong><small>'+esc(entry.detail)+'</small><small class="bmai-search-release">'+esc(label)+'</small></a>';}).join('');results.hidden=!matches.length;guardLockedLinks();document.dispatchEvent(new CustomEvent('bmai:metric',{detail:{name:'site_search',resultCount:matches.length}}));
 };
 availability.addEventListener('change',render);document.addEventListener('bmai:release-change',render);
 form.addEventListener('submit',event=>{event.preventDefault();render();results.querySelector('a')?.focus()});input.addEventListener('input',render);
}
function completionFeedback(){
 let notice=document.querySelector('.bmai-save-notice');if(!notice){notice=document.createElement('div');notice.className='bmai-save-notice';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');document.body.append(notice)}let timer;
 const show=detail=>{clearTimeout(timer);notice.textContent=detail.persisted?(detail.checked?'Completed and saved on this device.':'Marked incomplete and saved on this device.'):'This browser could not save your checkpoints. Keep this page open and download a progress backup before leaving.';notice.classList.add('is-visible');if(detail.persisted)timer=setTimeout(()=>notice.classList.remove('is-visible'),2600);homepageProgress();};
 document.addEventListener('bmai:checkpoint-save',event=>{show(event.detail);document.dispatchEvent(new CustomEvent('bmai:metric',{detail:{name:'checkpoint_change',checked:event.detail.checked,saved:event.detail.persisted}}));});
 if(window.BMAI_PROGRESS.hasUnsaved())show({persisted:false});
}
function usageMetrics(){
 const key='bmai:usage-summary',read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}},write=value=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
 const record=detail=>{if(!detail?.name)return;const data=read(),today=new Date().toISOString().slice(0,10),bucket=data[today]||(data[today]={});bucket[detail.name]=(bucket[detail.name]||0)+1;write(data);window.dataLayer?.push({event:'bmams_'+detail.name,...detail});};
 document.addEventListener('bmai:metric',event=>record(event.detail));document.addEventListener('click',event=>{const link=event.target.closest('a');if(!link)return;const label=(link.textContent||link.getAttribute('aria-label')||'').trim().replace(/\s+/g,' ').slice(0,80);record({name:'navigation',label,path:new URL(link.href,location.href).pathname})});
 window.addEventListener('load',()=>{record({name:'page_view'});if('PerformanceObserver'in window)try{new PerformanceObserver(list=>list.getEntries().forEach(entry=>{if(entry.entryType==='largest-contentful-paint')window.BMAI_METRICS.lcp=Math.round(entry.startTime);if(entry.entryType==='layout-shift'&&!entry.hadRecentInput)window.BMAI_METRICS.cls=Number(((window.BMAI_METRICS.cls||0)+entry.value).toFixed(4))})).observe({type:'largest-contentful-paint',buffered:true})}catch{}});
 window.BMAI_METRICS={summary:read(),lcp:null,cls:0};
}
function ready(){
applyBrandMark();
accessibility();
if(lockPage()){window.BMAI_VISUALS.intro();applyPageIdentity();setupHeaderActions();setupMobileHeader();usageMetrics();guardLockedLinks();return;}
if(document.body.dataset.pageType==="home"){
 homepage();
 homepageStateId=(current()?.id||'')+':'+(next()?.id||'');
 setInterval(()=>{
  const id=(current()?.id||'')+':'+(next()?.id||'');
  if(id!==homepageStateId){homepage();window.BMAI_VISUALS.library();homepageStateId=id;guardLockedLinks();document.dispatchEvent(new Event('bmai:release-change'))}
  updateHomepageCountdowns();guardLockedLinks();
 },1000)
}
if(pageSession())try{localStorage.setItem("bmai:lastPath",page)}catch(e){}
window.BMAI_VISUALS.intro();enhanceLongText();progress();window.BMAI_LEARNING?.init();enhanceNextButton();applyPageIdentity();siteUtilities();setupHeaderActions();setupMobileHeader();enhanceAvatarFallbacks();setupScrollControls();homepageProgress();siteSearch();completionFeedback();usageMetrics();guardLockedLinks();revealReferenceAnchor();
document.addEventListener('bmai:library-change',guardLockedLinks);
document.querySelectorAll("a").forEach(a=>{if(a.href===location.href)a.setAttribute("aria-current","page")})
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready);else ready();
})();

