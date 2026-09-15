/* Arise Church - Velo page code
   Paste into: Code panel -> Page Code -> "Classes"  (replaces the whole file)
   Fixed 2026-09-14: finds the element by type when the ID differs, logs every miss. */
import { getPrograms } from 'backend/classes.web';
import { getPageContent } from 'backend/content.web';

const PAGE = 'Classes';
const EL = '#customElement5';

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
  try {
    const content = await getPageContent();
    console.log(PAGE + ': content ' + Object.keys(content).length + ' keys');
    ariseSet('data-content', content);
  } catch (err) { console.error(PAGE + ': content failed', err); }

  try {
    const classes = await getPrograms();
    console.log(PAGE + ': ' + classes.length + ' programs');
    ariseSet('data-classes', classes);
  } catch (err) { console.error(PAGE + ': classes failed', err); }
});
