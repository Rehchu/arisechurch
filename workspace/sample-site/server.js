/* ===========================================================================
   ARISE CHURCH — SAMPLE SITE SERVER
   Zero-dependency local server that renders the Velo custom elements the way
   the published Wix site does: header + page element + footer, with clean
   URLs (/about, /leaders, ...) and a mock of the Velo HTTP function that the
   forms POST to (/_functions/ariseForm).

   Run:   node sample-site/server.js
   Open:  http://localhost:4173/_sample   (hub page listing every route)

   This is a local render of the code in files2/arise-fixed-2026-08-23. It is
   NOT the live site and it does not talk to Wix.
   =========================================================================== */
'use strict';
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8'
};

/* Mirrors backend/http-functions.js as described in ARISE-HANDOFF.md §5a:
   the ALLOWED list, the trim/slice clean(), the single-backslash email regex,
   and "name and email required". */
const ALLOWED = ['contact', 'serve', 'prayer', 'connect-host', 'connect-join'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clean(v, max) { return String(v == null ? '' : v).trim().slice(0, max || 2000); }

const submissions = [];   // in-memory only; printed to the console

function send(res, code, body, type, extra) {
  const headers = Object.assign({
    'Content-Type': type || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Arise-Sample': '1'
  }, extra || {});
  res.writeHead(code, headers);
  res.end(body);
}

function serveFile(res, file, code) {
  const ext = path.extname(file).toLowerCase();
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 500, 'read error: ' + file);
    send(res, code || 200, data, MIME[ext] || 'application/octet-stream');
  });
}

/* Clean URL -> generated page file. Mirrors the routes in build.js. */
function pageFor(pathname) {
  let p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 'index.html';
  if (p.startsWith('/events-1/')) return '_app-event-detail.html';
  if (p.startsWith('/classes/'))  return '_app-class-detail.html';
  return p.slice(1).replace(/\//g, '-') + '.html';
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const pathname = decodeURIComponent(url.pathname);

  /* ---- mock Velo HTTP function --------------------------------------- */
  if (pathname === '/_functions/ariseForm') {
    if (req.method !== 'POST') return send(res, 405, 'POST only');
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let body = {};
      try { body = JSON.parse(raw || '{}'); } catch (e) {
        return send(res, 400, JSON.stringify({ error: 'bad json' }), MIME['.json']);
      }
      const formType = clean(body.formType, 40).toLowerCase();
      if (!ALLOWED.includes(formType)) {
        console.log('[form] REJECTED unknown formType:', JSON.stringify(formType));
        return send(res, 400, JSON.stringify({ error: 'unknown form' }), MIME['.json']);
      }
      const name = clean(body.name, 120), email = clean(body.email, 200);
      if (!name || !email) {
        console.log('[form] REJECTED missing name/email for', formType);
        return send(res, 400, JSON.stringify({ error: 'name and email required' }), MIME['.json']);
      }
      if (!EMAIL_RE.test(email)) {
        console.log('[form] REJECTED invalid email', JSON.stringify(email));
        return send(res, 400, JSON.stringify({ error: 'invalid email' }), MIME['.json']);
      }
      const record = {
        formType, name, email,
        phone: clean(body.phone, 60), subject: clean(body.subject, 200),
        position: clean(body.position, 120), message: clean(body.message, 4000),
        handled: false, receivedAt: new Date().toISOString()
      };
      submissions.push(record);
      console.log('[form] SAVED', JSON.stringify(record));
      return send(res, 200, JSON.stringify({ ok: true }), MIME['.json']);
    });
    return;
  }

  /* Anything else under /_functions/ would 404 on Wix too. */
  if (pathname.startsWith('/_functions/')) {
    return send(res, 404, JSON.stringify({ error: 'no such function' }), MIME['.json']);
  }

  /* ---- the sample's own inspection endpoint ---------------------------- */
  if (pathname === '/_sample/submissions.json') {
    return send(res, 200, JSON.stringify(submissions, null, 2), MIME['.json']);
  }

  /* ---- FIXED SET (2026-09-14): real elements, real page code, mock backend ---- */
  const FIXED = path.join(ROOT, '..', 'files2', 'arise-fixed-2026-09-14');
  if (pathname.startsWith('/elements-fixed/')) {
    const file = path.join(FIXED, 'custom-elements', pathname.slice('/elements-fixed/'.length));
    if (!file.startsWith(FIXED) || !fs.existsSync(file)) return send(res, 404, 'not found: ' + pathname);
    return serveFile(res, file);
  }
  if (pathname.startsWith('/page-code/')) {
    /* Velo page code imports 'backend/x.web' and 'wix-data'; rewrite those to
       the sample's ES-module mocks so the file runs unchanged in a browser. */
    const file = path.join(FIXED, 'page-code', pathname.slice('/page-code/'.length));
    if (!file.startsWith(FIXED) || !fs.existsSync(file)) return send(res, 404, 'not found: ' + pathname);
    const src = fs.readFileSync(file, 'utf8')
      .replace(/from 'backend\/([a-z]+)\.web'/g, "from '/backend/$1.web.js'")
      .replace(/from 'backend\/youtube\.jsw'/g, "from '/backend/youtube.js'")
      .replace(/from 'wix-data'/g, "from '/backend/wix-data.js'");
    return send(res, 200, src, MIME['.js']);
  }
  if (pathname === '/cms-new-rows.json') {
    const file = path.join(FIXED, 'cms', 'PageContent-new-rows.json');
    if (!fs.existsSync(file)) return send(res, 200, '[]', MIME['.json']);
    return serveFile(res, file);
  }
  if (pathname.startsWith('/backend/') || pathname === '/velo-shim.js') {
    const file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) return send(res, 404, 'not found: ' + pathname);
    return serveFile(res, file);
  }

  /* ---- static assets --------------------------------------------------- */
  const staticPrefixes = ['/elements/', '/assets/'];
  const staticFiles = ['/fixtures.js', '/mock-page-code.js', '/sample.css'];
  if (staticPrefixes.some((p) => pathname.startsWith(p)) || staticFiles.includes(pathname)) {
    const file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT)) return send(res, 403, 'forbidden');
    if (!fs.existsSync(file)) return send(res, 404, 'not found: ' + pathname);
    return serveFile(res, file);
  }

  /* ---- pages ------------------------------------------------------------
     Main routes come from pages-fixed/ (the fixed set) when it exists; the
     previous render (old elements + mock page code) stays under /_before/. */
  const before = pathname === '/_before' || pathname.startsWith('/_before/');
  const rel = before ? (pathname.replace(/^\/_before/, '') || '/') : pathname;
  const dir = (!before && fs.existsSync(path.join(ROOT, 'pages-fixed'))) ? 'pages-fixed' : 'pages';
  const page = path.join(ROOT, dir, pageFor(rel));
  if (fs.existsSync(page)) {
    console.log('[page] 200', pathname, '(' + dir + ')');
    return serveFile(res, page);
  }

  const ref = req.headers.referer ? '  (from ' + req.headers.referer + ')' : '';
  console.log('[page] 404', pathname + ref);
  return serveFile(res, path.join(ROOT, dir, '_404.html'), 404);
});

server.listen(PORT, () => {
  console.log('Arise Church sample site  ->  http://localhost:' + PORT + '/_sample');
});
