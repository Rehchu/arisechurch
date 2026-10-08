/* ===========================================================================
   ARISE CHURCH -- FORMS
   File: public/custom-elements/arise-form.js
   Tag:  arise-form

   One element, three forms. Set the type with an attribute in the Editor:

     data-form="contact"   Name, Email, Phone, Message
     data-form="serve"     Name, Email, Phone, Position (your five roles)
     data-form="prayer"    Name, Email, Prayer Request

   HOW IT SUBMITS
   Custom elements can't call Velo backend modules -- but they CAN fetch a
   Velo HTTP Function, which is a real URL on your own site. This element
   POSTs to /_functions/ariseForm. Same origin, no auth, no page code.

   INSTALL
   1. Add backend/http-functions.js  (see FORMS-SETUP.md) -- required
   2. Velo sidebar -> Public -> custom-elements/ -> new file arise-form.js
      -> paste this whole file
   3. Editor -> the page -> Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-form.js
      Tag Name: arise-form
   4. In the element's settings, add a custom attribute:
        name:  data-form     value:  contact   (or serve / prayer)
   5. Stretch it full width. Save, then PUBLISH. Test on the LIVE page.

   Submissions land in the Form Submissions collection (CMS) and are emailed
   to the address set in http-functions.js.
   =========================================================================== */

const AFM_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const ENDPOINT = '/_functions/ariseForm';

const FORMS = {
  contact: {
    kicker: 'Send Us a Message',
    heading: 'Get In Touch',
    blurb: 'Questions about a service, a ministry, or planning your first visit \u2014 send us a note and someone will get back to you.',
    button: 'Send Message',
    done: 'Thank you. Your message is on its way and someone will be in touch.',
    fields: [
      { k: 'name',    label: 'Your Name',  type: 'text',     req: true,  half: true },
      { k: 'email',   label: 'Email',      type: 'email',    req: true,  half: true },
      { k: 'phone',   label: 'Phone',      type: 'tel',      req: false, half: true },
      { k: 'subject', label: 'Subject',    type: 'text',     req: false, half: true },
      { k: 'message', label: 'Message',    type: 'textarea', req: true,  half: false }
    ]
  },
  serve: {
    kicker: 'Volunteer Sign Up',
    heading: 'Sign Up To Serve',
    blurb: 'Join our congregation in making a difference! We\u2019re seeking passionate volunteers to fill key roles and help our ministries thrive.',
    button: 'Submit',
    done: 'Thank you for signing up. Someone will reach out about next steps.',
    fields: [
      { k: 'name',     label: 'Your Name', type: 'text',   req: true,  half: true },
      { k: 'email',    label: 'Email',     type: 'email',  req: true,  half: true },
      { k: 'phone',    label: 'Phone',     type: 'tel',    req: false, half: true },
      { k: 'position', label: 'Position',  type: 'select', req: true,  half: true,
        options: ["Children's Department", 'Outreach', 'Media/Social Media',
                  'Edge/X Edge', 'Maintenance'] },
      { k: 'message',  label: 'Anything else we should know?', type: 'textarea', req: false, half: false }
    ]
  },
  prayer: {
    kicker: 'Prayer Request',
    heading: 'We\u2019ll Pray With You',
    blurb: 'Share what you\u2019re carrying. Our prayer team reads every request.',
    button: 'Send Request',
    done: 'Thank you. Our prayer team has your request.',
    fields: [
      { k: 'name',    label: 'Your Name',      type: 'text',     req: true,  half: true },
      { k: 'email',   label: 'Email',          type: 'email',    req: true,  half: true },
      { k: 'message', label: 'Prayer Request', type: 'textarea', req: true,  half: false }
    ]
  }
};

const AFM_CSS = `
arise-form{display:block;width:100%}
.afm *{box-sizing:border-box;margin:0;padding:0}
.afm{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--paper:#fff;--bone:#F4F2F0;
  --muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.18);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.afm .shell{max-width:var(--shell);margin:0 auto;padding:var(--sect) var(--gut)}
.afm h2{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;
  font-size:clamp(26px,3.8vw,46px);line-height:1.02;letter-spacing:.02em;color:#fff}
.afm .mark{display:flex;align-items:center;margin-bottom:18px}
.afm .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.afm .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--redL);white-space:nowrap}
.afm .blurb{color:rgba(255,255,255,.82);margin-top:20px;max-width:56ch;font-size:16.5px}

.afm form{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:44px}
.afm .full{grid-column:1/-1}
@media(max-width:640px){.afm form{grid-template-columns:1fr}}
.afm label{display:block;font-size:11px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;
  color:rgba(255,255,255,.72);margin-bottom:9px}
.afm label .req{color:var(--redL)}
.afm input,.afm select,.afm textarea{width:100%;background:transparent;border:0;
  border-bottom:1.5px solid rgba(255,255,255,.3);padding:12px 0;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;font-size:16.5px;color:#fff}
.afm textarea{min-height:120px;resize:vertical;line-height:1.6}
.afm select option{background:#0A0A0C;color:#fff}
.afm input::placeholder,.afm textarea::placeholder{color:rgba(255,255,255,.34)}
.afm input:focus,.afm select:focus,.afm textarea:focus{outline:none;border-bottom-color:var(--red)}
.afm .bad input,.afm .bad select,.afm .bad textarea{border-bottom-color:var(--redL)}
.afm .hint{font-size:12px;color:var(--redL);margin-top:7px;min-height:16px}

.afm button{display:inline-block;padding:16px 36px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;border:1.5px solid var(--red);background:var(--red);color:#fff;
  font-family:inherit;cursor:pointer;transition:background .18s,color .18s,border-color .18s}
.afm button:hover{background:transparent;color:#fff;border-color:#fff}
.afm button[disabled]{opacity:.55;pointer-events:none}
.afm button:focus-visible,.afm input:focus-visible,.afm select:focus-visible,.afm textarea:focus-visible{
  outline:3px solid var(--red);outline-offset:3px}

.afm .note{grid-column:1/-1;font-size:14.5px;color:rgba(255,255,255,.82);min-height:22px}
.afm .note[data-err="true"]{color:var(--redL)}
.afm .done{margin-top:44px;border-left:5px solid var(--red);padding:28px 30px;
  background:rgba(255,255,255,.06)}
.afm .done h3{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;
  font-size:22px;color:#fff;letter-spacing:.03em;margin-bottom:10px}
.afm .done p{color:rgba(255,255,255,.86);font-size:16px}

@media(prefers-reduced-motion:reduce){.afm *{transition:none!important}}
@media (prefers-color-scheme: dark){ .afm{background:#0A0A0C} }
`;

function afmEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

class AriseForm extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('afm-fonts')) {
      const l = document.createElement('link');
      l.id = 'afm-fonts'; l.rel = 'stylesheet'; l.href = AFM_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('afm-css')) {
      const s = document.createElement('style');
      s.id = 'afm-css'; s.innerHTML = AFM_CSS;
      document.head.appendChild(s);
    }

    const type = (this.getAttribute('data-form') || 'contact').toLowerCase();
    const cfg = FORMS[type] || FORMS.contact;
    this._type = FORMS[type] ? type : 'contact';
    this._cfg = cfg;
    const E = afmEsc;

    const fields = cfg.fields.map(function (f) {
      const cls = f.half ? '' : ' full';
      const req = f.req ? ' <span class="req">*</span>' : '';
      let control;
      if (f.type === 'textarea') {
        control = '<textarea id="afm-' + f.k + '" name="' + f.k + '"' + (f.req ? ' required' : '') + '></textarea>';
      } else if (f.type === 'select') {
        control = '<select id="afm-' + f.k + '" name="' + f.k + '"' + (f.req ? ' required' : '') + '>' +
          '<option value="">Choose one\u2026</option>' +
          (f.options || []).map(function (o) { return '<option>' + E(o) + '</option>'; }).join('') +
          '</select>';
      } else {
        control = '<input id="afm-' + f.k + '" name="' + f.k + '" type="' + f.type + '"' +
                  (f.req ? ' required' : '') + ' autocomplete="on">';
      }
      return '<div class="fld' + cls + '" data-k="' + f.k + '">' +
        '<label for="afm-' + f.k + '">' + E(f.label) + req + '</label>' +
        control + '<div class="hint"></div></div>';
    }).join('');

    this.innerHTML =
      '<div class="afm"><div class="shell">' +
        '<div class="mark"><span class="kicker">' + E(cfg.kicker) + '</span></div>' +
        '<h2>' + E(cfg.heading) + '</h2>' +
        '<p class="blurb">' + E(cfg.blurb) + '</p>' +
        '<form novalidate>' + fields +
          '<div class="note" id="afmNote"></div>' +
          '<div class="full"><button type="submit" id="afmGo">' + E(cfg.button) + '</button></div>' +
        '</form>' +
      '</div></div>';

    const root = this;
    const form = root.querySelector('form');
    const note = root.querySelector('#afmNote');
    const go   = root.querySelector('#afmGo');

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // clear previous errors
      root.querySelectorAll('.fld').forEach(function (d) {
        d.classList.remove('bad');
        d.querySelector('.hint').textContent = '';
      });
      note.textContent = '';
      note.removeAttribute('data-err');

      const payload = { formType: root._type };
      let firstBad = null;

      cfg.fields.forEach(function (f) {
        const el = root.querySelector('#afm-' + f.k);
        const val = (el && el.value ? el.value : '').trim();
        payload[f.k] = val;

        const wrap = root.querySelector('.fld[data-k="' + f.k + '"]');
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
      note.textContent = 'Sending\u2026';

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('status ' + res.status);

        root.querySelector('.shell').innerHTML =
          '<div class="mark"><span class="kicker">' + E(cfg.kicker) + '</span></div>' +
          '<h2>' + E(cfg.heading) + '</h2>' +
          '<div class="done"><h3>Thank You</h3><p>' + E(cfg.done) + '</p></div>';

      } catch (err) {
        console.error('arise-form submit failed:', err);
        note.setAttribute('data-err', 'true');
        note.textContent = 'Something went wrong sending that. Please try again, or email arisenow.church@gmail.com.';
        go.removeAttribute('disabled');
      }
    });
  }
}

customElements.define('arise-form', AriseForm);
