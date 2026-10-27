/* node tour.cjs <element.js> <outdir> : visit every room at desktop and phone, screenshot, test keys and swipe */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [,, ELEMENT, OUT] = process.argv; fs.mkdirSync(OUT, { recursive: true });
const html = path.join(OUT, 'page.html');
// reuse the harness page builder by rendering it once
const js = fs.readFileSync(ELEMENT, 'utf8').replace(/<\/script/g, '<\\/script');
fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#060608"><div style="height:76px;background:#0A0A0C;color:#fff;font:600 13px/76px Oswald,sans-serif;letter-spacing:.1em;padding:0 32px;text-transform:uppercase">Arise Church — header placeholder</div><arise-sermons id="el"></arise-sermons>
<script>${js}</script><script>
const el=document.getElementById('el');
el.setAttribute('data-latest-video', JSON.stringify({id:'QwF6-Sdrxoo',title:'WHOSE HAND IS IT IN? | Minister Herbert Perry',when:'Streamed 1 day ago'}));
el.setAttribute('data-glory-video', JSON.stringify({id:'rKjR2PYdJUg',title:'Monday Night Glory Night',when:'Streamed 6 days ago'}));
el.setAttribute('data-series-active','true'); el.setAttribute('data-series-title','Fruit of the Spirit'); el.setAttribute('data-series-link','https://www.youtube.com/playlist?list=PLMbBRRxhqveM'); el.setAttribute('data-series-button','Watch the Series');
</script><div style="height:300px;background:#111;color:#666;font:14px sans-serif;padding:24px">site footer placeholder</div></body></html>`);
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [name, w, h, touch] of [['desktop', 1366, 900, false], ['phone', 390, 844, true]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const errs = []; pg.on('pageerror', (e) => errs.push(e.message)); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.route('**/*', (route) => { const u = route.request().url(); if (u.startsWith('file://') || u.startsWith('data:')) return route.continue();
      const m = u.match(/i\.ytimg\.com\/vi\/([^/]+)\/(\w+)\.jpg/);
      if (m) { const hh = hue(m[1]); const vert = m[2] === 'frame0'; const W = vert ? 405 : 640, H = vert ? 720 : 360; return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hh},18%,38%)"/><stop offset="1" stop-color="hsl(${(hh+40)%360},22%,14%)"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/></svg>` }); }
      if (/youtube\.com\/embed/.test(u)) return route.fulfill({ status: 200, contentType: 'text/html', body: '<body style="margin:0;background:#141418;color:#9a9aa0;font:14px sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:12px;box-sizing:border-box">' + u.replace(/^https:\/\/www\.youtube\.com\/embed\//, 'YouTube player: ') + '</body>' });
      if (/fonts\.googleapis/.test(u)) return route.fulfill({ status: 200, contentType: 'text/css', body: '' }); return route.abort(); });
    await pg.goto('file://' + html); await pg.waitForTimeout(900);
    const rooms = {};
    for (const id of ['aesStage', 'ariseSeries', 'aesGlory', 'aesSermons', 'aesClipsSect']) {
      await pg.click('#aesTab-' + id); await pg.waitForTimeout(800);
      rooms[id] = await pg.evaluate((id) => { const p = document.getElementById(id); const d = document.getElementById('aesDeck'); return { active: p.classList.contains('is-active'), deckH: d.offsetHeight, panelH: p.offsetHeight, tabSel: document.querySelector('#aesTab-' + id).getAttribute('aria-selected'), inertOthers: [...document.querySelectorAll('#aesTrack > .panel')].filter(x => x !== p && !x.hasAttribute('inert')).length, scrollW: document.documentElement.scrollWidth, pageH: document.documentElement.scrollHeight }; }, id);
      await pg.screenshot({ path: path.join(OUT, name + '-' + id + '.png'), fullPage: true });
    }
    // keyboard on the strap: Home then ArrowRight twice -> Glory
    await pg.focus('#aesTab-aesClipsSect'); await pg.keyboard.press('Home'); await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(700);
    const keys = await pg.evaluate(() => ({ active: document.querySelector('#aesTrack > .panel.is-active').id, focused: document.activeElement && document.activeElement.id }));
    // playlist keyboard once the Sermons room is on stage
    await pg.click('#aesTab-aesSermons'); await pg.waitForTimeout(700);
    await pg.focus('#aesPlaylists .pl[aria-selected="true"]'); await pg.keyboard.press('ArrowRight'); await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(200);
    const plKeys = await pg.evaluate(() => ({ selected: [...document.querySelectorAll('#aesPlaylists .pl')].findIndex(x => x.getAttribute('aria-selected') === 'true'), focused: document.activeElement && document.activeElement.className }));
    let swipe = null;
    if (touch) {
      await pg.click('#aesTab-aesStage'); await pg.waitForTimeout(700);
      const box = await pg.locator('#aesDeck').boundingBox();
      const y = box.y + 60; // on the stage backdrop, not a rail
      await pg.touchscreen.tap(box.x + 300, y); // noop tap
      // simulate a swipe with pointer events via CDP touch
      const cdp = await pg.context().newCDPSession(pg);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 320, y }] });
      for (let i = 1; i <= 6; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 320 - i * 40, y }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await pg.waitForTimeout(800);
      swipe = await pg.evaluate(() => document.querySelector('#aesTrack > .panel.is-active').id);
    }
    // pin: scroll into the Sermons room and check the strap stays at the top and the CTA is still below the deck
    await pg.click('#aesTab-aesSermons'); await pg.waitForTimeout(700);
    await pg.evaluate(() => window.scrollTo(0, 700)); await pg.waitForTimeout(300);
    const pin = await pg.evaluate(() => { const s = document.querySelector('#aesStrap').getBoundingClientRect(); const c = document.querySelector('#aesCta'); const d = document.querySelector('#aesDeck').getBoundingClientRect(); return { strapTop: Math.round(s.top), pinned: document.querySelector('#aesStrap').classList.contains('pinned'), ctaAfterDeck: Math.round(c.getBoundingClientRect().top - d.bottom), ctaVisibleTab: !!document.querySelector('#aesTab-aesCta') }; });
    await pg.evaluate(() => window.scrollTo(0, 99999)); await pg.waitForTimeout(300);
    pin.atBottom = await pg.evaluate(() => { const s = document.querySelector('#aesStrap').getBoundingClientRect(); return { strapTop: Math.round(s.top), transform: document.querySelector('#aesStrap').style.transform }; });
    await pg.evaluate(() => window.scrollTo(0, 0)); await pg.waitForTimeout(300);
    pin.backAtTop = await pg.evaluate(() => ({ pinned: document.querySelector('#aesStrap').classList.contains('pinned'), spacer: document.querySelector('#aesStrapSpacer').style.height }));
    await pg.screenshot({ path: path.join(OUT, name + '-pinned.png') });
    out[name] = { errors: errs, rooms, keys, plKeys, swipe, pin };
    await pg.close();
  }
  await b.close(); console.log(JSON.stringify(out, null, 1));
})();
