const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),{pathToFileURL}=require('url'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fixture=JSON.parse(read('qa/fixtures/session-routes-before.json')),digest=x=>require('crypto').createHash('sha256').update(JSON.stringify(x)).digest('hex');
const load=t=>{const c={window:{}};vm.runInNewContext(t,c);return c.window};
const current=load(read('library/schedule.js')),old={BMAI_SESSIONS:fixture.sessions,BMAI_BATCH_SCHEDULES:fixture.batches},sessions=current.BMAI_SESSIONS;
assert.deepEqual(JSON.parse(JSON.stringify(current.BMAI_BATCH_SCHEDULES)),JSON.parse(JSON.stringify(old.BMAI_BATCH_SCHEDULES)));
const pre=t=>[...t.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/g)].map(m=>m[1].replace(/\r\n/g,'\n'));
const manifest=JSON.parse(read('content/prompt-vault-manifest.json'));
for(const [id,hash] of Object.entries(fixture.prompts)){const now=manifest.find(x=>x.id===id);assert(now,id);assert.equal(digest(now.text),hash)}
assert.equal(digest(JSON.parse(read('content/task-identities.json'))),fixture.tasks);
(async()=>{
 const {routeSession,scheduleFor,released}=await import(pathToFileURL(path.join(root,'server/batch-access/access.mjs')));
 let routes=0;
 for(const s of sessions){
  const before=old.BMAI_SESSIONS.find(x=>x.id===s.id);
  for(const key of ['id','title','number','week','start','end','unlock','homework'])assert.equal(s[key],before[key],s.id+' changed '+key);
  if(s.number){const slug='week-'+(Math.floor((s.number-1)/2)+1)+'-day-'+((s.number-1)%2+1);assert.equal(s.route,slug);assert.equal(s.session,'sessions/'+slug+'/index.html');assert.equal(s.playbook,'sessions/'+slug+'/playbook.html')}
  for(const field of ['session','playbook']){const html=read(s[field]);assert(html.includes('data-session-id="'+s.id+'"'));assert.equal(digest(pre(html)),fixture.pagePrompts[s.id][field]);assert.equal(routeSession('/'+s[field],sessions).id,s.id);assert.equal(routeSession('/'+s[field].replace(/\.html$/,''),sessions).id,s.id);routes++}
  const dir=path.posix.dirname(s.session);assert(read(dir+'/prompt-vault.html').includes('data-session-id="'+s.id+'"'));
  if(fs.existsSync(path.join(root,dir,'lesson-data.js')))assert.equal(routeSession('/'+dir+'/lesson-data.js',sessions).id,s.id);
  for(const batch of ['B11','B12']){const schedule=scheduleFor(sessions,batch,current.BMAI_BATCH_SCHEDULES),lesson=schedule.find(x=>x.id===s.id);assert.equal(routeSession('/'+s.session,schedule).id,s.id);if(lesson.unlock){assert(!released(lesson,Date.parse(lesson.unlock)-1));assert(released(lesson,Date.parse(lesson.unlock)))}}
 }
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
  await page.clock.install({time:new Date('2027-01-01T00:00:00Z')});
  for(const s of sessions){
   await page.goto('http://127.0.0.1:8790/'+s.session);assert.equal(await page.locator('body').getAttribute('data-session-id'),s.id);
   const links=await page.locator('a[href]').evaluateAll(es=>es.map(a=>({href:a.href,text:a.textContent})));
   assert(links.some(a=>a.href.split('?')[0].endsWith('/'+s.playbook)),s.id+' missing matching playbook');
   await page.goto('http://127.0.0.1:8790/'+s.promptbook);assert.equal(await page.locator('[data-vault-session="'+s.id+'"]').isVisible(),true,s.id+' wrong vault tab');
  }
  for(const number of [1,2,13]){const current=sessions.find(s=>s.number===number),before=fixture.sessions.find(s=>s.id===current.id);await page.goto('http://127.0.0.1:8790/index.html');await page.evaluate(last=>{localStorage.removeItem('bmai:route-version');localStorage.setItem('bmai:lastPath',last)},before.playbook);await page.reload();assert((await page.locator('[data-current-action]').getAttribute('href')).endsWith('/'+current.playbook),'Saved resume link changed lesson');}
  const first=sessions.find(s=>s.number===1);await page.goto('http://127.0.0.1:8790/prompt-vault.html?session='+first.id);assert(await page.locator('[data-vault-session=\"'+first.id+'\"]').isVisible(),'Old Vault bookmarks must still select their original lesson');
  const s=sessions.find(s=>s.number===2);await page.goto('http://127.0.0.1:8790/'+s.playbook);
  const box=page.locator('#checklistSection input[type=checkbox]').first();await box.check();await page.reload();assert(await page.locator('#checklistSection input[type=checkbox]').first().isChecked());
  await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement!==document.body));
  await page.screenshot({path:path.join(root,'qa/artifacts/session-routes-mobile.png'),fullPage:true});
  await context.close();
 }finally{await browser.close()}
 console.log('Verified '+routes+' guide/playbook routes, canonical Vault tabs, lesson payload ownership, B11/B12 release boundaries, exact official prompts, unchanged homework and task identities, saved checklist and keyboard navigation.');
})().catch(e=>{console.error(e);process.exit(1)});
