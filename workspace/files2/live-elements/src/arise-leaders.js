/* ===========================================================================
   ARISE CHURCH -- MEET OUR LEADERS
   File: public/custom-elements/arise-leaders.js
   Tag:  arise-leaders

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-leaders.js
      -> paste this whole file
   2. Editor -> the Meet our Leaders page -> Add (+) -> Embed Code -> Custom Element
   3. Choose Source -> Velo file -> arise-leaders.js
      Tag Name: arise-leaders
   4. STRETCH IT FULL WIDTH. Give it plenty of height.
   5. Save, then PUBLISH. Check the LIVE page -- custom elements render in an
      iframe in Editor and Preview, so they look wrong there. That's normal.

   All copy is from the live site.
   Leader content is hardcoded below -- edit this file to change a bio,
   a role, or a photo.
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';

const LEADERS = [
  { name:'Bryant &amp; Vanessa Sanders', role:'Apostle &middot; Pastor &amp; Prophet', feat:true,
    photo:M+'1f9fa2_e137cc6737284d6694200ea8feda5552~mv2.png',
    bio:'Apostle Bryant Sanders leads Arise Church and the Lead Network. Pastor Vanessa Sanders serves as Prophet, offering insight and guidance to our community.' },
  { name:'Norman and Margie Youngblood', role:'Elder &middot; Pastoral Team',
    photo:M+'1f9fa2_b3cdea954391493eba6f3f63878bf2d4~mv2.png',
    bio:'Norman serves as one of our elders and is an integral part of our pastoral team. Margie serves on the praise and worship team.' },
  { name:'Chad and Tabitha Kerik', role:'Elders &middot; Youth Ministers',
    photo:M+'1f9fa2_4fb0f121cb08443a8ca1f72286449c12~mv2.png',
    bio:'Elders, Youth Ministers, and Leaders of Thrive for young adults.' },
  { name:'Herbert and Erica Perry', role:'Minister',
    photo:M+'1f9fa2_4b62ef589ff047009574fdceb6c39e18~mv2.png',
    bio:'Herbert serves as one of our ministers, leading with passion and grace.' },
  { name:'Will Robertson', role:'Pastor',
    photo:M+'1f9fa2_76391dad01a64c3ba6df7e2e76c77ba8~mv2.png',
    bio:'An essential member of our Pastoral Team, serving our community with kindness and compassion.' },
  { name:'Ethan Mayes', role:'Minister &middot; Worship',
    photo:M+'1f9fa2_32361ebeaf7d4f2095bdb7383421ad6d~mv2.png',
    bio:'A committed member of our praise and worship team and one of our ministers.' }
];

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
.ap .lead{margin-top:50px}

/* Every leader photo is 1944x2664. Using that exact ratio with object-fit
   contain means nothing is ever cropped -- no cut-off heads or bodies. */
.ap .lead__ph{aspect-ratio:1944/2664;overflow:hidden;background:var(--bone)}
.ap .lead__ph img{width:100%;height:100%;object-fit:contain;display:block}

/* Apostle & Pastor -- full width, photo left, text right */
.ap .lead__feat{display:grid;grid-template-columns:minmax(0,330px) 1fr;
  gap:clamp(24px,4vw,52px);align-items:center;border:1px solid var(--rule);
  background:var(--paper);padding:clamp(20px,3vw,36px)}
@media(max-width:760px){.ap .lead__feat{grid-template-columns:1fr;gap:24px}}
.ap .lead__feat h2{font-size:clamp(26px,3.4vw,40px);letter-spacing:.03em;margin-top:16px}
.ap .lead__feat p{font-size:clamp(15.5px,1.5vw,17px);color:var(--muted);margin-top:18px;
  line-height:1.72;max-width:58ch}

/* Everyone else -- uniform 3-up grid, all cards equal height */
.ap .lead__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:26px}
@media(max-width:900px){.ap .lead__grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ap .lead__grid{grid-template-columns:1fr}}
.ap .lead__c{background:var(--paper);border:1px solid var(--rule);
  display:flex;flex-direction:column}
.ap .lead__b{padding:22px}
.ap .lead__role{display:inline-block;background:var(--red);color:#fff;font-size:10px;
  font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:5px 10px}
.ap .lead__c h2{margin-top:14px;font-size:19px;letter-spacing:.04em;line-height:1.15}
.ap .lead__c p{font-size:14.5px;color:var(--muted);margin-top:12px;line-height:1.7}
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

.ap .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;margin-top:0}
.ap .cta h2{color:#fff}
.ap .cta p{color:#fff;margin-top:12px;max-width:46ch}
.ap .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.ap .cta .kicker{color:#fff}
.ap .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.ap .cta .btn:hover{background:transparent;color:#fff}
.ap .cta__b{flex:1 1 320px}
.ap .social{display:flex;gap:16px;flex-wrap:wrap;margin-top:24px}
.ap .social a{width:46px;height:46px;border:1px solid var(--ruleD);display:flex;align-items:center;
  justify-content:center;color:#fff;text-decoration:none}
.ap .social a:hover{background:var(--red);border-color:var(--red)}
.ap .social svg{width:19px;height:19px;fill:currentColor}

@media(prefers-reduced-motion:reduce){.ap *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .ap{background:#fff;color:#0A0A0C}
  .ap .sect{background:#fff}.ap .sect--bone{background:#F4F2F0}
  .ap .sect--ink,.ap .phead{background:#0A0A0C}
  .ap .modal__box{background:#fff}
}
`;

function injectHead() {
  if (!document.getElementById('ap-leaders-fonts')) {
    const l = document.createElement('link');
    l.id = 'ap-leaders-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('ap-leaders-css')) {
    const s = document.createElement('style');
    s.id = 'ap-leaders-css'; s.innerHTML = AP_CSS;
    document.head.appendChild(s);
  }
}

class AriseLeaders extends HTMLElement {
  static get observedAttributes() { return ['data-leaders', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.build();
  }

  /* CMS rows when page code supplies them, otherwise the built-in list --
     so the page never goes blank if the query fails. */
  people() {
    const raw = this.getAttribute('data-leaders');
    if (!raw) return LEADERS;
    try {
      const d = JSON.parse(raw);
      if (!Array.isArray(d) || !d.length) return LEADERS;
      return d.map(function (l) {
        return { name: l.name || '', role: l.role || '', bio: l.bio || '',
                 photo: l.photo || '', feat: !!l.featured };
      });
    } catch (e) {
      console.error('arise-leaders: bad data-leaders JSON', e);
      return LEADERS;
    }
  }

  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();
    this.build();
  }

  build() {
    const LIST = this.people();
    const lead = LIST.filter(l => l.feat)[0];
    const rest = LIST.filter(l => !l.feat);

    const featCard = !lead ? '' :
      '<div class="lead__feat">' +
        '<div class="lead__ph"><img src="' + lead.photo + '" alt="' +
          lead.name.replace(/&[a-z]+;/g,'') + '"></div>' +
        '<div>' +
          '<span class="lead__role">' + lead.role + '</span>' +
          '<h2>' + lead.name + '</h2>' +
          '<p>' + lead.bio + '</p>' +
        '</div>' +
      '</div>';

    const cards = '<div class="lead__grid">' + rest.map(l =>
      '<div class="lead__c">' +
        '<div class="lead__ph"><img src="' + l.photo + '" alt="' + l.name.replace(/&[a-z]+;/g,'') + '"></div>' +
        '<div class="lead__b">' +
          '<span class="lead__role">' + l.role + '</span>' +
          '<h2>' + l.name + '</h2>' +
          '<p>' + l.bio + '</p>' +
        '</div>' +
      '</div>').join('') + '</div>';

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Meet our Leaders</h1>' +
          '<p class="lede">Welcome to our community. We are pleased to present our esteemed ministers, ' +
          'leaders, and staff who are dedicated to our mission. Each individual contributes unique talents ' +
          'and a commitment to cultivating an inclusive environment. We invite you to explore their ' +
          'significant contributions to our organization.</p>' +
        '</div></header>' +
        '<section class="sect"><div class="shell"><div class="lead">' + featCard + cards + '</div></div></section>' +
        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta">' +
            '<div class="cta__b">' +
              '<div class="mark"><span class="kicker">Visit</span></div>' +
              '<h2>Come Meet Them<br>On a Sunday</h2>' +
              '<p>Sunday 10:30 AM in Pineville, 10:00 AM in Alexandria. Come as you are.</p>' +
            '</div>' +
            '<a class="btn" href="/contact" target="_top">Plan Your Visit</a>' +
          '</div>' +
        '</div></section>' +
      '</div>';

    this.applyContent();
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

customElements.define('arise-leaders', AriseLeaders);