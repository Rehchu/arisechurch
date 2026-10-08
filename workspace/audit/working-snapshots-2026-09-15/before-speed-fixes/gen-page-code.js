const fs = require('fs'), path = require('path');
const OUT = 'D:/projects/Arise Church Website/files2/arise-fixed-2026-09-14/page-code';
fs.mkdirSync(OUT, { recursive: true });

const HELPER = `
/* ---- Arise page helper (identical in every page file) ----------------------
   EL is the element ID shown in the Properties panel (right-click the custom
   element -> View Properties). If that ID is not on this page, the helper falls
   back to every custom element outside the header and footer, so a duplicated
   or renamed element still receives its data. Every miss is logged. */
function ariseInMaster(el) {
  let p = el && el.parent, n = 0;
  while (p && n++ < 25) {
    if (p.type === '$w.Header' || p.type === '$w.Footer' ||
        /^(SITE_HEADER|SITE_FOOTER|header1|footer1)$/.test(p.id || '')) return true;
    p = p.parent;
  }
  return false;
}
function ariseTargets() {
  try {
    const byId = EL ? $w(EL) : null;
    if (byId && typeof byId.setAttribute === 'function') return [byId];
  } catch (e) { /* that ID is not on this page */ }
  const all = [];
  try {
    const sel = $w('CustomElement');
    if (sel && typeof sel.length === 'number') { for (let i = 0; i < sel.length; i++) all.push(sel[i]); }
    else if (sel && typeof sel.setAttribute === 'function') all.push(sel);
  } catch (e) { console.error(PAGE + ': custom element lookup failed', e); }
  const page = all.filter((el) => !ariseInMaster(el));
  return page.length ? page : all;
}
function ariseSet(attr, value) {
  const json = typeof value === 'string' ? value : JSON.stringify(value);
  const attempt = (n) => {
    const els = ariseTargets();
    if (els.length) {
      els.forEach((el) => el.setAttribute(attr, json));
      console.log(PAGE + ': ' + attr + ' -> ' + els.map((el) => '#' + el.id).join(', '));
      return;
    }
    if (n < 30) setTimeout(() => attempt(n + 1), 300);
    else console.warn(PAGE + ': no custom element found for ' + attr + ' (looked for ' + EL + ')');
  };
  attempt(1);
}
`;

function file(name, pageLabel, EL, imports, consts, body) {
  const head =
`/* Arise Church - Velo page code
   Paste into: Code panel -> Page Code -> "${pageLabel}"  (replaces the whole file)
   Fixed 2026-09-14: finds the element by type when the ID differs, logs every miss. */
${imports.join('\n')}

const PAGE = '${pageLabel.replace(/'/g, "\\'")}';
const EL = ${EL ? `'${EL}'` : 'null'};${consts ? '\n' + consts : ''}
${HELPER}
$w.onReady(async () => {
${body}
});
`;
  fs.writeFileSync(path.join(OUT, name + '.js'), head);
}

const content = () => `  try {
    const content = await getPageContent();
    console.log(PAGE + ': content ' + Object.keys(content).length + ' keys');
    ariseSet('data-content', content);
  } catch (err) { console.error(PAGE + ': content failed', err); }`;

file('Home', 'Home', '#customElement1',
  ["import { getProjectPhotos } from 'backend/gallery.web';", "import { getPageContent, getHomeSettings } from 'backend/content.web';"],
  "const EXCITING_NEWS = 'b2697282-735e-42fc-979a-2b8dc2118f1e';   // Portfolio project shown in the hero news panel",
`${content()}

  try {
    const culture = await getHomeSettings();
    console.log(PAGE + ': culture video ' + (culture && culture.videoId ? culture.videoId : 'none'));
    if (culture) ariseSet('data-culture', culture);
  } catch (err) { console.error(PAGE + ': culture failed', err); }

  try {
    const news = await getProjectPhotos(EXCITING_NEWS);
    const items = news.map((n) => ({
      src: n.src, videoId: n.videoId || '', title: n.alt,
      description: n.caption, alt: n.alt
    }));
    console.log(PAGE + ': news ' + items.length + ' items');
    ariseSet('data-news', items);
  } catch (err) { console.error(PAGE + ': news failed', err); }`);

file('Arise Church Alexandria', 'Arise Church Alexandria', '#customElement5',
  ["import { getPageContent } from 'backend/content.web';"], '', content());

file('Connect Groups', 'Connect Groups', '#customElement1',
  ["import { getConnectGroups, getPageContent } from 'backend/content.web';"], '',
`${content()}

  try {
    const groups = await getConnectGroups();
    console.log(PAGE + ': ' + groups.length + ' groups');
    ariseSet('data-groups', groups);
  } catch (err) { console.error(PAGE + ': groups failed', err); }`);

const creatives = (label, EL) => file(label, label, EL,
  ["import { getCreatives, getPageContent } from 'backend/content.web';"], '',
`${content()}

  try {
    const data = await getCreatives();
    console.log(PAGE + ': ' + data.departments.length + ' departments, ' + data.members.length + ' members');
    ariseSet('data-depts', data.departments);
    ariseSet('data-members', data.members);
  } catch (err) { console.error(PAGE + ': creatives failed', err); }`);
creatives('Creative Arts', '#customElement5');
['Praise and Worship', 'Musicians', 'Production', 'Sound', 'Media', 'Social Media and Content'].forEach((p) => creatives(p, '#customElement1'));

file('Classes', 'Classes', '#customElement5',
  ["import { getPrograms } from 'backend/classes.web';", "import { getPageContent } from 'backend/content.web';"], '',
`${content()}

  try {
    const classes = await getPrograms();
    console.log(PAGE + ': ' + classes.length + ' programs');
    ariseSet('data-classes', classes);
  } catch (err) { console.error(PAGE + ': classes failed', err); }`);

file('Past Sermons', 'Past Sermons', '#customElement1',
  ["import wixData from 'wix-data';", "import { getLiveVideoId, getCurrentSeries, getLatestShorts } from 'backend/youtube.jsw';"], '',
`  // ---- Series band: a CMS override (Site Settings -> sermonSeries) wins,
  //      otherwise the newest YouTube playlist whose name contains "series".
  try {
    let title = null, line = null, link = null, label = null;
    const { items } = await wixData.query('SiteSettings')
      .eq('settingKey', 'sermonSeries').limit(1).find();
    const s = items[0];
    if (s && s.seriesActive && s.seriesTitle) {
      title = s.seriesTitle;
      line  = s.seriesLine   || null;
      link  = s.seriesLink   || null;
      label = s.seriesButton || null;
    } else {
      const auto = await getCurrentSeries();
      if (auto) { title = auto.title; link = auto.url; label = 'Watch the Series'; }
    }
    if (title) {
      ariseSet('data-series-title', title);
      ariseSet('data-series-line', line || '');
      if (link)  ariseSet('data-series-link', link);
      if (label) ariseSet('data-series-button', label);
      ariseSet('data-series-active', 'true');
      console.log(PAGE + ': series band "' + title + '"');
    } else {
      ariseSet('data-series-active', 'false');   // hides the band
      console.log(PAGE + ': no active series, band hidden');
    }
  } catch (err) { console.error(PAGE + ': series lookup failed', err); }

  // ---- Newest Shorts from the YouTube channel. If none come back, the page
  //      keeps showing its built-in list.
  try {
    const shorts = await getLatestShorts(8);
    console.log(PAGE + ': ' + shorts.length + ' newest Shorts');
    if (shorts.length) ariseSet('data-clips', shorts);
  } catch (err) { console.error(PAGE + ': Shorts lookup failed', err); }

  // ---- Live stream: re-checked every minute; the attribute only changes on change.
  let current = null;
  async function checkLive() {
    try {
      const liveId = await getLiveVideoId();
      if (liveId === current) return;
      current = liveId;
      ariseSet('data-live-video', liveId || '');
      if (liveId) console.log(PAGE + ': live stream ' + liveId);
    } catch (err) { console.error(PAGE + ': live check failed', err); }
  }
  checkLive();
  setInterval(checkLive, 60000);`);

file('Ministries', 'Ministries', '#customElement1',
  ["import { getMinistries } from 'backend/content.web';"], '',
`  try {
    const ministries = await getMinistries();
    console.log(PAGE + ': ' + ministries.length + ' ministries');
    ariseSet('data-ministries', ministries);
  } catch (err) { console.error(PAGE + ': ministries failed', err); }`);

file('Events', 'Events', '#customElement1',
  ["import { getEvents } from 'backend/events.web';"], '',
`  try {
    const data = await getEvents();
    console.log(PAGE + ': ' + data.upcoming.length + ' upcoming, ' + data.past.length + ' past');
    ariseSet('data-events', data);
  } catch (err) { console.error(PAGE + ': events failed', err); }`);

file('Contact', 'Contact', '#customElement1',
  ["import { getPageContent } from 'backend/content.web';"], '', content());

file('Sign Up to Serve', 'Sign Up to Serve!', '#customElement1',
  ["import { getServePositions, getPageContent } from 'backend/content.web';"], '',
`${content()}

  try {
    const positions = await getServePositions();
    console.log(PAGE + ': ' + positions.length + ' positions');
    ariseSet('data-positions', positions);
  } catch (err) { console.error(PAGE + ': positions failed', err); }`);

file('Meet our Leaders', 'Meet our Leaders', '#customElement1',
  ["import { getLeaders } from 'backend/content.web';"], '',
`  try {
    const leaders = await getLeaders();
    console.log(PAGE + ': ' + leaders.length + ' leaders');
    ariseSet('data-leaders', leaders);
  } catch (err) { console.error(PAGE + ': leaders failed', err); }`);

const gallery = (name, label, id) => file(name, label, '#customElement1',
  ["import { getProjectPhotos } from 'backend/gallery.web';", "import { getPageContent } from 'backend/content.web';"],
  `const PROJECT_ID = '${id}';   // Portfolio project that feeds the photo gallery`,
`${content()}

  try {
    const photos = await getProjectPhotos(PROJECT_ID);
    console.log(PAGE + ': gallery ' + photos.length + ' items');
    ariseSet('data-photos', photos);
  } catch (err) { console.error(PAGE + ': gallery failed', err); }`);
gallery("Children's Ministry", "Children's Ministry", '621e6fdb-57f1-4b84-9834-e861e6407476');
gallery('Youth Ministry', 'Youth Ministry', 'c2be296e-9eb4-4a02-b6b8-428128fbe50d');
gallery('Outreach', 'Outreach', '78e5e5f9-6560-4edb-9e09-fc74dadab9f3');
gallery('Lead Network', 'Lead Network', '885f9ceb-b1ea-4259-8388-284c180062e6');

fs.writeFileSync(path.join(OUT, 'masterPage.js'), `/* Arise Church - Velo site code
   Paste into: Code panel -> Site Code -> masterPage.js  (replaces the whole file)
   Fixed 2026-09-14: the old file used $w('*'), which Velo does not support, so
   the header and footer never received the Page Content map. This version uses
   the documented type selector and sends data-content to every custom element
   on the page (header, footer and the page's own element). Elements that arrive
   a moment later are caught by the short re-check loop. */
import { getPageContent } from 'backend/content.web';

$w.onReady(async () => {
  let json;
  try {
    const content = await getPageContent();
    console.log('Site content: ' + Object.keys(content).length + ' keys');
    json = JSON.stringify(content);
  } catch (err) {
    console.error('Site content failed:', err);
    return;
  }

  const done = {};
  const pass = (n) => {
    const list = [];
    try {
      const sel = $w('CustomElement');
      if (sel && typeof sel.length === 'number') { for (let i = 0; i < sel.length; i++) list.push(sel[i]); }
      else if (sel && typeof sel.setAttribute === 'function') list.push(sel);
    } catch (e) { console.error('Site content: custom element lookup failed', e); }

    list.forEach((el) => {
      if (done[el.id]) return;
      done[el.id] = true;
      el.setAttribute('data-content', json);
    });

    if (n < 10) setTimeout(() => pass(n + 1), 300);
    else if (!Object.keys(done).length) console.warn('Site content: no custom elements on this page');
    else console.log('Site content -> ' + Object.keys(done).map((k) => '#' + k).join(', '));
  };
  pass(1);
});
`);
console.log(fs.readdirSync(OUT).join('\n'));
