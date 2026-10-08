/* ===========================================================================
   BUILD NEW PAGE CONTENT ROWS
   Reads the per-element hook manifests written during the CMS-hooks pass
   (files2/arise-fixed-2026-09-14/cms/manifest/<element>.json, each an array of
   { contentKey, page, label, text, imageUrl, where }) and writes:

     cms/PageContent-new-rows.csv   -> import into CMS -> Page Content (add as new items)
     cms/PageContent-new-rows.json  -> used by the sample's round-trip test
     cms/PageContent-all-keys.md    -> readable list of every key by page

   A row goes into the CSV only when importing it cannot change any page:
     - the key is not already in the live Page Content collection
       (files/PageContent.csv + the live rows in sample-site/fixtures-cms.json),
     - it has a default (text or image), and
     - every element that uses the key shows the same default.
   Keys used by several elements with different defaults (for example a row label
   that reads "Sunday" on one page and "Sunday Service" on another) are listed in
   the .md instead: adding such a row sets that label on every page at once.

   Run: node sample-site/tools/build-cms-rows.js
   =========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const CMS = path.join(ROOT, 'files2', 'arise-fixed-2026-09-14', 'cms');
const MANIFEST = path.join(CMS, 'manifest');
const LIVE_CSV = path.join(ROOT, 'files', 'PageContent.csv');
const FIXTURE = path.join(ROOT, 'sample-site', 'fixtures-cms.json');

function parseCsv(text) {
  const rows = []; let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0]);
}
const csvCell = (v) => { const s = String(v == null ? '' : v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const short = (r) => String(r.text || r.imageUrl || '(blank)').replace(/\s+/g, ' ').slice(0, 60);

/* keys already in the live collection */
const existing = new Set();
if (fs.existsSync(LIVE_CSV)) parseCsv(fs.readFileSync(LIVE_CSV, 'utf8')).slice(1).forEach((r) => r[0] && existing.add(r[0].trim()));
if (fs.existsSync(FIXTURE)) {
  const pc = JSON.parse(fs.readFileSync(FIXTURE, 'utf8')).pageContent;
  (Array.isArray(pc) ? pc.map((r) => r.contentKey) : Object.keys(pc || {})).forEach((k) => k && existing.add(k));
}

if (!fs.existsSync(MANIFEST)) { console.error('No manifests at ' + MANIFEST); process.exit(1); }
const files = fs.readdirSync(MANIFEST).filter((f) => f.endsWith('.json')).sort();
const byKey = new Map();
const problems = [];
let total = 0;

files.forEach((f) => {
  let list;
  try { list = JSON.parse(fs.readFileSync(path.join(MANIFEST, f), 'utf8')); }
  catch (e) { problems.push(f + ': invalid JSON (' + e.message + ')'); return; }
  if (!Array.isArray(list)) { problems.push(f + ': not an array'); return; }
  list.forEach((r, i) => {
    total++;
    const k = String(r.contentKey || '').trim();
    if (!/^[a-z0-9]+(\.[a-zA-Z0-9]+)+$/.test(k)) { problems.push(f + '[' + i + ']: bad key "' + k + '"'); return; }
    if (byKey.has(k)) {
      const prev = byKey.get(k);
      prev._files.push(f);
      if ((prev.text || '') !== (r.text || '') || (prev.imageUrl || '') !== (r.imageUrl || '')) {
        prev._conflict = true;
        prev._variants.push(f.replace('.json', '') + ': "' + short(r) + '"');
      }
      return;
    }
    byKey.set(k, Object.assign({}, r, {
      contentKey: k, _files: [f], _existing: existing.has(k), _conflict: false,
      _variants: [f.replace('.json', '') + ': "' + short(r) + '"']
    }));
  });
});

const all = Array.from(byKey.values()).sort((a, b) => a.contentKey.localeCompare(b.contentKey));

/* A key can be used by an element whose manifest does not list it (for example a
   shared site.* label). Its default on that page is unknown, so importing a row
   could change that page: treat it as shared and leave it out of the CSV. */
const CE_DIR = path.join(ROOT, 'files2', 'arise-fixed-2026-09-14', 'custom-elements');
const usage = {};
fs.readdirSync(CE_DIR).filter((f) => /^arise-.*\.js$/.test(f)).forEach((f) => {
  const src = fs.readFileSync(path.join(CE_DIR, f), 'utf8');
  const re = /data-c[ki]="([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) (usage[m[1]] = usage[m[1]] || new Set()).add(f.replace(/\.js$/, ''));
});
all.forEach((r) => {
  const listed = new Set(r._files.map((f) => f.replace(/\.json$/, '')));
  const missing = Array.from(usage[r.contentKey] || []).filter((u) => !listed.has(u));
  if (missing.length && !r._existing) {
    r._conflict = true;
    r._variants.push(missing.join(', ') + ': uses this key, default not listed');
  }
});

const fresh = all.filter((r) => !r._existing && !r._conflict && (r.text || r.imageUrl));
const shared = all.filter((r) => !r._existing && r._conflict);
const blank = all.filter((r) => !r._existing && !r._conflict && !r.text && !r.imageUrl);

const header = ['contentKey', 'page', 'label', 'text', 'imageUrl', 'image', 'where'];
const csv = [header.join(',')].concat(fresh.map((r) => [r.contentKey, r.page, r.label, r.text, r.imageUrl || '', '', r.where].map(csvCell).join(','))).join('\r\n') + '\r\n';
fs.writeFileSync(path.join(CMS, 'PageContent-new-rows.csv'), csv);
fs.writeFileSync(path.join(CMS, 'PageContent-new-rows.json'), JSON.stringify(fresh.map((r) => ({ contentKey: r.contentKey, page: r.page, label: r.label, text: r.text, imageUrl: r.imageUrl || '', where: r.where })), null, 1));

const status = (r) => r._existing ? 'in CMS' : r._conflict ? 'shared, not imported' : (r.text || r.imageUrl) ? 'new' : 'blank, not imported';
const pages = {};
all.forEach((r) => { (pages[r.page || '?'] = pages[r.page || '?'] || []).push(r); });
let md = '# Page Content keys — every editable text and image\n\n' +
  'Generated ' + new Date().toISOString().slice(0, 10) + ' from the element hook manifests.\n\n' +
  '- **new** — in `PageContent-new-rows.csv`; importing it adds the row with the text the page already shows.\n' +
  '- **in CMS** — the row already exists; edit it as usual.\n' +
  '- **shared, not imported** — several pages use this key with different built-in text (see the list at the end). ' +
  'Add a row only if you want the same text on all of those pages.\n' +
  '- **blank, not imported** — nothing shows until you add a row (for example an optional photo).\n\n' +
  'Totals: ' + all.length + ' keys · ' + fresh.length + ' new · ' + all.filter((r) => r._existing).length + ' already in CMS · ' +
  shared.length + ' shared · ' + blank.length + ' blank.\n\n';
Object.keys(pages).sort().forEach((p) => {
  md += '## ' + p + ' (' + pages[p].length + ')\n\n| Key | Status | Label | Default | Where |\n|---|---|---|---|---|\n';
  pages[p].forEach((r) => {
    md += '| `' + r.contentKey + '` | ' + status(r) + ' | ' + String(r.label || '').replace(/\|/g, '/') + ' | ' +
      (r.imageUrl ? '[image]' : String(r.text || '').replace(/<br\s*\/?>/gi, ' / ').replace(/<[^>]+>/g, '').replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/&rarr;/g, '→').replace(/\|/g, '/').slice(0, 80)) +
      ' | ' + String(r.where || '').replace(/\|/g, '/').slice(0, 60) + ' |\n';
  });
  md += '\n';
});
if (shared.length) {
  md += '## Shared keys with different built-in text\n\n';
  shared.forEach((r) => { md += '- `' + r.contentKey + '` — ' + r._variants.join(' · ') + '\n'; });
  md += '\n';
}
fs.writeFileSync(path.join(CMS, 'PageContent-all-keys.md'), md);

console.log('manifests: ' + files.length + ', hook entries: ' + total + ', unique keys: ' + all.length);
console.log('  already in CMS: ' + all.filter((r) => r._existing).length + '  NEW rows (CSV): ' + fresh.length + '  shared/not imported: ' + shared.length + '  blank/not imported: ' + blank.length);
if (shared.length) console.log('  shared: ' + shared.map((r) => r.contentKey + ' [' + r._variants.join(' | ') + ']').join('\n          '));
if (blank.length) console.log('  blank: ' + blank.map((r) => r.contentKey).join(', '));
if (problems.length) { console.log('\nPROBLEMS (' + problems.length + '):\n  ' + problems.join('\n  ')); process.exit(2); }
console.log('wrote PageContent-new-rows.csv, PageContent-new-rows.json, PageContent-all-keys.md');
