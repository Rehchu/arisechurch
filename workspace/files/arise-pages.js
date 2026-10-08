/* ===========================================================================
   ARISE CHURCH — PAGE ELEMENTS  (one file, four tags)
   File: public/custom-elements/arise-pages.js

   Paste this ONCE. Then on each page add a Custom Element pointing at this
   same file, and just change the TAG NAME:

     Meet our Leaders   ->  arise-leaders
     Ministries         ->  arise-ministries
     About              ->  arise-about
     Contact            ->  arise-contact

   Stretch each element FULL WIDTH and give it plenty of height.

   ALL COPY IS FROM THE LIVE SITE. Only the confirmed corrections are applied:
   Kerik (not Ker), Will Robertson (not Robinson), the six restored missing
   words, Bryant and Ethan in third person, and the shortened leader bios.

   CONTACT PAGE — IMPORTANT
   The contact FORM is not in this element. A custom element can't submit to
   Wix Forms. Keep your existing native Wix form on the page BELOW this
   element, or the form stops working.

   NOTE: content here is hardcoded, not read from the CMS — custom elements
   can't call wix-data directly. If a leader or ministry changes, edit this
   file. (The CMS collections still exist and stay the better long-term route
   if you go back to native repeaters.)
   =========================================================================== */

const AP_FONTS =
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

const MINISTRIES = [
  { title:'Lead Network',            cat:'Learn More', link:'/general-4',  img:M+'c3b2d0_1c539649f39f48cbb157d4e27efeb843~mv2.png' },
  { title:"Children's Ministry",     cat:'Learn More', link:'/childrens',  img:M+'1f9fa2_a5448e514cc14ea08cb657e4f1a9cec4~mv2.jpg' },
  { title:'Youth Ministry',          cat:'Learn More', link:'/youth',      img:M+'1f9fa2_89a44a65090b488ea33de3157f4f3490~mv2.png' },
  { title:'Outreach',                cat:'Learn More', link:'/outreach',   img:M+'1f9fa2_2aea5b909f5e467b9d6aa1c30e513ce4~mv2.png' },
  { title:'Thrive For Young Adults', soon:true, img:M+'1f9fa2_deb5664679744b2ab198359ec71b4c0d~mv2.jpg' },
  { title:'Mvmt 6:14',               soon:true, img:M+'c3b2d0_d18e07d364724ff2b5f01b9f17d78cba~mv2.png' },
  { title:'Worship Team',            soon:true, img:M+'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg' },
  { title:'In Edge/ X Edge',         soon:true, img:M+'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg' }
];

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

const AP_CSS = `
arise-leaders,arise-ministries,arise-about,arise-contact{display:block;width:100%}
.ap *{box-sizing:border-box;margin:0;padding:0}
.ap{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;
  color-scheme:light only;width:100vw;margin-left:calc(50% - 50vw);
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

@media(prefers-reduced-motion:reduce){.ap *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .ap{background:#fff;color:#0A0A0C}
  .ap .sect{background:#fff}.ap .sect--bone{background:#F4F2F0}
  .ap .sect--ink,.ap .phead{background:#0A0A0C}
  .ap .modal__box{background:#fff}
}
`;

function apHead() {
  if (!document.getElementById('ap-fonts')) {
    const l = document.createElement('link');
    l.id = 'ap-fonts'; l.rel = 'stylesheet'; l.href = AP_FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('ap-css')) {
    const s = document.createElement('style');
    s.id = 'ap-css'; s.innerHTML = AP_CSS;
    document.head.appendChild(s);
  }
}

function creedList(rows) {
  return '<ul class="creedlist">' + rows.map(r =>
    '<li><b>' + r[0] + '</b> ' + r[1] + (r[2] ? '<cite>' + r[2] + '</cite>' : '') + '</li>'
  ).join('') + '</ul>';
}

/* ------------------------------ LEADERS ------------------------------ */
class AriseLeaders extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; apHead();
    const cards = LEADERS.map(l =>
      '<div class="lead__c' + (l.feat ? ' lead--feat' : '') + '">' +
        '<div class="lead__ph"><img src="' + l.photo + '" alt="' + l.name.replace(/&[a-z]+;/g,'') + '"></div>' +
        '<div class="lead__b">' +
          '<span class="lead__role">' + l.role + '</span>' +
          '<h3>' + l.name + '</h3>' +
          '<p>' + l.bio + '</p>' +
        '</div>' +
      '</div>').join('');

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
        '<section class="sect"><div class="shell"><div class="lead">' + cards + '</div></div></section>' +
      '</div>';
  }
}

/* ----------------------------- MINISTRIES ---------------------------- */
class AriseMinistries extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; apHead();
    const tiles = MINISTRIES.map(m => {
      const inner = '<img src="' + m.img + '" alt="' + m.title.replace(/&[a-z]+;/g,'') + '">' +
        '<div class="min__t"><h3>' + m.title + '</h3>' +
        (m.soon ? '' : '<span>' + m.cat + '</span>') + '</div>';
      return m.soon
        ? '<span class="min__c" data-soon>' + inner + '</span>'
        : '<a class="min__c" href="' + m.link + '" target="_top">' + inner + '</a>';
    }).join('');

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Ministries</h1>' +
        '</div></header>' +
        '<section class="sect"><div class="shell">' +
          '<div class="min">' + tiles + '</div>' +
          '<div class="needband"><h2>We are In Need</h2>' +
          '<a class="btn" href="/serve" target="_top">Sign Up to Serve!</a></div>' +
        '</div></section>' +
      '</div>';
  }
}

/* -------------------------------- ABOUT ------------------------------ */
class AriseAbout extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; apHead();

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>About</h1>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Who We Are</span></div>' +
          '<p class="lede">ARISE CHURCH is designed to change the lives of men, women, and children as they ' +
          'journey towards their own personal greatness within God\u2019s ordained purpose. Arise Church has the ' +
          'mandate to teach people who they are in Christ and how they should function as effective kingdom ' +
          'citizens on earth. The various ministries and outreaches at ARISE CHURCH are aimed to serve both the ' +
          'body of Christ and central Louisiana. We aspire to train ambassadors for Christ who model the glory ' +
          'of God in their lives, while revealing His kingdom on earth.</p>' +
          '<div class="strip" style="margin-top:32px"><span>Apostle Bryant Sanders &middot; Pastor Vanessa Sanders</span></div>' +

          '<div class="creed">' +
            '<button type="button" data-modal="believe">We Believe <i>&rarr;</i></button>' +
            '<button type="button" data-modal="promise">We Promise <i>&rarr;</i></button>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="pillar"><div class="pillar__h">' +
            '<div class="mark"><span class="kicker">Vision</span></div>' +
            '<h2>2026: The Year of Uncommon Favor</h2></div>' +
            '<div class="pillar__b">' +
            '<p>This is the year the Lord has marked for uncommon favor \u2014 favor that cannot be explained by ' +
            'human effort, connections, or circumstance, but favor that comes solely from the hand of a good and ' +
            'generous God.</p>' +
            '<p>2026 will be remembered as the year God crowned His people with glory, goodness, and grace beyond measure.</p>' +
          '</div></div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="pillar" style="border-top:0;padding-top:0"><div class="pillar__h">' +
            '<div class="mark mark--l"><span class="kicker">Mission</span></div>' +
            '<h2>2026 Mission Statement: Impact Tioga</h2>' +
            '<div class="strip" style="margin-top:32px"><span>Impact Tioga</span></div></div>' +
            '<div class="pillar__b">' +
            '<p>Our mission for this year is to Impact Tioga\u2014to bring the life-changing love of Jesus Christ ' +
            'into every corner of our community, transforming lives, families, and the town we call home.</p>' +
            '<p>We are called to help Tioga discover Christ: to share the Gospel boldly and compassionately, ' +
            'inviting every person to encounter the Savior who redeems, restores, and gives eternal hope.</p>' +
            '<p>We are committed to building the community together: partnering with neighbors, schools, ' +
            'businesses, and local leaders to foster unity, serve those in need, and create spaces where everyone ' +
            'feels seen, valued, and loved.</p>' +
            '<p>We are devoted to supporting one another: walking alongside each other in prayer, encouragement, ' +
            'and practical help, strengthening families, lifting up the hurting, and growing together as the ' +
            'family of God.</p>' +
            '<p>This is our moment. With God\u2019s uncommon favor upon us, we will rise up as one church, one body, ' +
            'to make a lasting impact\u2014for the glory of Jesus and the good of Tioga.</p>' +
          '</div></div>' +
        '</div></section>' +

        '<div class="modal" id="m-believe"><div class="modal__box">' +
          '<button class="modal__x" data-close aria-label="Close">&times;</button>' +
          '<div class="modal__hd"><div class="mark"><span class="kicker">Arise Church</span></div><h2>We Believe</h2></div>' +
          '<div class="modal__bd">' + creedList(BELIEFS) + '</div>' +
        '</div></div>' +

        '<div class="modal" id="m-promise"><div class="modal__box">' +
          '<button class="modal__x" data-close aria-label="Close">&times;</button>' +
          '<div class="modal__hd"><div class="mark"><span class="kicker">Arise Church</span></div><h2>We Promise</h2></div>' +
          '<div class="modal__bd">' + creedList(PROMISES) + '</div>' +
        '</div></div>' +
      '</div>';

    const root = this;
    root.querySelectorAll('[data-modal]').forEach(b => {
      b.addEventListener('click', () => {
        const m = root.querySelector('#m-' + b.getAttribute('data-modal'));
        if (m) m.setAttribute('data-open', 'true');
      });
    });
    root.querySelectorAll('[data-close]').forEach(b => {
      b.addEventListener('click', () => b.closest('.modal').setAttribute('data-open', 'false'));
    });
    root.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => { if (e.target === m) m.setAttribute('data-open', 'false'); });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') root.querySelectorAll('.modal').forEach(m => m.setAttribute('data-open','false'));
    });
  }
}

/* ------------------------------- CONTACT ----------------------------- */
class AriseContact extends HTMLElement {
  connectedCallback() {
    if (this._b) return; this._b = true; apHead();

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Contact</h1>' +
        '</div></header>' +

        '<section class="sect" style="padding-bottom:0"><div class="shell"><div class="reach">' +
          '<div class="reach__c"><h4>Email</h4>' +
            '<a href="mailto:arisenow.church@gmail.com">arisenow.church@gmail.com</a></div>' +
          '<div class="reach__c"><h4>Phone</h4>' +
            '<a href="tel:13186401865">(318) 640-1865</a></div>' +
        '</div></div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Our Locations</span></div>' +
          '<h2>One Church,<br>Two Campuses</h2>' +
          '<div class="camp">' +
            '<div class="camp__c">' +
              '<div class="camp__img"><img src="' + M + 'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg" alt="Arise Church Main Campus in Pineville, Louisiana"></div>' +
              '<div class="camp__b"><span class="camp__tag">Main Campus</span>' +
                '<p class="camp__addr">501 Ates Road<br>Pineville, La 71360</p>' +
                '<div class="camp__times">' +
                  '<div class="camp__r"><span>Sunday</span><b>10:30 AM</b></div>' +
                  '<div class="camp__r"><span>Glory Night</span><b>Mon 7:00 PM</b></div>' +
                  '<div class="camp__r"><span>Wednesday</span><b>7:00 PM</b></div>' +
                  '<div class="camp__r"><span>Corporate Prayer</span><b>Mon&ndash;Thu 5:00 AM</b></div>' +
                '</div>' +
                '<a class="camp__link" href="https://www.google.com/maps/dir//501+Ates+Rd,+Pineville,+LA+71360" target="_top">Directions &rarr;</a>' +
              '</div>' +
            '</div>' +
            '<div class="camp__c">' +
              '<div class="camp__img"><img src="' + M + 'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg" alt="Arise Church Alexandria Campus congregation"></div>' +
              '<div class="camp__b"><span class="camp__tag">Second Campus</span>' +
                '<p class="camp__addr">5305 North Blvd<br>Alexandria, LA 71301</p>' +
                '<div class="camp__times">' +
                  '<div class="camp__r"><span>Sunday</span><b>10:30 AM</b></div>' +
                  '<p class="camp__note">Weeknight services meet at the Main Campus.</p>' +
                '</div>' +
                '<a class="camp__link" href="https://www.google.com/maps/dir//5305+North+Blvd,+Alexandria,+LA+71301" target="_top">Directions &rarr;</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Contact Us</span></div>' +
          '<h2>Contact Us</h2>' +
          '<div class="social">' +
            '<a href="https://www.facebook.com/arisenow" target="_top" aria-label="Arise Church on Facebook"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg></a>' +
            '<a href="http://instagram.com/arisechurch.cenla" target="_top" aria-label="Arise Church on Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1A6.7 6.7 0 1018.7 12 6.7 6.7 0 0012 5.3zm0 11A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.9-11.2a1.6 1.6 0 11-1.6-1.6 1.6 1.6 0 011.6 1.6z"/></svg></a>' +
            '<a href="https://www.youtube.com/@arisechurch4147" target="_top" aria-label="Arise Church on YouTube"><svg viewBox="0 0 24 24"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C17.2 4 12 4 12 4s-5.2 0-7.8.2c-.5.1-1.4.1-2.3 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s5.2 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.8c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.9l6.2 3.1z"/></svg></a>' +
            '<a href="http://twitter.com/AriseChurch_C" target="_top" aria-label="Arise Church on X"><svg viewBox="0 0 24 24"><path d="M18.2 2.3h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9.1L.9 2.3h7l4.8 6.4zm-1.2 17.9h1.9L7.1 4.2H5z"/></svg></a>' +
          '</div>' +
          '<div class="strip" style="margin-top:40px"><span>#YouBelongHere</span></div>' +
        '</div></section>' +
      '</div>';
  }
}

customElements.define('arise-leaders', AriseLeaders);
customElements.define('arise-ministries', AriseMinistries);
customElements.define('arise-about', AriseAbout);
customElements.define('arise-contact', AriseContact);
