// Headless Edge check of the Wix preview vs the live site (15 Sept 2026).
// Read-only: loads pages, never submits forms. Also measures loading times.
// Usage: node check.mjs --pages=home,sermons --sites=preview,live --vps=desktop,phone --workers=4 --repeat=1 --out=functional [--nocache]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ARGS = Object.fromEntries(process.argv.slice(2).map((a) => { const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] === undefined ? true : m[2]] : [a, true]; }));
/* Everything is worked out from where this file sits, so the check runs on any
   machine after a clone. Override with ARISE_CHECK_OUT, ARISE_EDGE_PROFILE or
   ARISE_EDGE if your Edge lives somewhere unusual. */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.ARISE_CHECK_OUT || path.join(HERE, 'preview-check-results');
const OUT = path.join(ROOT, ARGS.out || 'functional');
const PROFILE = process.env.ARISE_EDGE_PROFILE || path.join(os.tmpdir(), 'arise-edge-cdp-profile');
const EDGE = process.env.ARISE_EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = Number(ARGS.port || 9333);
const BASE = 'https://www.arisecenla.church/';
const PREVIEW_Q = ARGS.previewq ? String(ARGS.previewq) : 'siteRevision=2&branchId=b6c43d78-ae31-4a9e-b4da-68f4cefffe91';
const PAGES = [
  ['home', '', 'Home'], ['arise-alexandria', 'arise-alexandria', 'Arise Church Alexandria'], ['connect-groups', 'connect-groups', 'Connect Groups'],
  ['creative-arts', 'creative-arts', 'Creative Arts'], ['praise-worship', 'praise-worship', 'Praise and Worship'], ['musicians', 'musicians', 'Musicians'],
  ['production', 'production', 'Production'], ['sound', 'sound', 'Sound'], ['media-team', 'media-team', 'Media'],
  ['content', 'content', 'Social Media and Content'], ['classes', 'classes', 'Classes'], ['sermons', 'sermons', 'Past Sermons'],
  ['ministries', 'ministries', 'Ministries'], ['events', 'events', 'Events'], ['contact', 'contact', 'Contact'],
  ['serve', 'serve', 'Sign Up to Serve'], ['leaders', 'leaders', 'Meet our Leaders'], ['childrens', 'childrens', "Children's Ministry"],
  ['youth', 'youth', 'Youth Ministry'], ['outreach', 'outreach', 'Outreach'], ['lead-network', 'lead-network', 'Lead Network'],
  ['about', 'about', 'About'], ['arise-bible', 'arise-bible', 'Bible Search'], ['tithes-and-offerings', 'tithes-and-offerings', 'Give'],
  ['podcast', 'podcast', 'Podcast'], ['job-board', 'job-board', 'Job Board'],
  ['class-detail', 'class-detail/more-discipleship-course', 'MORE class page'],
  ['event-detail', 'events-1/the-lead-network-2026-camp-meeting-the-outpour', 'Event page (Wix Events app)'],
  ['class-open', 'classes#class-more-discipleship-course', 'Classes page opened on MORE']
];
const ONLY = ARGS.pages ? String(ARGS.pages).split(',') : null;
const SITES = String(ARGS.sites || 'preview,live').split(',');
const VPS = String(ARGS.vps || 'desktop,phone').split(',');
const WORKERS = Number(ARGS.workers || 4);
const REPEAT = Number(ARGS.repeat || 1);
const NOCACHE = !!ARGS.nocache;
const SHOTS = !ARGS.noshots;
const VIEWPORTS = {
  desktop: { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false, ua: null },
  phone: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1' }
};
const TAGS = ['arise-about', 'arise-alexandria', 'arise-bible', 'arise-childrens', 'arise-classes', 'arise-connect', 'arise-contact',
  'arise-creatives', 'arise-events', 'arise-footer', 'arise-header', 'arise-home', 'arise-leaders', 'arise-leadnetwork', 'arise-ministries',
  'arise-outreach', 'arise-sermons', 'arise-serve', 'arise-youth', 'arise-service-times-final', 'arise-form'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs in the page before any Wix script: records when each custom element appears, first shows text,
// and receives its data attributes, plus Largest Contentful Paint.
const TIMING_PROBE = '(' + function (tags) {
  var T = window.__ariseT = { el: {}, lcp: 0, lcpTag: '' };
  try {
    new PerformanceObserver(function (l) {
      l.getEntries().forEach(function (e) { T.lcp = Math.round(e.startTime); T.lcpTag = e.element ? e.element.tagName.toLowerCase() + (e.element.closest && e.element.closest(tags.join(',')) ? ' in ' + e.element.closest(tags.join(',')).tagName.toLowerCase() : '') : ''; });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}
  var start = Date.now();
  var iv = setInterval(function () {
    var now = Math.round(performance.now());
    document.querySelectorAll(tags.join(',')).forEach(function (e) {
      var k = e.tagName.toLowerCase() + (e.id ? '#' + e.id : '');
      var r = T.el[k] || (T.el[k] = {});
      if (r.inDom === undefined) {
        r.inDom = now; r.renders = 0;
        try { new MutationObserver(function () { r.renders++; r.lastRender = Math.round(performance.now()); }).observe(e, { childList: true }); } catch (x) {}
      }
      if (r.text === undefined && (e.innerText || '').length > 40) r.text = now;
      for (var i = 0; i < e.attributes.length; i++) {
        var n = e.attributes[i].name;
        if (n.indexOf('data-') === 0 && n !== 'data-cms-source' && r['attr:' + n] === undefined) r['attr:' + n] = now;
      }
    });
    if (Date.now() - start > 90000) clearInterval(iv);
  }, 100);
}.toString() + ')(' + JSON.stringify(TAGS) + ')';

const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + PROFILE + '-' + PORT, '--no-first-run',
  '--no-default-browser-check', '--disable-gpu', '--mute-audio', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

async function browserWs() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/version'); return (await r.json()).webSocketDebuggerUrl; } catch (e) { await sleep(500); }
  }
  throw new Error('Edge did not start');
}

const ws = new WebSocket(await browserWs());
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let nextId = 1;
const pending = new Map();
const listeners = new Map();
const childToParent = new Map();
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.rej(new Error(JSON.stringify(msg.error))) : p.res(msg.result); return; }
  const own = listeners.get(msg.sessionId);
  if (own) { own(msg); return; }
  const parent = childToParent.get(msg.sessionId);
  if (parent && listeners.get(parent)) listeners.get(parent)(msg);
});
function send(method, params, sessionId, timeout) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params: params || {}, sessionId }));
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error('timeout ' + method)); } }, timeout || 60000);
  });
}

const COLLECT = function () {
  const vis = (e) => !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
  const els = Array.prototype.filter.call(document.querySelectorAll('*'), (e) => e.tagName.toLowerCase().indexOf('arise-') === 0);
  const info = els.map((e) => ({
    tag: e.tagName.toLowerCase(),
    id: e.id || '',
    textLen: (e.innerText || '').length,
    dataCk: e.querySelectorAll('[data-ck]').length,
    attrs: Array.prototype.map.call(e.attributes, (a) => a.name + ':' + a.value.length),
    imgs: e.querySelectorAll('img').length,
    brokenImgs: Array.prototype.filter.call(e.querySelectorAll('img'), (i) => i.complete && i.naturalWidth === 0 && vis(i)).map((i) => i.currentSrc || i.src).slice(0, 12),
    imgSources: Array.prototype.map.call(e.querySelectorAll('img'), (i) => ({ src: (i.currentSrc || i.src).slice(0, 220), natural: i.naturalWidth + 'x' + i.naturalHeight, shown: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height), loading: i.loading || '' })).slice(0, 40),
    tabsVisible: Array.prototype.filter.call(e.querySelectorAll('[role=tab]'), vis).map((t) => t.innerText.trim().replace(/\s+/g, ' ')),
    tabsHidden: Array.prototype.filter.call(e.querySelectorAll('[role=tab]'), (t) => !vis(t)).map((t) => t.textContent.trim().replace(/\s+/g, ' ').slice(0, 60)),
    joinButtonsVisible: Array.prototype.filter.call(e.querySelectorAll('.g__go'), vis).length,
    servePositions: e.querySelectorAll('.pos').length,
    clips: Array.prototype.map.call(e.querySelectorAll('#aesClips a[href]'), (a) => { const im = a.querySelector('img'); return { href: a.href, title: a.innerText.trim().slice(0, 80), img: im ? (im.naturalWidth + 'x' + im.naturalHeight) : '' }; }),
    links: Array.prototype.map.call(e.querySelectorAll('a[href]'), (a) => ({ t: a.innerText.trim().replace(/\s+/g, ' ').slice(0, 50), h: a.href, target: a.target || '', visible: vis(a) })),
    text: (e.innerText || '').slice(0, 9000)
  }));
  const body = document.body ? document.body.innerText : '';
  const docW = document.documentElement.scrollWidth;
  const nav = (performance.getEntriesByType('navigation')[0] || {});
  const res = performance.getEntriesByType('resource');
  return {
    title: document.title, url: location.href, arise: info, bodyLen: body.length,
    sundaySunday: /Sunday\s+Sunday/i.test(body),
    codeLeak: (body.match(/(\$w\(|=>|function\s*\(|data-ck=|undefined|\[object Object\]|NaN)/g) || []).slice(0, 10),
    overflowX: docW > window.innerWidth + 1 ? docW - window.innerWidth : 0,
    height: document.documentElement.scrollHeight,
    timing: {
      ttfb: Math.round(nav.responseStart || 0), domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0),
      htmlKB: Math.round((nav.encodedBodySize || 0) / 1024),
      lcp: (window.__ariseT || {}).lcp || 0, lcpTag: (window.__ariseT || {}).lcpTag || '',
      elements: (window.__ariseT || {}).el || {},
      resources: res.length,
      byType: res.reduce((o, r) => { const k = r.initiatorType; o[k] = o[k] || { n: 0, kb: 0 }; o[k].n++; o[k].kb += Math.round((r.transferSize || r.encodedBodySize || 0) / 1024); return o; }, {}),
      webMethods: res.filter((r) => /_webMethods|\.jsw\/|\.web\.js\//.test(r.name)).map((r) => ({ name: decodeURIComponent(r.name.split('?')[0].split('/').slice(-2).join('/')), start: Math.round(r.startTime), ms: Math.round(r.duration), kb: Math.round((r.transferSize || 0) / 1024) })),
      customElementScripts: res.filter((r) => /custom-elements|arise-[a-z]+\.js/.test(r.name)).map((r) => ({ name: r.name.split('?')[0].split('/').pop(), start: Math.round(r.startTime), ms: Math.round(r.duration), kb: Math.round((r.transferSize || 0) / 1024) })),
      biggest: res.slice().sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 12).map((r) => ({ name: r.name.split('?')[0].slice(-110), kb: Math.round((r.transferSize || 0) / 1024), type: r.initiatorType })),
      slowest: res.slice().sort((a, b) => b.duration - a.duration).slice(0, 10).map((r) => ({ name: r.name.split('?')[0].slice(-110), ms: Math.round(r.duration), start: Math.round(r.startTime) }))
    },
    bodyText: body.slice(0, 20000)
  };
};

async function runPage(site, key, slug, name, vpName, run) {
  const vp = VIEWPORTS[vpName];
  // a slug may carry a #hash (e.g. classes#class-more): the query goes before it
  const hashAt = slug.indexOf('#');
  const slugPath = hashAt >= 0 ? slug.slice(0, hashAt) : slug;
  const slugHash = hashAt >= 0 ? slug.slice(hashAt) : '';
  const url = BASE + slugPath + (site === 'preview' ? '?' + PREVIEW_Q : '') + slugHash;
  const rec = { site, key, slug, name, viewport: vpName, run, nocache: NOCACHE, url, console: [], exceptions: [], failedRequests: [], backendCalls: [], started: new Date().toISOString() };
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  let loaded = false;
  let navT = 0;
  const reqs = new Map();
  const BACKEND_RE = /_webMethods|wix-code-public-dispatcher|\.web\.js|\.jsw/;
  listeners.set(sessionId, (msg) => {
    const p = msg.params || {};
    if (msg.method === 'Network.requestWillBeSent' && p.type === 'Document' && msg.sessionId === sessionId && !navT) navT = p.timestamp;
    if (msg.method === 'Network.requestWillBeSent' && p.request && BACKEND_RE.test(p.request.url)) {
      reqs.set(msg.sessionId + p.requestId, { url: p.request.url, t: p.timestamp });
    } else if ((msg.method === 'Network.loadingFinished' || msg.method === 'Network.loadingFailed') && reqs.has(msg.sessionId + p.requestId)) {
      const q = reqs.get(msg.sessionId + p.requestId);
      reqs.delete(msg.sessionId + p.requestId);
      const m = decodeURIComponent(q.url.split('?')[0]).match(/([A-Za-z0-9_-]+\.(?:web\.js|jsw))\/([A-Za-z0-9_]+)/);
      rec.backendCalls.push({ fn: m ? m[1] + '/' + m[2] : q.url.split('?')[0].slice(-80), startMs: navT ? Math.round((q.t - navT) * 1000) : null,
        ms: Math.round((p.timestamp - q.t) * 1000), kb: Math.round((p.encodedDataLength || 0) / 1024), failed: msg.method === 'Network.loadingFailed' });
    }
    if (msg.method === 'Page.loadEventFired') loaded = true;
    else if (msg.method === 'Runtime.consoleAPICalled') rec.console.push({ type: p.type, text: (p.args || []).map((a) => a.value !== undefined ? String(a.value) : (a.description || a.type)).join(' ').slice(0, 400), worker: msg.sessionId !== sessionId });
    else if (msg.method === 'Runtime.exceptionThrown') rec.exceptions.push(String(((p.exceptionDetails || {}).exception || {}).description || (p.exceptionDetails || {}).text || 'exception').slice(0, 400));
    else if (msg.method === 'Log.entryAdded' && (p.entry || {}).level === 'error') rec.console.push({ type: 'log-error', text: (p.entry.text + ' ' + (p.entry.url || '')).slice(0, 400) });
    else if (msg.method === 'Network.responseReceived' && p.response && p.response.status >= 400) rec.failedRequests.push(p.response.status + ' ' + p.response.url.slice(0, 200));
    else if (msg.method === 'Network.loadingFailed' && !p.canceled) rec.failedRequests.push('FAILED ' + (p.errorText || '') + ' ' + (p.type || ''));
    else if (msg.method === 'Target.attachedToTarget') {
      childToParent.set(p.sessionId, sessionId);
      send('Runtime.enable', {}, p.sessionId).catch(() => {});
      send('Network.enable', {}, p.sessionId).catch(() => {});
      send('Runtime.runIfWaitingForDebugger', {}, p.sessionId).catch(() => {});
    }
  });
  try {
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Log.enable', {}, sessionId);
    await send('Network.enable', {}, sessionId);
    if (NOCACHE) await send('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
    await send('Page.addScriptToEvaluateOnNewDocument', { source: TIMING_PROBE }, sessionId);
    await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, sessionId);
    await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: vp.deviceScaleFactor, mobile: vp.mobile }, sessionId);
    if (vp.ua) { await send('Emulation.setUserAgentOverride', { userAgent: vp.ua }, sessionId); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sessionId); }
    const t0 = Date.now();
    await send('Page.navigate', { url }, sessionId);
    for (let i = 0; i < 120 && !loaded; i++) await sleep(250);
    rec.loadEvent = loaded;
    rec.loadWallMs = Date.now() - t0;
    await sleep(8000);
    for (let i = 0; i < 30; i++) {
      const r = await send('Runtime.evaluate', { expression: 'window.scrollBy(0, Math.round(window.innerHeight*0.8)); (window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 5', returnByValue: true }, sessionId);
      await sleep(450);
      if (r.result.value) break;
    }
    await sleep(4000);
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' }, sessionId);
    await sleep(2000);
    if (slug === 'arise-bible') {
      const b = await send('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression:
        '(async function(){var i=document.getElementById("abiRef"),g=document.getElementById("abiGo");if(!i||!g)return {found:false};' +
        'i.value="John 3:16";i.dispatchEvent(new Event("input",{bubbles:true}));g.click();await new Promise(function(r){setTimeout(r,7000)});' +
        'var el=i.closest("arise-bible")||document.body;return {found:true,text:el.innerText.slice(0,3000)}})()' }, sessionId, 30000);
      rec.bibleSearch = b.result.value;
    }
    const c = await send('Runtime.evaluate', { expression: '(' + COLLECT.toString() + ')()', returnByValue: true }, sessionId);
    Object.assign(rec, c.result.value || { collectError: JSON.stringify(c.exceptionDetails || {}).slice(0, 500) });
    if (SHOTS) {
      const lm = await send('Page.getLayoutMetrics', {}, sessionId);
      const h = Math.min(Math.ceil(lm.cssContentSize.height), vpName === 'phone' ? 16000 : 12000);
      const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 55, captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: vp.width, height: h, scale: vpName === 'phone' ? 0.5 : 0.6 } }, sessionId, 90000);
      const shotPath = path.join(OUT, site, key + '-' + vpName + (REPEAT > 1 ? '-r' + run : '') + '.jpg');
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
      rec.screenshot = shotPath;
    }
  } catch (e) {
    rec.error = String(e && e.message || e);
  } finally {
    listeners.delete(sessionId);
    await send('Target.closeTarget', { targetId }).catch(() => {});
  }
  rec.failedRequests = Array.from(new Set(rec.failedRequests)).slice(0, 40);
  fs.writeFileSync(path.join(OUT, site, key + '-' + vpName + (REPEAT > 1 ? '-r' + run : '') + '.json'), JSON.stringify(rec, null, 1));
  return rec;
}

SITES.forEach((s) => fs.mkdirSync(path.join(OUT, s), { recursive: true }));
const jobs = [];
for (let run = 1; run <= REPEAT; run++) {
  PAGES.filter((p) => !ONLY || ONLY.indexOf(p[0]) >= 0).forEach(([key, slug, name]) =>
    VPS.forEach((vp) => SITES.forEach((site) => jobs.push([site, key, slug, name, vp, run]))));
}
let done = 0;
const summary = [];
async function worker() {
  while (jobs.length) {
    const j = jobs.shift();
    const r = await runPage.apply(null, j);
    done++;
    const t = r.timing || {};
    const els = t.elements || {};
    const firstText = Object.values(els).map((e) => e.text).filter((x) => x !== undefined);
    summary.push({ site: r.site, page: r.name, viewport: r.viewport, run: r.run, error: r.error || '',
      arise: (r.arise || []).map((a) => a.tag + '(' + a.textLen + ')').join(' '),
      exceptions: r.exceptions.length, consoleWarnErr: r.console.filter((c) => c.type === 'warning' || c.type === 'error' || c.type === 'log-error').length,
      brokenImgs: (r.arise || []).reduce((n, a) => n + a.brokenImgs.length, 0), overflowX: r.overflowX, sundaySunday: r.sundaySunday,
      ttfb: t.ttfb, dcl: t.domContentLoaded, load: t.load, lcp: t.lcp, lcpTag: t.lcpTag,
      firstElementText: firstText.length ? Math.min.apply(null, firstText) : null,
      backend: (r.backendCalls || []).map((w) => w.fn + ' @' + w.startMs + ' ' + w.ms + 'ms ' + w.kb + 'KB'),
      renders: Object.keys(els).map((k) => k + ' x' + els[k].renders + ' last@' + (els[k].lastRender || '-')),
      pageCodeLogs: r.console.filter((c) => /^[A-Z][A-Za-z' &!]+: |^Site content/.test(c.text)).map((c) => c.text).slice(0, 12) });
    console.log(done + '/' + (done + jobs.length) + ' ' + r.site + ' ' + r.key + ' ' + r.viewport + ' r' + r.run + (r.error ? ' ERROR ' + r.error : '') + ' lcp=' + t.lcp + ' text=' + (firstText.length ? Math.min.apply(null, firstText) : '-'));
  }
}
await Promise.all(Array.from({ length: WORKERS }, worker));
fs.writeFileSync(path.join(OUT, 'summary.json'), JSON.stringify(summary, null, 1));
ws.close();
edge.kill();
console.log('DONE ' + done);
process.exit(0);
