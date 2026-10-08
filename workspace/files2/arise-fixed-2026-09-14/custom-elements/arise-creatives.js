/* ===========================================================================
   ARISE CHURCH -- CREATIVE ARTS
   File: public/custom-elements/arise-creatives.js
   Tag:  arise-creatives
   Fixed 2026-09-14: Anton 18px floor (h3, tile badge + switcher now Oswald labels); case-insensitive member/department match; applyContent no longer builds selectors from keys
   CMS hooks 2026-09-14: every text block and image editable via Page Content (see cms/manifest/arise-creatives.json)

   ONE file, every page in the section.

     No attribute        -> the Arise Creative Arts hub, listing departments
     data-dept="sound"   -> that department's own page

   Both are fed from the CMS, so adding a person or a department is a
   dashboard edit.

   INSTALL
   1. Velo sidebar -> Public -> custom-elements/ -> new file arise-creatives.js
      -> paste this whole file
   2. On EACH page: Add (+) -> Embed Code -> Custom Element
      Choose Source -> Velo file -> arise-creatives.js
      Tag Name: arise-creatives
      STRETCH IT FULL WIDTH.
   3. On a department page, add a custom attribute in the element settings:
        name: data-dept    value: the department's slug (praise-worship, sound...)
      Leave it off on the hub page.
   4. Add the backend function and page code -- see CREATIVES-SETUP.md
   5. Save, then PUBLISH.

   With no CMS data it shows a quiet placeholder rather than a broken page.
   =========================================================================== */

const ACR_FONTS =
  'https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap';

const ACR_CSS = `
arise-creatives{display:block;width:100%}
.acr *{box-sizing:border-box;margin:0;padding:0}
.acr{
  --red:#D6222D;--redL:#DB3F48;--ink:#0A0A0C;--scrim:#060608;--paper:#fff;
  --bone:#F4F2F0;--muted:#6A6A6E;--rule:rgba(10,10,12,.12);--ruleD:rgba(255,255,255,.15);
  --shell:1180px;--gut:clamp(20px,5vw,56px);--sect:clamp(56px,8vw,104px);
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:300;color:var(--ink);
  background:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased;color-scheme:light only;
}
.acr img{color:#fff;font-size:12px;background:#1A1A1F}
.acr .shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}
.acr h1,.acr h2,.acr h3{font-family:'Anton',Impact,sans-serif;font-weight:400;
  text-transform:uppercase;line-height:1.02;letter-spacing:.02em}
.acr h1{font-size:clamp(36px,6.6vw,76px)}
.acr h2{font-size:clamp(26px,3.8vw,46px)}
.acr h3{font-size:clamp(18px,1.7vw,20px);letter-spacing:.04em;line-height:1.14}
.acr p{font-size:clamp(15.5px,1.4vw,17px)}
.acr .lede{font-size:clamp(16.5px,1.7vw,20px);line-height:1.62}

.acr .mark{display:flex;align-items:center;margin-bottom:18px}
.acr .mark::before{content:"";flex:0 0 auto;width:46px;height:7px;background:var(--red);
  box-shadow:62px 0 0 var(--red);margin-right:80px}
.acr .kicker{font-size:12px;font-weight:500;letter-spacing:.30em;text-transform:uppercase;
  color:var(--red);white-space:nowrap}
@media(max-width:620px){
  /* the two dashes eat 188px before the text starts -- too much on a phone */
  .acr .mark{flex-wrap:nowrap;align-items:flex-start}
  .acr .mark::before{margin-right:124px;margin-top:5px}
  .acr .kicker{white-space:normal;letter-spacing:.20em;font-size:11px;line-height:1.5}
}
.acr .mark--l .kicker{color:var(--redL)}

.acr .btn{display:inline-block;padding:14px 30px;font-size:12px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;text-decoration:none;border:1.5px solid var(--red);background:var(--red);
  color:#fff;transition:background .18s,color .18s,border-color .18s}
.acr .btn:hover{background:transparent;color:#fff;border-color:#fff}
.acr .btn--dark{background:transparent;border-color:var(--ink);color:var(--ink)}
.acr .btn--dark:hover{background:var(--ink);color:#fff}
.acr a:focus-visible{outline:3px solid var(--red);outline-offset:3px}

.acr .sect{padding:var(--sect) 0;background:var(--paper)}
.acr .sect--bone{background:var(--bone)}
.acr .sect--ink{background:var(--ink)}
.acr .sect--ink h2,.acr .sect--ink h3{color:#fff}
.acr .sect--ink p{color:rgba(255,255,255,.82)}
.acr .phead{background:var(--ink);color:#fff;padding:clamp(48px,7vw,92px) 0 clamp(38px,5vw,64px);
  position:relative;overflow:hidden}
.acr .phead::after{content:"";position:absolute;right:-60px;bottom:-90px;width:290px;height:290px;
  border:42px solid rgba(214,34,45,.13);border-radius:50%}
.acr .phead h1,.acr .phead p,.acr .phead .mark{position:relative;z-index:1}
.acr .phead h1{color:#fff}
.acr .phead p{color:rgba(255,255,255,.82);margin-top:22px;max-width:58ch}

/* department tiles on the hub */
.acr .depts{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:var(--rule);
  margin-top:48px}
@media(max-width:900px){.acr .depts{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.acr .depts{grid-template-columns:1fr}}
.acr .d{position:relative;display:block;text-decoration:none;background:var(--scrim);
  overflow:hidden;aspect-ratio:4/5;color:inherit}
.acr .d img{width:100%;height:100%;object-fit:cover;filter:grayscale(.28) brightness(.58);
  transition:transform .5s,filter .35s}
.acr .d:hover img{transform:scale(1.05);filter:grayscale(0) brightness(.74)}
.acr .d__t{position:absolute;left:0;right:0;bottom:0;padding:48px 20px 22px;
  background:linear-gradient(180deg,rgba(6,6,8,0) 0%,rgba(6,6,8,.74) 44%,rgba(6,6,8,.97) 100%)}
.acr .d__t h3{color:#fff}
.acr .d__t span{display:block;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(255,255,255,.86);margin-top:6px;font-weight:500}
.acr .d__n{position:absolute;top:0;left:0;background:var(--red);color:#fff;
  font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:13px;letter-spacing:.16em;padding:8px 14px}

/* people */
.acr .team{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:48px}
@media(max-width:1000px){.acr .team{grid-template-columns:repeat(3,1fr)}}
@media(max-width:700px){.acr .team{grid-template-columns:repeat(2,1fr)}}
@media(max-width:440px){.acr .team{grid-template-columns:1fr}}
.acr .m{border:1px solid var(--rule);background:var(--paper);display:flex;flex-direction:column}
.acr .m__ph{aspect-ratio:1944/2664;overflow:hidden;background:var(--bone)}
.acr .m__ph img{width:100%;height:100%;object-fit:contain;display:block}
.acr .m__init{aspect-ratio:1944/2664;background:var(--ink);display:flex;align-items:center;
  justify-content:center;font-family:'Anton',Impact,sans-serif;font-size:44px;color:var(--redL)}
.acr .m__b{padding:20px}
.acr .m__r{display:inline-block;background:var(--red);color:#fff;font-size:10px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;padding:5px 10px;margin-bottom:11px}
.acr .m__bio{font-size:14px;color:var(--muted);line-height:1.68;margin-top:10px}

.acr .switch{display:flex;flex-wrap:wrap;gap:2px;background:var(--rule);margin-top:48px}
.acr .switch a,.acr .switch span{flex:1 1 auto;background:var(--paper);padding:16px 18px;
  text-decoration:none;text-align:center;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:600;font-size:14px;
  text-transform:uppercase;letter-spacing:.16em;color:var(--ink);
  border-top:3px solid transparent;transition:background .18s,color .18s}
.acr .switch a:hover{background:var(--ink);color:#fff}
.acr .switch span[aria-current]{background:var(--ink);color:#fff;border-top-color:var(--red)}

.acr .group{margin-top:48px}
.acr .group img{width:100%;height:auto;display:block;border:1px solid var(--rule)}

.acr .empty{border:1.5px dashed var(--rule);padding:48px 32px;text-align:center;margin-top:48px}
.acr .empty h3{color:var(--muted);margin-bottom:12px}
.acr .empty p{color:var(--muted);font-size:15.5px;max-width:48ch;margin:0 auto}

.acr .cta{background:var(--red);color:#fff;padding:clamp(40px,5vw,64px) clamp(24px,4vw,52px);
  display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap}
.acr .cta h2,.acr .cta p{color:#fff}
.acr .cta p{margin-top:12px;max-width:46ch}
.acr .cta .mark::before{background:#fff;box-shadow:62px 0 0 #fff}
.acr .cta .kicker{color:#fff}
.acr .cta .btn{background:#fff;border-color:#fff;color:var(--red);flex:0 0 auto}
.acr .cta .btn:hover{background:transparent;color:#fff}
.acr .cta__b{flex:1 1 320px}

@media(prefers-reduced-motion:reduce){.acr *{transition:none!important}}
@media (prefers-color-scheme: dark){
  .acr{background:#fff;color:#0A0A0C}
  .acr .sect{background:#fff}.acr .sect--bone{background:#F4F2F0}
  .acr .sect--ink,.acr .phead{background:#0A0A0C}
}
`;

function acrEsc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Arise Church speed: ask Wix for a resized copy (longest side at most w, format picked per browser). */
function acrImg(u, w) {
  u = String(u || '');
  var m = u.match(/^https?:\/\/static\.wixstatic\.com\/media\/([^\/?#]+\.(?:jpe?g|png|webp|avif))$/i);
  if (!m) return u;
  return 'https://static.wixstatic.com/media/' + m[1] + '/v1/fit/w_' + w + ',h_' + w + ',q_85,enc_auto/' + m[1];
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/);
  return parts.slice(0, 2).map(function (p) { return p.charAt(0).toUpperCase(); }).join('');
}

class AriseCreatives extends HTMLElement {
  connectedCallback() {
    if (this._b) return;
    this._b = true;

    if (!document.getElementById('acr-fonts') && !document.querySelector('link[href="' + ACR_FONTS + '"]')) {
      const l = document.createElement('link');
      l.id = 'acr-fonts'; l.rel = 'stylesheet'; l.href = ACR_FONTS;
      document.head.appendChild(l);
    }
    if (!document.getElementById('acr-css')) {
      const s = document.createElement('style');
      s.id = 'acr-css'; s.innerHTML = ACR_CSS;
      document.head.appendChild(s);
    }
    this.render();
  }

  static get observedAttributes() { return ['data-depts', 'data-members', 'data-dept', 'data-content']; }
  attributeChangedCallback(name) {
    if (!this._b) return;
    if (name === 'data-content') { this.applyContent(); return; }
    this.render();
  }

  parse(attr) {
    const raw = this.getAttribute(attr);
    if (!raw) return [];
    try {
      const d = JSON.parse(raw);
      return Array.isArray(d) ? d : [];
    } catch (e) {
      console.error('arise-creatives: bad ' + attr + ' JSON', e);
      return [];
    }
  }

  render() {
    const which = this.getAttribute('data-dept');
    if (which) this.renderDept(which);
    else this.renderHub();
  }

  /* ---------- the hub: Arise Creative Arts ---------- */
  renderHub() {
    const E = acrEsc;
    const depts = this.parse('data-depts');

    const tiles = depts.length
      ? '<div class="depts" data-cms-source="CreativeDepartments">' + depts.map(function (d, i) {
          const n = String(i + 1).padStart(2, '0');
          const inner =
            (d.groupPhoto ? '<img src="' + E(acrImg(d.groupPhoto, 1200)) + '" alt="' + E(d.name) + '"' +
              (i >= 3 ? ' loading="lazy" decoding="async"' : '') + '>' : '') +
            '<span class="d__n">' + n + '</span>' +
            '<div class="d__t"><h3>' + E(d.name) + '</h3>' +
            (d.tagline ? '<span>' + E(d.tagline) + '</span>' : '') + '</div>';
          return d.pageLink
            ? '<a class="d" href="' + E(d.pageLink) + '" target="_top">' + inner + '</a>'
            : '<span class="d">' + inner + '</span>';
        }).join('') + '</div>'
      : '<div class="empty"><h3 data-ck="creatives.empty.heading">Departments coming soon</h3>' +
        '<p data-ck="creatives.empty.body">The teams that make Sunday happen will be listed here.</p></div>';

    this.innerHTML =
      '<div class="acr">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="creatives.hero.kicker">Arise Church</span></div>' +
          '<h1 data-ck="creatives.hero.heading">Arise<br>Creative Arts</h1>' +
          '<p class="lede" data-ck="creatives.hero.body">Every song, every screen, every sound. Creative Arts is the group of ' +
          'teams that serve together to make Sunday happen - each one its own department, ' +
          'all of them one department.</p>' +
        '</div></header>' +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="creatives.depts.kicker">The Departments</span></div>' +
          '<h2 data-ck="creatives.depts.heading">Who Does What</h2>' +
          tiles +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker" data-ck="creatives.cta.kicker">Get Involved</span></div>' +
            '<h2 data-ck="creatives.cta.heading">There\'s Room<br>For You</h2>' +
            '<p data-ck="creatives.cta.body">If you sing, play, run sound, shoot, edit, or post - we could use you.</p>' +
          '</div>' +
          '<a class="btn" href="/serve" target="_top" data-ck="creatives.cta.button">Sign Up to Serve</a>' +
        '</div></div></section>' +
      '</div>';

    this.applyContent();
  }

  /* ---------- one department ---------- */
  renderDept(slug) {
    const E = acrEsc;
    const depts = this.parse('data-depts');
    const members = this.parse('data-members');

    const dept = depts.filter(function (d) { return d.slug === slug; })[0] || { name: slug };
    const key = function (s) { return String(s || '').trim().toLowerCase(); };
    const team = members.filter(function (m) {
      const md = key(m.department);
      return md !== '' && (md === key(dept.name) || md === key(dept.slug));
    });

    const cards = team.length
      ? '<div class="team" data-cms-source="CreativeMembers">' + team.map(function (m, i) {
          return '<div class="m">' +
            (m.photo
              ? '<div class="m__ph"><img src="' + E(acrImg(m.photo, 1200)) + '" alt="' + E(m.name) + '"' +
                ((dept.groupPhoto || i >= 4) ? ' loading="lazy" decoding="async"' : '') + '></div>'
              : '<div class="m__init">' + E(initials(m.name)) + '</div>') +
            '<div class="m__b">' +
              (m.role ? '<span class="m__r">' + E(m.role) + '</span>' : '') +
              '<h3>' + E(m.name) + '</h3>' +
              (m.bio ? '<p class="m__bio">' + E(m.bio) + '</p>' : '') +
            '</div>' +
          '</div>';
        }).join('') + '</div>'
      : '<div class="empty"><h3 data-ck="creatives.dept.empty.heading">Team coming soon</h3>' +
        '<p data-ck="creatives.dept.empty.body">Photos and bios for this department are on the way.</p></div>';

    const switcher = depts.length > 1
      ? '<div class="switch" data-cms-source="CreativeDepartments">' + depts.map(function (d) {
          return d.slug === slug
            ? '<span aria-current="page">' + E(d.name) + '</span>'
            : '<a href="' + E(d.pageLink || '#') + '" target="_top">' + E(d.name) + '</a>';
        }).join('') + '</div>'
      : '';

    this.innerHTML =
      '<div class="acr">' +
        '<header class="phead"><div class="shell">' +
          '<div class="mark mark--l"><span class="kicker" data-ck="creatives.dept.hero.kicker">Arise Creative Arts</span></div>' +
          '<h1 data-cms-source="CreativeDepartments">' + E(dept.name) + '</h1>' +
          (dept.description
            ? '<p class="lede" data-cms-source="CreativeDepartments">' + E(dept.description) + '</p>'
            : (dept.tagline ? '<p class="lede" data-cms-source="CreativeDepartments">' + E(dept.tagline) + '</p>' : '')) +
        '</div></header>' +

        (dept.groupPhoto
          ? '<section class="sect" style="padding-bottom:0"><div class="shell">' +
            '<div class="group" data-cms-source="CreativeDepartments"><img src="' + E(acrImg(dept.groupPhoto, 2000)) + '" alt="' +
            E(dept.name) + ' team"></div></div></section>'
          : '') +

        '<section class="sect"><div class="shell">' +
          '<div class="mark"><span class="kicker" data-ck="creatives.dept.team.kicker">The Team</span></div>' +
          '<h2 data-ck="creatives.dept.team.heading">Who Serves Here</h2>' +
          cards +
        '</div></section>' +

        '<section class="sect sect--bone" style="padding-top:0"><div class="shell">' +
          '<div class="mark" style="padding-top:var(--sect)">' +
            '<span class="kicker" data-ck="creatives.dept.others.kicker">The Other Teams</span></div>' +
          '<h2 data-ck="creatives.dept.others.heading">Creative Arts</h2>' +
          switcher +
        '</div></section>' +

        '<section class="sect" style="padding-top:0"><div class="shell">' +
          '<div class="cta"><div class="cta__b">' +
            '<div class="mark"><span class="kicker" data-ck="creatives.dept.cta.kicker">Serve With Us</span></div>' +
            '<h2 data-ck="creatives.dept.cta.heading">Join This Team</h2>' +
            '<p data-ck="creatives.dept.cta.body">No experience needed - just a willingness to show up.</p>' +
          '</div>' +
          '<a class="btn" href="/serve" target="_top" data-ck="creatives.dept.cta.button">Sign Up to Serve</a>' +
        '</div></div></section>' +
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

    this.querySelectorAll('[data-ck]').forEach(function (el) {
      const k = el.getAttribute('data-ck');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (v.text) el.innerHTML = v.text;
    });
    this.querySelectorAll('[data-ci]').forEach(function (el) {
      const k = el.getAttribute('data-ci');
      const v = Object.prototype.hasOwnProperty.call(map, k) ? (map[k] || {}) : {};
      if (v.image) {
        const w = Number(el.getAttribute('data-ciw')) || 1600;
        if (el.tagName === 'IMG') el.src = acrImg(v.image, w);
        else el.style.backgroundImage = 'url("' + String(acrImg(v.image, w)).replace(/["\\]/g, '') + '")';
      }
    });
  }
}

customElements.define('arise-creatives', AriseCreatives);
