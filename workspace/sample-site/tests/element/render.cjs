/* node render.cjs <element.js> <outdir>  — renders arise-sermons with sample data, checks contracts */
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const [,, ELEMENT, OUT] = process.argv;
if (!ELEMENT || !OUT) { console.error('usage: node render.cjs <element.js> <outdir>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const js = fs.readFileSync(ELEMENT, 'utf8').replace(/<\/script/g, '<\\/script');
const page = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>t</title>
<style>html,body{margin:0;background:#0A0A0C}.hdr{height:76px;background:#0A0A0C;color:#fff;font:600 13px/76px Oswald,sans-serif;letter-spacing:.1em;padding:0 32px;text-transform:uppercase}</style></head>
<body><div class="hdr">Arise Church — header placeholder</div><arise-sermons id="el"></arise-sermons>
<script>${js}</script>
<script>
const el=document.getElementById('el');
el.setAttribute('data-latest-video', JSON.stringify({id:'QwF6-Sdrxoo',title:'WHOSE HAND IS IT IN? | Minister Herbert Perry',when:'Streamed 1 day ago',url:'https://www.youtube.com/watch?v=QwF6-Sdrxoo'}));
el.setAttribute('data-glory-video', JSON.stringify({id:'rKjR2PYdJUg',title:'Monday Night Glory Night',when:'Streamed 6 days ago',url:'https://www.youtube.com/watch?v=rKjR2PYdJUg&list=PLYhdT3QigNmY'}));
el.setAttribute('data-series-active','true'); el.setAttribute('data-series-title','Fruit of the Spirit'); el.setAttribute('data-series-link','https://www.youtube.com/playlist?list=PLMbBRRxhqveM'); el.setAttribute('data-series-button','Watch the Series');
</script></body></html>`;
const html = path.join(OUT, 'page.html'); fs.writeFileSync(html, page);
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
(async () => {
  const b = await chromium.launch();
  const info = { sizes: {}, errors: [], contract: {} };
  for (const [name, w, h] of [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1366, 900], ['wide', 1920, 1080]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errs = [];
    pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    pg.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await pg.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('file://') || u.startsWith('data:')) return route.continue();
      const m = u.match(/i\.ytimg\.com\/vi\/([^/]+)\/(\w+)\.jpg/);
      if (m) { const hh = hue(m[1]); const vert = m[2] === 'frame0'; const W = vert ? 405 : 640, H = vert ? 720 : 360;
        return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hh},18%,38%)"/><stop offset="1" stop-color="hsl(${(hh+40)%360},22%,14%)"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><text x="${W/2}" y="${H/2}" fill="rgba(255,255,255,.55)" font-family="sans-serif" font-size="${vert?28:34}" text-anchor="middle">${m[1]}</text></svg>` }); }
      if (/youtube\.com\/embed/.test(u)) return route.fulfill({ status: 200, contentType: 'text/html', body: '<body style="margin:0;background:#141418;color:#9a9aa0;font:14px sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:12px;box-sizing:border-box">' + u.replace(/^https:\/\/www\.youtube\.com\/embed\//, 'YouTube player: ') + '</body>' });
      if (/fonts\.googleapis/.test(u)) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      return route.abort();
    });
    await pg.goto('file://' + html); await pg.waitForTimeout(900);
    const m = await pg.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth, pageH: document.documentElement.scrollHeight,
      overflowing: [...document.querySelectorAll('arise-sermons *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && r.width > 0; }).slice(0, 8).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')),
      smallTaps: [...document.querySelectorAll('arise-sermons a, arise-sermons button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 40 || r.width < 40); }).length,
      h1s: document.querySelectorAll('arise-sermons h1').length }));
    info.sizes[name] = Object.assign({ errors: errs }, m);
    await pg.screenshot({ path: path.join(OUT, name + '-fold.png') });
    await pg.screenshot({ path: path.join(OUT, name + '-full.png'), fullPage: true });
    if (name === 'desktop') {
      const c = info.contract;
      const ids = ['ariseFeatured','ariseBadge','ariseLatestTitle','ariseLatestWhen','ariseLatestLink','ariseSeries','ariseSeriesTitle','ariseSeriesBtn','ariseGloryFrame','ariseGloryNow','aesClips','aesPlaylists','arisePlaylistFrame','arisePlaylistTitle','arisePlaylistCount','arisePlaylistLink'];
      c.missingIds = await pg.evaluate((ids) => ids.filter(i => !document.getElementById(i)), ids);
      const keys = ['sermons.hero.kicker','sermons.hero.heading','sermons.latest.heading','sermons.latest.strip','sermons.series.kicker','sermons.glory.kicker','sermons.glory.heading','sermons.glory.campus','sermons.glory.address','sermons.glory.button','site.times.main.glorynight','sermons.playlists.kicker','sermons.playlists.heading','sermons.playlists.lede','sermons.playlists.button','sermons.clips.kicker','sermons.clips.heading','sermons.clips.button','sermons.cta.kicker','sermons.cta.heading','site.times.sunday.main','sermons.cta.place1','site.times.sunday.second','sermons.cta.place2','sermons.cta.place3','sermons.cta.button'];
      c.missingCk = await pg.evaluate((keys) => keys.filter(k => !document.querySelector('[data-ck="' + k + '"]')), keys);
      c.state = await pg.evaluate(() => ({ featured: document.querySelector('#ariseFeatured') && document.querySelector('#ariseFeatured').getAttribute('src'), badge: document.querySelector('#ariseBadge') && document.querySelector('#ariseBadge').textContent.trim(), glory: document.querySelector('#ariseGloryFrame') && document.querySelector('#ariseGloryFrame').getAttribute('src'), seriesShown: !!document.querySelector('#ariseSeries') && getComputedStyle(document.querySelector('#ariseSeries')).display !== 'none', playlists: document.querySelectorAll('#aesPlaylists .pl').length, clips: document.querySelectorAll('#aesClips a').length, lazyFrames: [...document.querySelectorAll('arise-sermons iframe')].filter(f => f.id !== 'ariseFeatured' && f.getAttribute('loading') !== 'lazy').length, iframesWithoutTitle: [...document.querySelectorAll('arise-sermons iframe')].filter(f => !f.title).length, imgsWithoutAlt: [...document.querySelectorAll('arise-sermons img')].filter(i => !i.hasAttribute('alt')).length }));
      // playlist pick
      c.pick = await pg.evaluate(() => { const b = document.querySelectorAll('#aesPlaylists .pl')[2]; if (!b) return 'no .pl buttons'; b.click(); const f = document.querySelector('#arisePlaylistFrame'); return { src: f && f.getAttribute('src'), title: document.querySelector('#arisePlaylistTitle') && document.querySelector('#arisePlaylistTitle').textContent.trim(), selected: [...document.querySelectorAll('#aesPlaylists .pl')].map(x => x.getAttribute('aria-selected')).join('') }; });
      // live on / off
      c.live = await pg.evaluate(() => { const el = document.getElementById('el'); el.setAttribute('data-live-video', 'livelivel11'); const on = { src: document.querySelector('#ariseFeatured').getAttribute('src'), badge: document.querySelector('#ariseBadge').textContent.trim() }; el.setAttribute('data-live-video', ''); const off = { src: document.querySelector('#ariseFeatured').getAttribute('src'), badge: document.querySelector('#ariseBadge').textContent.trim() }; return { on, off }; });
      // series hidden
      c.seriesHidden = await pg.evaluate(() => { document.getElementById('el').setAttribute('data-series-active', 'false'); return getComputedStyle(document.querySelector('#ariseSeries')).display === 'none'; });
      // data-clips re-render + data-playlists re-render keeps selection
      c.rerender = await pg.evaluate(() => { const el = document.getElementById('el'); el.setAttribute('data-clips', JSON.stringify([{ id: 'abcdefghijk', title: 'New clip' }])); el.setAttribute('data-playlists', JSON.stringify([{ id: 'PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI', title: 'Sunday Sermons', count: 113, thumb: 'https://i.ytimg.com/vi/oYSMY9VJk1I/hqdefault.jpg' }, { id: 'PLa-Nxr2f-qHY', title: 'Apostle Bryant Sanders — Messages', count: 82, thumb: 'https://i.ytimg.com/vi/GfTvURWWlLg/hqdefault.jpg' }, { id: 'PLeDfl1m-bAzo', title: 'Pastor Vanessa Sanders — Messages', count: 45, thumb: 'https://i.ytimg.com/vi/8gUVgiIENWk/hqdefault.jpg' }])); return { clips: document.querySelectorAll('#aesClips a').length, playlists: document.querySelectorAll('#aesPlaylists .pl').length, stillSelected: [...document.querySelectorAll('#aesPlaylists .pl')].map(x => x.getAttribute('aria-selected')).join(''), frame: document.querySelector('#arisePlaylistFrame').getAttribute('src') }; });
      await pg.evaluate(() => { document.getElementById('el').setAttribute('data-content', JSON.stringify({ 'sermons.hero.heading': { text: 'CMS Heading' } })); });
      c.cmsApplied = await pg.evaluate(() => document.querySelector('[data-ck="sermons.hero.heading"]').textContent.trim() === 'CMS Heading');
      await pg.screenshot({ path: path.join(OUT, 'desktop-after-interactions.png'), fullPage: true });
    }
    await pg.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'info.json'), JSON.stringify(info, null, 1));
  console.log(JSON.stringify(info, null, 1));
})();
