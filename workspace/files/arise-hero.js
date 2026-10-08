/* ===========================================================================
   ARISE CHURCH — HOME HERO   (Velo Custom Element)
   File: public/custom-elements/arise-hero.js
   Tag:  arise-hero

   ALL TEXT IS VERBATIM FROM THE LIVE SITE. Nothing invented.

   INSTALL
   -------
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-hero.js
      -> paste this whole file
   2. Editor -> Add (+) -> Embed Code -> Custom Element
   3. Choose Source -> Velo file -> pick arise-hero.js
      Tag Name: arise-hero
   4. Stretch it FULL WIDTH. Height about 760 (desktop).
   5. Publish. It renders in an iframe in Editor/Preview — only the
      published site shows it properly.

   NOTE: keep a native Wix H1 somewhere on the page for SEO (see the
   homepage guide) — custom element text is not in the server HTML.
   =========================================================================== */

const HERO_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const HERO_BG =
  'https://static.wixstatic.com/media/c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg';

const HERO_CSS = `
arise-hero{display:block;width:100%}
.ah-wrap{
  position:relative; width:100%; min-height:760px; overflow:hidden;
  background:#0A0A0C; font-family:'Oswald',Helvetica,Arial,sans-serif;
  display:flex; align-items:center;
}
.ah-bg{position:absolute;inset:0;background-size:cover;background-position:center 32%;filter:saturate(.85)}
.ah-scrim{position:absolute;inset:0;
  background:linear-gradient(90deg,
    rgba(6,6,8,.94) 0%, rgba(6,6,8,.86) 42%, rgba(6,6,8,.34) 74%, rgba(6,6,8,.52) 100%);}
.ah-floor{position:absolute;left:0;right:0;bottom:0;height:34%;
  background:linear-gradient(180deg,rgba(6,6,8,0),rgba(6,6,8,.9))}

.ah-in{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;
  padding:clamp(56px,8vw,110px) clamp(20px,5vw,56px)}
.ah-col{max-width:min(660px,64%)}

.ah-mark{display:flex;align-items:center;margin-bottom:18px}
.ah-mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:#D6222D;
  box-shadow:62px 0 0 #D6222D;margin-right:80px}
.ah-kicker{font-size:12px;font-weight:500;letter-spacing:.30em;color:#DB3F48;white-space:nowrap}

.ah-h1{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;
  font-size:clamp(44px,8vw,88px);line-height:1.02;letter-spacing:.02em;color:#fff;margin:0;
  text-shadow:0 4px 22px rgba(0,0,0,.5)}
.ah-h1 .dot{color:#D6222D}

.ah-sub{color:rgba(255,255,255,.84);margin:22px 0 0;font-weight:300;
  font-size:clamp(15.5px,1.6vw,18px);line-height:1.62;max-width:56ch}

.ah-acts{display:flex;flex-wrap:wrap;gap:13px;margin-top:34px}
.ah-btn{display:inline-block;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;
  border:1.5px solid #D6222D;background:#D6222D;color:#fff;
  transition:background .18s,color .18s}
.ah-btn:hover{background:transparent;color:#fff;border-color:#fff}
.ah-btn--ghost{background:transparent;border-color:#fff;color:#fff}
.ah-btn--ghost:hover{background:#fff;color:#0A0A0C}
.ah-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}

@media (max-width:1100px){ .ah-col{max-width:100%} }
@media (max-width:640px){ .ah-wrap{min-height:600px} }
@media (prefers-reduced-motion:reduce){ .ah-btn{transition:none} }
`;

class AriseHero extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('ah-fonts')) {
      const l = document.createElement('link');
      l.id = 'ah-fonts'; l.rel = 'stylesheet'; l.href = HERO_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('ah-css')) {
      const s = document.createElement('style');
      s.id = 'ah-css'; s.innerHTML = HERO_CSS;
      document.head.appendChild(s);
    }

    const wrap = document.createElement('div');
    wrap.className = 'ah-wrap';
    wrap.innerHTML =
      '<div class="ah-bg" style="background-image:url(' + HERO_BG + ')"></div>' +
      '<div class="ah-scrim"></div>' +
      '<div class="ah-floor"></div>' +
      '<div class="ah-in"><div class="ah-col">' +
        '<div class="ah-mark"><span class="ah-kicker">ARISE CHURCH &middot; PINEVILLE, LA</span></div>' +
        '<h1 class="ah-h1">Who We Are<span class="dot">.</span></h1>' +
        '<p class="ah-sub">Welcome to our multicultural, multiethnic, and multigenerational church! ' +
        'We are thrilled to have you join our vibrant community. Here, you will find a place of belonging ' +
        'and support, where diverse backgrounds come together to share in faith and fellowship. ' +
        'We can\u2019t wait to grow together and embrace the unique gifts each person brings.</p>' +
        '<div class="ah-acts">' +
          '<a class="ah-btn" href="/contact">Plan Your Visit</a>' +
          '<a class="ah-btn ah-btn--ghost" href="/sermons">Past Sermons</a>' +
        '</div>' +
      '</div></div>';

    this.appendChild(wrap);
  }
}

customElements.define('arise-hero', AriseHero);
