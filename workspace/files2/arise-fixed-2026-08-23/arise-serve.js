/* ===========================================================================
   ARISE CHURCH -- SERVE
   File: public/custom-elements/arise-serve.js
   Tag:  arise-serve

   Replaces the old Wix form page. Positions come from the CMS, and the
   signup form is built in -- one element, no separate Wix form to style.

   Tapping a position fills it into the form, so nobody has to type
   "Children's Department" from memory.

   INSTALL
   1. backend/http-functions.js already allows 'serve' -- nothing to change.
   2. Velo sidebar -> Public -> custom-elements/ -> new file arise-serve.js
      -> paste this whole file
   3. Editor -> the Serve page -> DELETE the old Wix form and the text block.
      Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-serve.js
      Tag Name: arise-serve
      STRETCH IT FULL WIDTH.
   4. Add the backend function and page code -- see SERVE-SETUP.md
   5. Save, then PUBLISH. Test on the LIVE page -- /_functions/ URLs do not
      resolve in Preview.

   Submissions land in CMS -> Form Submissions with formType "serve".
   =========================================================================== */

const ASV_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const FORM_ENDPOINT = '/_functions/ariseForm';

/* Used only until page code supplies the CMS rows. */
const FALLBACK = [
  { title: "Children's Department", description: 'Teach, assist, or nurture our youngest members.' },
  { title: 'Outreach', description: "Share God's love through community service and evangelism." },
  { title: 'Media / Social Media', description: 'Manage online presence, create content, and spread the word.' },
  { title: 'Edge / X Edge', description: 'Support youth and young adult programs with energy and creativity.' },
  { title: 'Maintenance', description: 'Keep our facilities safe, clean, and welcoming.' }
];

const ASV_CSS = `
arise-serve{display:block;width:100%}
.asv *{box-sizing:border-box;margin:0;padding:0}
.asv{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.asv .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.asv h1,.asv h2,.asv h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.asv h1{font-size:clamp(38px,7vw,80px)}
.asv h2{font-size:clamp(26px,3.8vw,46px)}
.asv h3{font-size:clamp(16px,1.7vw,20px);letter-spacing:.04em;line-height:1.14}
.asv p{font-size:clamp(15.5px,1.4vw,17px)}
.asv .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.asv .mark{display:flex;align-items:center;margin-bottom:18px}
.asv .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.asv .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .asv .mark{flex-wrap:nowrap;align-items:flex-start}
  .asv .mark::before{margin-right:124px;margin-top:5px}
  .asv .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.asv .mark--l .kicker{color:var(--redL)}

.asv .sect{padding:var(--sect) 0;background:var(--paper)}
.asv .sect--bone{background:var(--bone)}
.asv .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.asv .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.asv .phead h1,.asv .phead p,.asv .phead .mark{position:relative;z-index:1}
.asv .phead h1{color:#fff}
.asv .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:56ch}

/* positions */
.asv .pos{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:48px}
@media(max-width:1000px){.asv .pos{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.asv .pos{grid-template-columns:1fr}}
.asv .p{border:1px solid var(--rule);background:var(--paper);padding:26px;text-align:left;
  font-family:inherit;cursor:pointer;display:flex;flex-direction:column;
  border-top:4px solid var(--rule);transition:border-color .2s,box-shadow .25s,transform .25s}
.asv .p:hover{border-top-color:var(--red);box-shadow:0 12px 26px rgba(10,10,12,.12);
  transform:translateY(-3px)}
.asv .p:focus-visible{outline:3px solid var(--red);outline-offset:3px}
.asv .p--urgent{border-top-color:var(--red)}
.asv .p__tag{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:13px;align-self:flex-start}
.asv .p__team{font-size:11px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  color:var(--muted);margin-bottom:9px}
.asv .p__d{font-size:14.5px;color:var(--muted);line-height:1.68;margin-top:11px;flex:1 1 auto}
.asv .p__go{margin-top:18px;font-size:11px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;color:var(--red)}

/* form */
.asv .panel{background:var(--ink);padding:clamp(26px,4vw,48px);margin-top:48px}
.asv .panel h2{color:#fff}
.asv .panel .intro{color:rgba(255,255,255,.82);font-size:15.5px;max-width:56ch;margin-top:12px}
.asv form{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px}
.asv form .full{grid-column:1/-1}
@media(max-width:640px){.asv form{grid-template-columns:1fr}}
.asv label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,.72);margin-bottom:9px}
.asv label .req{color:var(--redL)}
.asv input,.asv textarea{width:100%;background:transparent;border:0;
  border-bottom:1.5px solid rgba(255,255,255,.3);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:16.5px;color:#fff}
.asv textarea{min-height:110px;resize:vertical;line-height:1.6}
.asv input::placeholder,.asv textarea::placeholder{color:rgba(255,255,255,.34)}
.asv input:focus,.asv textarea:focus{outline:none;border-bottom-color:var(--red)}
.asv .bad input,.asv .bad textarea{border-bottom-color:var(--redL)}
.asv .hint{font-size:12px;color:var(--redL);margin-top:7px;min-height:16px}
.asv button[type="submit"]{display:inline-block;padding:16px 36px;font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;border:1.5px solid var(--red);background:var(--red);
  color:#fff;font-family:inherit;cursor:pointer;transition:background .18s,color .18s}
.asv button[type="submit"]:hover{background:transparent;color:#fff}
.asv button[type="submit"][disabled]{opacity:.55;pointer-events:none}
.asv .note{grid-column:1/-1;font-size:14.5px;color:rgba(255,255,255,.82);min-height:22px}
.asv .note[data-err="true"]{color:var(--redL)}
.asv .done{border-left:5px solid var(--red);padding:28px 30px;background:rgba(255,255,255,.06);
  margin-top:26px}
.asv .done h3{color:#fff;margin-bottom:10px}
.asv .done p{color:rgba(255,255,255,.86);font-size:16px}
.asv input:focus-visible,.asv textarea:focus-visible,.asv button:focus-visible{
  outline:3px solid var(--red);outline-offset:3px}

@media(prefers-reduced-motion:reduce){.asv *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .asv{background:#fff;color:#0A0A0C}
  .asv .sect{background:#fff}.asv .sect--bone{background:#F4F2F0}
  .asv .phead,.asv .panel{background:#0A0A0C}
}
`;

function asvEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const FIELDS = [
  { k: 'name',     label: 'Your Name', type: 'text',  req: true,  half: true },
  { k: 'email',    label: 'Email',     type: 'email', req: true,  half: true },
  { k: 'phone',    label: 'Phone',     type: 'tel',   req: false, half: true },
  { k: 'position', label: 'Which position?', type: 'text', req: true, half: true,
    ph: 'Pick one above, or type your own' },
  { k: 'message',  label: 'Anything else we should know?', type: 'textarea',
    req: false, half: false }
];

class AriseServe extends HTMLElement {
  connectedCallback() {
    if (this._b) return;
    this._b = true;

    if (!document.getElementById('asv-fonts')) {
      const l = document.createElement('link');
      l.id = 'asv-fonts'; l.rel = 'stylesheet'; l.href = ASV_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('asv-css')) {
      const s = document.createElement('style');
      s.id = 'asv-css'; s.innerHTML = ASV_CSS;
      document.head.appendChild(s);
    }

    const E = asvEsc;
    var AC_MAP = { firstName: 'given-name', lastName: 'family-name', name: 'name',
      email: 'email', phone: 'tel' };
    const fields = FIELDS.map(function (f) {
      const cls = f.half ? '' : ' full';
      const req = f.req ? ' <span class="req">*</span>' : '';
      const control = f.type === 'textarea'
        ? '<textarea id="asv-' + f.k + '" name="' + f.k + '"></textarea>'
        : '<input id="asv-' + f.k + '" name="' + f.k + '" type="' + f.type + '"' +
          (f.ph ? ' placeholder="' + E(f.ph) + '"' : '') +
          ' autocomplete="' + (AC_MAP[f.k] || 'on') + '">';
      return '<div class="fld' + cls + '" data-k="' + f.k + '">' +
        '<label for="asv-' + f.k + '">' + E(f.label) + req + '</label>' +
        control + '<div class="hint"></div></div>';
    }).join('');

    this.innerHTML =
      '<div class="asv">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker">Volunteer Sign Up</span></div>' +
          '<h1>Serve</h1>' +
          '<p class="lede" data-ck="serve.hero.body">Join our congregation in making a difference. We\'re seeking ' +
          'passionate volunteers to fill key roles and help our ministries thrive.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker">Positions Needed</span></div>' +
          '<h2>Where You<br>Could Serve</h2>' +
          '<div id="asvPos"></div>' +
        '</div></section>' +

        '<section class="sect sect--bone" style="padding-top:0"><div class="shell">' +
          '<div class="panel" style="margin-top:var(--sect)">' +
            '<div class="mark mark--l"><span class="kicker">Sign Up</span></div>' +
            '<h2>Use Your Gifts</h2>' +
            '<p class="intro">No experience needed - just a willingness to show up. ' +
            'Someone from that team will reach out about next steps.</p>' +
            '<form novalidate>' + fields +
              '<div class="note"></div>' +
              '<div class="full"><button type="submit">Sign Up to Serve</button></div>' +
            '</form>' +
          '</div>' +
        '</div></section>' +
      '</div>';

    this.applyContent();

    this.fillPositions();
    this.wireForm();
  }

  static get observedAttributes() { return ['data-positions', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.fillPositions();
  }

  positions() {
    const raw = this.getAttribute('data-positions');
    if (!raw) return FALLBACK;
    try {
      const d = JSON.parse(raw);
      return (Array.isArray(d) && d.length) ? d : FALLBACK;
    } catch (e) {
      console.error('arise-serve: bad data-positions JSON', e);
      return FALLBACK;
    }
  }

  fillPositions() {
    const mount = this.querySelector('#asvPos');
    if (!mount) return;
    const list = this.positions();
    const E = asvEsc;
    const self = this;

    mount.innerHTML = '<div class="pos">' + list.map(function (p, i) {
      return '<button class="p' + (p.urgent ? ' p--urgent' : '') + '" data-pos="' + i + '" ' +
        'aria-label="Sign up for ' + E(p.title) + '">' +
        (p.urgent ? '<span class="p__tag">Most Needed</span>' : '') +
        (p.team ? '<div class="p__team">' + E(p.team) + '</div>' : '') +
        '<h3>' + E(p.title) + '</h3>' +
        (p.description ? '<p class="p__d">' + E(p.description) + '</p>' : '') +
        '<div class="p__go">Sign Up &rarr;</div>' +
      '</button>';
    }).join('') + '</div>';

    mount.querySelectorAll('.p').forEach(function (b) {
      b.addEventListener('click', function () {
        const p = list[parseInt(b.getAttribute('data-pos'), 10)];
        if (!p) return;
        const field = self.querySelector('#asv-position');
        if (field) field.value = p.title || '';
        const panel = self.querySelector('.panel');
        if (panel && panel.scrollIntoView) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        const nameField = self.querySelector('#asv-name');
        if (nameField && nameField.focus) setTimeout(function () { nameField.focus(); }, 500);
      });
    });
  }

  wireForm() {
    const self = this;
    const form = this.querySelector('form');
    if (!form) return;
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

      const payload = { formType: 'serve' };
      let firstBad = null;

      FIELDS.forEach(function (f) {
        const el = self.querySelector('#asv-' + f.k);
        const val = (el && el.value ? el.value : '').trim();
        payload[f.k] = val;
        const wrap = form.querySelector('.fld[data-k="' + f.k + '"]');
        if (!wrap) return;

        if (f.req && !val) {
          wrap.classList.add('bad');
          wrap.querySelector('.hint').textContent = 'Required';
          if (!firstBad) firstBad = el;
        } else if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          wrap.classList.add('bad');
          wrap.querySelector('.hint').textContent = 'Check this email address';
          if (!firstBad) firstBad = el;
        }
      });

      if (firstBad) { firstBad.focus(); return; }

      go.setAttribute('disabled', 'true');
      note.textContent = 'Sending...';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('status ' + res.status);

        form.outerHTML =
          '<div class="done"><h3>Thank You</h3>' +
          '<p>We\'ve got your sign-up, and someone from that team will reach out ' +
          'about next steps.</p></div>';

      } catch (err) {
        console.error('serve form failed:', err);
        note.setAttribute('data-err', 'true');
        note.textContent = 'Something went wrong sending that. Please try again, or email ' +
          'arisenow.church@gmail.com.';
        go.removeAttribute('disabled');
      }
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

customElements.define('arise-serve', AriseServe);
