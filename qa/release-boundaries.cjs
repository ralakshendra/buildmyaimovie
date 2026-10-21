const {chromium}=require('playwright'),assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const base=process.env.BMAI_BASE_URL||'http://127.0.0.1:8766/';
const schedule=vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../library/schedule.js'),'utf8')+';window.BMAI_SESSIONS',{window:{}}),authored=schedule.filter(s=>s.session&&s.kind!=='orientation');
(async()=>{const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{});try{
 const errors=[];
 const at=async time=>{const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.clock.install({time:new Date(0)});await p.clock.pauseAt(new Date(time));return p;};
 const first=authored[0],second=authored[1],p=await at(Date.parse(second.unlock)-2000);await p.goto(new URL('index.html',base).href);
 assert.equal(await p.locator('#bmaiSchedule .schedule-row').count(),schedule.filter(s=>s.kind!=='orientation').length);assert.equal(await p.locator('.bmai-week').count(),8);
 for(const section of ['playbooks','homework']){assert.equal(await p.locator('#'+section+' article.card').count(),1);assert.equal(await p.locator('#'+section+' select option').count(),schedule.filter(s=>s.session).length);}
 await p.clock.runFor(2500);assert((await p.locator('.bmai-studio-card h2').innerText()).includes(second.title));await p.close();
 let routes=0;
 for(const s of authored)for(const route of [s.session,s.playbook,s.promptbook].filter(Boolean)){
  // Isolate clocks so offsets do not leak between unrelated release dates.
  const q=await at(Date.parse(s.unlock)-1000),vault=route===s.promptbook;await q.goto(new URL(route,base).href);
  if(vault){const group=q.locator(`[data-vault-session="${s.id}"]`);assert.equal(await group.locator('[data-vault-locked]:visible').count(),1);assert.equal(await group.locator('.prompt-vault-card:visible').count(),0);}
  else{assert.equal(await q.locator('.bmai-lock-screen').count(),1,route+' opens early');for(const a of await q.locator('.bmai-session-top-actions a[href*="docs.google.com"]').all())assert.equal(await a.getAttribute('aria-disabled'),'true');}
  await q.clock.setSystemTime(new Date(s.unlock));await q.goto(new URL(route,base).href);
  if(vault){const group=q.locator(`[data-vault-session="${s.id}"]`);assert.equal(await group.locator('[data-vault-locked]:visible').count(),0);assert(await group.locator('.prompt-vault-card:visible').count()>0);}
  else assert.equal(await q.locator('.bmai-lock-screen').count(),0,route+' remains locked');routes++;await q.close();
 }
 const q=await at(Date.parse(second.unlock)-2000);await q.goto(new URL(second.playbook,base).href);const before=await q.locator('#bmaiLockCount').textContent();await q.clock.runFor(1100);assert.notEqual(await q.locator('#bmaiLockCount').textContent(),before);await q.clock.runFor(1200);await q.waitForFunction(()=>!document.querySelector('.bmai-lock-screen'));await q.close();
 const h=await at(Date.parse(first.start));await h.goto(new URL('index.html',base).href);await h.locator('#homework select').selectOption(second.id);assert((await h.locator('#homework .bmai-availability').innerText()).includes('Locked'));const link=h.locator('#homework article a');assert.equal(await link.getAttribute('aria-disabled'),'true');await link.click({force:true});await h.waitForURL('**/'+second.session);assert.equal(await h.locator('.bmai-lock-screen').count(),1);await h.close();assert.equal(errors.length,0,errors.join('; '));
 console.log('Release boundaries passed for '+routes+' authored routes; 16-slot hub, countdowns, auto-unlock and homework guards passed.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
