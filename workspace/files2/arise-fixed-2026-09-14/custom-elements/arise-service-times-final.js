/* ===========================================================================
   ARISE CHURCH — SERVICE TIMES  (Velo Custom Element)
   Fixed 2026-09-14: separate Pineville 10:30 / Alexandria 10:00 Sunday rows with data-ck hooks; data-content support; clean rebuild on re-attach; panel id, aria-controls and focus on open
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-service-times-final.json)

   HOW TO USE THIS
   ---------------
   1. Open the file Wix just created for you (the one with the
      wix-default-custom-element sample code in it).
   2. Select all of that sample code, delete it, paste this in its place.
   3. In the Editor, select the custom element -> Settings ->
      set  Tag Name  to:   arise-service-times
   4. Size the element about 360 x 80. The expanded panel is NOT inside the
      element, so the box only has to fit the button.
   5. Save, then PUBLISH.

   IMPORTANT: custom elements render inside an iframe in the Editor and in
   Preview. It will still look clipped there. Only the published live site
   renders it in the real page DOM — that's where the overlap works.

   This follows the same pattern as Wix's own sample: light DOM (no shadow
   root), styles injected as a <style> element and scoped by the tag name,
   and customElements.define() at the top level.
   =========================================================================== */

const ARISE_FONT_URL =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const ARISE_CSS = `
arise-service-times{
  display:block; width:100%;
  font-family:'Oswald',Helvetica,Arial,sans-serif;
}
arise-service-times .ast-btn{
  width:100%; display:flex; align-items:center; justify-content:space-between;
  gap:14px; padding:17px 22px; background:#D6222D; border:0; border-radius:12px;
  cursor:pointer; font-family:'Oswald',Helvetica,Arial,sans-serif; font-weight:600;
  font-size:17px; letter-spacing:.11em; text-transform:uppercase; color:#fff;
  text-align:left; box-shadow:0 10px 30px rgba(0,0,0,.34);
}
arise-service-times .ast-btn:hover{background:#c11f29}
arise-service-times .ast-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
arise-service-times .ast-chev{flex:0 0 auto;transition:transform .24s ease}
arise-service-times[data-open="true"] .ast-chev{transform:rotate(180deg)}

.ast-panel{
  position:fixed; z-index:2147483000; width:344px; max-width:calc(100vw - 24px);
  background:#0A0A0C; border:1px solid rgba(255,255,255,.13); border-radius:12px;
  box-shadow:0 22px 60px rgba(0,0,0,.62); overflow:hidden;
  font-family:'Oswald',Helvetica,Arial,sans-serif; color:#fff;
  opacity:0; transform:translateY(-8px); pointer-events:none;
  transition:opacity .2s ease, transform .2s ease;
}
.ast-panel[data-show="true"]{opacity:1;transform:translateY(0);pointer-events:auto}
.ast-lead{padding:19px 22px 16px;border-bottom:1px solid rgba(255,255,255,.13)}
.ast-day{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#DB3F48;font-weight:600;margin:0 0 6px 0}
.ast-time{font-family:'Anton',Impact,sans-serif;font-size:26px;line-height:1.1;letter-spacing:.02em;margin:0}
.ast-time + .ast-time{margin-top:6px}
.ast-time small{font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.64);margin-left:6px}
.ast-panel:focus{outline:none}
.ast-note{font-size:12.5px;color:rgba(255,255,255,.64);margin:8px 0 0 0;letter-spacing:.04em}
.ast-body{padding:15px 22px 20px}
.ast-lbl{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.64);margin-bottom:10px}
.ast-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:8px 0;font-size:14.5px}
.ast-row + .ast-row{border-top:1px solid rgba(255,255,255,.07)}
.ast-row b{font-weight:500;white-space:nowrap}
.ast-row em{font-style:normal;color:#DB3F48;font-size:10px;letter-spacing:.16em;text-transform:uppercase;display:block;margin-top:2px}
.ast-addr{margin-top:17px;padding-top:15px;border-top:1px solid rgba(255,255,255,.13);font-size:12.5px;color:rgba(255,255,255,.64);line-height:1.7}
.ast-addr b{color:#fff;font-weight:500}
.ast-cta{display:block;margin-top:15px;padding:12px;text-align:center;background:transparent;
  border:1px solid #D6222D;color:#fff;font-size:12px;font-weight:600;letter-spacing:.15em;
  text-transform:uppercase;text-decoration:none;border-radius:4px}
.ast-cta:hover{background:#D6222D}
.ast-cta:focus-visible{outline:3px solid #fff;outline-offset:2px}
@media(prefers-reduced-motion:reduce){
  .ast-panel{transition:none}
  arise-service-times .ast-chev{transition:none}
}
`;

const ARISE_PANEL_HTML = `
  <div class="ast-lead">
    <p class="ast-day" data-ck="site.servicetimes.lead.kicker">Sunday Service</p>
    <p class="ast-time"><span data-ck="site.times.sunday.main">Sunday 10:30 AM</span> <small data-ck="site.servicetimes.lead.campus1">Pineville</small></p><p class="ast-time"><span data-ck="site.times.sunday.second">Sunday 10:00 AM</span> <small data-ck="site.servicetimes.lead.campus2">Alexandria</small></p>
    <p class="ast-note" data-ck="site.servicetimes.lead.note">Come as you are</p>
  </div>
  <div class="ast-body">
    <div class="ast-lbl" data-ck="site.servicetimes.main.label">Main Campus &middot; Pineville</div>
    <div class="ast-row"><span><span data-ck="site.times.main.glorynight.label">Glory Night</span><em data-ck="site.servicetimes.main.glorynightNote">Monday Nights</em></span><b data-ck="site.servicetimes.main.glorynightTime">7:00 PM</b></div>
    <div class="ast-row"><span data-ck="site.times.main.midweek.label">Midweek Service</span><b data-ck="site.servicetimes.main.midweekTime">Wed 7:00 PM</b></div>
    <div class="ast-row"><span data-ck="site.times.main.prayer.label">Corporate Prayer</span><b data-ck="site.servicetimes.main.prayerTime">Mon&ndash;Thu 5:00 AM</b></div>
    <div class="ast-addr">
      <b data-ck="site.servicetimes.addr.mainLabel">Main Campus</b><br><span data-ck="site.campus.main">501 Ates Road, Pineville, LA 71360</span><br><br>
      <b data-ck="site.servicetimes.addr.secondLabel">Alexandria Campus</b><br><span data-ck="site.campus.second">5305 North Blvd, Alexandria, LA 71301</span>
    </div>
    <a class="ast-cta" href="/contact" data-ck="site.servicetimes.cta.button">Plan Your Visit</a>
  </div>`;

let astPanelCount = 0;

class AriseServiceTimes extends HTMLElement {
  static get observedAttributes() { return ['data-content']; }
  attributeChangedCallback() { this.applyContent(); }

  /* CMS text for [data-ck] hooks, in the button and in the body-level panel. */
  applyContent() {
    const raw = this.getAttribute('data-content');
    if (!raw) return;
    let map;
    try { map = JSON.parse(raw); } catch (e) {
      console.error('arise-service-times: bad data-content JSON', e); return;
    }
    if (!map || typeof map !== 'object') return;
    const roots = [this];
    if (this._panel) roots.push(this._panel);
    roots.forEach(function (root) {
      root.querySelectorAll('[data-ck]').forEach(function (el) {
        const k = el.getAttribute('data-ck');
        if (!Object.prototype.hasOwnProperty.call(map, k)) return;
        const v = map[k];
        const text = typeof v === 'string' ? v : (v && v.text);
        if (text) el.innerHTML = text;
      });
    });
  }

  connectedCallback() {
    if (this._built) return;
    this._built = true;

    if (!document.getElementById('ast-fonts') &&
        !document.querySelector('link[href="' + ARISE_FONT_URL + '"]')) {
      const link = document.createElement('link');
      link.id = 'ast-fonts';
      link.rel = 'stylesheet';
      link.href = ARISE_FONT_URL;
      document.head.appendChild(link);
    }
    if (!document.getElementById('ast-css')) {
      const style = document.createElement('style');
      style.id = 'ast-css';
      style.innerHTML = ARISE_CSS;
      document.head.appendChild(style);
    }

    // --- button, in the light DOM (same approach as Wix's own sample) ---
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ast-btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML =
      '<span data-ck="site.servicetimes.button">Service Times</span>' +
      '<svg class="ast-chev" width="15" height="9" viewBox="0 0 15 9" fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M1 1L7.5 7.5L14 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
    this.appendChild(btn);
    this._btn = btn;

    // --- panel on document.body: escapes the element, strips, sections ---
    const panel = document.createElement('div');
    panel.className = 'ast-panel';
    panel.setAttribute('data-show', 'false');
    panel.id = 'ast-panel-' + (++astPanelCount);
    panel.tabIndex = -1;
    btn.setAttribute('aria-controls', panel.id);
    panel.innerHTML = ARISE_PANEL_HTML;
    document.body.appendChild(panel);
    this._panel = panel;

    this._onDoc = this._docClick.bind(this);
    this._onKey = this._key.bind(this);
    this._onMove = this._place.bind(this);

    const self = this;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      self._set(self.getAttribute('data-open') !== 'true');
    });

    this.applyContent();
  }

  _place() {
    const r = this._btn.getBoundingClientRect();
    const w = this._panel.offsetWidth || 344;
    let left = Math.min(r.right - w, window.innerWidth - w - 12);
    if (left < 12) left = 12;
    this._panel.style.left = left + 'px';
    this._panel.style.top = (r.bottom + 10) + 'px';
  }

  _set(open) {
    this.setAttribute('data-open', String(open));
    this._btn.setAttribute('aria-expanded', String(open));
    this._panel.setAttribute('data-show', String(open));
    if (open) {
      this._place();
      try { this._panel.focus({ preventScroll: true }); } catch (e) { this._panel.focus(); }
      window.addEventListener('scroll', this._onMove, true);
      window.addEventListener('resize', this._onMove);
      document.addEventListener('click', this._onDoc);
      document.addEventListener('keydown', this._onKey);
    } else {
      window.removeEventListener('scroll', this._onMove, true);
      window.removeEventListener('resize', this._onMove);
      document.removeEventListener('click', this._onDoc);
      document.removeEventListener('keydown', this._onKey);
    }
  }

  _docClick(e) {
    if (this._panel.contains(e.target) || this.contains(e.target)) return;
    this._set(false);
  }

  _key(e) {
    if (e.key === 'Escape') { this._set(false); this._btn.focus(); }
  }

  disconnectedCallback() {
    if (this._btn && this._panel) this._set(false);
    if (this._panel && this._panel.parentNode) {
      this._panel.parentNode.removeChild(this._panel);
    }
    window.removeEventListener('scroll', this._onMove, true);
    window.removeEventListener('resize', this._onMove);
    document.removeEventListener('click', this._onDoc);
    document.removeEventListener('keydown', this._onKey);
    if (this._btn && this._btn.parentNode) this._btn.parentNode.removeChild(this._btn);
    this._btn = null;
    this._panel = null;
    this._built = false;
  }
}

customElements.define('arise-service-times', AriseServiceTimes);
