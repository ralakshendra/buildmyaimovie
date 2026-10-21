const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert'),{execFileSync}=require('child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),base=process.env.BMAI_BASE_URL||'http://127.0.0.1:8781/';
const parse=t=>vm.runInNewContext(t+';window.BMAI_SESSIONS',{window:{}}),schedule=parse(fs.readFileSync(path.join(root,'library/schedule.js'),'utf8'));
const old=parse(execFileSync('git',['show','HEAD:library/schedule.js'],{cwd:root,encoding:'utf8'}));
const numbered=schedule.filter(s=>s.kind!=='orientation');assert.equal(numbered.length,16);
const approved={'week-7-day-3':[13,'2026-11-15'],'week-8-day-2':[14,'2026-11-21'],'week-8-day-1':[15,'2026-11-22'],'week-7-day-2':[16,'2026-11-28']};
for(const [i,s]of numbered.entries()){
 assert.equal(s.number,i+1);assert.equal(s.week,`WEEK ${Math.floor(i/2)+1} · DAY ${i%2+1}`);
 if(approved[s.id]){assert.equal(s.number,approved[s.id][0]);assert.equal(s.start,approved[s.id][1]+'T20:00:00+05:30');assert.equal(s.end,approved[s.id][1]+'T22:00:00+05:30');assert.equal(Date.parse(s.start)-Date.parse(s.unlock),3600000);}
 if(!s.session){assert.equal(s.id,'week-7-day-3');assert(!s.playbook&&!s.homework&&!s.promptbook);continue;}
 if(s.id==='week-7-day-3'){assert(s.session&&s.playbook&&s.homework&&s.promptbook);assert.equal(s.homework,'https://docs.google.com/document/d/1WOsuhyEskgBrklSPMXyS8lxzRA4FAKsfBWpxxn814sU/edit');continue;}
 const previous=old.find(x=>x.id===s.id);assert(previous,s.id+' missing original lesson');
 for(const key of ['id','session','playbook','homework','promptbook'])assert.equal(s[key],previous[key],s.id+' changed '+key);
 if(!approved[s.id])for(const key of ['start','end','unlock','number','week'])assert.equal(s[key],previous[key]);
 for(const route of [s.session,s.playbook]){
  const text=fs.readFileSync(path.join(root,route),'utf8'),before=execFileSync('git',['show','HEAD:'+route],{cwd:root,encoding:'utf8'}),prompts=t=>[...t.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)].map(m=>m[1].replace(/\r\n/g,'\n'));
  assert.deepEqual(prompts(text),prompts(before),route+' changed official prompts');
 }
 const data=path.join(root,'content',s.id+'.json');if(fs.existsSync(data)){const d=JSON.parse(fs.readFileSync(data));assert.equal(d.number,s.number);assert.equal(d.start,s.start);assert.equal(d.end,s.end);}
}
const oldTasks=JSON.parse(execFileSync('git',['show','HEAD:content/task-identities.json'],{cwd:root,encoding:'utf8'})),nowTasks=JSON.parse(fs.readFileSync(path.join(root,'content/task-identities.json')));for(const [id,tasks]of Object.entries(oldTasks))assert.deepEqual(nowTasks[id],tasks);
const beforeManifest=JSON.parse(execFileSync('git',['show','HEAD:content/prompt-vault-manifest.json'],{cwd:root,encoding:'utf8'})),manifest=JSON.parse(fs.readFileSync(path.join(root,'content/prompt-vault-manifest.json')));
for(const item of beforeManifest.filter(x=>x.kind==='official')){const current=manifest.find(x=>x.id===item.id);assert(current);assert.equal(current.text.replace(/\r\n/g,'\n'),item.text.replace(/\r\n/g,'\n'));}
(async()=>{const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{});try{
 const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'__review__/index.html');await page.locator('#cohort-plan').evaluate(e=>e.open=true);await page.locator('.bmai-week').evaluateAll(es=>es.forEach(e=>e.open=true));
 assert.equal(await page.locator('#bmaiSchedule .schedule-row').count(),16);assert.deepEqual(await page.locator('.bmai-week').evaluateAll(es=>es.map(e=>e.querySelectorAll('.schedule-row').length)),[2,2,2,2,2,2,2,2]);
 assert.equal(await page.locator('#cohort-plan .bmai-curriculum-grid article').count(),8);assert.equal(await page.locator('#orientation').count(),1);assert.equal(await page.locator('#orientation a').count(),schedule.some(s=>s.kind==='orientation')?3:0);
 const cards=await page.locator('#bmaiSchedule .schedule-row').allTextContents();assert(cards[12].includes('Advanced Editing'));assert(cards[13].includes('Advanced VFX'));assert(cards[14].includes('Automobile'));assert(cards[15].includes('Portfolio'));assert.equal(await page.locator('#bmaiSchedule .schedule-row').nth(12).locator('a').count(),3);
 for(const width of [320,390,820,1440]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.locator('#cohort-plan').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(root,'qa/artifacts/curriculum-'+width+'.png')});}
 for(const s of schedule.filter(s=>s.session)){await page.goto(base+'__review__/'+s.session);const text=(await page.locator('body').innerText()).replace(/[·•|/—–-]/g,' ').replace(/\s+/g,' ').toUpperCase();assert(text.includes(s.week.replace(' · ',' ')),s.id+' wrong visible label');}
 await page.goto(base+'__review__/sessions/week-2-day-1/index.html#s6');assert((await page.locator('#s6').innerText()).includes('Editing Essentials'));
 await page.goto(base+'__review__/prompt-vault.html');assert.equal(await page.locator('[data-vault-session-button="week-7-day-3"]').count(),1);assert.equal(await page.locator('[data-resource-kind=tool] a').count(),0);
 for(const id of ['week-8-day-2','week-8-day-1','week-7-day-2']){const s=schedule.find(x=>x.id===id);assert((await page.locator(`[data-vault-session-button="${id}"]`).innerText()).includes(s.week));}
 assert.equal(errors.length,0,errors.join('; '));console.log('Approved 16-slot curriculum, dates, pending editing material, 15 preserved lesson routes/Docs, exact prompts and checkpoint identities, eight two-session weeks and four responsive widths passed.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
