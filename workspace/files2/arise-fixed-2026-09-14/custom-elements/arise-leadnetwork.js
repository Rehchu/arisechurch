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
   NOTE: this page lives at /lead-network. The old /general-4 URL still
         redirects to it, so nothing external is broken.
   Fixed 2026-09-14: Photo viewer lightbox is now a dialog (role/aria-modal/label, focus returns to the tile, Tab stays inside); data-photos videoId validated and escaped; CMS content applied without building selectors from keys, background urls quoted; gallery and CMS photos now render on first build (stray calls moved out of TEACHINGS.map).
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-leadnetwork.json)
   Rebuilt 2026-10-31 in the "House Lights Down" theme shared with the Media page
   (arise-sermons.js) and the Bible Search page (arise-bible.js): masthead, the strap
   (01 Teachings / 02 Ministers / 03 Gatherings) that locks under the site header, one
   room on stage at a time, the red Camp Meeting call under the last cut. Every CMS key,
   attribute and link target is unchanged. Class prefix .aln; ids aln*.
   =========================================================================== */

const ALN_FONTS =
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

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const PLAY_SVG = '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true"><path d="M14 8L0 16V0L14 8Z" fill="currentColor"/></svg>';

const ALN_CSS = `
arise-leadnetwork{display:block;width:100%}
.aln *{box-sizing:border-box;margin:0;padding:0}
.aln{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--bone:#F4F2F0;
  --paper:#fff;--muted:#6A6A6E;--ruleD:rgba(255,255,255,.15);--ruleL:rgba(10,10,12,.12);
  --shell:1180px;--gut:clamp(20px,5vw,56px);
  --cut:28px;--foot:4px;
  --h2:clamp(40px,7vw,96px);--h2s:clamp(36px,5.4vw,72px);--h3:clamp(24px,2.6vw,36px);--fig:clamp(56px,7vw,96px);
  --lede:clamp(16px,1.4vw,18px);--body:clamp(15px,1.3vw,17px);--read:clamp(17px,1.5vw,21px);
  --ease:cubic-bezier(.2,.7,.2,1);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:#fff;line-height:1.6;
  background:var(--scrim);color-scheme:light only;overflow-x:clip;display:block;
  -webkit-font-smoothing:antialiased;
}
@media(min-width:900px){.aln{--cut:48px;--foot:5px}}
.aln [hidden]{display:none!important}
.aln h1,.aln h2,.aln h3,.aln p,.aln button,.aln img,.aln iframe,.aln audio,.aln dl,.aln dt,.aln dd{margin:0;padding:0;border:0}
.aln img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.aln iframe{display:block}
.aln .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.aln .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.aln .g12{grid-template-columns:repeat(12,1fr)}}
.aln h1,.aln h2,.aln h3,.aln .folio,.aln .cnt b{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aln h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.aln .h2--xl{font-size:var(--h2)}
.aln h3{font-size:var(--h3);color:#fff}
.aln p{font-size:var(--body);line-height:1.6}
.aln .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.aln a{color:inherit}

/* ---- house devices ---- */
.aln .mark{display:flex;align-items:center;margin-bottom:18px}
.aln .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.aln .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .aln .mark{flex-wrap:nowrap;align-items:flex-start}
  .aln .mark::before{margin-right:124px;margin-top:5px}
  .aln .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aln .mark--l .kicker{color:var(--redL)}
.aln .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.aln .mark--w .kicker{color:#fff}
.aln .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.aln .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.aln .strip--ghost{background:transparent;border:1.5px solid #fff}
.aln .strip--ghost span{color:#fff}
.aln .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.aln .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aln .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aln .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.aln .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aln .btn--dark:hover{background:var(--ink);color:#fff}
.aln .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.aln .btn--onRed:hover{background:transparent;color:#fff}
.aln .btn[disabled]{opacity:.55;pointer-events:none}
.aln a:focus-visible,.aln button:focus-visible,.aln input:focus-visible,.aln select:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.aln .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.aln .folio--d{color:var(--red)}
.aln .folio--w{color:#fff}
.aln .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.aln .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.aln .ulink:hover::after,.aln .ulink:focus-visible::after{width:100%}
.aln .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.aln .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.aln .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.aln .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.aln .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.aln .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.aln .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.aln .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.aln .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.aln .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.aln .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.aln .bg__wedge{position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);clip-path:polygon(0 0,100% 0,100% 100%);opacity:.9}
/* photo backdrop layers: two stacked images that crossfade; a small copy scaled up reads as a blur */
.aln .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s var(--ease);background:transparent}
.aln .ly.on{opacity:1}
.aln .ly--soft{transform:scale(1.15)}
.aln .bg__scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,8,.55) 0%,rgba(6,6,8,.78) 55%,var(--scrim) 100%)}

/* ---- masthead ---- */
.aln .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.aln .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.aln .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.aln .mast__txt{min-width:0;flex:1 1 auto}
.aln .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.aln .mast__logo{width:clamp(76px,9vw,116px);height:auto;aspect-ratio:1/1;display:block;margin-bottom:20px;background:transparent}
.aln .mast .lede{margin-top:22px}
.aln .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.aln .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:alnTick 36s linear infinite}
.aln .mast__tick:hover div{animation-play-state:paused}
.aln .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.aln .mast{padding:44px 0 26px}.aln .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.aln .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.aln .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.aln .strap__spacer{height:0}
.aln .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.aln .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.aln .strap__jump::-webkit-scrollbar{display:none}
.aln .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.aln .strap__j:first-child{border-left:0}
.aln .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .aln .strap__jump{overflow:visible;margin:0;padding:0}
  .aln .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .aln .strap__j i{font-size:12px}
}
.aln .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.aln .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.aln .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.aln .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.aln .strap__j:focus-visible{outline-offset:-3px}
.aln .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.aln .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.aln .strap__arrow:hover{background:rgba(255,255,255,.08)}
.aln .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .aln .strap__jump{overflow:visible;margin:0;padding:0}
  .aln .strap__j{padding:0 20px}
  .aln .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.aln .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.aln .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.aln .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.aln .panel:not(.is-active){visibility:hidden}
.aln .deck.moving .panel{visibility:visible}
.aln .panel.enter > .shell{animation:alnRise .55s var(--ease) both}

/* ---- 01 teachings: watch & listen ---- */
.aln .teach{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.aln .teach{padding:56px 0 calc(56px + var(--cut))}}
.aln .teach .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.aln .teach .ly.on{opacity:.22}
.aln .teach > .shell{position:relative;z-index:1}
.aln .teach__grid{display:grid;grid-template-columns:1fr;gap:18px;margin-top:32px}
@media(min-width:760px){.aln .teach__grid{grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}}
.aln .t__c{background:var(--ink);border:1px solid var(--ruleD);border-top:3px solid var(--red);display:flex;flex-direction:column;min-width:0}
.aln .t__media{aspect-ratio:16/9;background:var(--scrim);position:relative;overflow:hidden}
.aln .t__media img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.8);transition:transform .5s var(--ease)}
.aln .t__media video{width:100%;height:100%;object-fit:contain;display:block;background:#000}
.aln .t__media::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(6,6,8,.75) 100%);pointer-events:none}
.aln .t__media.playing::after{display:none}
.aln .t__play{position:absolute;inset:0;z-index:1;border:0;background:rgba(6,6,8,.28);cursor:pointer;
  display:flex;align-items:flex-end;justify-content:flex-start;padding:16px;transition:background .2s;font-family:inherit}
.aln .t__play:hover{background:rgba(6,6,8,.12)}
.aln .t__play:hover img{transform:scale(1.04)}
.aln .t__play span{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:0 18px 0 14px;background:var(--red);color:#fff;
  font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;transform:skewX(-9deg)}
.aln .t__play span > *{transform:skewX(9deg)}
.aln .t__play:focus-visible{outline-offset:-3px}
.aln .t__b{padding:22px;flex:1 1 auto;display:flex;flex-direction:column}
@media(min-width:900px){.aln .t__b{padding:26px}}
.aln .t__by{font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--redL);margin-bottom:10px}
.aln .t__c h3{margin-bottom:8px;font-size:clamp(22px,2.2vw,30px)}
.aln .t__sub{font-size:15px;color:rgba(255,255,255,.72);line-height:1.6}
.aln .t__len{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:12px}
.aln .t__audio{margin-top:18px;padding-top:16px;border-top:1px solid var(--ruleD)}
.aln .t__audio audio{width:100%;display:block;color-scheme:dark}
.aln .t__soon{margin-top:18px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.55);border-top:1px solid var(--ruleD);padding-top:14px}

/* ---- 02 ministers: the paper room ---- */
.aln .ministers{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aln .ministers{padding:64px 0 calc(72px + var(--cut))}}
.aln .ministers .bg{background:var(--bone)}
.aln .ministers > .shell{position:relative;z-index:1}
.aln .ministers h2,.aln .ministers h3{color:var(--ink)}
.aln .ministers .lede{color:var(--muted)}
.aln .people{display:grid;grid-template-columns:1fr;gap:18px;margin-top:32px}
@media(min-width:700px){.aln .people{grid-template-columns:repeat(2,1fr);gap:26px;margin-top:44px}}
.aln .p__c{background:var(--paper);border:1px solid var(--ruleL);border-top:3px solid var(--red);display:flex;flex-direction:column;min-width:0}
.aln .p__ph{aspect-ratio:1944/2664;max-height:520px;overflow:hidden;background:var(--bone)}
.aln .p__ph img{width:100%;height:100%;object-fit:contain;display:block;background:var(--bone)}
.aln .p__b{padding:22px}
@media(min-width:900px){.aln .p__b{padding:26px}}
.aln .p__role{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:12px}
.aln .p__c h3{font-size:clamp(22px,2.2vw,30px)}
.aln .p__church{margin-top:14px;padding-top:14px;border-top:1px solid var(--ruleL);font-size:15px;color:var(--muted);line-height:1.7}
.aln .p__church b{display:block;color:var(--ink);font-weight:500;font-size:16px;margin-bottom:3px}
.aln .p__links{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
.aln .p__links a{display:inline-flex;align-items:center;min-height:44px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
  color:var(--red);text-decoration:none;border:1px solid var(--ruleL);padding:0 16px;transition:background .18s,color .18s,border-color .18s}
.aln .p__links a:hover{background:var(--red);border-color:var(--red);color:#fff}
.aln .ministers__btn{margin-top:36px}
@media(min-width:900px){.aln .ministers__btn{margin-top:48px}}

/* ---- 03 gatherings: the photo wall (fed by page code via data-photos) ---- */
.aln .gather{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aln .gather{padding:64px 0 calc(72px + var(--cut))}}
.aln .gather .bg{background:var(--ink)}
.aln .gather .ly.on{opacity:.16}
.aln .gather > .shell{position:relative;z-index:1}
/* the wall: square tiles two columns wide, every fifth a 2:1 feature twice as wide, so the rows always
   line up (a feature is exactly as tall as a square). 2 / 4 / 6 columns at phone / tablet / desktop. */
.aln .gal{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:32px}
@media(min-width:561px){.aln .gal{grid-template-columns:repeat(4,1fr);gap:11px}}
@media(min-width:901px){.aln .gal{grid-template-columns:repeat(6,1fr);gap:14px;margin-top:44px}}
.aln .gal__t{position:relative;overflow:hidden;background:var(--scrim);border:0;padding:0;cursor:pointer;display:block;grid-column:span 1;aspect-ratio:1/1;
  -webkit-tap-highlight-color:transparent;font:inherit;color:#fff}
.aln .gal__t:nth-child(5n+1){grid-column:span 2;aspect-ratio:2/1}
@media(min-width:561px){
  .aln .gal__t{grid-column:span 2}
  .aln .gal__t:nth-child(5n+1){grid-column:span 4}
}
.aln .gal__t img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.8);transition:transform .55s var(--ease),filter .3s}
.aln .gal__t::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(6,6,8,.6) 100%);pointer-events:none;z-index:1}
.aln .gal__t::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.aln .gal__t:hover::after,.aln .gal__t:focus-visible::after{transform:scaleX(1)}
.aln .gal__t:hover img{transform:scale(1.06);filter:saturate(1)}
.aln .gal__t:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.aln .gal__i{position:absolute;top:8px;left:12px;z-index:2;font-family:'Anton',Impact,sans-serif;font-size:28px;line-height:1;color:var(--redL);text-transform:uppercase;letter-spacing:.02em}
@media(min-width:900px){.aln .gal__i{font-size:36px;top:10px;left:14px}}
/* video tiles get a play badge so they read as playable */
.aln .gal__v{position:absolute;right:12px;bottom:14px;z-index:2;width:38px;height:38px;background:var(--red);display:flex;align-items:center;justify-content:center;color:#fff;pointer-events:none}
.aln .gal__v svg{width:12px;height:14px}
.aln .gal__n{margin-top:28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}

/* ---- the call: the red curtain the last room's cut lands on ---- */
.aln .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.aln .cta{padding:calc(64px + var(--cut)) 0 80px}}
.aln .cta h2{color:#fff}
.aln .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.aln .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.aln .cta__line:first-child{border-top:0;padding-top:0}
.aln .cta__time{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:.02em;
  white-space:nowrap;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.aln .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.aln .cta a:focus-visible,.aln .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .aln .cta__txt{grid-column:1/8}
  .aln .cta__p{font-size:19px;max-width:none}
  .aln .cta__line{padding:18px 0}
  .aln .cta__time{font-size:30px}
  .aln .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- the photo viewer (mounted on body, so not under .aln) ---- */
.aln-lb{position:fixed;inset:0;z-index:2147482000;display:none;background:rgba(6,6,8,.94);color-scheme:light only}
.aln-lb[data-open="true"]{display:flex;align-items:center;justify-content:center}
.aln-lb img,.aln-lb video{max-width:92vw;max-height:82vh;object-fit:contain;display:block;box-shadow:0 20px 60px rgba(0,0,0,.6);background:#000}
.aln-lb video{width:auto}
.aln-lb button{position:absolute;background:transparent;border:1px solid rgba(255,255,255,.30);color:#fff;cursor:pointer;font-family:'Oswald',Helvetica,Arial,sans-serif;line-height:1}
.aln-lb__x{top:20px;right:20px;width:46px;height:46px;font-size:22px}
.aln-lb__p,.aln-lb__n{top:50%;transform:translateY(-50%);width:52px;height:64px;font-size:24px}
.aln-lb__p{left:16px}
.aln-lb__n{right:16px}
.aln-lb button:hover{background:#D6222D;border-color:#D6222D}
.aln-lb__c{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:14px;color:rgba(255,255,255,.86);padding:0 20px}
.aln-lb__i{position:absolute;top:26px;left:24px;font-family:'Oswald',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.2em;color:rgba(255,255,255,.6)}
.aln-lb button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}

/* ---- motion ---- */
@keyframes alnTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes alnRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .aln *,.aln *::before,.aln *::after{animation:none!important;transition:none!important}
  .aln .mast__tick div{animation:none;width:100%}
  .aln .mast__tick span:last-child{display:none}
  .aln .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .aln .deck,.aln .deck__track{transition:none}
  .aln .panel.enter > .shell{animation:none}
  .aln-lb *{transition:none!important}
}
`;

function alnEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function alnPad(n) { return (n < 10 ? '0' : '') + n; }

/* Arise Church speed: ask Wix for a resized copy (AVIF/WebP picked per browser) of a
   plain static.wixstatic.com photo; longest side at most w, no crop. Anything else is
   returned untouched. */
function alnImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('aln-leadnetwork-fonts') &&
      !document.querySelector('link[href="' + ALN_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'aln-leadnetwork-fonts'; l.rel = 'stylesheet'; l.href = ALN_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('aln-leadnetwork-css')) {
    const s = document.createElement('style');
    s.id = 'aln-leadnetwork-css'; s.innerHTML = ALN_CSS;
    document.head.appendChild(s);
  }
}

/* Two stacked backdrop images that crossfade (as on the Media page). */
function alnLayers(cls, eager) {
  const attrs = ' alt="" width="480" height="360" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"');
  return '<img class="ly ' + cls + '"' + attrs + '><img class="ly ' + cls + '"' + attrs + '>';
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Teachings', 'alnTeach'], ['02', 'Ministers', 'alnMinisters'], ['03', 'Gatherings', 'alnGather']];

class AriseLeadNetwork extends HTMLElement {
  static get observedAttributes() { return ['data-photos', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._built) return;
    if (name === 'data-content') { this.applyContent(); this.setTick(); return; }
    this.fillGallery();
  }

  connectedCallback() {
    if (this._built) {
      /* re-attached by Wix: restore the body-mounted lightbox */
      if (this._lb && !this._lb.isConnected) document.body.appendChild(this._lb);
      if (this._lbKey) document.addEventListener('keydown', this._lbKey);
      return;
    }
    this._built = true;
    injectHead();
    this.classList.add('aln');

    this.innerHTML =
      /* masthead: the logo, the page title, the lede; on desktop the red ticker */
      '<header class="mast" id="alnMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<img class="mast__logo" data-ci="leadnetwork.hero.logo" data-ciw="800" src="' + alnImg(LN_LOGO, 800) + '" width="500" height="500" fetchpriority="high" alt="Lead Network logo">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="leadnetwork.hero.kicker">Leadership Development</span></div>' +
          '<h1 data-ck="leadnetwork.hero.heading">Lead Network</h1>' +
          '<p class="lede" data-ck="leadnetwork.hero.lede">We invite you to explore our comprehensive selection of video courses ' +
          'offered through the Lead Network. Our courses are to enhance your skills and facilitate ' +
          'learning across various subjects. Discover the valuable opportunities that await you.</p>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="alnTickA"></span><span id="alnTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="alnStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Lead Network page" id="alnTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="alnTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="alnStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="alnDeck"><div class="deck__track" id="alnTrack">' +

      /* 01 -- teachings: watch & listen */
      '<section class="panel teach is-active" id="alnTeach" role="tabpanel" aria-labelledby="alnTab-alnTeach">' +
        '<div class="bg bg--lh" aria-hidden="true">' +
          '<img class="ly ly--soft on" data-ci="leadnetwork.teachings.item1Thumb" data-ciw="480" src="' + alnImg(M + TEACHINGS[0].thumb, 480) + '" alt="" width="480" height="360" loading="lazy" decoding="async">' +
          '<div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div>' +
        '</div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">01</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="leadnetwork.teachings.kicker">Teachings</span></div>' +
          '<h2 data-ck="leadnetwork.teachings.heading">Watch &amp; Listen</h2>' +
          '<div class="teach__grid">' +
            TEACHINGS.map(function (t, i) {
              return '<article class="t__c">' +
                '<div class="t__media" data-t="' + i + '">' +
                  '<img data-ci="leadnetwork.teachings.item' + (i + 1) + 'Thumb" data-ciw="1200" src="' + alnImg(M + t.thumb, 1200) + '" width="1200" height="675" ' +
                    (i === 0 ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"') + ' alt="' + alnEsc(t.title) + '">' +
                  '<button type="button" class="t__play" data-play="' + i + '" aria-label="Play ' + alnEsc(t.title) + '">' +
                    '<span>' + PLAY_SVG + '<b>Play</b></span>' +
                  '</button>' +
                '</div>' +
                '<div class="t__b">' +
                  '<div class="t__by" data-ck="leadnetwork.teachings.item' + (i + 1) + 'By">' + alnEsc(t.by) + '</div>' +
                  '<h3 data-ck="leadnetwork.teachings.item' + (i + 1) + 'Title">' + alnEsc(t.title) + '</h3>' +
                  '<p class="t__sub" data-ck="leadnetwork.teachings.item' + (i + 1) + 'Sub">' + alnEsc(t.sub) + '</p>' +
                  (t.length ? '<div class="t__len" data-ck="leadnetwork.teachings.item' + (i + 1) + 'Length">' + alnEsc(t.length) + '</div>' : '') +
                  /* the audio player when there is one; the "coming soon" note otherwise. The note
                     is in the DOM either way (hidden with audio) so its Page Content hook always exists. */
                  (t.audio ? '<div class="t__audio"><audio controls preload="none" src="' + MP3 + t.audio + '.mp3"></audio></div>' : '') +
                  '<div class="t__soon" data-ck="leadnetwork.teachings.audioSoon"' + (t.audio ? ' hidden' : '') + '>Audio coming soon</div>' +
                '</div>' +
              '</article>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 02 -- ministers: the paper room */
      '<section class="panel ministers" id="alnMinisters" role="tabpanel" aria-labelledby="alnTab-alnMinisters">' +
        '<div class="bg bg--rh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">02</div>' +
          '<div class="mark"><span class="kicker" data-ck="leadnetwork.ministers.kicker">Our Current Ministers</span></div>' +
          '<h2 data-ck="leadnetwork.ministers.heading">Our Current Ministers</h2>' +
          '<div class="people">' +

            '<article class="p__c">' +
              '<div class="p__ph"><img data-ci="leadnetwork.austin.photo" data-ciw="1600" src="' + alnImg(AUSTIN, 1600) + '" width="1944" height="2664" ' +
                'loading="lazy" decoding="async" alt="Apostle Carlos Austin and Pastor Melissa Austin"></div>' +
              '<div class="p__b">' +
                '<span class="p__role" data-ck="leadnetwork.ministers.austinRole">Apostle &amp; Pastor</span>' +
                '<h3 data-ck="leadnetwork.ministers.austinName">Carlos and Melissa Austin</h3>' +
                '<div class="p__church" data-ck="leadnetwork.ministers.austinChurch">' +
                  '<b>Kingdom Builders Ministry Church</b>' +
                  '200 N. Houston Ave., Suite C<br>Humble, TX 77338' +
                '</div>' +
                '<div class="p__links">' +
                  '<a href="https://www.facebook.com/kbmchurch2014/" target="_blank" rel="noopener" data-ck="leadnetwork.ministers.austinFacebook">Facebook</a>' +
                '</div>' +
              '</div>' +
            '</article>' +

            '<article class="p__c">' +
              '<div class="p__ph"><img data-ci="leadnetwork.calloway.photo" data-ciw="1600" src="' + alnImg(CALLOWAY, 1600) + '" width="1944" height="2664" ' +
                'loading="lazy" decoding="async" alt="Pastor Derrick Calloway and Pastor Pamla Calloway"></div>' +
              '<div class="p__b">' +
                '<span class="p__role" data-ck="leadnetwork.ministers.callowayRole">Lead Pastors</span>' +
                '<h3 data-ck="leadnetwork.ministers.callowayName">Derrick and Pamla Calloway</h3>' +
                '<div class="p__church" data-ck="leadnetwork.ministers.callowayChurch">' +
                  '<b>Faith Culture Church</b>' +
                  '245 Florida Ave SE<br>Denham Springs, LA 70726' +
                '</div>' +
                '<div class="p__links">' +
                  '<a href="https://faithculturechurchbr.com/about" target="_blank" rel="noopener" data-ck="leadnetwork.ministers.callowayWebsite">Website</a>' +
                  '<a href="https://www.facebook.com/fccaplacejustforyou/" target="_blank" rel="noopener" data-ck="leadnetwork.ministers.callowayFacebook">Facebook</a>' +
                '</div>' +
              '</div>' +
            '</article>' +

          '</div>' +
          '<div class="ministers__btn">' +
            '<a class="btn btn--dark" href="https://www.youtube.com/@arisechurch4147" ' +
            'target="_blank" rel="noopener" data-ck="leadnetwork.ministers.button">Watch Now</a>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 03 -- gatherings: the photo wall; hidden with its tab until data-photos arrives */
      '<section class="panel gather" id="alnGather" role="tabpanel" aria-labelledby="alnTab-alnGather">' +
        '<div class="bg bg--lh" aria-hidden="true" id="alnGatherBg">' + alnLayers('ly--soft', false) + '<div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">03</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="leadnetwork.gatherings.kicker">Gatherings</span></div>' +
          '<h2 data-ck="leadnetwork.gatherings.heading">Camp Meetings &amp; Teachings</h2>' +
          '<div class="gal-mount" data-cms-source="Portfolio"></div>' +
        '</div>' +
      '</section>' +

      '</div></div>' +

      /* the call: the camp meeting, below the deck, above the footer, always */
      '<section class="cta" id="alnCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true" id="alnCtaFolio">04</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="leadnetwork.cta.kicker">Camp Meeting</span></div>' +
          '<h2 class="h2--xl" data-ck="leadnetwork.cta.heading">The Outpour</h2>' +
          '<p class="cta__p" data-ck="leadnetwork.cta.body">The Lead Network 2026 Camp Meeting, October 30 to November 1.</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/events" target="_top" data-ck="leadnetwork.cta.button">See the Event</a>' +
      '</div></section>';

    this.applyContent();
    this.setTick();
    this.bindChrome();
    this.wirePlayers();
    this.fillGallery();
    this.initDeck();
    this.initPin();
  }

  /* ---- the ticker: the page's own words, read back from the CMS hooks ---- */
  setTick() {
    const self = this;
    const txt = function (k) { const el = self.querySelector('[data-ck="' + k + '"]'); return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; };
    const parts = [txt('leadnetwork.hero.heading'), txt('leadnetwork.hero.kicker'), txt('leadnetwork.teachings.heading'),
      txt('leadnetwork.ministers.heading'), txt('leadnetwork.cta.kicker'), txt('leadnetwork.cta.heading'), 'Arise Church'].filter(Boolean);
    const tick = parts.join(' \u00b7 ') + ' \u00b7 ';
    const a = this.querySelector('#alnTickA'), b = this.querySelector('#alnTickB');
    if (a && b && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }

  /* ---- teachings: Play swaps the poster for the video ---- */
  wirePlayers() {
    const self = this;
    this.querySelectorAll('.t__play').forEach(function (b) {
      b.addEventListener('click', function () {
        const i = Number(b.getAttribute('data-play'));
        const t = TEACHINGS[i];
        const box = self.querySelector('.t__media[data-t="' + i + '"]');
        if (!t || !box) return;
        const poster = box.querySelector('img');
        const posterSrc = poster ? poster.getAttribute('src') : alnImg(M + t.thumb, 1200);
        box.classList.add('playing');
        box.innerHTML =
          '<video controls autoplay playsinline poster="' + alnEsc(posterSrc) + '">' +
            '<source src="' + VID + alnEsc(t.video) + '/' + alnEsc(t.quality) + '/mp4/file.mp4" type="video/mp4">' +
            '<source src="' + VID + alnEsc(t.video) + '/480p/mp4/file.mp4" type="video/mp4">' +
          '</video>';
        self.fitDeck();
      });
    });
    /* an image that never arrives leaves the ink card, not a broken icon */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG' && img.classList.contains('ly')) { img.style.opacity = '0'; img.classList.remove('on'); }
    }, true);
  }

  /* ---- gatherings: the photo wall from data-photos ---- */
  galPhotos() {
    const raw = this.getAttribute('data-photos');
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      if (!Array.isArray(d)) return [];
      return d.map(function (p) {
        if (typeof p === 'string') return { src: p, alt: '', caption: '', video: '', videoId: '' };
        if (!p || typeof p !== 'object') return { src: '', alt: '', caption: '', video: '', videoId: '' };
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
    const panel = this.querySelector('#alnGather');
    const tab = this.querySelector('.strap__j[data-to="alnGather"]');
    if (!mount || !panel) return;
    const pics = this.galPhotos();
    this._pics = pics;

    /* Nothing uploaded yet -- the room and its tab leave the running order, not an empty frame. */
    if (!pics.length) {
      if (this._galKey !== '') { mount.innerHTML = ''; this._galKey = ''; }
      panel.hidden = true; if (tab) tab.hidden = true;
      this.setLayers('alnGatherBg', '');
      this.renumber();
      if (this._deck) { if (this._active === 'alnGather') this._active = 'alnTeach'; this.applyDeck(false); }
      return;
    }

    const wasHidden = panel.hidden;
    panel.hidden = false; if (tab) tab.hidden = false;
    this.renumber();

    const key = pics.map(function (p) { return p.src + '|' + p.videoId + '|' + p.video + '|' + p.alt + '|' + p.caption; }).join(',');
    if (this._galKey !== key || !mount.children.length) {
      this._galKey = key;
      const vids = pics.filter(function (p) { return p.video || p.videoId; }).length;
      mount.innerHTML =
        '<div class="gal">' +
          pics.map(function (p, i) {
            const isVid = !!(p.video || p.videoId);
            return '<button type="button" class="gal__t" data-i="' + i + '" ' +
              'aria-label="Open ' + (isVid ? 'video' : 'photo') + ' ' + (i + 1) + ' of ' + pics.length + (p.alt ? ': ' + alnEsc(p.alt) : '') + '">' +
              '<img src="' + alnEsc(alnImg(p.src, 1200)) + '" alt="' + alnEsc(p.alt) + '" width="800" height="800" loading="lazy" decoding="async">' +
              '<span class="gal__i" aria-hidden="true">' + alnPad(i + 1) + '</span>' +
              (isVid ? '<span class="gal__v">' + PLAY_SVG + '</span>' : '') +
            '</button>';
          }).join('') +
        '</div>' +
        '<div class="gal__n">' + pics.length + ' item' + (pics.length === 1 ? '' : 's') +
          (vids ? ' &middot; ' + vids + ' video' + (vids > 1 ? 's' : '') : '') +
          ' &middot; tap any to open</div>';
      this.wireLightbox();
    }
    const first = pics.filter(function (p) { return p.src; })[0];
    this.setLayers('alnGatherBg', first ? alnImg(first.src, 480) : '');
    if (this._deck && (wasHidden || this._active === 'alnGather')) this.applyDeck(false);
    this.fitDeck();
  }

  /* Folios and tab numerals follow the rooms that are actually in the running order. */
  renumber() {
    const self = this;
    let n = 0;
    this.querySelectorAll('#alnTrack > .panel').forEach(function (p) {
      if (p.hidden) return;
      n++;
      const f = p.querySelector('.folio'); if (f) f.textContent = alnPad(n);
      const t = self.querySelector('.strap__j[data-to="' + p.id + '"] i'); if (t) t.textContent = alnPad(n);
    });
    const cf = this.querySelector('#alnCtaFolio'); if (cf) cf.textContent = alnPad(n + 1);
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
      if (next.naturalWidth <= 120) { next.onload = null; return; }
      next.classList.add('on');
      imgs.forEach(function (i) { if (i !== next) i.classList.remove('on'); });
    };
    next.src = url;
  }

  wireLightbox() {
    const self = this;
    if (!this._lb) {
      const lb = document.createElement('div');
      lb.className = 'aln-lb';
      lb.setAttribute('data-open', 'false');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Photo viewer');
      lb.innerHTML =
        '<div class="aln-lb__i"></div>' +
        '<button type="button" class="aln-lb__x" aria-label="Close">&times;</button>' +
        '<button type="button" class="aln-lb__p" aria-label="Previous">&#8249;</button>' +
        '<div class="aln-lb__stage"></div>' +
        '<button type="button" class="aln-lb__n" aria-label="Next">&#8250;</button>' +
        '<div class="aln-lb__c"></div>';
      document.body.appendChild(lb);
      this._lb = lb;

      const stage = lb.querySelector('.aln-lb__stage');
      const cap = lb.querySelector('.aln-lb__c');
      const idx = lb.querySelector('.aln-lb__i');

      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + alnEsc(p.videoId) + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + alnEsc(p.video) + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + alnEsc(alnImg(p.src, 2000)) + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + alnEsc(alnImg(p.src, 2000)) + '" alt="' + alnEsc(p.alt || '') + '">';
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
      lb.querySelector('.aln-lb__x').addEventListener('click', this._close);
      lb.querySelector('.aln-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.aln-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
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
        self._lb.querySelector('.aln-lb__x').focus();
      });
    });
  }

  disconnectedCallback() {
    if (this._lbKey) document.removeEventListener('keydown', this._lbKey);
    if (this._lb && this._lb.parentNode) this._lb.parentNode.removeChild(this._lb);
    document.documentElement.style.overflow = '';
  }

  /* ---- chrome: tabs, arrows, keyboard (as on the Media page) ---- */
  bindChrome() {
    const self = this;
    this.addEventListener('click', function (ev) {
      const t = ev.target && ev.target.closest ? ev.target.closest('[data-to],[data-step]') : null;
      if (!t || !self.contains(t)) return;
      if (t.hasAttribute('data-step')) { self.step(Number(t.getAttribute('data-step'))); return; }
      self.go(t.getAttribute('data-to'), true);
    });
    let raf = 0;
    const measure = function () { raf = 0; self.fitDeck(); };
    window.addEventListener('resize', function () { if (!raf) raf = requestAnimationFrame(measure); });
    const tabs = this.querySelector('#alnTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#alnTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#alnDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'alnTeach';
    let sx = 0, sy = 0, sid = null, swiping = false;
    deck.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' || (ev.target.closest && ev.target.closest('input, select, audio, video, a, button'))) { sid = null; return; }
      sid = ev.pointerId; sx = ev.clientX; sy = ev.clientY; swiping = true;
    });
    deck.addEventListener('pointerup', function (ev) {
      if (!swiping || ev.pointerId !== sid) return;
      swiping = false;
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) self.step(dx < 0 ? 1 : -1, true);
    });
    deck.addEventListener('pointercancel', function () { swiping = false; });
    try {
      this._ro = new ResizeObserver(function () { self.fitDeck(); });
      this.querySelectorAll('#alnTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#alnDeck');
    const active = this.querySelector('#alnTrack > .panel.is-active');
    if (!deck || !active) return;
    const h = active.offsetHeight;
    if (h && deck.style.height !== h + 'px') deck.style.height = h + 'px';
  }

  go(id, byUser) {
    const ps = this.panels();
    let idx = -1;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === id) idx = i;
    if (idx < 0) return;
    const changed = this._active !== id;
    this._active = id;
    this.applyDeck(!!byUser && changed);
    if (byUser && changed) {
      const strap = this.querySelector('#alnStrap');
      const deck = this.querySelector('#alnDeck');
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
      if (byUser) { const t = this.querySelector('#alnTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#alnTrack');
    const deck = this.querySelector('#alnDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'alnTeach';
    this.querySelectorAll('#alnTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#alnTabs .strap__j').forEach(function (t) {
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

  /* ---- the strap lock (identical to the Media and Bible pages) ---- */
  headerOffset() {
    let off = 0;
    try {
      if (typeof document.elementsFromPoint !== 'function') return 0;
      const w = window.innerWidth || 1000;
      const xs = [Math.round(w * 0.5), Math.round(w * 0.12), Math.round(w * 0.88)];
      for (let k = 0; k < xs.length; k++) {
        const stack = document.elementsFromPoint(xs[k], 2);
        for (let i = 0; i < stack.length; i++) {
          const el = stack[i];
          if (el === document.documentElement || el === document.body || this.contains(el)) continue;
          let node = el, pin = null, n = 0, opacity = 1, hidden = false;
          while (node && node !== document.body && n++ < 10) {
            const cs = getComputedStyle(node);
            opacity *= parseFloat(cs.opacity) || 0;
            if (cs.visibility === 'hidden') hidden = true;
            if (cs.position === 'fixed' || cs.position === 'sticky') { pin = node; break; }
            node = node.parentElement;
          }
          if (!pin) continue;
          if (hidden || opacity < 0.05) break;
          const r = pin.getBoundingClientRect();
          if (r.top <= 2 && r.bottom > 0 && r.height < 240) off = Math.max(off, r.bottom);
          break;
        }
      }
    } catch (e) { off = 0; }
    return Math.round(off);
  }
  windowScrolls() {
    try {
      let el = this.parentElement, n = 0;
      while (el && el !== document.body && el !== document.documentElement && n++ < 40) {
        const cs = getComputedStyle(el);
        if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) return false;
        el = el.parentElement;
      }
    } catch (e) { return true; }
    return true;
  }
  initPin() {
    const self = this;
    const strap = this.querySelector('#alnStrap');
    const spacer = this.querySelector('#alnStrapSpacer');
    if (!strap || !spacer || this._pinInit) return;
    this._pinInit = true;
    let raf = 0;
    const update = function () {
      raf = 0;
      const off = self.headerOffset();
      const pinned = strap.classList.contains('pinned');
      const h = strap.offsetHeight || 48;
      if (!self.windowScrolls()) {
        if (pinned) { strap.classList.remove('pinned'); strap.style.transform = ''; spacer.style.height = '0px'; }
        if (strap.style.top !== off + 'px') strap.style.top = off + 'px';
        return;
      }
      const natural = (pinned ? spacer : strap).getBoundingClientRect().top;
      if (natural <= off) {
        if (!pinned) { spacer.style.height = h + 'px'; strap.classList.add('pinned'); }
        if (strap.style.top !== off + 'px') strap.style.top = off + 'px';
        const over = (off + h) - self.getBoundingClientRect().bottom;
        const t = over > 0 ? 'translateY(' + (-Math.round(over)) + 'px)' : '';
        if (strap.style.transform !== t) strap.style.transform = t;
      } else {
        if (pinned) { strap.classList.remove('pinned'); strap.style.transform = ''; spacer.style.height = '0px'; }
        if (strap.style.top !== off + 'px') strap.style.top = off + 'px';
      }
    };
    const kick = function () { if (!raf) raf = requestAnimationFrame(update); };
    let later = [];
    const kickLater = function () {
      kick();
      later.forEach(clearTimeout);
      later = [200, 500, 900].map(function (ms) { return setTimeout(kick, ms); });
    };
    this._pinUpdate = update;
    window.addEventListener('scroll', kickLater, { passive: true });
    window.addEventListener('resize', kick);
    update();
    setTimeout(update, 600);
  }

  /* ---- Page Content hooks ---- */
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
        const img = alnImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
        if (el.tagName === 'IMG') el.src = img;
        else el.style.backgroundImage = 'url("' + String(img).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-leadnetwork', AriseLeadNetwork);
