from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from html import escape, unescape
from io import BytesIO
from urllib.parse import urlsplit
import argparse
import re
import json
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8766)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
review_prefix = '/__review__/'


def review_access_script():
    schedule = (root / 'library/schedule.js').read_text(encoding='utf-8')
    starts = re.findall(r'["\']?start["\']?\s*:\s*"([^"]+)"', schedule)
    review_time = int(max(datetime.fromisoformat(value).timestamp() for value in starts) * 1000) + 86400000
    return f'''window.BMAI_LOCKS_PAUSED_FOR_REVIEW = true;
(() => {{
  const NativeDate = Date;
  const started = performance.now();
  const now = () => {review_time} + performance.now() - started;
  const ReviewDate = new Proxy(NativeDate, {{
    construct(target, args, newTarget) {{
      return Reflect.construct(target, args.length ? args : [now()], newTarget === ReviewDate ? target : newTarget);
    }},
    apply() {{ return new NativeDate(now()).toString(); }},
    get(target, key, receiver) {{ return key === 'now' ? now : Reflect.get(target, key, receiver); }}
  }});
  Object.defineProperty(globalThis, 'Date', {{ value: ReviewDate, writable: true, configurable: true }});
}})();
'''


def page_label(relative):
    raw = (root / 'library/schedule.js').read_text(encoding='utf-8')
    sessions, _ = json.JSONDecoder().raw_decode(raw.split('window.BMAI_SESSIONS=', 1)[1].lstrip())
    for session in sessions:
        for field, kind in [('session', 'Session guide'), ('playbook', 'Playbook')]:
            if session.get(field) == relative:
                return session['week'].title() + ' · ' + kind
    if relative == 'index.html':
        return 'Home'
    if relative == '404.html':
        return 'Page not found'
    if relative == 'playbook.html':
        return 'Week 1 Day 1 · Playbook'
    if relative.startswith('resources/'):
        return 'Week 1 Day 1 · Session guide'
    match = re.match(r'sessions/week-(\d+)-day-(\d+)/(index|playbook|homework)\.html$', relative)
    if match:
        kind = {'index': 'Session guide', 'playbook': 'Playbook', 'homework': 'Homework workspace'}[match[3]]
        position = (int(match[1]) - 1) * 2 + int(match[2]) - 2
        return f'Week {position // 2 + 1} Day {position % 2 + 1} · {kind}'
    return relative


def review_page():
    excluded = {'qa', 'templates', 'node_modules', 'test-results', 'dist', 'tmp'}
    pages = []
    for file in root.rglob('*.html'):
        relative = file.relative_to(root)
        if any(part in excluded for part in relative.parts) or file.name == 'hero-approval.html':
            continue
        relative_url = relative.as_posix()
        match = re.search(r'<title[^>]*>(.*?)</title>', file.read_text(encoding='utf-8'), re.I | re.S)
        title = unescape(re.sub(r'\s+', ' ', match[1]).strip()) if match else page_label(relative_url)
        pages.append((relative_url, page_label(relative_url), title))
    pages.sort(key=lambda page: (page[0] == '404.html', page[0] != 'index.html', page[0]))
    cards = ''.join(
        f'<a class="review-card" href="{review_prefix}{escape(relative)}">'
        f'<span class="review-card-kind">{escape(label)}</span>'
        f'<strong>{escape(title)}</strong>'
        f'<small>{escape(relative)}</small></a>'
        for relative, label, title in pages
    )
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Local review access to every BUILD MY AI MOVIE STUDIO page.">
<title>Review all pages | BUILD MY AI MOVIE STUDIO</title>
<link rel="icon" href="{review_prefix}assets/brand/build-my-ai-movie-mark.svg">
<link rel="stylesheet" href="{review_prefix}brand.css">
<link rel="stylesheet" href="{review_prefix}library/components.css">
<link rel="stylesheet" href="{review_prefix}styles/pages/review.css">
<script src="{review_prefix}access.js"></script>
<script defer src="{review_prefix}library/site.js"></script></head>
<body data-page-id="review" data-page-key="review" data-page-type="system">
<a class="bmai-skip-link" href="#main-content">Skip to main content</a>
<header class="bmai-global-header"><div class="studio-nav"><a class="bmai-session-brand" href="{review_prefix}index.html"><img src="{review_prefix}assets/brand/build-my-ai-movie-mark.svg" alt=""><span>BUILD MY <b>AI MOVIE STUDIO</b></span></a><a class="bmai-header-home" href="{review_prefix}index.html" aria-label="Back to Home" title="Home"><svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9"/></svg></a></div></header>
<main id="main-content" class="review-main"><div class="review-intro"><div class="kicker">PRIVATE LOCAL PREVIEW</div><h1>Review every page</h1><p>All {len(pages)} website pages are open here for review. Class release dates and normal site access remain unchanged.</p></div><div class="review-grid">{cards}</div></main>
<footer class="studio-site-footer"><div class="container footer-inner"><div><strong>BUILD MY AI MOVIE STUDIO</strong><p>Alexx Roy, Founder of Build My AI Movie Studio</p></div><div>© 2026 AI FilmCraft - All Rights Reserved.</div></div></footer></body></html>'''


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.webp': 'image/webp', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json'}

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(root), **kw)

    def send_review_bytes(self, content, mime_type):
        data = content.encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', mime_type)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        return BytesIO(data)

    def send_head(self):
        request_path = urlsplit(self.path).path
        if request_path == review_prefix[:-1]:
            self.send_response(302)
            self.send_header('Location', review_prefix)
            self.end_headers()
            return None
        if not request_path.startswith(review_prefix):
            return super().send_head()
        relative = request_path[len(review_prefix):]
        if not relative:
            return self.send_review_bytes(review_page(), 'text/html; charset=utf-8')
        if relative == 'access.js':
            return self.send_review_bytes(review_access_script(), 'text/javascript; charset=utf-8')
        if relative.endswith('.html'):
            file = Path(self.translate_path('/' + relative))
            if not file.is_file() or not file.is_relative_to(root):
                self.send_error(404, 'Review page not found')
                return None
            page = file.read_text(encoding='utf-8')
            additions = f'<script src="{review_prefix}access.js"></script><link rel="stylesheet" href="{review_prefix}styles/pages/review.css">'
            page = re.sub(r'(<head\b[^>]*>)', lambda match: match[1] + additions, page, count=1, flags=re.I)
            toolbar = f'<nav class="bmai-review-toolbar" aria-label="Review navigation"><a href="{review_prefix}">← All pages</a><span>Review access · {escape(page_label(relative))}</span></nav>'
            page = re.sub(r'(<body\b[^>]*>)', lambda match: match[1] + toolbar, page, count=1, flags=re.I)
            return self.send_review_bytes(page, 'text/html; charset=utf-8')
        original_path = self.path
        self.path = '/' + relative
        try:
            return super().send_head()
        finally:
            self.path = original_path


print(f'Preview: http://127.0.0.1:{args.port}/', flush=True)
print(f'Review all pages: http://127.0.0.1:{args.port}{review_prefix}', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
