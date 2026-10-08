/* ===========================================================================
   ARISE CHURCH -- SITE FOOTER
   File: public/custom-elements/arise-footer.js
   Tag:  arise-footer

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-footer.js
      -> paste this whole file
   2. In the Editor, open the FOOTER (click it, don't open a page).
      Delete everything inside it -- INCLUDING the copyright line, which
      currently links to /information-desk-registration on every page.
      KEEP the footer container itself.
   3. Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-footer.js
      Tag Name: arise-footer
   4. Stretch it FULL WIDTH. Height about 420 desktop -- it grows on mobile.
      Set the footer container's background to #0A0A0C.
   5. Save, then PUBLISH.

   NOTE: arise-home.js already contains its own footer. Once this element is
   in the site footer, delete that section from arise-home.js or the homepage
   will show two. Tell me and I'll send a version with it removed.
   =========================================================================== */

const AFT_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const AFT_CSS = `
arise-footer{display:block;width:100%}
.aft *{box-sizing:border-box;margin:0;padding:0}
.aft{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--ruleD:rgba(255,255,255,.15);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;
  background:var(--ink);color:rgba(255,255,255,.82);font-size:13.5px;line-height:1.7;
  padding:clamp(40px,5vw,56px) 0 26px;color-scheme:light only;
}
.aft__in{max-width:1180px;margin:0 auto;padding:0 clamp(20px,5vw,56px)}
.aft__g{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:clamp(24px,3vw,40px);
  padding-bottom:32px;border-bottom:1px solid var(--ruleD)}
@media(max-width:900px){.aft__g{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.aft__g{grid-template-columns:1fr}}

.aft__lbl{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:13px;color:#fff;
  letter-spacing:.12em;text-transform:uppercase;margin-bottom:15px;line-height:1.02}
.aft a{color:rgba(255,255,255,.82);text-decoration:none;display:block;padding:4px 0}
.aft a:hover{color:var(--redL)}
.aft__brand p{max-width:34ch;color:rgba(255,255,255,.82)}
.aft__strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:8px 18px;
  margin-top:18px;text-decoration:none}
.aft__strip span{display:block;transform:skewX(9deg);color:#fff;font-size:11.5px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.aft__when{margin-top:14px;font-size:13px}
.aft__when b{color:#fff;font-weight:500}

.aft__social{display:flex;gap:11px;margin-top:18px}
.aft__social a{width:38px;height:38px;border:1px solid var(--ruleD);display:flex;
  align-items:center;justify-content:center;color:#fff;padding:0}
.aft__social a:hover{background:var(--red);border-color:var(--red)}
.aft__social svg{width:16px;height:16px;fill:currentColor}

.aft__btm{padding-top:22px;font-size:12px;display:flex;justify-content:space-between;
  gap:14px;flex-wrap:wrap;color:rgba(255,255,255,.7)}
.aft a:focus-visible{outline:3px solid var(--red);outline-offset:3px}
@media(prefers-reduced-motion:reduce){.aft *{transition:none!important}}
`;

const SOCIAL = [
  ['https://www.facebook.com/arisenow', 'Facebook',
   'M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z'],
  ['http://instagram.com/arisechurch.cenla', 'Instagram',
   'M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1A6.7 6.7 0 1018.7 12 6.7 6.7 0 0012 5.3zm0 11A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.9-11.2a1.6 1.6 0 11-1.6-1.6 1.6 1.6 0 011.6 1.6z'],
  ['https://www.youtube.com/@arisechurch4147', 'YouTube',
   'M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C17.2 4 12 4 12 4s-5.2 0-7.8.2c-.5.1-1.4.1-2.3 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s5.2 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.8c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.9l6.2 3.1z'],
  ['http://twitter.com/AriseChurch_C', 'X',
   'M18.2 2.3h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9.1L.9 2.3h7l4.8 6.4zm-1.2 17.9h1.9L7.1 4.2H5z']
];

class AriseFooter extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { if (this._built) this.applyContent(); }

  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('aft-fonts')) {
      const l = document.createElement('link');
      l.id = 'aft-fonts'; l.rel = 'stylesheet'; l.href = AFT_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('aft-css')) {
      const s = document.createElement('style');
      s.id = 'aft-css'; s.innerHTML = AFT_CSS;
      document.head.appendChild(s);
    }

    const social = SOCIAL.map(function (s) {
      return '<a href="' + s[0] + '" target="_blank" rel="noopener" aria-label="Arise Church on ' + s[1] + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + s[2] + '"/></svg></a>';
    }).join('');

    const year = new Date().getFullYear();

    this.innerHTML =
      '<div class="aft"><div class="aft__in">' +
        '<div class="aft__g">' +

          '<div class="aft__brand">' +
            '<div class="aft__lbl">Arise Church</div>' +
            '<p>Multicultural, multiethnic, and multigenerational. Pineville &amp; Alexandria, Louisiana.</p>' +
            '<a class="aft__strip" href="/about" target="_top"><span>#YouBelongHere</span></a>' +
            '<div class="aft__social">' + social + '</div>' +
          '</div>' +

          '<div>' +
            '<div class="aft__lbl">Visit</div>' +
            '<a href="https://www.google.com/maps/dir//501+Ates+Rd,+Pineville,+LA+71360" target="_blank" rel="noopener" data-ck="site.campus.main">501 Ates Road<br>Pineville, LA 71360</a>' +
            '<a href="https://www.google.com/maps/dir//5305+North+Blvd,+Alexandria,+LA+71301" target="_blank" rel="noopener" data-ck="site.campus.second">5305 North Blvd<br>Alexandria, LA 71301</a>' +
            '<div class="aft__when">' +
              '<b>Sunday</b> <span data-ck="site.times.sunday.main">10:30 AM</span> Pineville<br>' +
              '<b>Sunday</b> <span data-ck="site.times.sunday.second">10:00 AM</span> Alexandria<br>' +
              '<a href="/contact" style="display:inline-block;margin-top:9px;color:#DB3F48">' +
                'Weeknight times &rarr;</a>' +
            '</div>' +
          '</div>' +

          '<div>' +
            '<div class="aft__lbl">Explore</div>' +
            '<a href="/about" target="_top">About</a>' +
            '<a href="/leaders" target="_top">Meet our Leaders</a>' +
            '<a href="/ministries" target="_top">Ministries</a>' +
            '<a href="/connect-groups" target="_top">Connect Groups</a>' +
            '<a href="/creative-arts" target="_top">Arise Creative Arts</a>' +
            '<a href="/sermons" target="_top">Sermons</a>' +
            '<a href="/classes" target="_top">Classes</a>' +
            '<a href="/events" target="_top">Events</a>' +
            '<a href="/arise-bible" target="_top">Bible Search</a>' +
          '</div>' +

          '<div>' +
            '<div class="aft__lbl">Connect</div>' +
            '<a href="/contact" target="_top">Contact</a>' +
            '<a href="/serve" target="_top">Sign Up to Serve</a>' +
            '<a href="/tithes-and-offerings" target="_top">Give Online</a>' +
            '<a href="mailto:arisechurchprayer@gmail.com">Prayer Request</a>' +
            '<a href="mailto:arisenow.church@gmail.com" data-ck="site.email">arisenow.church@gmail.com</a>' +
          '</div>' +

        '</div>' +
        '<div class="aft__btm">' +
          '<span>&copy; ' + year + ' Arise Church</span>' +
          '<span>Sunday 10:30 AM Pineville &middot; 10:00 AM Alexandria</span>' +
        '</div>' +
      '</div></div>';

    this.applyContent();
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

customElements.define('arise-footer', AriseFooter);
