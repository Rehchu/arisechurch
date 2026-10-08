/* ===========================================================================
   ARISE CHURCH -- SERMONS
   File: public/custom-elements/arise-sermons.js
   Tag:  arise-sermons

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-sermons.js
      -> paste this whole file
   2. Editor -> the Sermons page -> Add (+) -> Embed Code -> Custom Element
   3. Choose Source -> Velo file -> arise-sermons.js
      Tag Name: arise-sermons
   4. STRETCH IT FULL WIDTH. Give it plenty of height.
   5. Save, then PUBLISH. Check the LIVE page -- custom elements render in an
      iframe in Editor and Preview, so they look wrong there. That's normal.

   All copy is from the live site.
   Videos open on YouTube in a new tab. If you want inline playback,
   keep your Wix Video channel on the page BELOW this element.
   Fixed 2026-09-14: live player no longer reloads on repeat updates, series band hidden unless active, series text escaped, CMS time hooks in CTA, safer applyContent
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-sermons.json)
   14 Sept (Bradly): the clips grid shows the newest YouTube Shorts (data-clips from the page code, read by
   backend/youtube.jsw getLatestShorts). The built-in list is the newest Shorts on 14 Sept; per-clip CMS rows removed.
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const YT = 'https://i.ytimg.com/vi/';

/* Arise Church YouTube channel.
   YouTube auto-generates per-channel playlists. Take the channel ID, drop the
   leading "UC", and prefix:
       UU   = all uploads (includes Shorts)
       UULF = long-form videos only
       UULV = LIVE STREAMS only   <-- what the featured player uses
       UUSH = Shorts only
   Embedding the UULV playlist always plays the most recent livestream.
   No API key, no backend, nothing to maintain. */
const CHANNEL_ID   = 'UCGS9j7B_prcJkbTNgzlGrKg';
const STREAMS_ID   = 'UULV' + CHANNEL_ID.slice(2);
const LATEST_EMBED = 'https://www.youtube.com/embed/videoseries?list=' + STREAMS_ID + '&rel=0';

/* Glory Nights -- Monday nights at the Main Campus. 91 messages and counting. */
const GLORY_LIST  = 'PLYhdT3QigNmY';
const GLORY_EMBED = 'https://www.youtube.com/embed/videoseries?list=' + GLORY_LIST + '&rel=0';
const GLORY_URL   = 'https://www.youtube.com/playlist?list=' + GLORY_LIST;
const WM = 'https://static.wixstatic.com/media/';

/* Built-in Shorts list. Shown only until the page code sends the newest Shorts
   from the YouTube channel (data-clips), or if YouTube cannot be reached.
   These were the 8 newest Shorts on 14 Sept 2026. */
const CLIPS = [
  { id: "m_bDPBzAGUE", title: "Declare: Last Year Was the Last Year I Lived Paycheck to Paycheck" },
  { id: "BNCJUUBlRis", title: "Don't Pick Battles God Didn't Give You" },
  { id: "Dqo3tRQVMNs", title: "Walk Through the Doors God Opens" },
  { id: "U1DXCwVC88M", title: "Revisit the Prophecies Over Your Life" },
  { id: "ukQKnseBTho", title: "Obey Like a Child: When You Say Go, I'll Go" },
  { id: "cE7bkakfz08", title: "This Is the Year of Breakthroughs" },
  { id: "Yj1BsfOaNZ4", title: "Try God This Year: Say What He Says and Watch" },
  { id: "J1w-TDq-F-E", title: "Ezekiel's Sword: You're Being Sharpened and Polished" }
];

const PLAY_SVG = '<svg width="24" height="28" viewBox="0 0 22 26" fill="none" aria-hidden="true">' +
  '<path d="M21 13L0 25.99V0L21 13Z" fill="#fff"/></svg>';

const AES_CSS = `
arise-events,arise-sermons{display:block;width:100%}
.aes *{box-sizing:border-box;margin:0;padding:0}
.aes{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;
  color-scheme:light only;
}
.aes img{color:#fff;font-size:12px;background:#1A1A1F}
.aes .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.aes h1,.aes h2,.aes h3,.aes h4{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aes h1{font-size:clamp(40px,7.4vw,84px)}
.aes h2{font-size:clamp(26px,3.8vw,46px)}
.aes h3{font-size:clamp(15px,1.5vw,17.5px);letter-spacing:.03em;line-height:1.18}
.aes h4{font-size:13px;letter-spacing:.12em}
.aes p{font-size:clamp(15.5px,1.4vw,17px)}
.aes .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.aes .mark{display:flex;align-items:center;margin-bottom:18px}
.aes .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.aes .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
.aes .mark--l .kicker{color:var(--redL)}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .aes .mark{flex-wrap:nowrap;align-items:flex-start}
  .aes .mark::before{margin-right:124px;margin-top:5px}
  .aes .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aes .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.aes .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.aes .btn{display:inline-block;padding:15px 32px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;cursor:pointer;transition:background .18s,color .18s,border-color .18s}
.aes .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aes .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aes .btn--ghost:hover{background:#fff;color:var(--ink)}
.aes .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aes .btn--dark:hover{background:var(--ink);color:#fff}
.aes a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.aes .sect{padding:var(--sect) 0;background:var(--paper)}
.aes .sect--bone{background:var(--bone)}
.aes .sect--ink{background:var(--ink)}
.aes .sect--ink h2,.aes .sect--ink h3{color:#fff}
.aes .sect--ink p{color:rgba(255,255,255,.82)}
.aes .sect--ink h4{color:var(--redL)}

.aes .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.aes .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.aes .phead h1{color:#fff;position:relative;z-index:1}

/* ---------- EVENTS: featured ---------- */
.aes .feat{display:grid;grid-template-columns:1fr 1fr;background:var(--ink);color:#fff}
@media(max-width:900px){.aes .feat{grid-template-columns:1fr}}
.aes .feat__img{position:relative;min-height:420px;overflow:hidden;background:var(--scrim)}
.aes .feat__img img{width:100%;height:100%;object-fit:cover;filter:brightness(.72)}
.aes .feat__date{position:absolute;top:32px;left:32px;background:var(--red);color:#fff;
  text-align:center;padding:16px 24px;min-width:96px}
.aes .feat__date .m{display:block;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.aes .feat__date .d{display:block;font-family:'Anton',Impact,sans-serif;font-size:42px;line-height:1;margin-top:4px}
.aes .feat__b{padding:clamp(32px,4.5vw,60px);display:flex;flex-direction:column;justify-content:center}
.aes .feat__b h2{color:#fff}
.aes .feat__sub{color:rgba(255,255,255,.82);font-size:17px;margin-top:24px;max-width:44ch}
.aes .meta{margin-top:32px;border-top:1px solid var(--ruleD)}
.aes .meta__r{display:flex;gap:24px;padding:16px 0;border-bottom:1px solid var(--ruleD);font-size:14.5px}
.aes .meta__r h4{flex:0 0 108px;color:var(--redL);padding-top:2px}
.aes .meta__r div{color:rgba(255,255,255,.82)}

.aes .det{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--rule);margin-top:48px}
.aes .det__c{background:var(--paper);padding:32px}
.aes .det__c h4{color:var(--red);margin-bottom:16px}
.aes .det__c p{font-size:15.5px;line-height:1.72}
.aes .det__c a{color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--red);word-break:break-word}
@media(max-width:860px){.aes .det{grid-template-columns:1fr}}

.aes .empty{border:1.5px dashed var(--ruleD);padding:48px 32px;text-align:center;margin-top:48px}
.aes .empty h3{color:rgba(255,255,255,.6);margin-bottom:12px}
.aes .empty p{color:rgba(255,255,255,.6);font-size:15px;max-width:46ch;margin:0 auto}

/* ---------- SERMONS ---------- */
.aes .player{position:relative;aspect-ratio:16/9;background:var(--scrim);overflow:hidden}
.aes .player img{width:100%;height:100%;object-fit:cover;opacity:.68}
.aes .player iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.aes .nowbadge[data-live="true"]{background:#D6222D;position:relative;padding-left:26px}
.aes .nowbadge[data-live="true"]::before{content:"";position:absolute;left:12px;top:50%;
  transform:translateY(-50%);width:7px;height:7px;border-radius:50%;background:#fff;
  animation:aesPulse 1.6s ease-in-out infinite}
@keyframes aesPulse{0%,100%{opacity:1}50%{opacity:.25}}
.aes .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.aes .cta h2{color:#fff}
.aes .cta p{color:#fff;margin-top:12px;max-width:46ch}
.aes .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.aes .cta .kicker{color:#fff}
.aes .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.aes .cta .btn:hover{background:transparent;color:#fff}
.aes .cta__b{flex:1 1 320px}
@media(prefers-reduced-motion:reduce){.aes .nowbadge[data-live="true"]::before{animation:none}}
.aes .player__play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  border:0;background:transparent;cursor:pointer;text-decoration:none}
.aes .player__play i{width:82px;height:82px;border-radius:50%;background:var(--red);display:flex;
  align-items:center;justify-content:center;transition:transform .22s ease;font-style:normal}
.aes .player__play:hover i{transform:scale(1.08)}
.aes .featv{display:grid;grid-template-columns:1.35fr .65fr;gap:clamp(28px,4vw,56px);align-items:center}
@media(max-width:900px){.aes .featv{grid-template-columns:1fr}}
.aes .nowbadge{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;padding:5px 12px;margin-bottom:16px}

.aes .series{display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;
  background:var(--red);color:#fff;padding:48px clamp(24px,4vw,52px)}
.aes .series h2{color:#fff}
.aes .series .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.aes .series .kicker{color:#fff}

.aes .glory{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(28px,4vw,56px);
  align-items:center;margin-top:48px}
@media(max-width:900px){.aes .glory{grid-template-columns:1fr}}
.aes .glory__b h2{color:#fff}
.aes .glory__when{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}
.aes .glory__when span{border:1px solid var(--ruleD);color:rgba(255,255,255,.86);
  font-size:12px;letter-spacing:.14em;text-transform:uppercase;padding:8px 14px}
.aes .glory__p{position:relative;aspect-ratio:16/9;background:var(--scrim);overflow:hidden}
.aes .glory__p iframe{position:absolute;inset:0;width:100%;height:100%;border:0}

.aes .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px 24px;margin-top:48px}
@media(max-width:1000px){.aes .grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.aes .grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.aes .grid{grid-template-columns:1fr}}
.aes .card{display:block;text-decoration:none;color:inherit}
.aes .card__th{position:relative;aspect-ratio:16/9;background:var(--scrim);overflow:hidden}
.aes .card__th img{width:100%;height:100%;object-fit:cover;filter:brightness(.9);
  transition:transform .45s ease,filter .3s ease}
.aes .card:hover .card__th img{transform:scale(1.05);filter:brightness(1)}
.aes .card__th::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--red);
  transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
.aes .card:hover .card__th::after{transform:scaleX(1)}
.aes .card__len{position:absolute;right:8px;bottom:8px;background:rgba(6,6,8,.88);color:#fff;
  font-size:11px;letter-spacing:.06em;padding:3px 7px}
.aes .card h3{margin-top:16px}
.aes .card p{font-size:13.5px;color:var(--muted);line-height:1.6;margin-top:8px}
.aes .card__th--short{aspect-ratio:9/16}
.aes .grid--shorts{grid-template-columns:repeat(4,1fr);gap:28px 20px}
@media(max-width:760px){.aes .grid--shorts{grid-template-columns:repeat(2,1fr);gap:24px 14px}}

@media(prefers-reduced-motion:reduce){.aes *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .aes{background:#fff;color:#0A0A0C}
  .aes .sect{background:#fff}.aes .sect--bone{background:#F4F2F0}
  .aes .sect--ink,.aes .phead,.aes .feat{background:#0A0A0C}
}
`;

function asrEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

/* Arise Church photos: ask Wix for a resized copy (whole image, longest side at most w,
   AVIF/WebP picked per browser). Anything that is not a plain wixstatic photo is left alone. */
function asrImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('aes-sermons-fonts') && !document.querySelector('link[href="' + FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'aes-sermons-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('aes-sermons-css')) {
    const s = document.createElement('style');
    s.id = 'aes-sermons-css'; s.innerHTML = AES_CSS;
    document.head.appendChild(s);
  }
}

class AriseSermons extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();

    this.innerHTML =
      '<div class="aes">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="sermons.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="sermons.hero.heading">Sermons</h1>' +
        '</div></header>' +

        '<section class="sect sect--ink" style="padding-top:64px"><div class="shell">' +
          '<div class="featv">' +
            '<div class="player">' +
              '<iframe id="ariseFeatured" src="' + LATEST_EMBED + '" title="Arise Church \u2014 latest service" ' +
              'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
              'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
            '</div>' +
            '<div>' +
              '<span class="nowbadge" id="ariseBadge">Latest Service</span>' +
              '<h2 data-ck="sermons.latest.heading">Sunday Morning<br>Service</h2>' +
              '<div class="strip" style="margin-top:24px"><span data-ck="sermons.latest.strip">Arise Church</span></div>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section style="padding:0"><div class="shell" style="padding-top:var(--sect)">' +
          '<div class="series" id="ariseSeries" style="display:none" data-cms-source="SiteSettings">' +
            '<div>' +
              '<div class="mark mark--l" style="margin-bottom:16px"><span class="kicker" data-ck="sermons.series.kicker">Current Series</span></div>' +
              '<h2 id="ariseSeriesTitle">The Kingdom<br>Culture of Giving</h2>' +
            '</div>' +
            '<a class="btn btn--ghost" id="ariseSeriesBtn" href="https://www.youtube.com/@arisechurch4147/streams" target="_blank" rel="noopener">Watch the Full Message</a>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="glory">' +
            '<div class="glory__b">' +
              '<div class="mark mark--l"><span class="kicker" data-ck="sermons.glory.kicker">Monday Nights</span></div>' +
              '<h2 data-ck="sermons.glory.heading">Glory Nights</h2>' +
              '<div class="glory__when">' +
                '<span data-ck="site.times.main.glorynight">Monday 7:00 PM</span>' +
                '<span data-ck="sermons.glory.campus">Main Campus</span>' +
                '<span data-ck="sermons.glory.address">501 Ates Road, Pineville</span>' +
              '</div>' +
              '<div style="margin-top:34px">' +
                '<a class="btn btn--ghost" href="' + GLORY_URL + '" target="_blank" rel="noopener" data-ck="sermons.glory.button">All Glory Nights</a>' +
              '</div>' +
            '</div>' +
            '<div class="glory__p">' +
              '<iframe src="' + GLORY_EMBED + '" title="Arise Church \u2014 Glory Nights" ' +
              'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
              'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="sermons.clips.kicker">More From Arise Church</span></div>' +
          '<h2 data-ck="sermons.clips.heading">Clips &amp; Announcements</h2>' +
          '<div class="grid grid--shorts" id="aesClips" data-cms-source="YouTube"></div>' +
          '<div style="margin-top:56px"><a class="btn btn--dark" href="https://www.youtube.com/@arisechurch4147" target="_blank" rel="noopener" data-ck="sermons.clips.button">All Messages on YouTube</a></div>' +
        '</div></section>' +
        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta">' +
            '<div class="cta__b">' +
              '<div class="mark"><span class="kicker" data-ck="sermons.cta.kicker">Join Us In Person</span></div>' +
              '<h2 data-ck="sermons.cta.heading">Better In The Room</h2>' +
              '<p><span data-ck="site.times.sunday.main">Sunday 10:30 AM</span> <span data-ck="sermons.cta.bodyMain">in Pineville,</span> ' +
              '<span data-ck="site.times.sunday.second">Sunday 10:00 AM</span> <span data-ck="sermons.cta.bodySecond">in Alexandria. ' +
              'Glory Nights</span> <span data-ck="site.times.main.glorynight">Monday 7:00 PM</span><span data-ck="sermons.cta.bodyEnd">.</span></p>' +
            '</div>' +
            '<a class="btn" href="/contact" target="_top" data-ck="sermons.cta.button">Plan Your Visit</a>' +
          '</div>' +
        '</div></section>' +
      '</div>';

    this.renderClips();
    this.applyContent();

    /* If the page code tells us a live stream is running, switch the player.
       Set it with:  el.setAttribute('data-live-video', '<videoId>')
       See the Sermons page code in the build notes. Without it, the player
       simply shows the most recent upload, which is the sensible default. */
    this.applyLive();
    this.applySeries();
  }

  static get observedAttributes() { return ['data-clips', 'data-live-video', 'data-series-active', 'data-series-title',
            'data-series-line', 'data-series-link', 'data-series-button', 'data-content']; }

  attributeChangedCallback(name) {
    if (!this._b) return;   // nothing to patch until it has rendered
    if (name === 'data-content') { this.applyContent(); return; }
    if (name === 'data-clips') { this.renderClips(); return; }
    if (name === 'data-live-video') this.applyLive();
    else this.applySeries();
  }

  /* Shorts grid. The page code sends the newest Shorts from the YouTube channel
     as data-clips: [{ id, title }]. Until then, or if YouTube cannot be reached,
     the built-in CLIPS list shows. Each card opens the Short on YouTube. */
  renderClips() {
    const mount = this.querySelector('#aesClips');
    if (!mount) return;
    let list = [];
    const raw = this.getAttribute('data-clips');
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) { console.error('arise-sermons: bad data-clips JSON', e); list = []; }
    }
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (c) { return c && /^[A-Za-z0-9_-]{11}$/.test(String(c.id || '')); }).slice(0, 12);
    if (!list.length) list = CLIPS;
    const key = list.map(function (c) { return c.id + '|' + (c.title || ''); }).join(',');
    if (this._clipsKey === key && mount.children.length) return;
    this._clipsKey = key;
    mount.innerHTML = list.map(function (c) {
      const title = String(c.title || '').replace(/\s+/g, ' ').trim();
      return '<a class="card" href="https://www.youtube.com/shorts/' + c.id + '" target="_blank" rel="noopener">' +
        '<div class="card__th card__th--short">' +
          '<img src="' + YT + c.id + '/frame0.jpg" alt="' + asrEsc(title || 'Arise Church Short') + '" loading="lazy" decoding="async">' +
        '</div>' +
        (title ? '<h3>' + asrEsc(title) + '</h3>' : '') +
      '</a>';
    }).join('');
  }

  /* Series band, driven from the SiteSettings collection by the page code.
     Unless seriesActive is exactly true, the whole band stays hidden --
     which is what should happen when you're between series. */
  applySeries() {
    const band  = this.querySelector('#ariseSeries');
    if (!band) return;

    const active = this.getAttribute('data-series-active');
    if (active !== 'true') { band.style.display = 'none'; return; }
    band.style.display = '';

    const title  = this.getAttribute('data-series-title');
    const line   = this.getAttribute('data-series-line');
    const link   = this.getAttribute('data-series-link');
    const label  = this.getAttribute('data-series-button');

    const h = this.querySelector('#ariseSeriesTitle');
    if (h && title) h.innerHTML = line ? (asrEsc(title) + '<br>' + asrEsc(line)) : asrEsc(title);

    const b = this.querySelector('#ariseSeriesBtn');
    if (b) {
      if (link && /^(https?:\/\/|\/)/i.test(link)) b.setAttribute('href', link);
      if (label) b.textContent = label;
    }
  }

  applyLive() {
    const frame = this.querySelector('#ariseFeatured');
    const badge = this.querySelector('#ariseBadge');
    if (!frame) return;

    let vid = this.getAttribute('data-live-video');
    if (vid && !/^[A-Za-z0-9_\-]+$/.test(vid)) vid = '';
    const target = vid ? 'https://www.youtube.com/embed/' + vid + '?rel=0&autoplay=0' : LATEST_EMBED;
    if (frame.getAttribute('src') !== target) frame.src = target;
    if (badge) {
      const txt = vid ? 'Live Now' : 'Latest Service';
      if (badge.textContent !== txt) badge.textContent = txt;
      if (vid) { if (badge.getAttribute('data-live') !== 'true') badge.setAttribute('data-live', 'true'); }
      else if (badge.hasAttribute('data-live')) badge.removeAttribute('data-live');
    }
  }
  applyContent() {
    const raw = this.getAttribute('data-content');
    if (!raw) return;
    let map;
    try { map = JSON.parse(raw); } catch (e) {
      console.error('bad data-content JSON', e); return;
    }
    if (!map || typeof map !== 'object') return;

    const has = Object.prototype.hasOwnProperty;
    this.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = has.call(map, k) ? map[k] : null;
      if (v && v.text) el.innerHTML = v.text;
    });
    this.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = has.call(map, k) ? map[k] : null;
      if (!v || !v.image) return;
      const img = asrImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
      if (el.tagName === 'IMG') el.src = img;
      else el.style.backgroundImage = 'url("' + String(img).replace(/["\\]/g, '') + '")';
    });
  }
}

customElements.define('arise-sermons', AriseSermons);
