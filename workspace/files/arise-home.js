/* ===========================================================================
   ARISE CHURCH -- COMPLETE HOME PAGE  (single Velo Custom Element)
   File: public/custom-elements/arise-home.js
   Tag:  arise-home

   This is the approved mockup rendered as one element. Everything below the
   header -- hero, who we are, the four-verb pathway, campuses, ministries,
   what to expect, prayer request, give, footer -- is in this one file.

   ALL COPY IS FROM THE LIVE SITE or from facts Bradly supplied directly.
   Nothing invented.

   ---------------------------------------------------------------------------
   INSTALL  (about 5 minutes, no dragging)
   ---------------------------------------------------------------------------
   SAFEST: build it on a NEW page first so nothing live is touched.

   1. Editor -> Pages -> Add Page -> name it "Home Preview"
      (Page Settings -> hide from menu, and set SEO to "hide from search")
   2. Delete anything the new page came with.
   3. Velo sidebar -> Public -> custom-elements/ -> new file arise-home.js
      -> paste this entire file
   4. Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-home.js
      Tag Name: arise-home
   5. Stretch the element FULL WIDTH. Height ~6000 (it sizes itself; give it room).
   6. Save, then PUBLISH, then open the LIVE url.

   IT WILL LOOK WRONG IN EDITOR AND PREVIEW. Wix renders custom elements in
   an iframe there. Only the published site shows it properly. This is normal.

   ---------------------------------------------------------------------------
   NOTE ON SEO
   ---------------------------------------------------------------------------
   Custom element text is not in the server HTML. For a preview page that's
   fine. Before this becomes the real homepage, add native Wix text for the
   H1 and both campus addresses -- see the build plan.
   =========================================================================== */

const AH_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const IMG = 'https://static.wixstatic.com/media/';

/* ---------------------------------------------------------------------------
   CAMPUS PHOTOS
   Upload campus-pineville@2x.jpg and campus-alexandria@2x.jpg to your Wix
   Media Manager, then paste their wixstatic URLs here. Two lines, that's it.
   Until you do, these fall back to existing images from your library.
   --------------------------------------------------------------------------- */
const CAMPUS_PINEVILLE   = 'https://static.wixstatic.com/media/c3b2d0_d90892fdb5fd40d8bd3c1057ca244d04~mv2.jpg';
const CAMPUS_ALEXANDRIA  = 'https://static.wixstatic.com/media/c3b2d0_51f64171a5904d5b9b8b492f062db9bc~mv2.jpg';

const PHOTO = {
  worship:  IMG + 'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg',
  service:  IMG + 'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg',
  kids:     IMG + '1f9fa2_a5448e514cc14ea08cb657e4f1a9cec4~mv2.jpg',
  youth:    IMG + '1f9fa2_89a44a65090b488ea33de3157f4f3490~mv2.png',
  outreach: IMG + '1f9fa2_2aea5b909f5e467b9d6aa1c30e513ce4~mv2.png',
  lead:     IMG + 'c3b2d0_1c539649f39f48cbb157d4e27efeb843~mv2.png'
};

const AH_CSS = `
arise-home{display:block;width:100%}
.ah *{box-sizing:border-box;margin:0;padding:0}
.ah{
  --red:#D6222D; --redL:#DB3F48; --ink:#0A0A0C; --scrim:#060608;
  --paper:#fff; --bone:#F4F2F0; --muted:#6A6A6E;
  --rule:rgba(10,10,12,.12); --ruleD:rgba(255,255,255,.15);
  --shell:1180px; --gut:clamp(20px,5vw,56px); --sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;
  color:var(--ink);background:var(--paper);line-height:1.6;
  -webkit-font-smoothing:antialiased;color-scheme:light only;
}
.ah img{color:#fff;font-size:12px;background:#1A1A1F}
.ah .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.ah h1,.ah h2,.ah h3,.ah h4{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.ah h1{font-size:clamp(44px,8vw,88px)}
.ah h2{font-size:clamp(28px,4.2vw,52px)}
.ah h3{font-size:clamp(17px,1.8vw,22px);letter-spacing:.04em}
.ah h4{font-size:13px;letter-spacing:.12em}
.ah p{font-size:clamp(15.5px,1.4vw,17px)}
.ah .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.ah .mark{display:flex;align-items:center;margin-bottom:18px}
.ah .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.ah .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .ah .mark{flex-wrap:nowrap;align-items:flex-start}
  .ah .mark::before{margin-right:124px;margin-top:5px}
  .ah .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.ah .mark--l .kicker{color:var(--redL)}

.ah .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.ah .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.ah .btn{display:inline-block;padding:15px 30px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;text-decoration:none;
  border:1.5px solid var(--red);background:var(--red);color:#fff;cursor:pointer;
  transition:background .18s,color .18s,border-color .18s}
.ah .btn:hover{background:transparent;color:#fff;border-color:#fff}
.ah .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.ah .btn--ghost:hover{background:#fff;color:var(--ink);border-color:#fff}
.ah .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.ah .btn--dark:hover{background:var(--ink);color:#fff}
.ah .btn--onRed{background:#fff;border-color:#fff;color:var(--red)}
.ah .btn--onRed:hover{background:transparent;color:#fff}
.ah a:focus-visible,.ah button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.ah .sect{padding:var(--sect) 0;background:var(--paper)}
.ah .sect--bone{background:var(--bone)}
.ah .sect--ink{background:var(--ink)}
.ah .sect--ink h2,.ah .sect--ink h3{color:#fff}
.ah .sect--ink p,.ah .sect--ink li{color:rgba(255,255,255,.82)}
.ah .sect--ink h4{color:var(--redL)}

/* ---------- HERO ---------- */
.ah .hero{position:relative;min-height:min(88vh,760px);display:flex;align-items:center;
  background:var(--ink);overflow:hidden}
.ah .hero__bg{position:absolute;inset:0;background-size:cover;background-position:center 32%;filter:saturate(.85)}
.ah .hero__scrim{position:absolute;inset:0;background:linear-gradient(90deg,
  rgba(6,6,8,.94) 0%,rgba(6,6,8,.86) 42%,rgba(6,6,8,.34) 74%,rgba(6,6,8,.52) 100%)}
.ah .hero__floor{position:absolute;left:0;right:0;bottom:0;height:34%;
  background:linear-gradient(180deg,rgba(6,6,8,0),rgba(6,6,8,.9))}
.ah .hero__in{position:relative;z-index:2;width:100%;padding:var(--sect) 0}
.ah .hero__col{max-width:min(660px,64%)}
.ah .hero h1{color:#fff;text-shadow:0 4px 22px rgba(0,0,0,.5)}
.ah .hero h1 .dot{color:var(--red)}
.ah .hero__sub{color:rgba(255,255,255,.84);margin-top:22px;font-size:clamp(15.5px,1.6vw,18px);max-width:56ch}
.ah .hero__acts{display:flex;flex-wrap:wrap;gap:13px;margin-top:34px}

/* --- hero layout: text left, Exciting News right --- */
.ah .hero__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,440px);
  gap:clamp(28px,4vw,56px);align-items:center}
.ah .hero__grid > *{min-width:0}
.ah .hero__col{max-width:none}
@media(max-width:1100px){
  .ah .hero__grid{grid-template-columns:minmax(0,1fr);gap:34px}
  .ah .hero__col{max-width:100%}
}

/* --- Exciting News panel --- */
.ah .news{max-width:100%;background:rgba(6,6,8,.72);border:1px solid rgba(255,255,255,.16);
  border-top:4px solid var(--red);backdrop-filter:blur(6px);position:relative}
.ah .news[hidden]{display:none}
.ah .news__hd{padding:20px 24px 0}
.ah .news__hd .kicker{color:var(--redL)}
.ah .news__slide{display:none;padding:0 24px 24px}
.ah .news__slide[data-on="true"]{display:block}
.ah .news__img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block;
  background:var(--scrim);margin-bottom:18px}
.ah .news__media{position:relative;margin-bottom:16px;background:var(--scrim)}
.ah .news__media .news__img{margin-bottom:0}
.ah .news__media video{width:100%;aspect-ratio:4/3;object-fit:contain;display:block;background:#000}
.ah .news__play{position:absolute;inset:0;border:0;background:rgba(6,6,8,.34);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .2s}
.ah .news__play:hover{background:rgba(6,6,8,.16)}
.ah .news__play span{width:64px;height:64px;background:var(--red);display:flex;
  align-items:center;justify-content:center;color:#fff;font-size:22px;padding-left:5px}
.ah .news__play:focus-visible{outline:3px solid var(--red);outline-offset:-3px}
.ah .news__t{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;
  font-size:clamp(22px,2.4vw,31px);line-height:1.06;letter-spacing:.02em;color:#fff}
.ah .news__d{color:rgba(255,255,255,.82);font-size:15.5px;line-height:1.68;margin-top:12px}
.ah .news__go{display:inline-block;margin-top:18px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;color:#fff;text-decoration:none;
  background:var(--red);border:1.5px solid var(--red);padding:13px 24px;transition:background .18s}
.ah .news__go:hover{background:transparent;color:#fff}
.ah .news__dots{display:flex;gap:7px;padding:0 24px 20px}
.ah .news__dots[hidden]{display:none}
.ah .news__dot{width:9px;height:9px;border:0;padding:0;background:rgba(255,255,255,.32);
  cursor:pointer;transition:background .2s,width .2s}
.ah .news__dot[aria-current="true"]{background:var(--red);width:22px}
.ah .news__dot:focus-visible{outline:2px solid var(--red);outline-offset:3px}

/* Stacked under the hero text: keep it compact so it doesn't push the rest
   of the page below the fold. */
@media(max-width:1100px){
  .ah .news{max-width:520px}
  .ah .news__img,.ah .news__media video{aspect-ratio:16/9}
}
@media(max-width:600px){
  .ah .news{max-width:none}
  .ah .news__hd{padding:16px 18px 0}
  .ah .news__slide{padding:0 18px 18px}
  .ah .news__dots{padding:0 18px 16px}
  .ah .news__t{font-size:21px}
  .ah .news__d{font-size:14.5px}
  .ah .news__go{width:100%;text-align:center;padding:14px 20px}
  .ah .news__play span{width:54px;height:54px;font-size:18px}
}

/* ---------- PATHWAY ---------- */
.ah .path{display:grid;grid-template-columns:repeat(4,1fr);margin-top:var(--sect);
  border-top:3px solid var(--red)}
.ah .path__i{padding:30px 26px 34px;border-right:1px solid var(--rule)}
.ah .path__i:last-child{border-right:0}
.ah .path__n{font-family:'Anton',sans-serif;font-size:13px;color:var(--red);letter-spacing:.12em;margin-bottom:13px}
.ah .path__i h3{margin-bottom:9px}
.ah .path__i p{font-size:14.5px;color:var(--muted)}
@media(max-width:860px){.ah .path{grid-template-columns:repeat(2,1fr)}.ah .path__i:nth-child(2){border-right:0}}
@media(max-width:520px){.ah .path{grid-template-columns:1fr}.ah .path__i{border-right:0;border-bottom:1px solid var(--rule)}}

/* ---------- CAMPUSES ---------- */
.ah .camp{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:50px;background:var(--rule)}
.ah .camp__c{background:var(--paper);display:flex;flex-direction:column}
.ah .camp__img{aspect-ratio:16/9;background:var(--scrim);overflow:hidden}
.ah .camp__img img{width:100%;height:100%;object-fit:cover}
.ah .camp__b{padding:32px;flex:1}
.ah .camp__tag{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;padding:5px 11px;margin-bottom:16px}
.ah .camp__addr{font-size:16px;color:var(--ink);line-height:1.7;margin-top:8px}
.ah .camp__times{margin-top:24px;padding-top:24px;border-top:1px solid var(--rule)}
.ah .camp__r{display:flex;justify-content:space-between;gap:14px;padding:6px 0;font-size:14.5px;color:var(--muted)}
.ah .camp__r b{font-weight:500;white-space:nowrap;color:var(--ink)}
.ah .camp__note{font-size:13.5px;color:var(--muted);font-style:italic;margin-top:12px}
.ah .camp__link{margin-top:24px;display:inline-block;font-size:12px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;color:var(--red);text-decoration:none}
.ah .camp__link:hover{text-decoration:underline}
.ah .camp__acts{display:flex;flex-direction:column;align-items:flex-start;gap:10px}
.ah .camp__acts .camp__link{margin-top:0}
.ah .camp__acts .camp__link:first-child{margin-top:24px}
@media(max-width:760px){.ah .camp{grid-template-columns:1fr}}

/* ---------- MINISTRIES ---------- */
.ah .min{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;margin-top:50px;background:rgba(255,255,255,.13)}
.ah .min__c{position:relative;display:block;text-decoration:none;background:var(--scrim);
  overflow:hidden;aspect-ratio:4/5}
.ah .min__c img{width:100%;height:100%;object-fit:cover;filter:grayscale(.28) brightness(.6);
  transition:transform .5s,filter .35s}
.ah .min__c:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.76)}
/* A transparent logo is not a photo -- no crop, no darkening, and room
   above the caption so the two don't overlap. */
.ah .min__c--logo img{object-fit:contain;filter:none;padding:14% 16% 30%;background:var(--scrim)}
.ah .min__c--logo:hover img{filter:none;transform:scale(1.03)}
.ah .min__t{position:absolute;left:0;right:0;bottom:0;padding:44px 18px 20px;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.72) 42%,rgba(6,6,8,.97) 100%)}
.ah .min__t h3{color:#fff;font-size:17px}
.ah .min__t span{display:block;font-size:11px;letter-spacing:.17em;text-transform:uppercase;
  color:#fff;opacity:.92;margin-top:5px;font-weight:500}
@media(max-width:900px){.ah .min{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.ah .min{grid-template-columns:1fr}}

/* ---------- VISIT ---------- */
.ah .visit{display:grid;grid-template-columns:repeat(3,1fr);gap:44px;margin-top:48px}
.ah .visit__i::before{content:"";display:block;width:32px;height:4px;background:var(--red);margin-bottom:16px}
.ah .visit__i h3{color:#fff;font-size:17px;margin-bottom:9px}
.ah .visit__i p{font-size:14.5px}
.ah .visit__acts{display:flex;flex-wrap:wrap;gap:13px;margin-top:48px}
@media(max-width:760px){.ah .visit{grid-template-columns:1fr;gap:32px}}

/* ---------- PRAYER ---------- */
.ah .prayer{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,64px);align-items:center}
@media(max-width:860px){.ah .prayer{grid-template-columns:1fr}}
.ah .prayer blockquote{font-size:clamp(17px,1.9vw,22px);line-height:1.6;color:var(--ink)}
.ah .prayer cite{display:block;margin-top:16px;font-style:normal;font-size:13px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--red);font-weight:500}
.ah .prayer__img{aspect-ratio:4/3;overflow:hidden;background:var(--scrim)}
.ah .prayer__img img{width:100%;height:100%;object-fit:cover}

/* ---------- GIVE ---------- */
.ah .give{background:var(--red);padding:var(--sect) 0}
.ah .give h2{color:#fff}
.ah .give p{color:#fff;margin-top:16px;max-width:56ch}
.ah .give .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.ah .give .kicker{color:#fff}
.ah .give .btn{margin-top:30px}

/* ---------- FOOTER ---------- */
.ah .foot{background:var(--ink);color:rgba(255,255,255,.82);padding:56px 0 30px;font-size:13.5px}
.ah .foot__g{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:40px;padding-bottom:34px;
  border-bottom:1px solid var(--ruleD)}
.ah .foot .lbl{color:#fff;margin-bottom:15px;font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;line-height:1.02}
.ah .foot a{color:rgba(255,255,255,.82);text-decoration:none;display:block;padding:4px 0}
.ah .foot a:hover{color:var(--redL)}
.ah .foot__btm{padding-top:22px;font-size:12px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
@media(max-width:760px){.ah .foot__g{grid-template-columns:1fr}}


/* ---------- PHOTO COLLAGE (fed by page code via data-photos) ---------- */
.ah .gal{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:44px}
@media(max-width:900px){.ah .gal{grid-template-columns:repeat(4,1fr);gap:11px}}
@media(max-width:560px){.ah .gal{grid-template-columns:repeat(2,1fr);gap:9px}}
.ah .gal__t{position:relative;overflow:hidden;background:var(--bone);border:0;padding:0;
  cursor:pointer;display:block;grid-column:span 2;aspect-ratio:1/1;
  transition:transform .3s cubic-bezier(.2,.7,.3,1),box-shadow .3s;
  box-shadow:0 1px 3px rgba(10,10,12,.10)}
.ah .gal__t img{width:100%;height:100%;object-fit:cover;display:block;
  transition:transform .55s cubic-bezier(.2,.7,.3,1)}
.ah .gal__t:nth-child(7n+1){grid-column:span 3;aspect-ratio:4/3}
.ah .gal__t:nth-child(7n+4){grid-column:span 3;aspect-ratio:3/2}
.ah .gal__t:nth-child(7n+6){grid-column:span 2;aspect-ratio:3/4}
@media(max-width:560px){
  .ah .gal__t,.ah .gal__t:nth-child(7n+1),.ah .gal__t:nth-child(7n+4),
  .ah .gal__t:nth-child(7n+6){grid-column:span 1;aspect-ratio:1/1}}
.ah .gal__t:nth-child(3n+2){transform:rotate(-1.1deg)}
.ah .gal__t:nth-child(5n+3){transform:rotate(1.3deg)}
.ah .gal__t:hover,.ah .gal__t:focus-visible{transform:rotate(0deg) translateY(-5px);
  box-shadow:0 12px 26px rgba(10,10,12,.20);z-index:2}
.ah .gal__t:hover img{transform:scale(1.07)}
.ah .gal__t:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.ah .gal__t::after{content:"";position:absolute;right:0;bottom:0;width:0;height:0;
  border-style:solid;border-width:0 0 0 0;
  border-color:transparent transparent var(--red) transparent;transition:border-width .25s}
.ah .gal__t:hover::after{border-width:0 0 26px 26px}
/* video tiles get a play badge so they read as playable */
.ah .gal__v{position:absolute;left:12px;top:12px;width:38px;height:38px;background:var(--red);
  display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;
  padding-left:3px;pointer-events:none}
.ah .gal__n{margin-top:34px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--muted)}
/* ---------- CHURCH CULTURE VIDEO ---------- */
.ah .cvid{position:relative;margin-top:44px;background:var(--scrim);overflow:hidden}
.ah .cvid video{width:100%;height:auto;display:block;aspect-ratio:16/9;object-fit:cover;
  background:#000}
.ah .cvid__tap{position:absolute;right:18px;bottom:18px;display:flex;align-items:center;gap:9px;
  background:rgba(6,6,8,.72);border:1px solid rgba(255,255,255,.28);color:#fff;cursor:pointer;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:11px 16px;transition:background .18s}
.ah .cvid__tap:hover{background:var(--red);border-color:var(--red)}
.ah .cvid__tap:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.ah .cvid__tap svg{width:14px;height:14px;fill:currentColor}
.ah .cvid__play{position:absolute;inset:0;border:0;background:rgba(6,6,8,.34);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .2s}
.ah .cvid__play:hover{background:rgba(6,6,8,.16)}
.ah .cvid__play span{width:76px;height:76px;background:var(--red);display:flex;align-items:center;
  justify-content:center;color:#fff;font-size:26px;padding-left:6px}
.ah .cvid__play:focus-visible{outline:3px solid var(--red);outline-offset:-3px}

@media(prefers-reduced-motion:reduce){
  .ah .gal__t,.ah .gal__t img{transition:none}
  .ah .gal__t:nth-child(3n+2),.ah .gal__t:nth-child(5n+3){transform:none}}

.agl-lb{position:fixed;inset:0;z-index:2147482000;display:none;background:rgba(6,6,8,.94);
  color-scheme:light only}
.agl-lb[data-open="true"]{display:flex;align-items:center;justify-content:center}
.agl-lb img,.agl-lb video{max-width:92vw;max-height:82vh;object-fit:contain;display:block;
  box-shadow:0 20px 60px rgba(0,0,0,.6);background:#000}
.agl-lb video{width:auto}
.agl-lb button{position:absolute;background:transparent;border:1px solid rgba(255,255,255,.30);
  color:#fff;cursor:pointer;font-family:'Oswald',Helvetica,Arial,sans-serif;line-height:1}
.agl-lb__x{top:20px;right:20px;width:46px;height:46px;font-size:22px}
.agl-lb__p,.agl-lb__n{top:50%;transform:translateY(-50%);width:52px;height:64px;font-size:24px}
.agl-lb__p{left:16px}
.agl-lb__n{right:16px}
.agl-lb button:hover{background:#D6222D;border-color:#D6222D}
.agl-lb__c{position:absolute;bottom:22px;left:0;right:0;text-align:center;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:14px;
  color:rgba(255,255,255,.86);padding:0 20px}
.agl-lb__i{position:absolute;top:26px;left:24px;font-family:'Oswald',Helvetica,Arial,sans-serif;
  font-size:12px;letter-spacing:.2em;color:rgba(255,255,255,.6)}
.agl-lb button:focus-visible{outline:3px solid #D6222D;outline-offset:2px}

/* ---------- CHURCH CULTURE VIDEO ---------- */
.ah .cvid{position:relative;margin-top:44px;background:var(--scrim);overflow:hidden}
.ah .cvid video{width:100%;height:auto;display:block;aspect-ratio:16/9;object-fit:cover;
  background:#000}
.ah .cvid__tap{position:absolute;right:18px;bottom:18px;display:flex;align-items:center;gap:9px;
  background:rgba(6,6,8,.72);border:1px solid rgba(255,255,255,.28);color:#fff;cursor:pointer;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:11px 16px;transition:background .18s}
.ah .cvid__tap:hover{background:var(--red);border-color:var(--red)}
.ah .cvid__tap:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.ah .cvid__tap svg{width:14px;height:14px;fill:currentColor}
.ah .cvid__play{position:absolute;inset:0;border:0;background:rgba(6,6,8,.34);cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:background .2s}
.ah .cvid__play:hover{background:rgba(6,6,8,.16)}
.ah .cvid__play span{width:76px;height:76px;background:var(--red);display:flex;align-items:center;
  justify-content:center;color:#fff;font-size:26px;padding-left:6px}
.ah .cvid__play:focus-visible{outline:3px solid var(--red);outline-offset:-3px}

@media(prefers-reduced-motion:reduce){.ah *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .ah{background:#fff;color:#0A0A0C}
  .ah .sect{background:#fff}
  .ah .sect--bone{background:#F4F2F0}
  .ah .sect--ink,.ah .hero,.ah .foot{background:#0A0A0C}
}
`;

const AH_HTML = `
<div class="ah">

  <!-- HERO -->
  <section class="hero">
    <div class="hero__bg" style="background-image:url(${PHOTO.worship})"></div>
    <div class="hero__scrim"></div><div class="hero__floor"></div>
    <div class="hero__in"><div class="shell"><div class="hero__grid"><div class="hero__col">
      <div class="mark mark--l"><span class="kicker" data-ck="home.hero.kicker">Arise Church &middot; Pineville, LA</span></div>
      <h1>You Belong<br>Here<span class="dot">.</span></h1>
      <p class="hero__sub" data-ck="home.hero.body">Welcome to our multicultural, multiethnic, and multigenerational church!
      We are thrilled to have you join our vibrant community. Here, you will find a place of belonging
      and support, where diverse backgrounds come together to share in faith and fellowship.</p>
      <div class="hero__acts">
        <a class="btn" href="/contact">Plan Your Visit</a>
        <a class="btn btn--ghost" href="/sermons">Sermons</a>
      </div>
    </div>

    <aside class="news" id="ahNews" hidden aria-label="Exciting news">
      <div class="news__hd"><div class="mark mark--l"><span class="kicker">Exciting News</span></div></div>
      <div id="ahNewsSlides"></div>
      <div class="news__dots" id="ahNewsDots" hidden></div>
    </aside>

    </div></div></div>
  </section>

  <!-- WHO WE ARE -->
  <section class="sect"><div class="shell">
    <div class="mark"><span class="kicker">Who We Are</span></div>
     data-ck="home.who.h2">Who We Are</h2>
    <p class="lede" style="margin-top:24px" data-ck="home.who.body">We can't wait to grow together and embrace the unique gifts each person brings.</p>
    <div class="strip" style="margin-top:24px"><span>Apostle Bryant Sanders &middot; Pastor Vanessa Sanders</span></div>

    <div class="path">
      <div class="path__i"><div class="path__n">01</div><h3>Connect</h3><p>With God and His family.</p></div>
      <div class="path__i"><div class="path__n">02</div><h3>Grow</h3><p>In God's character.</p></div>
      <div class="path__i"><div class="path__n">03</div><h3>Serve</h3><p>In God's Church.</p></div>
      <div class="path__i"><div class="path__n">04</div><h3>Share</h3><p>God's message.</p></div>
    </div>
  </div></section>


  <!-- CHURCH CULTURE -->
  <section class="sect sect--bone">
    <div class="shell">
      <div class="mark"><span class="kicker">Church Culture</span></div>
      <h2>This Is Arise</h2>
      <div id="ahCulture"></div>
    </div>
  </section>

  <!-- CAMPUSES -->
  <section class="sect sect--bone"><div class="shell">
    <div class="mark"><span class="kicker">Our Locations</span></div>
     data-ck="home.campus.h2">One Church,<br>Two Campuses</h2>

    <div class="camp">
      <div class="camp__c">
        <div class="camp__img"><img data-ci="home.campus.main.photo" src="${CAMPUS_PINEVILLE}" alt="Arise Church Main Campus building in Pineville, Louisiana"></div>
        <div class="camp__b">
          <span class="camp__tag">Main Campus</span>
          <p class="camp__addr" data-ck="site.campus.main">501 Ates Road<br>Pineville, LA 71360</p>
          <div class="camp__times">
            <div class="camp__r"><span>Sunday Service</span><b data-ck="site.times.sunday.main">10:30 AM</b></div>
            <div class="camp__r"><span>Glory Night</span><b data-ck="site.times.main.glorynight">Mon 7:00 PM</b></div>
            <div class="camp__r"><span>Midweek Service</span><b data-ck="site.times.main.midweek">Wed 7:00 PM</b></div>
            <div class="camp__r"><span>Corporate Prayer</span><b data-ck="site.times.main.prayer">Mon-Thu 5:00 AM</b></div>
          </div>
          <a class="camp__link" href="https://www.google.com/maps/dir//501+Ates+Rd,+Pineville,+LA+71360" target="_top">Get Directions &rarr;</a>
        </div>
      </div>

      <div class="camp__c">
        <div class="camp__img"><img data-ci="home.campus.second.photo" src="${CAMPUS_ALEXANDRIA}" alt="Arise Church Alexandria Campus building on North Blvd"></div>
        <div class="camp__b">
          <span class="camp__tag">Second Campus</span>
          <p class="camp__addr" data-ck="site.campus.second">5305 North Blvd<br>Alexandria, LA 71301</p>
          <div class="camp__times">
            <div class="camp__r"><span>Sunday Service</span><b data-ck="site.times.sunday.second">10:00 AM</b></div>
            <div class="camp__r"><span>Pre-Service Prayer</span><b data-ck="site.times.second.prayer">TBA</b></div>
            <div class="camp__r"><span>Midweek Service</span><b data-ck="site.times.second.midweek">TBA</b></div>
          </div>
          <div class="camp__acts">
            <a class="camp__link" href="https://www.google.com/maps/dir//5305+North+Blvd,+Alexandria,+LA+71301" target="_top">Get Directions &rarr;</a>
            <a class="camp__link camp__link--more" href="/arise-alexandria" target="_top">Interested in this Campus? &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </div></section>

  <!-- MINISTRIES -->
  <section class="sect sect--ink"><div class="shell">
    <div class="mark mark--l"><span class="kicker">Ministries</span></div>
    <h2>Find Your People</h2>
    <div class="min">
      <a class="min__c min__c--logo" href="/lead-network"><img src="${PHOTO.lead}" alt="Lead Network"><div class="min__t"><h3>Lead Network</h3><span>Learn More</span></div></a>
      <a class="min__c" href="/childrens"><img src="${PHOTO.kids}" alt="Children's Ministry"><div class="min__t"><h3>Children's Ministry</h3><span>Learn More</span></div></a>
      <a class="min__c" href="/youth"><img src="${PHOTO.youth}" alt="Youth Ministry"><div class="min__t"><h3>Youth Ministry</h3><span>Learn More</span></div></a>
      <a class="min__c" href="/outreach"><img src="${PHOTO.outreach}" alt="Outreach"><div class="min__t"><h3>Outreach</h3><span>Learn More</span></div></a>
    </div>
    <div style="margin-top:48px"><a class="btn btn--ghost" href="/ministries">All Ministries</a></div>
  </div></section>

  <!-- WHAT TO EXPECT -->
  <section class="sect sect--ink" id="plan-your-visit" style="padding-top:0"><div class="shell">
    <div class="mark mark--l"><span class="kicker">First Time?</span></div>
     data-ck="home.visit.h2">What To Expect</h2>
    <div class="visit">
      <div class="visit__i"><h3>Parking</h3><p data-ck="home.visit.parking">Park without rushing and find a seat. Our X-Edge team is out on Sunday mornings to guide you in and send you toward the right door.</p></div>
      <div class="visit__i"><h3>What To Wear</h3><p data-ck="home.visit.whattowear">Come as you are. You'll see jeans and you'll see suits, and God sees the same thing in both. There's no dress code here - we mean it.</p></div>
      <div class="visit__i"><h3>When To Arrive</h3><p data-ck="home.visit.whentoarrive">Arrive a little early and have time for fellowship. Meet a few faces, settle in, and share a moment together before the first song.</p></div>
    </div>
    <div class="visit__acts">
      <a class="btn" href="https://www.google.com/maps/dir//501+Ates+Rd,+Pineville,+LA+71360" target="_top">Get Directions</a>
      <a class="btn btn--ghost" href="/contact" target="_top">Ask Us a Question</a>
    </div>
  </div></section>

  <!-- PRAYER REQUEST -->
  <section class="sect"><div class="shell">
    <div class="mark"><span class="kicker">Prayer Request</span></div>
    <div class="prayer" style="margin-top:40px">
      <div>
        <blockquote>"There are parts of our calling, works of the Holy Spirit, and defeats of the darkness that will come no other way than through furious, fervent, faith-filled, unceasing prayer."</blockquote>
        <cite>- Beth Moore</cite>
        <div style="margin-top:32px"><a class="btn btn--dark" href="mailto:arisechurchprayer@gmail.com">Prayer Request</a></div>
      </div>
      <div class="prayer__img"><img src="${PHOTO.service}" alt="Arise Church congregation in prayer"></div>
    </div>
  </div></section>

  <!-- GIVE -->
  <section class="give"><div class="shell">
    <div class="mark"><span class="kicker">Give</span></div>
    <h2>Give Online</h2>
    <p>Your giving supports everything that happens here - both campuses, every ministry, and everyone who walks through the door.</p>
    <a class="btn btn--onRed" href="/tithes-and-offerings" target="_top">Give Online</a>
  </div></section>


</div>`;

class AriseHome extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('ah-home-fonts')) {
      const l = document.createElement('link');
      l.id = 'ah-home-fonts'; l.rel = 'stylesheet'; l.href = AH_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('ah-home-css')) {
      const s = document.createElement('style');
      s.id = 'ah-home-css'; s.innerHTML = AH_CSS;
      document.head.appendChild(s);
    }

    this.innerHTML = AH_HTML;

    this.fillCulture();
    this.fillNews();
    this.applyContent();

    /* in-page anchors: the element lives inside Wix's DOM, so wire the
       scroll manually rather than relying on default anchor behaviour */
    const root = this;
    root.querySelectorAll('a[data-scroll]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href');
        if (!id || id.charAt(0) !== '#') return;
        const target = root.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
  static get observedAttributes() { return ['data-photos', 'data-news', 'data-culture', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._built) return;   // nothing to patch until it has rendered
    if (name === 'data-content') { this.applyContent(); return; }
    if (name === 'data-news') this.fillNews();
    else if (name === 'data-culture') this.fillCulture();
    else this.fillGallery();
  }

  /* ---------- EXCITING NEWS ----------
     Fed by page code via data-news. Shows one item at a time; if there is
     more than one it rotates every 8 seconds, pausing on hover. With no
     items the panel stays hidden entirely. */
  newsItems() {
    const raw = this.getAttribute('data-news');
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d.filter(function (x) { return x && (x.title || x.src); }) : [];
    } catch (e) {
      console.error('news: bad data-news JSON', e);
      return [];
    }
  }

  fillNews() {
    const panel = this.querySelector('#ahNews');
    const stage = this.querySelector('#ahNewsSlides');
    const dots  = this.querySelector('#ahNewsDots');
    if (!panel || !stage) return;

    const items = this.newsItems();
    if (!items.length) { panel.setAttribute('hidden', ''); return; }
    panel.removeAttribute('hidden');

    const E = function (v) {
      return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    stage.innerHTML = items.map(function (it, i) {
      const media = it.videoId
        ? '<div class="news__media" data-v="' + i + '">' +
            (it.src ? '<img class="news__img" src="' + E(it.src) + '" alt="' + E(it.alt || it.title) + '">' : '') +
            '<button class="news__play" data-play="' + i + '" ' +
              'aria-label="Play ' + E(it.title || 'video') + '"><span>&#9654;</span></button>' +
          '</div>'
        : (it.src ? '<img class="news__img" src="' + E(it.src) + '" alt="' + E(it.alt || it.title) + '">' : '');

      return '<div class="news__slide" data-on="' + (i === 0) + '">' +
        media +
        (it.title ? '<div class="news__t">' + E(it.title) + '</div>' : '') +
        (it.description ? '<p class="news__d">' + E(it.description) + '</p>' : '') +
        (it.link ? '<a class="news__go" href="' + E(it.link) + '" target="_top">Read More</a>' : '') +
      '</div>';
    }).join('');

    if (items.length > 1) {
      dots.removeAttribute('hidden');
      dots.innerHTML = items.map(function (it, i) {
        return '<button class="news__dot" data-n="' + i + '" aria-current="' + (i === 0) +
          '" aria-label="Show news item ' + (i + 1) + '"></button>';
      }).join('');
    } else {
      dots.setAttribute('hidden', '');
      dots.innerHTML = '';
    }

    const self = this;
    const slides = stage.querySelectorAll('.news__slide');
    const buttons = dots.querySelectorAll('.news__dot');
    let at = 0;

    function show(n) {
      at = (n + items.length) % items.length;
      slides.forEach(function (el, i) { el.setAttribute('data-on', String(i === at)); });
      buttons.forEach(function (b, i) { b.setAttribute('aria-current', String(i === at)); });
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        show(parseInt(b.getAttribute('data-n'), 10));
        stop();
      });
    });

    /* Tapping play swaps the poster for a real player and halts rotation,
       so the panel never slides away mid-video. */
    stage.querySelectorAll('.news__play').forEach(function (b) {
      b.addEventListener('click', function () {
        const i = parseInt(b.getAttribute('data-play'), 10);
        const it = items[i];
        const box = stage.querySelector('.news__media[data-v="' + i + '"]');
        if (!box || !it.videoId) return;
        const base = 'https://video.wixstatic.com/video/';
        box.innerHTML = '<video controls autoplay playsinline poster="' + E(it.src) + '">' +
          ['1080p', '720p', '480p'].map(function (q) {
            return '<source src="' + base + it.videoId + '/' + q + '/mp4/file.mp4" type="video/mp4">';
          }).join('') + '</video>';
        stop();
      });
    });

    function stop() { if (self._newsTimer) { clearInterval(self._newsTimer); self._newsTimer = null; } }
    function start() {
      stop();
      if (items.length < 2) return;
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      self._newsTimer = setInterval(function () { show(at + 1); }, 8000);
    }

    panel.addEventListener('mouseenter', stop);
    panel.addEventListener('mouseleave', start);
    start();
  }

  /* ---------- CHURCH CULTURE VIDEO ----------
     Set in CMS -> Home Settings. Mobile autoplays muted and loops as it
     scrolls into view; desktop shows the poster with a play button, as asked.

     Autoplay is muted because every browser requires it -- unmuted autoplay
     is blocked outright and would show a frozen frame instead. */
  fillCulture() {
    const mount = this.querySelector('#ahCulture');
    if (!mount) return;

    const raw = this.getAttribute('data-culture');
    let cfg = null;
    if (raw) {
      try { cfg = JSON.parse(raw); } catch (e) {
        console.error('arise-home: bad data-culture JSON', e);
      }
    }

    if (!cfg || !cfg.videoId || cfg.active === false) {
      /* Nothing set -- fall back to the photo collage. */
      mount.innerHTML = '<div class="gal-mount"></div>';
      this.fillGallery();
      return;
    }

    const base = 'https://video.wixstatic.com/video/';
    const poster = cfg.poster ||
      ('https://static.wixstatic.com/media/' + cfg.videoId + 'f001.jpg');

    const isMobile = window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : (window.innerWidth || 1200) <= 900;
    const reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const autoplay = isMobile && !reduce;

    mount.innerHTML =
      '<div class="cvid">' +
        '<video playsinline loop preload="' + (autoplay ? 'metadata' : 'none') + '"' +
          (autoplay ? ' muted' : ' controls') +
          ' poster="' + poster + '" aria-label="Church culture at Arise Church">' +
          ['1080p', '720p', '480p'].map(function (q) {
            return '<source src="' + base + cfg.videoId + '/' + q +
                   '/mp4/file.mp4" type="video/mp4">';
          }).join('') +
        '</video>' +
        (autoplay
          ? '<button class="cvid__tap" type="button" aria-label="Turn sound on">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z"/></svg>' +
              '<span>Sound On</span></button>'
          : '<button class="cvid__play" type="button" aria-label="Play video">' +
              '<span>&#9654;</span></button>') +
      '</div>';

    const vid = mount.querySelector('video');
    if (!vid) return;

    if (autoplay) {
      const tap = mount.querySelector('.cvid__tap');
      tap.addEventListener('click', function () {
        vid.muted = !vid.muted;
        tap.querySelector('span').textContent = vid.muted ? 'Sound On' : 'Sound Off';
        tap.setAttribute('aria-label', vid.muted ? 'Turn sound on' : 'Turn sound off');
        if (!vid.muted) { vid.controls = true; vid.play().catch(function () {}); }
      });

      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) vid.play().catch(function () {});
            else if (!vid.paused) vid.pause();
          });
        }, { threshold: 0.35 });
        io.observe(vid);
        this._cultureIO = io;
      } else {
        vid.setAttribute('autoplay', '');
        vid.play().catch(function () {});
      }

    } else {
      /* Desktop: poster with a play button, sound on from the first tap. */
      const play = mount.querySelector('.cvid__play');
      play.addEventListener('click', function () {
        play.style.display = 'none';
        vid.controls = true;
        vid.play().catch(function () {});
      });
    }
  }

  galPhotos() {
    const raw = this.getAttribute('data-photos');
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      if (!Array.isArray(d)) return [];
      return d.map(function (p) {
        if (typeof p === 'string') return { src: p, alt: '', caption: '', video: '' };
        return {
          src: p.src || p.url || p.poster || '',
          video: p.video || '',
          videoId: p.videoId || '',
          alt: p.alt || '',
          caption: p.caption || p.title || ''
        };
      }).filter(function (p) { return p.src || p.video || p.videoId; });
    } catch (e) {
      console.error('gallery: bad data-photos JSON', e);
      return [];
    }
  }

  fillGallery() {
    const mount = this.querySelector('.gal-mount');
    if (!mount) return;
    const pics = this.galPhotos();
    this._pics = pics;

    /* Nothing uploaded yet -- render nothing, not an empty frame. */
    if (!pics.length) { mount.innerHTML = ''; return; }

    const E = function (s) {
      return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    const vids = pics.filter(function (p) { return p.video || p.videoId; }).length;

    mount.innerHTML =
      '<div class="gal">' +
        pics.map(function (p, i) {
          return '<button class="gal__t" data-i="' + i + '" ' +
            'aria-label="Open ' + ((p.video || p.videoId) ? 'video' : 'photo') + ' ' + (i + 1) +
            ' of ' + pics.length + '">' +
            '<img src="' + E(p.src) + '" alt="' + E(p.alt) + '" loading="lazy">' +
            ((p.video || p.videoId) ? '<span class="gal__v">&#9654;</span>' : '') +
          '</button>';
        }).join('') +
      '</div>' +
      '<div class="gal__n">' + pics.length + ' items' +
        (vids ? ' &middot; ' + vids + ' video' + (vids > 1 ? 's' : '') : '') +
        ' &middot; tap any to open</div>';

    this.wireLightbox();
  }

  wireLightbox() {
    const self = this;
    if (!this._lb) {
      const lb = document.createElement('div');
      lb.className = 'agl-lb';
      lb.setAttribute('data-open', 'false');
      lb.innerHTML =
        '<div class="agl-lb__i"></div>' +
        '<button class="agl-lb__x" aria-label="Close">&times;</button>' +
        '<button class="agl-lb__p" aria-label="Previous">&#8249;</button>' +
        '<div class="agl-lb__stage"></div>' +
        '<button class="agl-lb__n" aria-label="Next">&#8250;</button>' +
        '<div class="agl-lb__c"></div>';
      document.body.appendChild(lb);
      this._lb = lb;

      const stage = lb.querySelector('.agl-lb__stage');
      const cap = lb.querySelector('.agl-lb__c');
      const idx = lb.querySelector('.agl-lb__i');

      this._show = function (i) {
        const list = self._pics || [];
        if (!list.length) return;
        self._i = (i + list.length) % list.length;
        const p = list[self._i];
        if (p.videoId || p.video) {
          const base = 'https://video.wixstatic.com/video/';
          const srcs = p.videoId
            ? ['1080p', '720p', '480p'].map(function (q) {
                return '<source src="' + base + p.videoId + '/' + q + '/mp4/file.mp4" type="video/mp4">';
              }).join('')
            : '<source src="' + p.video + '" type="video/mp4">';
          stage.innerHTML = '<video controls autoplay playsinline poster="' + p.src + '">' +
            srcs + '</video>';
        } else {
          stage.innerHTML = '<img src="' + p.src + '" alt="' + (p.alt || '') + '">';
        }
        cap.textContent = p.caption || '';
        idx.textContent = (self._i + 1) + ' / ' + list.length;
      };
      this._close = function () {
        lb.setAttribute('data-open', 'false');
        stage.innerHTML = '';
        document.documentElement.style.overflow = '';
      };
      lb.querySelector('.agl-lb__x').addEventListener('click', this._close);
      lb.querySelector('.agl-lb__p').addEventListener('click', function () { self._show(self._i - 1); });
      lb.querySelector('.agl-lb__n').addEventListener('click', function () { self._show(self._i + 1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) self._close(); });
      document.addEventListener('keydown', function (e) {
        if (lb.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') self._close();
        if (e.key === 'ArrowLeft') self._show(self._i - 1);
        if (e.key === 'ArrowRight') self._show(self._i + 1);
      });
    }

    this.querySelectorAll('.gal__t').forEach(function (b) {
      b.addEventListener('click', function () {
        self._show(parseInt(b.getAttribute('data-i'), 10));
        self._lb.setAttribute('data-open', 'true');
        document.documentElement.style.overflow = 'hidden';
        self._lb.querySelector('.agl-lb__x').focus();
      });
    });
  }

  disconnectedCallback() {
    if (this._cultureIO) this._cultureIO.disconnect();
    if (this._newsTimer) clearInterval(this._newsTimer);
    if (this._lb && this._lb.parentNode) this._lb.parentNode.removeChild(this._lb);
    document.documentElement.style.overflow = '';
  }
  applyContent() {
    const raw = this.getAttribute('data-content');
    if (!raw) return;
    let map;
    try { map = JSON.parse(raw); } catch (e) {
      console.error('bad data-content JSON', e); return;
    }
    if (!map || typeof map !== 'object') return;

    const self = this;
    Object.keys(map).forEach(function (k) {
      const v = map[k] || {};
      if (v.text) {
        self.querySelectorAll('[data-ck="' + k + '"]').forEach(function (el) {
          el.innerHTML = v.text;
        });
      }
      if (v.image) {
        self.querySelectorAll('[data-ci="' + k + '"]').forEach(function (el) {
          if (el.tagName === 'IMG') el.src = v.image;
          else el.style.backgroundImage = 'url(' + v.image + ')';
        });
      }
    });
  }
}

customElements.define('arise-home', AriseHome);
