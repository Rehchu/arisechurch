/* ===========================================================================
   ARISE CHURCH — SERVICE TIMES  (Velo Custom Element)
   File: public/custom-elements/arise-service-times.js
   Tag:  arise-service-times

   Structured exactly as Wix's docs describe: a top-level class, then a
   top-level customElements.define(). Nothing wrapped in a function — the
   editor's source picker needs to see the registration at the top level.
   =========================================================================== */

const ARISE_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const ARISE_PANEL_CSS = `
.arise-st-panel{
  position:fixed; z-index:2147483000; width:344px; max-width:calc(100vw - 24px);
  background:#0A0A0C; border:1px solid rgba(255,255,255,.13); border-radius:12px;
  box-shadow:0 22px 60px rgba(0,0,0,.62); overflow:hidden;
  font-family:'Oswald',Helvetica,Arial,sans-serif; color:#fff;
  opacity:0; transform:translateY(-8px); pointer-events:none;
  transition:opacity .2s ease, transform .2s ease;
}
.arise-st-panel[data-show="true"]{opacity:1;transform:translateY(0);pointer-events:auto}
.arise-st-lead{padding:19px 22px 16px;border-bottom:1px solid rgba(255,255,255,.13)}
.arise-st-day{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#D6222D;font-weight:600;margin-bottom:6px}
.arise-st-time{font-family:'Anton',Impact,sans-serif;font-size:35px;line-height:1;letter-spacing:.02em}
.arise-st-note{font-size:12.5px;color:rgba(255,255,255,.64);margin-top:8px;letter-spacing:.04em}
.arise-st-body{padding:15px 22px 20px}
.arise-st-lbl{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.64);margin-bottom:10px}
.arise-st-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:8px 0;font-size:14.5px}
.arise-st-row + .arise-st-row{border-top:1px solid rgba(255,255,255,.07)}
.arise-st-row b{font-weight:500;white-space:nowrap}
.arise-st-row em{font-style:normal;color:#D6222D;font-size:10px;letter-spacing:.16em;text-transform:uppercase;display:block;margin-top:2px}
.arise-st-addr{margin-top:17px;padding-top:15px;border-top:1px solid rgba(255,255,255,.13);font-size:12.5px;color:rgba(255,255,255,.64);line-height:1.7}
.arise-st-addr b{color:#fff;font-weight:500}
.arise-st-cta{display:block;margin-top:15px;padding:12px;text-align:center;background:transparent;
  border:1px solid #D6222D;color:#fff;font-size:12px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;text-decoration:none;border-radius:4px}
.arise-st-cta:hover{background:#D6222D}
.arise-st-cta:focus-visible{outline:3px solid #fff;outline-offset:2px}
@media(prefers-reduced-motion:reduce){.arise-st-panel{transition:none}}
`;

const ARISE_PANEL_HTML = `
  <div class="arise-st-lead">
    <div class="arise-st-day">Sunday Service</div>
    <div class="arise-st-time">10:30 AM</div>
    <div class="arise-st-note">Both campuses &middot; Come as you are</div>
  </div>
  <div class="arise-st-body">
    <div class="arise-st-lbl">Main Campus &middot; Pineville</div>
    <div class="arise-st-row"><span>Glory Night<em>Monday Nights</em></span><b>7:00 PM</b></div>
    <div class="arise-st-row"><span>Midweek Service</span><b>Wed 7:00 PM</b></div>
    <div class="arise-st-row"><span>Corporate Prayer</span><b>Mon&ndash;Thu 5:00 AM</b></div>
    <div class="arise-st-addr">
      <b>Main Campus</b><br>501 Ates Road, Pineville, LA 71360<br><br>
      <b>Alexandria Campus</b><br>5305 North Blvd, Alexandria, LA 71301
    </div>
    <a class="arise-st-cta" href="/contact">Plan Your Visit</a>
  </div>`;

class AriseServiceTimes extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;

    // @font-face has to live in the main document for shadow DOM to use it
    if (!document.getElementById('arise-st-fonts')) {
      const link = document.createElement('link');
      link.id = 'arise-st-fonts';
      link.rel = 'stylesheet';
      link.href = ARISE_FONTS;
      document.head.appendChild(link);
    }
    if (!document.getElementById('arise-st-css')) {
      const style = document.createElement('style');
      style.id = 'arise-st-css';
      style.textContent = ARISE_PANEL_CSS;
      document.head.appendChild(style);
    }

    // ---- the button: lives inside this element's box ----
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host{display:block;font-family:'Oswald',Helvetica,Arial,sans-serif}
        button{
          width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;
          padding:17px 22px;background:#D6222D;border:0;border-radius:12px;cursor:pointer;
          font-family:inherit;font-weight:600;font-size:17px;letter-spacing:.11em;
          text-transform:uppercase;color:#fff;text-align:left;
          box-shadow:0 10px 30px rgba(0,0,0,.34);
        }
        button:hover{background:#c11f29}
        button:focus-visible{outline:3px solid #fff;outline-offset:3px}
        svg{flex:0 0 auto;transition:transform .24s ease}
        :host([data-open="true"]) svg{transform:rotate(180deg)}
        @media(prefers-reduced-motion:reduce){svg{transition:none}}
      </style>
      <button type="button" aria-expanded="false">
        <span>Service Times</span>
        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true" focusable="false">
          <path d="M1 1L7.5 7.5L14 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>`;

    this._btn = root.querySelector('button');

    // ---- the panel: lives on document.body, escapes every container ----
    this._panel = document.createElement('div');
    this._panel.className = 'arise-st-panel';
    this._panel.setAttribute('data-show', 'false');
    this._panel.innerHTML = ARISE_PANEL_HTML;
    document.body.appendChild(this._panel);

    this._onDoc = this._docClick.bind(this);
    this._onKey = this._key.bind(this);
    this._onMove = this._place.bind(this);
    this._btn.addEventListener('click', () => this._set(this.getAttribute('data-open') !== 'true'));
  }

  _place() {
    const r = this._btn.getBoundingClientRect();
    const w = this._panel.offsetWidth || 344;
    const left = Math.min(r.right - w, window.innerWidth - w - 12);
    this._panel.style.left = Math.max(12, left) + 'px';
    this._panel.style.top = (r.bottom + 10) + 'px';
  }

  _set(open) {
    this.setAttribute('data-open', String(open));
    this._btn.setAttribute('aria-expanded', String(open));
    this._panel.setAttribute('data-show', String(open));
    if (open) {
      this._place();
      window.addEventListener('scroll', this._onMove, { passive: true });
      window.addEventListener('resize', this._onMove);
      setTimeout(() => document.addEventListener('click', this._onDoc), 0);
      document.addEventListener('keydown', this._onKey);
    } else {
      window.removeEventListener('scroll', this._onMove);
      window.removeEventListener('resize', this._onMove);
      document.removeEventListener('click', this._onDoc);
      document.removeEventListener('keydown', this._onKey);
    }
  }

  _docClick(e) {
    if (this._panel.contains(e.target)) return;
    if (e.composedPath && e.composedPath().indexOf(this) > -1) return;
    this._set(false);
  }

  _key(e) {
    if (e.key === 'Escape') { this._set(false); this._btn.focus(); }
  }

  disconnectedCallback() {
    if (this._panel && this._panel.parentNode) this._panel.parentNode.removeChild(this._panel);
    window.removeEventListener('scroll', this._onMove);
    window.removeEventListener('resize', this._onMove);
    document.removeEventListener('click', this._onDoc);
    document.removeEventListener('keydown', this._onKey);
  }
}

customElements.define('arise-service-times', AriseServiceTimes);
