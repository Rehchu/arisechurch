/* ===========================================================================
   ARISE CHURCH -- CREATIVE ARTS
   File: public/custom-elements/arise-creatives.js
   Tag:  arise-creatives
   Fixed 2026-09-14: Anton 18px floor (h3, tile badge + switcher now Oswald labels); case-insensitive member/department match; applyContent no longer builds selectors from keys
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-creatives.json)
   Rebuilt 2026-10-31 in the "House Lights Down" theme shared with the Media page
   (arise-sermons.js) and the Bible Search page (arise-bible.js): masthead, the strap
   that locks under the site header, one room on stage at a time, the red call under
   the last cut. Every CMS key, attribute and link target is unchanged. Class prefix
   .acr; ids acr*.

   ONE file, every page in the section.

     No attribute        -> the Arise Creative Arts hub
                            01 Departments (the tile wall) / 02 The Team (everyone,
                            grouped by department) / 03 Serve (the call)
     data-dept="sound"   -> that department's own page
                            01 The Team (its people) / 02 Other Teams (the wall,
                            this department marked) / 03 Join (the call)

   Both modes share one DOM: the mode re-orders the same three rooms and un-hides
   its own masthead and call words (both sets of Page Content keys are always
   present, one set hidden), so changing data-dept never rebuilds the element.
   The call is ONE block (#acrCta, the red curtain under the deck); when the
   03 tab is chosen it is moved onto the stage, and moved back after.

   Both are fed from the CMS, so adding a person or a department is a
   dashboard edit.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-creatives.js
      -> paste this whole file
   2. On EACH page: Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-creatives.js
      Tag Name: arise-creatives
      STRETCH IT FULL WIDTH.
   3. On a department page, add a custom attribute in the element settings:
        name: data-dept    value: the department's slug (praise-worship, sound...)
      Leave it off on the hub page.
   4. Add the backend function and page code -- see CREATIVES-SETUP.md
   5. Save, then PUBLISH.

   With no CMS data it shows a quiet placeholder rather than a broken page.
   =========================================================================== */

const ACR_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';

const ACR_CSS = `
arise-creatives{display:block;width:100%}
.acr *{box-sizing:border-box;margin:0;padding:0}
.acr{
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
@media(min-width:900px){.acr{--cut:48px;--foot:5px}}
.acr [hidden]{display:none!important}
.acr h1,.acr h2,.acr h3,.acr p,.acr button,.acr img,.acr iframe,.acr dl,.acr dt,.acr dd,.acr figure{margin:0;padding:0;border:0}
.acr img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.acr iframe{display:block}
.acr .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.acr .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.acr .g12{grid-template-columns:repeat(12,1fr)}}
.acr h1,.acr h2,.acr h3,.acr .folio,.acr .cnt b,.acr .d__i,.acr .mb__n,.acr .mb__init,.acr .grp__i{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.acr h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.acr .h2--xl{font-size:var(--h2)}
.acr h3{font-size:var(--h3);color:#fff}
.acr p{font-size:var(--body);line-height:1.6}
.acr .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.acr a{color:inherit}

/* ---- house devices ---- */
.acr .mark{display:flex;align-items:center;margin-bottom:18px}
.acr .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.acr .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .acr .mark{flex-wrap:nowrap;align-items:flex-start}
  .acr .mark::before{margin-right:124px;margin-top:5px}
  .acr .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.acr .mark--l .kicker{color:var(--redL)}
.acr .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.acr .mark--w .kicker{color:#fff}
.acr .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.acr .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.acr .strip--ghost{background:transparent;border:1.5px solid #fff}
.acr .strip--ghost span{color:#fff}
.acr .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.acr .btn:hover{background:transparent;color:#fff;border-color:#fff}
.acr .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.acr .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.acr .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.acr .btn--dark:hover{background:var(--ink);color:#fff}
.acr .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.acr .btn--onRed:hover{background:transparent;color:#fff}
.acr .btn[disabled]{opacity:.55;pointer-events:none}
.acr a:focus-visible,.acr button:focus-visible,.acr input:focus-visible,.acr select:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.acr .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.acr .folio--d{color:var(--red)}
.acr .folio--w{color:#fff}
.acr .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.acr .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.acr .ulink:hover::after,.acr .ulink:focus-visible::after{width:100%}
.acr .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.acr .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.acr .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.acr .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.acr .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.acr .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.acr .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.acr .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.acr .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.acr .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.acr .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.acr .bg__wedge{position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);clip-path:polygon(0 0,100% 0,100% 100%);opacity:.9}
@media(max-width:620px){.acr .bg__wedge{width:120px;height:84px}}
.acr .bg__scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,6,8,.55) 0%,rgba(6,6,8,.78) 55%,var(--scrim) 100%)}

/* ---- masthead ---- */
.acr .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.acr .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.acr .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.acr .mast__txt{min-width:0;flex:1 1 auto}
.acr .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.acr .mast .lede{margin-top:22px}
.acr .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.acr .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:acrTick 36s linear infinite}
.acr .mast__tick:hover div{animation-play-state:paused}
.acr .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.acr .mast{padding:44px 0 26px}.acr .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.acr .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.acr .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.acr .strap__spacer{height:0}
.acr .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.acr .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.acr .strap__jump::-webkit-scrollbar{display:none}
.acr .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.acr .strap__j:first-child{border-left:0}
.acr .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .acr .strap__jump{overflow:visible;margin:0;padding:0}
  .acr .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .acr .strap__j i{font-size:12px}
}
.acr .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.acr .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.acr .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.acr .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.acr .strap__j:focus-visible{outline-offset:-3px}
.acr .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.acr .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.acr .strap__arrow:hover{background:rgba(255,255,255,.08)}
.acr .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .acr .strap__jump{overflow:visible;margin:0;padding:0}
  .acr .strap__j{padding:0 20px}
  .acr .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.acr .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.acr .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.acr .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.acr .panel:not(.is-active){visibility:hidden}
.acr .deck.moving .panel{visibility:visible}
.acr .panel.enter > .shell{animation:acrRise .55s var(--ease) both}

/* ---- departments: the tile wall (hub: every department; department page: the other teams) ---- */
.acr .depts{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.acr .depts{padding:56px 0 calc(56px + var(--cut))}}
.acr .depts .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.acr .depts > .shell{position:relative;z-index:1}
.acr .depts__hd{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.acr .depts__hd .mark{margin-bottom:14px}
@media(max-width:999px){.acr .depts__hd{flex-direction:column;align-items:flex-start}}
.acr .cnt{display:block;flex:0 0 auto}
.acr .cnt b{display:block;font-size:var(--fig);color:var(--red);line-height:.9}
.acr .cnt small{display:block;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:8px}
.acr .wall{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:28px}
@media(min-width:700px){.acr .wall{grid-template-columns:repeat(3,1fr);gap:14px}}
@media(min-width:900px){.acr .wall{gap:18px;margin-top:40px}}
.acr .d{position:relative;display:block;text-decoration:none;background:var(--ink);overflow:hidden;aspect-ratio:4/5;color:#fff;
  -webkit-tap-highlight-color:transparent;border:1px solid var(--ruleD)}
.acr .d img{width:100%;height:100%;object-fit:cover;filter:grayscale(.28) brightness(.62);transition:transform .5s var(--ease),filter .35s}
.acr .d:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.8)}
.acr .d__i{position:absolute;top:8px;left:12px;z-index:1;font-size:40px;line-height:1;color:var(--redL)}
.acr .d__t{position:absolute;left:0;right:0;bottom:0;padding:48px 14px 14px;z-index:1;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.72) 42%,rgba(6,6,8,.97) 100%)}
.acr .d--ink .d__t{background:none}
.acr .d__t h3{color:#fff;font-size:17px;letter-spacing:.04em;line-height:1.05}
.acr .d__t span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.86);margin-top:6px;font-weight:500}
.acr .d::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.acr .d:hover::after,.acr .d:focus-visible::after,.acr .d--here::after{transform:scaleX(1)}
.acr .d--here{border-color:var(--red)}
.acr .d--here .d__i{color:#fff;background:var(--red);padding:0 6px}
.acr .d__here{position:absolute;top:12px;right:12px;z-index:2;background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.14em;
  text-transform:uppercase;padding:5px 11px;font-family:'Oswald',Helvetica,Arial,sans-serif}
@media(min-width:900px){
  .acr .d__i{top:10px;left:14px;font-size:56px}
  .acr .d__t{padding:64px 18px 18px}
  .acr .d__t h3{font-size:24px}
  .acr .d__here{top:18px;right:18px}
}
.acr .empty{margin-top:28px;border:1.5px dashed rgba(255,255,255,.3);padding:40px 24px;text-align:center}
.acr .empty h3{color:rgba(255,255,255,.72);margin-bottom:12px}
.acr .empty p{color:rgba(255,255,255,.62);max-width:48ch;margin:0 auto}
@media(min-width:900px){.acr .empty{margin-top:40px;padding:56px 32px}}

/* ---- the team: the paper room ---- */
.acr .team{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.acr .team{padding:64px 0 calc(72px + var(--cut))}}
.acr .team .bg{background:var(--bone)}
.acr .team > .shell{position:relative;z-index:1}
.acr .team h2,.acr .team h3{color:var(--ink)}
.acr .team .lede{color:var(--muted)}
.acr .team .empty{border-color:rgba(10,10,12,.25)}
.acr .team .empty h3{color:var(--muted)}
.acr .team .empty p{color:var(--muted)}
.acr .team__ph{margin-top:32px;border-top:3px solid var(--red);background:var(--ink)}
.acr .team__ph img{width:100%;height:auto;max-height:640px;object-fit:cover}
@media(min-width:900px){.acr .team__ph{margin-top:44px}}
.acr .grp{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 16px;margin-top:40px;padding-bottom:12px;border-bottom:1px solid var(--ruleL)}
.acr .grp:first-child{margin-top:32px}
@media(min-width:900px){.acr .grp{margin-top:56px}.acr .grp:first-child{margin-top:44px}}
.acr .grp__i{font-size:22px;color:var(--red);line-height:1}
.acr .grp h3{font-size:clamp(22px,2.4vw,32px)}
.acr .grp__n{font-size:12px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-left:auto}
.acr .people{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:18px}
@media(min-width:700px){.acr .people{grid-template-columns:repeat(3,1fr);gap:18px}}
@media(min-width:1000px){.acr .people{grid-template-columns:repeat(4,1fr);gap:22px;margin-top:24px}}
.acr .mb{background:var(--paper);border:1px solid var(--ruleL);border-top:3px solid var(--red);display:flex;flex-direction:column;min-width:0}
.acr .mb__ph{aspect-ratio:4/5;overflow:hidden;background:var(--ink)}
.acr .mb__ph img{width:100%;height:100%;object-fit:cover;object-position:50% 20%}
.acr .mb__init{aspect-ratio:1/1;background:var(--ink);display:flex;align-items:center;justify-content:center;font-size:clamp(40px,6vw,64px);color:var(--redL)}
.acr .mb--lead .mb__init{color:#fff}
.acr .mb__b{padding:14px 14px 16px;display:flex;flex-direction:column;align-items:flex-start;flex:1 1 auto}
@media(min-width:900px){.acr .mb__b{padding:18px 18px 20px}}
.acr .mb__r{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:10px}
.acr .mb__n{font-size:clamp(18px,1.9vw,24px);color:var(--ink);overflow-wrap:anywhere}
.acr .mb__bio{font-size:15px;color:var(--muted);line-height:1.6;margin-top:10px}

/* ---- serve / join: the call, on stage ---- */
.acr .serve{position:relative;background:var(--red)}
.acr .serve > .cta{margin-top:0}

/* ---- the call: the red curtain the last room's cut lands on ---- */
.acr .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.acr .cta{padding:calc(64px + var(--cut)) 0 80px}}
.acr .cta h2{color:#fff}
.acr .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.acr .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.acr .cta a:focus-visible,.acr .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .acr .cta__txt{grid-column:1/8}
  .acr .cta__p{font-size:19px;max-width:none}
  .acr .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- motion ---- */
@keyframes acrTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes acrRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .acr *,.acr *::before,.acr *::after{animation:none!important;transition:none!important}
  .acr .mast__tick div{animation:none;width:100%}
  .acr .mast__tick span:last-child{display:none}
  .acr .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .acr .deck,.acr .deck__track{transition:none}
  .acr .panel.enter > .shell{animation:none}
}
`;

function acrEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function acrPad(n) { return (n < 10 ? '0' : '') + n; }

/* Arise Church speed: ask Wix for a resized copy (longest side at most w, format picked per browser). */
function acrImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

/* A CMS image field may arrive as wix:image://v1/<file>/<name>#...; the CDN wants the file alone. */
function acrSrc(u) {
  u = String(u || '').trim();
  var m = u.match(/^wix:image:\/\/v1\/([^\/#?]+)/i);
  return m ? 'https://static.wixstatic.com/media/' + m[1] : u;
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return parts.slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
}

function injectHead() {
  if (!document.getElementById('acr-creatives-fonts') && !document.querySelector('link[href="' + ACR_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'acr-creatives-fonts'; l.rel = 'stylesheet'; l.href = ACR_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('acr-creatives-css')) {
    const s = document.createElement('style');
    s.id = 'acr-creatives-css'; s.innerHTML = ACR_CSS;
    document.head.appendChild(s);
  }
}

/* The running order per mode: tab label and the room (panel) it shows. The numerals follow the order. */
const ORDER = {
  hub:  [['Departments', 'acrDepts'], ['The Team', 'acrTeam'], ['Serve', 'acrServe']],
  dept: [['The Team', 'acrTeam'], ['Other Teams', 'acrDepts'], ['Join', 'acrServe']]
};

class AriseCreatives extends HTMLElement {
  static get observedAttributes() { return ['data-depts', 'data-members', 'data-dept', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.layout();
  }

  connectedCallback() {
    if (this._b) return;
    this._b = true;
    injectHead();
    this.classList.add('acr');

    this.innerHTML =
      /* masthead: the page title (the hub's, or the department's name); on desktop the red ticker */
      '<header class="mast" id="acrMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l" data-mode="hub"><span class="kicker" data-ck="creatives.hero.kicker">Arise Church</span></div>' +
          '<div class="mark mark--l" data-mode="dept" hidden><span class="kicker" data-ck="creatives.dept.hero.kicker">Arise Creative Arts</span></div>' +
          '<h1><span data-ck="creatives.hero.heading" data-mode="hub">Arise<br>Creative Arts</span>' +
            '<span id="acrDeptName" data-cms-source="CreativeDepartments" data-mode="dept" hidden></span></h1>' +
          '<p class="lede" data-ck="creatives.hero.body" data-mode="hub">Every song, every screen, every sound. Creative Arts is the group of ' +
          'teams that serve together to make Sunday happen - each one its own department, ' +
          'all of them one department.</p>' +
          '<p class="lede" id="acrDeptLede" data-cms-source="CreativeDepartments" data-mode="dept" hidden></p>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="acrTickA"></span><span id="acrTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs (filled by layout(), which knows the mode) */
      '<div class="strap" id="acrStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Creative Arts page" id="acrTabs"></div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="acrStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time (layout() orders the rooms for the mode) */
      '<div class="deck" id="acrDeck"><div class="deck__track" id="acrTrack">' +

      /* departments: the tile wall */
      '<section class="panel depts is-active" id="acrDepts" role="tabpanel" aria-labelledby="acrTab-acrDepts">' +
        '<div class="bg bg--lh" aria-hidden="true"><div class="bg__page"></div><div class="bg__wedge"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">01</div>' +
          '<div class="depts__hd">' +
            '<div class="depts__txt">' +
              '<div data-mode="hub">' +
                '<div class="mark mark--l"><span class="kicker" data-ck="creatives.depts.kicker">The Departments</span></div>' +
                '<h2 data-ck="creatives.depts.heading">Who Does What</h2>' +
              '</div>' +
              '<div data-mode="dept" hidden>' +
                '<div class="mark mark--l"><span class="kicker" data-ck="creatives.dept.others.kicker">The Other Teams</span></div>' +
                '<h2 data-ck="creatives.dept.others.heading">Creative Arts</h2>' +
              '</div>' +
            '</div>' +
            '<div class="cnt" id="acrCount" aria-hidden="true" hidden></div>' +
          '</div>' +
          '<div id="acrWall" data-cms-source="CreativeDepartments"></div>' +
          '<div class="empty" id="acrDeptsEmpty" hidden><h3 data-ck="creatives.empty.heading">Departments coming soon</h3>' +
            '<p data-ck="creatives.empty.body">The teams that make Sunday happen will be listed here.</p></div>' +
        '</div>' +
      '</section>' +

      /* the team: the paper room (hub: everyone by department; department page: its own people) */
      '<section class="panel team" id="acrTeam" role="tabpanel" aria-labelledby="acrTab-acrTeam">' +
        '<div class="bg bg--rh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">02</div>' +
          '<div class="mark"><span class="kicker" data-ck="creatives.dept.team.kicker">The Team</span></div>' +
          '<h2 data-ck="creatives.dept.team.heading">Who Serves Here</h2>' +
          '<div id="acrTeamPh" data-cms-source="CreativeDepartments"></div>' +
          '<div id="acrPeople" data-cms-source="CreativeMembers"></div>' +
          '<div class="empty" id="acrTeamEmpty" hidden><h3 data-ck="creatives.dept.empty.heading">Team coming soon</h3>' +
            '<p data-ck="creatives.dept.empty.body">Photos and bios for this department are on the way.</p></div>' +
        '</div>' +
      '</section>' +

      /* serve / join: the call takes the stage (the #acrCta block is moved in here when this tab is chosen) */
      '<section class="panel serve" id="acrServe" role="tabpanel" aria-labelledby="acrTab-acrServe"></section>' +

      '</div></div>' +

      /* the call: below the deck, above the footer, at rest */
      '<div id="acrCtaHome">' +
      '<section class="cta" id="acrCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true" id="acrCtaFolio">03</div>' +
          '<div data-mode="hub">' +
            '<div class="mark mark--w"><span class="kicker" data-ck="creatives.cta.kicker">Get Involved</span></div>' +
            '<h2 class="h2--xl" data-ck="creatives.cta.heading">There\'s Room<br>For You</h2>' +
            '<p class="cta__p" data-ck="creatives.cta.body">If you sing, play, run sound, shoot, edit, or post - we could use you.</p>' +
          '</div>' +
          '<div data-mode="dept" hidden>' +
            '<div class="mark mark--w"><span class="kicker" data-ck="creatives.dept.cta.kicker">Serve With Us</span></div>' +
            '<h2 class="h2--xl" data-ck="creatives.dept.cta.heading">Join This Team</h2>' +
            '<p class="cta__p" data-ck="creatives.dept.cta.body">No experience needed - just a willingness to show up.</p>' +
          '</div>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/serve" target="_top" data-ck="creatives.cta.button" data-mode="hub">Sign Up to Serve</a>' +
        '<a class="btn btn--onRed cta__btn" href="/serve" target="_top" data-ck="creatives.dept.cta.button" data-mode="dept" hidden>Sign Up to Serve</a>' +
      '</div></section>' +
      '</div>';

    this.applyContent();
    this.bindChrome();
    this.layout();
    this.initDeck();
    this.initPin();
  }

  parse(attr) {
    const raw = this.getAttribute(attr);
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d : [];
    } catch (e) {
      console.error('arise-creatives: bad ' + attr + ' JSON', e);
      return [];
    }
  }

  /* ---- the mode, the running order, and every list on the page ---- */
  layout() {
    const E = acrEsc;
    const self = this;
    const slug = String(this.getAttribute('data-dept') || '').trim();
    const mode = slug ? 'dept' : 'hub';
    const depts = this.parse('data-depts');
    const members = this.parse('data-members');
    const key = function (s) { return String(s || '').trim().toLowerCase(); };
    const dept = slug ? (depts.filter(function (d) { return key(d.slug) === key(slug); })[0] || { name: slug, slug: slug }) : null;

    /* the mode: which words show, and the order the rooms play in */
    if (this._mode !== mode) {
      this._mode = mode;
      this.querySelectorAll('[data-mode]').forEach(function (el) { el.hidden = el.getAttribute('data-mode') !== mode; });
      const track = this.querySelector('#acrTrack');
      const order = ORDER[mode];
      order.forEach(function (j) { const p = self.querySelector('#' + j[1]); if (p && track) track.appendChild(p); });
      const tabs = this.querySelector('#acrTabs');
      if (tabs) {
        tabs.innerHTML = order.map(function (j, i) {
          return '<button type="button" class="strap__j" role="tab" id="acrTab-' + j[1] + '" aria-controls="' + j[1] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
            '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[1] + '"><i aria-hidden="true">' + acrPad(i + 1) + '</i>' + E(j[0]) + '</button>';
        }).join('');
      }
      this.renumber();
      this._active = order[0][1];
      if (this._deck) this.applyDeck(false); else this.placeCall();
    }

    /* the masthead words a department page takes from its CMS row */
    if (dept) {
      const nm = this.querySelector('#acrDeptName');
      const ld = this.querySelector('#acrDeptLede');
      const name = String(dept.name || slug);
      if (nm && nm.textContent !== name) nm.textContent = name;
      const lede = String(dept.description || dept.tagline || '');
      if (ld) { if (ld.textContent !== lede) ld.textContent = lede; ld.hidden = !lede; }
    }

    /* the tile wall: every department, this one marked on its own page */
    const wall = this.querySelector('#acrWall');
    const wallEmpty = this.querySelector('#acrDeptsEmpty');
    const cnt = this.querySelector('#acrCount');
    const wk = mode + '|' + slug + '|' + depts.map(function (d) { return [d.name, d.slug, d.tagline, d.groupPhoto, d.pageLink].join('~'); }).join(',');
    if (wall && this._wallKey !== wk) {
      this._wallKey = wk;
      wall.innerHTML = depts.length
        ? '<div class="wall">' + depts.map(function (d, i) {
            const photo = acrSrc(d.groupPhoto);
            const here = !!dept && key(d.slug) === key(slug);
            const inner =
              (photo ? '<img src="' + E(acrImg(photo, 800)) + '" alt="" width="800" height="1000"' + (i >= 3 ? ' loading="lazy" decoding="async"' : '') + '>' : '') +
              '<span class="d__i" aria-hidden="true">' + acrPad(i + 1) + '</span>' +
              (here ? '<span class="d__here">This Page</span>' : '') +
              '<span class="d__t"><h3>' + E(d.name) + '</h3>' + (d.tagline ? '<span>' + E(d.tagline) + '</span>' : '') + '</span>';
            const cls = 'd' + (photo ? '' : ' d--ink') + (here ? ' d--here' : '');
            if (here) return '<span class="' + cls + '" aria-current="page">' + inner + '</span>';
            return d.pageLink
              ? '<a class="' + cls + '" href="' + E(d.pageLink) + '" target="_top">' + inner + '</a>'
              : '<span class="' + cls + '">' + inner + '</span>';
          }).join('') + '</div>'
        : '';
      if (wallEmpty) wallEmpty.hidden = depts.length > 0;
      if (cnt) {
        cnt.hidden = !(mode === 'hub' && depts.length);
        cnt.innerHTML = '<b>' + acrPad(depts.length) + '</b><small>Department' + (depts.length === 1 ? '' : 's') + '</small>';
      }
    }

    /* the people: the hub groups everyone under their department; a department page shows its own */
    const people = this.querySelector('#acrPeople');
    const ph = this.querySelector('#acrTeamPh');
    const teamEmpty = this.querySelector('#acrTeamEmpty');
    const inDept = function (m, d) { const md = key(m.department); return md !== '' && (md === key(d.name) || md === key(d.slug)); };
    const card = function (m, lazy) {
      const photo = acrSrc(m.photo);
      return '<div class="mb' + (m.isLeader ? ' mb--lead' : '') + '">' +
        (photo
          ? '<div class="mb__ph"><img src="' + E(acrImg(photo, 800)) + '" alt="' + E(m.name) + '" width="800" height="1000"' + (lazy ? ' loading="lazy" decoding="async"' : '') + '></div>'
          : '<div class="mb__init" aria-hidden="true">' + E(initials(m.name)) + '</div>') +
        '<div class="mb__b">' +
          (m.role ? '<span class="mb__r">' + E(m.role) + '</span>' : '') +
          '<p class="mb__n">' + E(m.name) + '</p>' +
          (m.bio ? '<p class="mb__bio">' + E(m.bio) + '</p>' : '') +
        '</div>' +
      '</div>';
    };
    const mk = mode + '|' + slug + '|' + depts.map(function (d) { return d.name + '~' + d.slug + '~' + d.groupPhoto; }).join(',') + '||' +
      members.map(function (m) { return [m.name, m.department, m.role, m.bio, m.photo, m.isLeader ? 1 : 0].join('~'); }).join(',');
    if (people && this._peopleKey !== mk) {
      this._peopleKey = mk;
      let html = '', shown = 0;
      if (dept) {
        const team = members.filter(function (m) { return inDept(m, dept); });
        shown = team.length;
        html = team.length ? '<div class="people">' + team.map(function (m, i) { return card(m, i >= 4); }).join('') + '</div>' : '';
        const gp = acrSrc(dept.groupPhoto);
        if (ph) ph.innerHTML = gp
          ? '<figure class="team__ph"><img src="' + E(acrImg(gp, 2000)) + '" alt="' + E(dept.name) + ' team" width="1600" height="900" loading="lazy" decoding="async"></figure>'
          : '';
      } else {
        if (ph) ph.innerHTML = '';
        const used = [];
        const groups = depts.map(function (d) {
          const team = members.filter(function (m) { if (used.indexOf(m) >= 0) return false; const ok = inDept(m, d); if (ok) used.push(m); return ok; });
          return { name: d.name, team: team };
        }).filter(function (g) { return g.team.length; });
        const rest = members.filter(function (m) { return used.indexOf(m) < 0; });
        if (rest.length) groups.push({ name: 'Creative Arts', team: rest });
        let n = 0;
        html = groups.map(function (g, gi) {
          return '<div class="grp"><span class="grp__i" aria-hidden="true">' + acrPad(gi + 1) + '</span><h3>' + E(g.name) + '</h3>' +
            '<span class="grp__n">' + g.team.length + ' serving</span></div>' +
            '<div class="people">' + g.team.map(function (m) { n++; return card(m, n > 4); }).join('') + '</div>';
        }).join('');
        shown = n;
      }
      people.innerHTML = html;
      if (teamEmpty) teamEmpty.hidden = shown > 0;
    }

    this.setTick(mode, dept, depts);
    this.fitDeck();
  }

  /* ---- the ticker: the departments, read back from the rows ---- */
  setTick(mode, dept, depts) {
    const parts = mode === 'dept' && dept
      ? [dept.name, dept.tagline, 'Arise Creative Arts', 'Arise Church']
      : depts.map(function (d) { return d.name; }).concat(['Arise Creative Arts', 'Arise Church']);
    const tick = parts.filter(Boolean).map(String).join(' \u00b7 ') + ' \u00b7 ';
    const a = this.querySelector('#acrTickA'), b = this.querySelector('#acrTickB');
    if (a && b && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }

  /* Folios and tab numerals follow the order the rooms play in; the call carries the last number. */
  renumber() {
    const self = this;
    let n = 0;
    this.querySelectorAll('#acrTrack > .panel').forEach(function (p) {
      if (p.hidden) return;
      n++;
      const f = p.querySelector('.folio'); if (f) f.textContent = acrPad(n);
      const t = self.querySelector('.strap__j[data-to="' + p.id + '"] i'); if (t) t.textContent = acrPad(n);
    });
    const cf = this.querySelector('#acrCtaFolio'); if (cf) cf.textContent = acrPad(n);
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
    const tabs = this.querySelector('#acrTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
    /* a photo that never arrives leaves the ink tile with its numeral and name, not a broken icon */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG') img.style.opacity = '0';
    }, true);
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#acrTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#acrDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    if (!this._active) this._active = ORDER[this._mode || 'hub'][0][1];
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
      this.querySelectorAll('#acrTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#acrDeck');
    const active = this.querySelector('#acrTrack > .panel.is-active');
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
      const strap = this.querySelector('#acrStrap');
      const deck = this.querySelector('#acrDeck');
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
      if (byUser) { const t = this.querySelector('#acrTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  /* The call is one block: under the deck at rest, on stage while the last room is chosen. */
  placeCall() {
    const cta = this.querySelector('#acrCta');
    const room = this.querySelector('#acrServe');
    const home = this.querySelector('#acrCtaHome');
    if (!cta || !room || !home) return;
    const want = this._active === 'acrServe' ? room : home;
    if (cta.parentNode !== want) want.appendChild(cta);
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#acrTrack');
    const deck = this.querySelector('#acrDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : ORDER[this._mode || 'hub'][0][1];
    this.placeCall();
    this.querySelectorAll('#acrTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#acrTabs .strap__j').forEach(function (t) {
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
    const strap = this.querySelector('#acrStrap');
    const spacer = this.querySelector('#acrStrapSpacer');
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

    this.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (v.text) el.innerHTML = v.text;
    });
    this.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (v.image) {
        const w = Number(el.getAttribute('data-ciw')) || 1600;
        if (el.tagName === 'IMG') el.src = acrImg(v.image, w);
        else el.style.backgroundImage = 'url("' + String(acrImg(v.image, w)).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-creatives', AriseCreatives);
