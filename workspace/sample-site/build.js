/* ===========================================================================
   SAMPLE SITE PAGE BUILDER
   Generates one HTML page per route into sample-site/pages/. Every page is
   the same composition the published Wix site uses: the header element in a
   #0A0A0C header strip, one page element, the footer element in a #0A0A0C
   footer strip (INSTALL-ORDER.md steps 1, 2 and 4).

   Main routes mirror what the LIVE site's page code would hand each element
   today (real CMS rows pulled 2026-09-13; no data where the backend is not
   installed). Routes under /_sample/ feed elements with sample data so every
   feature can be seen.

   Run:  node sample-site/build.js
   =========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pages');
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------------
   ROUTES
   status: 'live'      = page exists on arisecenla.church with this element
           'pending'   = page exists live but the element is not installed yet
           'proposed'  = page recommended by the docs, not created on Wix
           'sample'    = exists only in this sample (to exercise an element)
   data:   what the element is fed, for the hub table
   ------------------------------------------------------------------------ */
const ROUTES = [
  { path: '/', title: 'Home', tag: 'arise-home', status: 'live', hero: true,
    attrs: { 'data-culture': 'homeCulture', 'data-photos': 'emptyList', 'data-news': 'emptyList' },
    data: 'Real CMS: Home Settings culture video (active) + Page Content. Portfolio projects have no items via the API, so the news panel and collage get empty lists, as live.' },
  { path: '/about', title: 'About', tag: 'arise-about', status: 'live', data: 'Page Content only (built-in copy).' },
  { path: '/leaders', title: 'Meet our Leaders', tag: 'arise-leaders', status: 'live',
    attrs: { 'data-leaders': 'leaders' }, data: 'Real CMS: Leaders (7 rows, incl. Kristina Robinson).' },
  { path: '/ministries', title: 'Ministries', tag: 'arise-ministries', status: 'live',
    attrs: { 'data-ministries': 'ministries' }, data: 'Real CMS: Ministries (9 rows).' },
  { path: '/sermons', title: 'Sermons', tag: 'arise-sermons', status: 'live',
    raw: { 'data-series-active': 'true', 'data-series-title': 'The Kingdom', 'data-series-line': 'Culture of Giving',
           'data-series-link': 'https://www.youtube.com/@arisechurch4147/streams', 'data-series-button': 'Watch the Full Message', 'data-live-video': '' },
    data: 'Real CMS: Site Settings sermonSeries (active). Live detection off (not streaming).' },
  { path: '/events', title: 'Events', tag: 'arise-events', status: 'live',
    data: 'NO data-events — the events backend is not installed (handoff §7), so the element shows its built-in fallback exactly as live.' },
  { path: '/contact', title: 'Contact', tag: 'arise-contact', status: 'live', data: 'Page Content (real CMS service times).' },
  { path: '/arise-bible', title: 'Bible Search', tag: 'arise-bible', status: 'live', data: 'Calls bible-api.com directly from the browser.' },
  { path: '/serve', title: 'Serve', tag: 'arise-serve', status: 'live',
    attrs: { 'data-positions': 'servePositions' }, data: 'Real CMS: Serve Positions (7 rows).' },
  { path: '/connect-groups', title: 'Connect Groups', tag: 'arise-connect', status: 'live',
    attrs: { 'data-groups': 'emptyList' }, data: 'Real CMS: ConnectGroups is empty → "Groups are forming" state, as live.' },
  { path: '/classes', title: 'Classes', tag: 'arise-classes', status: 'live',
    attrs: { 'data-classes': 'emptyList' }, data: 'No published Online Program → "Classes are coming" state, as live.' },
  { path: '/creative-arts', title: 'Arise Creative Arts', tag: 'arise-creatives', status: 'live',
    attrs: { 'data-depts': 'creativeDepts', 'data-members': 'creativeMembers' }, data: 'Real CMS: Creative Departments (6) + Members (14, no photos yet).' },
  ...['praise-worship', 'musicians', 'production', 'sound', 'media-team', 'content'].map((slug) => ({
    path: '/' + slug, title: 'Creative Arts · ' + slug, tag: 'arise-creatives', status: 'live',
    fixed: { 'data-dept': slug },
    attrs: { 'data-depts': 'creativeDepts', 'data-members': 'creativeMembers' }, data: 'Real CMS, department view.' })),
  { path: '/childrens', title: "Children's Ministry", tag: 'arise-childrens', status: 'live',
    attrs: { 'data-photos': 'emptyList' }, data: 'Page Content (real CMS image URLs — three of them 403 on the CDN). Gallery empty, as live.' },
  { path: '/youth', title: 'Youth Ministry', tag: 'arise-youth', status: 'live',
    attrs: { 'data-photos': 'emptyList' }, data: 'Page Content. Gallery empty, as live.' },
  { path: '/outreach', title: 'Outreach', tag: 'arise-outreach', status: 'live',
    attrs: { 'data-photos': 'emptyList' }, data: 'Page Content (supplies image URL 403s on the CDN). Gallery empty, as live.' },
  { path: '/lead-network', title: 'Lead Network', tag: 'arise-leadnetwork', status: 'live',
    attrs: { 'data-photos': 'emptyList' }, data: 'Page Content (both minister photo URLs 403 on the CDN). Gallery empty, as live.' },
  { path: '/arise-alexandria', title: 'Arise Church Alexandria', tag: 'arise-alexandria', status: 'pending',
    data: 'Page Content (real CMS alexandria.* rows incl. Pastor Sheron photo). Element not yet placed on the live page.' },
  { path: '/prayer', title: 'Prayer Request', tag: 'arise-form', status: 'proposed',
    fixed: { 'data-form': 'prayer' }, content: false,
    data: 'Recommended in AUDIT-REPORT.md (flag 3). Does not exist live; Home and the footer still use mailto: links.' },

  /* ---- sample-only routes: same elements, sample data, to see every feature ---- */
  { path: '/_sample/home-with-news', title: 'Home + news panel + collage', tag: 'arise-home', status: 'sample', hero: true,
    attrs: { 'data-culture': 'homeCultureOff', 'data-photos': 'homePhotos', 'data-news': 'homeNews' },
    data: 'SAMPLE: culture video off → photo collage; two sample news items in the hero panel.' },
  { path: '/_sample/events-with-data', title: 'Events + backend data', tag: 'arise-events', status: 'sample',
    attrs: { 'data-events': 'events' }, data: 'SAMPLE: what the page looks like once events.web.js is installed (1 real upcoming + 5 sample past events).' },
  { path: '/_sample/connect-groups-with-groups', title: 'Connect Groups + groups', tag: 'arise-connect', status: 'sample',
    attrs: { 'data-groups': 'connectGroups' }, data: 'SAMPLE: two sample groups (one full) to see the cards and Join pre-fill.' },
  { path: '/_sample/classes-with-classes', title: 'Classes + classes', tag: 'arise-classes', status: 'sample',
    attrs: { 'data-classes': 'classes' }, data: 'SAMPLE: two sample class cards.' },
  { path: '/_sample/childrens-with-photos', title: "Children's + gallery", tag: 'arise-childrens', status: 'sample',
    attrs: { 'data-photos': 'galleryChildrens' }, data: 'SAMPLE: seven sample gallery items to see the mosaic and lightbox.' },
  { path: '/_sample/youth-with-photos', title: 'Youth + gallery', tag: 'arise-youth', status: 'sample',
    attrs: { 'data-photos': 'galleryYouth' }, data: 'SAMPLE gallery.' },
  { path: '/_sample/form-contact', title: 'arise-form · contact variant', tag: 'arise-form', status: 'sample',
    fixed: { 'data-form': 'contact' }, content: false, data: 'The reusable form element, contact variant.' },
  { path: '/_sample/form-serve', title: 'arise-form · serve variant', tag: 'arise-form', status: 'sample',
    fixed: { 'data-form': 'serve' }, content: false, data: 'The reusable form element, serve variant (superseded by arise-serve).' },
  { path: '/_sample/service-times', title: 'arise-service-times · alone', tag: 'arise-service-times', status: 'sample',
    content: false, standalone: true, data: 'The hero dropdown on its own, on a dark surface.' }
];

/* Stand-in pages for routes that are redirects or Wix app pages on the live site. */
const STANDINS = [
  { path: '/tithes-and-offerings', file: 'tithes-and-offerings.html', title: 'Give',
    body: 'On the live site this URL is a <b>301 redirect to Tithe.ly</b> (verified 2026-09-13). The sample stops here instead of sending you off-site.' },
  { path: '/podcast', file: 'podcast.html', title: 'Podcast',
    body: 'On the live site this URL is a <b>301 redirect to Spotify</b> (verified 2026-09-13). The sample stops here instead of sending you off-site.' },
  { path: '/events-1/*', file: '_app-event-detail.html', title: 'Event details',
    body: 'On the live site this is the <b>Wix Events</b> detail and RSVP page for the event you clicked. It is a Wix app page, not one of the custom elements, so the sample cannot render it.' },
  { path: '/classes/*', file: '_app-class-detail.html', title: 'Class details',
    body: 'On the live site this would be the <b>Wix Online Programs</b> page for the class you clicked. It is a Wix app page, not one of the custom elements, so the sample cannot render it.' }
];

const BASE_CSS = `
:root{color-scheme:light only}
html,body{margin:0;padding:0;background:#ffffff;color:#0A0A0C}
.wx-header{background:#0A0A0C}
.wx-footer{background:#0A0A0C}
.wx-hero-wrap{position:relative}
.wx-st{position:absolute;top:96px;right:24px;width:360px;z-index:5}
@media (max-width:900px){.wx-st{position:static;width:auto;padding:12px 16px;background:#0A0A0C}}
.wx-smp{position:fixed;left:12px;bottom:12px;z-index:2147483001;font:600 11px/1 Arial,Helvetica,sans-serif;
  letter-spacing:.12em;text-transform:uppercase;background:#0A0A0C;color:#ffffff;border:1px solid #D6222D;
  padding:9px 12px;border-radius:999px;opacity:.88;text-decoration:none}
.wx-smp:hover{opacity:1}
.wx-standin{max-width:720px;margin:0 auto;padding:96px 24px;font:300 17px/1.6 Oswald,Helvetica,Arial,sans-serif;color:#0A0A0C;background:#ffffff}
.wx-standin h1{font:400 44px/1.02 Anton,Impact,sans-serif;text-transform:uppercase;letter-spacing:.06em;margin:0 0 24px}
.wx-standin .k{color:#D6222D;font:500 12px/1 Oswald,Helvetica,Arial,sans-serif;letter-spacing:.3em;text-transform:uppercase;display:block;margin-bottom:16px}
.wx-standin a{color:#D6222D}
`;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function shell({ title, main, scripts, cfg, noChrome }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(title)} · Arise Church (sample render)</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap">
<style>${BASE_CSS}</style>
</head>
<body>
${noChrome ? '' : '<div class="wx-header"><arise-header></arise-header></div>'}
${main}
${noChrome ? '' : '<div class="wx-footer"><arise-footer></arise-footer></div>'}
<a class="wx-smp" href="/_sample" title="Sample site hub: every page in one list">Sample · all pages</a>
<script>window.__ARISE_PAGE__ = ${JSON.stringify(cfg || {})};</script>
<script src="/fixtures.js"></script>
${noChrome ? '' : '<script type="module" src="/elements/arise-header.js"></script>\n<script type="module" src="/elements/arise-footer.js"></script>'}
${scripts.map((s) => `<script type="module" src="/elements/${s}.js"></script>`).join('\n')}
<script src="/mock-page-code.js"></script>
<script src="/assets/audit.js"></script>
</body>
</html>
`;
}

function fileFor(p) {
  if (p === '/') return 'index.html';
  return p.slice(1).replace(/\//g, '-') + '.html';
}

function attrString(fixed) {
  return Object.keys(fixed || {}).map((k) => ` ${k}="${esc(fixed[k])}"`).join('');
}

/* Tag name -> element file. Only the service-times file is named differently
   from its tag (arise-service-times-final.js, per ARISE-HANDOFF.md §4). */
function fileOf(tag) { return tag === 'arise-service-times' ? 'arise-service-times-final' : tag; }

/* ---- element pages ------------------------------------------------------- */
for (const r of ROUTES) {
  const tagHtml = `<${r.tag}${attrString(r.fixed)}></${r.tag}>`;
  let main = tagHtml;
  const scripts = [fileOf(r.tag)];
  const cfg = { tag: r.tag, attrs: r.attrs || {}, raw: r.raw || {}, content: r.content !== false };

  if (r.hero) {
    /* On the live site arise-service-times is a second custom element placed
       top-right of the hero, 360×80 (FINAL-BUILD-PLAN.md §10). */
    main = `<div class="wx-hero-wrap">${tagHtml}<div class="wx-st"><arise-service-times></arise-service-times></div></div>`;
    scripts.push(fileOf('arise-service-times'));
  }
  if (r.standalone) {
    main = `<div style="background:#0A0A0C;padding:48px 24px;min-height:60vh"><div style="max-width:360px;margin-left:auto">${tagHtml}</div></div>`;
  }

  fs.writeFileSync(path.join(OUT, fileFor(r.path)), shell({ title: r.title, main, scripts, cfg }));
}

/* ---- stand-ins ----------------------------------------------------------- */
for (const s of STANDINS) {
  const main = `<main class="wx-standin"><span class="k">Sample stand-in</span><h1>${esc(s.title)}</h1><p>${s.body}</p><p><a href="/_sample">Back to the sample hub</a></p></main>`;
  fs.writeFileSync(path.join(OUT, s.file), shell({ title: s.title, main, scripts: [], cfg: {} }));
}

/* ---- 404 ------------------------------------------------------------------ */
fs.writeFileSync(path.join(OUT, '_404.html'), shell({
  title: 'Not in the sample',
  main: `<main class="wx-standin"><span class="k">404 in the sample</span><h1>No page here</h1>
<p>This route has no page in the sample. If you got here by clicking a link inside one of the elements, that link points at a URL the rebuild does not cover — check whether it exists on the live site.</p>
<p><a href="/_sample">Back to the sample hub</a></p></main>`,
  scripts: [], cfg: {}
}));

/* ---- hub ------------------------------------------------------------------ */
const STATUS_LABEL = {
  live: 'Live page, this element installed',
  pending: 'Live page, element not installed yet',
  proposed: 'Recommended page, does not exist on Wix',
  sample: 'Sample-only page'
};
const row = (r) => `<tr><td><a href="${esc(r.path)}">${esc(r.path)}</a></td><td>${esc(r.title)}</td><td><code>&lt;${esc(r.tag)}${esc(attrString(r.fixed))}&gt;</code></td><td class="s-${r.status}">${esc(STATUS_LABEL[r.status])}</td><td>${esc(r.data || '')}</td></tr>`;
const liveRows = ROUTES.filter((r) => r.status !== 'sample').map(row).join('\n');
const sampleRows = ROUTES.filter((r) => r.status === 'sample').map(row).join('\n');
const standinRows = STANDINS.map((s) => `<tr><td><a href="${esc(s.path.replace('*', 'sample'))}">${esc(s.path)}</a></td><td>${esc(s.title)}</td><td>—</td><td class="s-sample">Stand-in for a redirect or Wix app page</td><td></td></tr>`).join('\n');

const hub = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light">
<title>Arise Church sample site · hub</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap">
<style>
:root{color-scheme:light only}body{margin:0;background:#F4F2F0;color:#0A0A0C;font:15px/1.5 Oswald,Helvetica,Arial,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:48px 24px}
h1{font:400 44px/1.02 Anton,Impact,sans-serif;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}
h2{font:400 24px/1.1 Anton,Impact,sans-serif;text-transform:uppercase;letter-spacing:.06em;margin:40px 0 8px}
.k{color:#D6222D;font-weight:500;font-size:12px;letter-spacing:.3em;text-transform:uppercase;display:block;margin-bottom:16px}
p{max-width:820px}
table{width:100%;border-collapse:collapse;background:#fff;margin-top:16px;font-size:14px}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #E6E4E2;vertical-align:top}
th{background:#0A0A0C;color:#fff;font-weight:500;letter-spacing:.08em;text-transform:uppercase;font-size:11px}
code{font:12px/1.4 Consolas,Menlo,monospace;background:#F4F2F0;padding:2px 5px}
a{color:#D6222D}
.s-live{color:#1c7c3a}.s-pending{color:#b26a00}.s-proposed{color:#6A6A6E}.s-sample{color:#6A6A6E}
.tip{background:#fff;border-left:5px solid #D6222D;padding:16px 20px;margin:24px 0}
</style></head><body><div class="wrap">
<span class="k">Arise Church · local sample · built 2026-09-13</span>
<h1>Every page, one list</h1>
<p>A local render of the Velo custom elements from <code>files2/arise-fixed-2026-08-23</code>, composed the way the published Wix site composes them (header + page element + footer). The main routes are fed the <b>real CMS rows</b> read from Wix on 2026-09-13, and get no data where the live site's backend is not installed yet, so they show what a visitor sees today. The <b>sample-only</b> routes feed the same elements sample data so every feature can be seen.</p>
<div class="tip"><b>Not the live site.</b> Nothing here touches Wix. Photos load from the church's Wix media CDN, so you need to be online to see them. Forms post to a mock of <code>/_functions/ariseForm</code> and are printed to the server console — nothing is emailed or saved.</div>
<h2>Live pages</h2>
<table><thead><tr><th>URL</th><th>Page</th><th>Element</th><th>Status</th><th>Data</th></tr></thead><tbody>
${liveRows}
${standinRows}
</tbody></table>
<h2>Sample-only pages</h2>
<table><thead><tr><th>URL</th><th>Page</th><th>Element</th><th>Status</th><th>Data</th></tr></thead><tbody>
${sampleRows}
</tbody></table>
<p style="margin-top:32px"><a href="/_sample/submissions.json">Form submissions received by the mock backend (JSON)</a></p>
</div></body></html>`;
fs.writeFileSync(path.join(OUT, '_sample.html'), hub);

console.log('built ' + (ROUTES.length + STANDINS.length + 2) + ' pages into ' + OUT);
