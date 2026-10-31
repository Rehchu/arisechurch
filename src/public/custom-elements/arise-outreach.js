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
   Rebuilt 2026-10-31 in the "House Lights Down" theme shared with the Media page
   (arise-sermons.js) and the Bible Search page (arise-bible.js): masthead, the strap
   (01 Mission / 02 Footage / 03 Supplies / 04 Community) that locks under the site
   header, one room on stage at a time, the red Serve call under the last cut.
   Every CMS key, attribute and link target is unchanged. Class prefix .aor; ids aor*.
   =========================================================================== */

const AOR_FONTS =
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

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const PLAY_SVG = '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true"><path d="M14 8L0 16V0L14 8Z" fill="currentColor"/></svg>';

const AOR_CSS = `
arise-outreach{display:block;width:100%}
.aor *{box-sizing:border-box;margin:0;padding:0}
.aor{
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
@media(min-width:900px){.aor{--cut:48px;--foot:5px}}
.aor [hidden]{display:none!important}
.aor h1,.aor h2,.aor h3,.aor p,.aor button,.aor img,.aor iframe,.aor video,.aor ul,.aor li,.aor dl,.aor dt,.aor dd{margin:0;padding:0;border:0}
.aor img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.aor iframe,.aor video{display:block}
.aor .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.aor .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.aor .g12{grid-template-columns:repeat(12,1fr)}}
.aor h1,.aor h2,.aor h3,.aor .folio,.aor .cnt b{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aor h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.aor .h2--xl{font-size:var(--h2)}
.aor h3{font-size:var(--h3);color:#fff}
.aor p{font-size:var(--body);line-height:1.6}
.aor .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.aor a{color:inherit}

/* ---- house devices ---- */
.aor .mark{display:flex;align-items:center;margin-bottom:18px}
.aor .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.aor .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .aor .mark{flex-wrap:nowrap;align-items:flex-start}
  .aor .mark::before{margin-right:124px;margin-top:5px}
  .aor .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aor .mark--l .kicker{color:var(--redL)}
.aor .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.aor .mark--w .kicker{color:#fff}
.aor .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.aor .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.aor .strip--ghost{background:transparent;border:1.5px solid #fff}
.aor .strip--ghost span{color:#fff}
.aor .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.aor .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aor .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aor .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.aor .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aor .btn--dark:hover{background:var(--ink);color:#fff}
.aor .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.aor .btn--onRed:hover{background:transparent;color:#fff}
.aor .btn[disabled]{opacity:.55;pointer-events:none}
.aor a:focus-visible,.aor button:focus-visible,.aor input:focus-visible,.aor select:focus-visible,.aor video:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.aor .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.aor .folio--d{color:var(--red)}
.aor .folio--w{color:#fff}
.aor .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.aor .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.aor .ulink:hover::after,.aor .ulink:focus-visible::after{width:100%}
.aor .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.aor .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.aor .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.aor .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.aor .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.aor .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.aor .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.aor .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.aor .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.aor .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.aor .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
/* photo backdrop layers: two stacked images that crossfade; a small copy scaled up reads as a blur */
.aor .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s var(--ease);background:transparent}
.aor .ly.on{opacity:1}
.aor .ly--soft{transform:scale(1.15)}
.aor .bg__scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,8,.55) 0%,rgba(6,6,8,.78) 55%,var(--scrim) 100%)}

/* ---- masthead ---- */
.aor .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.aor .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.aor .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.aor .mast__txt{min-width:0;flex:1 1 auto}
.aor .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.aor .mast .lede{margin-top:22px}
.aor .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.aor .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:aorTick 36s linear infinite}
.aor .mast__tick:hover div{animation-play-state:paused}
.aor .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.aor .mast{padding:44px 0 26px}.aor .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.aor .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.aor .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.aor .strap__spacer{height:0}
.aor .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.aor .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.aor .strap__jump::-webkit-scrollbar{display:none}
.aor .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.aor .strap__j:first-child{border-left:0}
.aor .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .aor .strap__jump{overflow:visible;margin:0;padding:0}
  .aor .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .aor .strap__j i{font-size:12px}
}
.aor .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.aor .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.aor .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.aor .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.aor .strap__j:focus-visible{outline-offset:-3px}
.aor .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.aor .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.aor .strap__arrow:hover{background:rgba(255,255,255,.08)}
.aor .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .aor .strap__jump{overflow:visible;margin:0;padding:0}
  .aor .strap__j{padding:0 20px}
  .aor .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.aor .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.aor .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.aor .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.aor .panel:not(.is-active){visibility:hidden}
.aor .deck.moving .panel{visibility:visible}
.aor .panel.enter > .shell{animation:aorRise .55s var(--ease) both}

/* ---- 01 mission: impact tioga, the first clip's poster soft in the backdrop ---- */
.aor .mission{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.aor .mission{padding:56px 0 calc(56px + var(--cut))}}
.aor .mission .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.aor .mission .ly.on{opacity:.22}
.aor .mission > .shell{position:relative;z-index:1}
.aor .mission__grid{margin-top:8px}
.aor .mission__body{margin-top:24px;max-width:60ch;color:rgba(255,255,255,.72)}
.aor .mission__strip{margin-top:32px}
@media(min-width:900px){
  .aor .mission__grid{margin-top:0;align-items:end}
  .aor .mission__main{grid-column:1/8}
  .aor .mission__side{grid-column:9/13;align-self:end;padding-bottom:6px}
  .aor .mission__side .strip{margin-top:0}
}

/* ---- 02 footage: the two outreach clips as ink cards ---- */
.aor .footage{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aor .footage{padding:64px 0 calc(72px + var(--cut))}}
.aor .footage .bg{background:var(--ink)}
.aor .footage > .shell{position:relative;z-index:1}
.aor .clips{display:grid;grid-template-columns:minmax(0,340px);justify-content:start;gap:18px;margin-top:32px}
@media(min-width:480px){.aor .clips{grid-template-columns:repeat(2,minmax(0,1fr));max-width:720px;gap:16px}}
@media(min-width:900px){.aor .clips{grid-template-columns:repeat(2,minmax(0,1fr));max-width:720px;gap:22px;margin-top:44px}}
.aor .clip{background:var(--scrim);position:relative;border:1px solid var(--ruleD);border-top:3px solid var(--red);min-width:0}
.aor .clip video{width:100%;aspect-ratio:9/16;object-fit:cover;display:block;background:#000}
.aor .clip__cap{display:flex;align-items:center;gap:12px;padding:14px 16px;font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:var(--ink);line-height:1.4}
.aor .clip__cap i{font-style:normal;flex:0 0 auto;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:16px;letter-spacing:.06em}
.aor .footage__note{margin-top:28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}

/* ---- 03 supplies: the paper room ---- */
.aor .supplies{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aor .supplies{padding:64px 0 calc(72px + var(--cut))}}
.aor .supplies .bg{background:var(--bone)}
.aor .supplies > .shell{position:relative;z-index:1}
.aor .supplies h2,.aor .supplies h3{color:var(--ink)}
.aor .supplies .lede{color:var(--muted);margin-top:24px;max-width:56ch}
.aor .supp{display:grid;grid-template-columns:1fr;gap:28px;align-items:start;margin-top:36px}
@media(min-width:820px){.aor .supp{grid-template-columns:minmax(0,340px) 1fr;gap:clamp(28px,4vw,56px);margin-top:44px}}
.aor .supp__img{background:var(--paper);border:1px solid var(--ruleL);border-top:3px solid var(--red);padding:10px;max-width:420px}
.aor .supp__img img{width:100%;height:auto;display:block;background:var(--paper)}
.aor .supp__list{columns:2;column-gap:32px;list-style:none;margin-top:6px;border-top:1px solid var(--ruleL);padding-top:14px}
@media(max-width:560px){.aor .supp__list{columns:1}}
.aor .supp__list li{position:relative;padding:0 0 12px 24px;font-size:var(--body);line-height:1.5;color:var(--ink);break-inside:avoid}
.aor .supp__list li::before{content:"";position:absolute;left:0;top:10px;width:12px;height:4px;background:var(--red)}

/* ---- 04 community: the photo wall (fed by page code via data-photos) ---- */
.aor .community{position:relative;background:var(--scrim);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aor .community{padding:64px 0 calc(72px + var(--cut))}}
.aor .community .bg{background:var(--scrim)}
.aor .community .ly.on{opacity:.16}
.aor .community > .shell{position:relative;z-index:1}
/* the wall: square tiles two columns wide, every fifth a 2:1 feature twice as wide, so the rows always
   line up (a feature is exactly as tall as a square). 2 / 4 / 6 columns at phone / tablet / desktop. */
.aor .gal{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:32px}
@media(min-width:561px){.aor .gal{grid-template-columns:repeat(4,1fr);gap:11px}}
@media(min-width:901px){.aor .gal{grid-template-columns:repeat(6,1fr);gap:14px;margin-top:44px}}
.aor .gal__t{position:relative;overflow:hidden;background:var(--ink);border:0;padding:0;cursor:pointer;display:block;grid-column:span 1;aspect-ratio:1/1;
  -webkit-tap-highlight-color:transparent;font:inherit;color:#fff}
.aor .gal__t:nth-child(5n+1){grid-column:span 2;aspect-ratio:2/1}
@media(min-width:561px){
  .aor .gal__t{grid-column:span 2}
  .aor .gal__t:nth-child(5n+1){grid-column:span 4}
}
.aor .gal__t img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.8);transition:transform .55s var(--ease),filter .3s}
.aor .gal__t::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(6,6,8,.6) 100%);pointer-events:none;z-index:1}
.aor .gal__t::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.aor .gal__t:hover::after,.aor .gal__t:focus-visible::after{transform:scaleX(1)}
.aor .gal__t:hover img{transform:scale(1.06);filter:saturate(1)}
.aor .gal__t:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.aor .gal__i{position:absolute;top:8px;left:12px;z-index:2;font-family:'Anton',Impact,sans-serif;font-size:28px;line-height:1;color:var(--redL);text-transform:uppercase;letter-spacing:.02em}
@media(min-width:900px){.aor .gal__i{font-size:36px;top:10px;left:14px}}
/* video tiles get a play badge so they read as playable */
.aor .gal__v{position:absolute;right:12px;bottom:14px;z-index:2;width:38px;height:38px;background:var(--red);display:flex;align-items:center;justify-content:center;color:#fff;pointer-events:none}
.aor .gal__v svg{width:12px;height:14px}
.aor .gal__n{margin-top:28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}

/* ---- the call: the red curtain the last room's cut lands on ---- */
.aor .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.aor .cta{padding:calc(64px + var(--cut)) 0 80px}}
.aor .cta h2{color:#fff}
.aor .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.aor .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.aor .cta a:focus-visible,.aor .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .aor .cta__txt{grid-column:1/8}
  .aor .cta__p{font-size:19px;max-width:none}
  .aor .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- the photo viewer (mounted on body, so not under .aor) ---- */
.aor-lb{position:fixed;inset:0;z-index:2147482000;display:none;background:rgba(6,6,8,.94);color-scheme:light only}
.aor-lb[data-open="true"]{display:flex;align-items:center;justify-content:center}
.aor-lb img,.aor-lb video{max-width:92vw;max-height:82vh;object-fit:contain;display:block;box-shadow:0 20px 60px rgba(0,0,0,.6);background:#000}
.aor-lb video{width:auto}
.aor-lb button{position:absolute;background:transparent;border:1px solid rgba(255,255,255,.30);color:#fff;cursor:pointer;font-family:'Oswald',Helvetica,Arial,sans-serif;line-height:1}
.aor-lb__x{top:20px;right:20px;width:46px;height:46px;font-size:22px}
.aor-lb__p,.aor-lb__n{top:50%;transform:translateY(-50%);width:52px;height:64px;font-size:24px}
.aor-lb__p{left:16px}
.aor-lb__n{right:16px}
.aor-lb button:hover{background:#D6222D;border-color:#D6222D}
.aor-lb__c{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:14px;color:rgba(255,255,255,.86);padding:0 20px}
.aor-lb__i{position:absolute;top:26px;left:24px;font-family:'Oswald',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.2em;color:rgba(255,255,255,.6)}
.aor-lb button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}

/* ---- motion ---- */
@keyframes aorTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes aorRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .aor *,.aor *::before,.aor *::after{animation:none!important;transition:none!important}
  .aor .mast__tick div{animation:none;width:100%}
  .aor .mast__tick span:last-child{display:none}
  .aor .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .aor .deck,.aor .deck__track{transition:none}
  .aor .panel.enter > .shell{animation:none}
  .aor-lb *{transition:none!important}
}
`;

function aorEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function aorPad(n) { return (n < 10 ? '0' : '') + n; }

/* Arise Church speed: ask Wix for a resized copy (AVIF/WebP picked per browser) of a
   plain static.wixstatic.com photo; longest side at most w, no crop. Anything else is
   returned untouched. */
function aorImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('aor-outreach-fonts') && !document.querySelector('link[href="' + AOR_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'aor-outreach-fonts'; l.rel = 'stylesheet'; l.href = AOR_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('aor-outreach-css')) {
    const s = document.createElement('style');
    s.id = 'aor-outreach-css'; s.innerHTML = AOR_CSS;
    document.head.appendChild(s);
  }
}

/* Two stacked backdrop images that crossfade (as on the Media page). */
function aorLayers(cls, eager) {
  const attrs = ' alt="" width="480" height="360" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"');
  return '<img class="ly ' + cls + '"' + attrs + '><img class="ly ' + cls + '"' + attrs + '>';
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Mission', 'aorMission'], ['02', 'Footage', 'aorFootage'], ['03', 'Supplies', 'aorSupplies'], ['04', 'Community', 'aorCommunity']];

class AriseOutreach extends HTMLElement {
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
    this.classList.add('aor');

    const poster = function (c, w) { return aorImg(M + c.id + 'f001.jpg', w); };

    this.innerHTML =
      /* masthead: the page title and lede; on desktop the red ticker */
      '<header class="mast" id="aorMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="outreach.hero.kicker">Impact Tioga</span></div>' +
          '<h1 data-ck="outreach.hero.heading">Outreach</h1>' +
          '<p class="lede" data-ck="outreach.hero.lede">Share God\u2019s love through community service and evangelism.</p>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="aorTickA"></span><span id="aorTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="aorStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Outreach page" id="aorTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="aorTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="aorStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="aorDeck"><div class="deck__track" id="aorTrack">' +

      /* 01 -- mission: impact tioga; the first clip's poster soft in the backdrop */
      '<section class="panel mission is-active" id="aorMission" role="tabpanel" aria-labelledby="aorTab-aorMission">' +
        '<div class="bg bg--lh" aria-hidden="true">' +
          '<img class="ly ly--soft on" src="' + poster(CLIPS[0], 480) + '" alt="" width="480" height="360" fetchpriority="high">' +
          '<div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div>' +
        '</div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">01</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="outreach.mission.kicker">Our Mission</span></div>' +
          '<h2 data-ck="outreach.mission.heading">Impact Tioga</h2>' +
          '<div class="g12 mission__grid">' +
            '<div class="mission__main">' +
              '<p class="lede" data-ck="outreach.mission.body">Our mission for this year is to ' +
              'Impact Tioga\u2014to bring the life-changing love of Jesus Christ into every corner of our ' +
              'community, transforming lives, families, and the town we call home.</p>' +
              '<p class="mission__body" data-ck="outreach.mission.body2">We are committed to building ' +
              'the community together: partnering with neighbors, schools, businesses, and local leaders ' +
              'to foster unity, serve those in need, and create spaces where everyone feels seen, valued, ' +
              'and loved.</p>' +
            '</div>' +
            '<div class="mission__side">' +
              '<div class="strip mission__strip"><span data-ck="outreach.mission.strip">Impact Tioga</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 02 -- footage: the two outreach clips */
      '<section class="panel footage" id="aorFootage" role="tabpanel" aria-labelledby="aorTab-aorFootage">' +
        '<div class="bg bg--rh" aria-hidden="true"><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">02</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="outreach.footage.kicker">Real Footage</span></div>' +
          '<h2 data-ck="outreach.footage.heading">Out In The Community</h2>' +
          '<div class="clips">' +
            CLIPS.map(function (c, i) {
              return '<div class="clip">' +
                '<video controls preload="none" playsinline ' +
                  'poster="' + poster(c, 1200) + '" ' +
                  'aria-label="Arise Church outreach: ' + aorEsc(c.label) + '">' +
                  '<source src="' + VID + c.id + '/720p/mp4/file.mp4" type="video/mp4">' +
                  '<source src="' + VID + c.id + '/480p/mp4/file.mp4" type="video/mp4">' +
                '</video>' +
                '<div class="clip__cap"><i aria-hidden="true">' + aorPad(i + 1) + '</i><span data-ck="outreach.footage.clip' + (i + 1) + '">' + aorEsc(c.label) + '</span></div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 03 -- supplies: the paper room */
      '<section class="panel supplies" id="aorSupplies" role="tabpanel" aria-labelledby="aorTab-aorSupplies">' +
        '<div class="bg bg--lh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">03</div>' +
          '<div class="mark"><span class="kicker" data-ck="outreach.supplies.kicker">How To Help</span></div>' +
          '<h2 data-ck="outreach.supplies.heading">Outreach Supplies<br>Needed</h2>' +
          '<p class="lede" data-ck="outreach.supplies.body">We are always collecting supplies ' +
          '&amp; monetary donations for the homeless and hungry in our community.</p>' +
          '<div class="supp">' +
            '<div class="supp__img" id="aorSuppImg"><img data-ci="outreach.supplies.image" data-ciw="1600" src="' + aorImg(SUPPLIES, 1600) + '" ' +
              'width="1200" height="1600" loading="lazy" decoding="async" alt="Outreach supplies needed list"></div>' +
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
        '</div>' +
      '</section>' +

      /* 04 -- community: the photo wall; hidden with its tab until data-photos arrives */
      '<section class="panel community" id="aorCommunity" role="tabpanel" aria-labelledby="aorTab-aorCommunity">' +
        '<div class="bg bg--rh" aria-hidden="true" id="aorCommunityBg">' + aorLayers('ly--soft', false) + '<div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">04</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="outreach.community.kicker">In The Community</span></div>' +
          '<h2 data-ck="outreach.community.heading">Impact Tioga</h2>' +
          '<div class="gal-mount" data-cms-source="Portfolio"></div>' +
        '</div>' +
      '</section>' +

      '</div></div>' +

      /* the call: serve with us, below the deck, above the footer, always */
      '<section class="cta" id="aorCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true" id="aorCtaFolio">05</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="outreach.cta.kicker">Serve With Us</span></div>' +
          '<h2 class="h2--xl" data-ck="outreach.cta.heading">We Are In Need</h2>' +
          '<p class="cta__p" data-ck="outreach.cta.body">Join our congregation in making a difference.</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/serve" target="_top" data-ck="outreach.cta.button">Sign Up to Serve</a>' +
      '</div></section>';

    this.applyContent();
    this.setTick();
    this.bindChrome();
    this.fillGallery();
    this.initDeck();
    this.initPin();
  }

  /* ---- the ticker: the page's own words, read back from the CMS hooks ---- */
  setTick() {
    const self = this;
    /* a <br> in a heading ("Outreach Supplies<br>Needed") reads as a space, not as nothing */
    const txt = function (k) {
      const el = self.querySelector('[data-ck="' + k + '"]');
      if (!el) return '';
      const c = el.cloneNode(true);
      c.querySelectorAll('br').forEach(function (b) { b.parentNode.replaceChild(document.createTextNode(' '), b); });
      return (c.textContent || '').replace(/\s+/g, ' ').trim();
    };
    const parts = [txt('outreach.hero.heading'), txt('outreach.hero.kicker'), txt('outreach.footage.heading'),
      txt('outreach.supplies.heading'), txt('outreach.community.kicker'), txt('outreach.cta.heading'), 'Arise Church'].filter(Boolean);
    const tick = parts.join(' \u00b7 ') + ' \u00b7 ';
    const a = this.querySelector('#aorTickA'), b = this.querySelector('#aorTickB');
    if (a && b && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }

  /* ---- community: the photo wall from data-photos ---- */
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
    const panel = this.querySelector('#aorCommunity');
    const tab = this.querySelector('.strap__j[data-to="aorCommunity"]');
    if (!mount || !panel) return;
    const pics = this.galPhotos();
    this._pics = pics;

    /* Nothing uploaded yet -- the room and its tab leave the running order, not an empty frame. */
    if (!pics.length) {
      if (this._galKey !== '') { mount.innerHTML = ''; this._galKey = ''; }
      panel.hidden = true; if (tab) tab.hidden = true;
      this.setLayers('aorCommunityBg', '');
      this.renumber();
      if (this._deck) { if (this._active === 'aorCommunity') this._active = 'aorMission'; this.applyDeck(false); }
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
              'aria-label="Open ' + (isVid ? 'video' : 'photo') + ' ' + (i + 1) + ' of ' + pics.length + (p.alt ? ': ' + aorEsc(p.alt) : '') + '">' +
              '<img src="' + aorEsc(aorImg(p.src, 1200)) + '" alt="' + aorEsc(p.alt) + '" width="800" height="800" loading="lazy" decoding="async">' +
              '<span class="gal__i" aria-hidden="true">' + aorPad(i + 1) + '</span>' +
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
    this.setLayers('aorCommunityBg', first ? aorImg(first.src, 480) : '');
    if (this._deck && (wasHidden || this._active === 'aorCommunity')) this.applyDeck(false);
    this.fitDeck();
  }

  /* Folios and tab numerals follow the rooms that are actually in the running order. */
  renumber() {
    const self = this;
    let n = 0;
    this.querySelectorAll('#aorTrack > .panel').forEach(function (p) {
      if (p.hidden) return;
      n++;
      const f = p.querySelector('.folio'); if (f) f.textContent = aorPad(n);
      const t = self.querySelector('.strap__j[data-to="' + p.id + '"] i'); if (t) t.textContent = aorPad(n);
    });
    const cf = this.querySelector('#aorCtaFolio'); if (cf) cf.textContent = aorPad(n + 1);
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
      lb.className = 'aor-lb';
      lb.setAttribute('data-open', 'false');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Photo viewer');
      lb.innerHTML =
        '<div class="aor-lb__i"></div>' +
        '<button type="button" class="aor-lb__x" aria-label="Close">&times;</button>' +
        '<button type="button" class="aor-lb__p" aria-label="Previous">&#8249;</button>' +
        '<div class="aor-lb__stage"></div>' +
        '<button type="button" class="aor-lb__n" aria-label="Next">&#8250;</button>' +
        '<div class="aor-lb__c"></div>';
      document.body.appendChild(lb);
      this._lb = lb;

      const stage = lb.querySelector('.aor-lb__stage');
      const cap = lb.querySelector('.aor-lb__c');
      const idx = lb.querySelector('.aor-lb__i');

      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + aorEsc(p.videoId) + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + aorEsc(p.video) + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + aorEsc(aorImg(p.src, 2000)) + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + aorEsc(aorImg(p.src, 2000)) + '" alt="' + aorEsc(p.alt || '') + '">';
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
      lb.querySelector('.aor-lb__x').addEventListener('click', this._close);
      lb.querySelector('.aor-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.aor-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
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
        self._lb.querySelector('.aor-lb__x').focus();
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
    const tabs = this.querySelector('#aorTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
    /* a backdrop photo that never arrives leaves the ink room, not a broken icon; the supplies
       picture that never arrives folds away so the list takes the row (it comes back on load) */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (!img || img.tagName !== 'IMG') return;
      if (img.classList.contains('ly')) { img.style.opacity = '0'; img.classList.remove('on'); return; }
      const fig = img.closest ? img.closest('#aorSuppImg') : null;
      if (fig) { fig.hidden = true; self.fitDeck(); }
    }, true);
    this.addEventListener('load', function (ev) {
      const img = ev.target;
      if (!img || img.tagName !== 'IMG') return;
      const fig = img.closest ? img.closest('#aorSuppImg') : null;
      if (fig && fig.hidden) { fig.hidden = false; self.fitDeck(); }
    }, true);
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#aorTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#aorDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'aorMission';
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
      this.querySelectorAll('#aorTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#aorDeck');
    const active = this.querySelector('#aorTrack > .panel.is-active');
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
      const strap = this.querySelector('#aorStrap');
      const deck = this.querySelector('#aorDeck');
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
      if (byUser) { const t = this.querySelector('#aorTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#aorTrack');
    const deck = this.querySelector('#aorDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'aorMission';
    this.querySelectorAll('#aorTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
      /* a clip left playing in the wings stops when its room leaves the stage */
      if (!on) p.querySelectorAll('video').forEach(function (v) { if (!v.paused) { try { v.pause(); } catch (e) { /* not playable */ } } });
    });
    this.querySelectorAll('#aorTabs .strap__j').forEach(function (t) {
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

  /* ---- the strap lock (identical to the Media page) ---- */
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
    const strap = this.querySelector('#aorStrap');
    const spacer = this.querySelector('#aorStrapSpacer');
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
        const img = aorImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
        if (el.tagName === 'IMG') el.src = img;
        else el.style.backgroundImage = 'url("' + String(img).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-outreach', AriseOutreach);
