/* ===========================================================================
   ARISE CHURCH -- EVENTS
   File: public/custom-elements/arise-events.js
   Tag:  arise-events

   Driven by your real Wix Events data. Each event uses ITS OWN uploaded
   image, its own registration type, and its own page link:

     RSVP + open        -> "RSVP"
     TICKETING + open   -> "Get Tickets"
     sold out           -> "Sold Out"  (button disabled)
     closed / ended     -> "View Event"
     no registration    -> "View Event"

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-events.js
      -> paste this whole file
   2. Editor -> Events page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-events.js
      Tag Name: arise-events
   3. STRETCH IT FULL WIDTH. Give it plenty of height.
   4. Add backend/events.jsw and the Events page code -- see EVENTS-SETUP.md
   5. Save, then PUBLISH. Check the LIVE page.

   Without the page code it still renders, using the fallback below. With it,
   every event you add in Wix Events appears here automatically.
   Fixed 2026-09-14: fallback event expires after it ends, Sold Out is a non-link, Anton size floors, CMS time hooks in empty state, safer applyContent
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-events.json)
   =========================================================================== */

const AEV_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

/* Fallback -- used only until the page code supplies live data. */
const FALLBACK = {
  upcoming: [{
    title: 'The Lead Network 2026 Camp Meeting: The Outpour',
    shortDescription: 'Impartation and Activation of Spiritual Gifts by the Holy Spirit',
    image: 'https://static.wixstatic.com/media/1f9fa2_35234420e1e74e65948de03315c3003a~mv2.png',
    dateLine: 'October 30, 2026 at 10:00 AM \u2013 November 1, 2026 at 12:30 PM',
    startMonth: 'Oct', startDay: '30', startDate: 'October 30, 2026',
    location: 'Arise Church, 501 Ates Rd, Pineville, LA 71360, USA',
    url: '/events-1/the-lead-network-2026-camp-meeting-the-outpour',
    cta: 'RSVP', ctaEnabled: true,
    endsAt: '2026-11-01T17:30:00-05:00'
  }],
  past: []
};

const AEV_CSS = `
arise-events{display:block;width:100%}
.aev *{box-sizing:border-box;margin:0;padding:0}
.aev{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.aev img{color:#fff;font-size:12px;background:#1A1A1F}
.aev .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.aev h1,.aev h2,.aev h3,.aev h4{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.aev h1{font-size:clamp(40px,7.4vw,84px)}
.aev h2{font-size:clamp(26px,3.8vw,46px)}
.aev h3{font-size:clamp(18px,1.6vw,22px);letter-spacing:.03em;line-height:1.2}
.aev h4{font-size:13px;letter-spacing:.12em}
.aev p{font-size:clamp(15.5px,1.4vw,17px)}

.aev .mark{display:flex;align-items:center;margin-bottom:18px}
.aev .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.aev .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
.aev .mark--l .kicker{color:var(--redL)}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .aev .mark{flex-wrap:nowrap;align-items:flex-start}
  .aev .mark::before{margin-right:124px;margin-top:5px}
  .aev .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.aev .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px;text-decoration:none}
.aev .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.aev .btn{display:inline-block;padding:15px 32px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;cursor:pointer;transition:background .18s,color .18s,border-color .18s}
.aev .btn:hover{background:transparent;color:#fff;border-color:#fff}
.aev .btn--ghost{background:transparent;border-color:#fff;color:#fff}
.aev .btn--ghost:hover{background:#fff;color:var(--ink)}
.aev .btn--off{background:transparent;border-color:rgba(255,255,255,.45);color:rgba(255,255,255,.75);
  pointer-events:none}
.aev a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.aev .sect{padding:var(--sect) 0;background:var(--paper)}
.aev .sect--ink{background:var(--ink)}
.aev .sect--ink h2,.aev .sect--ink h3{color:#fff}
.aev .sect--ink p{color:rgba(255,255,255,.82)}
.aev .sect--ink h4{color:var(--redL)}

.aev .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.aev .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.aev .phead h1{color:#fff;position:relative;z-index:1}

.aev .feat{display:grid;grid-template-columns:.85fr 1.15fr;background:var(--ink);color:#fff}
@media(max-width:900px){.aev .feat{grid-template-columns:1fr}}
.aev .feat__img{position:relative;min-height:380px;overflow:hidden;background:var(--scrim)}
.aev .feat__img img{width:100%;height:100%;object-fit:cover;object-position:center top}
.aev .feat__date{position:absolute;top:26px;left:26px;background:var(--red);color:#fff;
  text-align:center;padding:14px 22px;min-width:92px}
.aev .feat__date .m{display:block;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
.aev .feat__date .d{display:block;font-family:'Anton',Impact,sans-serif;font-size:40px;line-height:1;margin-top:4px}
.aev .feat__b{padding:clamp(30px,4.2vw,56px);display:flex;flex-direction:column;justify-content:center}
.aev .feat__b h2{color:#fff}
.aev .feat__sub{color:rgba(255,255,255,.82);font-size:17px;margin-top:20px;max-width:46ch}
.aev .meta{margin-top:30px;border-top:1px solid var(--ruleD)}
.aev .meta__r{display:flex;gap:22px;padding:15px 0;border-bottom:1px solid var(--ruleD);font-size:14.5px}
.aev .meta__r .lbl{flex:0 0 100px;color:var(--redL);padding-top:2px;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:12px;letter-spacing:.16em;text-transform:uppercase;line-height:1.02}
.aev .meta__r div{color:rgba(255,255,255,.82)}
.aev .feat__acts{margin-top:38px;display:flex;gap:13px;flex-wrap:wrap}

.aev .up{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--rule);margin-top:48px}
@media(max-width:900px){.aev .up{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.aev .up{grid-template-columns:1fr}}
.aev .up__c{background:var(--paper);display:flex;flex-direction:column;text-decoration:none;color:inherit}
.aev .up__img{aspect-ratio:4/5;overflow:hidden;background:var(--scrim)}
.aev .up__img img{width:100%;height:100%;object-fit:cover;transition:transform .45s ease}
.aev .up__c:hover .up__img img{transform:scale(1.04)}
.aev .up__b{padding:24px}
.aev .up__when{font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--red);font-weight:500}
.aev .up__c h3{margin-top:10px}
.aev .up__tag{display:inline-block;margin-top:14px;font-size:11px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;color:var(--red)}

.aev .arch{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;background:rgba(255,255,255,.13);margin-top:48px}
@media(max-width:1000px){.aev .arch{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.aev .arch{grid-template-columns:1fr}}
.aev .arch__c{position:relative;display:block;text-decoration:none;background:var(--scrim);
  overflow:hidden;aspect-ratio:4/5}
.aev .arch__c img{width:100%;height:100%;object-fit:cover;filter:grayscale(.3) brightness(.6);
  transition:transform .5s,filter .35s}
.aev .arch__c:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.8)}
.aev .arch__t{position:absolute;left:0;right:0;bottom:0;padding:44px 18px 18px;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.72) 42%,rgba(6,6,8,.97) 100%)}
.aev .arch__t h3{color:#fff;font-size:18px}
.aev .arch__t span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:#fff;opacity:.9;margin-top:5px;font-weight:500}

.aev .empty{border:1.5px dashed var(--ruleD);padding:48px 32px;text-align:center;margin-top:48px}
.aev .empty h3{color:rgba(255,255,255,.65);margin-bottom:12px}
.aev .empty p{color:rgba(255,255,255,.65);font-size:15px;max-width:46ch;margin:0 auto}

.aev .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.aev .cta h2,.aev .cta p{color:#fff}
.aev .cta p{margin-top:12px;max-width:46ch}
.aev .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.aev .cta .kicker{color:#fff}
.aev .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.aev .cta .btn:hover{background:transparent;color:#fff}
.aev .cta__b{flex:1 1 320px}

@media(prefers-reduced-motion:reduce){.aev *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .aev{background:#fff;color:#0A0A0C}
  .aev .sect{background:#fff}
  .aev .sect--ink,.aev .phead,.aev .feat{background:#0A0A0C}
}
`;

function aevEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* The built-in fallback event disappears once it has ended. */
function aevFallback() {
  const f = FALLBACK.upcoming[0];
  if (f && f.endsAt && Date.now() > Date.parse(f.endsAt)) return { upcoming: [], past: [] };
  return FALLBACK;
}

class AriseEvents extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('aev-fonts')) {
      const l = document.createElement('link');
      l.id = 'aev-fonts'; l.rel = 'stylesheet'; l.href = AEV_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('aev-css')) {
      const s = document.createElement('style');
      s.id = 'aev-css'; s.innerHTML = AEV_CSS;
      document.head.appendChild(s);
    }
    this.render();
  }

  static get observedAttributes() { return ['data-events', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._built) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.render();
  }

  getData() {
    const raw = this.getAttribute('data-events');
    if (!raw) return aevFallback();
    try {
      const d = JSON.parse(raw);
      return {
        upcoming: Array.isArray(d.upcoming) ? d.upcoming : [],
        past: Array.isArray(d.past) ? d.past : []
      };
    } catch (e) {
      console.error('arise-events: could not parse data-events', e);
      return aevFallback();
    }
  }

  render() {
    const d = this.getData();
    const feat = d.upcoming[0] || null;
    const rest = d.upcoming.slice(1);
    const E = aevEsc;

    let html = '<div class="aev">' +
      '<header class="phead"><div class="shell">' +
        '<div class="mark mark--l"><span class="kicker" data-ck="events.hero.kicker">Arise Church</span></div>' +
        '<h1 data-ck="events.hero.heading">Events</h1>' +
      '</div></header>';

    if (feat) {
      const cls = feat.ctaEnabled === false ? 'btn btn--off' : 'btn';
      html +=
        '<section style="padding:0"><div class="shell" style="padding-top:var(--sect)">' +
          '<div class="mark"><span class="kicker" data-ck="events.upcoming.kicker">Upcoming</span></div>' +
        '</div>' +
        '<div class="shell"><div class="feat" data-cms-source="Events">' +
          '<div class="feat__img">' +
            (feat.image ? '<img src="' + E(feat.image) + '" alt="' + E(feat.title) + '">' : '') +
            (feat.startMonth ? '<div class="feat__date"><span class="m">' + E(feat.startMonth) +
              '</span><span class="d">' + E(feat.startDay) + '</span></div>' : '') +
          '</div>' +
          '<div class="feat__b">' +
            (feat.startDate ? '<a class="strip" href="' + E(feat.url) + '" target="_top" style="margin-bottom:22px">' +
              '<span>' + E(feat.startDate) + '</span></a>' : '') +
            '<h2>' + E(feat.title) + '</h2>' +
            (feat.shortDescription ? '<p class="feat__sub">' + E(feat.shortDescription) + '</p>' : '') +
            '<div class="meta">' +
              (feat.dateLine ? '<div class="meta__r"><div class="lbl" data-ck="events.featured.timeLabel">Time</div><div>' + E(feat.dateLine) + '</div></div>' : '') +
              (feat.location ? '<div class="meta__r"><div class="lbl" data-ck="events.featured.locationLabel">Location</div><div>' + E(feat.location) + '</div></div>' : '') +
            '</div>' +
            '<div class="feat__acts">' +
              (feat.ctaEnabled === false
                ? '<span class="' + cls + '" aria-disabled="true">' + E(feat.cta || 'Sold Out') + '</span>'
                : '<a class="' + cls + '" href="' + E(feat.url) + '" target="_top">' + E(feat.cta || 'View Event') + '</a>') +
            '</div>' +
          '</div>' +
        '</div></div></section>';
    } else {
      html +=
        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="events.upcoming.kicker">Upcoming</span></div>' +
          '<h2 data-ck="events.empty.heading">Nothing On The Calendar<br>Right Now</h2>' +
          '<p style="margin-top:22px;max-width:46ch"><span data-ck="events.empty.body">Join us</span> <span data-ck="site.times.sunday.main">Sunday 10:30 AM</span> <span data-ck="events.empty.bodyMain">in Pineville or</span> ' +
          '<span data-ck="site.times.sunday.second">Sunday 10:00 AM</span> <span data-ck="events.empty.bodySecond">in Alexandria, ' +
          'or</span> <span data-ck="site.times.main.glorynight">Monday 7:00 PM</span> <span data-ck="events.empty.bodyEnd">for Glory Night.</span></p>' +
          '<div style="margin-top:38px"><a class="btn" href="/contact" target="_top" data-ck="events.empty.button">Plan Your Visit</a></div>' +
        '</div></section>';
    }

    if (rest.length) {
      html += '<section class="sect"><div class="shell">' +
        '<div class="mark"><span class="kicker" data-ck="events.more.kicker">Also Coming Up</span></div>' +
        '<h2 data-ck="events.more.heading">More Events</h2><div class="up" data-cms-source="Events">' +
        rest.map(function (e) {
          return '<a class="up__c" href="' + E(e.url) + '" target="_top">' +
            '<div class="up__img">' + (e.image ? '<img src="' + E(e.image) + '" alt="' + E(e.title) + '">' : '') + '</div>' +
            '<div class="up__b">' +
              (e.startDate ? '<div class="up__when">' + E(e.startDate) + '</div>' : '') +
              '<h3>' + E(e.title) + '</h3>' +
              '<span class="up__tag">' + E(e.cta || 'View Event') + ' &rarr;</span>' +
            '</div></a>';
        }).join('') +
        '</div></div></section>';
    }

    html += '<section class="sect sect--ink"><div class="shell">' +
      '<div class="mark mark--l"><span class="kicker" data-ck="events.past.kicker">Previous Events</span></div>' +
      '<h2 data-ck="events.past.heading">Here You Can Check Out<br>Photos From Our Past Events</h2>';

    if (d.past.length) {
      html += '<div class="arch" data-cms-source="Events">' + d.past.map(function (e) {
        return '<a class="arch__c" href="' + E(e.url) + '" target="_top">' +
          (e.image ? '<img src="' + E(e.image) + '" alt="' + E(e.title) + '">' : '') +
          '<div class="arch__t"><h3>' + E(e.title) + '</h3>' +
          (e.startDate ? '<span>' + E(e.startDate) + '</span>' : '') + '</div></a>';
      }).join('') + '</div>';
    } else {
      html += '<div class="empty"><h3 data-ck="events.past.emptyHeading">Photo albums coming soon</h3>' +
        '<p data-ck="events.past.emptyBody">Past event albums will appear here.</p></div>';
    }

    /* Archive button removed Aug 23 2026 -- /previous-events-1 was deleted from
       the site (verified live: 404, absent from pages-sitemap.xml). If a past
       events page comes back, re-add the button here with its new URL. */
    html += '</div></section>';

    html += '<section class="sect" style="padding-top:0"><div class="shell">' +
        '<div class="cta"><div class="cta__b">' +
          '<div class="mark"><span class="kicker" data-ck="events.cta.kicker">Questions</span></div>' +
          '<h2 data-ck="events.cta.heading">Planning To Come?</h2>' +
          '<p data-ck="events.cta.body">Email us and someone will get back to you with details.</p>' +
        '</div>' +
        '<a class="btn" href="/contact" target="_top" data-ck="events.cta.button">Contact Us</a>' +
      '</div></div></section>';

    html += '</div>';
    this.innerHTML = html;

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
      if (el.tagName === 'IMG') el.src = v.image;
      else el.style.backgroundImage = 'url("' + String(v.image).replace(/["\\]/g, '') + '")';
    });
  }
}

customElements.define('arise-events', AriseEvents);
