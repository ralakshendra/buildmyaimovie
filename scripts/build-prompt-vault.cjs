const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const cleanText = value => String(value ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+(?=\r?$)/gm, '').trim();
const decode = value => cleanText(String(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
const normalize = value => decode(value).replace(/\s+/g, ' ').trim();
const slug = value => String(value || 'prompt').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'prompt';
const schedule = vm.runInNewContext(fs.readFileSync(path.join(root, 'library/schedule.js'), 'utf8') + ';window.BMAI_SESSIONS', { window: {} });
const {fieldsFor} = require('./prompt-fields.cjs');
const metadata = JSON.parse(fs.readFileSync(path.join(root,'content/prompt-metadata.json'),'utf8'));
const manifestPath = path.join(root,'content/prompt-vault-manifest.json');
const previous = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath,'utf8')) : [];
const stableId = (session,kind,item,fallback) => previous.find(old => old.sessionId===session.id && old.kind===kind && (normalize(old.text)===normalize(item.text)||old.title===item.title))?.id || item.id || fallback;

function loadLesson(session) {
  const file = path.join(root, 'content', `${session.id}.json`);
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const playbook = session.playbook && path.join(root, session.playbook);
  if (playbook && fs.existsSync(playbook)) {
    const html = fs.readFileSync(playbook, 'utf8');
    const match = html.match(/const sessionData\s*=\s*({[\s\S]*?\n});?/);
    if (match) return vm.runInNewContext(`(${match[1]})`, {}, { timeout: 1000 });
  }
  return { title: session.title, prompts: [], homework: [], checklist: [] };
}

function sourcePrompts(session) {
  const found = [];
  for (const rel of [session.session, session.playbook].filter(Boolean)) {
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi)) {
      const text = decode(match[2]);
      if (text.length < 40 || found.some(item => normalize(item.text) === normalize(text))) continue;
      const heading = [...html.slice(0, match.index).matchAll(/<(?:h[234]|summary)\b[^>]*>([\s\S]*?)<\/(?:h[234]|summary)>/gi)].at(-1);
      const anchor = match[1].match(/\bid="([^"]+)"/)?.[1];
      const title = match[1].match(/data-prompt-title="([^"]+)"/)?.[1] || heading?.[1] || 'Production prompt';
      found.push({ title: normalize(title), text, source: rel + (anchor ? `#${anchor}` : '') });
    }
  }
  return found;
}

const promptId = (sessionId, title, index) => `prompt-vault-${sessionId}-${String(index + 1).padStart(2, '0')}-${slug(title)}`;

function troubleshootingPrompt(session, lesson) {
  const focus = (lesson.checklist || []).join('; ') || 'identity, continuity, framing, lighting, motion, audio, or export';
  return {
    title: `Diagnose and repair a ${session.title} failure`,
    text: `I am working on ${session.title}. The visible problem is: [describe the exact failure]. The reference, shot, product, character, or scene that must remain stable is: [reference or constraint]. Check these priorities: ${focus}. Identify the smallest useful change to the prompt, reference, setting, or edit. Explain what evidence I should inspect after the next test, and tell me when to stop repeating the same approach and choose a different route.`,
    source: 'Prompt Vault troubleshooting template — adapt to the evidence from this session.'
  };
}

function sessionItems(session) {
  const lesson = loadLesson(session);
  const supplied = lesson.prompts?.length ? lesson.prompts : sourcePrompts(session);
  const sourceItems = sourcePrompts(session);
  const official = supplied.map((item, index) => {
    const id=stableId(session,'official',item,promptId(session.id,item.title,index));
    const sourceUrl=sourceItems.find(source=>normalize(source.text)===normalize(item.text))?.source || session.session;
    return {...item,...metadata[id],text:cleanText(item.text),kind:'official',id,sourceUrl};
  });
  const practice = (lesson.homework || []).filter(item => item.prompt).map((item, index) => ({ title: item.title, text: cleanText(item.prompt), source: 'Practice recipe from the session homework workflow.', sourceUrl:session.playbook, kind: 'practice', id: stableId(session,'practice',{title:item.title,text:item.prompt},`practice-${session.id}-${String(index + 1).padStart(2, '0')}-${slug(item.title)}`) }));
  const troubleshooting = [{ ...troubleshootingPrompt(session, lesson), kind: 'troubleshooting', id: `troubleshooting-${session.id}` }];
  return { official, practice, troubleshooting, all: [...official, ...practice, ...troubleshooting] };
}

function renderCard(session, item) {
  const fields = fieldsFor(item.text,item.fields);
  const labels = { official: 'OFFICIAL PROMPT', practice: 'PRACTICE RECIPE', troubleshooting: 'TROUBLESHOOTING PROMPT' };
  const search = [item.title, session.title, session.stage, item.kind, item.text].join(' ').toLowerCase();
  const attribution=item.source===item.sourceUrl ? session.week+' session guide' : item.source || 'Source attribution recorded in the lesson materials.';
  return `<article class="prompt-vault-card" id="${esc(item.id)}" data-prompt-template="${esc(item.text)}" data-prompt-kind="${esc(item.kind)}" data-prompt-search="${esc(search)}"><div class="prompt-vault-card-head"><div><div class="kicker">${labels[item.kind]}</div><h3>${esc(item.title)}</h3></div><span class="prompt-vault-type">${item.kind === 'official' ? 'SOURCE-BACKED' : 'ADAPTABLE'}</span></div><p class="prompt-vault-source">${esc(attribution)}${item.sourceUrl ? ` · <a href="${esc(item.sourceUrl)}">Return to the source lesson</a>` : ` · <a href="${esc(session.playbook)}">Review the assignment</a>`}</p>${fields.length ? `<div class="prompt-vault-fields"><strong>Customize your working copy</strong>${fields.map(field => `<label>${esc(field.label)}${field.multiline ? `<textarea rows="2" data-prompt-field="${esc(field.token)}" data-prompt-format="${esc(field.format)}" placeholder="Replace this field"></textarea>` : `<input type="text" data-prompt-field="${esc(field.token)}" data-prompt-format="${esc(field.format)}" placeholder="Replace this field">`}</label>`).join('')}<p data-prompt-field-status role="status"></p></div>` : ''}<details class="prompt-vault-expand"><summary>Open full prompt</summary><pre data-prompt-text>${esc(item.text)}</pre></details><div class="prompt-vault-actions"><button type="button" class="btn" data-prompt-copy>${fields.length?'Copy working prompt':'Copy prompt'}</button>${fields.length ? '<button type="button" class="btn secondary" data-prompt-original>Copy original template</button><button type="button" class="btn secondary" data-prompt-reset>Reset fields</button>' : ''}</div></article>`;
}

for (const session of schedule) session.unlock = session.kind==='orientation'&&session.access==='completed' ? null : new Date(Date.parse(session.start) - 60 * 60 * 1000).toISOString();
const collections = schedule.filter(session => session.session).map(session => ({ session, ...sessionItems(session) }));
const totalOfficial = collections.reduce((sum, group) => sum + group.official.length, 0);
const totalPractice = collections.reduce((sum, group) => sum + group.practice.length, 0);

function renderGroup({ session, official, practice, troubleshooting }) {
  const section = (id, kicker, title, description, items) => `<div class="prompt-vault-subsection" data-vault-kind-section="${id}"><div class="kicker">${kicker}</div><h3>${title}</h3><p>${description}</p>${items.map(item => renderCard(session, item)).join('') || '<p class="prompt-vault-empty">No complete source material was supplied for this category.</p>'}</div>`;
  return `<section class="prompt-vault-session" id="vault-${esc(session.id)}" data-vault-session="${esc(session.id)}" data-vault-release="${esc(session.unlock)}"><header class="prompt-vault-session-head"><div><div class="kicker">${esc(session.week)}</div><h2>${esc(session.title)}</h2><p>${esc(session.description)}</p></div><span class="prompt-vault-session-count">${official.length + practice.length + troubleshooting.length} ITEMS</span></header><div class="prompt-vault-locked" data-vault-locked hidden><span aria-hidden="true">🔒</span><div><strong>This session’s prompts are locked</strong><p data-vault-lock-date></p></div></div><div class="prompt-vault-session-body" data-vault-session-body>${section('official', 'SOURCE MATERIAL', 'Official prompts', 'Complete prompts preserved from the supplied session source.', official)}${section('practice', 'APPLY THE METHOD', 'Practice recipes', 'Step-by-step recipes for preparing inputs and reviewing the result.', practice)}${section('troubleshooting', 'REPAIR THE SHOT', 'Troubleshooting', 'Adapt the diagnosis prompt to the visible failure in your output.', troubleshooting)}</div></section>`;
}

const sessionButtons = schedule.filter(session => session.session).map(session => `<button type="button" role="tab" aria-selected="false" data-vault-session-button="${esc(session.id)}"><span>${esc(session.week)}</span><strong>${esc(session.title)}</strong></button>`).join('');
const groups = collections.map(renderGroup).join('');
const page = `<!doctype html><html lang="en" data-bmai-page="prompt-vault"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="The BUILD MY AI MOVIE STUDIO Prompt Vault: official prompts, practice recipes and troubleshooting by session."><meta name="theme-color" content="#050505"><title>Prompt Vault | BUILD MY AI MOVIE STUDIO</title><link rel="canonical" href="https://build-my-ai-movie-cohort.pages.dev/prompt-vault.html"><meta property="og:title" content="Prompt Vault | BUILD MY AI MOVIE STUDIO"><meta property="og:description" content="Search and copy the prompts available for your released cohort sessions."><meta property="og:image" content="https://build-my-ai-movie-cohort.pages.dev/assets/brand/social-preview.jpg"><link rel="icon" href="assets/brand/build-my-ai-movie-mark.svg"><link rel="stylesheet" href="brand.css"><link rel="stylesheet" href="library/components.css"><script defer src="library/site.js"></script></head><body data-page-id="prompt-vault" data-page-key="prompt-vault" data-page-type="prompt-vault"><a class="bmai-skip-link" href="#main-content">Skip to main content</a><header class="bmai-global-header"><div class="studio-nav"><a class="bmai-session-brand" href="index.html"><img src="assets/brand/build-my-ai-movie-mark.svg" alt=""><span>BUILD MY <b>AI MOVIE STUDIO</b></span></a><a class="bmai-header-home" href="index.html" aria-label="Back to Home" title="Home"><svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="20"><path d="M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9"></path></svg></a><div class="nav-links"><a href="index.html#sessions">Sessions</a><a aria-current="page" href="prompt-vault.html">Prompt Vault</a><a href="index.html#playbooks">Playbooks</a><a href="index.html#homework">Homework</a></div></div></header><main id="main-content" class="prompt-vault-page"><section class="prompt-vault-hero"><div class="kicker">SEARCH · CUSTOMIZE · COPY</div><h1>Prompt Vault</h1><p class="lead">Every released session’s official prompts, practice recipes and troubleshooting in one searchable workspace.</p><div class="prompt-vault-summary"><span><strong>${totalOfficial}</strong> official prompts</span><span><strong>${totalPractice}</strong> practice recipes</span><span><strong>${schedule.length}</strong> sessions</span></div><p class="prompt-vault-note">Future session prompts stay locked until one hour before the session’s scheduled start time.</p></section><section class="prompt-vault-browser" aria-labelledby="prompt-vault-browser-title"><div class="prompt-vault-browser-head"><div><div class="kicker">BROWSE THE LIBRARY</div><h2 id="prompt-vault-browser-title">Find your prompt</h2></div><p>Choose a session, then search by topic or prompt name.</p></div><div class="prompt-vault-session-slider"><button type="button" class="prompt-vault-slide-arrow" data-vault-scroll="-1" aria-label="Scroll sessions left">‹</button><div class="prompt-vault-session-track" role="tablist" aria-label="Filter prompts by session" data-vault-session-tabs><button type="button" role="tab" aria-selected="true" data-vault-session-button=""><span>ALL SESSIONS</span><strong>Released and scheduled</strong></button>${sessionButtons}</div><button type="button" class="prompt-vault-slide-arrow" data-vault-scroll="1" aria-label="Scroll sessions right">›</button></div><div class="prompt-vault-search-row"><label><span>Search by topic or prompt name</span><input type="search" data-vault-search placeholder="Try: camera movement, character, product…"></label><label><span>Prompt type</span><select data-vault-kind><option value="">All prompt types</option><option value="official">Official prompts</option><option value="practice">Practice recipes</option><option value="troubleshooting">Troubleshooting</option></select></label><button type="button" class="btn secondary" data-vault-clear>Clear filters</button></div><p class="prompt-vault-results" role="status" data-vault-results></p></section><div class="prompt-vault-sessions" data-vault-sessions>${groups}</div><section class="prompt-vault-next"><h2>Keep moving</h2><p>Use the exact prompt link from a lesson or the Resource Library to return to the right place here.</p><a class="btn" href="index.html#playbooks">OPEN A PLAYBOOK</a><a class="btn secondary" href="index.html#homework">OPEN HOMEWORK</a></section></main><footer class="studio-site-footer"><div class="container footer-inner"><div><strong>BUILD MY AI MOVIE STUDIO</strong><p>Alexx Roy, Founder of Build My AI Movie Studio</p></div><div>© 2026 AI FilmCraft - All Rights Reserved.</div></div></footer></body></html>`;

const vaultHeader = `<header class="bmai-global-header"><div class="studio-nav"><a class="bmai-session-brand" href="index.html"><img src="assets/brand/build-my-ai-movie-mark.svg" alt=""><span>BUILD MY <b>AI MOVIE STUDIO</b></span></a><nav class="nav-links" aria-label="Prompt Vault navigation"><a class="bmai-header-home" href="index.html" aria-label="Back to Home" title="Home"><svg aria-hidden="true" fill="none" height="20" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="20"><path d="M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9"></path></svg></a><a href="index.html#sessions">Sessions</a><a href="index.html#playbooks">Playbooks</a><a href="index.html#homework">Homework</a><a href="index.html#resources">Resources</a></nav></div></header>`;
const hero = require('./prompt-vault-hero.cjs')({ official: totalOfficial, practice: totalPractice, sessions: collections.length });
fs.writeFileSync(path.join(root, 'prompt-vault.html'), page.replace(/<header class="bmai-global-header">[\s\S]*?<\/header>/, vaultHeader).replace(/<section class="prompt-vault-hero">[\s\S]*?<\/section>/, hero).replace('<script defer src="library/site.js">', '<link rel="stylesheet" href="styles/pages/prompt-vault-banner.css"><script defer src="library/site.js">'));
const manifest = collections.flatMap(group => group.all.map(item => ({ sessionId: group.session.id, kind: item.kind, id: item.id, title: item.title, text: item.text, source:item.source, sourceUrl:item.sourceUrl, fields:fieldsFor(item.text,item.fields) })));
fs.writeFileSync(path.join(root, 'content', 'prompt-vault-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

for (const session of schedule.filter(session => session.session)) {
  const dir = path.dirname(path.join(root, session.session));
  fs.mkdirSync(dir, { recursive: true });
  const destination = `../../prompt-vault.html?lesson=${encodeURIComponent(session.route || session.id)}`;
  const redirect = `<!doctype html><html lang="en" data-bmai-page="${esc(session.id)}-prompt-vault"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Open this session in the BUILD MY AI MOVIE STUDIO Prompt Vault."><meta name="theme-color" content="#050505"><meta http-equiv="refresh" content="0; url=${destination}"><title>Opening Prompt Vault | BUILD MY AI MOVIE STUDIO</title><link rel="canonical" href="https://build-my-ai-movie-cohort.pages.dev/prompt-vault.html?lesson=${esc(session.route || session.id)}"><link rel="icon" href="../../assets/brand/build-my-ai-movie-mark.svg"><link rel="stylesheet" href="../../brand.css"><link rel="stylesheet" href="../../library/components.css"><script defer src="../../library/site.js"></script></head><body data-page-id="${esc(session.id)}-prompt-vault" data-page-key="${esc(session.id)}-prompt-vault" data-page-type="prompt-vault-redirect" data-session-id="${esc(session.id)}"><a class="bmai-skip-link" href="#main-content">Skip to main content</a><header class="bmai-global-header"><div class="studio-nav"><a class="bmai-session-brand" href="../../index.html"><img src="../../assets/brand/build-my-ai-movie-mark.svg" alt=""><span>BUILD MY <b>AI MOVIE STUDIO</b></span></a><a class="bmai-header-home" href="../../index.html" aria-label="Back to Home" title="Home"><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9"></path></svg></a></div></header><main id="main-content" class="prompt-vault-page"><section class="prompt-vault-hero"><div class="kicker">${esc(session.week)}</div><h1>Opening Prompt Vault</h1><p class="lead">Taking you to ${esc(session.title)}.</p><a class="btn" href="${destination}">OPEN PROMPT VAULT</a></section></main><footer class="studio-site-footer"><div class="container footer-inner"><div><strong>BUILD MY AI MOVIE STUDIO</strong><p>Alexx Roy, Founder of Build My AI Movie Studio</p></div><div>© 2026 AI FilmCraft - All Rights Reserved.</div></div></footer></body></html>`;
  fs.writeFileSync(path.join(dir, 'prompt-vault.html'), redirect);
  session.promptbook = `prompt-vault.html?lesson=${session.route || session.id}`;
}

// Preserve batch slots when regenerating the session catalog.
const batchTail=fs.readFileSync(path.join(root, 'library', 'schedule.js'),'utf8').match(/window\.BMAI_BATCH_SCHEDULES\s*=[\s\S]*/)?.[0]||'';
fs.writeFileSync(path.join(root, 'library', 'schedule.js'), '/* Single schedule for every page. */\nwindow.BMAI_SESSIONS=' + JSON.stringify(schedule, null, 2) + ';\n'+batchTail);
console.log(`Prompt Vault rebuilt as one searchable library for ${collections.length} authored sessions.`);


