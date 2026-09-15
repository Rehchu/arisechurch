/* ===========================================================================
   ARISE CHURCH ALEXANDRIA
   File: public/custom-elements/arise-alexandria.js
   Tag:  arise-alexandria

   The second campus. Everything on this page is editable in
   CMS -> Page Content, under the keys starting alexandria.*

   Until the page code feeds it, the text below shows -- so the page works
   the moment you place it.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-alexandria.js
      -> paste this whole file
   2. Editor -> new page /alexandria -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-alexandria.js
      Tag Name: arise-alexandria
      STRETCH IT FULL WIDTH.
   3. Page code -- see ALEXANDRIA-SETUP.md
   4. Save, then PUBLISH.

   PASTOR SHERON'S PHOTO: upload it in Media Manager, then paste the URL into
   CMS -> Page Content -> alexandria.pastor.photo -> imageUrl.
   Until then a monogram card shows in its place.
   =========================================================================== */

const AAX_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

/* Shown until the CMS supplies its own. Keys match CMS -> Page Content. */
const FALLBACK = {
  'alexandria.hero.kicker': 'Arise Church Alexandria',
  'alexandria.hero.body':
    'Our second campus on North Boulevard. Same vision, same family, closer to home.',
  'alexandria.pastor.name': 'Pastor Sheron Turner',
  'alexandria.pastor.role': 'Lead Pastor, Arise Church Alexandria',
  'alexandria.pastor.bio1':
    'Pastor Sheron Turner serves as the Lead Pastor of Arise Church Alexandria, where she ' +
    'has faithfully guided the congregation since 2024. Known for her heart for ministry ' +
    "and dedication to spiritual growth, she is passionate about helping believers Connect " +
    "with God and His family, Grow in God's character, Serve in God's Church, and Share " +
    "God's message.",
  'alexandria.pastor.bio2':
    'Pastor Sheron proudly serves under the spiritual covering and leadership of Apostle ' +
    'Bryant and Prophet Vanessa Sanders, the Lead Pastors of Arise Church in Tioga, ' +
    'Louisiana. Through this strong leadership alignment, she carries out the overarching ' +
    'vision of Arise Church to see lives transformed and communities renewed.',
  'alexandria.address': '5305 North Blvd, Alexandria, LA 71301',
  'site.times.sunday.second': 'Sunday 10:00 AM',
  'site.times.second.midweek': '',
  'site.times.second.prayer': ''
};

const MAPS = 'https://www.google.com/maps/dir//5305+North+Blvd,+Alexandria,+LA+71301';

const AAX_CSS = `
arise-alexandria{display:block;width:100%}
.aax *{box-sizing:border-box;margin:0;padding:0}
.aax{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.aax img{color:#fff;font-size:12px;background:#1A1A1F}
.aax .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.aax h1,.aax h2,.aax h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aax h1{font-size:clamp(34px,6.2vw,72px)}
.aax h2{font-size:clamp(26px,3.8vw,46px)}
.aax h3{font-size:clamp(17px,1.8vw,22px);letter-spacing:.03em;line-height:1.14}
.aax p{font-size:clamp(15.5px,1.4vw,17px)}
.aax .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.aax .mark{display:flex;align-items:center;margin-bottom:18px}
.aax .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.aax .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .aax .mark{flex-wrap:nowrap;align-items:flex-start}
  .aax .mark::before{margin-right:124px;margin-top:5px}
  .aax .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aax .mark--l .kicker{color:var(--redL)}

.aax .btn{display:inline-block;padding:14px 30px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;transition:background .18s,color .18s,border-color .18s}
.aax .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aax .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aax .btn--dark:hover{background:var(--ink);color:#fff}
.aax a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.aax .sect{padding:var(--sect) 0;background:var(--paper)}
.aax .sect--bone{background:var(--bone)}
.aax .sect--ink{background:var(--ink)}
.aax .sect--ink h2,.aax .sect--ink h3{color:#fff}
.aax .sect--ink p{color:rgba(255,255,255,.82)}
.aax .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.aax .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.aax .phead h1,.aax .phead p,.aax .phead .mark{position:relative;z-index:1}
.aax .phead h1{color:#fff}
.aax .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:58ch}

/* lead pastor */
.aax .pastor{display:grid;grid-template-columns:minmax(0,380px) minmax(0,1fr);
  gap:clamp(28px,4vw,56px);margin-top:48px;align-items:start}
@media(max-width:820px){.aax .pastor{grid-template-columns:1fr}}
.aax .pastor__ph{aspect-ratio:816/1264;overflow:hidden;background:var(--bone);
  border:1px solid var(--rule)}
.aax .pastor__ph img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block}
.aax .pastor__init{aspect-ratio:816/1264;background:var(--ink);display:flex;align-items:center;
  justify-content:center;font-family:'Anton',Impact,sans-serif;font-size:72px;color:var(--redL)}
.aax .pastor__r{display:inline-block;background:var(--red);color:#fff;font-size:11px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:6px 12px;margin-bottom:14px}
.aax .pastor__b p{color:var(--muted);line-height:1.78;margin-top:16px}
.aax .pastor__b h2{margin-bottom:4px}

/* visit */
.aax .visit{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--ruleD);
  margin-top:48px}
@media(max-width:760px){.aax .visit{grid-template-columns:1fr}}
.aax .visit__c{background:var(--ink);padding:clamp(24px,3vw,36px)}
.aax .visit__l{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:var(--redL);margin-bottom:12px}
.aax .visit__v{font-family:'Anton',Impact,sans-serif;font-size:clamp(19px,2.2vw,26px);color:#fff;
  text-transform:uppercase;line-height:1.2}
.aax .visit__r{display:flex;justify-content:space-between;gap:16px;padding:11px 0;
  border-bottom:1px solid var(--ruleD)}
.aax .visit__r:last-child{border-bottom:0}
.aax .visit__r span{color:rgba(255,255,255,.72);font-size:14.5px}
.aax .visit__r b{color:#fff;font-weight:500;white-space:nowrap}
.aax .visit__c .btn{margin-top:22px}

.aax .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.aax .cta h2,.aax .cta p{color:#fff}
.aax .cta p{margin-top:12px;max-width:46ch}
.aax .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.aax .cta .kicker{color:#fff}
.aax .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.aax .cta .btn:hover{background:transparent;color:#fff}
.aax .cta__b{flex:1 1 320px}

@media(prefers-reduced-motion:reduce){.aax *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .aax{background:#fff;color:#0A0A0C}
  .aax .sect{background:#fff}.aax .sect--bone{background:#F4F2F0}
  .aax .sect--ink,.aax .phead{background:#0A0A0C}
}
`;

function aaxEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

class AriseAlexandria extends HTMLElement {
  connectedCallback() {
    if (this._b) return;
    this._b = true;

    if (!document.getElementById('aax-fonts')) {
      const l = document.createElement('link');
      l.id = 'aax-fonts'; l.rel = 'stylesheet'; l.href = AAX_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('aax-css')) {
      const s = document.createElement('style');
      s.id = 'aax-css'; s.innerHTML = AAX_CSS;
      document.head.appendChild(s);
    }
    this.build();
  }

  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() {
    const raw = this.getAttribute('data-content');
    if (raw) {
      try { this._c = JSON.parse(raw) || {}; }
      catch (e) { console.error('arise-alexandria: bad data-content JSON', e); }
    }
    if (this._b) this.build();
  }

  /* CMS value if set, otherwise the text built into this file.
     getPageContent returns { key: { text, image } } for every key. */
  T(key) {
    const v = (this._c || {})[key];
    if (v && typeof v === 'object' && v.text) return v.text;
    if (typeof v === 'string' && v.trim()) return v;
    return FALLBACK[key] || '';
  }

  IMG(key) {
    const v = (this._c || {})[key];
    if (v && typeof v === 'object') return v.image || v.imageUrl || '';
    return '';
  }

  build() {
    const E = aaxEsc;
    const T = this.T.bind(this);
    const name = T('alexandria.pastor.name');
    const photo = this.IMG('alexandria.pastor.photo');

    const initials = name.replace(/^Pastor\s+/i, '').split(/\s+/)
      .slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');

    /* Only show a time row if there is a time. No "TBA" sitting there for months. */
    const times = [
      ['Sunday Service', T('site.times.sunday.second')],
      ['Pre-Service Prayer', T('site.times.second.prayer')],
      ['Midweek Service', T('site.times.second.midweek')]
    ].filter(function (r) { return r[1]; });

    this.innerHTML =
      '<div class="aax">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">' +
            E(T('alexandria.hero.kicker')) + '</span></div>' +
          '<h1>Arise Church<br>Alexandria</h1>' +
          '<p class="lede" data-ck="alexandria.hero.body">' + E(T('alexandria.hero.body')) + '</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Lead Pastor</span></div>' +
          '<div class="pastor">' +
            (photo
              ? '<div class="pastor__ph"><img src="' + E(photo) + '" alt="' + E(name) + '"></div>'
              : '<div class="pastor__init">' + E(initials) + '</div>') +
            '<div class="pastor__b">' +
              '<span class="pastor__r" data-ck="alexandria.pastor.role">' + E(T('alexandria.pastor.role')) + '</span>' +
              '<h2 data-ck="alexandria.pastor.name">' + E(name) + '</h2>' +
              '<p data-ck="alexandria.pastor.bio1">' + E(T('alexandria.pastor.bio1')) + '</p>' +
              '<p data-ck="alexandria.pastor.bio2">' + E(T('alexandria.pastor.bio2')) + '</p>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker">Plan Your Visit</span></div>' +
          '<h2>Find Us</h2>' +
          '<div class="visit">' +
            '<div class="visit__c">' +
              '<div class="visit__l">Where</div>' +
              '<div class="visit__v" data-ck="alexandria.address">' + E(T('alexandria.address')) + '</div>' +
              '<a class="btn" href="' + MAPS + '" target="_top">Get Directions</a>' +
            '</div>' +
            '<div class="visit__c">' +
              '<div class="visit__l">When</div>' +
              (times.length
                ? times.map(function (r) {
                    return '<div class="visit__r"><span>' + E(r[0]) + '</span><b>' +
                      E(r[1]) + '</b></div>';
                  }).join('')
                : '<div class="visit__v">Times coming soon</div>') +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker">First Time?</span></div>' +
            '<h2>Come As You Are</h2>' +
            '<p>Let us know you are coming and we will look out for you.</p>' +
          '</div>' +
          '<a class="btn" href="/contact" target="_top">Plan Your Visit</a>' +
        '</div></div></section>' +
      '</div>';
  }
}

customElements.define('arise-alexandria', AriseAlexandria);