/* ===========================================================================
   SAMPLE SITE PAGE BUILDER - FIXED SET (2026-09-14)
   Generates sample-site/pages-fixed/. Unlike build.js (which feeds elements
   from a mock), these pages run the REAL Velo page code from
   files2/arise-fixed-2026-09-14/page-code/ through velo-shim.js, against the
   FIXED elements in files2/arise-fixed-2026-09-14/custom-elements/, with the
   backend mocked by sample-site/backend/*.js (fixtures = real CMS rows).

   Pages whose live element ID is wrong (the six department pages, Serve and
   the four galleries) are generated with the element tagged customElement5
   while their page code still says '#customElement1', so the sample proves
   the fallback finds the element. Sermons keeps '#customElement1' so the
   no-guard path is exercised.

   Run:  node sample-site/build-fixed.js
   =========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pages-fixed');
fs.mkdirSync(OUT, { recursive: true });

/* code: page-code file name (files2/arise-fixed-2026-09-14/page-code/<code>.js)
   velo: the element's Velo ID in this sample (customElement1 or, to simulate the
         live mismatch, customElement5)
   backend: fixture keys the mock backend returns (see backend/*.js) */
const ROUTES = [
  { path: '/', title: 'Home', tag: 'arise-home', code: 'Home', velo: 'customElement1', hero: true,
    backend: { culture: 'homeCulture', projects: {} },
    note: 'Real page code: content + culture video + news (Exciting News project is empty live).' },
  { path: '/about', title: 'About', tag: 'arise-about', code: null, velo: 'customElement1',
    note: 'No page code (boilerplate). Content arrives from masterPage.js only.' },
  { path: '/leaders', title: 'Meet our Leaders', tag: 'arise-leaders', code: 'Meet our Leaders', velo: 'customElement1',
    note: 'Real page code, 7 CMS leaders.' },
  { path: '/ministries', title: 'Ministries', tag: 'arise-ministries', code: 'Ministries', velo: 'customElement1',
    note: 'Real page code, 9 CMS ministries.' },
  { path: '/sermons', title: 'Sermons', tag: 'arise-sermons', code: 'Past Sermons', velo: 'customElement1',
    note: 'Real page code without the .length guard: CMS series row -> band; not streaming.' },
  { path: '/events', title: 'Events', tag: 'arise-events', code: 'Events', velo: 'customElement1',
    note: 'Real page code; events fixture (1 real upcoming + sample past).' },
  { path: '/contact', title: 'Contact', tag: 'arise-contact', code: 'Contact', velo: 'customElement1',
    note: 'Real page code; CMS times ("Sunday 10:30 AM" rows) - check no doubled "Sunday".' },
  { path: '/arise-bible', title: 'Bible Search', tag: 'arise-bible', code: null, velo: 'customElement1',
    note: 'No page code needed; element calls bible-api.com directly.' },
  { path: '/serve', title: 'Sign Up to Serve!', tag: 'arise-serve', code: 'Sign Up to Serve', velo: 'customElement5',
    note: 'SIMULATED WRONG ID (element is customElement5, code says #customElement1): the fallback must still deliver the 7 CMS positions.' },
  { path: '/connect-groups', title: 'Connect Groups', tag: 'arise-connect', code: 'Connect Groups', velo: 'customElement1',
    backend: { groups: 'emptyList' }, note: 'Real page code; ConnectGroups is empty live -> "Groups are forming".' },
  { path: '/classes', title: 'Classes', tag: 'arise-classes', code: 'Classes', velo: 'customElement5',
    note: 'Real page code (#customElement5 as live); no published programs -> coming-soon panel.' },
  { path: '/creative-arts', title: 'Arise Creative Arts', tag: 'arise-creatives', code: 'Creative Arts', velo: 'customElement5',
    note: 'Real page code (#customElement5 as live): 6 departments.' },
  ...[['praise-worship', 'Praise and Worship'], ['musicians', 'Musicians'], ['production', 'Production'], ['sound', 'Sound'], ['media-team', 'Media'], ['content', 'Social Media and Content']].map(([slug, code]) => ({
    path: '/' + slug, title: 'Creative Arts · ' + code, tag: 'arise-creatives', code, velo: 'customElement5',
    fixed: { 'data-dept': slug },
    note: 'SIMULATED WRONG ID: the fallback must deliver depts + members so the tabs and team render.' })),
  { path: '/childrens', title: "Children's Ministry", tag: 'arise-childrens', code: "Children's Ministry", velo: 'customElement5',
    backend: { projects: { '621e6fdb-57f1-4b84-9834-e861e6407476': 'emptyList' } }, note: 'SIMULATED WRONG ID; gallery empty as live.' },
  { path: '/youth', title: 'Youth Ministry', tag: 'arise-youth', code: 'Youth Ministry', velo: 'customElement5',
    backend: { projects: { 'c2be296e-9eb4-4a02-b6b8-428128fbe50d': 'emptyList' } }, note: 'SIMULATED WRONG ID; gallery empty as live.' },
  { path: '/outreach', title: 'Outreach', tag: 'arise-outreach', code: 'Outreach', velo: 'customElement5',
    backend: { projects: { '78e5e5f9-6560-4edb-9e09-fc74dadab9f3': 'emptyList' } }, note: 'SIMULATED WRONG ID; gallery empty as live.' },
  { path: '/lead-network', title: 'Lead Network', tag: 'arise-leadnetwork', code: 'Lead Network', velo: 'customElement5',
    backend: { projects: { '885f9ceb-b1ea-4259-8388-284c180062e6': 'emptyList' } }, note: 'SIMULATED WRONG ID; gallery empty as live.' },
  { path: '/arise-alexandria', title: 'Arise Church Alexandria', tag: 'arise-alexandria', code: 'Arise Church Alexandria', velo: 'customElement5',
    note: 'Real page code (#customElement5 as live).' },

  /* ---- sample-only: same code paths with sample data so every feature shows ---- */
  { path: '/_fixed/childrens-with-gallery', title: "Children's + gallery", tag: 'arise-childrens', code: "Children's Ministry", velo: 'customElement1',
    backend: { projects: { '621e6fdb-57f1-4b84-9834-e861e6407476': 'galleryChildrens' } }, note: 'SAMPLE gallery (7 items) through the real page code.' },
  { path: '/_fixed/outreach-with-gallery', title: 'Outreach + gallery', tag: 'arise-outreach', code: 'Outreach', velo: 'customElement1',
    backend: { projects: { '78e5e5f9-6560-4edb-9e09-fc74dadab9f3': 'galleryOutreach' } }, note: 'SAMPLE gallery - exercises the fixed fillGallery placement.' },
  { path: '/_fixed/lead-network-with-gallery', title: 'Lead Network + gallery', tag: 'arise-leadnetwork', code: 'Lead Network', velo: 'customElement1',
    backend: { projects: { '885f9ceb-b1ea-4259-8388-284c180062e6': 'galleryLeadNetwork' } }, note: 'SAMPLE gallery - exercises the fixed fillGallery placement.' },
  { path: '/_fixed/connect-groups-with-groups', title: 'Connect Groups + groups', tag: 'arise-connect', code: 'Connect Groups', velo: 'customElement1',
    backend: { groups: 'connectGroups' }, note: 'SAMPLE groups (one full). Joining closed (default): no Join tab, no Join This Group buttons.' },
  { path: '/_fixed/connect-groups-join-open', title: 'Connect Groups · joining opened in CMS', tag: 'arise-connect', code: 'Connect Groups', velo: 'customElement1',
    backend: { groups: 'connectGroups', contentPatch: { 'connect.join.open': { text: 'yes', image: '' } } },
    note: 'SIMULATED CMS EDIT connect.join.open = yes: Join tab and Join This Group buttons appear.' },
  { path: '/_fixed/connect-groups-no-deadline', title: 'Connect Groups · deadline cleared in CMS', tag: 'arise-connect', code: 'Connect Groups', velo: 'customElement1',
    backend: { groups: 'emptyList', contentPatch: { 'connect.season.hostby': { text: '', image: '' } } },
    note: 'SIMULATED CMS EDIT connect.season.hostby cleared: no host sign-up deadline shown anywhere.' },
  { path: '/_fixed/classes-with-classes', title: 'Classes + classes', tag: 'arise-classes', code: 'Classes', velo: 'customElement5',
    backend: { classes: 'classes' }, note: 'SAMPLE programs.' },
  { path: '/_fixed/home-with-news', title: 'Home + news + collage', tag: 'arise-home', code: 'Home', velo: 'customElement1', hero: true,
    backend: { culture: 'homeCulture', projects: { 'b2697282-735e-42fc-979a-2b8dc2118f1e': 'homeNews' } }, note: 'SAMPLE news items in the hero panel.' },
  { path: '/_fixed/sermons-live', title: 'Sermons while streaming', tag: 'arise-sermons', code: 'Past Sermons', velo: 'customElement1',
    backend: { liveVideoId: 'dQw4w9WgXcQ' }, note: 'SAMPLE: live-stream badge path.' },
  { path: '/_fixed/sermons-no-shorts', title: 'Sermons · YouTube unreachable', tag: 'arise-sermons', code: 'Past Sermons', velo: 'customElement1',
    backend: { shorts: 'none' }, note: 'SIMULATED: the Shorts lookup returns nothing, so the built-in list (the newest Shorts on 14 Sept) shows.' },
  { path: '/_fixed/service-times', title: 'Service Times element', tag: 'arise-service-times', code: null, velo: 'customElement1', standalone: true,
    note: 'The hero dropdown alone, fed data-content by masterPage.js.' },
  { path: '/_fixed/home-with-service-times', title: 'Home + Service Times', tag: 'arise-home', code: 'Home', velo: 'customElement1', hero: true,
    backend: { culture: 'homeCulture', projects: {} }, extra: 'arise-service-times', note: 'Home with the Service Times element in the hero (two custom elements on one page: the page code must pick the right one).' },
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
function fileOf(tag) { return tag === 'arise-service-times' ? 'arise-service-times-final' : tag; }
function fileFor(p) { p = p.replace(/\/+$/, '') || '/'; return p === '/' ? 'index.html' : p.slice(1).replace(/\//g, '-') + '.html'; }
function attrString(fixed) { return Object.keys(fixed || {}).map((k) => ' ' + k + '="' + esc(fixed[k]) + '"').join(''); }

function shell(r) {
  const el = '<' + r.tag + ' data-velo-id="' + r.velo + '"' + attrString(r.fixed) + '></' + r.tag + '>';
  let main;
  if (r.standalone) main = '<div class="wx-header" style="padding:24px"><div class="wx-st" style="position:static;width:360px">' + el + '</div></div>';
  else if (r.hero) main = '<div class="wx-hero-wrap">' + el + (r.extra ? '<div class="wx-st"><' + r.extra + ' data-velo-id="customElement2"></' + r.extra + '></div>' : '') + '</div>';
  else main = el;
  const scripts = [fileOf(r.tag)].concat(r.extra ? [fileOf(r.extra)] : []);
  const cfg = { route: r.path, tag: r.tag, code: r.code, velo: r.velo, note: r.note, fixed: true };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(r.title)} · Arise Church (fixed set, sample render)</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap">
<style>${BASE_CSS}</style>
</head>
<body>
<div class="wx-header" data-velo-id="SITE_HEADER"><arise-header data-velo-id="customElementHeader"></arise-header></div>
${main}
<div class="wx-footer" data-velo-id="SITE_FOOTER"><arise-footer data-velo-id="customElementFooter"></arise-footer></div>
<a class="wx-smp" href="/_sample" title="Sample site hub: every page in one list">Sample · all pages</a>
<script>window.__ARISE_PAGE__ = ${JSON.stringify(cfg)}; window.__ARISE_BACKEND__ = ${JSON.stringify(r.backend || {})};</script>
<script src="/fixtures.js"></script>
<script src="/velo-shim.js"></script>
<script type="module" src="/elements-fixed/arise-header.js"></script>
<script type="module" src="/elements-fixed/arise-footer.js"></script>
${scripts.map((s) => `<script type="module" src="/elements-fixed/${s}.js"></script>`).join('\n')}
<script type="module" src="/page-code/masterPage.js"></script>
${r.code ? `<script type="module" src="/page-code/${encodeURIComponent(r.code)}.js"></script>` : ''}
<script src="/assets/audit.js"></script>
</body>
</html>
`;
}

ROUTES.forEach((r) => fs.writeFileSync(path.join(OUT, fileFor(r.path)), shell(r)));

/* stand-ins shared with the old build */
const STANDINS = [
  ['tithes-and-offerings.html', 'Give', 'On the live site this URL is a <b>301 redirect to Tithe.ly</b>. The sample stops here.'],
  ['podcast.html', 'Podcast', 'On the live site this URL is a <b>301 redirect to Spotify</b>. The sample stops here.'],
  ['_app-event-detail.html', 'Event details', 'On the live site this is the <b>Wix Events</b> detail page. Not one of the custom elements.'],
  ['_app-class-detail.html', 'Class details', 'On the live site this is the <b>Wix Online Programs</b> page. Not one of the custom elements.'],
  ['_404.html', 'Not found', 'No such page in the sample.'],
];
STANDINS.forEach(([file, title, body]) => fs.writeFileSync(path.join(OUT, file), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} · sample</title><style>${BASE_CSS}</style></head><body><main class="wx-standin"><span class="k">Sample stand-in</span><h1>${esc(title)}</h1><p>${body}</p><p><a href="/_sample">Back to the sample hub</a></p></main></body></html>`));

/* hub */
const rows = ROUTES.map((r) => `<tr><td><a href="${esc(r.path)}">${esc(r.path)}</a></td><td>${esc(r.title)}</td><td><code>${esc(r.tag)}</code></td><td>${r.code ? '<code>' + esc(r.code) + '.js</code>' : '—'}</td><td><code>${esc(r.velo)}</code></td><td>${esc(r.note || '')}</td></tr>`).join('\n');
fs.writeFileSync(path.join(OUT, '_sample.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Arise Church sample site · fixed set hub</title>
<style>body{font:15px/1.5 Oswald,Helvetica,Arial,sans-serif;color:#0A0A0C;background:#F4F2F0;margin:0;padding:32px 24px}h1{font:400 36px/1 Anton,Impact,sans-serif;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px}p{max-width:80ch}table{border-collapse:collapse;width:100%;background:#fff}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #ddd;vertical-align:top;font-size:14px}th{font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:12px}a{color:#D6222D}code{font-size:12px;background:#eee;padding:1px 4px}.b{display:inline-block;background:#0A0A0C;color:#fff;padding:4px 8px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-bottom:16px}</style></head><body>
<span class="b">Fixed set · 2026-09-14</span>
<h1>Arise Church sample · fixed code</h1>
<p>Every page below runs the <b>real Velo page code</b> (files2/arise-fixed-2026-09-14/page-code) through a small $w shim, against the <b>fixed elements</b>, with the backend mocked from the real CMS rows. Pages marked "simulated wrong ID" carry the element as <code>customElement5</code> while the code still says <code>#customElement1</code>, to prove the new fallback. The previous sample (old elements, mock page code) is still at <a href="/_before/_sample">/_before/</a>. Open the browser console on any page to see the page-code log lines.</p>
<table><thead><tr><th>Route</th><th>Page</th><th>Element</th><th>Page code</th><th>Velo ID in sample</th><th>What to look for</th></tr></thead><tbody>
${rows}
</tbody></table></body></html>`);

console.log('built ' + ROUTES.length + ' fixed pages + ' + STANDINS.length + ' stand-ins + hub into ' + OUT);
