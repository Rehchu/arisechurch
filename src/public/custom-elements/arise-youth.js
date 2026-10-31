/* ===========================================================================
   ARISE CHURCH -- YOUTH MINISTRY
   File: public/custom-elements/arise-youth.js
   Tag:  arise-youth

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-youth.js
      -> paste this whole file
   2. Editor -> the page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-youth.js
      Tag Name: arise-youth
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Save, then PUBLISH. Custom elements look wrong in Editor and Preview --
      only the published site renders them properly.

   All copy is from the live page.
   NOTE: Youth Events is empty on the live page -- shown as an empty state.
   Fixed 2026-09-14: Photo viewer lightbox is now a dialog (role/aria-modal/label, focus returns to the tile, Tab stays inside); data-photos videoId validated and escaped; CMS content applied without building selectors from keys, background urls quoted; Sunday times sentence has CMS hooks (site.times.sunday.main/.second).
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-youth.json)
   Rebuilt 2026-10-31 in the "House Lights Down" theme shared with the Media page
   (arise-sermons.js) and the Bible Search page (arise-bible.js): masthead with the
   banner under the title, the strap (01 Leaders / 02 Events / 03 Moments) that locks
   under the site header, one room on stage at a time, the red Come Hang Out call
   under the last cut. Moments leaves the running order while data-photos is empty.
   Every CMS key, attribute and link target is unchanged. Class prefix .ayo; ids ayo*.
   =========================================================================== */

const AYO_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';
const KERIK  = M + '1f9fa2_4fb0f121cb08443a8ca1f72286449c12~mv2.png';

const BANNER = M + 'c3b2d0_c1f923bf8bb745849bb220060de02a39~mv2.jpg';

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const PLAY_SVG = '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true"><path d="M14 8L0 16V0L14 8Z" fill="currentColor"/></svg>';

const AYO_CSS = `
arise-youth{display:block;width:100%}
.ayo *{box-sizing:border-box;margin:0;padding:0}
.ayo{
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
@media(min-width:900px){.ayo{--cut:48px;--foot:5px}}
.ayo [hidden]{display:none!important}
.ayo h1,.ayo h2,.ayo h3,.ayo p,.ayo button,.ayo img,.ayo iframe,.ayo dl,.ayo dt,.ayo dd{margin:0;padding:0;border:0}
.ayo img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.ayo iframe{display:block}
.ayo .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.ayo .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.ayo .g12{grid-template-columns:repeat(12,1fr)}}
.ayo h1,.ayo h2,.ayo h3,.ayo .folio{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.ayo h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.ayo .h2--xl{font-size:var(--h2)}
.ayo h3{font-size:var(--h3);color:#fff}
.ayo p{font-size:var(--body);line-height:1.6}
.ayo .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.ayo a{color:inherit}

/* ---- house devices ---- */
.ayo .mark{display:flex;align-items:center;margin-bottom:18px}
.ayo .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.ayo .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .ayo .mark{flex-wrap:nowrap;align-items:flex-start}
  .ayo .mark::before{margin-right:124px;margin-top:5px}
  .ayo .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.ayo .mark--l .kicker{color:var(--redL)}
.ayo .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.ayo .mark--w .kicker{color:#fff}
.ayo .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.ayo .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.ayo .strip--ghost{background:transparent;border:1.5px solid #fff}
.ayo .strip--ghost span{color:#fff}
.ayo .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.ayo .btn:hover{background:transparent;color:#fff;border-color:#fff}
.ayo .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.ayo .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.ayo .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.ayo .btn--dark:hover{background:var(--ink);color:#fff}
.ayo .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.ayo .btn--onRed:hover{background:transparent;color:#fff}
.ayo .btn[disabled]{opacity:.55;pointer-events:none}
.ayo a:focus-visible,.ayo button:focus-visible,.ayo input:focus-visible,.ayo select:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.ayo .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.ayo .folio--d{color:var(--red)}
.ayo .folio--w{color:#fff}
.ayo .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.ayo .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.ayo .ulink:hover::after,.ayo .ulink:focus-visible::after{width:100%}
.ayo .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.ayo .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.ayo .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.ayo .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.ayo .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.ayo .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.ayo .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.ayo .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.ayo .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.ayo .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.ayo .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.ayo .bg__wedge{position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);clip-path:polygon(0 0,100% 0,100% 100%);opacity:.9}
/* photo backdrop layers: two stacked images that crossfade; a small copy scaled up reads as a blur */
.ayo .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s var(--ease);background:transparent}
.ayo .ly.on{opacity:1}
.ayo .ly--soft{transform:scale(1.15)}
.ayo .bg__scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,8,.55) 0%,rgba(6,6,8,.78) 55%,var(--scrim) 100%)}

/* ---- masthead, and the banner band under the title ---- */
.ayo .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.ayo .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.ayo .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.ayo .mast__txt{min-width:0;flex:1 1 auto}
.ayo .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.ayo .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.ayo .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:ayoTick 36s linear infinite}
.ayo .mast__tick:hover div{animation-play-state:paused}
.ayo .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.ayo .mast{padding:44px 0 26px}.ayo .mast__tick{display:block}}
.ayo .banner{position:relative;background:var(--ink);padding:clamp(6px,1.5vw,14px) 0 clamp(24px,3.5vw,40px)}
.ayo .banner__in{position:relative;padding-top:clamp(18px,2.6vw,30px);border-top:1px solid var(--ruleD)}
.ayo .banner img{display:block;margin:0 auto;width:auto;max-width:min(760px,100%);height:auto;max-height:clamp(150px,26vw,280px);object-fit:contain;background:transparent}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.ayo .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.ayo .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.ayo .strap__spacer{height:0}
.ayo .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.ayo .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.ayo .strap__jump::-webkit-scrollbar{display:none}
.ayo .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.ayo .strap__j:first-child{border-left:0}
.ayo .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .ayo .strap__jump{overflow:visible;margin:0;padding:0}
  .ayo .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .ayo .strap__j i{font-size:12px}
}
.ayo .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.ayo .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.ayo .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.ayo .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.ayo .strap__j:focus-visible{outline-offset:-3px}
.ayo .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.ayo .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.ayo .strap__arrow:hover{background:rgba(255,255,255,.08)}
.ayo .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .ayo .strap__jump{overflow:visible;margin:0;padding:0}
  .ayo .strap__j{padding:0 20px}
  .ayo .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.ayo .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.ayo .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.ayo .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.ayo .panel:not(.is-active){visibility:hidden}
.ayo .deck.moving .panel{visibility:visible}
.ayo .panel.enter > .shell{animation:ayoRise .55s var(--ease) both}

/* ---- 01 leaders: the paper room ---- */
.ayo .leaders{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.ayo .leaders{padding:64px 0 calc(72px + var(--cut))}}
.ayo .leaders .bg{background:var(--bone)}
.ayo .leaders > .shell{position:relative;z-index:1}
.ayo .leaders h2,.ayo .leaders h3{color:var(--ink)}
.ayo .leaders .lede{color:var(--muted)}
.ayo .leaders__grid{align-items:center}
.ayo .people{display:grid;grid-template-columns:minmax(0,440px);gap:18px;margin-top:32px}
.ayo .p__c{background:var(--paper);border:1px solid var(--ruleL);border-top:3px solid var(--red);display:flex;flex-direction:column;min-width:0}
.ayo .p__ph{aspect-ratio:1944/2664;max-height:560px;overflow:hidden;background:var(--bone)}
.ayo .p__ph img{width:100%;height:100%;object-fit:contain;display:block;background:var(--bone)}
.ayo .p__b{padding:22px}
@media(min-width:900px){.ayo .p__b{padding:26px}}
.ayo .p__role{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:12px}
.ayo .p__c h3{font-size:clamp(22px,2.2vw,30px)}
@media(min-width:900px){
  .ayo .leaders__txt{grid-column:1/7}
  .ayo .leaders__card{grid-column:8/13}
  .ayo .people{margin-top:0}
}

/* ---- 02 events: the empty state until something is announced ---- */
.ayo .events{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.ayo .events{padding:64px 0 calc(72px + var(--cut))}}
.ayo .events .bg{background:var(--ink)}
.ayo .events > .shell{position:relative;z-index:1}
.ayo .events__grid{align-items:end}
.ayo .empty{margin-top:28px;background:var(--scrim);border:1px solid var(--ruleD);border-top:3px solid var(--red);padding:clamp(22px,3vw,36px)}
.ayo .empty h3{color:#fff;font-size:clamp(26px,3vw,40px)}
.ayo .empty p{margin-top:12px;color:rgba(255,255,255,.72);max-width:46ch;font-size:var(--body)}
@media(min-width:900px){
  .ayo .events__txt{grid-column:1/7}
  .ayo .events__box{grid-column:7/13}
  .ayo .empty{margin-top:0}
}

/* ---- 03 moments: the photo wall (fed by page code via data-photos) ---- */
.ayo .moments{position:relative;background:var(--scrim);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.ayo .moments{padding:64px 0 calc(72px + var(--cut))}}
.ayo .moments .bg{background:var(--scrim)}
.ayo .moments .ly.on{opacity:.16}
.ayo .moments > .shell{position:relative;z-index:1}
/* the wall: square tiles two columns wide, every fifth a 2:1 feature twice as wide, so the rows always
   line up (a feature is exactly as tall as a square). 2 / 4 / 6 columns at phone / tablet / desktop. */
.ayo .gal{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:32px}
@media(min-width:561px){.ayo .gal{grid-template-columns:repeat(4,1fr);gap:11px}}
@media(min-width:901px){.ayo .gal{grid-template-columns:repeat(6,1fr);gap:14px;margin-top:44px}}
.ayo .gal__t{position:relative;overflow:hidden;background:var(--ink);border:0;padding:0;cursor:pointer;display:block;grid-column:span 1;aspect-ratio:1/1;
  -webkit-tap-highlight-color:transparent;font:inherit;color:#fff}
.ayo .gal__t:nth-child(5n+1){grid-column:span 2;aspect-ratio:2/1}
@media(min-width:561px){
  .ayo .gal__t{grid-column:span 2}
  .ayo .gal__t:nth-child(5n+1){grid-column:span 4}
}
.ayo .gal__t img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.8);transition:transform .55s var(--ease),filter .3s}
.ayo .gal__t::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(6,6,8,.6) 100%);pointer-events:none;z-index:1}
.ayo .gal__t::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.ayo .gal__t:hover::after,.ayo .gal__t:focus-visible::after{transform:scaleX(1)}
.ayo .gal__t:hover img{transform:scale(1.06);filter:saturate(1)}
.ayo .gal__t:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.ayo .gal__i{position:absolute;top:8px;left:12px;z-index:2;font-family:'Anton',Impact,sans-serif;font-size:28px;line-height:1;color:var(--redL);text-transform:uppercase;letter-spacing:.02em}
@media(min-width:900px){.ayo .gal__i{font-size:36px;top:10px;left:14px}}
/* video tiles get a play badge so they read as playable */
.ayo .gal__v{position:absolute;right:12px;bottom:14px;z-index:2;width:38px;height:38px;background:var(--red);display:flex;align-items:center;justify-content:center;color:#fff;pointer-events:none}
.ayo .gal__v svg{width:12px;height:14px}
.ayo .gal__n{margin-top:28px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.55)}

/* ---- the call: the red curtain the last room's cut lands on ---- */
.ayo .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.ayo .cta{padding:calc(64px + var(--cut)) 0 80px}}
.ayo .cta h2{color:#fff}
.ayo .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.ayo .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.ayo .cta__line:first-child{border-top:0;padding-top:0}
.ayo .cta__time{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:.02em;
  white-space:nowrap;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.ayo .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.ayo .cta a:focus-visible,.ayo .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .ayo .cta__txt{grid-column:1/8}
  .ayo .cta__p{font-size:19px;max-width:none}
  .ayo .cta__line{padding:18px 0}
  .ayo .cta__time{font-size:30px}
  .ayo .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- the photo viewer (mounted on body, so not under .ayo) ---- */
.ayo-lb{position:fixed;inset:0;z-index:2147482000;display:none;background:rgba(6,6,8,.94);color-scheme:light only}
.ayo-lb[data-open="true"]{display:flex;align-items:center;justify-content:center}
.ayo-lb img,.ayo-lb video{max-width:92vw;max-height:82vh;object-fit:contain;display:block;box-shadow:0 20px 60px rgba(0,0,0,.6);background:#000}
.ayo-lb video{width:auto}
.ayo-lb button{position:absolute;background:transparent;border:1px solid rgba(255,255,255,.30);color:#fff;cursor:pointer;font-family:'Oswald',Helvetica,Arial,sans-serif;line-height:1}
.ayo-lb__x{top:20px;right:20px;width:46px;height:46px;font-size:22px}
.ayo-lb__p,.ayo-lb__n{top:50%;transform:translateY(-50%);width:52px;height:64px;font-size:24px}
.ayo-lb__p{left:16px}
.ayo-lb__n{right:16px}
.ayo-lb button:hover{background:#D6222D;border-color:#D6222D}
.ayo-lb__c{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:14px;color:rgba(255,255,255,.86);padding:0 20px}
.ayo-lb__i{position:absolute;top:26px;left:24px;font-family:'Oswald',Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:.2em;color:rgba(255,255,255,.6)}
.ayo-lb button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}

/* ---- motion ---- */
@keyframes ayoTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes ayoRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .ayo *,.ayo *::before,.ayo *::after{animation:none!important;transition:none!important}
  .ayo .mast__tick div{animation:none;width:100%}
  .ayo .mast__tick span:last-child{display:none}
  .ayo .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .ayo .deck,.ayo .deck__track{transition:none}
  .ayo .panel.enter > .shell{animation:none}
  .ayo-lb *{transition:none!important}
}
`;

function ayoEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function ayoPad(n) { return (n < 10 ? '0' : '') + n; }

/* Arise Church speed: ask Wix for a resized copy (longest side <= w, AVIF/WebP per browser).
   Anything that is not a plain static.wixstatic.com media URL is returned unchanged. */
function ayoImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('ayo-youth-fonts') &&
      !document.querySelector('link[href="' + AYO_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'ayo-youth-fonts'; l.rel = 'stylesheet'; l.href = AYO_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('ayo-youth-css')) {
    const s = document.createElement('style');
    s.id = 'ayo-youth-css'; s.innerHTML = AYO_CSS;
    document.head.appendChild(s);
  }
}

/* Two stacked backdrop images that crossfade (as on the Media page). */
function ayoLayers(cls, eager) {
  const attrs = ' alt="" width="480" height="360" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"');
  return '<img class="ly ' + cls + '"' + attrs + '><img class="ly ' + cls + '"' + attrs + '>';
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Leaders', 'ayoLeaders'], ['02', 'Events', 'ayoEvents'], ['03', 'Moments', 'ayoMoments']];

class AriseYouth extends HTMLElement {
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
    this.classList.add('ayo');

    this.innerHTML =
      /* masthead: the page title; on desktop the red ticker */
      '<header class="mast" id="ayoMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="youth.hero.kicker">6th to 12th Grade</span></div>' +
          '<h1 data-ck="youth.hero.heading">Youth Ministry</h1>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="ayoTickA"></span><span id="ayoTickB"></span></div></div>' +
      '</div></header>' +

      /* the banner: the wide photo under the page title, whole and uncropped on the ink */
      '<div class="banner"><div class="shell"><div class="banner__in">' +
        '<img data-ci="youth.banner.image" data-ciw="1600" src="' + ayoImg(BANNER, 1600) + '" fetchpriority="high" alt="Arise Church Youth Ministry">' +
      '</div></div></div>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="ayoStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Youth Ministry page" id="ayoTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="ayoTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="ayoStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="ayoDeck"><div class="deck__track" id="ayoTrack">' +

      /* 01 -- leaders: the paper room */
      '<section class="panel leaders is-active" id="ayoLeaders" role="tabpanel" aria-labelledby="ayoTab-ayoLeaders">' +
        '<div class="bg bg--lh" aria-hidden="true"></div>' +
        '<div class="shell g12 leaders__grid">' +
          '<div class="leaders__txt">' +
            '<div class="folio folio--d" aria-hidden="true">01</div>' +
            '<div class="mark"><span class="kicker" data-ck="youth.leaders.kicker">Our Leaders</span></div>' +
            '<h2 data-ck="youth.leaders.heading">Our Leaders</h2>' +
          '</div>' +
          '<div class="leaders__card"><div class="people">' +
            '<article class="p__c">' +
              '<div class="p__ph"><img data-ci="youth.leaders.photo" data-ciw="1200" src="' + ayoImg(KERIK, 1200) + '" width="1944" height="2664" ' +
                'loading="lazy" decoding="async" alt="Chad and Tabitha Kerik"></div>' +
              '<div class="p__b">' +
                '<span class="p__role" data-ck="youth.leaders.role">Youth Ministers</span>' +
                '<h3 data-ck="youth.leaders.name">Chad and Tabitha Kerik</h3>' +
              '</div>' +
            '</article>' +
          '</div></div>' +
        '</div>' +
      '</section>' +

      /* 02 -- events: a dark room with the empty state */
      '<section class="panel events" id="ayoEvents" role="tabpanel" aria-labelledby="ayoTab-ayoEvents">' +
        '<div class="bg bg--rh" aria-hidden="true"><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell g12 events__grid">' +
          '<div class="events__txt">' +
            '<div class="folio" aria-hidden="true">02</div>' +
            '<div class="mark mark--l"><span class="kicker" data-ck="youth.events.kicker">Youth Events</span></div>' +
            '<h2 data-ck="youth.events.heading">Youth Events</h2>' +
          '</div>' +
          '<div class="events__box"><div class="empty">' +
            '<h3 data-ck="youth.events.emptyHeading">Nothing listed yet</h3>' +
            '<p data-ck="youth.events.emptyBody">Youth events will appear here as they are announced.</p>' +
          '</div></div>' +
        '</div>' +
      '</section>' +

      /* 03 -- moments: the photo wall; hidden with its tab until data-photos arrives */
      '<section class="panel moments" id="ayoMoments" role="tabpanel" aria-labelledby="ayoTab-ayoMoments">' +
        '<div class="bg bg--lh" aria-hidden="true" id="ayoMomentsBg">' + ayoLayers('ly--soft', false) + '<div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">03</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="youth.moments.kicker">Moments</span></div>' +
          '<h2 data-ck="youth.moments.heading">Youth Life</h2>' +
          '<div class="gal-mount" data-cms-source="Portfolio"></div>' +
        '</div>' +
      '</section>' +

      '</div></div>' +

      /* the call: below the deck, above the footer, always */
      '<section class="cta" id="ayoCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true" id="ayoCtaFolio">04</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="youth.cta.kicker">Get Involved</span></div>' +
          '<h2 class="h2--xl" data-ck="youth.cta.heading">Come Hang Out</h2>' +
          /* one line per campus: the time in Anton, then where it is (the shared site.times keys, as on the Media and Bible pages) */
          '<p class="cta__p">' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.main">Sunday 10:30 AM</span> ' +
              '<span data-ck="youth.cta.campus1">in Pineville,</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.second">Sunday 10:00 AM</span> ' +
              '<span data-ck="youth.cta.campus2">in Alexandria.</span></span>' +
          '</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/contact" target="_top" data-ck="youth.cta.button">Plan Your Visit</a>' +
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
    const txt = function (k) { const el = self.querySelector('[data-ck="' + k + '"]'); return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : ''; };
    const parts = [txt('youth.hero.heading'), txt('youth.hero.kicker'), txt('youth.leaders.heading'), txt('youth.moments.heading'),
      txt('youth.cta.kicker'), txt('youth.cta.heading'), 'Arise Church'].filter(Boolean);
    const tick = parts.join(' \u00b7 ') + ' \u00b7 ';
    const a = this.querySelector('#ayoTickA'), b = this.querySelector('#ayoTickB');
    if (a && b && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }

  /* ---- moments: the photo wall from data-photos ---- */
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
    const panel = this.querySelector('#ayoMoments');
    const tab = this.querySelector('.strap__j[data-to="ayoMoments"]');
    if (!mount || !panel) return;
    const pics = this.galPhotos();
    this._pics = pics;

    /* Nothing uploaded yet -- the room and its tab leave the running order, not an empty frame. */
    if (!pics.length) {
      if (this._galKey !== '') { mount.innerHTML = ''; this._galKey = ''; }
      panel.hidden = true; if (tab) tab.hidden = true;
      this.setLayers('ayoMomentsBg', '');
      this.renumber();
      if (this._deck) { if (this._active === 'ayoMoments') this._active = 'ayoLeaders'; this.applyDeck(false); }
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
              'aria-label="Open ' + (isVid ? 'video' : 'photo') + ' ' + (i + 1) + ' of ' + pics.length + (p.alt ? ': ' + ayoEsc(p.alt) : '') + '">' +
              '<img src="' + ayoEsc(ayoImg(p.src, 1200)) + '" alt="' + ayoEsc(p.alt) + '" width="800" height="800" loading="lazy" decoding="async">' +
              '<span class="gal__i" aria-hidden="true">' + ayoPad(i + 1) + '</span>' +
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
    this.setLayers('ayoMomentsBg', first ? ayoImg(first.src, 480) : '');
    if (this._deck && (wasHidden || this._active === 'ayoMoments')) this.applyDeck(false);
    this.fitDeck();
  }

  /* Folios and tab numerals follow the rooms that are actually in the running order. */
  renumber() {
    const self = this;
    let n = 0;
    this.querySelectorAll('#ayoTrack > .panel').forEach(function (p) {
      if (p.hidden) return;
      n++;
      const f = p.querySelector('.folio'); if (f) f.textContent = ayoPad(n);
      const t = self.querySelector('.strap__j[data-to="' + p.id + '"] i'); if (t) t.textContent = ayoPad(n);
    });
    const cf = this.querySelector('#ayoCtaFolio'); if (cf) cf.textContent = ayoPad(n + 1);
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
      lb.className = 'ayo-lb';
      lb.setAttribute('data-open', 'false');
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Photo viewer');
      lb.innerHTML =
        '<div class="ayo-lb__i"></div>' +
        '<button type="button" class="ayo-lb__x" aria-label="Close">&times;</button>' +
        '<button type="button" class="ayo-lb__p" aria-label="Previous">&#8249;</button>' +
        '<div class="ayo-lb__stage"></div>' +
        '<button type="button" class="ayo-lb__n" aria-label="Next">&#8250;</button>' +
        '<div class="ayo-lb__c"></div>';
      document.body.appendChild(lb);
      this._lb = lb;

      const stage = lb.querySelector('.ayo-lb__stage');
      const cap = lb.querySelector('.ayo-lb__c');
      const idx = lb.querySelector('.ayo-lb__i');

      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + ayoEsc(p.videoId) + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + ayoEsc(p.video) + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + ayoEsc(ayoImg(p.src, 2000)) + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + ayoEsc(ayoImg(p.src, 2000)) + '" alt="' + ayoEsc(p.alt || '') + '">';
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
      lb.querySelector('.ayo-lb__x').addEventListener('click', this._close);
      lb.querySelector('.ayo-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.ayo-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
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
        self._lb.querySelector('.ayo-lb__x').focus();
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
    const tabs = this.querySelector('#ayoTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
    /* an image that never arrives leaves the ink backdrop, not a broken icon */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG' && img.classList.contains('ly')) { img.style.opacity = '0'; img.classList.remove('on'); }
    }, true);
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#ayoTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#ayoDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'ayoLeaders';
    let sx = 0, sy = 0, sid = null, swiping = false;
    deck.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' || (ev.target.closest && ev.target.closest('input, select, audio, a, button'))) { sid = null; return; }
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
      this.querySelectorAll('#ayoTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#ayoDeck');
    const active = this.querySelector('#ayoTrack > .panel.is-active');
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
      const strap = this.querySelector('#ayoStrap');
      const deck = this.querySelector('#ayoDeck');
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
      if (byUser) { const t = this.querySelector('#ayoTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#ayoTrack');
    const deck = this.querySelector('#ayoDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'ayoLeaders';
    this.querySelectorAll('#ayoTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#ayoTabs .strap__j').forEach(function (t) {
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
    const strap = this.querySelector('#ayoStrap');
    const spacer = this.querySelector('#ayoStrapSpacer');
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
        const w = Number(el.getAttribute('data-ciw')) || 1600;
        if (el.tagName === 'IMG') el.src = ayoImg(v.image, w);
        else el.style.backgroundImage = 'url("' + String(ayoImg(v.image, w)).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-youth', AriseYouth);
