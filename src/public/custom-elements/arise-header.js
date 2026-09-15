/* ===========================================================================
   ARISE CHURCH -- SITE HEADER
   File: public/custom-elements/arise-header.js
   Tag:  arise-header

   Desktop: logo, wordmark, nav with dropdowns, GIVE button.
   Mobile:  logo, hamburger, full-height slide-out panel with accordions.

   The mobile panel is appended to document.body so it escapes the header's
   bounds -- same technique as the Service Times dropdown. It only works that
   way on the PUBLISHED site; Editor and Preview render it in an iframe.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-header.js
      -> paste this whole file
   2. In the Editor, open the HEADER (click it, don't open a page).
      Delete the existing logo, menu, and the raw-URL link.
      KEEP the header container itself -- Wix won't let you delete it.
   3. Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-header.js
      Tag Name: arise-header
   4. Stretch it FULL WIDTH. Set its height to about 76.
      Set the header container's own background to #0A0A0C.
   5. Save, then PUBLISH. Test on the LIVE site, on a phone.

   EDIT THE MENU below in NAV. Keep it in sync with your Wix pages --
   this nav is hardcoded, it does not read your Pages list.
   =========================================================================== */

const AHD_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const LOGO = 'https://static.wixstatic.com/media/c3b2d0_e3158f32636f482b84946a09d70b610c~mv2.png';

const GIVE_URL = '/tithes-and-offerings';

/* Top-level items. `kids` makes it a dropdown on desktop / accordion on mobile. */
const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about', kids: [
      { label: 'Our Story',       href: '/about' },
      { label: 'Meet our Leaders',href: '/leaders' },
      { label: 'Contact',         href: '/contact' }
  ]},
  { label: 'Ministries', href: '/ministries', kids: [
      { label: 'All Ministries',      href: '/ministries' },
      { label: 'Connect Groups',      href: '/connect-groups' },
      { label: 'Arise Creative Arts', href: '/creative-arts' },
      { label: "Children's Ministry", href: '/childrens' },
      { label: 'Youth Ministry',      href: '/youth' },
      { label: 'Outreach',            href: '/outreach' },
      { label: 'Lead Network',        href: '/lead-network' }
  ]},
  { label: 'Media', href: '/sermons', kids: [
      { label: 'Sermons', href: '/sermons' },
      { label: 'Bible Search', href: '/arise-bible' },
      { label: 'Podcast',      href: '/podcast' }
  ]},
  { label: 'Classes', href: '/classes' },
  { label: 'Events', href: '/events' },
  { label: 'Serve', href: '/serve' }
];

const AHD_CSS = `
arise-header{display:block;width:100%}
.ahd *{box-sizing:border-box;margin:0;padding:0}
.ahd{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;
  background:var(--ink);height:76px;display:flex;align-items:center;
  color-scheme:light only;
}
.ahd__in{width:100%;max-width:1180px;margin:0 auto;padding:0 clamp(16px,4vw,40px);
  display:flex;align-items:center;justify-content:space-between;gap:24px}

.ahd__brand{display:flex;align-items:center;gap:13px;text-decoration:none;flex:0 0 auto}
.ahd__brand img{height:38px;width:auto;display:block;background:transparent}
.ahd__wm{display:block;font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:17px;
  color:#fff;letter-spacing:.10em;text-transform:uppercase;line-height:1.1}
.ahd__tag{display:block;font-size:9px;color:var(--redL);letter-spacing:.26em;
  text-transform:uppercase;margin-top:2px}

.ahd__nav{display:flex;align-items:center;gap:clamp(16px,1.8vw,27px);flex:1 1 auto;justify-content:flex-end}
.ahd__item{position:relative}
.ahd__link{display:inline-block;color:rgba(255,255,255,.86);text-decoration:none;font-size:12.5px;
  font-weight:400;letter-spacing:.15em;text-transform:uppercase;padding:28px 0;white-space:nowrap;
  border-bottom:3px solid transparent}
.ahd__link[aria-current="page"]{border-bottom-color:#D6222D}
.ahd__link:hover,.ahd__link[aria-current="page"]{color:var(--redL)}
.ahd__item:hover > .ahd__link{color:var(--redL)}

.ahd__drop{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(6px);
  min-width:210px;background:var(--ink);border:1px solid rgba(255,255,255,.14);
  border-top:3px solid var(--red);padding:8px 0;opacity:0;pointer-events:none;
  transition:opacity .16s ease,transform .16s ease;z-index:60}
.ahd__item:hover .ahd__drop,.ahd__item:focus-within .ahd__drop{
  opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
.ahd__drop a{display:block;color:rgba(255,255,255,.86);text-decoration:none;font-size:12.5px;
  letter-spacing:.1em;padding:11px 20px;white-space:nowrap}
.ahd__drop a:hover{background:var(--red);color:#fff}

.ahd__give{flex:0 0 auto;display:inline-block;background:var(--red);color:#fff;text-decoration:none;
  font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:11px 21px;
  border:1.5px solid var(--red);transition:background .18s,color .18s}
.ahd__give:hover{background:transparent;color:#fff}

.ahd__burger{display:none;flex:0 0 auto;width:44px;height:44px;background:transparent;border:0;
  cursor:pointer;align-items:center;justify-content:center}
.ahd__burger span{display:block;position:relative;width:24px;height:2px;background:#fff}
.ahd__burger span::before,.ahd__burger span::after{content:"";position:absolute;left:0;
  width:24px;height:2px;background:#fff}
.ahd__burger span::before{top:-7px}
.ahd__burger span::after{top:7px}

.ahd a:focus-visible,.ahd button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

@media(max-width:1120px){
  .ahd__nav,.ahd__give{display:none}
  .ahd__burger{display:flex}
}

/* ---- mobile panel: lives on document.body ---- */
.ahd-panel{position:fixed;inset:0;z-index:2147483000;display:none;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color-scheme:light only}
.ahd-panel[data-open="true"]{display:block}
.ahd-panel__scrim{position:absolute;inset:0;background:rgba(6,6,8,.72)}
.ahd-panel__box{position:absolute;top:0;right:0;bottom:0;width:min(360px,86vw);
  background:#0A0A0C;overflow-y:auto;-webkit-overflow-scrolling:touch;
  border-left:3px solid #D6222D;transform:translateX(100%);transition:transform .26s ease}
.ahd-panel[data-open="true"] .ahd-panel__box{transform:translateX(0)}
.ahd-panel__hd{display:flex;align-items:center;justify-content:space-between;
  padding:20px 22px;border-bottom:1px solid rgba(255,255,255,.14)}
.ahd-panel__hd span{font-family:'Anton',Impact,sans-serif;font-size:15px;color:#fff;
  letter-spacing:.1em;text-transform:uppercase}
.ahd-panel__x{width:40px;height:40px;background:transparent;border:1px solid rgba(255,255,255,.24);
  color:#fff;font-size:20px;line-height:1;cursor:pointer}
.ahd-panel__x:hover{background:#D6222D;border-color:#D6222D}
.ahd-panel nav{padding:8px 0 20px}
.ahd-panel .top{display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid rgba(255,255,255,.08)}
.ahd-panel .top > a{flex:1 1 auto;display:block;color:#fff;text-decoration:none;
  font-family:'Anton',Impact,sans-serif;font-size:17px;letter-spacing:.05em;
  text-transform:uppercase;padding:17px 22px}
.ahd-panel .top > a:hover{color:#DB3F48}
.ahd-panel .exp{flex:0 0 auto;width:54px;height:54px;background:transparent;border:0;color:#DB3F48;
  font-size:20px;cursor:pointer;line-height:1}
.ahd-panel .sub{display:none;background:rgba(255,255,255,.04);
  border-bottom:1px solid rgba(255,255,255,.08)}
.ahd-panel .sub[data-open="true"]{display:block}
.ahd-panel .sub a{display:block;color:rgba(255,255,255,.82);text-decoration:none;font-size:14px;
  letter-spacing:.08em;padding:13px 22px 13px 34px}
.ahd-panel .sub a:hover{color:#fff;background:#D6222D}
.ahd-panel__give{display:block;margin:24px 22px 8px;text-align:center;background:#D6222D;color:#fff;
  text-decoration:none;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  padding:15px 20px}
.ahd-panel__meta{padding:20px 22px 32px;color:rgba(255,255,255,.6);font-size:13px;line-height:1.8}
.ahd-panel__meta b{color:#fff;font-weight:500}
.ahd-panel a:focus-visible,.ahd-panel button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}
@media(prefers-reduced-motion:reduce){
  .ahd-panel__box{transition:none}
  .ahd__drop{transition:none}
}
`;

function ahdEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

class AriseHeader extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { if (this._built) this.applyContent(); }

  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('ahd-fonts')) {
      const l = document.createElement('link');
      l.id = 'ahd-fonts'; l.rel = 'stylesheet'; l.href = AHD_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('ahd-css')) {
      const s = document.createElement('style');
      s.id = 'ahd-css'; s.innerHTML = AHD_CSS;
      document.head.appendChild(s);
    }

    const E = ahdEsc;
    const here = (window.location.pathname || '/').replace(/\/$/, '') || '/';
    const isHere = function (href) {
      const h = (href || '').replace(/\/$/, '') || '/';
      return h === here;
    };

    const desktop = NAV.map(function (n) {
      const cur = isHere(n.href) ? ' aria-current="page"' : '';
      const drop = n.kids
        ? '<div class="ahd__drop">' + n.kids.map(function (k) {
            return '<a href="' + E(k.href) + '" target="_top">' + E(k.label) + '</a>';
          }).join('') + '</div>'
        : '';
      return '<div class="ahd__item"><a class="ahd__link" href="' + E(n.href) + '" target="_top"' + cur + '>' +
             E(n.label) + '</a>' + drop + '</div>';
    }).join('');

    this.innerHTML =
      '<div class="ahd"><div class="ahd__in">' +
        '<a class="ahd__brand" href="/" target="_top">' +
          '<img src="' + LOGO + '" alt="Arise Church">' +
          '<span><span class="ahd__wm">Arise Church</span>' +
          '<span class="ahd__tag" data-ck="site.tagline">#YouBelongHere</span></span>' +
        '</a>' +
        '<nav class="ahd__nav" aria-label="Main">' + desktop + '</nav>' +
        '<a class="ahd__give" href="' + GIVE_URL + '" target="_top">Give Online</a>' +
        '<button class="ahd__burger" id="ahdBurger" aria-label="Open menu" aria-expanded="false">' +
          '<span></span></button>' +
      '</div></div>';

    this.applyContent();

    /* ---- mobile panel on document.body ---- */
    const panel = document.createElement('div');
    panel.className = 'ahd-panel';
    panel.setAttribute('data-open', 'false');

    const mobile = NAV.map(function (n, i) {
      const kids = n.kids
        ? '<div class="sub" data-sub="' + i + '" data-open="false">' + n.kids.map(function (k) {
            return '<a href="' + E(k.href) + '" target="_top">' + E(k.label) + '</a>';
          }).join('') + '</div>'
        : '';
      const btn = n.kids
        ? '<button class="exp" data-exp="' + i + '" aria-label="Show ' + E(n.label) +
          ' pages" aria-expanded="false">+</button>'
        : '';
      return '<div class="top"><a href="' + E(n.href) + '" target="_top">' + E(n.label) + '</a>' +
             btn + '</div>' + kids;
    }).join('');

    panel.innerHTML =
      '<div class="ahd-panel__scrim" data-close></div>' +
      '<div class="ahd-panel__box" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="ahd-panel__hd"><span>Arise Church</span>' +
          '<button class="ahd-panel__x" data-close aria-label="Close menu">&times;</button></div>' +
        '<nav aria-label="Mobile">' + mobile + '</nav>' +
        '<a class="ahd-panel__give" href="' + GIVE_URL + '" target="_top">Give Online</a>' +
        '<div class="ahd-panel__meta">' +
          '<b>Sunday 10:30 AM</b><br>Pineville<br>' + '<b>Sunday 10:00 AM</b><br>Alexandria<br><br>' +
          '<b>Glory Night</b><br>Mondays 7:00 PM &middot; Main Campus<br><br>' +
          '<a href="tel:13186401865" style="color:#DB3F48;text-decoration:none">(318) 640-1865</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panel);
    this._panel = panel;

    const burger = this.querySelector('#ahdBurger');
    const self = this;

    function setOpen(open) {
      panel.setAttribute('data-open', String(open));
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) {
        const first = panel.querySelector('.ahd-panel__x');
        if (first) first.focus();
      } else {
        burger.focus();
      }
    }
    this._setOpen = setOpen;

    burger.addEventListener('click', function () {
      setOpen(panel.getAttribute('data-open') !== 'true');
    });

    panel.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { setOpen(false); });
    });

    panel.querySelectorAll('.exp').forEach(function (b) {
      b.addEventListener('click', function () {
        const sub = panel.querySelector('.sub[data-sub="' + b.getAttribute('data-exp') + '"]');
        if (!sub) return;
        const open = sub.getAttribute('data-open') === 'true';
        sub.setAttribute('data-open', String(!open));
        b.setAttribute('aria-expanded', String(!open));
        b.textContent = open ? '+' : '\u2013';
      });
    });

    panel.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    this._onKey = function (e) { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', this._onKey);
  }

  disconnectedCallback() {
    if (this._panel && this._panel.parentNode) this._panel.parentNode.removeChild(this._panel);
    if (this._onKey) document.removeEventListener('keydown', this._onKey);
    document.documentElement.style.overflow = '';
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

customElements.define('arise-header', AriseHeader);