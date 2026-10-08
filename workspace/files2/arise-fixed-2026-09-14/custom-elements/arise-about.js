/* ===========================================================================
   ARISE CHURCH -- ABOUT
   File: public/custom-elements/arise-about.js
   Tag:  arise-about

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-about.js
      -> paste this whole file
   2. Editor -> the About page -> Add (+) -> Embed Code -> Custom Element
   3. Choose Source -> Velo file -> arise-about.js
      Tag Name: arise-about
   4. STRETCH IT FULL WIDTH. Give it plenty of height.
   5. Save, then PUBLISH. Check the LIVE page -- custom elements render in an
      iframe in Editor and Preview, so they look wrong there. That's normal.

   All copy is from the live site.
   Fixed 2026-09-14: Sunday times CMS hooks, We Believe/We Promise dialogs accessible (role, focus return, Tab trap), safer applyContent.
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-about.json)
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const BELIEFS = [
  ['WE BELIEVE','that the Bible is the inspired Word of God and that it is unbiblical for anyone to add to it or take away from it.','(2 Timothy 3:16)'],
  ['WE BELIEVE','in the Virgin birth; that Jesus came to earth through the womb of a virgin woman.','(Matthew 1:23)'],
  ['WE BELIEVE','that Jesus Christ died to redeem fallen man and to declare him righteous.','(John 3:16-17)'],
  ['WE BELIEVE','that salvation is only by grace through faith, and not of works.','(Ephesians 2:8-10)'],
  ['WE BELIEVE','that eternal life is given to every sinner that confesses Jesus Christ as Lord.','(Romans 10:9-10; Philippians 2:9-11)']
];

const PROMISES = [
  ['WE PROMISE','that you may come as you are, but you will never leave as you were.',''],
  ['WE PROMISE','that the foundation of all sermons and teachings will come from the truth of the gospel of Jesus and not the opinions of man.',''],
  ['WE PROMISE','that Arise Church will be a safe environment for you and your family to grow spiritually, mentally, emotionally, and physically.',''],
  ['WE PROMISE','that your race, gender, age, sin, past or present circumstances will not prevent you from being loved and cherished here at Arise Church.',''],
  ['WE PROMISE','to help guide you on a path of freedom to know your true identity in the Kingdom of God regardless of what this world might suggest.','']
];

function creedList(rows, pfx) {
  return '<ul class="creedlist">' + rows.map((r, i) =>
    '<li><b data-ck="' + pfx + '.itemLead">' + r[0] + '</b> <span data-ck="' + pfx + '.item' + (i + 1) + '">' + r[1] + '</span>' +
    (r[2] ? '<cite data-ck="' + pfx + '.item' + (i + 1) + 'Ref">' + r[2] + '</cite>' : '') + '</li>'
  ).join('') + '</ul>';
}

const AP_CSS = `
arise-leaders,arise-ministries,arise-about,arise-contact{display:block;width:100%}
.ap *{box-sizing:border-box;margin:0;padding:0}
.ap{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;
  color-scheme:light only;
}
.ap img{color:#fff;font-size:12px;background:#1A1A1F}
.ap .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.ap h1,.ap h2,.ap h3,.ap h4{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.ap h1{font-size:clamp(40px,7.4vw,84px)}
.ap h2{font-size:clamp(28px,4.2vw,50px)}
.ap h3{font-size:clamp(17px,1.8vw,22px);letter-spacing:.04em}
.ap h4{font-size:13px;letter-spacing:.12em}
.ap p{font-size:clamp(15.5px,1.4vw,17px)}
.ap .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.ap .mark{display:flex;align-items:center;margin-bottom:18px}
.ap .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.ap .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .ap .mark{flex-wrap:nowrap;align-items:flex-start}
  .ap .mark::before{margin-right:124px;margin-top:5px}
  .ap .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.ap .mark--l .kicker{color:var(--redL)}
.ap .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.ap .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.ap .btn{display:inline-block;padding:14px 30px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;cursor:pointer;transition:background .18s,color .18s,border-color .18s}
.ap .btn:hover{background:transparent;color:#fff;border-color:#fff}
.ap .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.ap .btn--dark:hover{background:var(--ink);color:#fff}
.ap a:focus-visible,.ap button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.ap .sect{padding:var(--sect) 0;background:var(--paper)}
.ap .sect--bone{background:var(--bone)}
.ap .sect--ink{background:var(--ink)}
.ap .sect--ink h2,.ap .sect--ink h3{color:#fff}
.ap .sect--ink p{color:rgba(255,255,255,.82)}

.ap .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.ap .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.ap .phead h1,.ap .phead p{position:relative;z-index:1}
.ap .phead h1{color:#fff}
.ap .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:64ch}

/* LEADERS */
.ap .lead{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--rule) ;gap:2px;background:var(--rule);margin-top:50px}
.ap .lead__c{background:var(--paper);display:flex;flex-direction:column}
.ap .lead__ph{aspect-ratio:3/4;overflow:hidden;background:var(--bone)}
.ap .lead__ph img{width:100%;height:100%;object-fit:cover;object-position:center 15%}
.ap .lead__b{padding:26px}
.ap .lead__role{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:5px 10px}
.ap .lead__c h3{margin-top:16px}
.ap .lead__c p{font-size:14.5px;color:var(--muted);margin-top:16px;line-height:1.7}
.ap .lead--feat{grid-column:span 2}
.ap .lead--feat .lead__ph{aspect-ratio:16/10}
.ap .lead--feat h3{font-size:clamp(24px,2.6vw,32px)}
@media(max-width:900px){.ap .lead{grid-template-columns:repeat(2,1fr)}.ap .lead--feat{grid-column:span 2}}
@media(max-width:560px){.ap .lead{grid-template-columns:1fr}.ap .lead--feat{grid-column:span 1}
  .ap .lead--feat .lead__ph{aspect-ratio:3/4}}

/* MINISTRIES */
.ap .min{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:var(--rule)}
.ap .min__c{position:relative;display:block;text-decoration:none;background:var(--scrim);
  overflow:hidden;aspect-ratio:4/5}
.ap .min__c img{width:100%;height:100%;object-fit:cover;filter:grayscale(.28) brightness(.6);
  transition:transform .5s,filter .35s}
.ap .min__c:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.76)}
.ap .min__t{position:absolute;left:0;right:0;bottom:0;padding:44px 18px 20px;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.72) 42%,rgba(6,6,8,.97) 100%)}
.ap .min__t h3{color:#fff;font-size:17px}
.ap .min__t span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#fff;opacity:.92;margin-top:5px;font-weight:500}
.ap .min__c[data-soon]::after{content:"Coming Soon";position:absolute;top:18px;left:18px;
  background:var(--red);color:#fff;font-size:10px;font-weight:600;letter-spacing:.14em;
  text-transform:uppercase;padding:5px 11px}
@media(max-width:1000px){.ap .min{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.ap .min{grid-template-columns:1fr}}

.ap .needband{background:var(--red);color:#fff;padding:44px clamp(24px,4vw,52px);margin-top:50px;
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.ap .needband h2{color:#fff}
.ap .needband .btn{background:#fff;border-color:#fff;color:var(--red)}
.ap .needband .btn:hover{background:transparent;color:#fff}

/* ABOUT */
.ap .pillar{display:grid;grid-template-columns:.42fr .58fr;gap:clamp(28px,5vw,64px);
  align-items:start;padding:var(--sect) 0;border-top:1px solid var(--rule)}
.ap .pillar:first-of-type{border-top:0}
.ap .pillar__b p + p{margin-top:24px}
.ap .pillar__b p{color:var(--muted);max-width:64ch}
.ap .pillar__b p:first-child{color:var(--ink);font-size:clamp(17px,1.6vw,19px)}
.ap .sect--ink .pillar__b p{color:rgba(255,255,255,.82)}
.ap .sect--ink .pillar__b p:first-child{color:#fff}
@media(max-width:860px){.ap .pillar{grid-template-columns:1fr;gap:24px}}

.ap .creed{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:48px}
.ap .creed button{display:flex;align-items:center;justify-content:space-between;gap:24px;width:100%;
  padding:32px;background:var(--ink);color:#fff;border:0;border-left:5px solid var(--red);
  cursor:pointer;font-family:'Anton',Impact,sans-serif;font-size:21px;text-transform:uppercase;
  letter-spacing:.04em;text-align:left}
.ap .creed button:hover{background:#16161b}
.ap .creed button i{font-style:normal;color:var(--red);font-size:24px}
@media(max-width:640px){.ap .creed{grid-template-columns:1fr}}

.ap .modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;
  padding:24px;background:rgba(6,6,8,.86)}
.ap .modal[data-open="true"]{display:flex}
.ap .modal__box{background:#fff;max-width:720px;width:100%;max-height:86vh;overflow:auto;
  position:relative;border-top:6px solid var(--red)}
.ap .modal__x{position:absolute;top:14px;right:14px;width:38px;height:38px;border:1px solid var(--rule);
  background:#fff;cursor:pointer;font-size:20px;line-height:1}
.ap .modal__hd{padding:32px 48px 20px;border-bottom:1px solid var(--rule)}
.ap .modal__bd{padding:32px 48px 48px}
.ap .creedlist{list-style:none}
.ap .creedlist li{position:relative;padding:0 0 24px 30px;margin-bottom:24px;
  border-bottom:1px solid var(--rule);font-size:16px;line-height:1.72}
.ap .creedlist li:last-child{border-bottom:0;margin-bottom:0;padding-bottom:0}
.ap .creedlist li::before{content:"";position:absolute;left:0;top:11px;width:16px;height:5px;background:var(--red)}
.ap .creedlist b{font-family:'Anton',Impact,sans-serif;font-weight:400;letter-spacing:.05em}
.ap .creedlist cite{display:block;margin-top:6px;font-style:normal;font-size:12px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--red);font-weight:500}

/* CONTACT */
.ap .reach{display:grid;grid-template-columns:repeat(2,1fr);gap:2px;background:var(--rule);margin-top:0}
.ap .reach__c{background:var(--paper);padding:32px;display:flex;flex-direction:column;gap:8px}
.ap .reach__c h4{color:var(--red)}
.ap .reach__c a{font-size:19px;color:var(--ink);text-decoration:none;word-break:break-word}
.ap .reach__c a:hover{color:var(--red)}
@media(max-width:760px){.ap .reach{grid-template-columns:1fr}}

.ap .camp{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:50px;background:var(--rule)}
.ap .camp__c{background:var(--paper);display:flex;flex-direction:column}
.ap .camp__img{aspect-ratio:16/9;background:var(--scrim);overflow:hidden}
.ap .camp__img img{width:100%;height:100%;object-fit:cover}
.ap .camp__b{padding:32px;flex:1}
.ap .camp__tag{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;padding:5px 11px;margin-bottom:16px}
.ap .camp__addr{font-size:17px;color:var(--ink);line-height:1.7;margin-top:8px}
.ap .camp__times{margin-top:24px;padding-top:24px;border-top:1px solid var(--rule)}
.ap .camp__r{display:flex;justify-content:space-between;gap:14px;padding:6px 0;font-size:14.5px;color:var(--muted)}
.ap .camp__r b{font-weight:500;white-space:nowrap;color:var(--ink)}
.ap .camp__note{font-size:13.5px;color:var(--muted);font-style:italic;margin-top:12px}
.ap .camp__link{margin-top:24px;display:inline-block;font-size:12px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;color:var(--red);text-decoration:none}
@media(max-width:760px){.ap .camp{grid-template-columns:1fr}}

.ap .social{display:flex;gap:16px;flex-wrap:wrap;margin-top:24px}
.ap .social a{width:46px;height:46px;border:1px solid var(--ruleD);display:flex;align-items:center;
  justify-content:center;color:#fff;text-decoration:none}
.ap .social a:hover{background:var(--red);border-color:var(--red)}
.ap .social svg{width:19px;height:19px;fill:currentColor}

.ap .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-top:0}
.ap .cta h2{color:#fff}
.ap .cta p{color:#fff;margin-top:12px;max-width:46ch}
.ap .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.ap .cta .kicker{color:#fff}
.ap .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.ap .cta .btn:hover{background:transparent;color:#fff}
.ap .cta__b{flex:1 1 320px}
@media(prefers-reduced-motion:reduce){.ap *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .ap{background:#fff;color:#0A0A0C}
  .ap .sect{background:#fff}.ap .sect--bone{background:#F4F2F0}
  .ap .sect--ink,.ap .phead{background:#0A0A0C}
  .ap .modal__box{background:#fff}
}
`;

/* Visible focusable controls inside an open popup (for the Tab trap). */
function aabFocusables(m) {
  return Array.prototype.filter.call(
    m.querySelectorAll('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'),
    function (el) { return !el.disabled && el.offsetParent !== null; });
}

/* Arise Church photos: ask Wix for a resized copy (whole image, longest side at most w,
   AVIF/WebP picked per browser). Anything that is not a plain wixstatic photo is left alone. */
function aabImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function injectHead() {
  if (!document.getElementById('ap-about-fonts') && !document.querySelector('link[href="' + FONTS + '"]')) {
    const l = document.createElement('link');
    l.id = 'ap-about-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('ap-about-css')) {
    const s = document.createElement('style');
    s.id = 'ap-about-css'; s.innerHTML = AP_CSS;
    document.head.appendChild(s);
  }
}

class AriseAbout extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { if (this._b) this.applyContent(); }

  connectedCallback() {
    if (this._b) {
      /* re-attached: re-arm the Escape handler */
      if (this._onKey) document.addEventListener('keydown', this._onKey);
      return;
    }
    this._b = true; injectHead();

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="about.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="about.hero.heading">About</h1>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="about.who.kicker">Who We Are</span></div>' +
          '<p class="lede" data-ck="about.who.body">ARISE CHURCH is designed to change the lives of men, women, and children as they ' +
          'journey towards their own personal greatness within God\u2019s ordained purpose. Arise Church has the ' +
          'mandate to teach people who they are in Christ and how they should function as effective kingdom ' +
          'citizens on earth. The various ministries and outreaches at ARISE CHURCH are aimed to serve both the ' +
          'body of Christ and central Louisiana. We aspire to train ambassadors for Christ who model the glory ' +
          'of God in their lives, while revealing His kingdom on earth.</p>' +
          '<div class="strip" style="margin-top:32px"><span data-ck="about.who.leaders">Apostle Bryant Sanders &middot; Pastor Vanessa Sanders</span></div>' +

          '<div class="creed">' +
            '<button type="button" data-modal="believe" aria-haspopup="dialog" aria-controls="m-believe"><span data-ck="about.believe.button">We Believe</span> <i>&rarr;</i></button>' +
            '<button type="button" data-modal="promise" aria-haspopup="dialog" aria-controls="m-promise"><span data-ck="about.promise.button">We Promise</span> <i>&rarr;</i></button>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="pillar"><div class="pillar__h">' +
            '<div class="mark"><span class="kicker" data-ck="about.vision.kicker">Vision</span></div>' +
            '<h2 data-ck="about.vision.heading">2026: The Year of Uncommon Favor</h2></div>' +
            '<div class="pillar__b">' +
            '<p data-ck="about.vision.body">This is the year the Lord has marked for uncommon favor \u2014 favor that cannot be explained by ' +
            'human effort, connections, or circumstance, but favor that comes solely from the hand of a good and ' +
            'generous God.</p>' +
            '<p data-ck="about.vision.body2">2026 will be remembered as the year God crowned His people with glory, goodness, and grace beyond measure.</p>' +
          '</div></div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="pillar" style="border-top:0;padding-top:0"><div class="pillar__h">' +
            '<div class="mark mark--l"><span class="kicker" data-ck="about.mission.kicker">Mission</span></div>' +
            '<h2 data-ck="about.mission.heading">2026 Mission Statement: Impact Tioga</h2>' +
            '<div class="strip" style="margin-top:32px"><span data-ck="about.mission.strip">Impact Tioga</span></div></div>' +
            '<div class="pillar__b">' +
            '<p data-ck="about.mission.body">Our mission for this year is to Impact Tioga\u2014to bring the life-changing love of Jesus Christ ' +
            'into every corner of our community, transforming lives, families, and the town we call home.</p>' +
            '<p data-ck="about.mission.body2">We are called to help Tioga discover Christ: to share the Gospel boldly and compassionately, ' +
            'inviting every person to encounter the Savior who redeems, restores, and gives eternal hope.</p>' +
            '<p data-ck="about.mission.body3">We are committed to building the community together: partnering with neighbors, schools, ' +
            'businesses, and local leaders to foster unity, serve those in need, and create spaces where everyone ' +
            'feels seen, valued, and loved.</p>' +
            '<p data-ck="about.mission.body4">We are devoted to supporting one another: walking alongside each other in prayer, encouragement, ' +
            'and practical help, strengthening families, lifting up the hurting, and growing together as the ' +
            'family of God.</p>' +
            '<p data-ck="about.mission.body5">This is our moment. With God\u2019s uncommon favor upon us, we will rise up as one church, one body, ' +
            'to make a lasting impact\u2014for the glory of Jesus and the good of Tioga.</p>' +
          '</div></div>' +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta">' +
            '<div class="cta__b">' +
              '<div class="mark"><span class="kicker" data-ck="about.cta.kicker">Visit</span></div>' +
              '<h2 data-ck="about.cta.heading">You Belong Here</h2>' +
              '<p><span data-ck="site.times.sunday.main">Sunday 10:30 AM</span> <span data-ck="about.cta.where1">in Pineville,</span> <span data-ck="site.times.sunday.second">Sunday 10:00 AM</span> <span data-ck="about.cta.where2">in Alexandria.</span> ' + '<span data-ck="about.cta.body">Come as you are \u2014 but never leave as you were.</span></p>' +
            '</div>' +
            '<a class="btn" href="/contact" target="_top" data-ck="about.cta.button">Plan Your Visit</a>' +
          '</div>' +
        '</div></section>' +
        '<div class="modal" id="m-believe" role="dialog" aria-modal="true" aria-labelledby="m-believe-h"><div class="modal__box">' +
          '<button class="modal__x" data-close aria-label="Close">&times;</button>' +
          '<div class="modal__hd"><div class="mark"><span class="kicker" data-ck="about.believe.kicker">Arise Church</span></div><h2 id="m-believe-h" data-ck="about.believe.heading">We Believe</h2></div>' +
          '<div class="modal__bd">' + creedList(BELIEFS, 'about.believe') + '</div>' +
        '</div></div>' +

        '<div class="modal" id="m-promise" role="dialog" aria-modal="true" aria-labelledby="m-promise-h"><div class="modal__box">' +
          '<button class="modal__x" data-close aria-label="Close">&times;</button>' +
          '<div class="modal__hd"><div class="mark"><span class="kicker" data-ck="about.promise.kicker">Arise Church</span></div><h2 id="m-promise-h" data-ck="about.promise.heading">We Promise</h2></div>' +
          '<div class="modal__bd">' + creedList(PROMISES, 'about.promise') + '</div>' +
        '</div></div>' +
      '</div>';

    this.applyContent();

    const root = this;
    /* close a popup and hand focus back to the button that opened it */
    const closeModal = m => {
      const wasOpen = m.getAttribute('data-open') === 'true';
      m.setAttribute('data-open', 'false');
      if (wasOpen && root._lastTrigger && root._lastTrigger.isConnected) {
        try { root._lastTrigger.focus(); } catch (err) {}
      }
    };
    root.querySelectorAll('[data-modal]').forEach(b => {
      b.addEventListener('click', () => {
        const m = root.querySelector('#m-' + b.getAttribute('data-modal'));
        if (m) {
          root._lastTrigger = b;
          m.setAttribute('data-open', 'true');
          const x = m.querySelector('.modal__x');
          if (x) { try { x.focus(); } catch (err) {} }
        }
      });
    });
    root.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => closeModal(b.closest('.modal')));
    });
    root.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
    });
    this._onKey = e => {
      if (e.key === 'Escape') root.querySelectorAll('.modal').forEach(m => closeModal(m));
      if (e.key === 'Tab') {
        const open = root.querySelector('.modal[data-open="true"]');
        if (!open) return;
        const f = aabFocusables(open);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        const a = document.activeElement;
        if (e.shiftKey && (a === first || !open.contains(a))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (a === last || !open.contains(a))) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', this._onKey);
  }
  disconnectedCallback() {
    if (this._onKey) document.removeEventListener('keydown', this._onKey);
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
        const img = aabImg(v.image, Number(el.getAttribute('data-ciw')) || 1600);
        if (el.tagName === 'IMG') el.src = img;
        else el.style.backgroundImage = 'url("' + String(img).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-about', AriseAbout);
