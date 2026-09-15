/* ===========================================================================
   ARISE CHURCH -- OUTREACH
   File: public/custom-elements/arise-outreach.js
   Tag:  arise-outreach

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-outreach.js
      -> paste this whole file
   2. Editor -> the page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-outreach.js
      Tag Name: arise-outreach
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Save, then PUBLISH. Custom elements look wrong in Editor and Preview --
      only the published site renders them properly.

   All copy is from the live page.
   NOTE: your live Outreach page contains ONLY the word 'Outreach'. The copy
         here is your own text taken from the Serve page and the About page
         Impact Tioga mission. Nothing is invented, but review it.
   Fixed 2026-09-14: Photo viewer lightbox is now a dialog (role/aria-modal/label, focus returns to the tile, Tab stays inside); data-photos videoId validated and escaped; CMS content applied without building selectors from keys, background urls quoted; gallery and CMS content now render on first build (stray calls moved out of CLIPS.map).
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-outreach.json)
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';
const VID = 'https://video.wixstatic.com/video/';
const SUPPLIES = M + '1f9fa2_ef28ad94288a4068ac9c2974b4d4d545~mv2.jpg';

/* Real outreach footage. 720p is the highest publicly served rendition --
   1080p returns 403. Posters are the video id with f001.jpg appended. */
const CLIPS = [
  { id: '1f9fa2_9c9843fe9e84489f87a65cc9017af36a', label: 'Over 40 served' },
  { id: '1f9fa2_5569056413584c63a1f8a4861ef7796c', label: 'Out in the community' }
];

const CSS = `
arise-outreach{display:block;width:100%}
.sub *{box-sizing:border-box;margin:0;padding:0}
.sub{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.sub img{color:#fff;font-size:12px;background:#1A1A1F}
.sub .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.sub h1,.sub h2,.sub h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.sub h1{font-size:clamp(38px,7vw,80px)}
.sub h2{font-size:clamp(26px,3.8vw,46px)}
.sub h3{font-size:clamp(16px,1.7vw,20px);letter-spacing:.04em}
.sub p{font-size:clamp(15.5px,1.4vw,17px)}
.sub .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.sub .mark{display:flex;align-items:center;margin-bottom:18px}
.sub .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.sub .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .sub .mark{flex-wrap:nowrap;align-items:flex-start}
  .sub .mark::before{margin-right:124px;margin-top:5px}
  .sub .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.sub .mark--l .kicker{color:var(--redL)}
.sub .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.sub .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.sub .btn{display:inline-block;padding:15px 32px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;transition:background .18s,color .18s,border-color .18s}
.sub .btn:hover{background:transparent;color:#fff;border-color:#fff}
.sub .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.sub .btn--dark:hover{background:var(--ink);color:#fff}
.sub a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.sub .sect{padding:var(--sect) 0;background:var(--paper)}
.sub .sect--bone{background:var(--bone)}
.sub .sect--ink{background:var(--ink)}
.sub .sect--ink h2,.sub .sect--ink h3{color:#fff}
.sub .sect--ink p{color:rgba(255,255,255,.82)}

.sub .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.sub .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.sub .phead h1,.sub .phead p{position:relative;z-index:1}
.sub .phead h1{color:#fff}
.sub .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:60ch}

.sub .clips{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}
@media(max-width:760px){.sub .clips{grid-template-columns:1fr}}
.sub .clip{background:var(--scrim);position:relative}
.sub .clip video{width:100%;aspect-ratio:9/16;max-height:70vh;object-fit:cover;display:block;background:#000}
.sub .clip__cap{padding:14px 16px;font-size:12px;font-weight:500;letter-spacing:.16em;
  text-transform:uppercase;color:#fff;background:var(--ink)}

.sub .supp{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:clamp(24px,4vw,52px);
  align-items:start;margin-top:44px}
@media(max-width:820px){.sub .supp{grid-template-columns:1fr}}
.sub .supp__img img{width:100%;height:auto;display:block;border:1px solid var(--rule)}
.sub .supp__list{columns:2;column-gap:32px;list-style:none;margin-top:6px}
@media(max-width:560px){.sub .supp__list{columns:1}}
.sub .supp__list li{position:relative;padding:0 0 11px 22px;font-size:15.5px;
  color:var(--ink);break-inside:avoid}
.sub .supp__list li::before{content:"";position:absolute;left:0;top:9px;width:12px;height:4px;
  background:var(--red)}

.sub .people{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}
@media(max-width:700px){.sub .people{grid-template-columns:1fr}}
.sub .p__c{border:1px solid var(--rule);background:var(--paper);display:flex;flex-direction:column}
.sub .p__ph{aspect-ratio:1944/2664;overflow:hidden;background:var(--bone)}
.sub .p__ph img{width:100%;height:100%;object-fit:contain;display:block}
.sub .p__init{aspect-ratio:16/9;background:var(--ink);display:flex;align-items:center;
  justify-content:center;font-family:'Anton',Impact,sans-serif;font-size:44px;color:var(--redL)}
.sub .p__b{padding:22px}
.sub .p__role{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:12px}

.sub .empty{border:1.5px dashed var(--rule);padding:48px 32px;text-align:center;margin-top:44px}
.sub .empty h3{color:var(--muted);margin-bottom:12px}
.sub .empty p{color:var(--muted);font-size:15px;max-width:46ch;margin:0 auto}
.sub .sect--ink .empty{border-color:var(--ruleD)}
.sub .sect--ink .empty h3,.sub .sect--ink .empty p{color:rgba(255,255,255,.65)}

.sub .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.sub .cta h2,.sub .cta p{color:#fff}
.sub .cta p{margin-top:12px;max-width:46ch}
.sub .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.sub .cta .kicker{color:#fff}
.sub .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.sub .cta .btn:hover{background:transparent;color:#fff}
.sub .cta__b{flex:1 1 320px}


/* ---------- PHOTO COLLAGE (fed by page code via data-photos) ---------- */
.sub .gal{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:44px}
@media(max-width:900px){.sub .gal{grid-template-columns:repeat(4,1fr);gap:11px}}
@media(max-width:560px){.sub .gal{grid-template-columns:repeat(2,1fr);gap:9px}}
.sub .gal__t{position:relative;overflow:hidden;background:var(--bone);border:0;padding:0;
  cursor:pointer;display:block;grid-column:span 2;aspect-ratio:1/1;
  transition:transform .3s cubic-bezier(.2,.7,.3,1),box-shadow .3s;
  box-shadow:0 1px 3px rgba(10,10,12,.10)}
.sub .gal__t img{width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .55s cubic-bezier(.2,.7,.3,1)}
.sub .gal__t:nth-child(7n+1){grid-column:span 3;aspect-ratio:4/3}
.sub .gal__t:nth-child(7n+4){grid-column:span 3;aspect-ratio:3/2}
.sub .gal__t:nth-child(7n+6){grid-column:span 2;aspect-ratio:3/4}
@media(max-width:560px){
  .sub .gal__t,.sub .gal__t:nth-child(7n+1),.sub .gal__t:nth-child(7n+4),
  .sub .gal__t:nth-child(7n+6){grid-column:span 1;aspect-ratio:1/1}}
.sub .gal__t:nth-child(3n+2){transform:rotate(-1.1deg)}
.sub .gal__t:nth-child(5n+3){transform:rotate(1.3deg)}
.sub .gal__t:hover,.sub .gal__t:focus-visible{transform:rotate(0deg) translateY(-5px);
  box-shadow:0 12px 26px rgba(10,10,12,.20);z-index:2}
.sub .gal__t:hover img{transform:scale(1.07)}
.sub .gal__t:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.sub .gal__t::after{content:"";position:absolute;right:0;bottom:0;width:0;height:0;
  border-style:solid;border-width:0 0 0 0;
  border-color:transparent transparent var(--red) transparent;transition:border-width .25s}
.sub .gal__t:hover::after{border-width:0 0 26px 26px}
/* video tiles get a play badge so they read as playable */
.sub .gal__v{position:absolute;left:12px;top:12px;width:38px;height:38px;background:var(--red);
  display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;
  padding-left:3px;pointer-events:none}
.sub .gal__n{margin-top:34px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted)}
@media(prefers-reduced-motion:reduce){
  .sub .gal__t,.sub .gal__t img{transition:none}
  .sub .gal__t:nth-child(3n+2),.sub .gal__t:nth-child(5n+3){transform:none}}

.agl-lb{position:fixed;inset:0;z-index:2147482000;display:none;background:rgba(6,6,8,.94);
  color-scheme:light only}
.agl-lb[data-open="true"]{display:flex;align-items:center;justify-content:center}
.agl-lb img,.agl-lb video{max-width:92vw;max-height:82vh;object-fit:contain;display:block;
  box-shadow:0 20px 60px rgba(0,0,0,.6);background:#000}
.agl-lb video{width:auto}
.agl-lb button{position:absolute;background:transparent;border:1px solid rgba(255,255,255,.30);
  color:#fff;cursor:pointer;font-family:'Oswald',Helvetica,Arial,sans-serif;line-height:1}
.agl-lb__x{top:20px;right:20px;width:46px;height:46px;font-size:22px}
.agl-lb__p,.agl-lb__n{top:50%;transform:translateY(-50%);width:52px;height:64px;font-size:24px}
.agl-lb__p{left:16px}
.agl-lb__n{right:16px}
.agl-lb button:hover{background:#D6222D;border-color:#D6222D}
.agl-lb__c{position:absolute;bottom:22px;left:0;right:0;text-align:center;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:14px;
  color:rgba(255,255,255,.86);padding:0 20px}
.agl-lb__i{position:absolute;top:26px;left:24px;font-family:'Oswald',Helvetica,Arial,sans-serif;
  font-size:12px;letter-spacing:.2em;color:rgba(255,255,255,.6)}
.agl-lb button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}

@media(prefers-reduced-motion:reduce){.sub *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .sub{background:#fff;color:#0A0A0C}
  .sub .sect{background:#fff}.sub .sect--bone{background:#F4F2F0}
  .sub .sect--ink,.sub .phead{background:#0A0A0C}
}
`;

function injectHead() {
  if (!document.getElementById('sub-outreach-fonts')) {
    const l = document.createElement('link');
    l.id = 'sub-outreach-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('sub-outreach-css')) {
    const s = document.createElement('style');
    s.id = 'sub-outreach-css'; s.innerHTML = CSS;
    document.head.appendChild(s);
  }
}

class AriseOutreach extends HTMLElement {
  connectedCallback() {
    if (this._built) {
      /* re-attached by Wix: restore the body-mounted lightbox */
      if (this._lb && !this._lb.isConnected) document.body.appendChild(this._lb);
      if (this._lbKey) document.addEventListener('keydown', this._lbKey);
      return;
    }
    this._built = true;
    injectHead();

    this.innerHTML =
      '<div class="sub">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="outreach.hero.kicker">Impact Tioga</span></div>' +
          '<h1 data-ck="outreach.hero.heading">Outreach</h1>' +
          '<p class="lede" data-ck="outreach.hero.lede">Share God\u2019s love through community service and evangelism.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="outreach.footage.kicker">Real Footage</span></div>' +
          '<h2 data-ck="outreach.footage.heading">Out In The Community</h2>' +
          '<div class="clips">' +
            CLIPS.map(function (c, i) {
              return '<div class="clip">' +
                '<video controls preload="none" playsinline ' +
                  'poster="' + M + c.id + 'f001.jpg" ' +
                  'aria-label="Arise Church outreach: ' + c.label + '">' +
                  '<source src="' + VID + c.id + '/720p/mp4/file.mp4" type="video/mp4">' +
                  '<source src="' + VID + c.id + '/480p/mp4/file.mp4" type="video/mp4">' +
                '</video>' +
                '<div class="clip__cap" data-ck="outreach.footage.clip' + (i + 1) + '">' + c.label + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="outreach.supplies.kicker">How To Help</span></div>' +
          '<h2 data-ck="outreach.supplies.heading">Outreach Supplies<br>Needed</h2>' +
          '<p class="lede" style="margin-top:24px;max-width:56ch" data-ck="outreach.supplies.body">We are always collecting supplies ' +
          '&amp; monetary donations for the homeless and hungry in our community.</p>' +
          '<div class="supp">' +
            '<div class="supp__img"><img data-ci="outreach.supplies.image" src="' + SUPPLIES + '" ' +
              'alt="Outreach supplies needed list"></div>' +
            '<ul class="supp__list">' +
              '<li data-ck="outreach.supplies.item1">Socks</li>' +
              '<li data-ck="outreach.supplies.item2">Winter gloves &amp; hats</li>' +
              '<li data-ck="outreach.supplies.item3">Blankets</li>' +
              '<li data-ck="outreach.supplies.item4">Raincoats / ponchos</li>' +
              '<li data-ck="outreach.supplies.item5">Sleeping bags</li>' +
              '<li data-ck="outreach.supplies.item6">Hand warmers</li>' +
              '<li data-ck="outreach.supplies.item7">Flashlights / batteries</li>' +
              '<li data-ck="outreach.supplies.item8">Wash cloths</li>' +
              '<li data-ck="outreach.supplies.item9">Bar soap / soap box</li>' +
              '<li data-ck="outreach.supplies.item10">Baby wipes</li>' +
              '<li data-ck="outreach.supplies.item11">Toothpaste / toothbrushes</li>' +
              '<li data-ck="outreach.supplies.item12">Deodorant</li>' +
              '<li data-ck="outreach.supplies.item13">Bandaids</li>' +
              '<li data-ck="outreach.supplies.item14">Feminine products</li>' +
            '</ul>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="outreach.mission.kicker">Our Mission</span></div>' +
          '<h2 data-ck="outreach.mission.heading">Impact Tioga</h2>' +
          '<p class="lede" style="margin-top:24px;max-width:60ch" data-ck="outreach.mission.body">Our mission for this year is to ' +
          'Impact Tioga\u2014to bring the life-changing love of Jesus Christ into every corner of our ' +
          'community, transforming lives, families, and the town we call home.</p>' +
          '<p style="margin-top:24px;max-width:60ch;color:var(--muted)" data-ck="outreach.mission.body2">We are committed to building ' +
          'the community together: partnering with neighbors, schools, businesses, and local leaders ' +
          'to foster unity, serve those in need, and create spaces where everyone feels seen, valued, ' +
          'and loved.</p>' +
          '<div class="strip" style="margin-top:32px"><span data-ck="outreach.mission.strip">Impact Tioga</span></div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="outreach.community.kicker">In The Community</span></div>' +
          '<h2 data-ck="outreach.community.heading">Impact Tioga</h2>' +
          '<div class="gal-mount" data-cms-source="Portfolio"></div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker" data-ck="outreach.cta.kicker">Serve With Us</span></div>' +
            '<h2 data-ck="outreach.cta.heading">We Are In Need</h2>' +
            '<p data-ck="outreach.cta.body">Join our congregation in making a difference.</p>' +
          '</div>' +
          '<a class="btn" href="/serve" target="_top" data-ck="outreach.cta.button">Sign Up to Serve</a>' +
        '</div></div></section>' +
      '</div>';

    this.fillGallery();

    this.applyContent();
  }
  static get observedAttributes() { return ['data-photos', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._built) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.fillGallery();
  }

  galPhotos() {
    const raw = this.getAttribute('data-photos');
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      if (!Array.isArray(d)) return [];
      return d.map(function (p) {
        if (typeof p === 'string') return { src: p, alt: '', caption: '', video: '' };
        return {
          src: p.src || p.url || p.poster || '',
          video: p.video || '',
          videoId: p.videoId || '',
          alt: p.alt || '',
          caption: p.caption || p.title || ''
        };
      }).filter(function (p) { return (p.src || p.video || p.videoId) && (!p.videoId || /^[A-Za-z0-9_\-]+$/.test(p.videoId)); });
    } catch (e) {
      console.error('gallery: bad data-photos JSON', e);
      return [];
    }
  }

  fillGallery() {
    const mount = this.querySelector('.gal-mount');
    if (!mount) return;
    const pics = this.galPhotos();
    this._pics = pics;

    /* Nothing uploaded yet -- render nothing, not an empty frame. */
    if (!pics.length) { mount.innerHTML = ''; return; }

    const E = function (s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    const vids = pics.filter(function (p) { return p.video || p.videoId; }).length;

    mount.innerHTML =
      '<div class="gal">' +
        pics.map(function (p, i) {
          return '<button class="gal__t" data-i="' + i + '" ' +
            'aria-label="Open ' + ((p.video || p.videoId) ? 'video' : 'photo') + ' ' + (i + 1) +
            ' of ' + pics.length + '">' +
            '<img src="' + E(p.src) + '" alt="' + E(p.alt) + '" loading="lazy">' +
            ((p.video || p.videoId) ? '<span class="gal__v">&#9654;</span>' : '') +
          '</button>';
        }).join('') +
      '</div>' +
      '<div class="gal__n">' + pics.length + ' items' +
        (vids ? ' &middot; ' + vids + ' video' + (vids > 1 ? 's' : '') : '') +
        ' &middot; tap any to open</div>';

    this.wireLightbox();
  }

  wireLightbox() {
    const self = this;
    if (!this._lb) {
      const lb = document.createElement('div');
      lb.className = 'agl-lb';
      lb.setAttribute('data-open', 'false');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Photo viewer');
      lb.innerHTML =
        '<div class="agl-lb__i"></div>' +
        '<button class="agl-lb__x" aria-label="Close">&times;</button>' +
        '<button class="agl-lb__p" aria-label="Previous">&#8249;</button>' +
        '<div class="agl-lb__stage"></div>' +
        '<button class="agl-lb__n" aria-label="Next">&#8250;</button>' +
        '<div class="agl-lb__c"></div>';
      document.body.appendChild(lb);
      this._lb = lb;

      const stage = lb.querySelector('.agl-lb__stage');
      const cap = lb.querySelector('.agl-lb__c');
      const idx = lb.querySelector('.agl-lb__i');

      const LE = function (s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      };
      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + LE(p.videoId) + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + LE(p.video) + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + LE(p.src) + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + LE(p.src) + '" alt="' + LE(p.alt || '') + '">';
        }
        cap.textContent = p.caption || '';
        idx.textContent = (self._i + 1) + ' / ' + list.length;
      };
      this._close = function () {
        lb.setAttribute('data-open', 'false');
        stage.innerHTML = '';
        document.documentElement.style.overflow = '';
        const op = self._opener; self._opener = null;
        if (op && op.isConnected && op.focus) op.focus();
      };
      lb.querySelector('.agl-lb__x').addEventListener('click', this._close);
      lb.querySelector('.agl-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.agl-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) self._close(); });
      this._lbKey = function (e) {
        if (lb.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') self._close();
        if (e.key === 'ArrowLeft') self._show(self._i - 1);
        if (e.key === 'ArrowRight') self._show(self._i + 1);
        if (e.key === 'Tab') {
          const fs = lb.querySelectorAll('button, video[controls]');
          if (!fs.length) return;
          const first = fs[0], last = fs[fs.length - 1];
          const inside = lb.contains(document.activeElement);
          if (e.shiftKey && (!inside || document.activeElement === first)) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && (!inside || document.activeElement === last)) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', this._lbKey);
    }

    this.querySelectorAll('.gal__t').forEach(function (b) {
      b.addEventListener('click', function () {
        self._opener = b;
        self._show(parseInt(b.getAttribute('data-i'), 10));
        self._lb.setAttribute('data-open', 'true');
        document.documentElement.style.overflow = 'hidden';
        self._lb.querySelector('.agl-lb__x').focus();
      });
    });
  }

  disconnectedCallback() {
    if (this._lbKey) document.removeEventListener('keydown', this._lbKey);
    if (this._lb && this._lb.parentNode) this._lb.parentNode.removeChild(this._lb);
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

    const own = Object.prototype.hasOwnProperty;
    this.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = own.call(map, k) ? (map[k] || {}) : {};
      if (v.text) el.innerHTML = v.text;
    });
    this.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = own.call(map, k) ? (map[k] || {}) : {};
      if (v.image) {
        if (el.tagName === 'IMG') el.src = v.image;
        else el.style.backgroundImage = 'url("' + String(v.image).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-outreach', AriseOutreach);
