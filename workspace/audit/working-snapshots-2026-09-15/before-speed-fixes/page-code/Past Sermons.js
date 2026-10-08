/* Arise Church - Velo page code
   Paste into: Code panel -> Page Code -> "Past Sermons"  (replaces the whole file)
   Fixed 2026-09-14: finds the element by type when the ID differs, logs every miss. */
import wixData from 'wix-data';
import { getLiveVideoId, getCurrentSeries, getLatestShorts } from 'backend/youtube.jsw';

const PAGE = 'Past Sermons';
const EL = '#customElement1';

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

$w.onReady(async () => {
  // ---- Series band: a CMS override (Site Settings -> sermonSeries) wins,
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
  setInterval(checkLive, 60000);
});
