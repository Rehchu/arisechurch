/* ===========================================================================
   ARISE CHURCH -- CONNECT GROUPS
   File: public/custom-elements/arise-connect.js
   Tag:  arise-connect

   Two signups on one page: host a group, or join one. Both post to the same
   /_functions/ariseForm endpoint the Contact and Serve forms already use, so
   there is no new backend -- just two new form types to allow.

   INSTALL
   1. backend/http-functions.js -- add the two new types to ALLOWED:
        const ALLOWED = ['contact', 'serve', 'prayer', 'connect-host', 'connect-join'];
   2. Velo sidebar -> Public -> custom-elements/ -> new file arise-connect.js
      -> paste this whole file
   3. Editor -> the Connect Groups page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-connect.js
      Tag Name: arise-connect
   4. STRETCH IT FULL WIDTH. Give it plenty of height.
   5. Save, then PUBLISH. Test on the LIVE page -- /_functions/ URLs do not
      resolve in Preview.

   Submissions land in CMS -> Form Submissions like every other form, with
   formType set to connect-host or connect-join.

   DATES are near the top -- update them each season in one place.
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-connect.json)
   Fixed 2026-09-14: placeholder contrast, form a11y (live status, aria-required/invalid/describedby, success focus), full ARIA tabs + arrow keys, host-by tab label CMS hook, safer applyContent, wix:image flyer URLs
   14 Sept (Bradly): host registration only. The Join tab, join form and Join This Group buttons stay hidden until Page Content connect.join.open = yes; a blank connect.season.hostby row hides the deadline.
   Rebuilt 2026-10-31 in the "House Lights Down" theme shared with the Media page
   (arise-sermons.js) and the Bible Search page (arise-bible.js): masthead with the
   hero lede and strip under the title, the strap (01 About / 02 Groups / 03 Sign Up)
   that locks under the site header, one room on stage at a time, the season Dates
   as the red call under the last cut with a button that jumps to the sign-up room.
   Every CMS key, attribute, form id and backend call is unchanged. Class prefix
   .acg on the element itself; ids acg*. Two new Page Content keys (optional rows):
   connect.cta.button (the call's button) and connect.about.photo (the About backdrop).
   =========================================================================== */

const ACG_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const FORM_ENDPOINT = '/_functions/ariseForm';

/* Update these each season. */
const SEASON = {
  name:      'Fall Connect Groups',
  starts:    'the week of September 14',
  ends:      'the week of November 16',
  hostBy:    'September 20'
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* The About room's backdrop: the Connect Groups photo from the Ministries wall.
   Page Content row connect.about.photo (image) replaces it. */
const ACG_ABOUT_PHOTO = 'https://static.wixstatic.com/media/1f9fa2_944350000ec84bb196f30a80a5daecd8~mv2.webp';

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';

const ACG_CSS = `
arise-connect{display:block;width:100%}
.acg *{box-sizing:border-box;margin:0;padding:0}
.acg{
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
@media(min-width:900px){.acg{--cut:48px;--foot:5px}}
.acg [hidden]{display:none!important}
.acg h1,.acg h2,.acg h3,.acg p,.acg button,.acg input,.acg select,.acg textarea,.acg img,.acg iframe,.acg dl,.acg dt,.acg dd,.acg form{margin:0;padding:0;border:0}
.acg img{display:block;color:#fff;font-size:12px;background:var(--ink)}
.acg iframe{display:block}
.acg .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.acg .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.acg .g12{grid-template-columns:repeat(12,1fr)}}
.acg h1,.acg h2,.acg h3,.acg .folio,.acg .pill__n,.acg .cta__time,.acg .ftab__t{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.acg h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.acg .h2--xl{font-size:var(--h2)}
.acg h3{font-size:var(--h3);color:#fff}
.acg p{font-size:var(--body);line-height:1.6}
.acg .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.acg a{color:inherit}

/* ---- house devices ---- */
.acg .mark{display:flex;align-items:center;margin-bottom:18px}
.acg .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.acg .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .acg .mark{flex-wrap:nowrap;align-items:flex-start}
  .acg .mark::before{margin-right:124px;margin-top:5px}
  .acg .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.acg .mark--l .kicker{color:var(--redL)}
.acg .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.acg .mark--w .kicker{color:#fff}
.acg .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.acg .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.acg .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.acg .btn:hover{background:transparent;color:#fff;border-color:#fff}
.acg .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.acg .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.acg .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.acg .btn--dark:hover{background:var(--ink);color:#fff}
.acg .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.acg .btn--onRed:hover{background:transparent;color:#fff}
.acg .btn[disabled]{opacity:.55;pointer-events:none}
.acg a:focus-visible,.acg button:focus-visible,.acg input:focus-visible,.acg select:focus-visible,.acg textarea:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.acg .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.acg .folio--d{color:var(--red)}
.acg .folio--w{color:#fff}

/* ---- clipped backdrops + footlight ---- */
.acg .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.acg .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.acg .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.acg .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.acg .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.acg .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.acg .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.acg .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.acg .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.acg .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.acg .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .6s var(--ease)}
.acg .ly.on{opacity:1}

/* ---- masthead ---- */
.acg .mast{position:relative;background:var(--ink);padding:32px 0 24px}
.acg .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.acg .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.acg .mast__txt{min-width:0}
.acg .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.acg .mast__lede{margin-top:20px}
.acg .mast__strip{margin-top:24px}
.acg .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.acg .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:acgTick 36s linear infinite}
.acg .mast__tick:hover div{animation-play-state:paused}
.acg .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.acg .mast{padding:44px 0 30px}.acg .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.acg .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.acg .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.acg .strap__spacer{height:0}
.acg .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.acg .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.acg .strap__jump::-webkit-scrollbar{display:none}
.acg .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.acg .strap__j:first-child{border-left:0}
.acg .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .acg .strap__jump{overflow:visible;margin:0;padding:0}
  .acg .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .acg .strap__j i{font-size:12px}
}
.acg .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.acg .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.acg .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.acg .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.acg .strap__j:focus-visible{outline-offset:-3px}
.acg .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.acg .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.acg .strap__arrow:hover{background:rgba(255,255,255,.08)}
.acg .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .acg .strap__jump{overflow:visible;margin:0;padding:0}
  .acg .strap__j{padding:0 20px}
  .acg .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.acg .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.acg .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.acg .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.acg .panel:not(.is-active){visibility:hidden}
.acg .deck.moving .panel{visibility:visible}
.acg .panel.enter > .shell{animation:acgRise .55s var(--ease) both}

/* ---- 01 about: what they are, the pillars, the verse ---- */
.acg .about{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.acg .about{padding:56px 0 calc(64px + var(--cut))}}
.acg .about .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.acg .about .ly.on{opacity:.22}
.acg .about > .shell{position:relative;z-index:1}
.acg .about__verse{margin-top:28px}
@media(min-width:900px){
  .acg .about__hd{grid-column:1/8}
  .acg .about__verse{grid-column:9/13;align-self:end;margin-top:0}
}
.acg .pill{display:grid;grid-template-columns:1fr;gap:12px;margin-top:32px}
@media(min-width:760px){.acg .pill{grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px}}
.acg .pill__c{background:var(--ink);border:1px solid var(--ruleD);border-top:3px solid var(--red);padding:clamp(20px,3vw,30px)}
.acg .pill__n{font-size:13px;color:var(--redL);letter-spacing:.18em;margin-bottom:12px}
.acg .pill__c h3{font-size:clamp(20px,2vw,26px)}
.acg .pill__c p{color:rgba(255,255,255,.72);font-size:15.5px;margin-top:10px}
.acg .verse{background:var(--bone);border-top:3px solid var(--red);padding:clamp(22px,3vw,32px);color:var(--ink)}
.acg .verse p{font-size:var(--read);line-height:1.7;color:var(--ink)}
.acg .verse cite{display:block;margin-top:14px;font-style:normal;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--red)}

/* ---- 02 groups: the paper room, ink cards on bone ---- */
.acg .find{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.acg .find{padding:64px 0 calc(72px + var(--cut))}}
.acg .find .bg{background:var(--bone)}
.acg .find > .shell{position:relative;z-index:1}
.acg .find h2{color:var(--ink)}
.acg .groups{display:grid;grid-template-columns:1fr;gap:14px;margin-top:32px}
@media(min-width:640px){.acg .groups{grid-template-columns:repeat(2,1fr);gap:18px}}
@media(min-width:1000px){.acg .groups{grid-template-columns:repeat(3,1fr)}}
.acg .g{position:relative;background:var(--ink);color:#fff;display:flex;flex-direction:column;overflow:hidden}
.acg .g::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red)}
.acg .g__img{aspect-ratio:4/5;overflow:hidden;background:var(--ink);position:relative}
.acg .g__img img{width:100%;height:100%;object-fit:cover;filter:saturate(.85);transition:transform .5s var(--ease)}
.acg .g__img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,var(--ink) 100%)}
@media(hover:hover){.acg .g:hover .g__img img{transform:scale(1.04)}}
.acg .g__full{position:absolute;top:12px;left:14px;z-index:1;transform:skewX(-9deg);background:var(--red);color:#fff;font-size:11px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:7px 14px}
.acg .g__b{padding:22px 22px 30px;flex:1 1 auto;display:flex;flex-direction:column}
.acg .g h3{font-size:clamp(22px,2vw,28px);color:#fff}
.acg .g__d{font-size:15px;color:rgba(255,255,255,.72);line-height:1.6;margin-top:12px}
.acg .g__facts{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin-top:18px;padding-top:16px;border-top:1px solid var(--ruleD);flex:1 1 auto;align-content:start}
.acg .g__facts dt{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--redL);padding-top:3px}
.acg .g__facts dd{font-size:15px;color:#fff}
.acg .g__go{margin-top:22px;align-self:flex-start}
.acg .g__none{border:1.5px dashed rgba(10,10,12,.3);padding:48px 28px;text-align:center;margin-top:32px}
.acg .g__none h3{color:var(--ink)}
.acg .g__none p{color:var(--muted);font-size:15.5px;max-width:48ch;margin:12px auto 0}

/* ---- 03 sign up: the two forms on the ink ---- */
.acg .signup{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.acg .signup{padding:64px 0 calc(72px + var(--cut))}}
.acg .signup .bg{background:var(--ink)}
.acg .signup > .shell{position:relative;z-index:1}
.acg .ftabs{display:flex;gap:2px;margin-top:32px;flex-wrap:wrap}
.acg .ftab{flex:1 1 220px;background:rgba(255,255,255,.05);border:0;border-top:4px solid transparent;padding:18px 22px;cursor:pointer;
  font-family:'Oswald',Helvetica,Arial,sans-serif;text-align:left;color:#fff;min-height:44px;transition:background .18s,border-color .18s}
.acg .ftab:hover{background:rgba(255,255,255,.09)}
.acg .ftab[aria-selected="true"]{background:var(--scrim);border-top-color:var(--red)}
.acg .ftab__t{font-size:19px;display:block;color:rgba(255,255,255,.82)}
.acg .ftab[aria-selected="true"] .ftab__t{color:#fff}
.acg .ftab__d{font-size:13.5px;color:rgba(255,255,255,.62);display:block;margin-top:6px;line-height:1.5}
.acg .ftab[aria-selected="true"] .ftab__d{color:rgba(255,255,255,.75)}
.acg .ftab:focus-visible{outline-offset:-3px}
.acg .fpanel{display:none;background:var(--scrim);border:1px solid var(--ruleD);border-top:0;padding:clamp(24px,4vw,44px)}
.acg .fpanel[data-on="true"]{display:block}
.acg .fpanel h3{margin-bottom:10px}
.acg .fpanel .intro{color:rgba(255,255,255,.82);font-size:15.5px;max-width:56ch;margin-bottom:12px}
.acg form{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:26px}
.acg form .full{grid-column:1/-1}
@media(max-width:640px){.acg form{grid-template-columns:1fr}}
.acg label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.72);margin-bottom:9px}
.acg label .req{color:var(--redL)}
.acg input,.acg select,.acg textarea{width:100%;background:transparent;border:0;border-bottom:1.5px solid rgba(255,255,255,.32);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:16.5px;color:#fff;border-radius:0;min-height:48px}
.acg select{appearance:none;-webkit-appearance:none;padding-right:28px;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath d='M2 5l5 5 5-5' fill='none' stroke='%23DB3F48' stroke-width='1.6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 2px center}
.acg textarea{min-height:110px;resize:vertical;line-height:1.6}
.acg select option{background:#0A0A0C;color:#fff}
.acg input::placeholder,.acg textarea::placeholder{color:rgba(255,255,255,.55)}
.acg input:focus,.acg select:focus,.acg textarea:focus{outline:none;border-bottom-color:var(--red)}
.acg .bad input,.acg .bad select,.acg .bad textarea{border-bottom-color:var(--redL)}
.acg .hint{font-size:12px;color:var(--redL);margin-top:7px;min-height:16px}
.acg .note{grid-column:1/-1;font-size:15px;color:rgba(255,255,255,.82);min-height:22px}
.acg .note[data-err="true"]{color:var(--redL)}
@media(max-width:640px){.acg .fpanel .btn{width:100%}}
.acg .done{border-left:5px solid var(--red);padding:28px 30px;background:rgba(255,255,255,.06);margin-top:26px}
.acg .done h3{margin-bottom:10px}
.acg .done p{color:rgba(255,255,255,.86);font-size:16px}

/* ---- the call: the season dates on the red curtain every room's cut lands on ---- */
.acg .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.acg .cta{padding:calc(64px + var(--cut)) 0 80px}}
.acg .cta h2{color:#fff}
.acg .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.acg .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.acg .cta__line:first-child{border-top:0;padding-top:0}
.acg .cta__lbl{display:block;width:100%;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.82)}
.acg .cta__time{font-size:24px;color:#fff;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.acg .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.acg .cta a:focus-visible,.acg .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .acg .cta__txt{grid-column:1/8}
  .acg .cta__p{font-size:19px;max-width:none}
  .acg .cta__line{padding:18px 0}
  .acg .cta__time{font-size:30px}
  .acg .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- motion ---- */
@keyframes acgTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes acgRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .acg *,.acg *::before,.acg *::after{animation:none!important;transition:none!important}
  .acg .mast__tick div{animation:none;width:100%}
  .acg .mast__tick span:last-child{display:none}
  .acg .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .acg .deck,.acg .deck__track{transition:none}
  .acg .panel.enter > .shell{animation:none}
}
`;

var AC_MAP = { firstName: 'given-name', lastName: 'family-name', name: 'name',
  email: 'email', phone: 'tel' };
function acOf(k) { return AC_MAP[k] || 'on'; }

function acgEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Wix Image field values (wix:image://v1/<id>/...) are not loadable URLs.
   Arise Church speed fix: plain Wix media photos are then served resized by Wix
   (whole image kept, longest side at most w, AVIF/WebP picked per browser).
   Anything else (already resized, gif, data:, other hosts) is left alone. */
function acgImg(u, w) {
  const wi = /^wix:image:\/\/v1\/([^\/#]+)/.exec(String(u || ''));
  u = wi ? 'https://static.wixstatic.com/media/' + wi[1] : String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

/* The plain words of a CMS-edited block, <br> read as a space (for the ticker). */
function acgText(el) {
  if (!el) return '';
  const c = el.cloneNode(true);
  Array.prototype.forEach.call(c.querySelectorAll('br'), function (b) { b.parentNode.replaceChild(document.createTextNode(' '), b); });
  return String(c.textContent || '').replace(/\s+/g, ' ').trim();
}

function injectHead() {
  if (!document.getElementById('acg-connect-fonts') && !document.querySelector('link[href="' + ACG_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'acg-connect-fonts'; l.rel = 'stylesheet'; l.href = ACG_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('acg-connect-css')) {
    const s = document.createElement('style');
    s.id = 'acg-connect-css'; s.innerHTML = ACG_CSS;
    document.head.appendChild(s);
  }
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'About', 'acgAbout'], ['02', 'Groups', 'acgFind'], ['03', 'Sign Up', 'acgSignup']];

const FORMS = {
  'connect-host': {
    heading: 'Host a Connect Group',
    intro: 'Open your home. Open your heart. Watch God move. Tell us how you would like ' +
           'to run it and we will help you get set up.',
    done: 'Thank you for stepping up. Someone will be in touch about next steps.',
    button: 'Sign Up to Host',
    fields: [
      { k: 'firstName', label: 'First Name', type: 'text',  req: true, half: true },
      { k: 'lastName',  label: 'Last Name',  type: 'text',  req: true, half: true },
      { k: 'phone',     label: 'Phone',      type: 'tel',   req: true, half: true },
      { k: 'email',     label: 'Email',      type: 'email', req: true, half: true },
      { k: 'venue',     label: 'Where would you host?', type: 'select', req: true, half: true,
        options: ['My home', 'The church', 'A business or public place', 'Not sure yet'] },
      { k: 'area',      label: 'What area?', type: 'text',  req: false, half: true,
        ph: 'Pineville, Alexandria, Tioga...' },
      { k: 'day',       label: 'Which day?', type: 'select', req: false, half: true,
        options: DAYS },
      { k: 'time',      label: 'What time?', type: 'text',  req: false, half: true,
        ph: '7:00 PM' },
      { k: 'audience',  label: 'Who is it for?', type: 'text', req: false, half: false,
        ph: 'Anyone, men, women, families with young kids, young adults...' },
      { k: 'message',   label: 'Anything else we should know?', type: 'textarea',
        req: false, half: false }
    ]
  },
  'connect-join': {
    heading: 'Join a Connect Group',
    heading2: '',
    intro: 'Pick a group above, or leave it blank and we will help you find one.',
    done: 'Thank you. Someone will be in touch about your group.',
    button: 'Sign Me Up',
    fields: [
      { k: 'firstName', label: 'First Name', type: 'text',  req: true, half: true },
      { k: 'lastName',  label: 'Last Name',  type: 'text',  req: true, half: true },
      { k: 'phone',     label: 'Phone',      type: 'tel',   req: true, half: true },
      { k: 'email',     label: 'Email',      type: 'email', req: true, half: true },
      { k: 'subject',   label: 'Which group?', type: 'text', req: false, half: false,
        ph: 'Any group works' }
    ]
  }
};

class AriseConnect extends HTMLElement {
  static get observedAttributes() { return ['data-groups', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); this.setTick(); return; }
    this.fillGroups();
  }

  groups() {
    const raw = this.getAttribute('data-groups');
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d : [];
    } catch (e) {
      console.error('arise-connect: bad data-groups JSON', e);
      return [];
    }
  }

  connectedCallback() {
    if (this._b) return;
    this._b = true; injectHead();
    this.classList.add('acg');

    const E = acgEsc;

    const buildForm = function (type) {
      const cfg = FORMS[type];
      const pre = type === 'connect-host' ? 'connect.host' : 'connect.join';
      const fields = cfg.fields.map(function (f) {
        const cls = f.half ? '' : ' full';
        const req = f.req ? ' <span class="req">*</span>' : '';
        const id = type + '-' + f.k;
        const acgReq = f.req ? ' aria-required="true"' : '';
        let control;
        if (f.type === 'textarea') {
          control = '<textarea id="' + id + '" name="' + f.k + '"' + acgReq + '></textarea>';
        } else if (f.type === 'select') {
          control = '<select id="' + id + '" name="' + f.k + '"' + acgReq + '><option value="">' +
            (f.req ? 'Choose...' : 'No preference') + '</option>' +
            (f.options || []).map(function (o) { return '<option>' + E(o) + '</option>'; }).join('') +
            '</select>';
        } else {
          control = '<input id="' + id + '" name="' + f.k + '" type="' + f.type + '"' +
            (f.ph ? ' placeholder="' + E(f.ph) + '"' : '') + acgReq + ' autocomplete="' + acOf(f.k) + '">';
        }
        return '<div class="fld' + cls + '" data-k="' + f.k + '">' +
          '<label for="' + id + '"><span data-ck="' + pre + '.label.' + f.k + '">' + E(f.label) + '</span>' + req + '</label>' +
          control + '<div class="hint" id="' + id + '-hint"></div></div>';
      }).join('');

      return '<div class="fpanel" data-panel="' + type + '" data-on="' + (type === 'connect-host') + '"' +
        ' id="acg-panel-' + type + '" role="tabpanel" aria-labelledby="acg-tab-' + type + '">' +
        '<h3 data-ck="' + pre + '.heading">' + E(cfg.heading) + '</h3>' +
        '<p class="intro" data-ck="' + pre + '.intro">' + E(cfg.intro) + '</p>' +
        '<form novalidate data-type="' + type + '">' + fields +
          '<div class="note" role="status" aria-live="polite"></div>' +
          '<div class="full"><button type="submit" class="btn"><span data-ck="' + pre + '.button">' + E(cfg.button) + '</span></button></div>' +
        '</form>' +
      '</div>';
    };

    this.innerHTML =
      /* masthead: the season name, the hero lede and strip, and on desktop the ticker */
      '<header class="mast" id="acgMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="connect.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="connect.season.name">' + E(SEASON.name) + '</h1>' +
          '<p class="lede mast__lede" data-ck="connect.hero.body">Where real people build real faith. Don\'t do life alone - ' +
          'do life together.</p>' +
          '<div class="strip mast__strip"><span data-ck="connect.hero.strip">Connect &middot; Grow &middot; Go</span></div>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="acgTickA"></span><span id="acgTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="acgStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Connect Groups page" id="acgTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="acgTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="acgStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="acgDeck"><div class="deck__track" id="acgTrack">' +

      /* 01 about: what they are, the three pillars, the verse */
      '<section class="panel about is-active" id="acgAbout" role="tabpanel" aria-labelledby="acgTab-acgAbout">' +
        '<div class="bg bg--lh" aria-hidden="true">' +
          '<img class="ly on" alt="" width="480" height="360" fetchpriority="high" src="' + E(acgImg(ACG_ABOUT_PHOTO, 1600)) + '" data-ci="connect.about.photo" data-ciw="1600">' +
          '<div class="bg__glow"></div><div class="bg__floor"></div>' +
        '</div>' +
        '<div class="shell">' +
          '<div class="g12">' +
            '<div class="about__hd">' +
              '<div class="folio" aria-hidden="true">01</div>' +
              '<div class="mark mark--l"><span class="kicker" data-ck="connect.what.kicker">What They Are</span></div>' +
              '<h2 data-ck="connect.what.heading">In Homes,<br>Every Week</h2>' +
              '<p class="lede" data-ck="connect.what.body">Connect Groups meet in homes ' +
              'across our community. A host opens their door, a few people gather, and life gets ' +
              'shared around a table instead of a pew.</p>' +
            '</div>' +
            '<div class="about__verse"><div class="verse">' +
              '<p data-ck="connect.verse.body">And they, continuing daily with one accord in the temple, and breaking bread from ' +
              'house to house, did eat their meat with gladness and singleness of heart, praising God, ' +
              'and having favor with all the people.</p>' +
              '<cite data-ck="connect.verse.ref">Acts 2:46</cite>' +
            '</div></div>' +
          '</div>' +
          '<div class="pill">' +
            '<div class="pill__c"><div class="pill__n" data-ck="connect.pillars.item1.label">CONNECT</div>' +
              '<h3 data-ck="connect.pillars.item1.heading">Build meaningful relationships</h3>' +
              '<p data-ck="connect.pillars.item1.body">Know people and be known by them.</p></div>' +
            '<div class="pill__c"><div class="pill__n" data-ck="connect.pillars.item2.label">GROW</div>' +
              '<h3 data-ck="connect.pillars.item2.heading">Do life together</h3>' +
              '<p data-ck="connect.pillars.item2.body">Faith grows faster in company than alone.</p></div>' +
            '<div class="pill__c"><div class="pill__n" data-ck="connect.pillars.item3.label">GO</div>' +
              '<h3 data-ck="connect.pillars.item3.heading">Live it out and make an impact</h3>' +
              '<p data-ck="connect.pillars.item3.body">What happens around the table goes out the door.</p></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 02 groups: the paper room; the ConnectGroups cards or the forming box */
      '<section class="panel find" id="acgFind" role="tabpanel" aria-labelledby="acgTab-acgFind">' +
        '<div class="bg bg--rh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">02</div>' +
          '<div class="mark"><span class="kicker" data-ck="connect.groups.kicker">Find a Group</span></div>' +
          '<h2 data-ck="connect.groups.heading">Groups This Season</h2>' +
          /* the forming box is always in the page and hidden while groups are listed, so its
             Page Content rows can be edited and imported whatever the CMS holds today */
          '<div id="acgGroups">' +
            '<div class="g__none" id="acgNone" hidden><h3 data-ck="connect.groups.empty.heading">Groups are forming</h3>' +
              '<p data-ck="connect.groups.empty.body">Hosts are signing up now. Check back soon, or add your name below and we will ' +
              'match you with a group when they are set.</p></div>' +
            '<div id="acgList"></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 03 sign up: host or join */
      '<section class="panel signup" id="acgSignup" role="tabpanel" aria-labelledby="acgTab-acgSignup">' +
        '<div class="bg bg--lh" aria-hidden="true"><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">03</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="connect.signup.kicker">Sign Up</span></div>' +
          '<h2 data-ck="connect.signup.heading">Be a Host.<br>Make a Difference.</h2>' +
          '<div class="ftabs" role="tablist" aria-label="Sign-up forms">' +
            '<button type="button" class="ftab" role="tab" data-tab="connect-host" aria-selected="true"' +
              ' id="acg-tab-connect-host" aria-controls="acg-panel-connect-host" tabindex="0">' +
              '<span class="ftab__t" data-ck="connect.signup.tab1.title">Host a Group</span>' +
              '<span class="ftab__d"><span data-ck="connect.signup.tab1.body">Open your home.</span><span data-acg-hostby> <span data-ck="connect.signup.tab1.signupBy">Sign up by</span> <span data-ck="connect.season.hostby">' + E(SEASON.hostBy) + '</span>.</span></span>' +
            '</button>' +
            '<button type="button" class="ftab" role="tab" data-tab="connect-join" aria-selected="false"' +
              ' id="acg-tab-connect-join" aria-controls="acg-panel-connect-join" tabindex="-1">' +
              '<span class="ftab__t" data-ck="connect.signup.tab2.title">Join a Group</span>' +
              '<span class="ftab__d" data-ck="connect.signup.tab2.body">Find a group near you.</span>' +
            '</button>' +
          '</div>' +
          buildForm('connect-host') +
          buildForm('connect-join') +
          /* the thank-you words, in the page before any form is sent, so Page Content can edit
             them and the CMS importer finds them; the sent panel repeats the same keys */
          '<div id="acgStash" hidden aria-hidden="true">' +
            '<span data-ck="connect.success.heading">Thank You</span>' +
            '<span data-ck="connect.host.done">' + E(FORMS['connect-host'].done) + '</span>' +
            '<span data-ck="connect.join.done">' + E(FORMS['connect-join'].done) + '</span>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '</div></div>' +

      /* the call: the season dates, below the deck, above the footer, always */
      '<section class="cta" id="acgCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true">04</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="connect.dates.kicker">This Season</span></div>' +
          '<h2 class="h2--xl" data-ck="connect.dates.heading">Dates</h2>' +
          '<p class="cta__p">' +
            '<span class="cta__line"><span class="cta__lbl" data-ck="connect.dates.startsLabel">Starts</span>' +
              '<span class="cta__time" data-ck="connect.season.starts">' + E(SEASON.starts) + '</span></span>' +
            '<span class="cta__line"><span class="cta__lbl" data-ck="connect.dates.endsLabel">Ends</span>' +
              '<span class="cta__time" data-ck="connect.season.ends">' + E(SEASON.ends) + '</span></span>' +
            '<span class="cta__line" data-acg-hostby><span class="cta__lbl" data-ck="connect.dates.hostbyLabel">Host sign-up closes</span>' +
              '<span class="cta__time" data-ck="connect.season.hostby">' + E(SEASON.hostBy) + '</span></span>' +
          '</p>' +
        '</div>' +
        '<button type="button" class="btn btn--onRed cta__btn" data-to="acgSignup" data-ck="connect.cta.button">Sign Up to Host</button>' +
      '</div></section>';

    this.applyContent();
    this.setTick();
    this.bindChrome();
    this.wire();
    this.fillGroups();
    this.initDeck();
    this.initPin();
  }

  /* The ticker: the season, the strip, what they are, when it starts. */
  setTick() {
    const self = this;
    const t = function (k) { return acgText(self.querySelector('[data-ck="' + k + '"]')); };
    const parts = [t('connect.season.name'), t('connect.hero.strip'), t('connect.what.heading'),
      (t('connect.dates.startsLabel') + ' ' + t('connect.season.starts')).trim(), 'Arise Church'];
    const tick = parts.filter(Boolean).join(' \u00b7 ') + ' \u00b7 ';
    const a = this.querySelector('#acgTickA'), b = this.querySelector('#acgTickB');
    if (a && b && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }

  fillGroups() {
    const mount = this.querySelector('#acgList');
    const none = this.querySelector('#acgNone');
    if (!mount || !none) return;
    const raw = this.getAttribute('data-groups') || '';
    if (this._groupsRaw === raw && this._groupsBuilt) return;
    this._groupsRaw = raw; this._groupsBuilt = true;
    const list = this.groups();
    const E = acgEsc;

    /* nothing listed yet: the forming box, and no card grid */
    none.hidden = list.length > 0;
    if (!list.length) {
      mount.innerHTML = '';
      this.fitDeck();
      return;
    }

    const self = this;
    mount.innerHTML = '<div class="groups" data-cms-source="ConnectGroups">' + list.map(function (g, i) {
      const when = [g.day, g.time].filter(Boolean).join(' \u00b7 ');
      const rows = [
        g.hostName ? ['Host', g.hostName, 'connect.groups.card.hostLabel'] : null,
        (g.location || g.area) ? ['Where', g.location || g.area, 'connect.groups.card.whereLabel'] : null,
        when ? ['When', when, 'connect.groups.card.whenLabel'] : null,
        g.dates ? ['Dates', g.dates, 'connect.groups.card.datesLabel'] : null,
        g.audience ? ['For', g.audience, 'connect.groups.card.forLabel'] : null
      ].filter(Boolean);

      return '<div class="g">' +
        (g.flyer
          ? '<div class="g__img"><img src="' + E(acgImg(g.flyer, 1200)) + '" alt="' + E(g.title) + '" width="480" height="600" loading="lazy" decoding="async">' +
            (g.isFull ? '<span class="g__full" data-ck="connect.groups.card.fullBadge">Full</span>' : '') + '</div>'
          : '') +
        '<div class="g__b">' +
          '<h3>' + E(g.title) + '</h3>' +
          (g.description ? '<p class="g__d">' + E(g.description) + '</p>' : '') +
          '<dl class="g__facts">' + rows.map(function (r) {
            return '<dt data-ck="' + r[2] + '">' + E(r[0]) + '</dt><dd>' + E(r[1]) + '</dd>';
          }).join('') + '</dl>' +
          '<button type="button" class="btn btn--ghost g__go" data-join="' + i + '"' + (g.isFull ? ' disabled' : '') + '>' +
            (g.isFull ? '<span data-ck="connect.groups.card.fullButton">Group Full</span>' : '<span data-ck="connect.groups.card.joinButton">Join This Group</span>') + '</button>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    /* Clicking a group opens the sign-up room on the join form with that group filled in. */
    mount.querySelectorAll('.g__go').forEach(function (b) {
      b.addEventListener('click', function () {
        const g = list[parseInt(b.getAttribute('data-join'), 10)];
        if (!g) return;

        self.acgSelect('connect-join');

        const which = self.querySelector('#connect-join-subject');
        if (which) which.value = g.title || '';

        self.go('acgSignup', true);

        const panel = self.querySelector('.fpanel[data-panel="connect-join"]');
        if (panel && panel.scrollIntoView) {
          setTimeout(function () {
            try { panel.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { panel.scrollIntoView(); }
          }, 700);
        }
      });
    });
    this.applyContent();
  }

  acgSelect(t) {
    this.querySelectorAll('.ftab').forEach(function (x) {
      const on = x.getAttribute('data-tab') === t;
      x.setAttribute('aria-selected', String(on));
      x.setAttribute('tabindex', on ? '0' : '-1');
    });
    this.querySelectorAll('.fpanel').forEach(function (p) {
      p.setAttribute('data-on', String(p.getAttribute('data-panel') === t));
    });
    this.fitDeck();
  }

  wire() {
    const self = this;

    this.querySelectorAll('.ftab').forEach(function (b) {
      b.addEventListener('click', function () {
        self.acgSelect(b.getAttribute('data-tab'));
      });
      b.addEventListener('keydown', function (e) {
        const tabs = Array.prototype.slice.call(self.querySelectorAll('.ftab')).filter(function (t) { return !t.hidden; });
        const i = tabs.indexOf(b);
        let n = -1;
        if (e.key === 'ArrowRight' || e.key === 'Right') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'Left') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n < 0 || !tabs[n]) return;
        e.preventDefault();
        self.acgSelect(tabs[n].getAttribute('data-tab'));
        tabs[n].focus();
      });
    });

    /* an image that never arrives leaves the ink card, not a broken icon */
    this.addEventListener('error', function (ev) {
      const img = ev.target;
      if (img && img.tagName === 'IMG') { img.style.opacity = '0'; img.classList.remove('on'); }
    }, true);

    this.querySelectorAll('form').forEach(function (form) {
      const type = form.getAttribute('data-type');
      const cfg = FORMS[type];
      const pre = type === 'connect-host' ? 'connect.host' : 'connect.join';
      const note = form.querySelector('.note');
      const go = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        form.querySelectorAll('.fld').forEach(function (d) {
          d.classList.remove('bad');
          const h = d.querySelector('.hint'); if (h) h.textContent = '';
          const c = d.querySelector('input,select,textarea');
          if (c) { c.removeAttribute('aria-invalid'); c.removeAttribute('aria-describedby'); }
        });
        note.textContent = '';
        note.removeAttribute('data-err');

        const payload = { formType: type };
        let firstBad = null;

        cfg.fields.forEach(function (f) {
          const el = self.querySelector('#' + type + '-' + f.k);
          const val = (el && el.value ? el.value : '').trim();
          payload[f.k] = val;
          const wrap = form.querySelector('.fld[data-k="' + f.k + '"]');
          if (!wrap) return;

          if (f.req && !val) {
            wrap.classList.add('bad');
            wrap.querySelector('.hint').textContent = 'Required';
            if (el) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', type + '-' + f.k + '-hint'); }
            if (!firstBad) firstBad = el;
          } else if (f.type === 'email' && val &&
                     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            wrap.classList.add('bad');
            wrap.querySelector('.hint').textContent = 'Check this email address';
            if (el) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', type + '-' + f.k + '-hint'); }
            if (!firstBad) firstBad = el;
          }
        });

        if (firstBad) { firstBad.focus(); return; }

        /* The backend takes name / email / phone / subject / position / message.
           Fold the extra host answers into those, labelled, so the email and the
           CMS row both read properly. */
        if (payload.firstName || payload.lastName) {
          payload.name = ((payload.firstName || '') + ' ' + (payload.lastName || '')).trim();
        }

        if (type === 'connect-host') {
          payload.subject = [payload.venue, payload.area].filter(Boolean).join(' \u2014 ');
          payload.position = [payload.day, payload.time].filter(Boolean).join(' ');
          const extra = [];
          if (payload.audience) extra.push('Who it is for: ' + payload.audience);
          if (payload.message) extra.push(payload.message);
          payload.message = extra.join('\n\n');
        }

        go.setAttribute('disabled', 'true');
        note.textContent = 'Sending...';

        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error('status ' + res.status);

          const panel = form.parentNode;
          panel.innerHTML = '<h3 data-ck="' + pre + '.heading">' + acgEsc(cfg.heading) + '</h3>' +
            '<div class="done" tabindex="-1" role="status"><h3 data-ck="connect.success.heading">Thank You</h3><p data-ck="' + pre + '.done">' + acgEsc(cfg.done) + '</p></div>';
          self.applyContent();
          self.fitDeck();
          const acgDone = panel.querySelector('.done');
          if (acgDone) acgDone.focus({ preventScroll: true });

        } catch (err) {
          console.error('connect form failed:', err);
          note.setAttribute('data-err', 'true');
          note.textContent = 'Something went wrong sending that. Please try again, or email ' +
            'arisenow.church@gmail.com.';
          go.removeAttribute('disabled');
        }
      });
    });
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
    const tabs = this.querySelector('#acgTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#acgTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#acgDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'acgAbout';
    let sx = 0, sy = 0, sid = null, swiping = false;
    deck.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' || (ev.target.closest && ev.target.closest('input, select, textarea, a, button'))) { sid = null; return; }
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
      this.querySelectorAll('#acgTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#acgDeck');
    const active = this.querySelector('#acgTrack > .panel.is-active');
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
      const strap = this.querySelector('#acgStrap');
      const deck = this.querySelector('#acgDeck');
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
      if (byUser) { const t = this.querySelector('#acgTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#acgTrack');
    const deck = this.querySelector('#acgDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'acgAbout';
    this.querySelectorAll('#acgTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#acgTabs .strap__j').forEach(function (t) {
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
    const strap = this.querySelector('#acgStrap');
    const spacer = this.querySelector('#acgStrapSpacer');
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

  /* Connect Groups is host registration only until joining is opened in the CMS:
     add the Page Content row connect.join.open with the text "yes". A Page Content
     row connect.season.hostby with blank text hides the host sign-up deadline. */
  acgSignupState(map) {
    const text = function (k) {
      if (!map || !Object.prototype.hasOwnProperty.call(map, k)) return null;
      const v = map[k];
      return v && typeof v === 'object' ? String(v.text || '') : String(v == null ? '' : v);
    };
    const open = /^\s*(yes|true|open|on|1)\s*$/i.test(text('connect.join.open') || '');
    const joinTab = this.querySelector('#acg-tab-connect-join');
    const joinPanel = this.querySelector('.fpanel[data-panel="connect-join"]');
    if (joinTab) joinTab.hidden = !open;
    if (joinPanel) joinPanel.hidden = !open;
    this.querySelectorAll('.g__go').forEach(function (b) { b.hidden = !open; });
    if (!open && joinTab && joinTab.getAttribute('aria-selected') === 'true') this.acgSelect('connect-host');

    const hostBy = text('connect.season.hostby');
    const noDeadline = hostBy !== null && hostBy.replace(/<[^>]*>/g, '').trim() === '';
    this.querySelectorAll('[data-acg-hostby]').forEach(function (el) { el.hidden = noDeadline; });
  }

  applyContent() {
    const raw = this.getAttribute('data-content');
    let map = null;
    if (raw) {
      try { map = JSON.parse(raw); } catch (e) { console.error('bad data-content JSON', e); map = null; }
    }
    this.acgSignupState(map && typeof map === 'object' ? map : null);
    if (!map || typeof map !== 'object') return;

    this.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (v.text) el.innerHTML = v.text;
    });
    this.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (!v.image) return;
      const w = Number(el.getAttribute('data-ciw')) || 1600;
      if (el.tagName === 'IMG') el.src = acgImg(v.image, w);
      else el.style.backgroundImage = 'url("' + String(acgImg(v.image, w)).replace(/["\\]/g, '') + '")';
    });
  }
}

customElements.define('arise-connect', AriseConnect);
