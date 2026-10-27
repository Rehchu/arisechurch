/* ===========================================================================
   ARISE CHURCH -- SERMONS / MEDIA PAGE  ("House Lights Down")
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

   The page is one dark theatre lit by the church's own footage, shown as a
   running order: a compact masthead, a numbered tab strap (01 Latest, 02 Series,
   03 Glory Nights, 04 Sermons, 05 Clips), one room on stage at a time, and the
   "Better in the Room" invitation always below the deck, above the footer. The
   strap locks to the top of the screen (under the site header when Wix pins it)
   while the deck is in view. Picking a tab slides the next room in from the side; on a phone you can
   also swipe between rooms. Every room is lit by the thumbnail of the thing it
   plays, and one red footlight runs along each room's diagonal cut and comes on
   when the church goes live.

   Attributes (any order, any time, from the page code):
     data-latest-video  JSON {id,title,when,url}   newest service -> the stage
     data-live-video    video id ('' when over)    takes over the stage + strap
     data-glory-video   JSON {id,title,when,url}   newest Glory Night
     data-playlists     JSON [{id,title,count,thumb,url}]
     data-clips         JSON [{id,title}]          newest Shorts
     data-series-*      active/title/line/link/button  (current series band)
     data-content       Page Content map (data-ck / data-ci hooks)
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
   Embedding the UULV playlist always plays the most recent livestream. */
const CHANNEL_ID   = 'UCGS9j7B_prcJkbTNgzlGrKg';
const STREAMS_ID   = 'UULV' + CHANNEL_ID.slice(2);
const LATEST_EMBED = 'https://www.youtube.com/embed/videoseries?list=' + STREAMS_ID + '&rel=0';

/* Glory Nights -- Monday nights at the Main Campus. */
const GLORY_LIST  = 'PLYhdT3QigNmY';
const GLORY_EMBED = 'https://www.youtube.com/embed/videoseries?list=' + GLORY_LIST + '&rel=0';
const GLORY_URL   = 'https://www.youtube.com/playlist?list=' + GLORY_LIST;
const CHANNEL_URL = 'https://www.youtube.com/@arisechurch4147';

/* Built-in playlist list for the Sermons section. Shown until the page code
   sends the channel's playlists (data-playlists from backend/youtube.jsw
   getPlaylists), or if YouTube cannot be reached. These were the channel's
   playlists on 27 Oct 2026, Glory Nights left out because it has its own
   section. The first three stay first; the rest follow YouTube's order. */
const PLAYLISTS = [
  { id: 'PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI', title: 'Sunday Sermons', count: 113, thumb: YT + 'oYSMY9VJk1I/hqdefault.jpg' },
  { id: 'PLa-Nxr2f-qHY', title: 'Apostle Bryant Sanders \u2014 Messages', count: 82, thumb: YT + 'GfTvURWWlLg/hqdefault.jpg' },
  { id: 'PLeDfl1m-bAzo', title: 'Pastor Vanessa Sanders \u2014 Messages', count: 45, thumb: YT + '8gUVgiIENWk/hqdefault.jpg' },
  { id: 'PLAUiV-2ZIEuI', title: 'Guest Ministers | Arise Church', count: 24, thumb: YT + 'v6O3oGM3xG8/hqdefault.jpg' },
  { id: 'PLMbBRRxhqveM', title: 'Fruit of the Spirit (Series)', count: 5, thumb: YT + '2LeaYkJKkM8/hqdefault.jpg' },
  { id: 'PLO9cKOxkFsOs', title: 'Sermon Series: This Is Us (2019)', count: 5, thumb: YT + 'oYSMY9VJk1I/hqdefault.jpg' },
  { id: 'PLBKi2GRVZ2uY', title: "Men's Retreat 2026 \u2014 The Covering", count: 3, thumb: YT + 'R_GgUKwRucs/hqdefault.jpg' },
  { id: 'PLWJRS0iEv_vk', title: 'Conferences & Special Events', count: 31, thumb: YT + 'fgjN_1f203A/hqdefault.jpg' },
  { id: 'PLcUxXtBi6scY', title: 'The Supernatural Power of the Name of Jesus (Series)', count: 4, thumb: YT + 'ElcTtCxWq9A/hqdefault.jpg' },
  { id: 'PLHe_Ip_acqAM', title: 'No Killer, No King (Series)', count: 5, thumb: YT + 'F7pNGR7JFXc/hqdefault.jpg' },
  { id: 'PLFcdpdUSxF-A', title: 'The Believers Authority (Series)', count: 4, thumb: YT + 'qXVcqfbqguo/hqdefault.jpg' },
  { id: 'PLb-9QSfkRhnEylnizReaelT5aKprffde_', title: 'Lead Network', count: 2, thumb: YT + 'dvwZSgvYI4Q/hqdefault.jpg' },
  { id: 'PLb-9QSfkRhnFeiSw6ZING8xeppNPp1lUa', title: 'iServe September', count: 4, thumb: YT + '7UUHXXFlhuw/hqdefault.jpg' }
];
const EMBED_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

function asrVideoId(v) { return /^[A-Za-z0-9_-]{11}$/.test(String(v || '')) ? String(v) : ''; }
function asrListId(v) { return /^[A-Za-z0-9_-]{13,40}$/.test(String(v || '')) ? String(v) : ''; }
function asrPlaylistEmbed(id, autoplay) {
  return 'https://www.youtube.com/embed/videoseries?list=' + id + '&rel=0' + (autoplay ? '&autoplay=1' : '');
}
function asrPad(n) { return (n < 10 ? '0' : '') + n; }

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

const PLAY_SVG = '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">' +
  '<path d="M14 8L0 16V0L14 8Z" fill="#fff"/></svg>';
const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="#fff" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="#fff" stroke-width="1.6"/></svg>';

const AES_CSS = `
arise-sermons{display:block;width:100%}
.aes *{box-sizing:border-box;margin:0;padding:0}
.aes{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--bone:#F4F2F0;
  --paper:#fff;--muted:#6A6A6E;--ruleD:rgba(255,255,255,.15);--ruleL:rgba(10,10,12,.12);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  --cut:28px;--foot:4px;--hang:40px;--hdr:76px;
  --h1:clamp(70px,18vw,196px);--h2:clamp(40px,7vw,96px);--h2s:clamp(36px,5.4vw,72px);
  --h3:clamp(24px,2.6vw,36px);--fig:clamp(56px,7vw,96px);
  --lede:clamp(16px,1.4vw,18px);--body:clamp(15px,1.3vw,17px);
  --ease:cubic-bezier(.2,.7,.2,1);
  --railpad:max(var(--gut),calc((100% - var(--shell)) / 2 + var(--gut)));
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:#fff;line-height:1.6;
  background:var(--scrim);color-scheme:light only;overflow-x:clip;display:block;
  -webkit-font-smoothing:antialiased;
}
@media(min-width:900px){.aes{--cut:48px;--foot:5px;--hang:72px}}
.aes [hidden]{display:none!important}
.aes h1,.aes h2,.aes h3,.aes p,.aes button,.aes img,.aes iframe,.aes dl,.aes dt,.aes dd{margin:0;padding:0;border:0}
.aes img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.aes iframe{display:block}
.aes .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.aes .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.aes .g12{grid-template-columns:repeat(12,1fr)}}
.aes h1,.aes h2,.aes h3,.aes .pl__t,.aes .pl__i,.aes .short__i,.aes .folio,.aes .cnt b,.aes .sheet__time{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aes h1{font-size:var(--h1);line-height:.92;overflow-wrap:anywhere;text-shadow:0 6px 30px rgba(0,0,0,.55);color:#fff}
.aes h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.aes .h2--xl{font-size:var(--h2)}
.aes .h2--sm{font-size:var(--h3)}
.aes h3{font-size:var(--h3);color:#fff}
.aes p{font-size:var(--body);line-height:1.6}
.aes .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.aes a{color:inherit}

/* ---- house devices (copied from arise-home.js, .ah -> .aes) ---- */
.aes .mark{display:flex;align-items:center;margin-bottom:18px}
.aes .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.aes .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .aes .mark{flex-wrap:nowrap;align-items:flex-start}
  .aes .mark::before{margin-right:124px;margin-top:5px}
  .aes .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aes .mark--l .kicker{color:var(--redL)}
.aes .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.aes .mark--w .kicker{color:#fff}

.aes .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.aes .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}
.aes .strip--ghost{background:transparent;border:1.5px solid #fff}
.aes .strip--ghost span{color:#fff}

.aes .btn{display:inline-block;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;
  border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px}
.aes .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aes .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aes .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.aes .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aes .btn--dark:hover{background:var(--ink);color:#fff}
.aes .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.aes .btn--onRed:hover{background:transparent;color:#fff}
.aes a:focus-visible,.aes button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.aes .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.aes .folio--d{color:var(--red)}
.aes .folio--w{color:#fff}

/* underline link: 2px red rule that slides to full width */
.aes .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;padding:14px 0;line-height:1.3}
.aes .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.aes .ulink:hover::after,.aes .ulink:focus-visible::after{width:100%}

/* ---- screens (players) ---- */
.aes .screen{position:relative;aspect-ratio:16/9;background:var(--scrim);border:1px solid var(--ruleD);width:100%}
.aes .screen iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:var(--scrim)}
.aes .screen::after{content:"";position:absolute;inset:0;background:var(--scrim);opacity:0;pointer-events:none;transition:opacity .2s}
.aes .screen.swapping::after{opacity:.6}
.aes .screen--top{border-top:3px solid var(--red)}
@supports not (aspect-ratio:16/9){.aes .screen{height:0;padding-top:56.25%}}

/* ---- clipped backdrops + footlight ---- */
.aes .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.aes .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.aes .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.aes .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.aes .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.aes .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.aes .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s var(--ease)}
.aes .ly.on{opacity:1}
.aes .ly--soft{transform:scale(1.15)}

/* ---- §1 stage ---- */
.aes .stage{position:relative;background:var(--scrim);padding:36px 0 calc(28px + var(--cut))}
.aes .stage::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD);z-index:2}
.aes .stage__bg .ly{object-position:center top;filter:saturate(.85)}
.aes .stage__scrim{position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(6,6,8,.70) 0%,rgba(6,6,8,.35) 50%,rgba(6,6,8,.98) 100%)}
.aes .stage__wedge{display:none;position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);
  clip-path:polygon(0 0,100% 0,100% 100%)}
.aes .stage.no-img .stage__wedge{display:block}
.aes .stage__grid{position:relative;z-index:1;gap:0 24px}
.aes .stage__txt{order:2;margin-top:24px}
.aes .stage__h2{font-size:clamp(30px,4.6vw,56px);margin-top:14px}
.aes .badge{margin-top:0;display:inline-flex;align-items:center}
.aes .badge span{display:block}
.aes .is-live .badge::before{content:"";width:10px;height:10px;border-radius:50%;background:#fff;margin-right:12px;flex:0 0 auto;
  transform:skewX(9deg);animation:aesDot 1.2s ease-in-out infinite;will-change:transform}
.aes .screen--stage{order:1;margin-top:0;box-shadow:8px 8px 0 var(--red);z-index:3}
.aes .stage__txt .strip--ghost{margin-top:12px}
.aes .stage__title{font-weight:500;font-size:18px;line-height:1.4;color:#fff;margin-top:20px;max-width:40ch}
.aes .stage__when{font-weight:500;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:6px}
.aes .stage__txt .ulink{margin-top:4px}
@media(min-width:900px){
  .aes .stage{padding:56px 0 calc(48px + var(--cut))}
  .aes .stage__scrim{background:
    linear-gradient(180deg,transparent 55%,rgba(6,6,8,.96) 100%),
    linear-gradient(90deg,rgba(6,6,8,.94) 0%,rgba(6,6,8,.80) 40%,rgba(6,6,8,.30) 72%,rgba(6,6,8,.55) 100%)}
  .aes .stage__bg .ly{object-position:center 30%}
  .aes .stage__bg .ly.on{animation:aesPush 12s var(--ease) 1 both}
  .aes .stage__txt{grid-column:1/6;grid-row:1;margin-top:0;align-self:end;padding-bottom:6px}
  .aes .screen--stage{grid-column:6/13;grid-row:1;margin:0;box-shadow:12px 12px 0 var(--red)}
  .aes .stage__grid{align-items:end}
}
.aes .is-live .stage__scrim{background:
  linear-gradient(180deg,transparent 55%,rgba(6,6,8,.96) 100%),
  linear-gradient(180deg,rgba(214,34,45,.78) 0%,rgba(6,6,8,.72) 55%,rgba(6,6,8,.4) 100%)}
@media(min-width:900px){.aes .is-live .stage__scrim{background:
  linear-gradient(180deg,transparent 55%,rgba(6,6,8,.96) 100%),
  linear-gradient(90deg,rgba(214,34,45,.78) 0%,rgba(6,6,8,.72) 55%,rgba(6,6,8,.4) 100%)}}
.aes .is-live .screen--stage{border-color:var(--red);animation:aesRing 1.8s ease-out infinite}
.aes .is-live .stage__bg::after{animation:aesFoot 1.8s ease-in-out infinite}

/* ---- masthead ---- */
.aes .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.aes .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.aes .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.aes .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff}
.aes .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.aes .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:aesTick 36s linear infinite}
.aes .mast__tick:hover div{animation-play-state:paused}
.aes .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.aes .mast{padding:44px 0 26px}.aes .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; sticky under the site header while the deck is in view ---- */
.aes .strap{position:relative;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.aes .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35)}
.aes .strap__spacer{height:0}
.aes .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.aes .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.aes .strap__jump::-webkit-scrollbar{display:none}
.aes .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.aes .strap__j:first-child{border-left:0}
.aes .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
.aes .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.aes .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.aes .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.aes .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.aes .strap__j:focus-visible{outline-offset:-3px}
.aes .is-live .strap__j[data-to="aesStage"] i{color:#fff;background:var(--red);padding:3px 5px;line-height:1}
.aes .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.aes .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);cursor:pointer;transition:background .18s,opacity .18s}
.aes .strap__arrow:hover{background:rgba(255,255,255,.08)}
.aes .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .aes .strap__jump{overflow:visible;margin:0;padding:0}
  .aes .strap__j{padding:0 20px}
  .aes .strap__arrows{display:flex}
}
.aes .strap__live{display:none;background:var(--red)}
.aes .strap__livein{display:flex;align-items:center;gap:16px;min-height:48px}
.aes .strap__dot{width:10px;height:10px;border-radius:50%;background:#fff;flex:0 0 auto;animation:aesDot 1.2s ease-in-out infinite;will-change:transform}
.aes .strap__lt{flex:1 1 0;min-width:0;font-family:'Anton',Impact,sans-serif;font-size:clamp(20px,2.4vw,32px);line-height:1;letter-spacing:.02em;
  text-transform:uppercase;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aes .strap__watch{flex:0 0 auto;min-height:44px;padding:0 18px;background:transparent;border:1.5px solid #fff;color:#fff;
  font:600 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:background .18s,color .18s}
.aes .strap__watch:hover{background:#fff;color:var(--red)}
.aes .strap__watch:focus-visible{outline-color:#fff}
.aes .is-live .strap__live{display:block}
@media(min-width:900px){.aes .is-live .strap__livein{min-height:56px}}

/* ---- the deck ---- */
.aes .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.aes .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.aes .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.aes .panel:not(.is-active){visibility:hidden}
.aes .deck.moving .panel{visibility:visible}
.aes .panel.enter > .shell{animation:aesRise .55s var(--ease) both}
.aes .rail{touch-action:auto}

/* ---- 02 series ---- */
.aes .series{position:relative;background:var(--scrim);padding:48px 0 calc(56px + var(--cut))}
.aes .series__row{position:relative;display:flex;flex-wrap:wrap;align-items:flex-end;gap:24px}
.aes .series__row::before{content:"";position:absolute;left:0;bottom:36px;height:4px;width:min(50%,520px);background:var(--red);z-index:0}
.aes .series__lead{flex:1 1 100%;position:relative;z-index:1}
.aes .strip--xl{padding:14px 22px;position:relative;z-index:1;max-width:100%}
.aes .strip--xl .strip__in{display:block;transform:skewX(9deg)}
.aes .strip--xl h2{font-size:clamp(32px,5vw,64px);color:#fff}
.aes .series__line{display:block;font-size:14px;font-weight:400;letter-spacing:.16em;text-transform:uppercase;color:#fff;margin-top:6px}
.aes .series__btn{display:block;width:100%;text-align:center;margin-top:16px;position:relative;z-index:1}
@media(min-width:900px){
  .aes .series{padding:56px 0}
  .aes .strip--xl{padding:18px 40px}
  .aes .series__btn{display:inline-block;width:auto;margin:0 0 6px}
}

/* ---- 03 glory ---- */
.aes .glory{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aes .glory{padding:64px 0 calc(72px + var(--cut))}}
.aes .glory .bg{background:var(--ink)}
.aes .glory .ly{opacity:0}
.aes .glory .ly.on{opacity:.18}
.aes .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.aes .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.aes .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.aes .glory .g12{position:relative;z-index:1}
.aes .glory__txt{order:1}
.aes .glory .screen{order:2;margin-top:4px}
.aes .sheet{display:grid;grid-template-columns:96px 1fr;margin-top:24px;border-top:1px solid var(--ruleD)}
.aes .sheet dt,.aes .sheet dd{border-bottom:1px solid var(--ruleD);min-height:48px;display:flex;align-items:center;padding:8px 0}
.aes .sheet dt{font-size:11px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--muted)}
.aes .sheet dd{font-size:14px;font-weight:400;color:#fff}
.aes .sheet .sheet__time{font-size:24px;color:var(--redL);line-height:1}
.aes .glory__now{margin-top:24px}
.aes .glory__now .gn__l{display:block;font-size:11px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL)}
.aes .glory__now b{display:block;font-weight:500;font-size:18px;color:#fff;line-height:1.35;margin-top:4px}
.aes .glory__now .gn__w{display:block;font-size:13px;font-weight:300;color:rgba(255,255,255,.62);margin-top:2px}
.aes .glory__btn{margin-top:28px;min-height:48px}
@media(min-width:900px){
  .aes .glory .screen{grid-column:1/8;order:1;margin:0;align-self:center}
  .aes .glory__txt{grid-column:8/13;order:2}
  .aes .sheet dt,.aes .sheet dd{min-height:52px}
  .aes .sheet dd{font-size:16px}
  .aes .sheet .sheet__time{font-size:26px}
}

/* ---- 04 sermons / playlists ---- */
.aes .plays{position:relative;background:var(--scrim);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aes .plays{padding:64px 0 calc(72px + var(--cut))}}
.aes .plays .bg{background:var(--scrim)}
.aes .plays .ly.on{opacity:.14}
.aes .plays .bg__floor{background:linear-gradient(180deg,transparent 40%,var(--scrim) 100%)}
.aes .plays > .shell,.aes .plays > .rail,.aes .plays .rail__hd{position:relative;z-index:1}
.aes .now{margin-top:36px}
.aes .now__rail{padding-bottom:4px}
.aes .now__rail h3{margin-top:14px;font-size:24px}
.aes .cnt{display:block;margin-top:14px}
.aes .cnt b{display:block;font-size:56px;color:var(--red);line-height:.9;font-weight:400}
.aes .cnt small{display:block;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:8px}
.aes .now__rail .ulink{margin-top:6px}
@media(min-width:900px){
  .aes .now{margin-top:48px}
  .aes .now .screen{grid-column:1/9}
  .aes .now__rail{grid-column:9/13;align-self:end;padding-bottom:12px}
  .aes .now__rail h3{font-size:var(--h3)}
  .aes .cnt b{font-size:var(--fig)}
}

/* rails (full-bleed, snap, hidden scrollbar) */
.aes .rail__hd{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:48px}
.aes .rail__lbl{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--muted)}
.aes .rail__nav{display:none;gap:8px}
.aes .rail__btn{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;background:transparent;
  border:1.5px solid #fff;cursor:pointer;transition:background .18s}
.aes .rail__btn:hover{background:rgba(255,255,255,.12)}
@media(hover:hover) and (min-width:900px){.aes .rail__hd--scroll .rail__nav{display:flex}}
@media(min-width:900px){.aes .rail__hd{margin-top:56px}}
.aes .rail{display:flex;gap:12px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;scroll-snap-type:x proximity;scroll-behavior:smooth;
  padding:12px var(--railpad) 8px;scroll-padding-left:var(--railpad);-webkit-overflow-scrolling:touch;margin-top:12px}
.aes .rail::-webkit-scrollbar{display:none}
@media(min-width:900px){.aes .rail{gap:18px}}
.aes .rail > *{flex:0 0 auto;scroll-snap-align:start}

/* playlist card */
.aes .pl{position:relative;display:block;width:160px;height:200px;background:var(--ink);border:0;padding:0;color:#fff;text-align:left;
  cursor:pointer;font:inherit;-webkit-tap-highlight-color:transparent}
.aes .pl--lead{width:300px}
.aes .pl__th{position:absolute;inset:0;overflow:hidden;background:var(--ink)}
.aes .pl__th img{width:100%;height:100%;object-fit:cover;filter:saturate(.75);transition:transform .5s var(--ease),filter .3s}
.aes .pl__th::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,var(--scrim) 100%);transition:opacity .3s}
.aes .pl__i{position:absolute;top:8px;left:12px;font-size:40px;line-height:1;color:var(--redL);padding:0 6px;z-index:1}
.aes .pl__play{position:absolute;top:-9px;left:-6px;z-index:2;transform:skewX(-9deg);background:var(--red);padding:6px 12px;opacity:0;transition:opacity .2s}
.aes .pl__play span{display:block;transform:skewX(9deg);font-size:10px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#fff}
.aes .pl__b{position:absolute;left:0;right:0;bottom:0;padding:12px;z-index:1}
.aes .pl__t{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;font-size:16px;line-height:1.05;color:#fff}
.aes .pl--lead .pl__t{font-size:24px}
.aes .pl__c{display:block;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:6px}
.aes .pl::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.aes .pl[aria-selected="true"]::after{transform:scaleX(1)}
.aes .pl[aria-selected="true"] .pl__i{color:#fff;background:var(--red)}
.aes .pl[aria-selected="true"] .pl__th img{filter:saturate(1)}
.aes .pl[aria-selected="true"] .pl__play{opacity:1}
.aes .pl:focus-visible{outline:3px solid var(--red);outline-offset:3px}
@media(hover:hover){
  .aes .pl:hover .pl__th img{transform:scale(1.06)}
  .aes .pl:hover .pl__th::after{opacity:.85;background:linear-gradient(180deg,rgba(6,6,8,.2) 0%,var(--scrim) 100%)}
}
@media(min-width:900px){
  .aes .pl{width:220px;height:275px}
  .aes .pl--lead{width:458px}
  .aes .pl__i{top:10px;left:14px;font-size:56px}
  .aes .pl__b{padding:14px}
  .aes .pl__t{font-size:20px}
  .aes .pl--lead .pl__t{font-size:34px}
}
.aes .plays__btn{margin-top:36px}
@media(min-width:900px){.aes .plays__btn{margin-top:48px}}

/* ---- 05 clips ---- */
.aes .clips{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aes .clips{padding:64px 0 calc(72px + var(--cut))}}
.aes .clips .bg{background:var(--bone)}
.aes .clips > .shell,.aes .clips > .rail{position:relative;z-index:1}
.aes .clips h2{color:var(--ink)}
.aes .rail--clips{margin-top:40px;padding-top:0}
.aes .short{position:relative;display:block;width:150px;height:267px;background:var(--ink);border:1px solid var(--ruleL);text-decoration:none;color:#fff;overflow:hidden}
.aes .short img{width:100%;height:100%;object-fit:cover;transition:transform .5s var(--ease)}
.aes .short__sc{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--scrim) 100%)}
.aes .short__i{position:absolute;top:12px;left:14px;font-size:32px;line-height:1;color:#fff;padding-bottom:6px}
.aes .short__i::after{content:"";position:absolute;left:0;bottom:0;width:36px;height:3px;background:var(--red)}
.aes .short__t{position:absolute;left:0;right:0;bottom:0;padding:16px 56px 16px 16px;font-size:14px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;
  line-height:1.3;color:#fff;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
.aes .short__p{position:absolute;right:12px;bottom:12px;width:40px;height:40px;background:var(--ink);border:1.5px solid #fff;transform:skewX(-9deg);
  display:flex;align-items:center;justify-content:center}
.aes .short__p svg{transform:skewX(9deg)}
.aes .short::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
@media(hover:hover){
  .aes .short:hover img,.aes .short:focus-visible img{transform:scale(1.05)}
  .aes .short:hover::after,.aes .short:focus-visible::after{transform:scaleX(1)}
}
@media(min-width:900px){
  .aes .short{width:236px;height:420px}
  .aes .short:nth-child(even){margin-top:36px}
  .aes .short__i{font-size:40px}
  .aes .short__t{font-size:15px}
  .aes .short__p{width:44px;height:44px}
}
.aes .clips__btn{margin-top:40px}
@media(min-width:900px){.aes .clips__btn{margin-top:56px}}

/* ---- join us in person: the red curtain every room's cut lands on ---- */
.aes .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.aes .cta{padding:calc(64px + var(--cut)) 0 80px}}
.aes .cta h2{color:#fff}
.aes .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.aes .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.aes .cta__line:first-child{border-top:0;padding-top:0}
.aes .cta__time{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:.02em;
  white-space:nowrap;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.aes .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.aes .cta a:focus-visible,.aes .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .aes .cta__txt{grid-column:1/8}
  .aes .cta__p{font-size:19px;max-width:none}
  .aes .cta__line{padding:18px 0}
  .aes .cta__time{font-size:30px}
  .aes .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-block;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- motion ---- */
@keyframes aesDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:.3}}
@keyframes aesRing{0%{box-shadow:12px 12px 0 var(--red),0 0 0 0 rgba(214,34,45,.7)}100%{box-shadow:12px 12px 0 var(--red),0 0 0 22px rgba(214,34,45,0)}}
@keyframes aesFoot{0%,100%{background:#D6222D}50%{background:#DB3F48}}
@keyframes aesTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes aesPush{from{transform:scale(1.04)}to{transform:scale(1)}}
@keyframes aesRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.aes .r,.aes .rail.r > *{transition:opacity .6s var(--ease),transform .6s var(--ease)}
.aes-js:not(.aes-settled) .r:not(.in){opacity:0;transform:translateY(18px)}
.aes-js:not(.aes-settled) .rail.r:not(.in) > *{opacity:0;transform:translateY(18px)}
.aes-settled .r:not(.in),.aes-settled .rail.r:not(.in) > *{transition:none}
@media(prefers-reduced-motion:reduce){
  .aes *,.aes *::before,.aes *::after{animation:none!important;transition:none!important}
  .aes .r,.aes .rail.r > *{opacity:1!important;transform:none!important}
  .aes .mast__tick div{animation:none;width:100%}
  .aes .mast__tick span:last-child{display:none}
  .aes .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .aes .deck,.aes .deck__track{transition:none}
  .aes .panel.enter > .shell{animation:none}
  .aes .rail{scroll-behavior:auto}
  .aes .pl:hover .pl__th img,.aes .short:hover img{transform:none}
  .aes .is-live .badge::before,.aes .strap__dot{opacity:1;transform:none}
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

function asrIframe(id, src, title, eager) {
  return '<iframe id="' + id + '" src="' + asrEsc(src) + '" title="' + asrEsc(title) + '"' +
    (eager ? '' : ' loading="lazy"') +
    ' allow="' + EMBED_ALLOW + '" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
}

/* Two stacked backdrop images that crossfade. A low-res thumbnail scaled up
   reads as a blur at zero GPU cost, so no filter:blur anywhere. */
function asrLayers(cls, eager) {
  const attrs = ' alt="" width="480" height="360" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"');
  return '<img class="ly ' + cls + '"' + attrs + '><img class="ly ' + cls + '"' + attrs + '>';
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Latest', 'aesStage'], ['02', 'Series', 'ariseSeries'], ['03', 'Glory Nights', 'aesGlory'],
               ['04', 'Sermons', 'aesSermons'], ['05', 'Clips', 'aesClipsSect']];
/* "Join us in person" is not a room: it sits under the deck, above the footer, whatever is on stage. */

class AriseSermons extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();
    this.classList.add('aes');

    this.innerHTML =
      /* masthead: the page title, and on desktop the "now showing" ticker */
      '<header class="mast" id="aesMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="sermons.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="sermons.hero.heading">Sermons</h1>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="aesTickA"></span><span id="aesTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: a red LIVE band while streaming, then the tabs (the running order) */
      '<div class="strap" id="aesStrap">' +
        '<div class="strap__live"><div class="shell strap__livein">' +
          '<span class="strap__dot" aria-hidden="true"></span>' +
          '<span class="strap__lt" id="aesStrapLive">Live Now</span>' +
          '<button type="button" class="strap__watch" data-to="aesStage">Watch</button>' +
        '</div></div>' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Media page" id="aesTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="aesTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="aesStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time, the rest wait in the wings */
      '<div class="deck" id="aesDeck"><div class="deck__track" id="aesTrack">' +

      /* 01 latest service */
      '<section class="panel stage is-active" id="aesStage" role="tabpanel" aria-labelledby="aesTab-aesStage">' +
        '<div class="bg bg--lh stage__bg" aria-hidden="true" id="aesStageBg">' + asrLayers('', true) +
          '<div class="stage__scrim"></div><div class="stage__wedge"></div></div>' +
        '<div class="shell g12 stage__grid">' +
          '<div class="stage__txt">' +
            '<div class="folio" aria-hidden="true">01</div>' +
            '<div class="strip badge" id="ariseBadge"><span>Latest Service</span></div>' +
            '<h2 class="stage__h2" data-ck="sermons.latest.heading">Sunday Morning<br>Service</h2>' +
            '<div class="strip strip--ghost"><span data-ck="sermons.latest.strip">Arise Church</span></div>' +
            '<p class="stage__title" id="ariseLatestTitle" hidden></p>' +
            '<p class="stage__when" id="ariseLatestWhen" hidden></p>' +
            '<a class="ulink" id="ariseLatestLink" href="' + CHANNEL_URL + '/streams" target="_blank" rel="noopener">Watch on YouTube</a>' +
          '</div>' +
          '<div class="screen screen--stage">' +
            asrIframe('ariseFeatured', LATEST_EMBED, 'Arise Church — latest service', true) +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 02 current series */
      '<section class="panel series" id="ariseSeries" role="tabpanel" aria-labelledby="aesTab-ariseSeries" hidden data-cms-source="SiteSettings"><div class="shell">' +
        '<div class="series__row">' +
          '<div class="series__lead">' +
            '<div class="folio" aria-hidden="true">02</div>' +
            '<div class="mark mark--l"><span class="kicker" data-ck="sermons.series.kicker">Current Series</span></div>' +
          '</div>' +
          '<div class="strip strip--xl"><div class="strip__in">' +
            '<h2 id="ariseSeriesTitle">The Kingdom Culture of Giving</h2>' +
            '<span class="series__line" id="aesSeriesLine" hidden></span>' +
          '</div></div>' +
          '<a class="btn btn--onRed series__btn" id="ariseSeriesBtn" href="' + CHANNEL_URL + '/streams" target="_blank" rel="noopener">Watch the Full Message</a>' +
        '</div>' +
      '</div></section>' +

      /* 03 glory nights */
      '<section class="panel glory" id="aesGlory" role="tabpanel" aria-labelledby="aesTab-aesGlory">' +
        '<div class="bg bg--rh" aria-hidden="true"><div id="aesGloryBg">' + asrLayers('ly--soft', false) + '</div>' +
          '<div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell g12">' +
          '<div class="screen screen--top">' +
            asrIframe('ariseGloryFrame', GLORY_EMBED, 'Arise Church — Glory Nights', false) +
          '</div>' +
          '<div class="glory__txt">' +
            '<div class="folio" aria-hidden="true">03</div>' +
            '<div class="mark mark--l"><span class="kicker" data-ck="sermons.glory.kicker">Monday Nights</span></div>' +
            '<h2 data-ck="sermons.glory.heading">Glory Nights</h2>' +
            '<dl class="sheet">' +
              '<dt>When</dt><dd><span class="sheet__time" data-ck="site.times.main.glorynight">Monday 7:00 PM</span></dd>' +
              '<dt>Where</dt><dd><span data-ck="sermons.glory.campus">Main Campus</span></dd>' +
              '<dt>Address</dt><dd><span data-ck="sermons.glory.address">501 Ates Road, Pineville</span></dd>' +
            '</dl>' +
            '<p class="glory__now" id="ariseGloryNow" hidden></p>' +
            '<a class="btn btn--ghost glory__btn" href="' + GLORY_URL + '" target="_blank" rel="noopener" data-ck="sermons.glory.button">All Glory Nights</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 04 sermons / playlists */
      '<section class="panel plays" id="aesSermons" role="tabpanel" aria-labelledby="aesTab-aesSermons">' +
        '<div class="bg bg--lh" aria-hidden="true"><div id="aesPlaysBg">' + asrLayers('ly--soft', false) + '</div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">04</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="sermons.playlists.kicker">Messages &amp; Series</span></div>' +
          '<h2 data-ck="sermons.playlists.heading">Sermons</h2>' +
          '<p class="lede" data-ck="sermons.playlists.lede">Every message from Apostle Bryant Sanders, ' +
            'Pastor Vanessa Sanders and our guest ministers, in playlists. Pick one and watch it right here.</p>' +
        '</div>' +
        '<div class="shell g12 now" data-cms-source="YouTube">' +
          '<div class="screen screen--top" id="aesPlayScreen">' +
            asrIframe('arisePlaylistFrame', asrPlaylistEmbed(PLAYLISTS[0].id), 'Arise Church — ' + PLAYLISTS[0].title, false) +
          '</div>' +
          '<div class="now__rail">' +
            '<div class="strip"><span>Now Playing</span></div>' +
            '<h3 id="arisePlaylistTitle"></h3>' +
            '<p class="cnt" id="arisePlaylistCount"></p>' +
            '<a class="ulink" id="arisePlaylistLink" href="' + CHANNEL_URL + '/playlists" target="_blank" rel="noopener">Open on YouTube</a>' +
          '</div>' +
        '</div>' +
        '<div class="shell"><div class="rail__hd" id="aesRailHd">' +
          '<span class="rail__lbl">Pick a playlist</span>' +
          '<span class="rail__nav">' +
            '<button type="button" class="rail__btn" data-rail="aesPlaylists" data-dir="-1" aria-label="Previous playlists">' + CHEV_L + '</button>' +
            '<button type="button" class="rail__btn" data-rail="aesPlaylists" data-dir="1" aria-label="Next playlists">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
        '<div class="rail" id="aesPlaylists" role="tablist" aria-label="Sermon playlists"></div>' +
        '<div class="shell"><a class="btn btn--ghost plays__btn" href="' + CHANNEL_URL + '/playlists" target="_blank" rel="noopener" data-ck="sermons.playlists.button">All Playlists on YouTube</a></div>' +
      '</section>' +

      /* 05 clips & announcements -- fifth in the running order, 9:16 cards, a rail */
      '<section class="panel clips" id="aesClipsSect" role="tabpanel" aria-labelledby="aesTab-aesClipsSect">' +
        '<div class="bg bg--rh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">05</div>' +
          '<div class="mark"><span class="kicker" data-ck="sermons.clips.kicker">More From Arise Church</span></div>' +
          '<h2 data-ck="sermons.clips.heading">Clips &amp; Announcements</h2>' +
        '</div>' +
        '<div class="rail rail--clips" id="aesClips" data-cms-source="YouTube"></div>' +
        '<div class="shell"><a class="btn btn--dark clips__btn" href="' + CHANNEL_URL + '" target="_blank" rel="noopener" data-ck="sermons.clips.button">All Messages on YouTube</a></div>' +
      '</section>' +

      '</div></div>' +

      /* join us in person: below the deck, above the footer, always */
      '<section class="cta" id="aesCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true">06</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="sermons.cta.kicker">Join Us In Person</span></div>' +
          '<h2 class="h2--xl" data-ck="sermons.cta.heading">Better In The Room</h2>' +
          /* one line per service: the time in Anton, then where it is. Each place is its own
             Page Content key (sermons.cta.place1-3) so no line can read as another campus's. */
          '<p class="cta__p">' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.main">Sunday 10:30 AM</span> ' +
              '<span data-ck="sermons.cta.place1">in Pineville</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.second">Sunday 10:00 AM</span> ' +
              '<span data-ck="sermons.cta.place2">in Alexandria</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.main.glorynight">Monday 7:00 PM</span> ' +
              '<span data-ck="sermons.cta.place3">Glory Night in Pineville</span></span>' +
          '</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/contact" target="_top" data-ck="sermons.cta.button">Plan Your Visit</a>' +
      '</div></section>';

    this.bindChrome();
    this.renderClips();
    this.renderPlaylists();
    this.applyContent();

    /* The page code sends the newest service as data-latest-video and, while a
       stream is running, its id as data-live-video; the live stream wins. With
       neither, the player shows the channel's live-stream playlist, which
       always starts at the most recent stream -- the sensible default. */
    this.applyLive();
    this.applyGlory();
    this.applySeries();
    this.initReveal();
    this.initDeck();
    this.initPin();
  }

  /* Where the top of the screen is for us: under the site header if Wix pins
     it (fixed or sticky), else 0. Measured live, so the Editor's choice wins. */
  headerOffset() {
    let off = 0;
    try {
      const cands = document.querySelectorAll('#SITE_HEADER, [id^="SITE_HEADER"], header');
      for (let i = 0; i < cands.length; i++) {
        if (this.contains(cands[i])) continue;
        let el = cands[i], n = 0, pinned = false;
        while (el && n++ < 6) {
          const pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'sticky') { pinned = true; break; }
          el = el.parentElement;
        }
        if (!pinned) continue;
        const r = cands[i].getBoundingClientRect();
        if (r.top <= 1 && r.height > 0 && r.height < 240) off = Math.max(off, r.bottom);
      }
    } catch (e) { off = 0; }
    return off;
  }

  /* Lock the strap to the top of the screen while the deck is in view. Done
     with position:fixed from script rather than position:sticky, because a
     Wix wrapper with overflow set would silently defeat sticky. */
  initPin() {
    const self = this;
    const strap = this.querySelector('#aesStrap');
    const spacer = this.querySelector('#aesStrapSpacer');
    if (!strap || !spacer || this._pinInit) return;
    this._pinInit = true;
    let raf = 0;
    const update = function () {
      raf = 0;
      const off = self.headerOffset();
      const pinned = strap.classList.contains('pinned');
      const h = strap.offsetHeight || 48;
      const natural = (pinned ? spacer : strap).getBoundingClientRect().top;
      if (natural <= off) {
        if (!pinned) { spacer.style.height = h + 'px'; strap.classList.add('pinned'); }
        if (strap.style.top !== off + 'px') strap.style.top = off + 'px';
        /* once the whole element has scrolled past, slide the strap away with it */
        const over = (off + h) - self.getBoundingClientRect().bottom;
        const t = over > 0 ? 'translateY(' + (-Math.round(over)) + 'px)' : '';
        if (strap.style.transform !== t) strap.style.transform = t;
      } else if (pinned) {
        strap.classList.remove('pinned'); strap.style.top = ''; strap.style.transform = ''; spacer.style.height = '0px';
      }
    };
    const kick = function () { if (!raf) raf = requestAnimationFrame(update); };
    this._pinUpdate = update;
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    update();
    setTimeout(update, 600);
  }

  static get observedAttributes() { return ['data-clips', 'data-live-video', 'data-latest-video', 'data-glory-video',
            'data-playlists', 'data-series-active', 'data-series-title', 'data-series-line', 'data-series-link',
            'data-series-button', 'data-content']; }

  attributeChangedCallback(name) {
    if (!this._b) return;   // nothing to patch until it has rendered
    if (name === 'data-content') { this.applyContent(); return; }
    if (name === 'data-clips') { this.renderClips(); return; }
    if (name === 'data-playlists') { this.renderPlaylists(); return; }
    if (name === 'data-glory-video') { this.applyGlory(); return; }
    if (name === 'data-live-video' || name === 'data-latest-video') this.applyLive();
    else this.applySeries();
  }

  /* A JSON attribute, or null when it is missing or unreadable. */
  readJson(name) {
    const raw = this.getAttribute(name);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { console.error('arise-sermons: bad ' + name + ' JSON', e); return null; }
  }

  /* ---- chrome: jump list, rail arrows, image fallbacks, keyboard ---- */
  bindChrome() {
    const self = this;
    const motion = function () {
      try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; } catch (e) { return 'auto'; }
    };
    this.addEventListener('click', function (ev) {
      const t = ev.target && ev.target.closest ? ev.target.closest('[data-to],[data-rail],[data-step]') : null;
      if (!t || !self.contains(t)) return;
      if (t.hasAttribute('data-step')) { self.step(Number(t.getAttribute('data-step'))); return; }
      if (t.hasAttribute('data-to')) {
        self.go(t.getAttribute('data-to'), true);
      } else {
        const rail = self.querySelector('#' + t.getAttribute('data-rail'));
        if (rail) { try { rail.scrollBy({ left: rail.clientWidth * .8 * Number(t.getAttribute('data-dir')), behavior: motion() }); } catch (e) { /* older browsers */ } }
      }
    });
    /* an image that never arrives leaves the ink card with its index and title */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG') { img.style.opacity = '0'; img.classList.remove('on'); }
    }, true);
    /* prev/next arrows only when the wall is wider than the viewport */
    let raf = 0;
    const measure = function () { raf = 0; self.measureRail(); self.fitDeck(); };
    window.addEventListener('resize', function () { if (!raf) raf = requestAnimationFrame(measure); });
    /* the tab strap: arrow keys move between rooms */
    const tabs = this.querySelector('#aesTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() {
    return Array.prototype.filter.call(this.querySelectorAll('#aesTrack > .panel'), function (p) { return !p.hidden; });
  }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#aesDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'aesStage';
    /* swipe between rooms on touch screens; the rails keep their own horizontal scroll */
    let sx = 0, sy = 0, sid = null, swiping = false;
    deck.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' || (ev.target.closest && ev.target.closest('.rail, iframe, a, button'))) { sid = null; return; }
      sid = ev.pointerId; sx = ev.clientX; sy = ev.clientY; swiping = true;
    });
    deck.addEventListener('pointerup', function (ev) {
      if (!swiping || ev.pointerId !== sid) return;
      swiping = false;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) self.step(dx < 0 ? 1 : -1, true);
    });
    deck.addEventListener('pointercancel', function () { swiping = false; });
    /* keep the deck as tall as the room on stage */
    try {
      this._ro = new ResizeObserver(function () { self.fitDeck(); });
      this.querySelectorAll('#aesTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#aesDeck');
    const active = this.querySelector('#aesTrack > .panel.is-active');
    if (!deck || !active) return;
    const h = active.offsetHeight;
    if (h && deck.style.height !== h + 'px') deck.style.height = h + 'px';
  }

  /* Show the room with this id: slide the track, mark the tab, size the deck. */
  go(id, byUser) {
    const ps = this.panels();
    let idx = -1;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === id) idx = i;
    if (idx < 0) return;
    const changed = this._active !== id;
    this._active = id;
    this.applyDeck(!!byUser && changed);
    if (byUser && changed) {
      /* a pick from deep inside a long room: bring the new room's top to just under the strap */
      const strap = this.querySelector('#aesStrap');
      const deck = this.querySelector('#aesDeck');
      if (strap && deck) {
        const bottom = this.headerOffset() + strap.offsetHeight;
        const top = deck.getBoundingClientRect().top;
        if (top < bottom - 2) {
          const y = window.pageYOffset + top - bottom;
          let smooth = true;
          try { smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { smooth = true; }
          try { window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' }); } catch (e) { window.scrollTo(0, Math.max(0, y)); }
        }
      }
    }
  }

  step(dir, byUser) {
    const ps = this.panels();
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    const next = ps[Math.max(0, Math.min(ps.length - 1, idx + dir))];
    if (next) {
      this.go(next.id, true);
      if (byUser) { const t = this.querySelector('#aesTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#aesTrack');
    const deck = this.querySelector('#aesDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'aesStage';
    this.querySelectorAll('#aesTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#aesTabs .strap__j').forEach(function (t) {
      const on = t.getAttribute('data-to') === self._active;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      if (on && typeof t.scrollIntoView === 'function') { try { t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* older browsers */ } }
    });
    const arrows = this.querySelectorAll('.strap__arrow');
    if (arrows.length === 2) { arrows[0].disabled = idx === 0; arrows[1].disabled = idx === ps.length - 1; }
    deck.classList.add('moving');
    clearTimeout(this._moveT);
    this._moveT = setTimeout(function () { deck.classList.remove('moving'); self.fitDeck(); if (self._pinUpdate) self._pinUpdate(); }, 650);
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    this.fitDeck();
  }

  measureRail() {
    const rail = this.querySelector('#aesPlaylists');
    const hd = this.querySelector('#aesRailHd');
    if (rail && hd) hd.classList.toggle('rail__hd--scroll', rail.scrollWidth > rail.clientWidth + 4);
  }

  /* Crossfade a two-layer backdrop to a new image (or to nothing). */
  setLayers(wrapId, url) {
    const wrap = this.querySelector('#' + wrapId);
    if (!wrap) return;
    const imgs = wrap.querySelectorAll('img.ly');
    if (imgs.length < 2) return;
    if (!url) { imgs.forEach(function (i) { i.classList.remove('on'); }); return; }
    const cur = wrap.querySelector('img.ly.on');
    if (cur && cur.getAttribute('src') === url) return;
    const next = cur === imgs[0] ? imgs[1] : imgs[0];
    if (next.getAttribute('src') === url && next.complete && next.naturalWidth > 120) {
      next.classList.add('on'); if (cur) cur.classList.remove('on'); return;
    }
    next.classList.remove('on');
    next.style.opacity = '';
    next.onload = function () {
      if (next.getAttribute('src') !== url) return;
      if (next.naturalWidth <= 120) { next.onload = null; return; }   // YouTube's 120x90 grey "no image"
      next.classList.add('on');
      imgs.forEach(function (i) { if (i !== next) i.classList.remove('on'); });
    };
    next.src = url;
  }

  /* The stage poster: hqdefault everywhere, maxresdefault on wide screens when
     YouTube has a real one (it answers 200 with a 120x90 placeholder when not). */
  setStage(vid) {
    const stage = this.querySelector('#aesStage');
    if (!vid) { this.setLayers('aesStageBg', ''); if (stage) stage.classList.add('no-img'); return; }
    if (stage) stage.classList.remove('no-img');
    const hq = YT + vid + '/hqdefault.jpg';
    const self = this;
    let wide = false;
    try { wide = window.innerWidth >= 1024; } catch (e) { wide = false; }
    this.setLayers('aesStageBg', hq);
    if (!wide) return;
    const probe = new Image();
    probe.onload = function () {
      if (probe.naturalWidth > 120 && self._stageVid === vid) self.setLayers('aesStageBg', YT + vid + '/maxresdefault.jpg');
    };
    this._stageVid = vid;
    probe.src = YT + vid + '/maxresdefault.jpg';
  }

  /* ---- Sermons section: the programme wall + the now-playing stage ---- */
  renderPlaylists() {
    const mount = this.querySelector('#aesPlaylists');
    if (!mount) return;
    let list = this.readJson('data-playlists');
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (p) { return p && asrListId(p.id) && p.id !== GLORY_LIST && String(p.title || '').trim(); }).slice(0, 24);
    if (!list.length) list = PLAYLISTS;
    const key = list.map(function (p) { return p.id + '|' + p.title + '|' + (p.count || 0) + '|' + (p.thumb || ''); }).join(',');
    if (this._plKey === key && mount.children.length) return;
    this._plKey = key;
    this._playlists = list;
    const left = mount.scrollLeft;
    mount.innerHTML = list.map(function (p, i) {
      const n = Number(p.count) || 0;
      const thumb = /^https:\/\/i\.ytimg\.com\//.test(String(p.thumb || '')) ? p.thumb : '';
      return '<button type="button" class="pl' + (i === 0 ? ' pl--lead' : '') + '" role="tab" data-list="' + asrEsc(p.id) +
        '" aria-selected="false" tabindex="-1" style="transition-delay:' + (Math.min(i, 8) * 60) + 'ms">' +
        '<span class="pl__th" aria-hidden="true">' +
          (thumb ? '<img src="' + asrEsc(thumb) + '" alt="" width="480" height="360" loading="lazy" decoding="async">' : '') +
        '</span>' +
        '<span class="pl__i" aria-hidden="true">' + asrPad(i + 1) + '</span>' +
        '<span class="pl__play" aria-hidden="true"><span>Playing</span></span>' +
        '<span class="pl__b"><span class="pl__t">' + asrEsc(p.title) + '</span>' +
          (n ? '<span class="pl__c" aria-hidden="true">' + n + (n === 1 ? ' message' : ' messages') + '</span>' : '') +
        '</span>' +
      '</button>';
    }).join('');
    if (!this._plBound) {
      this._plBound = true;
      const self = this;
      mount.addEventListener('click', function (ev) {
        const btn = ev.target && ev.target.closest ? ev.target.closest('.pl') : null;
        if (btn && mount.contains(btn)) self.selectPlaylist(btn.getAttribute('data-list'), true);
      });
      mount.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End') return;
        const tabs = Array.prototype.slice.call(mount.querySelectorAll('.pl'));
        if (!tabs.length) return;
        let i = tabs.findIndex(function (b) { return b.getAttribute('aria-selected') === 'true'; });
        if (k === 'ArrowLeft') i = Math.max(0, i - 1);
        else if (k === 'ArrowRight') i = Math.min(tabs.length - 1, i + 1);
        else if (k === 'Home') i = 0; else i = tabs.length - 1;
        ev.preventDefault();
        self.selectPlaylist(tabs[i].getAttribute('data-list'), true);
        tabs[i].focus({ preventScroll: true });
        try { tabs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* older browsers */ }
      });
    }
    const sel = this._plSel;
    const keep = sel && list.some(function (p) { return p.id === sel; });
    this.selectPlaylist(keep ? sel : list[0].id, false);
    mount.scrollLeft = left;
    this.keepInView(mount);
    this.measureRail();
    this.observe(mount);
    this.fitDeck();
  }

  /* After load or a re-render, make sure the selected card is in view by setting
     scrollLeft (never scrollIntoView on load, which would scroll the page). */
  keepInView(rail) {
    const b = rail.querySelector('.pl[aria-selected="true"]');
    if (!b) return;
    const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const l = b.offsetLeft - pad, r = b.offsetLeft + b.offsetWidth;
    if (l < rail.scrollLeft || r > rail.scrollLeft + rail.clientWidth) rail.scrollLeft = Math.max(0, l);
  }

  selectPlaylist(id, autoplay) {
    const list = this._playlists || PLAYLISTS;
    const p = list.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    const frame = this.querySelector('#arisePlaylistFrame');
    const screen = this.querySelector('#aesPlayScreen');
    const title = this.querySelector('#arisePlaylistTitle');
    const count = this.querySelector('#arisePlaylistCount');
    const link = this.querySelector('#arisePlaylistLink');
    const changed = this._plSel !== p.id;
    this._plSel = p.id;
    if (frame && (changed || !frame.getAttribute('src'))) {
      const target = asrPlaylistEmbed(p.id, !!autoplay);
      if (frame.getAttribute('src') !== target) {
        frame.src = target;
        if (screen) {
          screen.classList.add('swapping');
          clearTimeout(this._swapT);
          this._swapT = setTimeout(function () { screen.classList.remove('swapping'); }, 350);
        }
      }
      frame.title = 'Arise Church \u2014 ' + p.title;
    }
    if (title) title.textContent = p.title;
    if (count) {
      const n = Number(p.count) || 0;
      count.innerHTML = n ? '<b>' + n + '</b><small>' + (n === 1 ? 'message' : 'messages') + ' on YouTube</small>' : '';
    }
    if (link) link.href = 'https://www.youtube.com/playlist?list=' + p.id;
    const thumb = /^https:\/\/i\.ytimg\.com\//.test(String(p.thumb || '')) ? p.thumb : '';
    this.setLayers('aesPlaysBg', thumb);
    this.querySelectorAll('#aesPlaylists .pl').forEach(function (b) {
      const on = b.getAttribute('data-list') === p.id;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.setAttribute('tabindex', on ? '0' : '-1');
    });
    /* on a user pick, bring the player back if it has scrolled off */
    if (autoplay && changed && screen) {
      const r = screen.getBoundingClientRect();
      const top = 76;
      if (r.bottom < top || r.top > window.innerHeight) {
        try { screen.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* older browsers */ }
      }
    }
  }

  /* Glory Nights player: the newest Glory Night, sent by the page code as
     data-glory-video: { id, title, when }. The playlist keeps playing after it.
     Without it the player shows the playlist from its first video. */
  applyGlory() {
    const frame = this.querySelector('#ariseGloryFrame');
    const now = this.querySelector('#ariseGloryNow');
    if (!frame) return;
    const v = this.readJson('data-glory-video');
    const vid = v ? asrVideoId(v.id) : '';
    const target = vid ? 'https://www.youtube.com/embed/' + vid + '?list=' + GLORY_LIST + '&rel=0' : GLORY_EMBED;
    if (frame.getAttribute('src') !== target) frame.src = target;
    this.setLayers('aesGloryBg', vid ? YT + vid + '/hqdefault.jpg' : '');
    if (now) {
      if (vid && v.title) {
        now.innerHTML = '<span class="gn__l">Latest Glory Night</span><b>' + asrEsc(v.title) + '</b>' +
          (v.when ? '<span class="gn__w">' + asrEsc(v.when) + '</span>' : '');
        now.hidden = false;
      } else {
        now.hidden = true;
      }
    }
  }

  /* Shorts rail. The page code sends the newest Shorts from the YouTube channel
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
    mount.innerHTML = list.map(function (c, i) {
      const title = String(c.title || '').replace(/\s+/g, ' ').trim() || 'Arise Church Short';
      return '<a class="short" href="https://www.youtube.com/shorts/' + c.id + '" target="_blank" rel="noopener" style="transition-delay:' + (Math.min(i, 8) * 60) + 'ms">' +
        '<img src="' + YT + c.id + '/frame0.jpg" alt="' + asrEsc(title) + '" width="405" height="720" loading="lazy" decoding="async">' +
        '<span class="short__sc" aria-hidden="true"></span>' +
        '<span class="short__i" aria-hidden="true">' + asrPad(i + 1) + '</span>' +
        '<span class="short__t">' + asrEsc(title) + '</span>' +
        '<span class="short__p" aria-hidden="true">' + PLAY_SVG + '</span>' +
      '</a>';
    }).join('');
    this.observe(mount);
    this.fitDeck();
  }

  /* Series band, driven from the SiteSettings collection by the page code.
     Unless seriesActive is exactly true, the whole band stays hidden --
     which is what should happen when you're between series. */
  applySeries() {
    const band  = this.querySelector('#ariseSeries');
    if (!band) return;
    const jump = this.querySelector('.strap__j[data-to="ariseSeries"]');

    const active = this.getAttribute('data-series-active');
    if (active !== 'true') {
      band.hidden = true; if (jump) jump.hidden = true;
      if (this._deck) { if (this._active === 'ariseSeries') this._active = 'aesStage'; this.applyDeck(false); }
      return;
    }
    band.hidden = false; if (jump) jump.hidden = false;
    if (this._deck) this.applyDeck(false);

    const title  = this.getAttribute('data-series-title');
    const line   = this.getAttribute('data-series-line');
    const link   = this.getAttribute('data-series-link');
    const label  = this.getAttribute('data-series-button');

    const h = this.querySelector('#ariseSeriesTitle');
    if (h && title) h.textContent = title;
    const ln = this.querySelector('#aesSeriesLine');
    if (ln) { ln.textContent = line || ''; ln.hidden = !line; }

    const b = this.querySelector('#ariseSeriesBtn');
    if (b) {
      if (link && /^(https?:\/\/|\/)/i.test(link)) b.setAttribute('href', link);
      if (label) b.textContent = label;
    }
  }

  applyLive() {
    const frame = this.querySelector('#ariseFeatured');
    const badge = this.querySelector('#ariseBadge');
    const title = this.querySelector('#ariseLatestTitle');
    const when = this.querySelector('#ariseLatestWhen');
    const link = this.querySelector('#ariseLatestLink');
    if (!frame) return;

    const vid = asrVideoId(this.getAttribute('data-live-video'));
    const latest = this.readJson('data-latest-video');
    const latestId = latest ? asrVideoId(latest.id) : '';
    const target = vid ? 'https://www.youtube.com/embed/' + vid + '?rel=0'
                 : latestId ? 'https://www.youtube.com/embed/' + latestId + '?list=' + STREAMS_ID + '&rel=0'
                 : LATEST_EMBED;
    if (frame.getAttribute('src') !== target) frame.src = target;
    const latestTitle = latestId && latest.title ? String(latest.title) : '';
    frame.title = vid ? 'Arise Church \u2014 live now' : (latestTitle ? 'Arise Church \u2014 ' + latestTitle : 'Arise Church \u2014 latest service');

    this.classList.toggle('is-live', !!vid);
    this.setStage(vid || latestId);

    if (badge) {
      const txt = vid ? 'Live Now' : 'Latest Service';
      const span = badge.firstChild;
      if (span && span.textContent !== txt) span.textContent = txt;
    }
    const showLatest = !vid && latestId && latest.title;
    if (title) { title.textContent = showLatest ? latest.title : ''; title.hidden = !showLatest; }
    if (when) {
      const txt = vid ? 'Streaming now' : (showLatest && latest.when ? latest.when : '');
      when.textContent = txt; when.hidden = !txt;
    }
    if (link) {
      link.href = vid ? 'https://www.youtube.com/watch?v=' + vid
                : latestId ? 'https://www.youtube.com/watch?v=' + latestId + '&list=' + STREAMS_ID
                : CHANNEL_URL + '/streams';
      link.textContent = vid ? 'Watch live on YouTube' : 'Watch on YouTube';
    }
    /* the strap: a ticker at rest, the red LIVE strap while streaming */
    const tick = 'Now showing \u00b7 ' + (latestTitle || 'Sunday Morning Service') +
      (latestTitle && latest.when ? ' \u00b7 ' + latest.when : '') + ' \u00b7 Arise Church \u00b7 ';
    const a = this.querySelector('#aesTickA'), b = this.querySelector('#aesTickB');
    if (a && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
    const lt = this.querySelector('#aesStrapLive');
    if (lt) lt.textContent = vid ? 'Live Now \u00b7 ' + (latestTitle || 'Arise Church') : 'Live Now';
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

  /* ---- reveals: IntersectionObserver adds .in; without one nothing is ever hidden.
     .aes-js is set only once an observer exists, and .aes-settled (800ms) forces
     every .r visible so a slow or silent observer can never leave a blank room. */
  initReveal() {
    const self = this;
    if (this._io) return;
    try {
      this._io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); self._io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px 80px 0px', threshold: 0.05 });
    } catch (e) { this._io = null; return; }
    this.classList.add('aes-js');
    this.observe(this);
    setTimeout(function () { self.classList.add('aes-settled'); }, 800);
  }

  observe(root) {
    if (!this._io) return;
    const io = this._io;
    const list = root.matches && root.matches('.r:not(.in)') ? [root] : [];
    root.querySelectorAll('.r:not(.in)').forEach(function (el) { list.push(el); });
    list.forEach(function (el) { io.observe(el); });
  }
}

customElements.define('arise-sermons', AriseSermons);
