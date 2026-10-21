import { verifiedEmail, memberFor, scheduleFor, released, routeSession } from './access.mjs';
import { htmlRules, rewriteHtml } from './html-policy.mjs';
import { sessions, batches, pages, tasks, paths, lockTemplate, batchSource, batchCss } from './website.generated.mjs';

const privateHeaders = { 'Cache-Control': 'private, no-store', Vary: 'Cookie, Cf-Access-Jwt-Assertion', 'X-Content-Type-Options': 'nosniff' };
const json = (value, status = 200) => Response.json(value, { status, headers: privateHeaders });
const privateResponse = response => { const out = new Response(response.body, response); for (const [k,v] of Object.entries(privateHeaders)) out.headers.set(k,v); return out; };
export function publicSchedule(schedule, now) {
  return schedule.map(s => ({ ...s, homework: released(s, now) ? s.homework : null }));
}
function replaceModule(bundle, module, next, source) {
  const from = bundle.indexOf('/* ' + module + ' */');
  const to = bundle.indexOf('/* ' + next + ' */', from + 1);
  if (from < 0 || to < 0) throw new Error('Unexpected site bundle structure');
  return bundle.slice(0, from) + source + '\n;\n' + bundle.slice(to);
}
export function personalBundle(bundle, schedule, batch, now, role='student', mode='student') {
  if(!bundle.includes('window.BMAI_NOW'))bundle=bundle.replace(/Date\.now\(\)/g,'(window.BMAI_NOW?window.BMAI_NOW():Date.now())');
  const open = schedule.filter(s => released(s, now)).map(s => s.id);
  const filter = map => Object.fromEntries(Object.entries(map).filter(([id]) => open.includes(id)));
  const hasBatchModule=bundle.includes('/* library/batch-context.js */');
  bundle = replaceModule(bundle, 'library/schedule.js', hasBatchModule?'library/batch-context.js':'library/task-identities.js', 'window.BMAI_BATCH_CONTEXT=' + JSON.stringify({ batch, role, mode, serverTime: now }) + ';window.BMAI_SESSIONS=' + JSON.stringify(publicSchedule(schedule, now)) + ';'+(hasBatchModule?'':batchSource));
  bundle = replaceModule(bundle, 'library/task-identities.js', 'library/learning-paths.js', 'window.BMAI_TASK_IDENTITIES=' + JSON.stringify(filter(tasks)) + ';');
  return replaceModule(bundle, 'library/learning-paths.js', 'library/page-contract.js', 'window.BMAI_LEARNING_PATHS=' + JSON.stringify(filter(paths)) + ';');
}

export function websiteHandler({ identity = verifiedEmail, clock = Date.now, transform = rewriteHtml } = {}) {
  return async (request, env) => {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method) && !(request.method==='POST' && url.pathname==='/api/admin/batch')) return json({ error: 'Method not allowed' }, 405);
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { return json({ error: 'Invalid path' }, 400); }
    if (pathname.includes('\\') || pathname.split('/').some(x => x.startsWith('.') && x !== '')) return json({ error: 'Not found' }, 404);
    if(pathname==='/library/components.css'){
      const asset=await env.ASSETS.fetch(request);if(!asset.ok)return asset;
      const css=await asset.text();return new Response(css+(css.includes('.bmai-admin-view')?'':'\n'+batchCss),{headers:{'Content-Type':'text/css; charset=utf-8'}});
    }
    // Only non-instructional presentation assets may load without enrollment.
    if (/^\/(?:assets\/.*\.(?:svg|png|jpe?g|webp|gif|avif|woff2?|mp4)|brand\.css|library\/(?:components|playbook)\.css|styles\/.*\.css)$/.test(pathname)) return env.ASSETS.fetch(request);
    const denied = async (message,status) => {
      if(pathname==='/library/site.js')return new Response('/* Enrolled sign-in required. */',{headers:{...privateHeaders,'Content-Type':'application/javascript'}});
      if(pathname.startsWith('/api/')||/\.(?:js|json)$/.test(pathname))return json({error:message},status);
      const shell=new Response(lockTemplate,{headers:{'Content-Type':'text/html; charset=utf-8'}});
      const html=await transform(shell,[{selector:'main h1',text:'Your cohort access'},{selector:'main p',text:message}]);
      return privateResponse(new Response(html.body,{status,headers:html.headers}));
    };
    let email;
    try { email = await identity(request, env); } catch { return denied('Sign in through Cloudflare with your enrolled email, then return to the student hub.',401); }
    let register;
    try { register = JSON.parse(env.ENROLLMENTS_JSON); } catch { return denied('Cohort access is being configured. Please contact the cohort team.',503); }
    const member = memberFor(email, register);
    if (!member) return denied('Your email has no active batch assigned. Please contact the cohort team to confirm your enrollment.',403);
    if(pathname==='/api/admin/batch'){
      if(member.role!=='admin')return json({error:'Admin access required'},403);
      if(request.method!=='POST')return json({error:'Use POST'},405);
      if(request.headers.get('Origin')!==url.origin)return json({error:'Invalid request origin'},403);
      const form=await request.formData(),batch=form.get('batch'),mode=form.get('mode');
      if(!['B11','B12'].includes(batch)||!['admin','student'].includes(mode))return json({error:'Invalid preview selection'},400);
      return new Response(null,{status:303,headers:{...privateHeaders,Location:'/index.html','Set-Cookie':'bmams_admin_view='+batch+':'+mode+'; Path=/; HttpOnly; Secure; SameSite=Strict'}});
    }
    const view=member.role==='admin'?request.headers.get('Cookie')?.match(/(?:^|;\s*)bmams_admin_view=(B11|B12):(admin|student)(?:;|$)/):null;
    const batch=view?.[1]||member.batch,mode=member.role==='admin'?(view?.[2]||'admin'):'student';
    const now = clock();
    let schedule = scheduleFor(sessions, batch, batches);
    if(member.role==='admin'&&mode==='admin')schedule=schedule.map(s=>({...s,unlock:'1970-01-01T00:00:00.000Z'}));
    if (pathname === '/api/me') return json({ batch,role:member.role,mode, serverTime: now, sessions: publicSchedule(schedule, now) });
    if (pathname === '/library/site.js') {
      const asset = await env.ASSETS.fetch(request);
      if (!asset.ok) return json({ error: 'Site bundle unavailable' }, 503);
      return new Response(personalBundle(await asset.text(), schedule, batch, now,member.role,mode), { headers: { ...privateHeaders, 'Content-Type': 'application/javascript; charset=utf-8' } });
    }
    let file = pathname.replace(/^\//, '') || 'index.html';
    if (file.endsWith('/')) file += 'index.html';
    if (!file.includes('.') && Object.hasOwn(pages, file + '.html')) file += '.html';
    else if (!file.includes('.') && Object.hasOwn(pages, file + '/index.html')) file += '/index.html';
    const pageId = pages[file];
    const route = routeSession('/' + file, schedule);
    const lesson = typeof pageId === 'string' ? schedule.find(s => s.id === pageId) : route?.id ? route : null;
    if (route?.invalid) return json({ error: 'Not found' }, 404);
    if (lesson && !released(lesson, now)) {
      if (!Object.hasOwn(pages, file)) return json({ error: 'Session locked', unlock: lesson.unlock }, 403);
      const shell = new Response(lockTemplate, {headers:{'Content-Type':'text/html; charset=utf-8'}});
      const html = await transform(shell, [{ selector: 'body', attributes: { 'data-session-id': lesson.id, 'data-page-type': 'session', 'data-cohort-batch': batch } }]);
      return privateResponse(new Response(html.body, { status: 403, headers: html.headers }));
    }
    // Only registered public pages and an unlocked lesson's JS payload are served.
    const lessonJs = lesson && /^sessions\/[^/]+\/[^/]+\.js$/.test(file);
    if (file === '_batch-locked.html' || (!Object.hasOwn(pages, file) && !lessonJs)) return json({ error: 'Not found' }, 404);
    // Preserve the requested URL: Pages redirects explicit index.html/.html URLs
    // to clean paths. Fetching index.html for a clean request would cause a loop.
    const asset = await env.ASSETS.fetch(request);
    if (!asset.ok) return privateResponse(asset);
    if (file.endsWith('.html')) return privateResponse(await transform(asset, htmlRules(schedule, now, batch)));
    return privateResponse(asset);
  };
}
export default { fetch: websiteHandler() };
