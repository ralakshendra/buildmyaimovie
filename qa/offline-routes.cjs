const fs=require('fs'),path=require('path'),Module=require('module'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),launch=chromium.launch.bind(chromium);
const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
chromium.launch=async options=>{
 const browser=await launch(options),original=browser.newContext.bind(browser);
 browser.newContext=async opts=>{
  const context=await original(opts);
  await context.route('**/*',async route=>{
   const url=new URL(route.request().url());if(!['127.0.0.1','localhost'].includes(url.hostname))return route.fulfill({status:204,body:''});
   const rel=decodeURIComponent(url.pathname).replace(/^\/+/,'')||'index.html',file=path.resolve(root,rel);
   if(!file.startsWith(root+path.sep))return route.fulfill({status:404,body:''});
   try{return route.fulfill({status:200,contentType:mime[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)})}catch{return route.fulfill({status:404,body:''})}
  });
  return context;
 };
 browser.newPage=async options=>(await browser.newContext(options)).newPage();
 return browser;
};
const task=process.argv[2];if(!['cohesion','release','routes'].includes(task))throw Error('Choose cohesion, release or routes');
require(path.join(root,task==='cohesion'?'scripts/audit-site.cjs':task==='release'?'qa/release-boundaries.cjs':'qa/session-routes.cjs'));
