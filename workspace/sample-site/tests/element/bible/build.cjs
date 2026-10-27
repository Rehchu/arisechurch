const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const el = fs.readFileSync(path.join(ROOT, 'src/public/custom-elements/arise-bible.js'), 'utf8').replace(/<\/script/g, '<\\/script');
const mock = fs.readFileSync(path.join(__dirname, 'mock.js'), 'utf8').replace(/<\/script/g, '<\\/script');
const content = JSON.stringify({
  'bible.cta.place1': { text: 'in Pineville' }, 'bible.cta.place2': { text: 'in Alexandria' }, 'bible.cta.place3': { text: 'Glory Night in Pineville' },
  'site.times.sunday.main': { text: 'Sunday 10:30 AM' }, 'site.times.sunday.second': { text: 'Sunday 10:00 AM' }, 'site.times.main.glorynight': { text: 'Monday 7:00 PM' }
});
const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bible Search preview</title>
<meta name="description" content="Preview of the rebuilt Bible Search page for the Arise Church website, with sample data.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap">
<style>
:root{--ink:#0A0A0C}
:root:not([data-theme="light"]){color-scheme:light only}
html,body{margin:0;background:#0A0A0C;color:#fff;font-family:Oswald,Helvetica,Arial,sans-serif}
.hdr{position:sticky;top:0;z-index:50;height:76px;background:#0A0A0C;border-bottom:1px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:space-between;padding:0 32px;box-sizing:border-box}
.hdr b{font:400 22px/1 Anton,Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase}
.hdr span{font:500 11px/1 Oswald,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.ftr{background:#060608;color:rgba(255,255,255,.6);padding:40px 32px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;border-top:1px solid rgba(255,255,255,.12)}
.note{position:fixed;left:12px;bottom:12px;z-index:60;background:#D6222D;color:#fff;font:500 11px/1.4 Oswald,sans-serif;letter-spacing:.08em;padding:8px 12px;max-width:min(380px,calc(100vw - 24px));box-shadow:0 8px 24px rgba(0,0,0,.4)}
@media(max-width:620px){.hdr{height:64px;padding:0 16px}.hdr span{display:none}}
</style></head>
<body>
<div class="hdr" id="siteHeader"><b>Arise Church</b><span>Preview · site header placeholder</span></div>
<arise-bible id="el" data-content='${content.replace(/'/g, '&#39;')}'></arise-bible>
<div class="ftr">Arise Church · site footer placeholder</div>
<div class="note" id="previewNote">Preview with sample data. Every Bible shows King James text here; the live site reads each Bible from its own source. Click the tabs, the chips, Prev / Next, a Bible card.</div>
<script>${mock}</script>
<script>${el}</script>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'bible-preview.html'), page);
console.log('preview written', page.length);
