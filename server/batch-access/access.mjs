// Server-only prototype. Never expose the enrollment register to the browser.
export function scheduleFor(sessions, batch, batches) {
  if (!Object.hasOwn(batches, batch)) throw new Error('Unknown batch');
  return sessions.map(source => {
    const override = batches[batch][source.id];
    const slot = override ?? (batch === 'B11' ? source : {});
    const start = slot.start ?? null;
    const completed = slot.access === 'completed';
    const time = start ? Date.parse(start) : NaN;
    return { ...source, start, end: slot.end ?? null,
      access: completed ? 'completed' : 'scheduled',
      unlock: Number.isFinite(time) ? new Date(time - 3600000).toISOString() : null };
  });
}

export function released(session, now) {
  return !!session && (session.access === 'completed' ||
    (session.unlock !== null && Number.isFinite(Date.parse(session.unlock)) && Date.parse(session.unlock) <= now));
}

export function memberFor(email, register, additionsJson) {
  if (typeof email !== 'string' || !register || typeof register !== 'object' || Array.isArray(register)) return null;
  const key = email.trim().toLowerCase();
  let member;
  if (Object.hasOwn(register, key)) {
    // Original entries, including inactive entries, always take precedence.
    member = register[key];
  } else {
    // Optional private additions never replace or expose the original register.
    let additions;
    try { additions = JSON.parse(additionsJson || '{}'); } catch { return null; }
    if (!additions || typeof additions !== 'object' || Array.isArray(additions) || !Object.hasOwn(additions, key)) return null;
    member = additions[key];
    // This register can add students only; admin access stays in the original.
    if (!member || (member.role !== undefined && member.role !== 'student')) return null;
  }
  if (!member || member.active !== true) return null;
  if (member.role === 'admin') return { ...member, batch: ['B11','B12'].includes(member.batch) ? member.batch : 'B11', role: 'admin' };
  return ['B11', 'B12'].includes(member.batch) ? { ...member, role: 'student' } : null;
}

export function routeSession(pathname, sessions) {
  let path;
  try { path = decodeURIComponent(pathname).replace(/^\/+/, '').replace(/\/+$/, ''); }
  catch { return { invalid: true }; }
  if (path.includes('\\') || path.split('/').some(x => x === '..' || x === '.')) return { invalid: true };
  const normalize = p => p.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  for (const session of sessions) {
    const routes = [session.session, session.playbook, session.homeworkPage].filter(Boolean);
    if (routes.some(p => normalize(p) === normalize(path))) return session;
    const directory = session.session?.startsWith('sessions/') ? session.session.slice(0, session.session.lastIndexOf('/')) : null;
    if (directory && (path === directory || path.startsWith(directory + '/'))) return session;
  }
  return path.startsWith('sessions/') ? { invalid: true } : null;
}

const decode = part => Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
export async function verifiedEmail(request, env, fetchKeys = fetch, now = Date.now()) {
  if (!env.ACCESS_ISSUER || !env.ACCESS_AUDIENCE) throw new Error('Access configuration missing');
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token || token.length > 16384) throw new Error('Sign in required');
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid identity');
  const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(decode(parts[1])));
  const issuer = env.ACCESS_ISSUER.replace(/\/$/, '');
  if (!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(issuer)) throw new Error('Invalid issuer configuration');
  if (header.alg !== 'RS256' || !header.kid || payload.iss !== issuer ||
    ![payload.aud].flat().includes(env.ACCESS_AUDIENCE) || !Number.isFinite(payload.exp) || payload.exp * 1000 <= now ||
    (payload.nbf !== undefined && (!Number.isFinite(payload.nbf) || payload.nbf * 1000 > now)) ||
    typeof payload.email !== 'string' || !payload.email.includes('@')) throw new Error('Invalid identity');
  const response = await fetchKeys(issuer + '/cdn-cgi/access/certs');
  if (!response.ok) throw new Error('Identity service unavailable');
  const { keys } = await response.json();
  const jwk = keys.find(key => key.kid === header.kid && key.kty === 'RSA');
  if (!jwk) throw new Error('Unknown signing key');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]))) throw new Error('Invalid signature');
  return payload.email.trim().toLowerCase();
}

export function createHandler({ sessions, batches, identity = verifiedEmail, clock = Date.now }) {
  return async (request, env) => {
    const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie, Cf-Access-Jwt-Assertion' } });
    let email;
    try { email = await identity(request, env); } catch { return reply({ error: 'Sign in required' }, 401); }
    let register;
    try { register = JSON.parse(env.ENROLLMENTS_JSON); } catch { return reply({ error: 'Enrollment configuration unavailable' }, 503); }
    const member = memberFor(email, register, env.ENROLLMENTS_ADDITIONS_JSON);
    if (!member) return reply({ error: 'No active batch assigned. Contact the cohort team.' }, 403);
    const schedule = scheduleFor(sessions, member.batch, batches);
    const url = new URL(request.url);
    if (url.pathname === '/api/me') return reply({ batch: member.batch, serverTime: clock(), sessions: schedule.map(s => ({ ...s, available: released(s, clock()) })) });
    const lesson = routeSession(url.pathname, schedule);
    if (lesson?.invalid) return reply({ error: 'Unknown lesson route' }, 404);
    if (lesson && !released(lesson, clock())) return reply({ error: 'Session locked', batch: member.batch, session: lesson.id, unlock: lesson.unlock }, 403);
    // Prototype intentionally does not serve shared HTML or resource catalogs yet:
    // these contain embedded lesson data and must be filtered before activation.
    if (!lesson) return reply({ error: 'Shared resource integration pending' }, 503);
    const asset = await env.ASSETS.fetch(request);
    const secured = new Response(asset.body, asset);
    secured.headers.set('Cache-Control', 'private, no-store');
    secured.headers.set('Vary', 'Cookie, Cf-Access-Jwt-Assertion');
    return secured;
  };
}
