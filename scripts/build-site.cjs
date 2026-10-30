const identityFs=require('fs');identityFs.writeFileSync(require('path').join(__dirname,'../library/task-identities.js'),'/* Generated from content/task-identities.json. */\nwindow.BMAI_TASK_IDENTITIES='+identityFs.readFileSync(require('path').join(__dirname,'../content/task-identities.json'),'utf8').trim()+';\n');
const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8').replace(/\r\n/g,'\n');
fs.writeFileSync(path.join(root,'library/components.css'),'/* Generated shared component library. */\n'+(read('studio.css')+'\n'+read('avatar-motion.css')+'\n'+read('library/visuals.css')+'\n'+read('library/learning.css')).replace(/url\(['"]?assets\//g,"url('../assets/"));
fs.writeFileSync(path.join(root,'library/site.js'),['library/schedule.js','library/task-identities.js','library/learning-paths.js','library/page-contract.js','library/visuals.js','library/lesson-engine.js','library/progress.js','library/learning.js','app.js','session-ui.js','avatar-motion.js','resource-library.js','prompt-vault.js'].map(p=>'\n/* '+p+' */\n'+read(p)).join('\n;\n'));
console.log('Shared library built: schedule, page contract, navigation, release gates, avatars, resources.');

// Version every local style and script, including scoped pages and lesson data.
// Normalize newlines so Windows previews and Linux CI produce identical versions.
function versionLocalAssets(html,file){return html.replace(/\b(src|href)="([^"?]+\.(?:js|css))(?:\?[^\"]*)?"/g,(match,attr,url)=>{if(/^(?:https?:|\/\/)/.test(url))return match;const asset=path.resolve(path.dirname(file),url);if(!asset.startsWith(root+path.sep)||!fs.existsSync(asset))return match;const contents=fs.readFileSync(asset,'utf8').replace(/\r\n/g,'\n'),hash=require('crypto').createHash('sha256').update(contents).digest('hex').slice(0,12);return attr+'="'+url+'?v='+hash+'"';});}

const crypto=require('crypto');const versions={};for(const file of ['library/site.js','library/components.css','library/playbook.css'])versions[file]=crypto.createHash('sha256').update(read(file)).digest('hex').slice(0,12);
const excludedDirs=new Set(['.git','node_modules','qa','templates','test-results','dist','tmp']);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?(excludedDirs.has(e.name)?[]:walk(path.join(d,e.name))):[path.join(d,e.name)]);
for(const file of walk(root).filter(p=>p.endsWith('.html')&&!/(^|[\\/])(qa|templates|node_modules|test-results|dist)[\\/]/.test(path.relative(root,p))&&!p.endsWith('hero-approval.html'))){let html=fs.readFileSync(file,'utf8');for(const [asset,version] of Object.entries(versions)){const escaped=asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');html=html.replace(new RegExp('('+escaped+')(?:\\?v=[^"\\s]+)?','g'),'$1?v='+version);}fs.writeFileSync(file,versionLocalAssets(html,file));}

// Keep the sitemap aligned with the same registered public pages as navigation and QA.
const sitemapPages=require('./public-pages.cjs')().filter(p=>p!=='404.html'&&!p.endsWith('/prompt-vault.html'));
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...new Set(sitemapPages)].map(p=>'  <url><loc>https://build-my-ai-movie-cohort.pages.dev/'+p+'</loc></url>').join('\n')+'\n</urlset>\n');
