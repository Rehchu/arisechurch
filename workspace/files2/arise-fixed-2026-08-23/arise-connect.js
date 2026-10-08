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
   =========================================================================== */

const ACG_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const FORM_ENDPOINT = '/_functions/ariseForm';

/* Update these each season. */
const SEASON = {
  name:      'Fall Connect Groups',
  starts:    'the week of September 14',
  ends:      'the week of November 16',
  hostBy:    'September 2'
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ACG_CSS = `
arise-connect{display:block;width:100%}
.acg *{box-sizing:border-box;margin:0;padding:0}
.acg{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.acg .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.acg h1,.acg h2,.acg h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.acg h1{font-size:clamp(38px,7vw,80px)}
.acg h2{font-size:clamp(26px,3.8vw,46px)}
.acg h3{font-size:clamp(17px,1.8vw,21px);letter-spacing:.04em}
.acg p{font-size:clamp(15.5px,1.4vw,17px)}
.acg .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.acg .mark{display:flex;align-items:center;margin-bottom:18px}
.acg .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.acg .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .acg .mark{flex-wrap:nowrap;align-items:flex-start}
  .acg .mark::before{margin-right:124px;margin-top:5px}
  .acg .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.acg .mark--l .kicker{color:var(--redL)}
.acg .strip{display:inline-block;transform:skewX(-9deg);background:var(--red);padding:9px 20px}
.acg .strip span{display:block;transform:skewX(9deg);color:#fff;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase}

.acg .sect{padding:var(--sect) 0;background:var(--paper)}
.acg .sect--bone{background:var(--bone)}
.acg .sect--ink{background:var(--ink)}
.acg .sect--ink h2,.acg .sect--ink h3{color:#fff}
.acg .sect--ink p{color:rgba(255,255,255,.82)}
.acg .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.acg .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.acg .phead h1,.acg .phead p,.acg .phead .mark,.acg .phead .strip{position:relative;z-index:1}
.acg .phead h1{color:#fff}
.acg .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:56ch}

/* three pillars */
.acg .pill{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--rule);
  margin-top:48px}
@media(max-width:760px){.acg .pill{grid-template-columns:1fr}}
.acg .pill__c{background:var(--paper);padding:clamp(24px,3vw,36px)}
.acg .pill__n{font-family:'Anton',Impact,sans-serif;font-size:13px;color:var(--red);
  letter-spacing:.18em;margin-bottom:14px}
.acg .pill__c p{color:var(--muted);font-size:15.5px;margin-top:10px}

/* scripture */
.acg .verse{border-left:5px solid var(--red);padding:26px 30px;background:var(--bone);
  margin-top:44px;max-width:64ch}
.acg .verse p{font-size:clamp(16px,1.6vw,18px);line-height:1.78;color:var(--ink)}
.acg .verse cite{display:block;margin-top:14px;font-style:normal;font-size:12px;font-weight:600;
  letter-spacing:.18em;text-transform:uppercase;color:var(--red)}

/* dates */
.acg .when{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:44px}
@media(max-width:760px){.acg .when{grid-template-columns:1fr}}
.acg .when__c{border:1px solid var(--ruleD);padding:24px}
.acg .when__l{font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:var(--redL);margin-bottom:10px}
.acg .when__v{font-family:'Anton',Impact,sans-serif;font-size:clamp(18px,2vw,24px);color:#fff;
  text-transform:uppercase;line-height:1.1}
.acg .when__c--urgent{border-color:var(--red);background:rgba(214,34,45,.16)}
.acg .when__c--urgent .when__l{color:#fff}

/* group cards */
.acg .groups{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:44px}
@media(max-width:1000px){.acg .groups{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.acg .groups{grid-template-columns:1fr}}
.acg .g{border:1px solid var(--rule);background:var(--paper);display:flex;flex-direction:column;
  transition:box-shadow .25s,transform .25s}
.acg .g:hover{box-shadow:0 14px 30px rgba(10,10,12,.13);transform:translateY(-3px)}
.acg .g__img{aspect-ratio:3/4;overflow:hidden;background:var(--bone);position:relative}
.acg .g__img img{width:100%;height:100%;object-fit:cover;display:block}
.acg .g__full{position:absolute;top:0;left:0;background:var(--ink);color:#fff;font-size:11px;
  font-weight:600;letter-spacing:.16em;text-transform:uppercase;padding:8px 14px}
.acg .g__b{padding:24px;flex:1 1 auto;display:flex;flex-direction:column}
.acg .g__when{font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--red);margin-bottom:10px}
.acg .g__host{font-size:14px;color:var(--muted);margin-top:8px}
.acg .g__d{font-size:14.5px;color:var(--muted);line-height:1.68;margin-top:12px}
.acg .g__facts{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin-top:18px;
  padding-top:16px;border-top:1px solid var(--rule);flex:1 1 auto;align-content:start}
.acg .g__facts dt{font-size:10.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
  color:var(--red);padding-top:3px}
.acg .g__facts dd{font-size:14.5px;color:var(--ink);margin:0}
.acg .g__go{margin-top:20px;display:inline-block;padding:13px 26px;font-size:11.5px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;background:transparent;border:1.5px solid var(--ink);
  color:var(--ink);font-family:inherit;cursor:pointer;transition:background .18s,color .18s;
  align-self:flex-start}
.acg .g__go:hover{background:var(--ink);color:#fff}
.acg .g__go[disabled]{opacity:.45;pointer-events:none}
.acg .g__none{border:1.5px dashed var(--rule);padding:48px 32px;text-align:center;margin-top:44px}
.acg .g__none h3{color:var(--muted);margin-bottom:12px}
.acg .g__none p{color:var(--muted);font-size:15.5px;max-width:48ch;margin:0 auto}

/* tabs + forms */
.acg .tabs{display:flex;gap:2px;margin-top:48px;flex-wrap:wrap}
.acg .tab{flex:1 1 220px;background:var(--bone);border:0;padding:20px 22px;cursor:pointer;
  font-family:'Oswald',Helvetica,Arial,sans-serif;text-align:left;
  border-top:4px solid transparent;transition:background .18s,border-color .18s}
.acg .tab[aria-selected="true"]{background:var(--ink);border-top-color:var(--red)}
.acg .tab__t{font-family:'Anton',Impact,sans-serif;font-size:19px;text-transform:uppercase;
  letter-spacing:.03em;color:var(--ink);display:block}
.acg .tab[aria-selected="true"] .tab__t{color:#fff}
.acg .tab__d{font-size:13.5px;color:var(--muted);display:block;margin-top:6px}
.acg .tab[aria-selected="true"] .tab__d{color:rgba(255,255,255,.75)}
.acg .tab:focus-visible{outline:3px solid var(--red);outline-offset:-3px}

.acg .panel{display:none;background:var(--ink);padding:clamp(26px,4vw,44px)}
.acg .panel[data-on="true"]{display:block}
.acg .panel h3{color:#fff;margin-bottom:10px}
.acg .panel .intro{color:rgba(255,255,255,.82);font-size:15.5px;max-width:56ch;margin-bottom:12px}

.acg form{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:26px}
.acg form .full{grid-column:1/-1}
@media(max-width:640px){.acg form{grid-template-columns:1fr}}
.acg label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,.72);margin-bottom:9px}
.acg label .req{color:var(--redL)}
.acg input,.acg select,.acg textarea{width:100%;background:transparent;border:0;
  border-bottom:1.5px solid rgba(255,255,255,.3);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:16.5px;color:#fff}
.acg textarea{min-height:110px;resize:vertical;line-height:1.6}
.acg select option{background:#0A0A0C;color:#fff}
.acg input::placeholder,.acg textarea::placeholder{color:rgba(255,255,255,.34)}
.acg input:focus,.acg select:focus,.acg textarea:focus{outline:none;border-bottom-color:var(--red)}
.acg .bad input,.acg .bad select,.acg .bad textarea{border-bottom-color:var(--redL)}
.acg .hint{font-size:12px;color:var(--redL);margin-top:7px;min-height:16px}
.acg button[type="submit"]{display:inline-block;padding:16px 36px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;border:1.5px solid var(--red);background:var(--red);
  color:#fff;font-family:inherit;cursor:pointer;transition:background .18s,color .18s}
.acg button[type="submit"]:hover{background:transparent;color:#fff}
.acg button[type="submit"][disabled]{opacity:.55;pointer-events:none}
.acg .note{grid-column:1/-1;font-size:14.5px;color:rgba(255,255,255,.82);min-height:22px}
.acg .note[data-err="true"]{color:var(--redL)}
.acg .done{border-left:5px solid var(--red);padding:28px 30px;background:rgba(255,255,255,.06);
  margin-top:26px}
.acg .done h3{margin-bottom:10px}
.acg .done p{color:rgba(255,255,255,.86);font-size:16px}
.acg input:focus-visible,.acg select:focus-visible,.acg textarea:focus-visible,
.acg button:focus-visible{outline:3px solid var(--red);outline-offset:3px}

@media(prefers-reduced-motion:reduce){.acg *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .acg{background:#fff;color:#0A0A0C}
  .acg .sect{background:#fff}.acg .sect--bone{background:#F4F2F0}
  .acg .sect--ink,.acg .phead,.acg .panel{background:#0A0A0C}
}
`;

var AC_MAP = { firstName: 'given-name', lastName: 'family-name', name: 'name',
  email: 'email', phone: 'tel' };
function acOf(k) { return AC_MAP[k] || 'on'; }

function acgEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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
    if (name === 'data-content') { this.applyContent(); return; }
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
    this._b = true;

    if (!document.getElementById('acg-fonts')) {
      const l = document.createElement('link');
      l.id = 'acg-fonts'; l.rel = 'stylesheet'; l.href = ACG_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('acg-css')) {
      const s = document.createElement('style');
      s.id = 'acg-css'; s.innerHTML = ACG_CSS;
      document.head.appendChild(s);
    }

    const E = acgEsc;

    const buildForm = function (type) {
      const cfg = FORMS[type];
      const fields = cfg.fields.map(function (f) {
        const cls = f.half ? '' : ' full';
        const req = f.req ? ' <span class="req">*</span>' : '';
        const id = type + '-' + f.k;
        let control;
        if (f.type === 'textarea') {
          control = '<textarea id="' + id + '" name="' + f.k + '"></textarea>';
        } else if (f.type === 'select') {
          control = '<select id="' + id + '" name="' + f.k + '"><option value="">' +
            (f.req ? 'Choose...' : 'No preference') + '</option>' +
            (f.options || []).map(function (o) { return '<option>' + E(o) + '</option>'; }).join('') +
            '</select>';
        } else {
          control = '<input id="' + id + '" name="' + f.k + '" type="' + f.type + '"' +
            (f.ph ? ' placeholder="' + E(f.ph) + '"' : '') + ' autocomplete="' + acOf(f.k) + '">';
        }
        return '<div class="fld' + cls + '" data-k="' + f.k + '">' +
          '<label for="' + id + '">' + E(f.label) + req + '</label>' +
          control + '<div class="hint"></div></div>';
      }).join('');

      return '<div class="panel" data-panel="' + type + '" data-on="' + (type === 'connect-host') + '">' +
        '<h3>' + E(cfg.heading) + '</h3>' +
        '<p class="intro">' + E(cfg.intro) + '</p>' +
        '<form novalidate data-type="' + type + '">' + fields +
          '<div class="note"></div>' +
          '<div class="full"><button type="submit">' + E(cfg.button) + '</button></div>' +
        '</form>' +
      '</div>';
    };

    this.innerHTML =
      '<div class="acg">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Arise Church</span></div>' +
          '<h1 data-ck="connect.season.name">' + E(SEASON.name) + '</h1>' +
          '<p class="lede" data-ck="connect.hero.body">Where real people build real faith. Don\'t do life alone - ' +
          'do life together.</p>' +
          '<div class="strip" style="margin-top:28px"><span>Connect &middot; Grow &middot; Go</span></div>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">What They Are</span></div>' +
          '<h2>In Homes,<br>Every Week</h2>' +
          '<p class="lede" style="margin-top:24px;max-width:58ch">Connect Groups meet in homes ' +
          'across our community. A host opens their door, a few people gather, and life gets ' +
          'shared around a table instead of a pew.</p>' +

          '<div class="pill">' +
            '<div class="pill__c"><div class="pill__n">CONNECT</div>' +
              '<h3>Build meaningful relationships</h3>' +
              '<p>Know people and be known by them.</p></div>' +
            '<div class="pill__c"><div class="pill__n">GROW</div>' +
              '<h3>Do life together</h3>' +
              '<p>Faith grows faster in company than alone.</p></div>' +
            '<div class="pill__c"><div class="pill__n">GO</div>' +
              '<h3>Live it out and make an impact</h3>' +
              '<p>What happens around the table goes out the door.</p></div>' +
          '</div>' +

          '<div class="verse">' +
            '<p>And they, continuing daily with one accord in the temple, and breaking bread from ' +
            'house to house, did eat their meat with gladness and singleness of heart, praising God, ' +
            'and having favor with all the people.</p>' +
            '<cite>Acts 2:46</cite>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect sect--ink"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">This Season</span></div>' +
          '<h2>Dates</h2>' +
          '<div class="when">' +
            '<div class="when__c"><div class="when__l">Starts</div>' +
              '<div class="when__v" data-ck="connect.season.starts">' + E(SEASON.starts) + '</div></div>' +
            '<div class="when__c"><div class="when__l">Ends</div>' +
              '<div class="when__v" data-ck="connect.season.ends">' + E(SEASON.ends) + '</div></div>' +
            '<div class="when__c when__c--urgent"><div class="when__l">Host sign-up closes</div>' +
              '<div class="when__v" data-ck="connect.season.hostby">' + E(SEASON.hostBy) + '</div></div>' +
          '</div>' +
        '</div></section>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Find a Group</span></div>' +
          '<h2>Groups This Season</h2>' +
          '<div id="acgGroups"></div>' +
        '</div></section>' +

        '<section class="sect sect--bone"><div class="shell">' +
          '<div class="mark"><span class="kicker">Sign Up</span></div>' +
          '<h2>Be a Host.<br>Make a Difference.</h2>' +
          '<div class="tabs" role="tablist">' +
            '<button class="tab" role="tab" data-tab="connect-host" aria-selected="true">' +
              '<span class="tab__t">Host a Group</span>' +
              '<span class="tab__d">Open your home. Sign up by ' + E(SEASON.hostBy) + '.</span>' +
            '</button>' +
            '<button class="tab" role="tab" data-tab="connect-join" aria-selected="false">' +
              '<span class="tab__t">Join a Group</span>' +
              '<span class="tab__d">Find a group near you.</span>' +
            '</button>' +
          '</div>' +
          buildForm('connect-host') +
          buildForm('connect-join') +
        '</div></section>' +
      '</div>';

    this.applyContent();

    this.wire();
    this.fillGroups();
  }

  fillGroups() {
    const mount = this.querySelector('#acgGroups');
    if (!mount) return;
    const list = this.groups();
    const E = acgEsc;

    if (!list.length) {
      mount.innerHTML =
        '<div class="g__none"><h3>Groups are forming</h3>' +
        '<p>Hosts are signing up now. Check back soon, or add your name below and we will ' +
        'match you with a group when they are set.</p></div>';
      return;
    }

    const self = this;
    mount.innerHTML = '<div class="groups">' + list.map(function (g, i) {
      const when = [g.day, g.time].filter(Boolean).join(' \u00b7 ');
      const rows = [
        g.hostName ? ['Host', g.hostName] : null,
        (g.location || g.area) ? ['Where', g.location || g.area] : null,
        when ? ['When', when] : null,
        g.dates ? ['Dates', g.dates] : null,
        g.audience ? ['For', g.audience] : null
      ].filter(Boolean);

      return '<div class="g">' +
        (g.flyer
          ? '<div class="g__img"><img src="' + E(g.flyer) + '" alt="' + E(g.title) + '">' +
            (g.isFull ? '<span class="g__full">Full</span>' : '') + '</div>'
          : '') +
        '<div class="g__b">' +
          '<h3>' + E(g.title) + '</h3>' +
          (g.description ? '<p class="g__d">' + E(g.description) + '</p>' : '') +
          '<dl class="g__facts">' + rows.map(function (r) {
            return '<dt>' + E(r[0]) + '</dt><dd>' + E(r[1]) + '</dd>';
          }).join('') + '</dl>' +
          '<button class="g__go" data-join="' + i + '"' + (g.isFull ? ' disabled' : '') + '>' +
            (g.isFull ? 'Group Full' : 'Join This Group') + '</button>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';

    /* Clicking a group opens the join form with that group filled in. */
    mount.querySelectorAll('.g__go').forEach(function (b) {
      b.addEventListener('click', function () {
        const g = list[parseInt(b.getAttribute('data-join'), 10)];
        if (!g) return;

        self.querySelectorAll('.tab').forEach(function (t) {
          t.setAttribute('aria-selected', String(t.getAttribute('data-tab') === 'connect-join'));
        });
        self.querySelectorAll('.panel').forEach(function (p) {
          p.setAttribute('data-on', String(p.getAttribute('data-panel') === 'connect-join'));
        });

        const which = self.querySelector('#connect-join-subject');
        if (which) which.value = g.title || '';

        const panel = self.querySelector('.panel[data-panel="connect-join"]');
        if (panel && panel.scrollIntoView) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  wire() {
    const self = this;

    this.querySelectorAll('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        const t = b.getAttribute('data-tab');
        self.querySelectorAll('.tab').forEach(function (x) {
          x.setAttribute('aria-selected', String(x === b));
        });
        self.querySelectorAll('.panel').forEach(function (p) {
          p.setAttribute('data-on', String(p.getAttribute('data-panel') === t));
        });
      });
    });

    this.querySelectorAll('form').forEach(function (form) {
      const type = form.getAttribute('data-type');
      const cfg = FORMS[type];
      const note = form.querySelector('.note');
      const go = form.querySelector('button[type="submit"]');

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        form.querySelectorAll('.fld').forEach(function (d) {
          d.classList.remove('bad');
          const h = d.querySelector('.hint'); if (h) h.textContent = '';
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
            if (!firstBad) firstBad = el;
          } else if (f.type === 'email' && val &&
                     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            wrap.classList.add('bad');
            wrap.querySelector('.hint').textContent = 'Check this email address';
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
          panel.innerHTML = '<h3>' + acgEsc(cfg.heading) + '</h3>' +
            '<div class="done"><h3>Thank You</h3><p>' + acgEsc(cfg.done) + '</p></div>';

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

customElements.define('arise-connect', AriseConnect);
