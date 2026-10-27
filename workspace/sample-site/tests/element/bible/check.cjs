/* renders the preview at four sizes, exercises the reader, reports errors + contract */
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const HTML = path.join(__dirname, 'bible-preview.html');
const OUT = process.argv[2] || path.join(require('os').tmpdir(), 'arise-bible-shots'); fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const info = { sizes: {}, contract: {} };
  for (const [name, w, h] of [['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1366, 900], ['wide', 1920, 1080]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const errs = [];
    pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    pg.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await pg.route('**/*', (route) => {
      const u = route.request().url();
      if (u.startsWith('file://') || u.startsWith('data:')) return route.continue();
      if (/fonts\.googleapis/.test(u)) return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
      return route.abort();
    });
    await pg.goto('file://' + HTML); await pg.waitForTimeout(1800);
    const m = await pg.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth, pageH: document.documentElement.scrollHeight,
      overflowing: [...document.querySelectorAll('arise-bible *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && r.width > 0; }).slice(0, 8).map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '')),
      smallTaps: [...document.querySelectorAll('arise-bible a, arise-bible button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 40 || r.width < 40); }).map(e => (e.id || e.className)).slice(0, 10),
      verses: document.querySelectorAll('#abiVerses .verse').length, bibles: document.querySelectorAll('#abiBible option').length, ref: document.querySelector('#abiRefText').textContent,
      status: document.querySelector('#abiStatus').textContent.trim(), trans: document.querySelector('#abiTransName').textContent }));
    info.sizes[name] = Object.assign({ errors: errs }, m);
    await pg.screenshot({ path: path.join(OUT, name + '-fold.png') });
    await pg.screenshot({ path: path.join(OUT, name + '-full.png'), fullPage: true });
    if (name === 'desktop' || name === 'phone') {
      const c = {};
      // chip -> Psalm 23
      await pg.click('.chip:nth-child(2)'); await pg.waitForTimeout(900);
      c.psalm = await pg.evaluate(() => ({ ref: document.querySelector('#abiRefText').textContent, verses: document.querySelectorAll('#abiVerses .verse').length, chapterSel: document.querySelector('#abiChapter').value, bookSel: document.querySelector('#abiBook').value, url: location.search }));
      // next chapter
      await pg.click('#abiNext'); await pg.waitForTimeout(900);
      c.next = await pg.evaluate(() => document.querySelector('#abiRefText').textContent);
      // back to John 3 whole chapter, then study tab
      await pg.fill('#abiRef', 'John 3'); await pg.press('#abiRef', 'Enter'); await pg.waitForTimeout(1200);
      await pg.click('[data-to="abiStudy"]'); await pg.waitForTimeout(900);
      c.study = await pg.evaluate(() => ({ active: document.querySelector('#abiTrack > .panel.is-active').id, notes: document.querySelectorAll('#abiNotes li').length, dict: document.querySelectorAll('#abiDict li').length, from: document.querySelector('#abiNotesFrom').textContent, deckH: document.querySelector('#abiDeck').style.height }));
      await pg.screenshot({ path: path.join(OUT, name + '-study.png'), fullPage: true });
      await pg.click('#abiDict .dict__more'); await pg.waitForTimeout(700);
      c.expanded = await pg.evaluate(() => document.querySelector('#abiDict .dict__full').hidden === false && document.querySelectorAll('#abiDict .dict__full h4').length);
      // listen tab with BSB
      await pg.click('[data-to="abiListen"]'); await pg.waitForTimeout(700);
      c.listenNoAudio = await pg.evaluate(() => ({ status: document.querySelector('#abiListenStatus').textContent, switchBtn: document.querySelector('#abiListenSwitch').textContent, audioHidden: document.querySelector('#abiAudio').hidden }));
      await pg.click('#abiListenSwitch'); await pg.waitForTimeout(1200);
      c.listenAudio = await pg.evaluate(() => ({ active: document.querySelector('#abiTrack > .panel.is-active').id, narrators: document.querySelectorAll('#abiNarrators button').length, audioHidden: document.querySelector('#abiAudio').hidden, trans: document.querySelector('#abiTransName').textContent, who: document.querySelector('#abiPlayerWho').textContent }));
      await pg.screenshot({ path: path.join(OUT, name + '-listen.png'), fullPage: true });
      // bibles wall
      await pg.click('[data-to="abiBibles"]'); await pg.waitForTimeout(700);
      c.wall = await pg.evaluate(() => ({ cards: document.querySelectorAll('#abiBibleWall .bib').length, pressed: document.querySelectorAll('#abiBibleWall .bib[aria-pressed="true"]').length, count: document.querySelector('#abiBibleCount').textContent }));
      await pg.screenshot({ path: path.join(OUT, name + '-bibles.png'), fullPage: true });
      await pg.fill('#abiBibleFilter', 'king'); await pg.waitForTimeout(300);
      c.filtered = await pg.evaluate(() => document.querySelectorAll('#abiBibleWall .bib').length);
      await pg.click('#abiBibleWall .bib'); await pg.waitForTimeout(1200);
      c.picked = await pg.evaluate(() => ({ active: document.querySelector('#abiTrack > .panel.is-active').id, trans: document.querySelector('#abiTransName').textContent, sel: document.querySelector('#abiBible').selectedOptions[0].textContent }));
      // bad reference
      await pg.fill('#abiRef', 'Hezekiah 3'); await pg.press('#abiRef', 'Enter'); await pg.waitForTimeout(900);
      c.bad = await pg.evaluate(() => ({ status: document.querySelector('#abiStatus').textContent, err: document.querySelector('#abiStatus').classList.contains('status--err'), versesKept: document.querySelectorAll('#abiVerses .verse').length }));
      // strap pin while scrolling
      await pg.evaluate(() => window.scrollTo(0, 700)); await pg.waitForTimeout(1200);
      c.pin = await pg.evaluate(() => { const s = document.querySelector('#abiStrap'); const r = s.getBoundingClientRect(); return { pinned: s.classList.contains('pinned'), top: Math.round(r.top), styleTop: s.style.top, headerBottom: Math.round(document.querySelector('#siteHeader').getBoundingClientRect().bottom) }; });
      await pg.screenshot({ path: path.join(OUT, name + '-scrolled.png') });
      c.keys = await pg.evaluate(() => ['bible.hero.kicker','bible.hero.heading','bible.search.kicker','bible.search.heading','bible.form.versionLabel','bible.form.verseLabel','bible.form.button','bible.suggest.item1','bible.suggest.item6','bible.study.kicker','bible.study.heading','bible.study.lede','bible.listen.kicker','bible.listen.heading','bible.listen.lede','bible.bibles.kicker','bible.bibles.heading','bible.bibles.lede','bible.cta.kicker','bible.cta.heading','site.times.sunday.main','bible.cta.place1','site.times.sunday.second','bible.cta.place2','site.times.main.glorynight','bible.cta.place3','bible.cta.button'].filter(k => !document.querySelector('[data-ck="' + k + '"]')));
      info.contract[name] = c;
    }
    await pg.close();
  }
  await b.close();
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(info, null, 2));
  console.log(JSON.stringify(info, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
