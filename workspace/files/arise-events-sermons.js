/* ===========================================================================
   ARISE CHURCH — EVENTS & PAST SERMONS  (one file, two tags)
   File: public/custom-elements/arise-events-sermons.js

   Paste this ONCE into public/custom-elements/. Then:

     Events        ->  tag name  arise-events
     Past Sermons  ->  tag name  arise-sermons

   Stretch each element FULL WIDTH and give it plenty of height.

   ALL COPY IS FROM THE LIVE SITE — event details, video titles and
   descriptions are exactly as published.

   ---------------------------------------------------------------------------
   TWO THINGS TO KNOW
   ---------------------------------------------------------------------------
   EVENTS: the RSVP button links to your existing Wix Events page. This element
   does NOT replace Wix Events ticketing — it presents the event and sends
   people to the real registration flow.

   SERMONS: videos open on YouTube in a new tab rather than playing inline.
   Embedding inside a custom element inside a Wix iframe is fragile, and your
   Wix Video channel already handles inline playback. If you want the Wix Video
   player kept, leave it on the page BELOW this element.
   =========================================================================== */

const AES_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const YT = 'https://i.ytimg.com/vi/';
const WM = 'https://static.wixstatic.com/media/';

/* Real videos from the live Past Sermons page */
const CLIPS = [
  { id:'GatBPIhEMg4', len:'0:35',
    title:'Upcoming at Arise Church \u2014 Phase Two Launch &amp; Apostle Joanne Hunter',
    desc:'Big things ahead at Arise Church \u2014 the Phase Two launch and a visit from Apostle Joanne Hunter. Dates and details in the video.' },
  { id:'Gtu2W5uaBsw', len:'0:38',
    title:'Baby Shower for Baby Cairo \u2014 Aug 22 | RSVP &amp; Registry',
    desc:'Celebrating Baby Cairo! Join the Arise Church family Saturday, August 22 \u2014 RSVP and registry details in the video.' },
  { id:'1FNbubTU_Sg', len:'0:31',
    title:'Receive Strength for the Journey',
    desc:'Before the next leg of your journey: stop, breathe, receive. God\u2019s strength for what\u2019s ahead is given, not earned.' },
  { id:'9ius_ZgQuYA', len:'1:57',
    title:'Why Abram Refused Sodom\u2019s Wealth',
    desc:'Not a thread, not a sandal strap \u2014 Abram wouldn\u2019t let Sodom say it made him rich (Genesis 14:22-23). Who funds you matters.' },
  { id:'0ZF_-1g8Li8', len:'1:48',
    title:'The Church That Gave Beyond Its Means',
    desc:'Deep poverty, overflowing joy \u2014 and they begged for the chance to give (2 Corinthians 8:1-7). The Macedonian church rewrites what generosity means.' },
  { id:'dD0PrqHdmzM', len:'0:50',
    title:'Offering Confession \u2014 Declare Breakthrough &amp; Blessing',
    desc:'Don\u2019t just give it \u2014 say something over it. A confession to declare over your offering: breakthrough, favor, and blessing on every seed.' },
  { id:'J4T4YcOMAgc', len:'1:40',
    title:'Jesus\u2019 Warning: Give in Secret, Not for Show',
    desc:'Give to be seen and the applause is your whole reward. Give in secret and your Father who sees in secret rewards you (Matthew 6:1-4).' },
  { id:'zMLoS0O8YDM', len:'0:58',
    title:'The Breaker Anointing \u2014 Shatter the Glass Ceiling',
    desc:'Some limits are invisible but real. The Breaker anointing shatters the ceiling over your increase \u2014 and what held you down loses its grip.' }
];

const AES_CSS = `
arise-events,arise-sermons{display:block;width:100%}
.aes *{box-sizing:border-box;margin:0;padding:0}
.aes{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;
  color-scheme:light only;width:100vw;margin-left:calc(50% - 50vw);
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

@media(prefers-reduced-motion:reduce){.aes *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .aes{background:#fff;color:#0A0A0C}
  .aes .sect{background:#fff}.aes .sect--bone{background:#F4F2F0}
  .aes .sect--ink,.aes .phead,.aes .feat{background:#0A0A0C}
}
`;

function aesHead() {
  if (!document.getElementById('aes-fonts')) {
    const l = document.createElement('link');
    l.id = 'aes-fonts'; l.rel = 'stylesheet'; l.href = AES_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('aes-css')) {
    const s = document.createElement('style');
    s.id = 'aes-css'; s.innerHTML = AES_CSS;
    document.head.appendChild(s);
  }
}

const PLAY_SVG = '<svg width="24" height="28" viewBox="0 0 22 26" fill="none" aria-hidden="true">' +
  '<path d="M21 13L0 25.99V0L21 13Z" fill="#fff"/></svg>';

/* -------------------------------- EVENTS ----------------------------- */
class AriseEvents extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; aesHead();

    this.innerHTML =
      '<div class="aes">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Events</h1>' +
        '</div></header>' +

        '<section style="padding:0"><div class="shell" style="padding-top:var(--sect)">' +
          '<div class="mark"><span class="kicker">Upcoming</span></div>' +
        '</div>' +
        '<div class="shell"><div class="feat">' +
          '<div class="feat__img">' +
            '<img src="' + WM + 'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg" alt="Arise Church congregation worshipping with hands raised">' +
            '<div class="feat__date"><span class="m">Oct</span><span class="d">30</span></div>' +
          '</div>' +
          '<div class="feat__b">' +
            '<div class="strip" style="margin-bottom:24px"><span>Fri, Oct 30</span></div>' +
            '<h2>The Lead Network<br>2026 Camp Meeting:<br>The Outpour</h2>' +
            '<p class="feat__sub">Impartation and Activation of Spiritual Gifts by the Holy Spirit</p>' +
            '<div class="meta">' +
              '<div class="meta__r"><h4>Time</h4><div>Oct 30, 2026, 10:00 AM \u2013 Nov 01, 2026, 12:30 PM</div></div>' +
              '<div class="meta__r"><h4>Location</h4><div>Arise Church, 501 Ates Rd, Pineville, LA 71360, USA</div></div>' +
            '</div>' +
            '<div style="margin-top:44px"><a class="btn" href="/events" target="_top">RSVP</a></div>' +
          '</div>' +
        '</div></div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">About the Event</span></div>' +
          '<h2>Event Highlights</h2>' +
          '<p class="lede" style="margin-top:24px;max-width:50ch">Come for fresh fire and rekindle, revive, and release.</p>' +
          '<div class="det">' +
            '<div class="det__c"><h4>Hosted By</h4><p>Apostle Bryant Sanders and Pastor Vanessa Sanders of the Lead Network and Arise Church.</p></div>' +
            '<div class="det__c"><h4>Guest Speaker</h4><p>Pastor Keith Miller (Stand Firm World Ministries).</p></div>' +
            '<div class="det__c"><h4>Contact</h4><p><a href="mailto:empoweredleader1@gmail.com">empoweredleader1@gmail.com</a></p></div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Previous Events</span></div>' +
          '<h2>Here You Can Check Out<br>Photos From Our Past Events</h2>' +
          '<div class="empty"><h3>Photo albums coming soon</h3>' +
          '<p>Past event albums will appear here.</p></div>' +
          '<div style="margin-top:44px"><a class="btn btn--ghost" href="/previous-events-1" target="_top">Previous Events</a></div>' +
        '</div></section>' +
      '</div>';
  }
}

/* ------------------------------- SERMONS ----------------------------- */
class AriseSermons extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; aesHead();

    const cards = CLIPS.map(c =>
      '<a class="card" href="https://www.youtube.com/watch?v=' + c.id + '" target="_blank" rel="noopener">' +
        '<div class="card__th">' +
          '<img src="' + YT + c.id + '/maxresdefault.jpg" alt="' + c.title.replace(/&[a-z]+;/g,'and').replace(/<[^>]*>/g,'') + '">' +
          '<span class="card__len">' + c.len + '</span>' +
        '</div>' +
        '<h3>' + c.title + '</h3>' +
        '<p>' + c.desc + '</p>' +
      '</a>').join('');

    this.innerHTML =
      '<div class="aes">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Past Sermons</h1>' +
        '</div></header>' +

        '<section class="sect sect--ink" style="padding-top:64px"><div class="shell">' +
          '<div class="featv">' +
            '<div class="player">' +
              '<img src="' + WM + 'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg" alt="Arise Church Sunday Morning Service">' +
              '<a class="player__play" href="https://www.youtube.com/@arisechurch4147" target="_blank" rel="noopener" aria-label="Watch Sunday Morning Service">' +
                '<i>' + PLAY_SVG + '</i></a>' +
            '</div>' +
            '<div>' +
              '<span class="nowbadge">Now Playing</span>' +
              '<h2>Sunday Morning<br>Service</h2>' +
              '<div class="strip" style="margin-top:24px"><span>Arise Church</span></div>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section style="padding:0"><div class="shell" style="padding-top:var(--sect)">' +
          '<div class="series">' +
            '<div>' +
              '<div class="mark mark--l" style="margin-bottom:16px"><span class="kicker">Current Series</span></div>' +
              '<h2>The Kingdom<br>Culture of Giving</h2>' +
            '</div>' +
            '<a class="btn btn--ghost" href="https://www.youtube.com/@arisechurch4147" target="_blank" rel="noopener">Watch the Full Message</a>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">More From Arise Church</span></div>' +
          '<h2>Clips &amp; Announcements</h2>' +
          '<div class="grid">' + cards + '</div>' +
          '<div style="margin-top:56px"><a class="btn btn--dark" href="https://www.youtube.com/@arisechurch4147" target="_blank" rel="noopener">All Messages on YouTube</a></div>' +
        '</div></section>' +
      '</div>';
  }
}

customElements.define('arise-events', AriseEvents);
customElements.define('arise-sermons', AriseSermons);
