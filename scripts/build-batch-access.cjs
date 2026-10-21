/* Compile the private batch server from the site's maintained sources. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const context={window:{}};
for(const file of ['library/schedule.js','library/task-identities.js','library/learning-paths.js'])vm.runInNewContext(read(file),context,{timeout:1000});
if(!context.window.BMAI_BATCH_SCHEDULES?.B12)throw Error('Batch schedule is missing');
const pages={};for(const file of require('./public-pages.cjs')()){
  const body=read(file).match(/<body\b[^>]*>/i)?.[0]||'';
  pages[file]=body.match(/data-session-id="([^"]+)"/)?.[1]||null;
}
const lockTemplate=read('404.html').replace(/Frame Not Found/g,'Session Access')
 .replace(/<main\b[\s\S]*?<\/main>/i,'<main class="wrap" id="main-content"><h1>Session access</h1><p>Sign in with your enrolled email to see your batch materials.</p><a class="btn btn-primary" href="/index.html">Back to Home</a></main>')
 .replace(/(src|href)="(?!https?:|\/|#)([^"?]+)(\?[^" ]*)?"/g,'$1="/$2$3"');
const values={sessions:context.window.BMAI_SESSIONS,batches:context.window.BMAI_BATCH_SCHEDULES,pages,tasks:context.window.BMAI_TASK_IDENTITIES,paths:context.window.BMAI_LEARNING_PATHS,lockTemplate,batchSource:read('library/batch-context.js'),batchCss:read('styles/batch-access.css')};
const manifest='// Generated server manifest. Do not edit.\n'+Object.entries(values).map(([key,value])=>'export const '+key+'='+JSON.stringify(value)+';').join('\n');
fs.writeFileSync(path.join(root,'server/batch-access/website.generated.mjs'),manifest);
const files=['access.mjs','html-policy.mjs','website.generated.mjs','website-worker.mjs'];
const worker=files.map(file=>read('server/batch-access/'+file).replace(/^import .*;\r?\n/gm,'').replace(/\bexport (?=(?:async )?function|const )/g,'')).join('\n;\n');
fs.writeFileSync(path.join(root,'_worker.js'),worker);
fs.writeFileSync(path.join(root,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]},null,2)+'\n');
console.log('Batch Access server compiled for '+Object.keys(pages).length+' public pages.');
