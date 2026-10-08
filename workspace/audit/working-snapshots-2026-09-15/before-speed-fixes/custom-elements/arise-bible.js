/* ===========================================================================
   ARISE CHURCH -- BIBLE SEARCH
   File: public/custom-elements/arise-bible.js
   Tag:  arise-bible
   Fixed 2026-09-14: header install notes clarified (no page code needed; file location)
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-bible.json)

   SELF-CONTAINED. No backend, no page code, no .jsw file.

   bible-api.com sends `access-control-allow-origin: *`, so the element calls
   it straight from the browser. That removes backend/bibleApis.jsw and the
   Bible Search page code entirely -- one file replaces all three.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-bible.js
      -> paste this whole file
   2. Editor -> Bible Search page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-bible.js
      Tag Name: arise-bible
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Save, then PUBLISH. Check the LIVE page.

   The Bible Search page needs NO page code for this element, and this file
   must exist at public/custom-elements/arise-bible.js (the element's Velo file).
   The old Bible Search page code and backend/bibleApis.jsw are not used by it;
   leave them alone until the new page is confirmed working on the LIVE site.

   All 16 translations are the ones your existing tool supports. NIV and ESV
   are not available -- bible-api.com does not serve copyrighted translations.
   =========================================================================== */

const ABI_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const VERSIONS = [
  ['kjv',        'King James Version (KJV)'],
  ['web',        'World English Bible (WEB)'],
  ['asv',        'American Standard Version (ASV)'],
  ['bbe',        'Bible in Basic English (BBE)'],
  ['ylt',        "Young's Literal Translation (YLT)"],
  ['darby',      'Darby Bible'],
  ['dra',        'Douay-Rheims 1899 American Edition (DRA)'],
  ['oeb-cw',     'Open English Bible (Commonwealth)'],
  ['webbe',      'World English Bible (British Edition)'],
  ['oeb-us',     'Open English Bible (US Edition)'],
  ['cherokee',   'Cherokee New Testament'],
  ['cuv',        'Chinese Union Version'],
  ['clementine', 'Clementine Latin Vulgate'],
  ['almeida',    'Jo\u00e3o Ferreira de Almeida (Portuguese)'],
  ['rccv',       'Romanian Corrected Cornilescu Version'],
  ['bkr',        'Bible kralick\u00e1 (Czech)']
];

/* A few starting points for people who don't know where to begin. */
const SUGGESTIONS = [
  ['John 3:16',            'john 3:16'],
  ['Psalm 23',             'psalm 23'],
  ['Romans 8:28',          'romans 8:28'],
  ['1 Corinthians 13:4-7', '1 corinthians 13:4-7'],
  ['Philippians 4:6-7',    'philippians 4:6-7'],
  ['Isaiah 40:31',         'isaiah 40:31']
];

const ABI_CSS = `
arise-bible{display:block;width:100%}
.abi *{box-sizing:border-box;margin:0;padding:0}
.abi{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.abi .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.abi h1,.abi h2,.abi h3,.abi h4{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.abi h1{font-size:clamp(40px,7.4vw,84px)}
.abi h2{font-size:clamp(26px,3.8vw,46px)}
.abi h4{font-size:13px;letter-spacing:.12em}
.abi p{font-size:clamp(15.5px,1.4vw,17px)}

.abi .mark{display:flex;align-items:center;margin-bottom:18px}
.abi .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.abi .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
.abi .mark--l .kicker{color:var(--redL)}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .abi .mark{flex-wrap:nowrap;align-items:flex-start}
  .abi .mark::before{margin-right:124px;margin-top:5px}
  .abi .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}

.abi .sect{padding:var(--sect) 0;background:var(--paper)}
.abi .sect--ink{background:var(--ink)}
.abi .sect--ink h2{color:#fff}
.abi .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.abi .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.abi .phead h1{color:#fff;position:relative;z-index:1}

/* search panel */
.abi .panel{background:var(--ink);padding:clamp(28px,4vw,48px)}
.abi .row{display:grid;grid-template-columns:230px 1fr auto;gap:20px;align-items:end}
@media(max-width:820px){.abi .row{grid-template-columns:1fr}}
.abi .field label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(255,255,255,.72);margin-bottom:9px}
.abi .field select,.abi .field input{width:100%;background:transparent;border:0;
  border-bottom:1.5px solid rgba(255,255,255,.32);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:17px;color:#fff}
.abi .field select option{background:#0A0A0C;color:#fff}
.abi .field input::placeholder{color:rgba(255,255,255,.4)}
.abi .field select:focus,.abi .field input:focus{outline:none;border-bottom-color:var(--red)}
.abi .btn{display:inline-block;padding:15px 34px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;border:1.5px solid var(--red);background:var(--red);color:#fff;
  font-family:inherit;cursor:pointer;transition:background .18s,color .18s,border-color .18s}
.abi .btn:hover{background:transparent;color:#fff;border-color:#fff}
.abi .btn[disabled]{opacity:.55;pointer-events:none}
.abi .btn:focus-visible,.abi .chip:focus-visible,.abi select:focus-visible,.abi input:focus-visible{
  outline:3px solid var(--red);outline-offset:3px}

.abi .chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}
.abi .chip{background:transparent;border:1px solid rgba(255,255,255,.28);color:rgba(255,255,255,.86);
  font-family:inherit;font-size:12px;font-weight:400;letter-spacing:.1em;padding:8px 14px;
  cursor:pointer;transition:background .18s,border-color .18s}
.abi .chip:hover{background:var(--red);border-color:var(--red);color:#fff}

/* result */
.abi .out{margin-top:34px;padding-top:28px;border-top:1px solid var(--ruleD);min-height:96px}
.abi .out__status{font-size:14.5px;color:rgba(255,255,255,.66);letter-spacing:.03em}
.abi .out__ref{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:8px 18px;margin-bottom:22px}
.abi .out__ref span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}
.abi .verse{display:flex;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.08)}
.abi .verse:last-of-type{border-bottom:0}
.abi .verse b{flex:0 0 auto;font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:14px;
  color:var(--redL);min-width:26px;padding-top:3px}
.abi .verse p{color:rgba(255,255,255,.9);font-size:clamp(16px,1.6vw,18.5px);line-height:1.75}
.abi .cite{margin-top:22px;font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,255,255,.6)}
.abi .err{color:var(--redL);font-size:15px}

.abi .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.abi .cta h2,.abi .cta p{color:#fff}
.abi .cta p{margin-top:12px;max-width:46ch}
.abi .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.abi .cta .kicker{color:#fff}
.abi .cta a{display:inline-block;padding:15px 32px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;background:#fff;border:1.5px solid #fff;
  color:var(--red);flex:0 0 auto;transition:background .18s,color .18s}
.abi .cta a:hover{background:transparent;color:#fff}
.abi .cta__b{flex:1 1 320px}

@media(prefers-reduced-motion:reduce){.abi *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .abi{background:#fff;color:#0A0A0C}
  .abi .sect{background:#fff}
  .abi .sect--ink,.abi .phead,.abi .panel{background:#0A0A0C}
}
`;

function abiEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

class AriseBible extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { if (this._built) this.applyContent(); }

  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('abi-fonts')) {
      const l = document.createElement('link');
      l.id = 'abi-fonts'; l.rel = 'stylesheet'; l.href = ABI_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('abi-css')) {
      const s = document.createElement('style');
      s.id = 'abi-css'; s.innerHTML = ABI_CSS;
      document.head.appendChild(s);
    }

    const opts = VERSIONS.map(function (v) {
      return '<option value="' + v[0] + '"' + (v[0] === 'kjv' ? ' selected' : '') + '>' + abiEsc(v[1]) + '</option>';
    }).join('');

    const chips = SUGGESTIONS.map(function (s, i) {
      return '<button type="button" class="chip" data-ref="' + abiEsc(s[1]) + '"><span data-ck="bible.suggest.item' + (i + 1) + '">' + abiEsc(s[0]) + '</span></button>';
    }).join('');

    this.innerHTML =
      '<div class="abi">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="bible.hero.kicker">Resources</span></div>' +
          '<h1 data-ck="bible.hero.heading">Bible Search</h1>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="bible.search.kicker">Look Up A Passage</span></div>' +
          '<h2 data-ck="bible.search.heading">Read It<br>For Yourself</h2>' +

          '<div class="panel" style="margin-top:44px">' +
            '<div class="row">' +
              '<div class="field"><label for="abiVer" data-ck="bible.form.versionLabel">Version</label>' +
                '<select id="abiVer">' + opts + '</select></div>' +
              '<div class="field"><label for="abiRef" data-ck="bible.form.verseLabel">Verse</label>' +
                '<input id="abiRef" type="text" autocomplete="off" ' +
                'placeholder="john 3:16   or   john 3:16-20"></div>' +
              '<div><button type="button" class="btn" id="abiGo"><span data-ck="bible.form.button">Search</span></button></div>' +
            '</div>' +

            '<div class="chips">' + chips + '</div>' +

            '<div class="out" id="abiOut" aria-live="polite" data-cms-source="BibleAPI">' +
              '<p class="out__status" data-ck="bible.results.ready">Ready! Select version &amp; enter verse ' +
              '(e.g., john 3:16 or john 3:16-20)</p>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker" data-ck="bible.cta.kicker">Go Deeper</span></div>' +
            '<h2 data-ck="bible.cta.heading">Hear It Taught</h2>' +
            '<p><span data-ck="site.times.sunday.main">Sunday 10:30 AM</span> <span data-ck="bible.cta.pineville">in Pineville,</span> <span data-ck="site.times.sunday.second">Sunday 10:00 AM</span> <span data-ck="bible.cta.alexandria">in Alexandria. Glory Nights</span> <span data-ck="site.times.main.glorynight">Monday 7:00 PM</span><span data-ck="bible.cta.end">.</span></p>' +
          '</div>' +
          '<a href="/sermons" target="_top" data-ck="bible.cta.button">Sermons</a>' +
        '</div></div></section>' +
      '</div>';

    this.applyContent();

    const root = this;
    const ver = root.querySelector('#abiVer');
    const ref = root.querySelector('#abiRef');
    const go  = root.querySelector('#abiGo');
    const out = root.querySelector('#abiOut');

    function status(msg, isErr) {
      out.innerHTML = '<p class="' + (isErr ? 'err' : 'out__status') + '">' + msg + '</p>';
    }

    async function search() {
      const q = (ref.value || '').trim().replace(/\s+/g, ' ');
      if (!q) { status('Enter a verse reference, for example: john 3:16'); ref.focus(); return; }

      go.setAttribute('disabled', 'true');
      status('Searching...');

      try {
        const url = 'https://bible-api.com/' + encodeURIComponent(q) +
                    '?translation=' + encodeURIComponent(ver.value || 'kjv');
        const res = await fetch(url);
        if (!res.ok) throw new Error('not found');
        const data = await res.json();

        let body = '';
        if (Array.isArray(data.verses) && data.verses.length) {
          body = data.verses.map(function (v) {
            return '<div class="verse"><b>' + abiEsc(v.verse) + '</b><p>' +
                   abiEsc(String(v.text || '').trim()) + '</p></div>';
          }).join('');
        } else if (data.text) {
          body = '<div class="verse"><b>' + abiEsc(data.verse_nr || '') + '</b><p>' +
                 abiEsc(String(data.text).trim()) + '</p></div>';
        } else {
          throw new Error('empty');
        }

        out.innerHTML =
          '<div class="out__ref"><span>' + abiEsc(data.reference || q) + '</span></div>' +
          body +
          '<p class="cite">' + abiEsc(data.translation_name || String(ver.value).toUpperCase()) + '</p>';

      } catch (err) {
        status('Verse not found or unsupported translation. Try john 3:16', true);
      } finally {
        go.removeAttribute('disabled');
      }
    }

    go.addEventListener('click', search);
    ref.addEventListener('keydown', function (e) { if (e.key === 'Enter') search(); });
    ver.addEventListener('change', function () { if ((ref.value || '').trim()) search(); });

    root.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        ref.value = c.getAttribute('data-ref');
        search();
      });
    });
  }
  applyContent() {
    const raw = this.getAttribute('data-content');
    if (!raw) return;
    let map;
    try { map = JSON.parse(raw); } catch (e) {
      console.error('bad data-content JSON', e); return;
    }
    if (!map || typeof map !== 'object') return;

    const self = this;
    Object.keys(map).forEach(function (k) {
      const v = map[k] || {};
      if (v.text) {
        self.querySelectorAll('[data-ck="' + k + '"]').forEach(function (el) {
          el.innerHTML = v.text;
        });
      }
      if (v.image) {
        self.querySelectorAll('[data-ci="' + k + '"]').forEach(function (el) {
          if (el.tagName === 'IMG') el.src = v.image;
          else el.style.backgroundImage = 'url(' + v.image + ')';
        });
      }
    });
  }
}

customElements.define('arise-bible', AriseBible);
