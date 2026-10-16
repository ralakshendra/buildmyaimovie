const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const base=process.env.BMAI_BASE_URL||'http://127.0.0.1:8766/';
const url=new URL(base);
assert(['127.0.0.1','localhost'].includes(url.hostname),'Review QA must use the local preview server');
const review=new URL('__review__/',base).href;
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const pages=require('./public-pages.cjs')();
const schedule=vm.runInNewContext(fs.readFileSync(path.join(root,'library/schedule.js'),'utf8')+';window.BMAI_SESSIONS',{window:{}},{timeout:1000});
const earliest=Math.min(...schedule.filter(session=>session.session).map(session=>Date.parse(session.unlock)));

(async()=>{
 const browser=await chromium.launch({...(process.platform==='win32'?{channel:'chrome'}:{}),headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.clock.install({time:new Date(earliest-1000)});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)errors.push(response.status()+' '+response.url())});
  await page.goto(review,{waitUntil:'load'});
  const links=await page.locator('.review-card').evaluateAll(cards=>cards.map(card=>new URL(card.href).pathname));
  const expected=pages.map(file=>new URL('__review__/'+file,base).pathname);
  assert.deepEqual(new Set(links),new Set(expected),'Review area must list every public HTML page exactly once');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Review area overflows on mobile');
  for(const link of links){
   await page.goto(new URL(link,base).href,{waitUntil:'load'});
   assert.equal(await page.locator('.bmai-lock-screen').count(),0,link+' is locked in review');
   assert.equal(await page.locator('main#main-content').count(),1,link+' has no main landmark');
   assert.equal(await page.locator('.bmai-review-toolbar a').count(),1,link+' has no return link');
   assert.equal(await page.evaluate(()=>window.BMAI_LOCKS_PAUSED_FOR_REVIEW),true,link+' lacks review access');
  }
  const last=schedule.filter(session=>session.session&&session.playbook).at(-1);
  await page.goto(new URL('__review__/'+last.session,base).href,{waitUntil:'load'});
  await page.locator('a[href="playbook.html"]:visible').first().click();
  assert(page.url().endsWith('/__review__/'+last.playbook),'Playbook navigation escaped review mode');
  await page.goto(new URL(last.session,base).href,{waitUntil:'load'});
  assert.equal(await page.locator('.bmai-lock-screen').count(),1,'Ordinary preview must retain its scheduled lock');
  assert.equal(await page.evaluate(()=>!!window.BMAI_LOCKS_PAUSED_FOR_REVIEW),false,'Review override leaked into ordinary preview');
  assert.equal(errors.length,0,errors.join('; '));
  console.log(`Review area passed: ${pages.length} pages open; navigation stays in review; ordinary preview remains locked.`);
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
