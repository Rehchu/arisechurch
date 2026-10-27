/* ===========================================================================
   ARISE CHURCH -- BIBLE SEARCH  ("House Lights Down")
   File: public/custom-elements/arise-bible.js
   Tag:  arise-bible

   Rebuilt 2026-10-27. The same theatre as the Media page: a compact masthead,
   a numbered tab strap that locks to the top of the screen, one room on stage
   at a time sliding in from the side, red footlights along each room's
   diagonal cut, and the "Hear It Taught" invitation always below the deck,
   above the footer.

   The rooms:  01 Read     the Bible, the reference, the verses
               02 Study    study notes and the Easton / Smith dictionary for the passage on screen
               03 Listen   narrated chapters (Berean Standard Bible, Accessible Ancients Bible)
               04 Bibles   every Bible, one list - pick one

   The browser never talks to a Bible source. Everything comes from the site's
   own HTTP functions (backend/http-functions.js -> backend/bible.js), which
   hold the API keys:
       /_functions/bible?ref=John+3:16&translation=BSB
       /_functions/bibleBibles   /_functions/bibleBooks
       /_functions/bibleReference?ref=...   /_functions/bibleDictionary?slug=|q=
   /_functions/ URLs only run on the LIVE site, not in Preview.

   INSTALL (already in place for this page)
   1. The Bible Search page holds one Custom Element, Velo file arise-bible.js,
      tag name arise-bible, stretched full width. No page code is needed; the
      master page sends data-content (Page Content) to every custom element.
   2. Save, then PUBLISH. Check the LIVE page.

   Attributes:
     data-content   Page Content map (data-ck hooks; see cms/manifest/arise-bible.json)
     data-api       optional base for the HTTP functions (default "/_functions/")
   Deep links: /arise-bible?ref=Romans+8:28&bible=BSB opens on that passage.
   =========================================================================== */

const ABI_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

/* A few starting points for people who don't know where to begin. */
const SUGGESTIONS = [
  ['John 3:16',            'John 3:16'],
  ['Psalm 23',             'Psalm 23'],
  ['Romans 8:28',          'Romans 8:28'],
  ['1 Corinthians 13:4-7', '1 Corinthians 13:4-7'],
  ['Philippians 4:6-7',    'Philippians 4:6-7'],
  ['Isaiah 40:31',         'Isaiah 40:31']
];

/* Which Bible opens first, when nothing was chosen before: by name, in order,
   whichever is in the list. The list is whatever the site's keys unlock. */
const PREFERRED = [/^new international version/i, /^berean standard bible/i, /^english standard version/i,
                   /^new living translation/i, /^king james version/i];

/* The 66 books, in order, for prev / next across a book boundary when the
   server's list is late. Chapter counts come from the server. */
const FALLBACK_BOOKS = ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings','2 Kings',
  '1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations',
  'Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke',
  'John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy',
  '2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'].map(function (n) { return { name: n, chapters: 0 }; });

const CHEV_L = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M9.5 1.5 4 7l5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const CHEV_R = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M4.5 1.5 10 7l-5.5 5.5" stroke="currentColor" stroke-width="1.6"/></svg>';
const PLAY_SVG = '<svg width="12" height="14" viewBox="0 0 14 16" fill="none" aria-hidden="true"><path d="M14 8L0 16V0L14 8Z" fill="currentColor"/></svg>';

const ABI_CSS = `
arise-bible{display:block;width:100%}
.abi *{box-sizing:border-box;margin:0;padding:0}
.abi{
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
@media(min-width:900px){.abi{--cut:48px;--foot:5px}}
.abi [hidden]{display:none!important}
.abi h1,.abi h2,.abi h3,.abi p,.abi button,.abi input,.abi select,.abi audio,.abi dl,.abi dt,.abi dd{margin:0;padding:0;border:0}
.abi .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut);width:100%}
.abi .g12{display:grid;grid-template-columns:1fr;gap:24px}
@media(min-width:900px){.abi .g12{grid-template-columns:repeat(12,1fr)}}
.abi h1,.abi h2,.abi h3,.abi .folio,.abi .cnt b,.abi .verse b,.abi .bib__i,.abi .note__v,.abi .chap__n{
  font-family:'Anton',Impact,'Arial Narrow',sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.abi h2{font-size:var(--h2s);color:#fff;overflow-wrap:anywhere}
.abi .h2--xl{font-size:var(--h2)}
.abi h3{font-size:var(--h3);color:#fff}
.abi p{font-size:var(--body);line-height:1.6}
.abi .lede{font-size:var(--lede);line-height:1.62;color:rgba(255,255,255,.82);max-width:58ch;margin-top:18px}
.abi a{color:inherit}

/* ---- house devices ---- */
.abi .mark{display:flex;align-items:center;margin-bottom:18px}
.abi .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);box-shadow:62px 0 0 var(--red);margin-right:80px}
.abi .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;color:var(--red);white-space:nowrap}
@media(max-width:620px){
  .abi .mark{flex-wrap:nowrap;align-items:flex-start}
  .abi .mark::before{margin-right:124px;margin-top:5px}
  .abi .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.abi .mark--l .kicker{color:var(--redL)}
.abi .mark--w::before{background:#fff;box-shadow:62px 0 0 #fff}
.abi .mark--w .kicker{color:#fff}
.abi .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;max-width:100%}
.abi .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.abi .strip--ghost{background:transparent;border:1.5px solid #fff}
.abi .strip--ghost span{color:#fff}
.abi .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s;line-height:1.3;min-height:44px;font-family:inherit}
.abi .btn:hover{background:transparent;color:#fff;border-color:#fff}
.abi .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.abi .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.abi .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.abi .btn--dark:hover{background:var(--ink);color:#fff}
.abi .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.abi .btn--onRed:hover{background:transparent;color:#fff}
.abi .btn[disabled]{opacity:.55;pointer-events:none}
.abi a:focus-visible,.abi button:focus-visible,.abi input:focus-visible,.abi select:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.abi .folio{font-size:13px;color:var(--redL);letter-spacing:.12em;margin-bottom:10px;line-height:1}
.abi .folio--d{color:var(--red)}
.abi .folio--w{color:#fff}
.abi .ulink{display:inline-block;position:relative;color:#fff;font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  text-decoration:none;padding:14px 0;line-height:1.3;background:none;border:0;cursor:pointer;font-family:inherit}
.abi .ulink::after{content:"";position:absolute;left:0;bottom:9px;height:2px;width:36%;background:var(--red);transition:width .2s var(--ease)}
.abi .ulink:hover::after,.abi .ulink:focus-visible::after{width:100%}
.abi .ulink--d{color:var(--ink)}

/* ---- clipped backdrops + footlight ---- */
.abi .bg{position:absolute;inset:0;overflow:hidden;z-index:0;pointer-events:none}
.abi .bg--lh{clip-path:polygon(0 0,100% 0,100% calc(100% - var(--cut)),0 100%)}
.abi .bg--rh{clip-path:polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))}
.abi .bg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:calc(var(--cut) + var(--foot));background:var(--red)}
.abi .bg--lh::after{clip-path:polygon(0 calc(100% - var(--foot)),100% 0,100% var(--foot),0 100%)}
.abi .bg--rh::after{clip-path:polygon(0 0,100% calc(100% - var(--foot)),100% 100%,0 var(--foot))}
.abi .bg__glow{position:absolute;inset:0;background:radial-gradient(40% 50% at 85% 10%,rgba(214,34,45,.28),transparent 70%)}
.abi .bg__floor{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,var(--ink) 100%)}
@media(min-width:900px){.abi .bg__glow{background:radial-gradient(60% 70% at 85% 50%,rgba(214,34,45,.28),transparent 70%)}}
.abi .bg__page{position:absolute;inset:0;opacity:.07;
  background-image:repeating-linear-gradient(0deg,transparent 0 31px,#fff 31px 32px);background-size:100% 32px}
.abi .bg__wedge{position:absolute;top:0;right:0;width:260px;height:180px;background:var(--red);clip-path:polygon(0 0,100% 0,100% 100%);opacity:.9}

/* ---- masthead ---- */
.abi .mast{position:relative;background:var(--ink);padding:32px 0 20px}
.abi .mast::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--ruleD)}
.abi .mast__in{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.abi .mast h1{font-size:clamp(48px,9vw,104px);line-height:.92;color:#fff;overflow-wrap:anywhere}
.abi .mast__tick{display:none;flex:0 1 44%;min-width:0;overflow:hidden;padding-bottom:14px;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.abi .mast__tick div{display:flex;width:max-content;white-space:nowrap;animation:abiTick 36s linear infinite}
.abi .mast__tick:hover div{animation-play-state:paused}
.abi .mast__tick span{font-size:12px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--redL);padding-right:1.2em}
@media(min-width:900px){.abi .mast{padding:44px 0 26px}.abi .mast__tick{display:block}}

/* ---- the strap: the running order as tabs; locks to the top of the screen while the deck is in view ---- */
.abi .strap{position:sticky;top:0;z-index:6;background:var(--ink);border-top:1px solid var(--red);border-bottom:1px solid var(--ruleD)}
.abi .strap.pinned{position:fixed;left:0;right:0;width:auto;box-shadow:0 8px 24px rgba(0,0,0,.35);transition:top .25s var(--ease)}
.abi .strap__spacer{height:0}
.abi .strap__in{display:flex;align-items:center;min-height:48px;gap:12px}
.abi .strap__jump{display:flex;align-items:stretch;overflow-x:auto;scrollbar-width:none;margin:0 calc(-1*var(--gut));padding:0 var(--gut);flex:1 1 auto}
.abi .strap__jump::-webkit-scrollbar{display:none}
.abi .strap__j{position:relative;flex:0 0 auto;min-height:48px;padding:0 16px;background:transparent;border:0;border-left:1px solid var(--ruleD);color:rgba(255,255,255,.72);
  font:500 12px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;white-space:nowrap;
  display:inline-flex;align-items:center;gap:8px;transition:background .18s,color .18s}
.abi .strap__j:first-child{border-left:0}
.abi .strap__j i{font-style:normal;color:var(--redL);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em}
@media(max-width:620px){
  .abi .strap__jump{overflow:visible;margin:0;padding:0}
  .abi .strap__j{flex:1 1 0;min-width:0;flex-direction:column;justify-content:center;gap:4px;padding:7px 2px;min-height:52px;
    font-size:10px;letter-spacing:.06em;white-space:normal;text-align:center;line-height:1.1}
  .abi .strap__j i{font-size:12px}
}
.abi .strap__j::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.abi .strap__j:hover{background:rgba(255,255,255,.06);color:#fff}
.abi .strap__j[aria-selected="true"]{color:#fff;background:rgba(255,255,255,.04)}
.abi .strap__j[aria-selected="true"]::after{transform:scaleX(1)}
.abi .strap__j:focus-visible{outline-offset:-3px}
.abi .strap__arrows{display:none;flex:0 0 auto;gap:6px}
.abi .strap__arrow{width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--ruleD);color:#fff;cursor:pointer;transition:background .18s,opacity .18s}
.abi .strap__arrow:hover{background:rgba(255,255,255,.08)}
.abi .strap__arrow[disabled]{opacity:.3;cursor:default}
@media(min-width:900px){
  .abi .strap__jump{overflow:visible;margin:0;padding:0}
  .abi .strap__j{padding:0 20px}
  .abi .strap__arrows{display:flex}
}

/* ---- the deck ---- */
.abi .deck{position:relative;z-index:1;overflow:hidden;background:transparent;transition:height .5s var(--ease);touch-action:pan-y pinch-zoom}
.abi .deck__track{display:flex;align-items:flex-start;transition:transform .55s var(--ease)}
.abi .panel{flex:0 0 100%;width:100%;min-width:0;position:relative}
.abi .panel:not(.is-active){visibility:hidden}
.abi .deck.moving .panel{visibility:visible}
.abi .panel.enter > .shell{animation:abiRise .55s var(--ease) both}

/* ---- 01 read ---- */
.abi .read{position:relative;background:var(--scrim);padding:36px 0 calc(40px + var(--cut))}
@media(min-width:900px){.abi .read{padding:56px 0 calc(56px + var(--cut))}}
.abi .read .bg{background:linear-gradient(180deg,var(--ink) 0%,var(--scrim) 60%)}
.abi .read > .shell{position:relative;z-index:1}
.abi .bar{margin-top:28px;background:var(--ink);border:1px solid var(--ruleD);border-top:3px solid var(--red);padding:clamp(18px,3vw,32px)}
.abi .bar__row{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:900px){.abi .bar__row{grid-template-columns:minmax(220px,2fr) minmax(200px,3fr) auto;align-items:end}}
.abi .field label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.72);margin-bottom:9px}
.abi .field select,.abi .field input{width:100%;background:transparent;border:0;border-bottom:1.5px solid rgba(255,255,255,.32);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:17px;color:#fff;border-radius:0;min-height:48px}
.abi .field select{appearance:none;-webkit-appearance:none;padding-right:28px;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpath d='M2 5l5 5 5-5' fill='none' stroke='%23DB3F48' stroke-width='1.6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 2px center}
.abi .field select option,.abi .field select optgroup{background:#0A0A0C;color:#fff}
.abi .field input::placeholder{color:rgba(255,255,255,.4)}
.abi .field select:focus,.abi .field input:focus{outline:none;border-bottom-color:var(--red)}
.abi .bar .btn{width:100%}
@media(min-width:900px){.abi .bar .btn{width:auto;min-height:48px}}
.abi .chips{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}
.abi .chip{background:transparent;border:1px solid rgba(255,255,255,.28);color:rgba(255,255,255,.86);font-family:inherit;font-size:12px;font-weight:400;
  letter-spacing:.1em;padding:10px 14px;min-height:40px;cursor:pointer;transition:background .18s,border-color .18s}
.abi .chip:hover{background:var(--red);border-color:var(--red);color:#fff}

/* the chapter line: book / chapter pickers, prev / next */
.abi .chap{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin-top:22px}
.abi .chap .field{flex:1 1 150px}
.abi .chap .field label{margin-bottom:4px}
.abi .chap .field select{padding:8px 28px 8px 0;min-height:44px;font-size:15px}
.abi .chap__nav{display:flex;gap:8px;flex:0 0 auto;margin-left:auto}
.abi .chap__btn{min-width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;background:transparent;border:1.5px solid #fff;
  color:#fff;cursor:pointer;font:600 11px/1 'Oswald',Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;transition:background .18s,color .18s}
.abi .chap__btn:hover{background:#fff;color:var(--ink)}
.abi .chap__btn[disabled]{opacity:.3;pointer-events:none}

/* the passage */
.abi .out{margin-top:36px;min-height:120px}
.abi .out__hd{display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px}
.abi .out__trans{font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62)}
.abi .status{font-size:15px;color:rgba(255,255,255,.72);letter-spacing:.03em;margin-top:18px}
.abi .status--err{color:var(--redL)}
.abi .passage{margin-top:22px;max-width:68ch;font-size:var(--read);line-height:1.8;color:rgba(255,255,255,.92);font-weight:300}
.abi .passage.loading{opacity:.35}
.abi .verse{display:inline}
.abi .verse b{font-size:.62em;color:var(--redL);vertical-align:.45em;margin:0 .35em 0 .55em;letter-spacing:0;line-height:1}
.abi .verse:first-child b{margin-left:0}
.abi .verse--block{display:block;margin-top:.5em}
.abi .verse--block b{margin-left:0}
.abi .note{margin-top:22px;padding:14px 18px;border-left:3px solid var(--red);background:rgba(255,255,255,.04);font-size:14px;color:rgba(255,255,255,.8);max-width:68ch}
.abi .copy{margin-top:24px;font-size:12px;letter-spacing:.06em;color:rgba(255,255,255,.5);max-width:80ch;line-height:1.6}
.abi .copy a{color:rgba(255,255,255,.7)}
.abi .tools{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.abi .tools .btn{min-height:44px;padding:12px 20px}
.abi .skel{margin-top:22px;max-width:68ch}
.abi .skel i{display:block;height:14px;margin:12px 0;background:rgba(255,255,255,.08);animation:abiPulse 1.2s ease-in-out infinite}
.abi .skel i:nth-child(2){width:92%}.abi .skel i:nth-child(3){width:78%}.abi .skel i:nth-child(4){width:85%}

/* ---- 02 study ---- */
.abi .study{position:relative;background:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.abi .study{padding:64px 0 calc(72px + var(--cut))}}
.abi .study .bg{background:var(--ink)}
.abi .study > .shell{position:relative;z-index:1}
.abi .study__grid{margin-top:32px}
.abi .notes{list-style:none;margin-top:18px;border-top:1px solid var(--ruleD)}
.abi .notes li{display:grid;grid-template-columns:52px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid var(--ruleD);font-size:15px;line-height:1.6;color:rgba(255,255,255,.86)}
.abi .note__v{font-size:22px;color:var(--redL);padding-top:2px}
.abi .notes__from{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:12px}
.abi .dict{list-style:none;margin-top:18px}
.abi .dict li{border-top:1px solid var(--ruleD);padding:18px 0}
.abi .dict li:last-child{border-bottom:1px solid var(--ruleD)}
.abi .dict__hd{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.abi .dict__hd h3{font-size:clamp(20px,2vw,26px)}
.abi .dict__src{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--redL)}
.abi .dict__v{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)}
.abi .dict__x{margin-top:8px;font-size:15px;line-height:1.6;color:rgba(255,255,255,.82);max-width:70ch}
.abi .dict__more{margin-top:6px;padding:10px 0}
.abi .dict__full{margin-top:10px;max-width:70ch}
.abi .dict__full h4{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--redL);margin-top:14px}
.abi .dict__full p{margin-top:6px;font-size:15px;line-height:1.65;color:rgba(255,255,255,.86)}
.abi .lookup{margin-top:36px;padding-top:28px;border-top:1px solid var(--ruleD)}
.abi .lookup__row{display:flex;gap:12px;align-items:end;margin-top:14px;max-width:560px}
.abi .lookup__row .field{flex:1 1 auto}
.abi .attr{margin-top:28px;font-size:12px;letter-spacing:.04em;color:rgba(255,255,255,.45);max-width:80ch;line-height:1.6}
.abi .empty{margin-top:18px;font-size:15px;color:rgba(255,255,255,.6)}
@media(min-width:900px){
  .abi .study__notes{grid-column:1/6}
  .abi .study__dict{grid-column:7/13}
}

/* ---- 03 listen ---- */
.abi .listen{position:relative;background:var(--scrim);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.abi .listen{padding:64px 0 calc(72px + var(--cut))}}
.abi .listen .bg{background:var(--scrim)}
.abi .listen > .shell{position:relative;z-index:1}
.abi .player{margin-top:32px;background:var(--ink);border:1px solid var(--ruleD);border-top:3px solid var(--red);padding:clamp(18px,3vw,32px)}
.abi .player__now{font-weight:500;font-size:18px;color:#fff;line-height:1.4}
.abi .player__who{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:6px}
.abi .narr{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}
.abi .narr button{background:transparent;border:1px solid rgba(255,255,255,.28);color:#fff;font-family:inherit;font-size:12px;font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;padding:10px 16px;min-height:40px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .18s,border-color .18s}
.abi .narr button[aria-pressed="true"]{background:var(--red);border-color:var(--red)}
.abi .player audio{display:block;width:100%;margin-top:20px;filter:invert(1) hue-rotate(180deg) contrast(.9)}
.abi .cnt{display:block;margin-top:14px}
.abi .cnt b{display:block;font-size:var(--fig);color:var(--red);line-height:.9}
.abi .cnt small{display:block;font-size:12px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:8px}
.abi .listen__side{margin-top:24px}
@media(min-width:900px){
  .abi .listen__main{grid-column:1/8}
  .abi .listen__side{grid-column:9/13;margin-top:0;align-self:end}
}

/* ---- 04 bibles ---- */
.abi .bibles{position:relative;background:transparent;color:var(--ink);padding:48px 0 calc(56px + var(--cut))}
@media(min-width:900px){.abi .bibles{padding:64px 0 calc(72px + var(--cut))}}
.abi .bibles .bg{background:var(--bone)}
.abi .bibles > .shell{position:relative;z-index:1}
.abi .bibles h2{color:var(--ink)}
.abi .bibles .lede{color:var(--muted)}
.abi .bibles .cnt b{color:var(--red)}
.abi .bibles .cnt small{color:var(--muted)}
.abi .bibles__hd{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:18px;margin-top:28px}
.abi .bibles .field label{color:var(--muted)}
.abi .bibles .field input{color:var(--ink);border-bottom-color:rgba(10,10,12,.3)}
.abi .bibles .field input::placeholder{color:rgba(10,10,12,.4)}
.abi .bibles__filter{flex:1 1 260px;max-width:420px}
.abi .wall{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-top:24px}
@media(min-width:900px){.abi .wall{grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:18px}}
.abi .bib{position:relative;display:block;min-height:150px;background:var(--ink);border:0;padding:14px 14px 16px;color:#fff;text-align:left;cursor:pointer;font:inherit;
  -webkit-tap-highlight-color:transparent;overflow:hidden}
.abi .bib__i{display:block;font-size:34px;line-height:1;color:var(--redL)}
.abi .bib__t{display:block;margin-top:auto;padding-top:28px;font-weight:500;font-size:15px;line-height:1.25;color:#fff}
.abi .bib__m{display:block;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:6px}
.abi .bib__m i{font-style:normal;color:var(--redL)}
.abi .bib::after{content:"";position:absolute;left:0;right:0;bottom:0;height:6px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .25s var(--ease)}
.abi .bib[aria-pressed="true"]::after{transform:scaleX(1)}
.abi .bib[aria-pressed="true"] .bib__i{color:#fff;background:var(--red);display:inline-block;padding:2px 6px}
.abi .bib:hover{background:#15151a}
.abi .bib:focus-visible{outline:3px solid var(--red);outline-offset:3px}
@media(min-width:900px){.abi .bib{min-height:190px;padding:16px}.abi .bib__i{font-size:44px}.abi .bib__t{font-size:17px}}
.abi .bibles__btn{margin-top:36px}

/* ---- hear it taught: the red curtain every room's cut lands on ---- */
.abi .cta{position:relative;z-index:0;background:var(--red);color:#fff;margin-top:calc(-1*var(--cut));padding:calc(48px + var(--cut)) 0 56px}
@media(min-width:900px){.abi .cta{padding:calc(64px + var(--cut)) 0 80px}}
.abi .cta h2{color:#fff}
.abi .cta__p{margin-top:28px;font-size:17px;font-weight:400;color:rgba(255,255,255,.92);max-width:44ch;line-height:1.5}
.abi .cta__line{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.28)}
.abi .cta__line:first-child{border-top:0;padding-top:0}
.abi .cta__time{font-family:'Anton',Impact,sans-serif;font-weight:400;font-size:24px;color:#fff;text-transform:uppercase;letter-spacing:.02em;
  white-space:nowrap;text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:6px;line-height:1.1}
.abi .cta__btn{display:block;width:100%;text-align:center;min-height:52px;margin-top:26px;padding:17px 30px}
.abi .cta a:focus-visible,.abi .cta button:focus-visible{outline-color:#fff}
@media(min-width:900px){
  .abi .cta__txt{grid-column:1/8}
  .abi .cta__p{font-size:19px;max-width:none}
  .abi .cta__line{padding:18px 0}
  .abi .cta__time{font-size:30px}
  .abi .cta__btn{grid-column:9/13;align-self:center;justify-self:end;display:inline-flex;width:auto;margin:0;padding:19px 38px;min-height:56px}
}

/* ---- motion ---- */
@keyframes abiTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes abiRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes abiPulse{0%,100%{opacity:.5}50%{opacity:1}}
.abi .r{transition:opacity .6s var(--ease),transform .6s var(--ease)}
.abi-js:not(.abi-settled) .r:not(.in){opacity:0;transform:translateY(18px)}
.abi-settled .r:not(.in){transition:none}
@media(prefers-reduced-motion:reduce){
  .abi *,.abi *::before,.abi *::after{animation:none!important;transition:none!important}
  .abi .r{opacity:1!important;transform:none!important}
  .abi .mast__tick div{animation:none;width:100%}
  .abi .mast__tick span:last-child{display:none}
  .abi .mast__tick span{overflow:hidden;text-overflow:ellipsis;display:block}
  .abi .deck,.abi .deck__track{transition:none}
  .abi .panel.enter > .shell{animation:none}
}
`;

function abiEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function abiPad(n) { return (n < 10 ? '0' : '') + n; }

/* Arise Church photos: ask Wix for a resized copy (whole image, longest side at
   most w, AVIF/WebP picked per browser). Anything else is left alone. */
function abiImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('abi-fonts') && !document.querySelector('link[href="' + ABI_FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'abi-fonts'; l.rel = 'stylesheet'; l.href = ABI_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('abi-css')) {
    const s = document.createElement('style');
    s.id = 'abi-css'; s.innerHTML = ABI_CSS;
    document.head.appendChild(s);
  }
}

/* The running order: tab number, label, the room (panel) it shows. */
const JUMPS = [['01', 'Read', 'abiRead'], ['02', 'Study', 'abiStudy'], ['03', 'Listen', 'abiListen'], ['04', 'Bibles', 'abiBibles']];

/* Session memory: the Bible list and the book list change rarely; keep them
   for an hour so the second page view opens at once. */
function abiRemember(key, value) { try { sessionStorage.setItem('abi:' + key, JSON.stringify({ at: Date.now(), value: value })); } catch (e) { /* private mode */ } }
function abiRecall(key, maxAge) {
  try {
    const raw = sessionStorage.getItem('abi:' + key);
    if (!raw) return null;
    const o = JSON.parse(raw);
    return o && o.at && Date.now() - o.at < maxAge ? o.value : null;
  } catch (e) { return null; }
}

class AriseBible extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback(name) { if (this._b && name === 'data-content') this.applyContent(); }

  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();
    this.classList.add('abi');
    this._bibles = [];        // the merged list from the server
    this._books = FALLBACK_BOOKS.slice();
    this._passage = null;
    this._ref = '';
    this._bible = '';
    this._reqId = 0;

    const chips = SUGGESTIONS.map(function (s, i) {
      return '<button type="button" class="chip" data-ref="' + abiEsc(s[1]) + '"><span data-ck="bible.suggest.item' + (i + 1) + '">' + abiEsc(s[0]) + '</span></button>';
    }).join('');

    this.innerHTML =
      /* masthead: the page title, and on desktop the "now reading" ticker */
      '<header class="mast" id="abiMast"><div class="shell mast__in">' +
        '<div class="mast__txt">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="bible.hero.kicker">Resources</span></div>' +
          '<h1 data-ck="bible.hero.heading">Bible Search</h1>' +
        '</div>' +
        '<div class="mast__tick" aria-hidden="true"><div><span id="abiTickA"></span><span id="abiTickB"></span></div></div>' +
      '</div></header>' +

      /* the strap: the running order as tabs */
      '<div class="strap" id="abiStrap">' +
        '<div class="shell"><div class="strap__in">' +
          '<div class="strap__jump" role="tablist" aria-label="Sections of the Bible page" id="abiTabs">' +
            JUMPS.map(function (j, i) {
              return '<button type="button" class="strap__j" role="tab" id="abiTab-' + j[2] + '" aria-controls="' + j[2] + '" aria-selected="' + (i === 0 ? 'true' : 'false') +
                '" tabindex="' + (i === 0 ? '0' : '-1') + '" data-to="' + j[2] + '"><i aria-hidden="true">' + j[0] + '</i>' + j[1] + '</button>';
            }).join('') +
          '</div>' +
          '<span class="strap__arrows">' +
            '<button type="button" class="strap__arrow" data-step="-1" aria-label="Previous section">' + CHEV_L + '</button>' +
            '<button type="button" class="strap__arrow" data-step="1" aria-label="Next section">' + CHEV_R + '</button>' +
          '</span>' +
        '</div></div>' +
      '</div>' +
      '<div class="strap__spacer" id="abiStrapSpacer" aria-hidden="true"></div>' +

      /* the deck: one room on stage at a time */
      '<div class="deck" id="abiDeck"><div class="deck__track" id="abiTrack">' +

      /* 01 read */
      '<section class="panel read is-active" id="abiRead" role="tabpanel" aria-labelledby="abiTab-abiRead">' +
        '<div class="bg bg--lh" aria-hidden="true"><div class="bg__page"></div><div class="bg__wedge"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">01</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="bible.search.kicker">Look Up A Passage</span></div>' +
          '<h2 data-ck="bible.search.heading">Read It<br>For Yourself</h2>' +
          '<div class="bar" role="search">' +
            '<div class="bar__row">' +
              '<div class="field"><label for="abiBible" data-ck="bible.form.versionLabel">Bible</label>' +
                '<select id="abiBible" aria-describedby="abiStatus"><option value="">Loading Bibles\u2026</option></select></div>' +
              '<div class="field"><label for="abiRef" data-ck="bible.form.verseLabel">Verse or chapter</label>' +
                '<input id="abiRef" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="John 3:16   or   Psalm 23   or   Matthew 5:1-7:29"></div>' +
              '<button type="button" class="btn" id="abiGo"><span data-ck="bible.form.button">Read</span></button>' +
            '</div>' +
            '<div class="chips">' + chips + '</div>' +
            '<div class="chap">' +
              '<div class="field"><label for="abiBook">Book</label><select id="abiBook"></select></div>' +
              '<div class="field"><label for="abiChapter">Chapter</label><select id="abiChapter"></select></div>' +
              '<span class="chap__nav">' +
                '<button type="button" class="chap__btn" id="abiPrev" aria-label="Previous chapter">' + CHEV_L + '<span>Prev</span></button>' +
                '<button type="button" class="chap__btn" id="abiNext" aria-label="Next chapter"><span>Next</span>' + CHEV_R + '</button>' +
              '</span>' +
            '</div>' +
          '</div>' +
          '<div class="out" id="abiOut" aria-live="polite" aria-busy="false" data-cms-source="Bible sources">' +
            '<div class="out__hd">' +
              '<div class="strip" id="abiRefStrip" hidden><span id="abiRefText"></span></div>' +
              '<span class="out__trans" id="abiTransName"></span>' +
            '</div>' +
            '<p class="status" id="abiStatus">Pick a Bible and type a verse, a passage or a whole chapter.</p>' +
            '<div class="skel" id="abiSkel" hidden aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
            '<div class="passage" id="abiVerses"></div>' +
            '<p class="note" id="abiNote" hidden></p>' +
            '<p class="copy" id="abiCopy" hidden></p>' +
            '<div class="tools" id="abiTools" hidden>' +
              '<button type="button" class="btn btn--ghost" id="abiCopyBtn">Copy with reference</button>' +
              '<button type="button" class="btn btn--ghost" id="abiShareBtn">Share this passage</button>' +
              '<button type="button" class="btn btn--ghost" id="abiStudyBtn" data-to="abiStudy">Study notes</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 02 study */
      '<section class="panel study" id="abiStudy" role="tabpanel" aria-labelledby="abiTab-abiStudy">' +
        '<div class="bg bg--rh" aria-hidden="true"><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell">' +
          '<div class="folio" aria-hidden="true">02</div>' +
          '<div class="mark mark--l"><span class="kicker" data-ck="bible.study.kicker">Go Deeper</span></div>' +
          '<h2 data-ck="bible.study.heading">Study<br>The Passage</h2>' +
          '<p class="lede" data-ck="bible.study.lede">Translator\u2019s notes on the verses you are reading, and what Easton\u2019s and Smith\u2019s Bible dictionaries wrote about the people, places and words in them.</p>' +
          '<div class="g12 study__grid">' +
            '<div class="study__notes">' +
              '<div class="strip"><span>Study notes</span></div>' +
              '<p class="status" id="abiNotesStatus">Read a passage first.</p>' +
              '<ul class="notes" id="abiNotes" hidden></ul>' +
              '<p class="notes__from" id="abiNotesFrom" hidden></p>' +
            '</div>' +
            '<div class="study__dict" id="abiDictWrap">' +
              '<div class="strip"><span>In the dictionaries</span></div>' +
              '<p class="status" id="abiDictStatus">Read a passage first.</p>' +
              '<ul class="dict" id="abiDict" hidden></ul>' +
              '<div class="lookup" id="abiLookup">' +
                '<div class="mark mark--l"><span class="kicker">Look up a word</span></div>' +
                '<div class="lookup__row">' +
                  '<div class="field"><label for="abiDictQ">Name, place or word</label>' +
                    '<input id="abiDictQ" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="Shepherd, Capernaum, Pharisees\u2026"></div>' +
                  '<button type="button" class="btn btn--ghost" id="abiDictGo">Look up</button>' +
                '</div>' +
                '<ul class="dict" id="abiDictResults" hidden></ul>' +
              '</div>' +
              '<p class="attr" id="abiDictAttr" hidden></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 03 listen */
      '<section class="panel listen" id="abiListen" role="tabpanel" aria-labelledby="abiTab-abiListen">' +
        '<div class="bg bg--lh" aria-hidden="true"><div class="bg__glow"></div><div class="bg__floor"></div></div>' +
        '<div class="shell g12">' +
          '<div class="listen__main">' +
            '<div class="folio" aria-hidden="true">03</div>' +
            '<div class="mark mark--l"><span class="kicker" data-ck="bible.listen.kicker">Hear The Word</span></div>' +
            '<h2 data-ck="bible.listen.heading">Listen To<br>This Chapter</h2>' +
            '<p class="lede" data-ck="bible.listen.lede">Narrated chapters of the Berean Standard Bible and the Accessible Ancients Bible. Recordings are per chapter, so the whole chapter plays whatever verses are on screen.</p>' +
            '<div class="player" id="abiPlayer">' +
              '<p class="player__now" id="abiPlayerNow">Nothing playing yet</p>' +
              '<p class="player__who" id="abiPlayerWho"></p>' +
              '<div class="narr" id="abiNarrators" role="group" aria-label="Narrator"></div>' +
              '<audio id="abiAudio" controls preload="none" hidden></audio>' +
              '<p class="status" id="abiListenStatus">Read a chapter first.</p>' +
              '<div class="tools" id="abiListenTools" hidden>' +
                '<button type="button" class="btn" id="abiListenSwitch"></button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="listen__side">' +
            '<p class="cnt"><b id="abiAudioCount">2</b><small>narrated Bibles</small></p>' +
            '<p class="lede" style="margin-top:14px">Pick one of them in the list under 04 Bibles and every chapter comes with a player.</p>' +
            '<button type="button" class="ulink" data-to="abiBibles">See the Bibles</button>' +
          '</div>' +
        '</div>' +
      '</section>' +

      /* 04 bibles */
      '<section class="panel bibles" id="abiBibles" role="tabpanel" aria-labelledby="abiTab-abiBibles">' +
        '<div class="bg bg--rh" aria-hidden="true"></div>' +
        '<div class="shell">' +
          '<div class="folio folio--d" aria-hidden="true">04</div>' +
          '<div class="mark"><span class="kicker" data-ck="bible.bibles.kicker">Every Translation</span></div>' +
          '<h2 data-ck="bible.bibles.heading">The Bibles</h2>' +
          '<p class="lede" data-ck="bible.bibles.lede">Modern and traditional, word-for-word and easy reading. Pick one and the passage you were reading opens in it.</p>' +
          '<div class="bibles__hd">' +
            '<p class="cnt"><b id="abiBibleCount">\u2026</b><small>Bibles to read</small></p>' +
            '<div class="field bibles__filter"><label for="abiBibleFilter">Find a Bible</label>' +
              '<input id="abiBibleFilter" type="search" autocomplete="off" placeholder="NIV, King James, Standard\u2026"></div>' +
          '</div>' +
          '<div class="wall" id="abiBibleWall" role="group" aria-label="Bibles"></div>' +
          '<p class="status" id="abiWallStatus" hidden></p>' +
        '</div>' +
      '</section>' +

      '</div></div>' +

      /* hear it taught: below the deck, above the footer, always */
      '<section class="cta" id="abiCta"><div class="shell g12">' +
        '<div class="cta__txt">' +
          '<div class="folio folio--w" aria-hidden="true">05</div>' +
          '<div class="mark mark--w"><span class="kicker" data-ck="bible.cta.kicker">Go Deeper</span></div>' +
          '<h2 class="h2--xl" data-ck="bible.cta.heading">Hear It Taught</h2>' +
          /* one line per service: the time in Anton, then where it is. Each place is its own
             Page Content key (bible.cta.place1-3) so no line can read as another campus's. */
          '<p class="cta__p">' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.main">Sunday 10:30 AM</span> ' +
              '<span data-ck="bible.cta.place1">in Pineville</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.sunday.second">Sunday 10:00 AM</span> ' +
              '<span data-ck="bible.cta.place2">in Alexandria</span></span>' +
            '<span class="cta__line"><span class="cta__time" data-ck="site.times.main.glorynight">Monday 7:00 PM</span> ' +
              '<span data-ck="bible.cta.place3">Glory Night in Pineville</span></span>' +
          '</p>' +
        '</div>' +
        '<a class="btn btn--onRed cta__btn" href="/sermons" target="_top" data-ck="bible.cta.button">Sermons</a>' +
      '</div></section>';

    this.applyContent();
    this.bindChrome();
    this.bindReader();
    this.renderBooks();
    this.initReveal();
    this.initDeck();
    this.initPin();
    this.boot();
  }

  /* ---- talking to the site's backend ---- */
  api(path) {
    const base = this.getAttribute('data-api') || '/_functions/';
    return base + path;
  }
  async request(path) {
    /* a page that mocks the backend (the preview, the element checks) sets window.__abiMock */
    if (typeof window.__abiMock === 'function') return window.__abiMock(path);
    const res = await fetch(this.api(path), { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    let d = null;
    try { d = await res.json(); } catch (e) { d = null; }
    if (!res.ok) { const err = new Error((d && d.error) || ('The site answered ' + res.status + '.')); err.status = res.status; throw err; }
    return d || {};
  }

  /* First load: Bibles and books (from session memory when fresh), then the
     passage named in the URL, or the one read last, or John 3:16. */
  async boot() {
    const self = this;
    const params = (function () { try { return new URLSearchParams(window.location.search); } catch (e) { return null; } })();
    const urlRef = params ? (params.get('ref') || '') : '';
    const urlBible = params ? (params.get('bible') || '') : '';
    let last = null;
    try { last = JSON.parse(localStorage.getItem('abi:last') || 'null'); } catch (e) { last = null; }
    this._bible = urlBible || (last && last.bible) || '';
    this._ref = urlRef || (last && last.ref) || 'John 3:16';
    const ref = this.querySelector('#abiRef');
    if (ref) ref.value = this._ref;

    const cachedBibles = abiRecall('bibles', 60 * 60 * 1000);
    const cachedBooks = abiRecall('books', 24 * 60 * 60 * 1000);
    if (cachedBibles) this.setBibles(cachedBibles);
    if (cachedBooks) this.setBooks(cachedBooks);

    const loads = [];
    if (!cachedBibles) {
      loads.push(this.request('bibleBibles').then(function (d) {
        if (d && Array.isArray(d.translations) && d.translations.length) { abiRemember('bibles', d.translations); self.setBibles(d.translations); }
        else throw new Error('empty');
      }).catch(function () {
        self.setBibles([]);
      }));
    }
    if (!cachedBooks) {
      loads.push(this.request('bibleBooks').then(function (d) {
        if (d && Array.isArray(d.books) && d.books.length) { abiRemember('books', d.books); self.setBooks(d.books); }
      }).catch(function () { /* the fallback book list stays */ }));
    }
    await Promise.all(loads);
    this.read(this._ref, false);
  }

  /* ---- the Bible list ---- */
  setBibles(list) {
    this._bibles = (list || []).filter(function (t) { return t && t.id && t.name; });
    const sel = this.querySelector('#abiBible');
    if (!sel) return;
    if (!this._bibles.length) {
      sel.innerHTML = '<option value="">Bibles unavailable right now</option>';
      this.renderWall();
      return;
    }
    if (!this._bible || !this.byId(this._bible)) this._bible = this.preferredBible();
    const self = this;
    sel.innerHTML = this._bibles.map(function (t) {
      return '<option value="' + abiEsc(t.id) + '"' + (t.id === self._bible ? ' selected' : '') + '>' + abiEsc(t.name) + (t.hasAudio ? ' \u00b7 audio' : '') + '</option>';
    }).join('');
    sel.value = this._bible;
    this.renderWall();
    const n = this.querySelector('#abiAudioCount');
    if (n) n.textContent = String(this._bibles.filter(function (t) { return t.hasAudio; }).length || 2);
  }
  byId(id) { return this._bibles.filter(function (t) { return t.id === id; })[0] || null; }
  preferredBible() {
    for (let i = 0; i < PREFERRED.length; i++) {
      const hit = this._bibles.filter(function (t) { return PREFERRED[i].test(t.name); })[0];
      if (hit) return hit.id;
    }
    return this._bibles.length ? this._bibles[0].id : '';
  }
  pickBible(id, reread) {
    if (!id || id === this._bible) return;
    this._bible = id;
    const sel = this.querySelector('#abiBible');
    if (sel && sel.value !== id) sel.value = id;
    this.markWall();
    if (reread && this._ref) this.read(this._ref, true);
  }

  /* 04 Bibles: the wall of cards, filtered by the search box */
  renderWall() {
    const wall = this.querySelector('#abiBibleWall');
    const count = this.querySelector('#abiBibleCount');
    const status = this.querySelector('#abiWallStatus');
    if (!wall) return;
    const q = String((this.querySelector('#abiBibleFilter') || {}).value || '').trim().toLowerCase();
    const list = this._bibles.filter(function (t) { return !q || t.name.toLowerCase().indexOf(q) > -1 || t.id.toLowerCase() === q; });
    if (count) count.textContent = String(this._bibles.length || '\u2026');
    const self = this;
    wall.innerHTML = list.map(function (t) {
      const idx = self._bibles.indexOf(t);
      return '<button type="button" class="bib" data-bible="' + abiEsc(t.id) + '" aria-pressed="' + (t.id === self._bible ? 'true' : 'false') + '">' +
        '<span class="bib__i" aria-hidden="true">' + abiPad(idx + 1) + '</span>' +
        '<span class="bib__t">' + abiEsc(t.name) + '</span>' +
        '<span class="bib__m">' + (t.hasAudio ? '<i>\u25b6</i> Narrated \u00b7 ' : '') + abiEsc(t.language || 'English') + '</span>' +
      '</button>';
    }).join('');
    if (status) {
      if (!self._bibles.length) { status.textContent = 'The list of Bibles is unavailable right now. Try again in a minute.'; status.hidden = false; }
      else if (!list.length) { status.textContent = 'No Bible matches \u201c' + q + '\u201d.'; status.hidden = false; }
      else status.hidden = true;
    }
    this.fitDeck();
  }
  markWall() {
    const self = this;
    this.querySelectorAll('#abiBibleWall .bib').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-bible') === self._bible ? 'true' : 'false'); });
  }

  /* ---- books and chapters ---- */
  setBooks(list) {
    const books = (list || []).filter(function (b) { return b && b.name; }).map(function (b) { return { name: String(b.name), chapters: Number(b.chapters) || 0, osis: b.osis }; });
    if (books.length) { this._books = books; this.renderBooks(); }
  }
  renderBooks() {
    const sel = this.querySelector('#abiBook');
    if (!sel) return;
    const cur = this.currentBook();
    sel.innerHTML = this._books.map(function (b) { return '<option value="' + abiEsc(b.name) + '"' + (cur && cur.name === b.name ? ' selected' : '') + '>' + abiEsc(b.name) + '</option>'; }).join('');
    this.renderChapters();
  }
  renderChapters() {
    const bookSel = this.querySelector('#abiBook');
    const sel = this.querySelector('#abiChapter');
    if (!bookSel || !sel) return;
    const book = this.bookNamed(bookSel.value);
    const n = book && book.chapters ? book.chapters : 150;
    const cur = this.currentChapter();
    let html = '';
    for (let i = 1; i <= n; i++) html += '<option value="' + i + '"' + (i === cur ? ' selected' : '') + '>' + i + '</option>';
    sel.innerHTML = html;
    const prev = this.querySelector('#abiPrev'), next = this.querySelector('#abiNext');
    const at = this.position();
    if (prev) prev.disabled = !at || (at.bookIndex === 0 && at.chapter <= 1);
    if (next) next.disabled = !at || (at.bookIndex === this._books.length - 1 && at.chapter >= (this._books[at.bookIndex].chapters || 999));
  }
  bookNamed(name) {
    name = String(name || '').toLowerCase();
    return this._books.filter(function (b) { return b.name.toLowerCase() === name; })[0] || null;
  }
  /* The book and chapter of what is on screen, from the server's label
     ("Psalms 23", "1 Corinthians 13:4-7"), else from what was typed. */
  position() {
    const label = (this._passage && this._passage.reference) || this._ref || '';
    const m = String(label).match(/^(.+?)\s+(\d+)(?::|\s*$|-)/);
    if (!m) return null;
    const name = m[1].trim().replace(/^psalm$/i, 'Psalms').replace(/^song of songs$/i, 'Song of Solomon');
    let idx = -1;
    for (let i = 0; i < this._books.length; i++) {
      if (this._books[i].name.toLowerCase() === name.toLowerCase()) { idx = i; break; }
    }
    if (idx < 0) return null;
    return { bookIndex: idx, chapter: Number(m[2]) };
  }
  currentBook() { const at = this.position(); return at ? this._books[at.bookIndex] : null; }
  currentChapter() { const at = this.position(); return at ? at.chapter : 1; }
  stepChapter(dir) {
    const at = this.position();
    if (!at) return;
    let idx = at.bookIndex, ch = at.chapter + dir;
    const max = this._books[idx].chapters || 150;
    if (ch < 1) { if (idx === 0) return; idx -= 1; ch = this._books[idx].chapters || 1; }
    else if (ch > max) { if (idx >= this._books.length - 1) return; idx += 1; ch = 1; }
    this.read(this._books[idx].name + ' ' + ch, true);
  }

  /* ---- reading a passage ---- */
  async read(ref) {
    ref = String(ref || '').replace(/\s+/g, ' ').trim();
    const input = this.querySelector('#abiRef');
    const out = this.querySelector('#abiOut');
    const status = this.querySelector('#abiStatus');
    const verses = this.querySelector('#abiVerses');
    const skel = this.querySelector('#abiSkel');
    if (!ref) { this.setStatus('Type a verse, a passage or a chapter \u2014 for example John 3:16', true); if (input) input.focus(); return; }
    if (input && input.value !== ref) input.value = ref;
    this._ref = ref;
    const id = ++this._reqId;
    if (out) out.setAttribute('aria-busy', 'true');
    if (verses) verses.classList.add('loading');
    if (skel && !(verses && verses.children.length)) skel.hidden = false;
    this.setStatus('Looking up ' + ref + '\u2026', false);
    const go = this.querySelector('#abiGo');
    if (go) go.disabled = true;
    try {
      const d = await this.request('bible?ref=' + encodeURIComponent(ref) + '&translation=' + encodeURIComponent(this._bible || ''));
      if (id !== this._reqId) return;   // a newer lookup has taken over
      if (!d || !Array.isArray(d.verses) || !d.verses.length) throw new Error('No verses found for that reference.');
      this._passage = d;
      this.renderPassage(d);
      this.remember(ref);
      this.loadStudy(d.reference || ref);
      this.renderAudio(d);
      this.renderNotes(d);
    } catch (e) {
      if (id !== this._reqId) return;
      this.setStatus((e && e.message) || 'That passage could not be found. Try John 3:16.', true);
    } finally {
      if (id === this._reqId) {
        if (out) out.setAttribute('aria-busy', 'false');
        if (verses) verses.classList.remove('loading');
        if (skel) skel.hidden = true;
        if (go) go.disabled = false;
        this.renderBooks();
        this.fitDeck();
      }
    }
  }
  setStatus(msg, isErr) {
    const s = this.querySelector('#abiStatus');
    if (!s) return;
    s.textContent = msg;
    s.hidden = !msg;
    s.classList.toggle('status--err', !!isErr);
  }
  remember(ref) {
    try { localStorage.setItem('abi:last', JSON.stringify({ ref: ref, bible: this._bible })); } catch (e) { /* private mode */ }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('ref', ref);
      if (this._bible) url.searchParams.set('bible', this._bible); else url.searchParams.delete('bible');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (e) { /* a sandboxed frame */ }
  }
  renderPassage(d) {
    const strip = this.querySelector('#abiRefStrip'), stripText = this.querySelector('#abiRefText');
    const trans = this.querySelector('#abiTransName');
    const verses = this.querySelector('#abiVerses');
    const note = this.querySelector('#abiNote');
    const copy = this.querySelector('#abiCopy');
    const tools = this.querySelector('#abiTools');
    if (stripText) stripText.textContent = d.reference || this._ref;
    if (strip) strip.hidden = false;
    if (trans) trans.textContent = d.translationName || d.translation || '';
    /* flowing text with the verse number as a small Anton numeral; one verse
       per line only when the source could not split them (Biblia's plain block) */
    const block = d.verses.length === 1 && String(d.verses[0].text || '').length > 600;
    if (verses) {
      verses.innerHTML = d.verses.map(function (v) {
        return '<p class="verse' + (block ? ' verse--block' : '') + '"><b>' + abiEsc(v.verse) + '</b>' + abiEsc(String(v.text || '').trim()) + ' </p>';
      }).join('');
    }
    this.setStatus('', false);
    if (note) { note.textContent = d.versificationNote || ''; note.hidden = !d.versificationNote; }
    if (copy) {
      let line = '';
      const c = String(d.copyright || '').trim();
      if (/^https?:\/\//i.test(c)) line = '<a href="' + abiEsc(c) + '" target="_blank" rel="noopener">Licence</a>';
      else if (c) line = abiEsc(c);
      copy.innerHTML = line;
      copy.hidden = !line;
    }
    if (tools) tools.hidden = false;
    const tick = 'Now reading \u00b7 ' + (d.reference || this._ref) + ' \u00b7 ' + (d.translationName || '') + ' \u00b7 Arise Church \u00b7 ';
    const a = this.querySelector('#abiTickA'), b = this.querySelector('#abiTickB');
    if (a && a.textContent !== tick) { a.textContent = tick; b.textContent = tick; }
  }
  passageText() {
    const d = this._passage;
    if (!d) return '';
    return d.verses.map(function (v) { return v.verse + ' ' + String(v.text || '').trim(); }).join(' ') +
      '\n\u2014 ' + (d.reference || this._ref) + ' (' + (d.translationName || d.translation || '') + ')';
  }

  /* ---- 02 study: notes from the passage, dictionary entries from the server ---- */
  renderNotes(d) {
    const list = this.querySelector('#abiNotes');
    const status = this.querySelector('#abiNotesStatus');
    const from = this.querySelector('#abiNotesFrom');
    if (!list) return;
    const notes = Array.isArray(d.footnotes) ? d.footnotes : [];
    if (!notes.length) {
      list.hidden = true; list.innerHTML = '';
      if (status) { status.textContent = 'No translator\u2019s notes for ' + (d.reference || this._ref) + '.'; status.hidden = false; }
      if (from) from.hidden = true;
      return;
    }
    list.innerHTML = notes.map(function (f) {
      return '<li><span class="note__v" aria-label="Verse ' + abiEsc(f.verse) + '">' + abiEsc(f.verse) + '</span><span>' + abiEsc(f.text) + '</span></li>';
    }).join('');
    list.hidden = false;
    if (status) status.hidden = true;
    if (from) {
      from.textContent = d.footnotesFrom ? 'Notes from the ' + d.footnotesFrom : 'Notes from the ' + (d.translationName || 'translation');
      from.hidden = false;
    }
    this.fitDeck();
  }
  async loadStudy(ref) {
    const list = this.querySelector('#abiDict');
    const status = this.querySelector('#abiDictStatus');
    const attr = this.querySelector('#abiDictAttr');
    const wrap = this.querySelector('#abiDictWrap');
    if (!list) return;
    const id = this._reqId;
    if (status) { status.textContent = 'Looking in the dictionaries\u2026'; status.hidden = false; }
    try {
      const d = await this.request('bibleReference?ref=' + encodeURIComponent(ref));
      if (id !== this._reqId) return;
      if (d && d.available === false) { if (wrap) wrap.hidden = true; this.fitDeck(); return; }
      if (wrap) wrap.hidden = false;
      const entries = (d && Array.isArray(d.entries)) ? d.entries : [];
      if (!entries.length) {
        list.hidden = true; list.innerHTML = '';
        if (status) { status.textContent = 'Nothing in the dictionaries cites ' + ref + '. Look up a word below.'; status.hidden = false; }
      } else {
        list.innerHTML = entries.slice(0, 24).map(function (e) { return AriseBible.dictItem(e, ref); }).join('');
        list.hidden = false;
        if (status) status.hidden = true;
      }
      if (attr && d && d.attribution) { attr.textContent = d.attribution; attr.hidden = false; }
    } catch (e) {
      if (id !== this._reqId) return;
      list.hidden = true;
      if (status) { status.textContent = 'The dictionaries are unavailable right now.'; status.hidden = false; }
    }
    this.fitDeck();
  }
  static dictItem(e, ref) {
    const verses = Array.isArray(e.verses) && e.verses.length ? 'v. ' + e.verses.join(', ') : (ref ? 'this chapter' : '');
    const sources = Array.isArray(e.sources) ? e.sources.join(' \u00b7 ') : '';
    const excerpt = String(e.excerpt || (e.definitions && e.definitions[0] && e.definitions[0].text) || '').trim();
    return '<li data-slug="' + abiEsc(e.slug) + '">' +
      '<div class="dict__hd"><h3>' + abiEsc(e.name) + '</h3>' + (sources ? '<span class="dict__src">' + abiEsc(sources) + '</span>' : '') + (verses ? '<span class="dict__v">' + abiEsc(verses) + '</span>' : '') + '</div>' +
      (excerpt ? '<p class="dict__x">' + abiEsc(excerpt) + (excerpt.length >= 240 ? '\u2026' : '') + '</p>' : '') +
      '<button type="button" class="ulink dict__more" data-slug="' + abiEsc(e.slug) + '">Read the whole entry</button>' +
      '<div class="dict__full" hidden></div>' +
    '</li>';
  }
  async expandEntry(btn) {
    const li = btn.closest('li');
    const full = li && li.querySelector('.dict__full');
    if (!full) return;
    if (!full.hidden) { full.hidden = true; btn.textContent = 'Read the whole entry'; this.fitDeck(); return; }
    btn.textContent = 'Loading\u2026';
    try {
      const d = await this.request('bibleDictionary?slug=' + encodeURIComponent(btn.getAttribute('data-slug') || ''));
      const entry = d && d.entry;
      const defs = entry && Array.isArray(entry.definitions) ? entry.definitions : [];
      full.innerHTML = defs.length
        ? defs.map(function (x) { return '<h4>' + abiEsc(x.source || 'Definition') + '</h4><p>' + abiEsc(x.text || '') + '</p>'; }).join('')
        : '<p>The full entry could not be loaded.</p>';
      full.hidden = false;
      btn.textContent = 'Close the entry';
    } catch (e) {
      full.innerHTML = '<p>The full entry could not be loaded right now.</p>'; full.hidden = false;
      btn.textContent = 'Close the entry';
    }
    this.fitDeck();
  }
  async lookupWord() {
    const input = this.querySelector('#abiDictQ');
    const list = this.querySelector('#abiDictResults');
    if (!input || !list) return;
    const q = String(input.value || '').trim();
    if (!q) { input.focus(); return; }
    list.innerHTML = '<li><p class="status">Looking up \u201c' + abiEsc(q) + '\u201d\u2026</p></li>'; list.hidden = false;
    try {
      const d = await this.request('bibleDictionary?q=' + encodeURIComponent(q));
      const entries = (d && Array.isArray(d.entries)) ? d.entries : [];
      list.innerHTML = entries.length
        ? entries.slice(0, 20).map(function (e) { return AriseBible.dictItem(e, ''); }).join('')
        : '<li><p class="status">Nothing in Easton or Smith begins with \u201c' + abiEsc(q) + '\u201d.</p></li>';
    } catch (e) {
      list.innerHTML = '<li><p class="status">The dictionaries are unavailable right now.</p></li>';
    }
    this.fitDeck();
  }

  /* ---- 03 listen ---- */
  renderAudio(d) {
    const now = this.querySelector('#abiPlayerNow'), who = this.querySelector('#abiPlayerWho');
    const narr = this.querySelector('#abiNarrators'), audio = this.querySelector('#abiAudio');
    const status = this.querySelector('#abiListenStatus'), tools = this.querySelector('#abiListenTools'), sw = this.querySelector('#abiListenSwitch');
    if (!audio) return;
    const tracks = Array.isArray(d.audio) ? d.audio.filter(function (a) { return a && /^(https?:\/\/|data:audio\/)/i.test(String(a.url || '')); }) : [];
    const chapter = String(d.reference || this._ref).replace(/:.*$/, '');
    const self = this;
    if (!tracks.length) {
      audio.pause(); audio.removeAttribute('src'); audio.hidden = true;
      if (narr) narr.innerHTML = '';
      if (now) now.textContent = chapter;
      if (who) who.textContent = d.translationName || '';
      const narrated = this._bibles.filter(function (t) { return t.hasAudio; });
      if (status) { status.textContent = 'No recording of the ' + (d.translationName || 'selected Bible') + '. ' + (narrated.length ? 'The ' + narrated[0].name + ' has one.' : ''); status.hidden = false; }
      if (tools && sw) {
        if (narrated.length) { sw.textContent = 'Listen in the ' + narrated[0].name; sw.setAttribute('data-bible', narrated[0].id); tools.hidden = false; }
        else tools.hidden = true;
      }
      this.fitDeck();
      return;
    }
    if (now) now.textContent = chapter;
    if (who) who.textContent = d.translationName || '';
    if (status) status.hidden = true;
    if (tools) tools.hidden = true;
    if (narr) {
      narr.innerHTML = tracks.map(function (a, i) {
        return '<button type="button" data-track="' + i + '" aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + PLAY_SVG + '<span>' + abiEsc(a.narrator || ('Reader ' + (i + 1))) + '</span></button>';
      }).join('');
    }
    this._tracks = tracks;
    this.useTrack(0, false);
    audio.hidden = false;
    this.fitDeck();
    void self;
  }
  useTrack(i, play) {
    const audio = this.querySelector('#abiAudio');
    const tracks = this._tracks || [];
    if (!audio || !tracks[i]) return;
    const wasPlaying = !audio.paused && !audio.ended;
    if (audio.getAttribute('src') !== tracks[i].url) { audio.src = tracks[i].url; audio.load(); }
    this.querySelectorAll('#abiNarrators button').forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    if (play || wasPlaying) { try { const p = audio.play(); if (p && p.catch) p.catch(function () { /* autoplay blocked */ }); } catch (e) { /* ignore */ } }
  }

  /* ---- wiring ---- */
  bindReader() {
    const self = this;
    const refInput = this.querySelector('#abiRef');
    const go = this.querySelector('#abiGo');
    const sel = this.querySelector('#abiBible');
    if (go) go.addEventListener('click', function () { self.read(refInput ? refInput.value : '', true); });
    if (refInput) refInput.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); self.read(refInput.value, true); } });
    if (sel) sel.addEventListener('change', function () { self.pickBible(sel.value, true); });
    const book = this.querySelector('#abiBook'), chapter = this.querySelector('#abiChapter');
    if (book) book.addEventListener('change', function () { self.renderChapters(); const c = self.querySelector('#abiChapter'); if (c) c.value = '1'; self.read(book.value + ' 1', true); });
    if (chapter) chapter.addEventListener('change', function () { self.read(book.value + ' ' + chapter.value, true); });
    const prev = this.querySelector('#abiPrev'), next = this.querySelector('#abiNext');
    if (prev) prev.addEventListener('click', function () { self.stepChapter(-1); });
    if (next) next.addEventListener('click', function () { self.stepChapter(1); });
    const copyBtn = this.querySelector('#abiCopyBtn');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      const text = self.passageText();
      const done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy with reference'; }, 1600); };
      try { navigator.clipboard.writeText(text).then(done, function () { copyBtn.textContent = 'Could not copy'; }); } catch (e) { copyBtn.textContent = 'Could not copy'; }
    });
    const shareBtn = this.querySelector('#abiShareBtn');
    if (shareBtn) shareBtn.addEventListener('click', function () {
      const url = window.location.href;
      const d = self._passage;
      const title = d ? (d.reference + ' (' + (d.translationName || '') + ')') : 'Bible Search';
      if (navigator.share) { navigator.share({ title: title, text: self.passageText(), url: url }).catch(function () { /* dismissed */ }); return; }
      try { navigator.clipboard.writeText(url).then(function () { shareBtn.textContent = 'Link copied'; setTimeout(function () { shareBtn.textContent = 'Share this passage'; }, 1600); }); } catch (e) { /* ignore */ }
    });
    const filter = this.querySelector('#abiBibleFilter');
    if (filter) filter.addEventListener('input', function () { self.renderWall(); });
    const wall = this.querySelector('#abiBibleWall');
    if (wall) wall.addEventListener('click', function (ev) {
      const b = ev.target && ev.target.closest ? ev.target.closest('.bib') : null;
      if (!b) return;
      self.pickBible(b.getAttribute('data-bible'), true);
      self.go('abiRead', true);
    });
    const dictGo = this.querySelector('#abiDictGo'), dictQ = this.querySelector('#abiDictQ');
    if (dictGo) dictGo.addEventListener('click', function () { self.lookupWord(); });
    if (dictQ) dictQ.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); self.lookupWord(); } });
    const study = this.querySelector('#abiStudy');
    if (study) study.addEventListener('click', function (ev) {
      const b = ev.target && ev.target.closest ? ev.target.closest('.dict__more') : null;
      if (b) self.expandEntry(b);
    });
    const narr = this.querySelector('#abiNarrators');
    if (narr) narr.addEventListener('click', function (ev) {
      const b = ev.target && ev.target.closest ? ev.target.closest('button[data-track]') : null;
      if (b) self.useTrack(Number(b.getAttribute('data-track')), true);
    });
    const sw = this.querySelector('#abiListenSwitch');
    if (sw) sw.addEventListener('click', function () { const id = sw.getAttribute('data-bible'); if (id) { self.pickBible(id, true); } });
    this.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () { self.read(c.getAttribute('data-ref'), true); });
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
    const tabs = this.querySelector('#abiTabs');
    if (tabs) {
      tabs.addEventListener('keydown', function (ev) {
        const k = ev.key;
        if (k === 'ArrowLeft' || k === 'ArrowRight') { ev.preventDefault(); self.step(k === 'ArrowLeft' ? -1 : 1, true); }
        else if (k === 'Home' || k === 'End') { ev.preventDefault(); const ps = self.panels(); self.go(ps[k === 'Home' ? 0 : ps.length - 1].id, true); }
      });
    }
  }

  /* ---- the deck: one room on stage, the others in the wings ---- */
  panels() { return Array.prototype.filter.call(this.querySelectorAll('#abiTrack > .panel'), function (p) { return !p.hidden; }); }

  initDeck() {
    const self = this;
    const deck = this.querySelector('#abiDeck');
    if (!deck || this._deck) return;
    this._deck = true;
    this._active = 'abiRead';
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
      this.querySelectorAll('#abiTrack > .panel').forEach(function (p) { self._ro.observe(p); });
    } catch (e) { this._ro = null; }
    this.fitDeck();
    [300, 1200, 3000].forEach(function (ms) { setTimeout(function () { self.fitDeck(); }, ms); });
    this.applyDeck(false);
  }

  fitDeck() {
    const deck = this.querySelector('#abiDeck');
    const active = this.querySelector('#abiTrack > .panel.is-active');
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
      const strap = this.querySelector('#abiStrap');
      const deck = this.querySelector('#abiDeck');
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
      if (byUser) { const t = this.querySelector('#abiTab-' + next.id); if (t) t.focus({ preventScroll: true }); }
    }
  }

  applyDeck(animate) {
    const self = this;
    const ps = this.panels();
    const track = this.querySelector('#abiTrack');
    const deck = this.querySelector('#abiDeck');
    if (!track || !deck) return;
    let idx = 0;
    for (let i = 0; i < ps.length; i++) if (ps[i].id === this._active) idx = i;
    this._active = ps[idx] ? ps[idx].id : 'abiRead';
    this.querySelectorAll('#abiTrack > .panel').forEach(function (p) {
      const on = p.id === self._active;
      p.classList.toggle('is-active', on);
      p.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
      if (on && animate) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
    });
    this.querySelectorAll('#abiTabs .strap__j').forEach(function (t) {
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
    const strap = this.querySelector('#abiStrap');
    const spacer = this.querySelector('#abiStrapSpacer');
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
    try { map = JSON.parse(raw); } catch (e) { console.error('bad data-content JSON', e); return; }
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
      const img = abiImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
      if (el.tagName === 'IMG') el.src = img;
      else el.style.backgroundImage = 'url("' + String(img).replace(/["\\]/g, '') + '")';
    });
  }

  /* ---- reveals ---- */
  initReveal() {
    const self = this;
    if (this._io) return;
    try {
      this._io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); self._io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px 80px 0px', threshold: 0.05 });
    } catch (e) { this._io = null; return; }
    this.classList.add('abi-js');
    this.querySelectorAll('.r:not(.in)').forEach(function (el) { self._io.observe(el); });
    setTimeout(function () { self.classList.add('abi-settled'); }, 800);
  }
}

customElements.define('arise-bible', AriseBible);
