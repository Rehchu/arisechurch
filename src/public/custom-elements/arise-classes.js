/* ===========================================================================
   ARISE CHURCH -- CLASSES
   File: public/custom-elements/arise-classes.js
   Tag:  arise-classes
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-classes.json)

   Lists every published Online Program. Free or paid is decided in the
   Online Programs dashboard, not here -- this page shows whatever they set,
   and updates itself when they change it.

   29 Sept 2026: "View Class" now opens a class page in the Arise Church look,
   on this page, instead of sending people to the Wix app page. Registration
   still happens through the Wix program page, which the Register button opens.
   A link with #class-<slug> opens that class straight away.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-classes.js
      -> paste this whole file
   2. Editor -> the Classes page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-classes.js
      Tag Name: arise-classes
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Add the backend function and page code -- see CLASSES-SETUP.md
   5. Save, then PUBLISH. Check the LIVE page.

   With no published programs it shows a "coming soon" panel rather than an
   empty page, so it is safe to publish before the first class exists.
   =========================================================================== */

const ACL_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const ACL_CSS = `
arise-classes{display:block;width:100%}
.acl *{box-sizing:border-box;margin:0;padding:0}
.acl{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.acl img{color:#fff;font-size:12px;background:#1A1A1F}
.acl .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.acl h1,.acl h2,.acl h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.acl h1{font-size:clamp(38px,7vw,80px)}
.acl h2{font-size:clamp(26px,3.8vw,46px)}
.acl h3{font-size:clamp(17px,1.8vw,22px);letter-spacing:.03em;line-height:1.14}
.acl p{font-size:clamp(15.5px,1.4vw,17px)}
.acl .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.acl .mark{display:flex;align-items:center;margin-bottom:18px}
.acl .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.acl .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .acl .mark{flex-wrap:nowrap;align-items:flex-start}
  .acl .mark::before{margin-right:124px;margin-top:5px}
  .acl .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.acl .mark--l .kicker{color:var(--redL)}

.acl .btn{display:inline-block;padding:14px 30px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;transition:background .18s,color .18s,border-color .18s}
.acl .btn:hover{background:transparent;color:#fff;border-color:#fff}
.acl .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.acl .btn--dark:hover{background:var(--ink);color:#fff}
.acl a:focus-visible,.acl button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.acl .sect{padding:var(--sect) 0;background:var(--paper)}
.acl .sect--ink{background:var(--ink)}
.acl .sect--ink h2{color:#fff}
.acl .sect--ink p{color:rgba(255,255,255,.82)}
.acl .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.acl .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.acl .phead h1,.acl .phead p{position:relative;z-index:1}
.acl .phead h1{color:#fff}
.acl .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:60ch}

/* ---- class cards ---- */
.acl .list{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:48px}
@media(max-width:1000px){.acl .list{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.acl .list{grid-template-columns:1fr}}
.acl .c{border:1px solid var(--rule);background:var(--paper);display:flex;flex-direction:column;
  transition:box-shadow .25s,transform .25s}
.acl .c:hover{box-shadow:0 14px 30px rgba(10,10,12,.13);transform:translateY(-3px)}
.acl .c__img{aspect-ratio:16/10;overflow:hidden;background:var(--scrim);position:relative}
.acl .c__img img{width:100%;height:100%;object-fit:cover;display:block}
.acl .c__price{position:absolute;top:0;left:0;background:var(--red);color:#fff;font-size:11px;
  font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:8px 14px}
.acl .c__b{padding:24px;flex:1 1 auto;display:flex;flex-direction:column}
.acl .c__meta{font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--red);margin-bottom:11px}
.acl .c__d{font-size:14.5px;color:var(--muted);line-height:1.68;margin-top:12px;flex:1 1 auto}
.acl .c__facts{display:flex;gap:16px;flex-wrap:wrap;margin-top:18px;padding-top:16px;
  border-top:1px solid var(--rule);font-size:12.5px;color:var(--muted)}
.acl .c__facts b{color:var(--ink);font-weight:500}
.acl .c__go{margin-top:20px}

/* ---- one class, in the Arise Church look ---- */
.acl .d__back{display:inline-flex;align-items:center;gap:10px;font-family:'Oswald',Helvetica,Arial,sans-serif;
  font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--red);
  background:none;border:0;padding:0;cursor:pointer;margin-top:6px}
.acl .d__back:hover{color:var(--ink)}
.acl .d__wrap{display:grid;grid-template-columns:minmax(0,440px) minmax(0,1fr);
  gap:clamp(26px,4vw,52px);align-items:start;margin-top:26px}
@media(max-width:900px){.acl .d__wrap{grid-template-columns:1fr}}
.acl .d__img{position:relative;background:var(--scrim);border:1px solid var(--rule)}
.acl .d__img img{width:100%;height:auto;display:block}
.acl .d__price{position:absolute;top:0;left:0;background:var(--red);color:#fff;font-size:11px;
  font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:8px 14px}
.acl .d__when{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;padding-bottom:18px;
  border-bottom:1px solid var(--rule);font-size:13px;color:var(--muted);letter-spacing:.04em}
.acl .d__when .lab{font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--red);font-size:11px;
  align-self:center}
.acl .d__when b{color:var(--ink);font-weight:500}
.acl .d__body p{margin-top:15px;color:var(--muted);line-height:1.72}
.acl .d__note{margin-top:18px;font-size:14px;color:var(--ink);border-left:3px solid var(--red);padding-left:14px}
.acl .d__go{margin-top:28px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.acl .d__go .btn:hover{background:transparent;color:var(--red);border-color:var(--red)}

.acl .empty{border:1.5px dashed var(--ruleD);padding:52px 32px;text-align:center;margin-top:48px}
.acl .empty h3{color:rgba(255,255,255,.7);margin-bottom:12px}
.acl .empty p{color:rgba(255,255,255,.7);font-size:15.5px;max-width:48ch;margin:0 auto}

.acl .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.acl .cta h2,.acl .cta p{color:#fff}
.acl .cta p{margin-top:12px;max-width:46ch}
.acl .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.acl .cta .kicker{color:#fff}
.acl .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.acl .cta .btn:hover{background:transparent;color:#fff}
.acl .cta__b{flex:1 1 320px}

@media(prefers-reduced-motion:reduce){.acl *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .acl{background:#fff;color:#0A0A0C}
  .acl .sect{background:#fff}
  .acl .sect--ink,.acl .phead{background:#0A0A0C}
}
`;

function aclEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Arise Church speed: ask Wix for a resized copy (AVIF/WebP picked per browser) of a
   plain static.wixstatic.com photo; longest side at most w, no crop. Anything else is
   returned untouched. */
function aclImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

var ACL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/* "2026-10-18" + "2026-11-22" -> "October 18 - November 22, 2026" */
function aclDates(start, end) {
  var one = function (s) {
    var m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return { y: m[1], m: ACL_MONTHS[Number(m[2]) - 1], d: String(Number(m[3])) };
  };
  var a = one(start), b = one(end);
  if (!a) return '';
  if (!b) return a.m + ' ' + a.d + ', ' + a.y;
  if (a.y === b.y) return a.m + ' ' + a.d + ' – ' + b.m + ' ' + b.d + ', ' + a.y;
  return a.m + ' ' + a.d + ', ' + a.y + ' – ' + b.m + ' ' + b.d + ', ' + b.y;
}

/* The program description keeps its paragraph breaks. */
function aclParas(text) {
  var parts = String(text || '').split(/\n\s*\n/);
  return parts.map(function (p) {
    return '<p>' + aclEsc(p).replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

class AriseClasses extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('acl-fonts') &&
        !document.querySelector('link[href="' + ACL_FONTS + '"]')) {
      const l = document.createElement('link');
      l.id = 'acl-fonts'; l.rel = 'stylesheet'; l.href = ACL_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('acl-css')) {
      const s = document.createElement('style');
      s.id = 'acl-css'; s.innerHTML = ACL_CSS;
      document.head.appendChild(s);
    }

    this.innerHTML =
      '<div class="acl">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="classes.hero.kicker">Learn &amp; Grow</span></div>' +
          '<h1 data-ck="classes.hero.heading">Classes</h1>' +
          '<p class="lede" data-ck="classes.hero.body">Go deeper at your own pace. Classes and studies you can start ' +
          'whenever you are ready.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div id="aclListHead">' +
            '<div class="mark"><span class="kicker" data-ck="classes.list.kicker">Available Now</span></div>' +
            '<h2 data-ck="classes.list.heading">What You Can Take</h2>' +
          '</div>' +
          '<div id="aclList"></div>' +
          '<div id="aclDetail" hidden></div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker" data-ck="classes.cta.kicker">Questions</span></div>' +
            '<h2 data-ck="classes.cta.heading">Not Sure Where<br>To Start?</h2>' +
            '<p data-ck="classes.cta.body">Send us a note and we will point you to the right place.</p>' +
          '</div>' +
          '<a class="btn" href="/contact" target="_top" data-ck="classes.cta.button">Contact Us</a>' +
        '</div></div></section>' +
      '</div>';

    const self = this;
    this.addEventListener('click', function (e) {
      const open = e.target.closest ? e.target.closest('[data-acl-open]') : null;
      if (open) { e.preventDefault(); self.show(open.getAttribute('data-acl-open')); return; }
      const back = e.target.closest ? e.target.closest('[data-acl-back]') : null;
      if (back) { e.preventDefault(); self.show(''); }
    });
    this._onHash = function () { self.show(self.slugFromHash(), true); };
    window.addEventListener('hashchange', this._onHash);

    this.fill();
    this.applyContent();
  }

  disconnectedCallback() {
    if (this._onHash) window.removeEventListener('hashchange', this._onHash);
  }

  static get observedAttributes() { return ['data-classes', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._built) return;   // nothing to patch until it has rendered
    if (name === 'data-content') { this.applyContent(); return; }
    this.fill();
  }

  items() {
    const raw = this.getAttribute('data-classes');
    if (!raw) return null;               // null = not loaded yet
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d : [];
    } catch (e) {
      console.error('arise-classes: bad data-classes JSON', e);
      return [];
    }
  }

  /* A class is identified by its slug; older data without one falls back to the
     last part of its link. */
  slugOf(c) {
    if (c && c.slug) return String(c.slug);
    const u = String((c && c.url) || '');
    const parts = u.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
  }

  slugFromHash() {
    const m = String(window.location.hash || '').match(/^#class-(.+)$/);
    return m ? decodeURIComponent(m[1]) : '';
  }

  /* Opens one class, or the list when slug is empty. */
  show(slug, fromHash) {
    const items = this.items() || [];
    const found = slug ? items.filter(function (c) {
      return (c.slug || '') === slug || String(c.url || '').indexOf('/' + slug) >= 0;
    })[0] : null;

    this._open = found ? this.slugOf(found) : '';

    const head = this.querySelector('#aclListHead');
    const list = this.querySelector('#aclList');
    const box = this.querySelector('#aclDetail');
    if (!list || !box) return;

    if (!found) {
      box.hidden = true;
      box.innerHTML = '';
      list.hidden = false;
      if (head) head.hidden = false;
      if (!fromHash && this.slugFromHash()) {
        // leave the page where it is, just drop the #class-... from the address
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } else { window.location.hash = ''; }
      }
      return;
    }

    box.innerHTML = this.detailHtml(found);
    box.hidden = false;
    list.hidden = true;
    if (head) head.hidden = true;
    this.applyContent();

    if (!fromHash && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#class-' + encodeURIComponent(this._open));
    }
    const top = this.getBoundingClientRect().top + window.pageYOffset - 20;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  detailHtml(c) {
    const E = aclEsc;
    const when = aclDates(c.startDate, c.endDate);
    const facts = [];
    if (when) facts.push('<span><b>' + E(when) + '</b></span>');
    if (c.selfPaced) facts.push('<span data-ck="classes.card.selfPaced">Self-paced</span>');
    if (c.steps) facts.push('<span><b>' + E(c.steps) + '</b> steps</span>');

    return '<div data-cms-source="OnlinePrograms">' +
      '<button type="button" class="d__back" data-acl-back>' +
        '<span aria-hidden="true">&larr;</span>' +
        '<span data-ck="classes.detail.back">All Classes</span>' +
      '</button>' +
      '<div class="d__wrap">' +
        '<div class="d__img">' +
          (c.image ? '<img src="' + E(aclImg(c.image, 1600)) + '" alt="' + E(c.title) + '">' : '') +
          '<span class="d__price">' + E(c.price || 'Free') + '</span>' +
        '</div>' +
        '<div class="d__body">' +
          '<h2>' + E(c.title) + '</h2>' +
          (facts.length ? '<div class="d__when">' +
            '<span class="lab" data-ck="classes.detail.whenLabel">When</span>' + facts.join('') +
          '</div>' : '') +
          aclParas(c.details) +
          '<p class="d__note" data-ck="classes.detail.note">You can also sign up on the registration sheets in the foyer.</p>' +
          '<div class="d__go">' +
            (c.url ? '<a class="btn" href="' + E(c.url) + '" target="_top" ' +
              'data-ck="classes.detail.register">Register for this Class</a>' : '') +
            '<a class="btn btn--dark" href="/contact" target="_top" data-ck="classes.detail.ask">Ask a Question</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  fill() {
    const list = this.querySelector('#aclList');
    if (!list) return;
    const items = this.items();
    const E = aclEsc;
    const self = this;

    /* Not loaded yet -- show nothing rather than flashing an empty state. */
    if (items === null) { list.innerHTML = ''; return; }

    if (!items.length) {
      list.innerHTML =
        '<div class="empty" style="border-color:var(--rule)">' +
          '<h3 style="color:var(--muted)" data-ck="classes.empty.heading">Classes are coming</h3>' +
          '<p style="color:var(--muted)" data-ck="classes.empty.body">We are putting the first classes together now. ' +
          'Check back soon, or contact us to hear when they open.</p>' +
        '</div>';
      this.applyContent();
      return;
    }

    list.innerHTML = '<div class="list" data-cms-source="OnlinePrograms">' + items.map(function (c, i) {
      const facts = [];
      const when = aclDates(c.startDate, c.endDate);
      if (when)       facts.push('<span><b>' + E(when) + '</b></span>');
      if (c.steps)    facts.push('<span><b>' + E(c.steps) + '</b> steps</span>');
      if (c.sections) facts.push('<span><b>' + E(c.sections) + '</b> sections</span>');
      if (c.selfPaced) facts.push('<span data-ck="classes.card.selfPaced">Self-paced</span>');
      else if (c.duration) facts.push('<span><b>' + E(c.duration) + '</b></span>');

      const slug = self.slugOf(c);

      return '<div class="c">' +
        '<div class="c__img">' +
          (c.image ? '<img src="' + E(aclImg(c.image, 1200)) + '" alt="' + E(c.title) + '"' +
            (i >= 3 ? ' loading="lazy" decoding="async"' : '') + '>' : '') +
          '<span class="c__price">' + E(c.price || 'Free') + '</span>' +
        '</div>' +
        '<div class="c__b">' +
          (c.category ? '<div class="c__meta">' + E(c.category) + '</div>' : '') +
          '<h3>' + E(c.title) + '</h3>' +
          (c.details ? '<p class="c__d">' + E(c.details) + '</p>' : '') +
          (facts.length ? '<div class="c__facts">' + facts.join('') + '</div>' : '') +
          (slug || c.url
            ? '<div class="c__go"><a class="btn btn--dark" href="#class-' + E(slug) + '"' +
              (slug ? ' data-acl-open="' + E(slug) + '"' : '') +
              ' data-ck="classes.card.button">View Class</a></div>'
            : '') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    /* A link straight to one class (#class-<slug>) opens it; otherwise keep
       whichever class was open before the data refreshed. */
    const wanted = this.slugFromHash() || this._open || '';
    if (wanted) this.show(wanted, true);
    else this.applyContent();
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
          const img = aclImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
          if (el.tagName === 'IMG') el.src = img;
          else el.style.backgroundImage = 'url(' + img + ')';
        });
      }
    });
  }
}

customElements.define('arise-classes', AriseClasses);
