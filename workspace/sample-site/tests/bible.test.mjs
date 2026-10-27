/* ===========================================================================
   BIBLE BACKEND TESTS  (node sample-site/tests/bible.test.mjs)
   Runs the real backend/bible.js and the Bible HTTP functions under node by
   swapping wix-fetch (answers each source from small fixtures below) and
   wix-secrets-backend (reads globalThis.__secrets). Pins what the Bible page
   depends on: how a typed reference is understood, which Bibles survive into
   the list and under which name, what each source's answer turns into, the
   notes / audio / chapter-span rules, the AriseHub bridge, and the JSON the
   page receives. Ported from AriseHub's tests (bible-dedupe, bible-language)
   with the website's English-only rule. Zero dependencies.
   =========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const BACKEND = path.join(ROOT, 'files2', 'arise-fixed-2026-09-14', 'backend');
/* The suite runs the files2 copy; Wix deploys src/backend. They must be the same file. */
for (const f of ['bible.js', 'http-functions.js']) {
  const a = fs.readFileSync(path.join(BACKEND, f), 'utf8'), b = fs.readFileSync(path.join(ROOT, '..', 'src', 'backend', f), 'utf8');
  if (a !== b) { console.log('FAIL files2/.../backend/' + f + ' differs from src/backend/' + f + ' — copy it over before testing'); process.exit(1); }
}
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'arise-bible-'));

/* ---------- the network, as fixtures ---------- */
const net = { log: [], fail: {}, hubTokens: 0, hubFails401Once: false };
globalThis.__net = net;
globalThis.__secrets = {};

const BIBLE_API_JOHN = { reference: 'John 3:16', verses: [{ book_id: 'JHN', book_name: 'John', chapter: 3, verse: 16, text: 'For God so loved the world,\n that he gave his one and only Son...\n' }],
  text: 'For God so loved the world, that he gave his one and only Son...\n', translation_id: 'web', translation_name: 'World English Bible', translation_note: 'Public Domain' };
const BIBLE_API_DATA = { translations: [{ identifier: 'web', name: 'World English Bible', language: 'English' }, { identifier: 'kjv', name: 'King James Version', language: 'English' }, { identifier: 'cuv', name: 'Chinese Union Version', language: 'Chinese' }] };
function helloaoChapter(id, name, withAudio) {
  return { translation: { id: id, name: name, englishName: name, licenseUrl: 'https://example.org/licence' },
    chapter: { number: 3, content: [
      { type: 'heading', content: ['The New Birth'] },
      { type: 'verse', number: 1, content: ['Now there was a man of the Pharisees named Nicodemus,', { text: 'a leader of the Jews.', poem: 1 }] },
      { type: 'verse', number: 2, content: ['He came to Jesus at night.'] },
      { type: 'verse', number: 3, content: ['Jesus replied, "Truly, truly, I tell you, no one can see the kingdom of God unless he is born again."'] },
      { type: 'verse', number: 16, content: ['For God so loved the world that He gave His one and only Son.'] },
      { type: 'verse', number: 17, content: ['For God did not send His Son into the world to condemn the world.'] }
    ], footnotes: withAudio ? [
      { noteId: 1, caller: 'a', text: 'Or born from above', reference: { chapter: 3, verse: 3 } },
      { noteId: 2, caller: 'b', text: 'Or His only begotten Son', reference: { chapter: 3, verse: 16 } },
      { noteId: 3, caller: 'c', text: 'not shown', reference: { chapter: 3, verse: 36 } }
    ] : [] },
    thisChapterAudioLinks: withAudio ? { hays: 'https://audio.example/BSB/JHN/3/hays.mp3', souer: 'https://audio.example/BSB/JHN/3/souer.mp3', gilbert: '' } : {} };
}
const HELLOAO_LIST = { translations: [
  { id: 'BSB', name: 'Berean Standard Bible', englishName: 'Berean Standard Bible', languageEnglishName: 'English' },
  { id: 'eng_kjv', name: 'King James Version', englishName: 'King James Version', languageEnglishName: 'English' },
  { id: 'eng_kja', name: 'King James Version + Apocrypha', languageEnglishName: 'English' },
  { id: 'eng_web', name: 'World English Bible', languageEnglishName: 'English' },           // not in the keep list: an extra WEB edition
  { id: 'eng_webbe', name: 'World English Bible British Edition', languageEnglishName: 'English' },
  { id: 'grc_tr', name: 'Textus Receptus', languageEnglishName: 'Ancient Greek' },           // English-only site: dropped
  { id: 'heb_wlc', name: 'Westminster Leningrad Codex', languageEnglishName: 'Ancient Hebrew' },
  { id: 'spa_rv', name: 'Reina Valera', languageEnglishName: 'Spanish' },
  { id: 'AAB', name: 'Accessible Ancients Bible', languageEnglishName: 'English' }
] };
const WLDEH_CH = { data: [{ book: 'john', chapter: '3', verse: '16', text: '¶ For God so loved the world' }, { book: 'john', chapter: '3', verse: '16', text: 'DUPLICATE' }, { book: 'john', chapter: '3', verse: '17', text: 'For God sent not his Son' }] };
const WLDEH_LIST = [{ id: 'en-kjv', version: 'King James (Authorised) Version', language: { name: 'English' } }, { id: 'en-asv', version: 'American Standard Version (1901)', language: { name: 'English' } }, { id: 'fr-lsg', version: 'Louis Segond', language: { name: 'French' } }];
const YV_LIST = { data: [
  { id: 111, abbreviation: 'NIV', title: 'New International Version 2011', copyright: 'NIV (c) Biblica', language_tag: 'en', books: ['GEN', 'JHN', 'ROM'] },
  { id: 59, abbreviation: 'ESV', title: 'English Standard Version 2016', copyright: 'ESV (c) Crossway', language_tag: 'en' },
  { id: 1849, abbreviation: 'TPT', title: 'The Passion Translation', copyright: 'TPT (c) Passion & Fire', language_tag: 'en', books: ['MAT', 'JHN'] },
  { id: 3034, abbreviation: 'BSB', title: 'Berean Standard Bible', copyright: 'BSB public domain', language_tag: 'en' }
], next_page_token: null };
const YV_PASSAGE = { id: 'JHN.3.16-JHN.3.17', reference: 'John 3:16-17', content: '<div class="yv-c"><span class="yv-v" v="16">16</span>For God so loved the world <span class="yv-n">a</span>that he gave his one and only Son, <span class="yv-v" v="17">17</span>For God did not send his Son into the world to condemn the world.</div>' };
const ESV_PASSAGE = { query: 'John 3:16-17', canonical: 'John 3:16–17', passages: ['[16] “For God so loved the world, that he gave his only Son, [17] For God did not send his Son into the world to condemn the world.'] };
const API_BIBLE_LIST = { data: [{ id: 'de4e12af7f28f599-01', name: 'King James (Authorized) Version', abbreviation: 'KJV', language: { name: 'English' } }, { id: 'ab1', name: 'Arapaho Luke', language: { name: 'Arapaho' } }, { id: 'ab2', name: 'Free Bible Version', language: { name: 'English' } }] };
const API_BIBLE_PASSAGE = { data: { id: 'JHN.3.16-JHN.3.17', reference: 'John 3:16-17', copyright: 'PUBLIC DOMAIN', content: '[16] For God so loved the world [17] For God sent not his Son' } };
const BIBLIA_LIST = { bibles: [{ bible: 'LEB', title: 'Lexham English Bible', languages: ['en'] }, { bible: 'KJV1900', title: 'The Holy Bible: King James Version', languages: ['en'] }] };
const HUB_LIST = { translations: [{ id: '111', name: 'New International Version 2011', language: 'English', providerId: 'youversion' }, { id: '116', name: 'New Living Translation', language: 'English', providerId: 'youversion' }, { id: 'BSB', name: 'Berean Standard Bible', language: 'English', providerId: 'helloao', hasAudio: true }, { id: 'grc_sbl', name: 'SBL Greek New Testament', language: 'Ancient Greek', providerId: 'helloao' }] };
const HUB_PASSAGE = { reference: 'John 3:16', translation: '116', translationName: 'New Living Translation', copyright: 'NLT (c) Tyndale', providerId: 'youversion', verses: [{ book: 'John', chapter: 3, verse: 16, text: 'For this is how God loved the world' }], text: 'For this is how God loved the world', footnotes: [{ verse: 16, text: 'Or For God loved the world so much' }], footnotesFrom: 'Berean Standard Bible' };

fs.writeFileSync(path.join(TMP, 'wix-secrets-backend.mjs'), `
export const getSecret = async (name) => { const s = globalThis.__secrets || {}; if (!(name in s)) throw new Error('Secret not found: ' + name); return s[name]; };`);
fs.writeFileSync(path.join(TMP, 'wix-http-functions.mjs'), `
const r = (status) => (o) => Object.assign({ status }, o);
export const ok = r(200), badRequest = r(400), serverError = r(500);
export const response = (o) => o;`);
fs.writeFileSync(path.join(TMP, 'wix-fetch.mjs'), `
const F = globalThis.__fixtures;
const net = globalThis.__net;
const reply = (status, body, isText) => ({ ok: status < 400, status, json: async () => (typeof body === 'string' ? JSON.parse(body) : body), text: async () => (isText ? body : JSON.stringify(body)) });
export const fetch = async (url, opts) => {
  net.log.push({ url, headers: (opts && opts.headers) || {}, method: (opts && opts.method) || 'get' });
  for (const k of Object.keys(net.fail)) { if (url.indexOf(k) > -1) { const f = net.fail[k]; if (typeof f === 'number') return reply(f, { error: 'nope' }); throw new Error('connection reset'); } }
  if (url.startsWith('https://bible-api.com/data')) return reply(200, F.BIBLE_API_DATA);
  if (url.startsWith('https://bible-api.com/')) return reply(url.indexOf('Hezekiah') > -1 ? 404 : 200, F.BIBLE_API_JOHN);
  if (url.startsWith('https://bible.helloao.org/api/available_translations.json')) return reply(200, F.HELLOAO_LIST);
  if (url.startsWith('https://bible.helloao.org/api/BSB/books.json')) return reply(200, { books: [{ id: 'GEN', commonName: 'Genesis', numberOfChapters: 50 }, { id: 'JHN', commonName: 'John', numberOfChapters: 21 }] });
  let m = url.match(/^https:\\/\\/bible\\.helloao\\.org\\/api\\/([^/]+)\\/([A-Z0-9]{3})\\/(\\d+)\\.json$/);
  if (m) { if (m[2] === 'HEB') return reply(404, {}); return reply(200, F.helloaoChapter(m[1], m[1] === 'BSB' ? 'Berean Standard Bible' : (m[1] === 'AAB' ? 'Accessible Ancients Bible' : 'King James Version'), m[1] === 'BSB' || m[1] === 'AAB')); }
  if (url.startsWith('https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json')) return reply(200, F.WLDEH_LIST);
  if (url.startsWith('https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/')) return reply(200, F.WLDEH_CH);
  if (url.startsWith('https://api.youversion.com/v1/bibles?')) return reply((opts.headers || {})['X-YVP-App-Key'] === 'yv-key' ? 200 : 401, F.YV_LIST);
  if (url.startsWith('https://api.youversion.com/v1/bibles/') && url.indexOf('/passages/') > -1) return reply(url.indexOf('GEN') > -1 ? 422 : 200, F.YV_PASSAGE);
  if (url.startsWith('https://api.youversion.com/v1/bibles/')) return reply(200, { id: 111, title: 'New International Version', copyright: 'NIV (c) Biblica (from version)' });
  if (url.startsWith('https://api.esv.org/')) return reply(200, F.ESV_PASSAGE);
  if (url === 'https://rest.api.bible/v1/bibles') return reply(200, F.API_BIBLE_LIST);
  if (url.startsWith('https://rest.api.bible/v1/bibles/')) return reply(200, F.API_BIBLE_PASSAGE);
  if (url.startsWith('https://api.biblia.com/v1/bible/find')) return reply(200, F.BIBLIA_LIST);
  if (url.startsWith('https://api.biblia.com/v1/bible/content/')) return reply(200, 'For God so loved the world, that he gave his one and only Son.', true);
  if (url === 'https://blocked.example/api/agent/token') return reply(403, '<!DOCTYPE html><html><head><title>Attention Required! | Cloudflare</title><style>body{}</style></head><body><h1>Sorry, you have been blocked</h1><p>You are unable to access arisehub.myfaithtech.com</p><p>Cloudflare Ray ID: 9abc</p></body></html>', true);
  if (url === 'https://arisehub.myfaithtech.com/api/agent/token' || url === 'https://arisehub.example.workers.dev/api/agent/token') { net.hubTokens++; return reply((opts.headers || {}).Authorization === 'Bearer ahk_test' ? 200 : 401, { access_token: 'tok' + net.hubTokens, expires_at: Math.floor(Date.now() / 1000) + 3600 }); }
  if (url.startsWith('https://arisehub.myfaithtech.com/api/bible/') || url.startsWith('https://arisehub.example.workers.dev/api/bible/')) {
    const auth = (opts.headers || {}).Authorization || '';
    if (net.hubFails401Once && auth === 'Bearer tok1') { net.hubFails401Once = false; return reply(401, { error: 'unauthorized' }); }
    if (url.indexOf('/translations') > -1) return reply(200, F.HUB_LIST);
    if (url.indexOf('/passage') > -1) return reply(url.indexOf('Hezekiah') > -1 ? 502 : 200, url.indexOf('Hezekiah') > -1 ? { error: 'This Bible doesn\\'t include that passage \\u2014 try another translation.', detail: 'YouVersion 422' } : F.HUB_PASSAGE);
    if (url.indexOf('/reference') > -1) return reply(200, { entries: [{ slug: 'nicodemus', name: 'Nicodemus', sources: ['Easton'], verses: [1], excerpt: 'The victory of the people' }], attribution: 'x' });
    if (url.indexOf('/dictionary') > -1) return reply(200, url.indexOf('slug=') > -1 ? { entry: { slug: 'nicodemus', name: 'Nicodemus', definitions: [{ source: 'Easton', text: 'full' }] } } : { entries: [{ slug: 'shepherd', name: 'Shepherd' }] });
  }
  return reply(404, { error: 'no fixture for ' + url });
};`);
globalThis.__fixtures = { BIBLE_API_JOHN, BIBLE_API_DATA, helloaoChapter, HELLOAO_LIST, WLDEH_CH, WLDEH_LIST, YV_LIST, YV_PASSAGE, ESV_PASSAGE, API_BIBLE_LIST, API_BIBLE_PASSAGE, BIBLIA_LIST, HUB_LIST, HUB_PASSAGE };

const MAP = { "'wix-fetch'": './wix-fetch.mjs', "'wix-secrets-backend'": './wix-secrets-backend.mjs', "'wix-http-functions'": './wix-http-functions.mjs',
  "'backend/bible.js'": './bible.mjs', "'wix-data'": './stub.mjs', "'wix-crm-backend'": './stub.mjs', "'@wix/automations'": './stub.mjs', "'@wix/essentials'": './stub.mjs' };
fs.writeFileSync(path.join(TMP, 'stub.mjs'), `export default {}; export const contacts = {}; export const customTrigger = {}; export const auth = {};`);
/* tag gives a fresh module instance (fresh caches, fresh keys) per scenario */
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
  catch (e) { console.error = err; console.log = log; failed++; console.log('  FAIL ' + name + '\n       ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join('\n       ') : e)); }
}
const calls = (part) => net.log.filter((l) => l.url.indexOf(part) > -1);
const reset = () => { net.log.length = 0; net.fail = {}; net.hubTokens = 0; net.hubFails401Once = false; };

/* ======================= 1. understanding a reference ======================= */
console.log('bible.js: references');
const bible = await load('bible.js', 'a');
await test('parseReference understands the ways people type a reference', () => {
  const p = bible.parseReference('John 3:16');
  assert.deepEqual([p.osis, p.bookName, p.chapter, p.verseFrom, p.verseTo], ['JHN', 'John', 3, 16, 16]);
  assert.equal(bible.parseReference('jn 3:16-18').verseTo, 18);
  assert.equal(bible.parseReference('I Cor 13:4').osis, '1CO');
  assert.equal(bible.parseReference('First John 1:9').osis, '1JN');
  assert.equal(bible.parseReference('III John 1').osis, '3JN');
  assert.equal(bible.parseReference('Song of Solomon 2:1').osis, 'SNG');
  assert.equal(bible.parseReference('St. John 3:16').osis, 'JHN');
  assert.equal(bible.parseReference('Ps 23').verseFrom, undefined);
  assert.equal(bible.parseReference('psalm 23').bookName, 'Psalms');
  assert.equal(bible.parseReference('Mt 5:9').osis, 'MAT');
  assert.equal(bible.parseReference('1cor 13').osis, '1CO');
});
await test('a range can cross a chapter break, and a backwards range is a typo', () => {
  const p = bible.parseReference('Matthew 5:1-7:29');
  assert.deepEqual([p.chapter, p.verseFrom, p.chapterTo, p.verseTo], [5, 1, 7, 29]);
  assert.equal(bible.refLabel(p), 'Matthew 5:1-7:29');
  assert.equal(bible.parseReference('John 4:2-3:1'), null);
  assert.equal(bible.parseReference('Hezekiah 3'), null);
  assert.equal(bible.parseReference('4 John 1'), null);
  assert.equal(bible.parseReference(''), null);
});
await test('refLabel prints a passage the way it is read out', () => {
  assert.equal(bible.refLabel(bible.parseReference('ps 23')), 'Psalms 23');
  assert.equal(bible.refLabel(bible.parseReference('john 3:16')), 'John 3:16');
  assert.equal(bible.refLabel(bible.parseReference('john 3:16-17')), 'John 3:16-17');
});

/* ======================= 2. which Bibles make the list ======================= */
console.log('bible.js: the list of Bibles');
const t = (name, language = 'English') => ({ id: name, name, language });
const same = (a, b) => bible.dedupeKey(a) === bible.dedupeKey(b);
await test('languageKept: English only, and a MISSING tag keeps a Bible', () => {
  assert.equal(bible.languageKept(t('x', 'English')), true);
  assert.equal(bible.languageKept(t('x', 'english')), true);
  assert.equal(bible.languageKept(t('x', undefined)), true);
  assert.equal(bible.languageKept(t('x', '   ')), true);
  for (const code of ['en', 'eng', 'en-US', 'EN']) assert.equal(bible.languageKept(t('x', code)), true, code + ' is English');
  assert.equal(bible.languageKept(t('x', 'enm')), false, 'Middle English code is not "en"');
  for (const lang of ['Ancient Greek', 'Greek, Ancient', 'Hebrew', 'Spanish', 'Arapaho', 'Chinese']) assert.equal(bible.languageKept(t('x', lang)), false, lang + ' should be dropped');
});
await test('de-duplication merges one work under several names', () => {
  assert.ok(same(t('American Standard Version (1901)'), t('American Standard Version')));
  assert.equal(bible.canonicalWork(t('King James (Authorised) Version')).canon, 'King James Version');
  assert.ok(same(t('King James (Authorized) Version'), t('The King James Version')));
  assert.ok(same(t('English Standard Version 2016'), t('English Standard Version')));
  assert.ok(same(t('Geneva Bible 1599'), t('Geneva Bible')));
  assert.ok(same(t("Brenton's English Septuagint"), t('Brenton English translation of the Septuagint')));
});
await test('de-duplication must NOT merge distinct works', () => {
  assert.ok(!same(t('New American Standard Bible 1995'), t('New American Standard Bible 2020')));
  assert.ok(!same(t('New International Version 2011'), t('New International Version (Anglicized) 2011')));
  assert.ok(!same(t('World English Bible'), t('World English Bible British Edition')));
  assert.ok(!same(t('World English Bible'), t('World English Bible Updated')));
  assert.ok(!same(t('King James Version'), t('King James Version + Apocrypha')));
  assert.ok(!same(t('King James Version'), t('Cambridge Paragraph Bible of the KJV')));
  assert.ok(!same(t('English Standard Version'), t('English Standard Version Anglicised')));
  assert.ok(!same(t('English Standard Version 2016'), t('English Standard Version 2011')));
  assert.ok(!same(t('NET Bible'), t('Amplified Bible')));
  assert.equal(bible.dedupeKey(t("Young's Literal Translation")), 'youngsliteraltranslation');
});
await test('with no keys at all: the free Bibles, curated, English, alphabetical, one of each', async () => {
  reset(); globalThis.__secrets = {};
  const list = await bible.allTranslations();
  const ids = list.map((x) => x.id);
  assert.ok(ids.includes('BSB') && ids.includes('eng_kjv') && ids.includes('eng_kja') && ids.includes('AAB'), 'curated free Bibles kept');
  assert.ok(!ids.includes('eng_web') && !ids.includes('eng_webbe'), 'uncurated free editions dropped');
  assert.ok(!ids.includes('grc_tr') && !ids.includes('heb_wlc') && !ids.includes('spa_rv') && !ids.includes('cuv') && !ids.includes('fr-lsg'), 'other languages dropped');
  assert.ok(!ids.includes('kjv') && !ids.includes('en-kjv'), 'bible-api.com / WLDEH KJV are not in the keep list');
  const names = list.map((x) => x.name);
  assert.deepEqual(names, names.slice().sort((a, b) => a.localeCompare(b)), 'sorted by name');
  assert.equal(list.filter((x) => x.name === 'King James Version').length, 1);
  assert.equal(list.find((x) => x.id === 'BSB').hasAudio, true);
  assert.equal(list.find((x) => x.id === 'AAB').hasAudio, true);
  assert.equal(list.find((x) => x.id === 'eng_kjv').hasAudio, undefined);
  assert.equal(calls('youversion').length, 0, 'no key, no call');
  assert.equal(calls('arisehub').length, 0);
  const status = await bible.keyStatus();
  assert.deepEqual(status, { youversion: false, esv: false, apiBible: false, biblia: false, arisehub: false });
});
const keyed = await load('bible.js', 'b');
await test('with every key: licensed Bibles pass through whole, the website\'s sources outrank AriseHub, the ESV is one entry', async () => {
  reset(); globalThis.__secrets = { YOUVERSION_APP_KEY: 'yv-key', ESV_API_KEY: 'esv-key', APIbible: 'old-name-key', BIBLIA_API_KEY: 'bib-key', ARISEHUB_API_KEY: 'ahk_test' };
  const list = await keyed.allTranslations();
  if (process.env.ABI_DEBUG) process.stdout.write(JSON.stringify(list.map((x) => x.id + ':' + x.providerId + ':' + x.name)) + '\n' + JSON.stringify(await keyed.bibleStatus()) + '\n');
  const byId = Object.fromEntries(list.map((x) => [x.id, x]));
  assert.equal(byId['111'].providerId, 'youversion', 'NIV from the website\'s own YouVersion key, not via AriseHub');
  assert.equal(byId['111'].name, 'New International Version 2011');
  assert.equal(byId['1849'].name, 'The Passion Translation');
  assert.equal(byId['116'].providerId, 'arisehub', 'the NLT only AriseHub has comes through the bridge');
  assert.ok(!byId['grc_sbl'], 'AriseHub\'s Greek text is filtered out: English only');
  const esv = list.filter((x) => /english standard version/i.test(x.name));
  assert.equal(esv.length, 1, 'YouVersion ESV 2016 and the ESV API are one entry');
  assert.equal(esv[0].name, 'English Standard Version');
  assert.equal(esv[0].providerId, 'youversion', 'YouVersion comes first in the order');
  assert.equal(byId['3034'].hasAudio, true, 'a licensed copy of the BSB keeps its player (matched by name)');
  assert.ok(!byId['BSB'], 'the free BSB is the same work as YouVersion\'s and collapses into it');
  assert.equal(byId['ab2'].providerId, 'api-bible', 'Free Bible Version via API.Bible (eng_fbv was not in the helloao fixture)');
  assert.ok(!byId['ab1'], 'Arapaho Luke dropped on language');
  assert.equal(byId['LEB'].providerId, 'biblia');
  assert.equal(list.filter((x) => /king james/i.test(x.name) && !/apocrypha/i.test(x.name)).length, 2, 'KJV and Biblia\'s "The Holy Bible: King James Version" (different name, kept apart)');
  assert.equal(calls('api/agent/token').length, 1, 'one token exchange');
  assert.ok(calls('rest.api.bible/v1/bibles')[0].headers['api-key'] === 'old-name-key', 'the older APIbible secret is read when API_BIBLE_KEY is absent');
  const status = await keyed.keyStatus();
  assert.deepEqual(status, { youversion: true, esv: true, apiBible: true, biblia: true, arisehub: true });
  assert.ok(!JSON.stringify(await keyed.bibleStatus()).includes('yv-key'), 'status never carries a key value');
});
await test('one source down does not empty the list, and the list is cached', async () => {
  const fresh = await load('bible.js', 'c');
  reset(); globalThis.__secrets = { YOUVERSION_APP_KEY: 'yv-key' }; net.fail = { 'bible.helloao.org/api/available': 503, 'bible-api.com/data': 'throw' };
  const list = await fresh.allTranslations();
  assert.ok(list.some((x) => x.id === '111'), 'YouVersion still there');
  assert.ok(!list.some((x) => x.id === 'BSB'));
  const n = net.log.length;
  await fresh.allTranslations();
  assert.equal(net.log.length, n, 'second call served from cache');
  const st = await fresh.bibleStatus();
  assert.match(st.sources.find((s) => s.id === 'helloao').error, /503/);
  assert.equal(st.sources.find((s) => s.id === 'youversion').offered, 4);
  assert.equal(st.sources.find((s) => s.id === 'youversion').listed, 4);
});

/* ======================= 3. what each source's answer becomes ======================= */
console.log('bible.js: passages');
await test('a Bible id that is not in the list is served as the BSB on AO Lab, under its own name', async () => {
  // bible-api.com's "web" is not in the curated list, so it is not routed there
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'd');
  const p = await fresh.getPassage('John 3:16', 'web');
  assert.equal(p.providerId, 'helloao');
  assert.equal(p.translationName, 'Berean Standard Bible', 'the default Bible, named by its source');
  assert.equal(calls('bible-api.com/John').length, 0);
});
await test('AO Lab: a verse range is sliced from the chapter; notes limited to shown verses; audio per narrator', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'e');
  const p = await fresh.getPassage('John 3:16-17', 'BSB');
  assert.deepEqual(p.verses.map((v) => v.verse), [16, 17]);
  assert.equal(p.verses[0].text, 'For God so loved the world that He gave His one and only Son.');
  assert.deepEqual(p.footnotes, [{ verse: 16, text: 'Or His only begotten Son', caller: 'b' }]);
  assert.equal(p.footnotesFrom, undefined, 'its own notes, not borrowed');
  assert.deepEqual(p.audio.map((a) => a.narrator), ['Hays', 'Souer'], 'empty link dropped, narrator capitalised');
  assert.equal(p.reference, 'John 3:16-17');
  assert.equal(p.translationName, 'Berean Standard Bible');
  const whole = await fresh.getPassage('John 3', 'BSB');
  assert.equal(whole.verses.length, 5);
  assert.equal(whole.verses[0].text, 'Now there was a man of the Pharisees named Nicodemus, a leader of the Jews.', 'formatting objects keep their text');
});
await test('notes are borrowed from the BSB when the chosen Bible has none, and say so', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'f');
  const p = await fresh.getPassage('John 3:16', 'eng_kjv');
  assert.equal(p.providerId, 'helloao');
  assert.equal(p.footnotesFrom, 'Berean Standard Bible');
  assert.equal(p.footnotes.length, 1);
  assert.equal(p.audio, undefined, 'audio is never borrowed from another translation');
});
await test('a licensed copy of the BSB gets the free recording (same words), and the catalogue name', async () => {
  reset(); globalThis.__secrets = { YOUVERSION_APP_KEY: 'yv-key' };
  const fresh = await load('bible.js', 'g');
  await fresh.allTranslations();
  net.log.length = 0;
  const p = await fresh.getPassage('John 3:16-17', '3034');
  assert.equal(p.providerId, 'youversion');
  assert.deepEqual(p.verses.map((v) => v.verse), [16, 17]);
  assert.equal(p.verses[0].text, 'For God so loved the world a that he gave his one and only Son,', 'the printed verse number is stripped');
  assert.equal(p.translationName, 'Berean Standard Bible');
  assert.equal(p.copyright, 'BSB public domain', 'attribution captured from the catalogue');
  assert.deepEqual(p.audio.map((a) => a.narrator), ['Hays', 'Souer']);
  assert.equal(calls('api.youversion.com/v1/bibles/3034').filter((c) => c.url.indexOf('passages') < 0).length, 0, 'no extra catalogue call: copyright already known');
});
await test('YouVersion: a book the Bible does not carry is named, not a bare 422', async () => {
  reset(); globalThis.__secrets = { YOUVERSION_APP_KEY: 'yv-key' };
  const fresh = await load('bible.js', 'h');
  await fresh.allTranslations();
  await assert.rejects(fresh.getPassage('Genesis 1:1', '1849'), /doesn't include Genesis/);
  await assert.rejects(fresh.getPassage('Genesis 1:1', '59'), /doesn't include that passage/, 'an unlisted book list falls back to the 422 wording');
});
await test('ESV API: [n] markers become verses, the copyright line rides along', async () => {
  reset(); globalThis.__secrets = { ESV_API_KEY: 'esv-key' };
  const fresh = await load('bible.js', 'i');
  const p = await fresh.getPassage('John 3:16-17', 'esv');
  assert.equal(p.providerId, 'esv');
  assert.deepEqual(p.verses.map((v) => v.verse), [16, 17]);
  assert.match(p.copyright, /Crossway/);
  assert.equal(calls('api.esv.org')[0].headers.Authorization, 'Token esv-key');
  assert.equal(p.reference, 'John 3:16–17');
});
await test('API.Bible and Biblia', async () => {
  reset(); globalThis.__secrets = { API_BIBLE_KEY: 'ab-key', BIBLIA_API_KEY: 'bib-key' };
  const fresh = await load('bible.js', 'j');
  const a = await fresh.getPassage('John 3:16-17', 'ab2');
  assert.equal(a.providerId, 'api-bible');
  assert.deepEqual(a.verses.map((v) => v.text), ['For God so loved the world', 'For God sent not his Son']);
  assert.equal(a.translationName, 'Free Bible Version', 'the catalogue name, not the id');
  assert.equal((await fresh.translationFor('de4e12af7f28f599-01')), null, 'API.Bible\'s KJV collapsed into AO Lab\'s, which comes first');
  assert.equal(calls('rest.api.bible')[0].headers['api-key'], 'ab-key');
  const b = await fresh.getPassage('John 3:16', 'LEB');
  assert.equal(b.providerId, 'biblia');
  assert.equal(b.verses.length, 1);
  assert.equal(b.copyright, fresh.BIBLIA_ATTRIBUTION);
  assert.equal(calls('api.biblia.com')[0].headers.Referer, 'https://www.arisecenla.church');
  assert.ok(calls('api.biblia.com/v1/bible/content')[0].url.indexOf('passage=John3.16') > -1);
});
await test('an empty or unknown Bible id falls back to the BSB on AO Lab, even when keyed sources are configured', async () => {
  reset(); globalThis.__secrets = { YOUVERSION_APP_KEY: 'yv-key', API_BIBLE_KEY: 'ab-key' };
  const fresh = await load('bible.js', 'k');
  const p = await fresh.getPassage('John 3:16-17', 'en-kjv');
  assert.equal(p.providerId, 'helloao');
  assert.ok(calls('helloao.org/api/BSB/JHN/3').length === 1, 'asked for the BSB, not for "en-kjv"');
  const q = await fresh.getPassage('John 3:16', '');
  assert.equal(q.providerId, 'helloao');
  assert.equal(calls('youversion.com/v1/bibles/').length, 0, 'YouVersion is never asked without a Bible id');
});
await test('an empty catalogue is never cached; a slow source is dropped on a deadline', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'k2');
  net.fail = { 'bible.helloao.org/api/available': 503, 'bible-api.com/data': 503, 'wldeh/bible-api/bibles/bibles.json': 503 };
  assert.deepEqual(await fresh.allTranslations(), []);
  net.fail = {};
  const n = net.log.length;
  const list = await fresh.allTranslations();
  assert.ok(list.length >= 4, 'the next call tried again: ' + list.length);
  assert.ok(net.log.length > n, 'and went to the network');
});
await test('a range across chapters is fetched as whole chapters and trimmed; too many chapters is refused', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'l');
  const p = await fresh.getPassage('John 3:16-4:2', 'BSB');
  assert.equal(p.reference, 'John 3:16-4:2');
  assert.deepEqual(p.verses.map((v) => v.chapter + ':' + v.verse), ['3:16', '3:17', '4:1', '4:2'], 'first chapter from v16, second up to v2 (the fixture serves the same verses for both)');
  assert.equal(p.audio, undefined, 'recordings are per chapter: dropped for a span');
  assert.equal(calls('helloao.org/api/BSB/JHN').length, 2);
  await assert.rejects(fresh.getPassage('Genesis 1:1-50:26', 'BSB'), /6 or fewer/);
});
await test('errors become a sentence a reader can act on; the raw reason stays on .detail', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'm');
  await assert.rejects(fresh.getPassage('Hebrews 1', 'BSB'), (e) => { assert.match(e.message, /doesn't include that passage/); assert.equal(e.detail, 'AO Lab 404'); return true; });
  net.fail = { 'bible.helloao.org/api/BSB/JHN': 503 };
  await assert.rejects(fresh.getPassage('John 3', 'BSB'), /unavailable right now/);
  await assert.rejects(fresh.getPassage('Hezekiah 3', 'BSB'), /Couldn't understand/);
  await assert.rejects(fresh.getPassage('', 'BSB'), /Type a reference/);
});
await test('a passage is cached for a while', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'n');
  await fresh.getPassage('John 3:16', 'BSB');
  const n = net.log.length;
  await fresh.getPassage('john 3:16', 'BSB');
  assert.equal(net.log.length, n);
});
await test('a 5xx is retried once, a 4xx is not', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'o');
  net.fail = { 'bible.helloao.org/api/BSB/JHN': 503 };
  await assert.rejects(fresh.getPassage('John 3', 'BSB'));
  assert.equal(calls('helloao.org/api/BSB/JHN').length, 2, 'two tries on a 503');
  net.fail = {};
  net.log.length = 0;
  await assert.rejects(fresh.getPassage('Hebrews 1', 'BSB'));
  assert.equal(calls('helloao.org/api/BSB/HEB').length, 1, 'one try on a 404');
});

/* ======================= 4. the AriseHub bridge ======================= */
console.log('bible.js: AriseHub bridge');
await test('a hub Bible goes across exactly as typed, with the hub\'s notes; the session is reused and renewed on a 401', async () => {
  reset(); globalThis.__secrets = { ARISEHUB_API_KEY: 'ahk_test' };
  const fresh = await load('bible.js', 'p');
  const p = await fresh.getPassage('John 3:16', '116');
  assert.equal(p.providerId, 'arisehub');
  assert.equal(p.via, 'youversion');
  assert.equal(p.translationName, 'New Living Translation');
  assert.equal(p.footnotesFrom, 'Berean Standard Bible');
  const passageCall = calls('api/bible/passage')[0];
  assert.ok(passageCall.url.indexOf('ref=John%203%3A16') > -1 && passageCall.url.indexOf('translation=116') > -1);
  assert.equal(passageCall.headers.Authorization, 'Bearer tok1');
  assert.equal(net.hubTokens, 1);
  const r = await fresh.dictionaryReference('John 3');
  assert.equal(r.entries[0].slug, 'nicodemus');
  assert.equal(net.hubTokens, 1, 'no second exchange while the session is fresh');
  net.hubFails401Once = true;
  const d = await fresh.dictionaryLookup({ slug: 'nicodemus' });
  assert.equal(d.entry.definitions[0].text, 'full');
  assert.equal(net.hubTokens, 2);
  await assert.rejects(fresh.getPassage('Hezekiah 3', '116'), (e) => { assert.match(e.message, /doesn't include that passage/); return true; });
});
await test('with a key but AriseHub refusing it, the dictionary says so instead of vanishing', async () => {
  reset(); globalThis.__secrets = { ARISEHUB_API_KEY: 'ahk_wrong' };
  const fresh = await load('bible.js', 'p2');
  await assert.rejects(fresh.dictionaryReference('John 3'), /AriseHub token 401/);
  const st = await fresh.bibleStatus();
  assert.equal(st.dictionary.configured, true);
  assert.equal(st.dictionary.ok, false);
  assert.match(st.dictionary.error, /AriseHub token 401/);
  assert.ok(calls('api/agent/token').every((c) => /AriseChurchWebsite/.test(c.headers['User-Agent'])), 'the bridge names itself');
});
await test('a firewall block page is quoted in the error, and ARISEHUB_URL moves the bridge', async () => {
  reset(); globalThis.__secrets = { ARISEHUB_API_KEY: 'ahk_test', ARISEHUB_URL: 'https://blocked.example' };
  const fresh = await load('bible.js', 'p3');
  await assert.rejects(fresh.dictionaryReference('John 3'), (e) => { assert.match(e.message, /^AriseHub token 403 \u2014 Attention Required! \| Cloudflare Sorry, you have been blocked/); assert.ok(e.message.length < 220); return true; });
  reset(); globalThis.__secrets = { ARISEHUB_API_KEY: 'ahk_test', ARISEHUB_URL: 'https://arisehub.example.workers.dev/' };
  const moved = await load('bible.js', 'p4');
  const r = await moved.dictionaryReference('John 3');
  assert.equal(r.entries[0].slug, 'nicodemus');
  assert.ok(calls('arisehub.example.workers.dev/api/agent/token').length === 1 && calls('myfaithtech').length === 0, 'every bridge call went to the other address');
  assert.equal((await moved.bibleStatus()).dictionary.url, 'https://arisehub.example.workers.dev');
  assert.equal((await moved.keyStatus()).arisehubUrl, undefined, 'the URL is not a key');
});
await test('without an AriseHub key the dictionary is simply absent', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'q');
  assert.deepEqual(await fresh.dictionaryReference('John 3'), { entries: [], available: false, configured: false });
  assert.deepEqual(await fresh.dictionaryLookup({ q: 'shep' }), { entries: [], available: false, configured: false });
  assert.equal(calls('arisehub').length, 0);
});
await test('bibleBooks: chapter counts from AO Lab, the static list if it fails', async () => {
  reset(); globalThis.__secrets = {};
  const fresh = await load('bible.js', 'r');
  const books = await fresh.bibleBooks();
  assert.equal(books[1].chapters, 21);
  const fresh2 = await load('bible.js', 's');
  net.fail = { 'books.json': 503 };
  const fallback = await fresh2.bibleBooks();
  assert.equal(fallback.length, 66);
  assert.equal(fallback[42].name, 'John');
});

/* ======================= 5. the HTTP functions ======================= */
console.log('http-functions.js: Bible endpoints');
reset(); globalThis.__secrets = {};
await load('bible.js', '');            // bible.mjs, the one http-functions imports
const http = await load('http-functions.js');
const req = (query) => ({ query: query || {} });
await test('get_bible: JSON with a cache header; 400 without a reference; a friendly error on failure', async () => {
  const good = await http.get_bible(req({ ref: 'John 3:16', translation: 'BSB' }));
  assert.equal(good.status, 200);
  assert.equal(good.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.equal(good.headers['Cache-Control'], 'public, max-age=300');
  const body = JSON.parse(good.body);
  assert.equal(body.reference, 'John 3:16');
  assert.equal(body.verses.length, 1);
  const missing = await http.get_bible(req({}));
  assert.equal(missing.status, 400);
  assert.match(JSON.parse(missing.body).error, /John 3:16/);
  const bad = await http.get_bible(req({ ref: 'Hezekiah 3', translation: 'BSB' }));
  assert.equal(bad.status, 502, 'the source failed, not this site');
  assert.match(JSON.parse(bad.body).error, /Couldn't understand/);
  assert.equal(bad.headers['Cache-Control'], 'no-store');
});
await test('get_bibleBibles / get_bibleBooks / get_bibleReference / get_bibleDictionary / get_bibleStatus', async () => {
  const bibles = JSON.parse((await http.get_bibleBibles()).body);
  assert.ok(bibles.translations.length >= 4, 'the four curated free Bibles in the fixtures');
  assert.ok(bibles.translations.every((x) => x.id && x.name && x.providerId));
  const books = JSON.parse((await http.get_bibleBooks()).body);
  assert.equal(books.books[0].name, 'Genesis');
  const ref = JSON.parse((await http.get_bibleReference(req({ ref: 'John 3' }))).body);
  assert.deepEqual(ref, { entries: [], available: false, configured: false });
  assert.equal((await http.get_bibleReference(req({}))).status, 400);
  const dict = JSON.parse((await http.get_bibleDictionary(req({ q: 'shep' }))).body);
  assert.equal(dict.available, false);
  const status = JSON.parse((await http.get_bibleStatus()).body);
  assert.deepEqual(Object.values(status.keys).every((v) => typeof v === 'boolean'), true);
  assert.deepEqual(status.dictionary, { configured: false, ok: false, url: 'https://arisehub.myfaithtech.com' });
  assert.ok(status.bibles >= 4);
});
await test('a long or odd query is clipped, never thrown', async () => {
  const r = await http.get_bible(req({ ref: 'x'.repeat(5000), translation: ['BSB'] }));
  assert.ok(r.status === 502 || r.status === 400);
  const r2 = await http.get_bibleDictionary(req({ letter: 'shepherd' }));
  assert.equal(r2.status, 200);
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
