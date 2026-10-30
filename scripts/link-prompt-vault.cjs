const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sessions = vm.runInNewContext(fs.readFileSync(path.join(root, 'library/schedule.js'), 'utf8') + ';window.BMAI_SESSIONS', { window: {} });
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content/prompt-vault-manifest.json'), 'utf8'));
const esc = value => String(value || '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const decode = value => String(value).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const normalize = value => decode(value).replace(/\s+/g, ' ').trim();

function vaultHref(file, sessionId, anchor = '') {
  const rel = path.relative(path.dirname(file), path.join(root, 'prompt-vault.html')).replaceAll('\\', '/');
  return `${rel}?lesson=${sessions.find(s=>s.id===sessionId)?.route || sessionId}${anchor ? `#${anchor}` : ''}`;
}

for (const session of sessions) {
  for (const route of [session.session, session.playbook].filter(Boolean)) {
    const file = path.join(root, route);
    if (!fs.existsSync(file)) continue;
    let html = fs.readFileSync(file, 'utf8');
    const sessionHref = vaultHref(file, session.id);

    html = html.replace(/href="[^"]*prompt-vault\.html[^"]*"(?=[^>]*>\s*PROMPT VAULT\s*<\/a>)/gi, `href="${esc(sessionHref)}"`);
    if (!html.includes('>PROMPT VAULT</a>')) {
      html = html.replace(/(<div class="bmai-session-top-actions">[\s\S]*?)(<\/div><\/div><\/header>)/, `$1<a href="${esc(sessionHref)}">PROMPT VAULT</a>$2`);
    }

    const quick = `<div class="prompt-vault-quick-link"><span>NEED A COPYABLE PROMPT?</span><a href="${esc(sessionHref)}#vault-${esc(session.id)}">OPEN THIS SESSION IN PROMPT VAULT →</a></div>`;
    if (html.includes('prompt-vault-quick-link')) html = html.replace(/<div class="prompt-vault-quick-link">[\s\S]*?<\/div>/, quick);
    else html = html.replace(/(<main\b[^>]*>)/, `$1${quick}`);

    const records = manifest.filter(item => item.sessionId === session.id && item.kind === 'official');
    html = html.replace(/(<pre\b[^>]*>[\s\S]*?<\/pre>)(?:<p class="prompt-vault-inline-link">[\s\S]*?<\/p>)?/gi, (whole, pre) => {
      const text = decode(pre.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/i)?.[1] || '');
      const record = records.find(item => normalize(item.text) === normalize(text));
      if (!record) return pre;
      const href = vaultHref(file, session.id, record.id);
      return `${pre}<p class="prompt-vault-inline-link"><a href="${esc(href)}">OPEN THIS EXACT PROMPT IN PROMPT VAULT →</a></p>`;
    });
    fs.writeFileSync(file, html);
  }
}

const indexFile = path.join(root, 'index.html');
let index = fs.readFileSync(indexFile, 'utf8');
if (!/<div class="nav-links">[\s\S]*?href="prompt-vault\.html"/.test(index)) {
  index = index.replace(/(<div class="nav-links"><a href="#sessions">Sessions<\/a>)/, '$1<a href="prompt-vault.html">Prompt Vault</a>');
}
const section = `<section id="prompt-vault" class="bmai-shortcut-section"><div class="container"><div class="section-head"><div><div class="kicker">03 / PROMPT VAULT</div><h2>Find, customize and copy</h2></div><p>Browse every released prompt by session, search by topic or prompt name, and jump directly to the exact prompt you need.</p></div><aside class="studio-companion"><div class="studio-avatar idea" role="img" aria-label="Alexx Roy: idea"></div><p class="studio-companion-copy">Future session prompts stay locked until their scheduled release.</p></aside><div class="prompt-vault-home-action"><a class="btn" href="prompt-vault.html">OPEN PROMPT VAULT →</a><span>Official prompts · Practice recipes · Troubleshooting</span></div></div></section>`;
if (index.includes('<section id="prompt-vault"')) index = index.replace(/<section id="prompt-vault"[\s\S]*?(?=<section id="homework")/, section);
else index = index.replace('<section id="homework"', section + '<section id="homework"');
fs.writeFileSync(indexFile, index);

console.log('Prompt Vault links now point to the central library and exact prompt anchors.');
