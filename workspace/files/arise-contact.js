/* ===========================================================================
   ARISE CHURCH -- CONTACT
   File: public/custom-elements/arise-contact.js
   Tag:  arise-contact

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-contact.js
      -> paste this whole file
   2. Editor -> the Contact page -> Add (+) -> Embed Code -> Custom Element
   3. Choose Source -> Velo file -> arise-contact.js
      Tag Name: arise-contact
   4. STRETCH IT FULL WIDTH. Give it plenty of height.
   5. Save, then PUBLISH. Check the LIVE page -- custom elements render in an
      iframe in Editor and Preview, so they look wrong there. That's normal.

   All copy is from the live site.
   IMPORTANT: the contact FORM is not in this element -- a custom element
   cannot submit to Wix Forms. Keep your native Wix form on the page
   BELOW this element or contact submissions will stop working.
   =========================================================================== */

const FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const M = 'https://static.wixstatic.com/media/';

/* ---------------------------------------------------------------------------
   CAMPUS PHOTOS
   Upload campus-pineville@2x.jpg and campus-alexandria@2x.jpg to your Wix
   Media Manager, then paste their wixstatic URLs here. Two lines, that's it.
   Until you do, these fall back to existing images from your library.
   --------------------------------------------------------------------------- */
const CAMPUS_PINEVILLE   = 'https://static.wixstatic.com/media/c3b2d0_d90892fdb5fd40d8bd3c1057ca244d04~mv2.jpg';
const CAMPUS_ALEXANDRIA  = 'https://static.wixstatic.com/media/c3b2d0_51f64171a5904d5b9b8b492f062db9bc~mv2.jpg';


/* Velo HTTP Function on this same site. Requires backend/http-functions.js
   (see FORMS-SETUP.md). Custom elements can't call Velo backend modules,
   but they can fetch this. */
const FORM_ENDPOINT = '/_functions/ariseForm';

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
.ap .reach__c .lbl{color:var(--red);font-family:'Anton',Impact,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;line-height:1.02}
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

.ap .formlead{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.ap form{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:40px}
.ap form .full{grid-column:1/-1}
@media(max-width:640px){.ap form{grid-template-columns:1fr}}
.ap .fld label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:var(--muted);margin-bottom:9px}
.ap .fld label .req{color:var(--red)}
.ap .fld input,.ap .fld textarea{width:100%;background:transparent;border:0;
  border-bottom:1.5px solid var(--rule);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:16.5px;color:var(--ink)}
.ap .fld textarea{min-height:120px;resize:vertical;line-height:1.6}
.ap .fld input:focus,.ap .fld textarea:focus{outline:none;border-bottom-color:var(--red)}
.ap .fld.bad input,.ap .fld.bad textarea{border-bottom-color:var(--red)}
.ap .hint{font-size:12px;color:var(--red);margin-top:7px;min-height:16px}
.ap form button{display:inline-block;padding:16px 36px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;border:1.5px solid var(--red);background:var(--red);
  color:#fff;font-family:inherit;cursor:pointer;transition:background .18s,color .18s}
.ap form button:hover{background:transparent;color:var(--red)}
.ap form button[disabled]{opacity:.55;pointer-events:none}
.ap .fnote{grid-column:1/-1;font-size:14.5px;color:var(--muted);min-height:22px}
.ap .fnote[data-err="true"]{color:var(--red)}
.ap .fdone{margin-top:40px;border-left:5px solid var(--red);padding:28px 30px;background:#fff}
.ap .fdone h3{margin-bottom:10px}
.ap .fdone p{color:var(--muted);font-size:16px}
.ap .formlead p{color:var(--muted);margin-top:20px;max-width:56ch}
.ap .formnote{margin-top:32px;padding:18px 22px;border-left:4px solid var(--red);
  background:var(--bone);font-size:14.5px;color:var(--muted)}

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
  if (!document.getElementById('ap-contact-fonts')) {
    const l = document.createElement('link');
    l.id = 'ap-contact-fonts'; l.rel = 'stylesheet'; l.href = FONTS;
    document.head.appendChild(l);
  }
  if (!document.getElementById('ap-contact-css')) {
    const s = document.createElement('style');
    s.id = 'ap-contact-css'; s.innerHTML = AP_CSS;
    document.head.appendChild(s);
  }
}

class AriseContact extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { if (this._b) this.applyContent(); }

  connectedCallback() {
    if (this._b) return; this._b = true; injectHead();

    this.innerHTML =
      '<div class="ap">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1>Contact</h1>' +
        '</div></header>' +

        '<section class="sect" style="padding-bottom:0"><div class="shell"><div class="reach">' +
          '<div class="reach__c"><div class="lbl">Email</div>' +
            '<a href="mailto:arisenow.church@gmail.com">arisenow.church@gmail.com</a></div>' +
          '<div class="reach__c"><div class="lbl">Phone</div>' +
            '<a href="tel:13186401865">(318) 640-1865</a></div>' +
        '</div></div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Our Locations</span></div>' +
          '<h2>One Church,<br>Two Campuses</h2>' +
          '<div class="camp">' +
            '<div class="camp__c">' +
              '<div class="camp__img"><img src="' + CAMPUS_PINEVILLE + '" alt="Arise Church Main Campus building in Pineville, Louisiana"></div>' +
              '<div class="camp__b"><span class="camp__tag">Main Campus</span>' +
                '<p class="camp__addr">501 Ates Road<br>Pineville, LA 71360</p>' +
                '<div class="camp__times">' +
                  '<div class="camp__r"><span>Sunday</span><b data-ck="site.times.sunday.main">10:30 AM</b></div>' +
                  '<div class="camp__r"><span>Glory Night</span><b>Mon 7:00 PM</b></div>' +
                  '<div class="camp__r"><span>Wednesday</span><b>7:00 PM</b></div>' +
                  '<div class="camp__r"><span>Corporate Prayer</span><b>Mon-Thu 5:00 AM</b></div>' +
                '</div>' +
                '<a class="camp__link" href="https://www.google.com/maps/dir//501+Ates+Rd,+Pineville,+LA+71360" target="_top">Directions &rarr;</a>' +
              '</div>' +
            '</div>' +
            '<div class="camp__c">' +
              '<div class="camp__img"><img src="' + CAMPUS_ALEXANDRIA + '" alt="Arise Church Alexandria Campus building on North Blvd"></div>' +
              '<div class="camp__b"><span class="camp__tag">Second Campus</span>' +
                '<p class="camp__addr">5305 North Blvd<br>Alexandria, LA 71301</p>' +
                '<div class="camp__times">' +
                  '<div class="camp__r"><span>Sunday</span><b data-ck="site.times.sunday.second">10:00 AM</b></div>' +
                  '<div class="camp__r"><span>Pre-Service Prayer</span><b data-ck="site.times.second.prayer">TBA</b></div>' +
                  '<div class="camp__r"><span>Midweek Service</span><b data-ck="site.times.second.midweek">TBA</b></div>' +
                '</div>' +
                '<a class="camp__link" href="https://www.google.com/maps/dir//5305+North+Blvd,+Alexandria,+LA+71301" target="_top">Directions &rarr;</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--bone" style="padding-bottom:32px"><div class="formlead">' +
          '<div class="mark"><span class="kicker">Send Us a Message</span></div>' +
          '<h2>Get In Touch</h2>' +
          '<p>Questions about a service, a ministry, or planning your first visit \u2014 ' +
          'send us a note and someone will get back to you.</p>' +
          '<form novalidate id="apForm">' +
            '<div class="fld" data-k="name"><label for="ap-name">Your Name <span class="req">*</span></label>' +
              '<input id="ap-name" type="text" autocomplete="name"><div class="hint"></div></div>' +
            '<div class="fld" data-k="email"><label for="ap-email">Email <span class="req">*</span></label>' +
              '<input id="ap-email" type="email" autocomplete="email"><div class="hint"></div></div>' +
            '<div class="fld" data-k="phone"><label for="ap-phone">Phone</label>' +
              '<input id="ap-phone" type="tel" autocomplete="tel"><div class="hint"></div></div>' +
            '<div class="fld" data-k="subject"><label for="ap-subject">Subject</label>' +
              '<input id="ap-subject" type="text"><div class="hint"></div></div>' +
            '<div class="fld full" data-k="message"><label for="ap-message">Message <span class="req">*</span></label>' +
              '<textarea id="ap-message"></textarea><div class="hint"></div></div>' +
            '<div class="fnote" id="apNote"></div>' +
            '<div class="full"><button type="submit" id="apGo">Send Message</button></div>' +
          '</form>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Follow Along</span></div>' +
          '<h2>Follow Along</h2>' +
          '<div class="social">' +
            '<a href="https://www.facebook.com/arisenow" target="_top" aria-label="Arise Church on Facebook"><svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z"/></svg></a>' +
            '<a href="http://instagram.com/arisechurch.cenla" target="_top" aria-label="Arise Church on Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1A6.7 6.7 0 1018.7 12 6.7 6.7 0 0012 5.3zm0 11A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.9-11.2a1.6 1.6 0 11-1.6-1.6 1.6 1.6 0 011.6 1.6z"/></svg></a>' +
            '<a href="https://www.youtube.com/@arisechurch4147" target="_top" aria-label="Arise Church on YouTube"><svg viewBox="0 0 24 24"><path d="M23 7.5s-.2-1.6-.9-2.3c-.9-.9-1.8-.9-2.3-1C17.2 4 12 4 12 4s-5.2 0-7.8.2c-.5.1-1.4.1-2.3 1C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.2 7.6.2s5.2 0 7.8-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.8c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.9l6.2 3.1z"/></svg></a>' +
            '<a href="http://twitter.com/AriseChurch_C" target="_top" aria-label="Arise Church on X"><svg viewBox="0 0 24 24"><path d="M18.2 2.3h3.4l-7.4 8.5 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9.1L.9 2.3h7l4.8 6.4zm-1.2 17.9h1.9L7.1 4.2H5z"/></svg></a>' +
          '</div>' +
          '<div class="strip" style="margin-top:40px"><span>#YouBelongHere</span></div>' +
        '</div></section>' +
      '</div>';

    this.applyContent();

    this.wireForm();
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

AriseContact.prototype.wireForm = function () {
  const root = this;
  const form = root.querySelector('#apForm');
  if (!form) return;

  const note = root.querySelector('#apNote');
  const go   = root.querySelector('#apGo');
  const KEYS = ['name', 'email', 'phone', 'subject', 'message'];
  const REQ  = ['name', 'email', 'message'];

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    root.querySelectorAll('.fld').forEach(function (d) {
      d.classList.remove('bad');
      const h = d.querySelector('.hint'); if (h) h.textContent = '';
    });
    note.textContent = '';
    note.removeAttribute('data-err');

    const payload = { formType: 'contact' };
    let firstBad = null;

    KEYS.forEach(function (k) {
      const el = root.querySelector('#ap-' + k);
      const val = (el && el.value ? el.value : '').trim();
      payload[k] = val;
      const wrap = root.querySelector('.fld[data-k="' + k + '"]');
      if (!wrap) return;

      if (REQ.indexOf(k) > -1 && !val) {
        wrap.classList.add('bad');
        wrap.querySelector('.hint').textContent = 'Required';
        if (!firstBad) firstBad = el;
      } else if (k === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        wrap.classList.add('bad');
        wrap.querySelector('.hint').textContent = 'Check this email address';
        if (!firstBad) firstBad = el;
      }
    });

    if (firstBad) { firstBad.focus(); return; }

    go.setAttribute('disabled', 'true');
    note.textContent = 'Sending\u2026';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('status ' + res.status);

      form.outerHTML =
        '<div class="fdone"><h3>Thank You</h3>' +
        '<p>Your message is on its way and someone will be in touch.</p></div>';

    } catch (err) {
      console.error('contact form failed:', err);
      note.setAttribute('data-err', 'true');
      note.textContent = 'Something went wrong sending that. Please try again, or email arisenow.church@gmail.com.';
      go.removeAttribute('disabled');
    }
  });
};

customElements.define('arise-contact', AriseContact);
