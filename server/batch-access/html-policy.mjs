import { released } from './access.mjs';
export function htmlRules(schedule, now, batch) {
  const open = schedule.filter(s => released(s, now));
  const openIds = open.map(s => s.id);
  const lockedDocs = schedule.filter(s => !released(s, now) && s.homework).map(s => new URL(s.homework).pathname.split('/')[3]);
  return [
    { selector: 'body', attributes: { 'data-cohort-batch': batch } },
    { selector: '.studio-resource-card', resourceIds: openIds },
    { selector: 'a[href]', lockedDocs },
    ...schedule.flatMap(s => [
      { selector: '[data-vault-session="' + s.id + '"]', attributes: { 'data-vault-release': s.unlock || (s.access === 'completed' ? '1970-01-01T00:00:00Z' : '9999-01-01T00:00:00Z') } },
      ...(!released(s, now) ? [{ selector: '[data-vault-session="' + s.id + '"] [data-vault-session-body]', empty: true }] : [])
    ])
  ];
}

// Same rules run with native Cloudflare HTMLRewriter and the local DOM adapter.
export function applyRule(el, rule) {
  if (rule.attributes) for (const [key, value] of Object.entries(rule.attributes)) el.setAttribute(key, value);
  if (rule.empty) el.setInnerContent('');
  if (rule.text) el.setInnerContent(rule.text);
  if (rule.resourceIds) {
    const ids = (el.getAttribute('data-resource-sessions') || el.getAttribute('data-resource-session') || '').split(/\s+/).filter(Boolean);
    if (!ids.length || !ids.some(id => rule.resourceIds.includes(id))) el.remove();
    else {
      el.setAttribute('data-resource-sessions', ids.filter(id => rule.resourceIds.includes(id)).join(' '));
      el.removeAttribute('data-resource-release');
    }
  }
  if (rule.lockedDocs) {
    const href = el.getAttribute('href') || '';
    if (rule.lockedDocs.some(id => href.includes('/document/d/' + id))) {
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('title', 'Homework opens with your batch session');
    }
  }
}

export function rewriteHtml(response, rules) {
  const rewriter = new HTMLRewriter();
  for (const rule of rules) rewriter.on(rule.selector, { element: el => applyRule(el, rule) });
  return rewriter.transform(response);
}
