import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {websiteHandler} from '../server/batch-access/website-worker.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),ctx={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'library/schedule.js'),'utf8'),ctx);
const {scheduleFor}=await import('../server/batch-access/access.mjs');
const assets={async fetch(req){const file=path.join(root,new URL(req.url).pathname);try{return new Response(await fs.readFile(file),{headers:{'Content-Type':file.endsWith('.js')?'application/javascript':'text/html'}})}catch{return new Response('',{status:404})}}};
let checks=0;
for(const batch of ['B11','B12']){
 let now=0;const email='student@fixture.invalid',env={ASSETS:assets,ENROLLMENTS_JSON:JSON.stringify({[email]:{batch,active:true}})};
 const handler=websiteHandler({identity:async()=>email,clock:()=>now,transform:async response=>response});
 const schedule=scheduleFor(ctx.window.BMAI_SESSIONS,batch,ctx.window.BMAI_BATCH_SCHEDULES);
 for(const s of schedule){
  for(const rel of [s.session,s.playbook,s.session.replace('/index.html','/prompt-vault.html')]){
   if(!s.unlock)continue;now=Date.parse(s.unlock)-1;let response=await handler(new Request('https://cohort.fixture/'+rel),env);assert.equal(response.status,403,batch+' '+rel+' must be locked');
   now++;response=await handler(new Request('https://cohort.fixture/'+rel),env);assert.equal(response.status,200,batch+' '+rel+' must release');checks+=2;
  }
  const js=s.session.replace('/index.html','/lesson-data.js');
  if(s.unlock&&await fs.stat(path.join(root,js)).then(()=>true,()=>false)){
   now=Date.parse(s.unlock)-1;assert.equal((await handler(new Request('https://cohort.fixture/'+js),env)).status,403);
   now++;assert.equal((await handler(new Request('https://cohort.fixture/'+js),env)).status,200);checks+=2;
  }
  for(const [alias,field]of Object.entries(s.legacyRoutes||{})){const response=await handler(new Request('https://cohort.fixture/'+alias),env);assert.equal(response.status,302);assert.equal(response.headers.get('Location'),'/'+s[field]);checks++}
 }
}
console.log(checks+' authenticated B11/B12 route, payload, exact unlock and legacy redirect checks passed.');
