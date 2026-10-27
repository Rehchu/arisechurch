/* ===========================================================================
   PAGE CODE UNIT TESTS  (node sample-site/tests/page-code.test.mjs)
   Runs every file in files2/arise-fixed-2026-09-14/page-code/ against a fake
   $w that behaves like Velo, with the backend imports mocked, and checks:
     - the element receives its data when the ID is right,
     - the element STILL receives its data when the ID is wrong (the live bug),
     - header/footer elements are not targeted by page code when the ID is wrong,
     - $w('#missing') throwing (as Velo can) does not break anything,
     - page files no longer load or send data-content (2026-09-15 speed pass:
       masterPage.js is the only file that loads the Page Content map),
     - every backend call on a page starts without waiting for the others, and
       each attribute lands as soon as its own call answers,
     - masterPage.js sends data-content to every custom element, keeps looking
       for late elements and retries a setAttribute that failed,
     - Past Sermons sets the series band without the old .length guard, starts
       the series lookup, Shorts and first live check together, and a CMS
       series row still wins over the automatic YouTube series,
     - Past Sermons (Media page, 2026-10-27) sends the newest service, the
       newest Glory Night and the playlists, each as soon as it answers, and
       sends nothing for the ones YouTube cannot answer.
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

/* ---- backend mocks: every getter returns a small recognisable payload ----
   mock(name, make) records each call in globalThis.__calls the moment it is
   made, and (when a test holds that name in globalThis.__gates) does not answer
   until the test releases it. That is how the tests prove calls run side by side. */
globalThis.__calls = [];
globalThis.__gates = null;
fs.writeFileSync(path.join(TMP, 'mock.mjs'), `
export function mock(name, make) {
  return async (...args) => {
    globalThis.__calls.push(name);
    const gate = globalThis.__gates && globalThis.__gates[name];
    if (gate) await gate;
    return make(...args);
  };
}`);
fs.writeFileSync(path.join(TMP, 'content.mjs'), `import { mock } from './mock.mjs';
export const getPageContent = mock('getPageContent', () => ({ 'site.tagline': { text: '#YouBelongHere', image: '' } }));
export const getLeaders = mock('getLeaders', () => [{ name: 'L' }]);
export const getMinistries = mock('getMinistries', () => [{ title: 'M' }]);
export const getConnectGroups = mock('getConnectGroups', () => []);
export const getCreatives = mock('getCreatives', () => ({ departments: [{ name: 'D', slug: 'd' }], members: [{ name: 'X', department: 'D' }] }));
export const getServePositions = mock('getServePositions', () => [{ title: 'P1' }, { title: 'P2' }]);
export const getHomeSettings = mock('getHomeSettings', () => ({ videoId: 'v', heading: 'This Is Arise' }));`);
fs.writeFileSync(path.join(TMP, 'gallery.mjs'), `import { mock } from './mock.mjs';
export const getProjectPhotos = mock('getProjectPhotos', (id) => [{ src: 'https://x/' + id + '.jpg', alt: 'a' }]);`);
fs.writeFileSync(path.join(TMP, 'classes.mjs'), `import { mock } from './mock.mjs';
export const getPrograms = mock('getPrograms', () => [{ title: 'C' }]);`);
fs.writeFileSync(path.join(TMP, 'events.mjs'), `import { mock } from './mock.mjs';
export const getEvents = mock('getEvents', () => ({ upcoming: [{ id: 'e' }], past: [] }));`);
fs.writeFileSync(path.join(TMP, 'youtube.mjs'), `import { mock } from './mock.mjs';
export const getLiveVideoId = mock('getLiveVideoId', () => globalThis.__live || null);
export const getCurrentSeries = mock('getCurrentSeries', () => globalThis.__auto || null);
export const getLatestShorts = mock('getLatestShorts', () => globalThis.__shorts || []);
export const getLatestVideo = mock('getLatestVideo', () => globalThis.__latest || null);
export const getLatestGloryNight = mock('getLatestGloryNight', () => globalThis.__glory || null);
export const getPlaylists = mock('getPlaylists', () => globalThis.__playlists || []);`);
fs.writeFileSync(path.join(TMP, 'wixdata.mjs'), `import { mock } from './mock.mjs';
const find = mock('wixData.find', () => ({ items: globalThis.__series ? [globalThis.__series] : [] }));
export default { query: () => { const api = { eq() { return api; }, limit() { return api; }, find }; return api; } };`);

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
  return { $w, els, mk, pageParent: page, page: els[1], header: els[0], footer: els[2], run: () => ready() };
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
/* prepare: load the file (registers onReady) without running it; clears the call log. */
async function prepare(file, site) {
  let src = fs.readFileSync(path.join(CODE, file), 'utf8');
  MAP.forEach(([re, to]) => { src = src.replace(re, to); });
  src = 'const $w = globalThis.__$w;\n' + src;
  const out = path.join(TMP, 'page' + (n++) + '.mjs');
  fs.writeFileSync(out, src);
  globalThis.__$w = site.$w;
  globalThis.__calls = [];
  await import(pathToFileURL(out).href);
}
/* load: prepare, then run onReady and wait for it to finish. */
async function load(file, site) {
  await prepare(file, site);
  const p = site.run();
  return p;
}
/* hold: the named backend calls do not answer until released. */
function hold(names) {
  const open = {};
  globalThis.__gates = {};
  names.forEach((nm) => { globalThis.__gates[nm] = new Promise((r) => { open[nm] = r; }); });
  return {
    release: (nm) => open[nm](),
    end: () => { names.forEach((nm) => open[nm]()); globalThis.__gates = null; }
  };
}
const settle = (ms) => new Promise((r) => setTimeout(r, ms));
const quiet = () => { const o = { log: console.log, warn: console.warn }; const warns = []; console.log = () => {}; console.warn = (...a) => warns.push(a.join(' ')); return { warns, restore() { console.log = o.log; console.warn = o.warn; } }; };

let passed = 0, failed = 0;
async function test(name, fn) {
  const q = quiet();
  try { await fn(q.warns); q.restore(); passed++; console.log('  ok   ' + name); }
  catch (e) { q.restore(); failed++; console.log('  FAIL ' + name + '\n       ' + (e && e.message)); }
}

/* expected attributes per page file (data-content is NOT here: masterPage.js sends it)
   calls: backend call -> the attributes that call feeds */
const creative = { id: 'customElement1', attrs: ['data-depts', 'data-members'], calls: { getCreatives: ['data-depts', 'data-members'] } };
const gallery = { id: 'customElement1', attrs: ['data-photos'], calls: { getProjectPhotos: ['data-photos'] } };
const PAGES = {
  'Home.js': { id: 'customElement1', attrs: ['data-culture', 'data-news'], calls: { getHomeSettings: ['data-culture'], getProjectPhotos: ['data-news'] } },
  'Arise Church Alexandria.js': { id: 'customElement5', attrs: [], calls: {} },
  'Connect Groups.js': { id: 'customElement1', attrs: ['data-groups'], calls: { getConnectGroups: ['data-groups'] } },
  'Creative Arts.js': Object.assign({}, creative, { id: 'customElement5' }),
  'Praise and Worship.js': creative,
  'Musicians.js': creative,
  'Production.js': creative,
  'Sound.js': creative,
  'Media.js': creative,
  'Social Media and Content.js': creative,
  'Classes.js': { id: 'customElement5', attrs: ['data-classes'], calls: { getPrograms: ['data-classes'] } },
  'Ministries.js': { id: 'customElement1', attrs: ['data-ministries'], calls: { getMinistries: ['data-ministries'] } },
  'Events.js': { id: 'customElement1', attrs: ['data-events'], calls: { getEvents: ['data-events'] } },
  'Contact.js': { id: 'customElement1', attrs: [], calls: {} },
  'Sign Up to Serve.js': { id: 'customElement1', attrs: ['data-positions'], calls: { getServePositions: ['data-positions'] } },
  'Meet our Leaders.js': { id: 'customElement1', attrs: ['data-leaders'], calls: { getLeaders: ['data-leaders'] } },
  "Children's Ministry.js": gallery,
  'Youth Ministry.js': gallery,
  'Outreach.js': gallery,
  'Lead Network.js': gallery,
};

const onDisk = fs.readdirSync(CODE).filter((f) => f.endsWith('.js') && f !== 'masterPage.js' && f !== 'Past Sermons.js').sort();
await test('every page-code file on disk has an expectation (nothing untested)', () => {
  assert.deepEqual(onDisk, Object.keys(PAGES).sort());
});

for (const [file, exp] of Object.entries(PAGES)) {
  console.log(file);
  await test('right ID: element gets ' + (exp.attrs.join(', ') || 'nothing from page code'), async () => {
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
  await test('does not load or send data-content (masterPage.js does that, once)', async () => {
    const src = fs.readFileSync(path.join(CODE, file), 'utf8');
    assert.ok(!/getPageContent/.test(src), 'page file still imports or calls getPageContent');
    assert.ok(!/ariseSet\(\s*'data-content'/.test(src), 'page file still sets data-content');
    const site = makeSite({ pageId: exp.id });
    await load(file, site); await settle(50);
    assert.equal(site.page.attrs['data-content'], undefined, 'page code set data-content');
    assert.equal(globalThis.__calls.indexOf('getPageContent'), -1, 'page code called getPageContent');
  });
  await test('backend calls start together; each attribute lands as soon as its own call answers', async () => {
    const names = Object.keys(exp.calls);
    const gates = hold(names);
    try {
      const site = makeSite({ pageId: exp.id });
      await prepare(file, site);
      let finished = false;
      const ready = Promise.resolve(site.run()).then(() => { finished = true; });
      await settle(20);
      assert.deepEqual(globalThis.__calls.slice().sort(), names.slice().sort(), 'not every call started while the others were still waiting');
      assert.deepEqual(Object.keys(site.page.attrs), [], 'an attribute was set before its call answered');
      const pending = names.slice().reverse();   // answer in the opposite order to the code
      while (pending.length) {
        assert.equal(finished, false, 'onReady finished while a call was still waiting');
        const nm = pending.shift();
        gates.release(nm); await settle(20);
        exp.calls[nm].forEach((a) => assert.ok(site.page.attrs[a] !== undefined, a + ' not set after ' + nm + ' answered'));
        pending.forEach((other) => exp.calls[other].forEach((a) => assert.equal(site.page.attrs[a], undefined, a + ' set before ' + other + ' answered')));
      }
      await ready;
      assert.equal(finished, true);
    } finally { gates.end(); }
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
await test('does not load or send data-content (masterPage.js does that, once)', async () => {
  const src = fs.readFileSync(path.join(CODE, 'Past Sermons.js'), 'utf8');
  assert.ok(!/getPageContent/.test(src));
  assert.ok(!/ariseSet\(\s*'data-content'/.test(src));
});
await test('series lookup, Shorts and first live check start together; each lands on its own; CMS row wins', async () => {
  globalThis.__series = { settingKey: 'sermonSeries', seriesActive: true, seriesTitle: 'The Kingdom', seriesLine: 'Culture of Giving', seriesLink: 'https://y', seriesButton: 'Watch' };
  globalThis.__shorts = [{ id: 's1', title: 'S' }]; globalThis.__live = 'livelivel11';
  globalThis.__auto = { title: 'Auto Series', url: 'https://www.youtube.com/playlist?list=x' };
  const gates = hold(['wixData.find', 'getLatestShorts', 'getLiveVideoId']);
  try {
    const site = makeSite({ pageId: 'customElement1' });
    await prepare('Past Sermons.js', site);
    let finished = false;
    const ready = Promise.resolve(site.run()).then(() => { finished = true; });
    await settle(20);
    assert.deepEqual(globalThis.__calls.slice().sort(), ['getLatestGloryNight', 'getLatestShorts', 'getLatestVideo', 'getLiveVideoId', 'getPlaylists', 'wixData.find'], 'not every lookup started at once');
    gates.release('getLiveVideoId'); await settle(20);
    assert.equal(site.page.attrs['data-live-video'], 'livelivel11', 'live id waited for the other lookups');
    assert.equal(site.page.attrs['data-series-active'], undefined);
    assert.equal(site.page.attrs['data-clips'], undefined);
    gates.release('getLatestShorts'); await settle(20);
    assert.equal(JSON.parse(site.page.attrs['data-clips'])[0].id, 's1', 'Shorts waited for the series lookup');
    assert.equal(site.page.attrs['data-series-active'], undefined);
    assert.equal(finished, false, 'onReady finished before the series band answered');
    gates.release('wixData.find'); await ready; await settle(20);
    assert.equal(site.page.attrs['data-series-active'], 'true');
    assert.equal(site.page.attrs['data-series-title'], 'The Kingdom', 'the CMS row must win over the automatic series');
    assert.equal(globalThis.__calls.indexOf('getCurrentSeries'), -1, 'automatic series looked up although the CMS row is active');
  } finally { gates.end(); globalThis.__auto = null; }
});
await test('no CMS row: newest YouTube series fills the band; not live -> no live attribute', async () => {
  globalThis.__series = null; globalThis.__shorts = []; globalThis.__live = null;
  globalThis.__auto = { title: 'Auto Series', url: 'https://www.youtube.com/playlist?list=x' };
  try {
    const site = makeSite({ pageId: 'customElement1' });
    await load('Past Sermons.js', site); await settle(50);
    assert.equal(site.page.attrs['data-series-active'], 'true');
    assert.equal(site.page.attrs['data-series-title'], 'Auto Series');
    assert.equal(site.page.attrs['data-series-button'], 'Watch the Series');
    assert.equal(site.page.attrs['data-live-video'], undefined);
  } finally { globalThis.__auto = null; }
});

await test('Media page: newest service, newest Glory Night and playlists land as JSON, each on its own', async () => {
  globalThis.__series = null; globalThis.__shorts = []; globalThis.__live = null;
  globalThis.__latest = { id: 'sun26Oct001', title: 'Sunday Morning Service', when: 'Streamed 1 day ago', url: 'https://www.youtube.com/watch?v=sun26Oct001' };
  globalThis.__glory = { id: 'glory20Oct1', title: 'Monday Night Glory Night', when: 'Streamed 6 days ago', url: 'https://www.youtube.com/watch?v=glory20Oct1&list=PLYhdT3QigNmY' };
  globalThis.__playlists = [{ id: 'PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI', title: 'Sunday Sermons', count: 113, thumb: 'https://i.ytimg.com/vi/oYSMY9VJk1I/hqdefault.jpg' }];
  const gates = hold(['getLatestVideo', 'getLatestGloryNight', 'getPlaylists']);
  try {
    const site = makeSite({ pageId: 'customElement1' });
    await prepare('Past Sermons.js', site);
    let finished = false;
    const ready = Promise.resolve(site.run()).then(() => { finished = true; });
    await settle(30);
    assert.equal(site.page.attrs['data-latest-video'], undefined);
    assert.equal(site.page.attrs['data-glory-video'], undefined);
    assert.equal(site.page.attrs['data-playlists'], undefined);
    gates.release('getPlaylists'); await settle(20);
    assert.equal(JSON.parse(site.page.attrs['data-playlists'])[0].title, 'Sunday Sermons');
    assert.equal(site.page.attrs['data-latest-video'], undefined, 'latest service waited for the playlists');
    gates.release('getLatestGloryNight'); await settle(20);
    assert.equal(JSON.parse(site.page.attrs['data-glory-video']).id, 'glory20Oct1');
    assert.equal(finished, false, 'onReady finished before the latest service answered');
    gates.release('getLatestVideo'); await ready; await settle(20);
    assert.equal(JSON.parse(site.page.attrs['data-latest-video']).id, 'sun26Oct001');
    assert.deepEqual(Object.keys(site.header.attrs), [], 'header was targeted');
  } finally { gates.end(); globalThis.__latest = null; globalThis.__glory = null; globalThis.__playlists = null; }
});
await test('Media page: when YouTube answers nothing, none of the three attributes is set (element keeps its defaults)', async () => {
  globalThis.__series = null; globalThis.__shorts = []; globalThis.__live = null;
  globalThis.__latest = null; globalThis.__glory = null; globalThis.__playlists = [];
  const site = makeSite({ pageId: 'customElement3', throwOnMissing: true });
  await load('Past Sermons.js', site); await settle(50);
  assert.equal(site.page.attrs['data-latest-video'], undefined);
  assert.equal(site.page.attrs['data-glory-video'], undefined);
  assert.equal(site.page.attrs['data-playlists'], undefined);
  assert.equal(site.page.attrs['data-series-active'], 'false');
});

console.log('masterPage.js');
await test('sends data-content to header, page element and footer', async () => {
  const site = makeSite({ pageId: 'customElement9' });
  await load('masterPage.js', site); await settle(50);
  site.els.forEach((e) => assert.ok(e.attrs['data-content'], 'missing on ' + e.id));
  assert.equal(JSON.parse(site.header.attrs['data-content'])['site.tagline'].text, '#YouBelongHere');
  assert.equal(globalThis.__calls.filter((c) => c === 'getPageContent').length, 1, 'Page Content map loaded more than once');
});
await test('masterPage.js is the only page-code file that loads getPageContent', () => {
  const users = fs.readdirSync(CODE).filter((f) => f.endsWith('.js') && /getPageContent/.test(fs.readFileSync(path.join(CODE, f), 'utf8')));
  assert.deepEqual(users, ['masterPage.js']);
});
await test('a setAttribute that throws is retried on the next pass, not marked done', async () => {
  const site = makeSite({ pageId: 'customElement9' });
  let tries = 0;
  const orig = site.footer.setAttribute;
  site.footer.setAttribute = function (nm, v) { tries++; if (tries === 1) throw new Error('not ready yet'); return orig.call(this, nm, v); };
  await load('masterPage.js', site); await settle(700);
  assert.ok(tries >= 2, 'setAttribute was not tried again');
  assert.ok(site.footer.attrs['data-content'], 'footer never got data-content after a failed first try');
  assert.ok(site.page.attrs['data-content'] && site.header.attrs['data-content']);
});
await test('keeps looking for longer: an element that appears after 3 seconds still gets data-content', async () => {
  const site = makeSite({ pageId: 'customElement9' });
  await load('masterPage.js', site);
  await settle(3200);
  const late = site.mk('customElementLate', site.pageParent);
  site.els.push(late);
  await settle(700);
  assert.ok(late.attrs['data-content'], 'late element missed');
  assert.equal(globalThis.__calls.filter((c) => c === 'getPageContent').length, 1);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
