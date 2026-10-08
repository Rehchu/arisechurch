/* ===========================================================================
   ARISE CHURCH -- LEAD NETWORK
   File: public/custom-elements/arise-leadnetwork.js
   Tag:  arise-leadnetwork

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-leadnetwork.js
      -> paste this whole file
   2. Editor -> the page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-leadnetwork.js
      Tag Name: arise-leadnetwork
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Save, then PUBLISH. Custom elements look wrong in Editor and Preview --
      only the published site renders them properly.

   All copy is from the live page.
   NOTE: this page lives at /lead-network. Rename it to /lead-network and say
         yes to the 301 redirect, then update the header NAV array.
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';

/* Lead Network logo -- 500x500, transparent background, so it sits on
   any colour. Used here and on the Ministries and Home tiles. */
const LN_LOGO = M + 'c3b2d0_1c539649f39f48cbb157d4e27efeb843~mv2.png';
const VID = 'https://video.wixstatic.com/video/';
const MP3 = 'https://static.wixstatic.com/mp3/';

/* Teachings. To add one: copy a block and fill it in.
   video   - the wix video id (no https, no path)
   quality - highest rendition that actually serves; check before using 720p
   audio   - the mp3 id, or '' if there isn't one yet
   thumb   - the poster image id */
const TEACHINGS = [
  {
    title: 'Guarding the Anointing',
    sub:   'Unmasking the Spirit of Delilah',
    by:    'Apostle Bryant Sanders',
    video: 'c3b2d0_8fb55fbd927a4651a7d76e730a5181ee',
    quality: '720p',
    thumb: 'c3b2d0_ef7a4d9e0ebf4c9981f5732070a04e95~mv2.jpg',
    audio: 'c3b2d0_4ff471dffb29402a918a2bd5807ba713',
    length: '42 min'
  },
  {
    title: 'Leading with Purpose',
    sub:   'Spiritual Wisdom and Practical Strategies',
    by:    'Pastor Derrick Calloway',
    video: 'c3b2d0_61054f0c276a467eac42060fb4cd3a04',
    quality: '480p',
    thumb: 'c3b2d0_d3067c7953ea434db865fc6b7b1f71ee~mv2.jpg',
    audio: 'c3b2d0_8645992ea44d4c69becbb145c3cc9e44',
    length: '34 min'
  }
];

const AUSTIN   = M + '1f9fa2_0118a2141a564a909b5c493b2f55211d~mv2.png';
const CALLOWAY = M + '1f9fa2_1331547403e94f94a08912f08d45d1de~mv2.png';

const CSS = `
arise-leadnetwork{display:block;width:100%}
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
.sub .phead__logo{position:relative;z-index:1;width:clamp(88px,11vw,132px);height:auto;
  display:block;margin-bottom:22px;background:transparent}
.sub .phead h1{color:#fff}
.sub .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:60ch}

.sub .banner{width:100%;aspect-ratio:16/9;overflow:hidden;background:var(--scrim)}
.sub .banner img{width:100%;height:100%;object-fit:cover;display:block}

.sub .teach{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}
@media(max-width:760px){.sub .teach{grid-template-columns:1fr}}
.sub .t__c{border:1px solid var(--rule);background:var(--paper);display:flex;flex-direction:column}
.sub .t__media{aspect-ratio:16/9;background:var(--scrim);position:relative;overflow:hidden}
.sub .t__media img{width:100%;height:100%;object-fit:cover;display:block}
.sub .t__media video{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.sub .t__play{position:absolute;inset:0;border:0;background:rgba(6,6,8,.42);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .2s}
.sub .t__play:hover{background:rgba(6,6,8,.24)}
.sub .t__play span{width:64px;height:64px;background:var(--red);display:flex;align-items:center;
  justify-content:center;color:#fff;font-size:22px;line-height:1;padding-left:5px}
.sub .t__b{padding:22px;flex:1 1 auto;display:flex;flex-direction:column}
.sub .t__by{font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--red);margin-bottom:10px}
.sub .t__c h3{margin-bottom:8px}
.sub .t__sub{font-size:14.5px;color:var(--muted);line-height:1.6}
.sub .t__len{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);
  margin-top:12px}
.sub .t__audio{margin-top:16px}
.sub .t__audio audio{width:100%;display:block}
.sub .t__soon{margin-top:16px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--muted);border-top:1px solid var(--rule);padding-top:14px}

.sub .people{display:grid;grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}
.sub .p__church{margin-top:14px;padding-top:14px;border-top:1px solid var(--rule);
  font-size:14px;color:var(--muted);line-height:1.7}
.sub .p__church b{display:block;color:var(--ink);font-weight:500;font-size:15px;margin-bottom:3px}
.sub .p__links{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}
.sub .p__links a{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:var(--red);text-decoration:none;border:1px solid var(--rule);padding:7px 12px}
.sub .p__links a:hover{background:var(--red);border-color:var(--red);color:#fff}
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
  if (!document.getElementById('sub-leadnetwork-fonts')) {
    const l = document.createElement('link');
    l.id = 'sub-leadnetwork-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('sub-leadnetwork-css')) {
    const s = document.createElement('style');
    s.id = 'sub-leadnetwork-css'; s.innerHTML = CSS;
    document.head.appendChild(s);
  }
}

class AriseLeadNetwork extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    injectHead();

    const self = this;
    this._wire = function () {
      self.querySelectorAll('.t__play').forEach(function (b) {
        b.addEventListener('click', function () {
          const i = b.getAttribute('data-play');
          const t = TEACHINGS[i];
          const box = self.querySelector('.t__media[data-t="' + i + '"]');
          box.innerHTML =
            '<video controls autoplay playsinline poster="' + M + t.thumb + '">' +
              '<source src="' + VID + t.video + '/' + t.quality + '/mp4/file.mp4" type="video/mp4">' +
              '<source src="' + VID + t.video + '/480p/mp4/file.mp4" type="video/mp4">' +
            '</video>';
        });
      });
    };

    this.innerHTML =
      '<div class="sub">' +
        '<header class="phead"><div class="shell">' +
          '<img class="phead__logo" src="' + LN_LOGO + '" alt="Lead Network logo">' +
          '<div class="mark mark--l"><span class="kicker">Leadership Development</span></div>' +
          '<h1>Lead Network</h1>' +
          '<p class="lede">We invite you to explore our comprehensive selection of video courses ' +
          'offered through the Lead Network. Our courses are to enhance your skills and facilitate ' +
          'learning across various subjects. Discover the valuable opportunities that await you.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Teachings</span></div>' +
          '<h2>Watch &amp; Listen</h2>' +
          '<div class="teach">' +
            TEACHINGS.map(function (t, i) {
              return '<div class="t__c">' +
                '<div class="t__media" data-t="' + i + '">' +
                  '<img src="' + M + t.thumb + '" alt="' + t.title + '">' +
                  '<button class="t__play" data-play="' + i + '" ' +
                    'aria-label="Play ' + t.title + '"><span>&#9654;</span></button>' +
                '</div>' +
                '<div class="t__b">' +
                  '<div class="t__by">' + t.by + '</div>' +
                  '<h3>' + t.title + '</h3>' +
                  '<p class="t__sub">' + t.sub + '</p>' +
                  (t.length ? '<div class="t__len">' + t.length + '</div>' : '') +
                  (t.audio
                    ? '<div class="t__audio"><audio controls preload="none" src="' +
                        MP3 + t.audio + '.mp3"></audio></div>'
                    : '<div class="t__soon">Audio coming soon</div>') +
                '</div>' +
              '</div>';

    this.fillGallery();
            }).join('') +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker">Our Current Ministers</span></div>' +
          '<h2>Our Current Ministers</h2>' +
          '<div class="people">' +

            '<div class="p__c">' +
              '<div class="p__ph"><img src="' + AUSTIN + '" ' +
                'alt="Apostle Carlos Austin and Pastor Melissa Austin"></div>' +
              '<div class="p__b">' +
                '<span class="p__role">Apostle &amp; Pastor</span>' +
                '<h3>Carlos and Melissa Austin</h3>' +
                '<div class="p__church">' +
                  '<b>Kingdom Builders Ministry Church</b>' +
                  '200 N. Houston Ave., Suite C<br>Humble, TX 77338' +
                '</div>' +
                '<div class="p__links">' +
                  '<a href="https://www.facebook.com/kbmchurch2014/" target="_blank" rel="noopener">Facebook</a>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="p__c">' +
              '<div class="p__ph"><img src="' + CALLOWAY + '" ' +
                'alt="Pastor Derrick Calloway and Pastor Pamla Calloway"></div>' +
              '<div class="p__b">' +
                '<span class="p__role">Lead Pastors</span>' +
                '<h3>Derrick and Pamla Calloway</h3>' +
                '<div class="p__church">' +
                  '<b>Faith Culture Church</b>' +
                  '245 Florida Ave SE<br>Denham Springs, LA 70726' +
                '</div>' +
                '<div class="p__links">' +
                  '<a href="https://faithculturechurchbr.com/about" target="_blank" rel="noopener">Website</a>' +
                  '<a href="https://www.facebook.com/fccaplacejustforyou/" target="_blank" rel="noopener">Facebook</a>' +
                '</div>' +
              '</div>' +
            '</div>' +

          '</div>' +
          '<div style="margin-top:48px">' +
            '<a class="btn btn--dark" href="https://www.youtube.com/@arisechurch4147" ' +
            'target="_blank" rel="noopener">Watch Now</a>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker">Gatherings</span></div>' +
          '<h2>Camp Meetings &amp; Teachings</h2>' +
          '<div class="gal-mount"></div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker">Camp Meeting</span></div>' +
            '<h2>The Outpour</h2>' +
            '<p>The Lead Network 2026 Camp Meeting, October 30 to November 1.</p>' +
          '</div>' +
          '<a class="btn" href="/events" target="_top">See the Event</a>' +
        '</div></div></section>' +
      '</div>';

    this._wire();
  }
  static get observedAttributes() { return ['data-photos']; }
  attributeChangedCallback() { if (this._built) this.fillGallery(); }

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
      }).filter(function (p) { return p.src || p.video || p.videoId; });
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

      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + p.videoId + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + p.video + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + p.src + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + p.src + '" alt="' + (p.alt || '') + '">';
        }
        cap.textContent = p.caption || '';
        idx.textContent = (self._i + 1) + ' / ' + list.length;
      };
      this._close = function () {
        lb.setAttribute('data-open', 'false');
        stage.innerHTML = '';
        document.documentElement.style.overflow = '';
      };
      lb.querySelector('.agl-lb__x').addEventListener('click', this._close);
      lb.querySelector('.agl-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.agl-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) self._close(); });
      document.addEventListener('keydown', function (e) {
        if (lb.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') self._close();
        if (e.key === 'ArrowLeft') self._show(self._i - 1);
        if (e.key === 'ArrowRight') self._show(self._i + 1);
      });
    }

    this.querySelectorAll('.gal__t').forEach(function (b) {
      b.addEventListener('click', function () {
        self._show(parseInt(b.getAttribute('data-i'), 10));
        self._lb.setAttribute('data-open', 'true');
        document.documentElement.style.overflow = 'hidden';
        self._lb.querySelector('.agl-lb__x').focus();
      });
    });
  }

  disconnectedCallback() {
    if (this._lb && this._lb.parentNode) this._lb.parentNode.removeChild(this._lb);
    document.documentElement.style.overflow = '';
  }
}

customElements.define('arise-leadnetwork', AriseLeadNetwork);