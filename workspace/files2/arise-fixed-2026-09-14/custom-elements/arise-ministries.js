/* ===========================================================================
   ARISE CHURCH -- MINISTRIES  ("House Lights Down")
   File: public/custom-elements/arise-ministries.js
   Tag:  arise-ministries

   Rebuilt 2026-10-31 as a sibling of the Media page (arise-sermons.js) and the
   Bible Search page (arise-bible.js): a compact masthead, a numbered tab strap
   that locks to the top of the screen, one room on stage at a time sliding in
   from the side, red footlights along each room's diagonal cut, and the call
   always below the deck, above the footer.

   The rooms:  01 Ministries   the wall of ministry tiles -- the page
               02 Serve        "We are In Need" -> Sign Up to Serve!
               03 Visit        "Not Sure Where To Start" -> Come Visit First

   The Visit call is ONE block (#amlCta, the red curtain under the deck). At
   rest it sits under the deck like every page's call; when the 03 tab is
   chosen it is moved into that room and moved back when another tab is, so
   every Page Content key renders exactly once and the call is never off page.

   INSTALL (already in place for this page)
   1. The Ministries page holds one Custom Element, Velo file
      arise-ministries.js, tag name arise-ministries, stretched full width.
   2. Page code (Ministries.d2xew.js) sends data-ministries from the CMS; the
      master page sends data-content (Page Content) to every custom element.
   3. Save, then PUBLISH. Custom elements render in an iframe in Editor and
      Preview, so they look wrong there. Check the LIVE page.

   Attributes:
     data-ministries  JSON array of {title, cat, link, img, soon} (CMS rows);
                      the built-in MINISTRIES list renders when it is absent.
                      wix:image://v1/ URLs are decoded.
     data-content     Page Content map (data-ck hooks; see cms/manifest/arise-ministries.json)

   All copy is from the live site. The ministries without pages show a Coming
   Soon flag instead of a dead link -- edit MINISTRIES below (or the CMS) when
   a page goes live.
   Fixed 2026-09-14: no horizontal scroll from 100vw, escape tile fields, wix:image URLs, Sunday times CMS hooks, safer applyContent.
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-ministries.json)
   =========================================================================== */

const AML_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';

const MINISTRIES = [
  { title:'Lead Network',            cat:'Learn More', link:'/lead-network',  logo:true, img:M+'c3b2d0_1c539649f39f48cbb157d4e27efeb843~mv2.png' },
  { title:"Children's Ministry",     cat:'Learn More', link:'/childrens',  img:M+'1f9fa2_a5448e514cc14ea08cb657e4f1a9cec4~mv2.jpg' },
  { title:'Youth Ministry',          cat:'Learn More', link:'/youth',      img:M+'1f9fa2_89a44a65090b488ea33de3157f4f3490~mv2.png' },
  { title:'Outreach',                cat:'Learn More', link:'/outreach',   img:M+'1f9fa2_2aea5b909f5e467b9d6aa1c30e513ce4~mv2.png' },
  { title:'Thrive For Young Adults', soon:true, img:M+'1f9fa2_deb5664679744b2ab198359ec71b4c0d~mv2.jpg' },
  { title:'Mvmt 6:14',               soon:true, img:M+'c3b2d0_d18e07d364724ff2b5f01b9f17d78cba~mv2.png' },
  { title:'Worship Team',            soon:true, img:M+'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg' },
  { title:'In Edge/ X Edge',         soon:true, img:M+'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg' }
];

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Ministries', 'amlWall'], ['02', 'Serve', 'amlServe'], ['03', 'Visit', 'amlVisit']];

const AML_CSS = `
arise-ministries{display:block;width:100%}
.aml *{box-sizing:border-box;margin:0;padding:0}
.aml{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--bone:#F4F2F0;
  --paper:#fff;--muted:#6A6A6E;--ruleD:rgba(255,255,255,.15);--ruleL:rgba(10,10,12,.12);
  --shell:1180px;--gut:clamp(20px,5vw,56px);
  --cut:28px;--foot:4px;
  --h2:clamp(40px,7vw,96px);--h2s:clamp(36px,5.4vw,72px);--h3:clamp(24px,2.6vw,36px);--fig:clamp(56px,7vw,96px);
  --lede:clamp(16px,1.4vw,18px);--body:clamp(15px,1.3vw,17px);
  --ease:cubic-bezier(.2,.7,.2,1);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:#fff;line-height:1.6;
  background:var(--scrim);color-scheme:light only;overflow-x:clip;display:block;
  -webkit-font-smoothing:antialiased;
}
@media(min-width:900px){.aml{--cut:48px;--foot:5px}}
.aml [hidden]{display:none!important}
.aml h1,.aml h2,.aml h3,.aml p,.aml button,.aml img,.aml iframe,.aml dl,.aml dt,.aml dd{margin:0;padding:0;border:0}
.aml img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.aml iframe{display:block}
.aml .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.aml .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.aml .g12{grid-template-columns:repeat(12,1fr)}}
.aml h1,.aml h2,.aml h3,.aml .folio,.aml .cnt b{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aml h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.aml .h2--xl{font-size:var(--h2)}
.aml h3{font-size:var(--h3);color:#fff}
.aml p{font-size:var(--body);line-height:1.6}
.aml .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.aml a{color:inherit}

/* ---- house devices ---- */
.aml .mark{display:flex;align-items:center;margin-bottom:18px}
.aml .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.aml .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .aml .mark{flex-wrap:nowrap;align-items:flex-start}
  .aml .mark::before{margin-right:124px;margin-top:5px}
  .aml .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aml .mark--l .kicker{color:var(--redL)}
.aml .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.aml .mark--w .kicker{color:#fff}
.aml .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.aml .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.aml .strip--ghost{background:transparent;border:1.5px solid #fff}
.aml .strip--ghost span{color:#fff}
.aml .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.aml .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aml .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aml .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.aml .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.aml .btn--dark:hover{background:var(--ink);color:#fff}
.aml .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.aml .btn--onRed:hover{background:transparent;color:#fff}
.aml .btn[disabled]{opacity:.55;pointer-events:none}
.aml a:focus-visible,.aml button:focus-visible,.aml input:focus-visible,.aml select:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.aml .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.aml .folio--d{color:var(--red)}
.aml .folio--w{color:#fff}
.aml .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.aml .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.aml .ulink:hover::after,.aml .ulink:focus-visible::after{width:100%}
.aml .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.aml .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.aml .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.aml .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.aml .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.aml .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.aml .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.aml .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.aml .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.aml .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.aml .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.aml .bg__wedge{position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);clip-path:polygon(0 0,100% 0,100% 100%);opacity:.9}
@media(max-width:620px){.aml .bg__wedge{width:150px;height:110px}}  /* keeps the red kicker off the red corner on a phone */
/* a photo under the scrims: the room's own ministry photo, dimmed to a glow */
.aml .bg__ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%;opacity:.34;background:transparent}
.aml .bg__scrim{position:absolute;inset:0;background:linear-gradient(90deg,var(--ink) 0%,rgba(10,10,12,.55) 55%,rgba(10,10,12,.2) 100%)}

/* ---- masthead ---- */
.aml .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.aml .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.aml .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.aml .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.aml .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.aml .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:amlTick 36s linear infinite}
.aml .mast__tick:hover div{animation-play-state:paused}
.aml .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.aml .mast{padding:44px 0 26px}.aml .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.aml .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.aml .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.aml .strap__spacer{height:0}
.aml .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.aml .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.aml .strap__jump::-webkit-scrollbar{display:none}
.aml .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.aml .strap__j:first-child{border-left:0}
.aml .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .aml .strap__jump{overflow:visible;margin:0;padding:0}
  .aml .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .aml .strap__j i{font-size:12px}
}
.aml .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.aml .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.aml .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.aml .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.aml .strap__j:focus-visible{outline-offset:-3px}
.aml .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.aml .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.aml .strap__arrow:hover{background:rgba(255,255,255,.08)}
.aml .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .aml .strap__jump{overflow:visible;margin:0;padding:0}
  .aml .strap__j{padding:0 20px}
  .aml .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.aml .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.aml .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.aml .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.aml .panel:not(.is-active){visibility:hidden}
.aml .deck.moving .panel{visibility:visible}
.aml .panel.enter > .shell,.aml .panel.enter > .cta{animation:amlRise .55s var(--ease) both}

/* ---- 01 ministries: the wall ---- */
.aml .wall{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.aml .wall{padding:56px 0 calc(64px + var(--cut))}}
.aml .wall .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.aml .wall > .shell{position:relative;z-index:1}
.aml .wall__hd{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:18px 32px}
.aml .wall__hd .mark{margin-bottom:14px}
@media(max-width:999px){.aml .wall__hd{flex-direction:column;align-items:flex-start}}  /* the red count stays off the red corner */
.aml .cnt{display:block;flex:0 0 auto}
.aml .cnt b{display:block;font-size:var(--fig);color:var(--red);line-height:.9}
.aml .cnt small{display:block;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:8px}
.aml .min{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:28px}
@media(min-width:700px){.aml .min{grid-template-columns:repeat(3,1fr);gap:14px}}
@media(min-width:900px){.aml .min{gap:18px;margin-top:40px}}
.aml .min__c{position:relative;display:block;text-decoration:none;background:var(--ink);
  overflow:hidden;aspect-ratio:4/5;color:#fff;-webkit-tap-highlight-color:transparent}
.aml .min__c img{width:100%;height:100%;object-fit:cover;filter:grayscale(.28) brightness(.62);
  transition:transform .5s var(--ease),filter .35s}
.aml .min__c:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.8)}
/* A transparent logo is not a photo -- no crop, no darkening, and room
   above the caption so the two don't overlap. */
.aml .min__c--logo img{object-fit:contain;filter:none;padding:14% 16% 30%;background:var(--ink)}
.aml .min__c--logo:hover img{filter:none;transform:scale(1.03)}
.aml .min__t{position:absolute;left:0;right:0;bottom:0;padding:48px 14px 14px;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.72) 42%,rgba(6,6,8,.97) 100%)}
.aml .min__t h3{color:#fff;font-size:17px;letter-spacing:.04em;line-height:1.05}
.aml .min__t span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(255,255,255,.86);margin-top:6px;font-weight:500}
.aml .min__c::after{content:"";position:absolute;left:0;right:0;bottom:0;height:5px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease);z-index:2}
.aml .min__c:hover::after,.aml .min__c:focus-visible::after{transform:scaleX(1)}
.aml .min__c[data-soon]::before{content:"Coming Soon";position:absolute;top:12px;left:12px;z-index:2;
  background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.14em;
  text-transform:uppercase;padding:5px 11px;font-family:'Oswald',Helvetica,Arial,sans-serif}
@media(min-width:900px){
  .aml .min__t{padding:64px 18px 18px}
  .aml .min__t h3{font-size:24px}
  .aml .min__c[data-soon]::before{top:18px;left:18px}
}
.aml .min:empty{min-height:120px}

/* ---- 02 serve ---- */
.aml .serve{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.aml .serve{padding:72px 0 calc(88px + var(--cut))}}
.aml .serve .bg{background:var(--ink)}
.aml .serve > .shell{position:relative;z-index:1}
.aml .serve__txt{min-width:0}
.aml .serve__btn{margin-top:32px}
@media(min-width:900px){
  .aml .serve__txt{grid-column:1/9}
  .aml .serve__btn{grid-column:9/13;align-self:end;justify-self:end;margin-top:0;padding:19px 38px;min-height:56px}
}

/* ---- 03 visit: the call, on stage ---- */
.aml .visit{position:relative;background:var(--red)}
.aml .visit > .cta{margin-top:0}

/* ---- the call: the red curtain every room's cut lands on ---- */
.aml .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.aml .cta{padding:calc(64px + var(--cut)) 0 80px}}
.aml .cta h2{color:#fff}
.aml .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.aml .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.aml .cta__line:first-child{border-top:0;padding-top:0}
.aml .cta__time{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:.02em;
  white-space:nowrap;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.aml .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.aml .cta a:focus-visible,.aml .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .aml .cta__txt{grid-column:1/8}
  .aml .cta__p{font-size:19px;max-width:none}
  .aml .cta__line{padding:18px 0}
  .aml .cta__time{font-size:30px}
  .aml .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- motion ---- */
@keyframes amlTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes amlRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .aml *,.aml *::before,.aml *::after{animation:none!important;transition:none!important}
  .aml .mast__tick div{animation:none;width:100%}
  .aml .mast__tick span:last-child{display:none}
  .aml .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .aml .deck,.aml .deck__track{transition:none}
  .aml .panel.enter > .shell,.aml .panel.enter > .cta{animation:none}
}
`;

/* Escape CMS text for HTML; existing entities (&amp; &middot; ...) are kept. */
function amnEsc(s) {
  return String(s == null ? '' : s).replace(/&(?!(#\d+|#x[0-9a-f]+|[a-z]+);)/gi, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Arise Church speed: ask Wix for a resized copy (longest side <= w, AVIF/WebP per browser).
   Anything that is not a plain static.wixstatic.com media URL is returned unchanged. */
function amnImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}
function amnPad(n) { return (n < 10 ? '0' : '') + n; }

function injectHead() {
  if (!document.getElementById('aml-ministries-fonts') && !document.querySelector('link[href="' + AML_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'aml-ministries-fonts'; l.rel = 'stylesheet'; l.href = AML_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('aml-ministries-css')) {
    const s = document.createElement('style');
    s.id = 'aml-ministries-css'; s.innerHTML = AML_CSS;
    document.head.appendChild(s);
  }
}

class AriseMinistries extends HTMLElement {
  static get observedAttributes() { return ['data-ministries', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); return; }
    if (name === 'data-ministries') this.renderTiles();
  }

  /* CMS rows when page code supplies them, otherwise the built-in list. */
  list() {
    const raw = this.getAttribute('data-ministries');
    if (!raw) return MINISTRIES;
    try {
      const d = JSON.parse(raw);
      if (!Array.isArray(d) || !d.length) return MINISTRIES;
      return d.map(function (m) {
        let img = String(m.img || '');
        if (img.indexOf('wix:image://v1/') === 0) img = 'https://static.wixstatic.com/media/' + img.slice(15).split(/[\/#]/)[0];
        return { title: m.title || '', cat: m.cat || '', link: m.link || '',
                 img: img, soon: !!m.soon,
                 logo: /1c539649/.test(img) };
      });
    } catch (e) {
      console.error('arise-ministries: bad data-ministries JSON', e);
      return MINISTRIES;
    }
  }

  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();
    this.classList.add('aml');

    this.innerHTML =
      /* masthead: the page title, and on desktop a ticker naming every ministry */
      '<header class="mast" id="amlMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="ministries.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="ministries.hero.heading">Ministries</h1>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="amlTickA"></span><span id="amlTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="amlStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Ministries page" id="amlTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="amlTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="amlStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="amlDeck"><div class="deck__track" id="amlTrack">' +

      /* 01 -- the wall of ministries */
      '<section class="panel wall is-active" id="amlWall" role="tabpanel" aria-labelledby="amlTab-amlWall">' +
        '<div class="bg bg--lh" aria-hidden="true"><div class="bg__page"></div><div class="bg__wedge"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">01</div>' +
          '<div class="wall__hd">' +
            '<div class="wall__txt">' +
              '<div class="mark mark--l"><span class="kicker" data-ck="ministries.wall.kicker">Every Ministry</span></div>' +
              '<h2 data-ck="ministries.wall.heading">Find Your People</h2>' +
            '</div>' +
            '<div class="cnt" id="amlCount" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="min" id="amlMin" data-cms-source="Ministries"></div>' +
        '</div>' +
      '</section>' +

      /* 02 -- serve: the "We are In Need" band as a room */
      '<section class="panel serve" id="amlServe" role="tabpanel" aria-labelledby="amlTab-amlServe">' +
        '<div class="bg bg--rh" aria-hidden="true"><img class="bg__ph" id="amlServePh" alt="" width="1600" height="1600" loading="lazy" decoding="async" hidden><div class="bg__scrim"></div><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell g12">' +
          '<div class="serve__txt">' +
            '<div class="folio" aria-hidden="true">02</div>' +
            '<div class="mark mark--l"><span class="kicker" data-ck="ministries.need.kicker">Serve With Us</span></div>' +
            '<h2 class="h2--xl" data-ck="ministries.need.heading">We are In Need</h2>' +
          '</div>' +
          '<a class="btn serve__btn" href="/serve" target="_top" data-ck="ministries.need.button">Sign Up to Serve!</a>' +
        '</div>' +
      '</section>' +

      /* 03 -- visit: the call takes the stage (the #amlCta block is moved in here when this tab is chosen) */
      '<section class="panel visit" id="amlVisit" role="tabpanel" aria-labelledby="amlTab-amlVisit"></section>' +

      '</div></div>' +

      /* the call: below the deck, above the footer, always (unless it is on stage as room 03) */
      '<div id="amlCtaHome">' +
      '<section class="cta" id="amlCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true">03</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="ministries.cta.kicker">Not Sure Where To Start</span></div>' +
          '<h2 class="h2--xl" data-ck="ministries.cta.heading">Come Visit First</h2>' +
          /* one line per campus: the time in Anton, then where it is; then the closing sentence */
          '<p class="cta__p">' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.main">Sunday 10:30 AM</span> ' +
              '<span data-ck="ministries.cta.where1">in Pineville,</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.second">Sunday 10:00 AM</span> ' +
              '<span data-ck="ministries.cta.where2">in Alexandria.</span></span>' +
            '<span class="cta__line"><span data-ck="ministries.cta.body">Find your people once you\u2019re here.</span></span>' +
          '</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/contact" target="_top" data-ck="ministries.cta.button">Plan Your Visit</a>' +
      '</div></section>' +
      '</div>';

    /* an image that never arrives leaves the ink card with its title, not a broken icon */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG') { img.style.opacity = '0'; }
    }, true);

    this.renderTiles();
    this.applyContent();
    this.bindChrome();
    this.initDeck();
    this.initPin();
  }

  /* ---- the wall: one tile per ministry; re-applying the same rows does not rebuild ---- */
  renderTiles() {
    const mount = this.querySelector('#amlMin');
    if (!mount) return;
    const rows = this.list();
    const key = rows.map(function (m) { return [m.title, m.cat, m.link, m.img, m.soon ? 1 : 0].join('|'); }).join(',');
    if (this._tilesKey === key && mount.children.length) return;
    this._tilesKey = key;

    mount.innerHTML = rows.map(function (m, i) {
      /* the first row is on the first screen; the rest load as they scroll in */
      const inner = '<img src="' + amnEsc(amnImg(m.img, m.logo ? 800 : 960)) + '" alt="' + amnEsc(m.title) + '" width="480" height="600"' +
        (i >= 3 ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"') + '>' +
        '<div class="min__t"><h3>' + amnEsc(m.title) + '</h3>' +
        (m.soon ? '' : '<span>' + amnEsc(m.cat) + '</span>') + '</div>';
      return m.soon
        ? '<span class="min__c' + (m.logo ? ' min__c--logo' : '') + '" data-soon>' + inner + '</span>'
        : '<a class="min__c' + (m.logo ? ' min__c--logo' : '') + '" href="' + amnEsc(m.link) + '" target="_top">' + inner + '</a>';
    }).join('');

    /* the count beside the heading, and the ticker in the masthead */
    const cnt = this.querySelector('#amlCount');
    if (cnt) cnt.innerHTML = '<b>' + amnPad(rows.length) + '</b><small>' + (rows.length === 1 ? 'Ministry' : 'Ministries') + '</small>';
    const tick = rows.map(function (m) { return m.title; }).filter(Boolean).join(' \u00b7 ') + ' \u00b7 Arise Church \u00b7 ';
    const a = this.querySelector('#amlTickA'), b = this.querySelector('#amlTickB');
    if (a && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }

    /* the serve room's backdrop: the first photo (not the logo) on the wall, dimmed */
    const ph = this.querySelector('#amlServePh');
    if (ph) {
      let pick = '';
      for (let i = 0; i < rows.length; i++) { if (rows[i].img && !rows[i].logo) { pick = rows[i].img; break; } }
      const src = pick ? amnImg(pick, 1600) : '';
      if (!src) { ph.hidden = true; ph.removeAttribute('src'); }
      else if (ph.getAttribute('src') !== src) { ph.style.opacity = ''; ph.src = src; ph.hidden = false; }
    }
    if (this._deck) this.fitDeck();
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
    const tabs = this.querySelector('#amlTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#amlTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#amlDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'amlWall';
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
      this.querySelectorAll('#amlTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#amlDeck');
    const active = this.querySelector('#amlTrack > .panel.is-active');
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
      const strap = this.querySelector('#amlStrap');
      const deck = this.querySelector('#amlDeck');
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
      if (byUser) { const t = this.querySelector('#amlTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  /* The call is one block: under the deck at rest, on stage while room 03 is chosen. */
  placeCall() {
    const cta = this.querySelector('#amlCta');
    const room = this.querySelector('#amlVisit');
    const home = this.querySelector('#amlCtaHome');
    if (!cta || !room || !home) return;
    const want = this._active === 'amlVisit' ? room : home;
    if (cta.parentNode !== want) want.appendChild(cta);
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#amlTrack');
    const deck = this.querySelector('#amlDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'amlWall';
    this.placeCall();
    this.querySelectorAll('#amlTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#amlTabs .strap__j').forEach(function (t) {
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
    const strap = this.querySelector('#amlStrap');
    const spacer = this.querySelector('#amlStrapSpacer');
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

    const self = this;
    const has = function (k) { return !!k && Object.prototype.hasOwnProperty.call(map, k) && map[k]; };
    self.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = has(k) ? map[k] : null;
      if (v && v.text) el.innerHTML = v.text;
    });
    self.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = has(k) ? map[k] : null;
      if (v && v.image) {
        const w = Number(el.getAttribute('data-ciw')) || 1600;
        if (el.tagName === 'IMG') el.src = amnImg(v.image, w);
        else el.style.backgroundImage = 'url("' + String(amnImg(v.image, w)).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-ministries', AriseMinistries);
