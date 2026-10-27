/* ===========================================================================
   BACKEND UNIT TESTS  (node sample-site/tests/backend.test.mjs)
   Runs the real files in files2/arise-fixed-2026-09-14/backend/ under node by
   swapping the Wix modules for small mocks, and checks the behaviour the audit
   cared about: image conversion, event sorting and CTA states, form validation
   and the order of side effects, and the YouTube readers against real pages
   saved from the channel (sample-site/tests/fixtures/). Zero dependencies.
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const BACKEND = path.join(ROOT, 'files2', 'arise-fixed-2026-09-14', 'backend');
const FIXTURES = path.join(ROOT, 'sample-site', 'tests', 'fixtures');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'arise-backend-'));

/* ---------- mocks ---------- */
const state = { inserted: [], contacts: [], triggers: [], events: [], programs: [], items: {}, collections: {}, fetches: [] };
fs.writeFileSync(path.join(TMP, 'wix-web-module.mjs'), `
export const Permissions = { Anyone: 'Anyone' };
export const webMethod = (perm, fn) => fn;`);
fs.writeFileSync(path.join(TMP, 'wix-data.mjs'), `
const state = globalThis.__state;
function q(c) {
  const st = { c, filters: [], lim: 50 };
  const api = {
    eq(f, v) { st.filters.push([f, v]); return api; },
    ascending() { return api; },
    limit(n) { st.lim = n; return api; },
    async find() {
      let items = (state.collections[c] || []).slice();
      st.filters.forEach(([f, v]) => { items = items.filter((r) => r[f] === v); });
      const size = Math.min(st.lim, 1000);   // Wix caps one query at 1000 items
      const page = (skip) => ({
        items: items.slice(skip, skip + size),
        hasNext: () => skip + size < items.length,
        next: async () => page(skip + size)
      });
      return page(0);
    }
  };
  return api;
}
export default { query: q, insert: async (c, r) => { state.inserted.push([c, r]); return r; } };`);
fs.writeFileSync(path.join(TMP, 'essentials.mjs'), `export const auth = { elevate: (fn) => fn };`);
fs.writeFileSync(path.join(TMP, 'events.mjs'), `
const state = globalThis.__state;
export const wixEventsV2 = { queryEvents: () => { const api = { ne() { return api; }, limit() { return api; }, async find() { return { items: state.events }; } }; return api; } };`);
fs.writeFileSync(path.join(TMP, 'online-programs.mjs'), `
const state = globalThis.__state;
export const programs = { queryPrograms: () => { const api = { eq() { return api; }, async find() { return { items: state.programs }; } }; return api; } };`);
fs.writeFileSync(path.join(TMP, 'portfolio.mjs'), `
const state = globalThis.__state;
export const projectItems = { listProjectItems: async (id) => ({ items: state.items[id] || [] }) };`);
fs.writeFileSync(path.join(TMP, 'wix-http-functions.mjs'), `
const r = (status) => (o) => Object.assign({ status }, o);
export const ok = r(200), badRequest = r(400), serverError = r(500);`);
fs.writeFileSync(path.join(TMP, 'wix-crm-backend.mjs'), `
const state = globalThis.__state;
export const contacts = { appendOrCreateContact: async (c) => { state.contacts.push(c); return { contactId: 'c-' + state.contacts.length }; } };`);
fs.writeFileSync(path.join(TMP, 'automations.mjs'), `
const state = globalThis.__state;
export const customTrigger = { runTrigger: async (o) => { state.triggers.push(o); } };`);
/* wix-fetch: answers YouTube URLs with the saved channel pages.
   globalThis.__ytMode: 'offline' (503), 'desktop' (real desktop pages),
   'mobile' (the mobile page YouTube sends to a generic User-Agent),
   'live-now' (the saved upcoming-stream page edited to a stream playing now).
   The Live tab (/streams) and the Glory Nights playlist page are synthetic
   pages in YouTube's current shape (youtube-streams*.html,
   youtube-playlist-glory*.html); globalThis.__gloryPage picks the playlist page
   ('404' makes it fail). */
fs.writeFileSync(path.join(TMP, 'wix-fetch.mjs'), `
import fs from 'node:fs';
import path from 'node:path';
const FIX = ${JSON.stringify(FIXTURES)};
const read = (f) => fs.readFileSync(path.join(FIX, f), 'utf8');
export const fetch = async (url, opts) => {
  globalThis.__state.fetches.push({ url: url, headers: (opts && opts.headers) || {} });
  const mode = globalThis.__ytMode || 'offline';
  const reply = (body) => ({ ok: true, status: 200, text: async () => body });
  if (mode === 'offline') return { ok: false, status: 503, text: async () => '' };
  if (mode === 'mobile') return reply(read('youtube-shorts-mobile.html'));
  if (url.indexOf('/shorts') > -1) return reply(read('youtube-shorts.html'));
  if (url.indexOf('/playlists') > -1) return reply(read('youtube-playlists.html'));
  if (url.indexOf('/streams') > -1) return reply(read(mode === 'live-now' ? 'youtube-streams-live.html' : 'youtube-streams.html'));
  if (url.indexOf('playlist?list=') > -1) {
    if (globalThis.__gloryPage === '404') return { ok: false, status: 404, text: async () => '' };
    return reply(read(globalThis.__gloryPage || 'youtube-playlist-glory.html'));
  }
  if (url.indexOf('/live') > -1) {
    let html = read('youtube-live-upcoming.html');
    if (mode === 'live-now') {
      html = html.split('"status":"LIVE_STREAM_OFFLINE"').join('"status":"OK"').split('"isUpcoming":true').join('"isUpcoming":false');
      const at = html.indexOf('"videoDetails":{');
      if (html.slice(at, at + 4000).indexOf('"isLive":true') < 0) html = html.slice(0, at) + '"videoDetails":{"isLive":true,' + html.slice(at + 16);
    }
    return reply(html);
  }
  return { ok: false, status: 404, text: async () => '' };
};`);
globalThis.__state = state;

const MAP = {
  "'wix-web-module'": './wix-web-module.mjs', "'wix-data'": './wix-data.mjs', "'@wix/essentials'": './essentials.mjs',
  "'@wix/events'": './events.mjs', "'@wix/online-programs'": './online-programs.mjs', "'@wix/portfolio'": './portfolio.mjs',
  "'wix-http-functions'": './wix-http-functions.mjs', "'wix-crm-backend'": './wix-crm-backend.mjs', "'@wix/automations'": './automations.mjs',
  "'wix-fetch'": './wix-fetch.mjs'
};
/* tag gives a fresh module instance (fresh caches) for each YouTube scenario */
async function load(file, tag) {
  let src = fs.readFileSync(path.join(BACKEND, file), 'utf8');
  Object.entries(MAP).forEach(([k, v]) => { src = src.split(k).join("'" + v + "'"); });
  const out = path.join(TMP, file.replace(/\.(js|jsw)$/, '') + (tag ? '.' + tag : '') + '.mjs');
  fs.writeFileSync(out, src);
  return import(pathToFileURL(out).href);
}

let passed = 0, failed = 0;
async function test(name, fn) {
  const err = console.error, log = console.log;
  console.error = () => {}; console.log = () => {};
  try { await fn(); console.error = err; console.log = log; passed++; console.log('  ok   ' + name); }
  catch (e) { console.error = err; console.log = log; failed++; console.log('  FAIL ' + name + '\n       ' + (e && e.message)); }
}

/* ---------- content.web.js ---------- */
console.log('content.web.js');
const content = await load('content.web.js');
state.collections.PageContent = [
  { contentKey: 'site.tagline', text: '#YouBelongHere' },
  { contentKey: 'home.who.photo', image: 'wix:image://v1/1f9fa2_abc~mv2.jpg/who.jpg#originWidth=100&originHeight=100' },
  { contentKey: 'x.obj', image: { url: 'https://static.wixstatic.com/media/obj.jpg' } },
  { contentKey: 'x.legacy', imageUrl: 'https://example.com/legacy.jpg' },
  { text: 'no key -> dropped' },
];
state.collections.Leaders = [{ name: 'A', role: 'Pastor', shortBio: 'short', bio: 'long', photo: 'wix:image://v1/1f9fa2_p~mv2.jpg/p.jpg', featured: 'yes', sortOrder: 1 }, { role: 'no name' }];
state.collections.ConnectGroups = [{ title: 'G1', active: true, flyer: 'wix:image://v1/ID1/f.jpg' }, { title: 'G2', active: false }];
state.collections.HomeSettings = [{ settingKey: 'churchCulture', cultureVideo: 'wix:video://v1/VID123/culture.mp4#posterUri=1f9fa2_poster.jpg&posterWidth=1&posterHeight=1', active: true }];
await test('getPageContent returns {text,image} per key and converts wix:image', async () => {
  const m = await content.getPageContent();
  assert.deepEqual(m['site.tagline'], { text: '#YouBelongHere', image: '' });
  assert.equal(m['home.who.photo'].image, 'https://static.wixstatic.com/media/1f9fa2_abc~mv2.jpg');
  assert.equal(m['x.obj'].image, 'https://static.wixstatic.com/media/obj.jpg');
  assert.equal(m['x.legacy'].image, 'https://example.com/legacy.jpg');
  assert.equal(Object.keys(m).length, 4);
});
await test('getPageContent reads every row, not just the first 500 (571 rows after the CSV import)', async () => {
  const save = state.collections.PageContent;
  state.collections.PageContent = Array.from({ length: 1234 }, (_, i) => ({ contentKey: 'k.n' + i, text: 't' + i }));
  const m = await content.getPageContent();
  state.collections.PageContent = save;
  assert.equal(Object.keys(m).length, 1234);
  assert.equal(m['k.n1233'].text, 't1233');
});
await test('getLeaders prefers shortBio, converts photo, drops nameless rows', async () => {
  const l = await content.getLeaders();
  assert.equal(l.length, 1);
  assert.equal(l[0].bio, 'short');
  assert.equal(l[0].photo, 'https://static.wixstatic.com/media/1f9fa2_p~mv2.jpg');
  assert.equal(l[0].featured, true);
});
await test('getConnectGroups keeps only active rows and converts the flyer', async () => {
  const g = await content.getConnectGroups();
  assert.equal(g.length, 1);
  assert.equal(g[0].flyer, 'https://static.wixstatic.com/media/ID1');
});
await test('getHomeSettings extracts the video id and poster', async () => {
  const h = await content.getHomeSettings();
  assert.equal(h.videoId, 'VID123');
  assert.equal(h.poster, 'https://static.wixstatic.com/media/1f9fa2_poster.jpg');
  assert.equal(h.heading, 'This Is Arise');
  assert.equal(h.active, true);
});

/* ---------- events.web.js ---------- */
console.log('events.web.js');
const events = await load('events.web.js');
const ev = (o) => Object.assign({ _id: o.id, title: o.id, status: 'UPCOMING', slug: o.id, mainImage: 'wix:image://v1/IMG_' + o.id + '/x.jpg',
  dateAndTimeSettings: { startDate: o.start, formatted: { dateAndTime: o.f || o.start, startDate: o.start } },
  registration: o.reg || { type: 'RSVP', status: 'OPEN_RSVP' } }, o);
state.events = [
  ev({ id: 'nov', start: '2026-11-20T18:00:00Z', f: 'Nov 20' }),
  ev({ id: 'oct', start: '2026-10-30T18:00:00Z', f: 'Oct 30' }),
  ev({ id: 'sep', start: '2026-09-05T18:00:00Z', status: 'ENDED' }),
  ev({ id: 'aug', start: '2026-08-05T18:00:00Z', status: 'ENDED' }),
  ev({ id: 'sold', start: '2026-12-01T18:00:00Z', reg: { type: 'TICKETING', status: 'OPEN_TICKETS', tickets: { soldOut: true } } }),
  ev({ id: 'off', start: '2026-12-02T18:00:00Z', reg: { type: 'TICKETING', status: 'OPEN_TICKETS', registrationDisabled: true } }),
  ev({ id: 'nourl', start: '2026-12-03T18:00:00Z', slug: '', eventPageUrl: null }),
];
await test('getEvents sorts upcoming soonest-first by real date, past most-recent-first', async () => {
  const d = await events.getEvents();
  assert.deepEqual(d.upcoming.map((e) => e.id), ['oct', 'nov', 'sold', 'off']);
  assert.deepEqual(d.past.map((e) => e.id), ['sep', 'aug']);
});
await test('getEvents converts images, builds slug urls, and sets CTA states', async () => {
  const d = await events.getEvents();
  const by = Object.fromEntries(d.upcoming.map((e) => [e.id, e]));
  assert.equal(by.oct.image, 'https://static.wixstatic.com/media/IMG_oct');
  assert.equal(by.oct.url, '/events-1/oct');
  assert.deepEqual([by.oct.cta, by.oct.ctaEnabled], ['RSVP', true]);
  assert.deepEqual([by.sold.cta, by.sold.ctaEnabled], ['Sold Out', false]);
  assert.deepEqual([by.off.cta, by.off.ctaEnabled], ['View Event', true]);
  assert.equal(by.oct.startMonth, 'Oct');
});

/* ---------- classes.web.js ---------- */
console.log('classes.web.js');
const classes = await load('classes.web.js');
state.programs = [{ id: 'p1', description: { title: 'Foundations', details: 'd', media: { image: 'wix:image://v1/CLS1/c.jpg' } }, price: { value: '0' }, seo: { slug: 'foundations' }, stepCount: 4 }];
await test('getPrograms links to /class-detail/<slug>, reads the image, and shows price 0 as Free', async () => {
  const p = await classes.getPrograms();
  assert.equal(p[0].url, '/class-detail/foundations');
  assert.equal(p[0].image, 'https://static.wixstatic.com/media/CLS1');
  assert.equal(p[0].price, 'Free');
});

/* ---------- gallery.web.js ---------- */
console.log('gallery.web.js');
const gallery = await load('gallery.web.js');
state.items['proj'] = [
  { type: 'IMAGE', title: 'A', image: { imageInfo: 'wix:image://v1/G1/a.jpg' } },
  { type: 'VIDEO', title: 'V', video: { videoInfo: 'wix:video://v1/VID9/v.mp4#posterUri=poster9.jpg' } },
  { type: 'IMAGE', title: 'broken', image: {} },
];
await test('getProjectPhotos maps images and videos and drops empties', async () => {
  const p = await gallery.getProjectPhotos('proj');
  assert.equal(p.length, 2);
  assert.equal(p[0].src, 'https://static.wixstatic.com/media/G1');
  assert.equal(p[1].videoId, 'VID9');
  assert.equal(p[1].src, 'https://static.wixstatic.com/media/poster9.jpg');
});

/* ---------- http-functions.js ---------- */
console.log('http-functions.js');
const http = await load('http-functions.js');
const req = (body) => ({ body: { json: async () => body } });
await test('post_ariseForm rejects unknown form types and bad emails', async () => {
  assert.equal((await http.post_ariseForm(req({ formType: 'hack', name: 'a', email: 'a@b.co' }))).status, 400);
  assert.equal((await http.post_ariseForm(req({ formType: 'contact', name: 'a', email: 'nope' }))).status, 400);
  assert.equal((await http.post_ariseForm(req({ formType: 'contact', name: '', email: 'a@b.co' }))).status, 400);
  assert.equal(state.inserted.length, 0);
});
await test('post_ariseForm stores first, then contact, then automation, for all five types', async () => {
  for (const t of ['contact', 'serve', 'prayer', 'connect-host', 'connect-join']) {
    const r = await http.post_ariseForm(req({ formType: t, name: 'Test Person', email: 't@example.com', message: 'hi', phone: '318' }));
    assert.equal(r.status, 200);
  }
  assert.equal(state.inserted.length, 5);
  assert.equal(state.inserted[0][0], 'FormSubmissions');
  assert.equal(state.inserted[0][1].handled, false);
  assert.equal(state.contacts.length, 5);
  assert.equal(state.triggers.length, 5);
  assert.equal(state.triggers[0].triggerId, '519d3164-8dae-4448-a362-35ff96ed2068');
  assert.equal(state.triggers[0].payload.contactId, 'c-1');
});
await test('post_ariseForm still returns ok when contact/automation fail', async () => {
  const saveC = state.contacts; globalThis.__state.contacts = { push() { throw new Error('crm down'); } };
  const r = await http.post_ariseForm(req({ formType: 'prayer', name: 'P', email: 'p@example.com' }));
  globalThis.__state.contacts = saveC;
  assert.equal(r.status, 200);
});

/* ---------- youtube.jsw ---------- */
console.log('youtube.jsw');
await test('offline: live, series and Shorts all come back empty without throwing', async () => {
  globalThis.__ytMode = 'offline';
  const yt = await load('youtube.jsw', 'offline');
  assert.equal(await yt.getLiveVideoId(), null);
  assert.equal(await yt.getCurrentSeries(), null);
  assert.deepEqual(await yt.getLatestShorts(8), []);
  assert.equal(await yt.getLatestVideo(), null);
  assert.equal(await yt.getLatestGloryNight(), null);
  assert.deepEqual(await yt.getPlaylists(), []);
});
await test('requests YouTube with a desktop browser User-Agent (a generic one gets the mobile site)', async () => {
  globalThis.__ytMode = 'desktop';
  state.fetches = [];
  const yt = await load('youtube.jsw', 'ua');
  await yt.getLatestShorts(8);
  const f = state.fetches.pop();
  assert.match(String(f.headers['User-Agent']), /Windows NT|Macintosh/);
  assert.match(f.url, /\/channel\/UCGS9j7B_prcJkbTNgzlGrKg\/shorts$/);
});
await test('newest Shorts from the real Shorts tab: newest first, titles, links, limit', async () => {
  globalThis.__ytMode = 'desktop';
  const yt = await load('youtube.jsw', 'shorts');
  const s = await yt.getLatestShorts(8);
  assert.equal(s.length, 8);
  assert.equal(s[0].id, 'm_bDPBzAGUE');
  assert.equal(s[0].title, 'Declare: Last Year Was the Last Year I Lived Paycheck to Paycheck');
  assert.equal(s[1].title, "Don't Pick Battles God Didn't Give You");
  assert.equal(s[0].url, 'https://www.youtube.com/shorts/m_bDPBzAGUE');
  assert.equal(s[0].thumb, 'https://i.ytimg.com/vi/m_bDPBzAGUE/frame0.jpg');
  assert.ok(s.every((x) => /^[A-Za-z0-9_-]{11}$/.test(x.id) && x.title.length > 3));
  assert.equal((await yt.getLatestShorts(3)).length, 3);
  assert.equal((await yt.getLatestShorts(100)).length, 24);
});
await test('Shorts: the mobile page (no Shorts data) gives [] rather than junk', async () => {
  globalThis.__ytMode = 'mobile';
  const yt = await load('youtube.jsw', 'mobile');
  assert.deepEqual(await yt.getLatestShorts(8), []);
});
await test('series auto-detect reads the current playlist layout and picks the newest "(Series)"', async () => {
  globalThis.__ytMode = 'desktop';
  const yt = await load('youtube.jsw', 'series');
  assert.deepEqual(await yt.getCurrentSeries(), { title: 'Fruit of the Spirit', url: 'https://www.youtube.com/playlist?list=PLMbBRRxhqveM' });
});
await test('an UPCOMING scheduled stream is not reported as live', async () => {
  globalThis.__ytMode = 'desktop';
  const yt = await load('youtube.jsw', 'upcoming');
  assert.equal(await yt.getLiveVideoId(), null);
});
await test('a stream playing now is reported as live', async () => {
  globalThis.__ytMode = 'live-now';
  const yt = await load('youtube.jsw', 'livenow');
  assert.equal(await yt.getLiveVideoId(), '1BkVBEluwdY');
});

/* ---------- youtube.jsw: Media page (2026-10-27) ---------- */
await test('ageDays reads both of YouTube\'s wordings', async () => {
  const yt = await load('youtube.jsw', 'age');
  assert.equal(yt.ageDays('Streamed 6 days ago'), 6);
  assert.equal(yt.ageDays('Streamed 2 weeks ago'), 14);
  assert.equal(yt.ageDays('Premiered 3 months ago'), 90);
  assert.equal(yt.ageDays('2y ago'), 730);
  assert.equal(yt.ageDays('3mo ago'), 90);
  assert.ok(Math.abs(yt.ageDays('5m ago') - 5 / 1440) < 1e-9);
  assert.equal(yt.ageDays('1 hour ago'), 1 / 24);
  assert.equal(yt.ageDays('Scheduled for 2 Nov 2026'), Infinity);
});
await test('parseVideoList reads the current lockup layout from a real YouTube page', async () => {
  const yt = await load('youtube.jsw', 'lockup');
  const list = yt.parseVideoList(fs.readFileSync(path.join(FIXTURES, 'youtube-live-upcoming.html'), 'utf8'));
  assert.ok(list.length >= 20, 'found ' + list.length + ' cards');
  assert.equal(list[0].id, 'y-etOCS0aPw');
  assert.match(list[0].title, /PIT Maneuver/);
  assert.equal(list[0].when, '2y ago');
  assert.equal(list[0].ageDays, 730);
  assert.ok(list.every((v) => /^[A-Za-z0-9_-]{11}$/.test(v.id) && v.title));
});
await test('newest service: the Live tab newest first, the scheduled stream skipped', async () => {
  globalThis.__ytMode = 'desktop';
  state.fetches = [];
  const yt = await load('youtube.jsw', 'latest');
  const v = await yt.getLatestVideo();
  assert.deepEqual(v, {
    id: 'sun26Oct001', title: 'Sunday Morning Service | Arise Church', when: 'Streamed 1 day ago',
    url: 'https://www.youtube.com/watch?v=sun26Oct001', thumb: 'https://i.ytimg.com/vi/sun26Oct001/hqdefault.jpg'
  });
  assert.match(state.fetches[0].url, /\/channel\/UCGS9j7B_prcJkbTNgzlGrKg\/streams$/);
  const all = await yt.getLatestStreams(10);
  assert.deepEqual(all.map((x) => x.id), ['sun26Oct001', 'glory20Oct1', 'sun19Oct001', 'glory13Oct1']);
  assert.equal(state.fetches.length, 1, 'the second call must come from the cache');
});
await test('a stream running now is the newest item on the Live tab and is flagged live', async () => {
  globalThis.__ytMode = 'live-now';
  const yt = await load('youtube.jsw', 'latestlive');
  const all = await yt.getLatestStreams(2);
  assert.equal(all[0].id, 'livenow0001');
  assert.equal(all[0].live, true);
  assert.equal(all[1].live, false);
});
await test('newest Glory Night: picked by age, so an oldest-first playlist still gives the newest', async () => {
  globalThis.__ytMode = 'desktop'; globalThis.__gloryPage = null;
  const yt = await load('youtube.jsw', 'glory');
  const g = await yt.getLatestGloryNight();
  assert.equal(g.id, 'glory20Oct1');
  assert.equal(g.title, 'Monday Night Glory Night');
  assert.equal(g.when, 'Streamed 6 days ago');
  assert.equal(g.url, 'https://www.youtube.com/watch?v=glory20Oct1&list=PLYhdT3QigNmY');
});
await test('Glory Night: a playlist page without ages falls back to the newest "Glory Night" on the Live tab', async () => {
  globalThis.__ytMode = 'desktop'; globalThis.__gloryPage = 'youtube-playlist-glory-noages.html';
  const yt = await load('youtube.jsw', 'glorynoage');
  assert.equal((await yt.getLatestGloryNight()).id, 'glory20Oct1');
  globalThis.__gloryPage = null;
});
await test('Glory Night: a failed playlist page falls back to the Live tab; nothing anywhere -> null', async () => {
  globalThis.__ytMode = 'desktop'; globalThis.__gloryPage = '404';
  const yt = await load('youtube.jsw', 'glory404');
  assert.equal((await yt.getLatestGloryNight()).id, 'glory20Oct1');
  globalThis.__ytMode = 'mobile';
  const yt2 = await load('youtube.jsw', 'glorynone');
  assert.equal(await yt2.getLatestGloryNight(), null);
  globalThis.__gloryPage = null;
});
await test('playlists from the real playlists page: Sunday Sermons, Apostle Bryant, Pastor Vanessa first; Glory Nights left out', async () => {
  globalThis.__ytMode = 'desktop';
  const yt = await load('youtube.jsw', 'playlists');
  const p = await yt.getPlaylists();
  assert.equal(p.length, 13);
  assert.deepEqual(p.slice(0, 3).map((x) => x.title), ['Sunday Sermons', 'Apostle Bryant Sanders \u2014 Messages', 'Pastor Vanessa Sanders \u2014 Messages']);
  assert.deepEqual(p.slice(0, 3).map((x) => x.id), ['PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI', 'PLa-Nxr2f-qHY', 'PLeDfl1m-bAzo']);
  assert.equal(p[3].title, 'Guest Ministers | Arise Church');
  assert.ok(p.every((x) => x.id !== 'PLYhdT3QigNmY'), 'Glory Nights must not be in the Sermons list');
  assert.equal(p[0].count, 113);
  assert.equal(p[1].count, 82);
  assert.equal(p[0].thumb, 'https://i.ytimg.com/vi/oYSMY9VJk1I/hqdefault.jpg');
  assert.equal(p[0].url, 'https://www.youtube.com/playlist?list=PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI');
  assert.ok(p.every((x) => x.count > 0 && /^https:\/\/i\.ytimg\.com\/vi\/[A-Za-z0-9_-]{11}\/hqdefault\.jpg$/.test(x.thumb)));
});
await test('playlists: the mobile page gives [] rather than junk', async () => {
  globalThis.__ytMode = 'mobile';
  const yt = await load('youtube.jsw', 'playlistsmobile');
  assert.deepEqual(await yt.getPlaylists(), []);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
