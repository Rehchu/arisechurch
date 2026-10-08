/* ===========================================================================
   PAGE CODE UNIT TESTS  (node sample-site/tests/page-code.test.mjs)
   Runs every file in files2/arise-fixed-2026-09-14/page-code/ against a fake
   $w that behaves like Velo, with the backend imports mocked, and checks:
     - the element receives its data when the ID is right,
     - the element STILL receives its data when the ID is wrong (the live bug),
     - header/footer elements are not targeted by page code when the ID is wrong,
     - $w('#missing') throwing (as Velo can) does not break anything,
     - masterPage.js sends data-content to every custom element,
     - Past Sermons sets the series band without the old .length guard.
   Zero dependencies.
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const CODE = path.join(ROOT, 'files2', 'arise-fixed-2026-09-14', 'page-code');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'arise-pagecode-'));

/* ---- backend mocks: every getter returns a small recognisable payload ---- */
fs.writeFileSync(path.join(TMP, 'content.mjs'), `
export const getPageContent = async () => ({ 'site.tagline': { text: '#YouBelongHere', image: '' } });
export const getLeaders = async () => [{ name: 'L' }];
export const getMinistries = async () => [{ title: 'M' }];
export const getConnectGroups = async () => [];
export const getCreatives = async () => ({ departments: [{ name: 'D', slug: 'd' }], members: [{ name: 'X', department: 'D' }] });
export const getServePositions = async () => [{ title: 'P1' }, { title: 'P2' }];
export const getHomeSettings = async () => ({ videoId: 'v', heading: 'This Is Arise' });`);
fs.writeFileSync(path.join(TMP, 'gallery.mjs'), `export const getProjectPhotos = async (id) => [{ src: 'https://x/' + id + '.jpg', alt: 'a' }];`);
fs.writeFileSync(path.join(TMP, 'classes.mjs'), `export const getPrograms = async () => [{ title: 'C' }];`);
fs.writeFileSync(path.join(TMP, 'events.mjs'), `export const getEvents = async () => ({ upcoming: [{ id: 'e' }], past: [] });`);
fs.writeFileSync(path.join(TMP, 'youtube.mjs'), `export const getLiveVideoId = async () => globalThis.__live || null; export const getCurrentSeries = async () => null; export const getLatestShorts = async () => globalThis.__shorts || [];`);
fs.writeFileSync(path.join(TMP, 'wixdata.mjs'), `
export default { query: () => { const api = { eq() { return api; }, limit() { return api; },
  async find() { return { items: globalThis.__series ? [globalThis.__series] : [] }; } }; return api; } };`);

/* ---- fake Velo $w ---- */
function makeSite({ pageId, throwOnMissing }) {
  const header = { id: 'SITE_HEADER', type: '$w.Header', parent: null };
  const footer = { id: 'SITE_FOOTER', type: '$w.Footer', parent: null };
  const page = { id: 'page1', type: '$w.Page', parent: null };
  const mk = (id, parent) => ({ id, type: '$w.CustomElement', parent, attrs: {}, setAttribute(n, v) { this.attrs[n] = v; } });
  const els = [mk('customElementHeader', header), mk(pageId, page), mk('customElementFooter', footer)];
  const $w = (sel) => {
    if (sel === 'CustomElement') return els.slice();
    if (sel.charAt(0) === '#') {
      const e = els.find((x) => x.id === sel.slice(1));
      if (e) return e;
      if (throwOnMissing) throw new Error('element ' + sel + ' does not exist on this page');
      return {};
    }
    return [];
  };
  let ready;
  $w.onReady = (fn) => { ready = fn; };
  return { $w, els, page: els[1], header: els[0], footer: els[2], run: () => ready() };
}

const MAP = [
  [/from 'backend\/content\.web'/g, "from './content.mjs'"],
  [/from 'backend\/gallery\.web'/g, "from './gallery.mjs'"],
  [/from 'backend\/classes\.web'/g, "from './classes.mjs'"],
  [/from 'backend\/events\.web'/g, "from './events.mjs'"],
  [/from 'backend\/youtube\.jsw'/g, "from './youtube.mjs'"],
  [/from 'wix-data'/g, "from './wixdata.mjs'"],
];
let n = 0;
async function load(file, site) {
  let src = fs.readFileSync(path.join(CODE, file), 'utf8');
  MAP.forEach(([re, to]) => { src = src.replace(re, to); });
  src = 'const $w = globalThis.__$w;\n' + src;
  const out = path.join(TMP, 'page' + (n++) + '.mjs');
  fs.writeFileSync(out, src);
  globalThis.__$w = site.$w;
  await import(pathToFileURL(out).href);
  const p = site.run();
  return p;
}
const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const quiet = () => { const o = { log: console.log, warn: console.warn }; const warns = []; console.log = () => {}; console.warn = (...a) => warns.push(a.join(' ')); return { warns, restore() { console.log = o.log; console.warn = o.warn; } }; };

let passed = 0, failed = 0;
async function test(name, fn) {
  const q = quiet();
  try { await fn(q.warns); q.restore(); passed++; console.log('  ok   ' + name); }
  catch (e) { q.restore(); failed++; console.log('  FAIL ' + name + '\n       ' + (e && e.message)); }
}

/* expected attributes per page file */
const PAGES = {
  'Home.js': { id: 'customElement1', attrs: ['data-content', 'data-culture', 'data-news'] },
  'Arise Church Alexandria.js': { id: 'customElement5', attrs: ['data-content'] },
  'Connect Groups.js': { id: 'customElement1', attrs: ['data-content', 'data-groups'] },
  'Creative Arts.js': { id: 'customElement5', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Praise and Worship.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Musicians.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Production.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Sound.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Media.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Social Media and Content.js': { id: 'customElement1', attrs: ['data-content', 'data-depts', 'data-members'] },
  'Classes.js': { id: 'customElement5', attrs: ['data-content', 'data-classes'] },
  'Ministries.js': { id: 'customElement1', attrs: ['data-ministries'] },
  'Events.js': { id: 'customElement1', attrs: ['data-events'] },
  'Contact.js': { id: 'customElement1', attrs: ['data-content'] },
  'Sign Up to Serve.js': { id: 'customElement1', attrs: ['data-content', 'data-positions'] },
  'Meet our Leaders.js': { id: 'customElement1', attrs: ['data-leaders'] },
  "Children's Ministry.js": { id: 'customElement1', attrs: ['data-content', 'data-photos'] },
  'Youth Ministry.js': { id: 'customElement1', attrs: ['data-content', 'data-photos'] },
  'Outreach.js': { id: 'customElement1', attrs: ['data-content', 'data-photos'] },
  'Lead Network.js': { id: 'customElement1', attrs: ['data-content', 'data-photos'] },
};

const onDisk = fs.readdirSync(CODE).filter((f) => f.endsWith('.js') && f !== 'masterPage.js' && f !== 'Past Sermons.js').sort();
await test('every page-code file on disk has an expectation (nothing untested)', () => {
  assert.deepEqual(onDisk, Object.keys(PAGES).sort());
});

for (const [file, exp] of Object.entries(PAGES)) {
  console.log(file);
  await test('right ID: element gets ' + exp.attrs.join(', '), async () => {
    const site = makeSite({ pageId: exp.id });
    await load(file, site); await settle(50);
    exp.attrs.forEach((a) => assert.ok(site.page.attrs[a] !== undefined, 'missing ' + a));
    exp.attrs.forEach((a) => JSON.parse(site.page.attrs[a]));
    assert.deepEqual(Object.keys(site.header.attrs), [], 'header was targeted');
  });
  await test('WRONG ID (live bug): element still gets its data; header/footer untouched; miss is silent-free', async () => {
    const site = makeSite({ pageId: exp.id === 'customElement1' ? 'customElement5' : 'customElement1', throwOnMissing: true });
    await load(file, site); await settle(50);
    exp.attrs.forEach((a) => assert.ok(site.page.attrs[a] !== undefined, 'missing ' + a));
    assert.deepEqual(Object.keys(site.header.attrs), [], 'header was targeted');
    assert.deepEqual(Object.keys(site.footer.attrs), [], 'footer was targeted');
  });
}

console.log('Past Sermons.js');
await test('series band from the CMS row, no .length guard, header untouched', async () => {
  globalThis.__series = { settingKey: 'sermonSeries', seriesActive: true, seriesTitle: 'The Kingdom', seriesLine: 'Culture of Giving', seriesLink: 'https://y', seriesButton: 'Watch' };
  globalThis.__shorts = [{ id: 'm_bDPBzAGUE', title: 'Declare', url: 'https://www.youtube.com/shorts/m_bDPBzAGUE', thumb: 'https://i.ytimg.com/vi/m_bDPBzAGUE/frame0.jpg' }];
  const site = makeSite({ pageId: 'customElement1' });
  await load('Past Sermons.js', site); await settle(50);
  assert.equal(site.page.attrs['data-series-active'], 'true');
  assert.equal(site.page.attrs['data-series-title'], 'The Kingdom');
  assert.equal(site.page.attrs['data-series-button'], 'Watch');
  assert.equal(JSON.parse(site.page.attrs['data-clips'])[0].id, 'm_bDPBzAGUE');
  assert.deepEqual(Object.keys(site.header.attrs), []);
});
await test('wrong ID + live stream: still lands, live id set; no Shorts -> data-clips not set', async () => {
  globalThis.__series = null; globalThis.__live = 'abcdefghijk'; globalThis.__shorts = [];
  const site = makeSite({ pageId: 'customElement7', throwOnMissing: true });
  await load('Past Sermons.js', site); await settle(80);
  assert.equal(site.page.attrs['data-series-active'], 'false');
  assert.equal(site.page.attrs['data-live-video'], 'abcdefghijk');
  assert.equal(site.page.attrs['data-clips'], undefined);
});

console.log('masterPage.js');
await test('sends data-content to header, page element and footer', async () => {
  const site = makeSite({ pageId: 'customElement9' });
  await load('masterPage.js', site); await settle(50);
  site.els.forEach((e) => assert.ok(e.attrs['data-content'], 'missing on ' + e.id));
  assert.equal(JSON.parse(site.header.attrs['data-content'])['site.tagline'].text, '#YouBelongHere');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
