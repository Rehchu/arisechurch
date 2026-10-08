/* ===========================================================================
   ARISE CHURCH -- CLASSES
   File: public/custom-elements/arise-classes.js
   Tag:  arise-classes

   Lists every published Online Program. Free or paid is decided in the
   Online Programs dashboard, not here -- this page shows whatever they set,
   and updates itself when they change it.

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
.acl a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

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

class AriseClasses extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('acl-fonts')) {
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
          '<div class="mark mark--l"><span class="kicker">Learn &amp; Grow</span></div>' +
          '<h1>Classes</h1>' +
          '<p class="lede" data-ck="classes.hero.body">Go deeper at your own pace. Classes and studies you can start ' +
          'whenever you are ready.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Available Now</span></div>' +
          '<h2>What You Can Take</h2>' +
          '<div id="aclList"></div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker">Questions</span></div>' +
            '<h2>Not Sure Where<br>To Start?</h2>' +
            '<p>Send us a note and we will point you to the right place.</p>' +
          '</div>' +
          '<a class="btn" href="/contact" target="_top">Contact Us</a>' +
        '</div></div></section>' +
      '</div>';

    this.fill();
    this.applyContent();
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

  fill() {
    const list = this.querySelector('#aclList');
    if (!list) return;
    const items = this.items();
    const E = aclEsc;

    /* Not loaded yet -- show nothing rather than flashing an empty state. */
    if (items === null) { list.innerHTML = ''; return; }

    if (!items.length) {
      list.innerHTML =
        '<div class="empty" style="border-color:var(--rule)">' +
          '<h3 style="color:var(--muted)">Classes are coming</h3>' +
          '<p style="color:var(--muted)">We are putting the first classes together now. ' +
          'Check back soon, or contact us to hear when they open.</p>' +
        '</div>';
      return;
    }

    list.innerHTML = '<div class="list">' + items.map(function (c) {
      const facts = [];
      if (c.steps)    facts.push('<span><b>' + E(c.steps) + '</b> steps</span>');
      if (c.sections) facts.push('<span><b>' + E(c.sections) + '</b> sections</span>');
      if (c.selfPaced) facts.push('<span>Self-paced</span>');
      else if (c.duration) facts.push('<span><b>' + E(c.duration) + '</b></span>');

      return '<div class="c">' +
        '<div class="c__img">' +
          (c.image ? '<img src="' + E(c.image) + '" alt="' + E(c.title) + '">' : '') +
          '<span class="c__price">' + E(c.price || 'Free') + '</span>' +
        '</div>' +
        '<div class="c__b">' +
          (c.category ? '<div class="c__meta">' + E(c.category) + '</div>' : '') +
          '<h3>' + E(c.title) + '</h3>' +
          (c.details ? '<p class="c__d">' + E(c.details) + '</p>' : '') +
          (facts.length ? '<div class="c__facts">' + facts.join('') + '</div>' : '') +
          (c.url ? '<div class="c__go"><a class="btn btn--dark" href="' + E(c.url) +
                   '" target="_top">View Class</a></div>' : '') +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
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

customElements.define('arise-classes', AriseClasses);
