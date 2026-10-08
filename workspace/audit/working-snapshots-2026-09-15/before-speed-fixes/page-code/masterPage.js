/* Arise Church - Velo site code
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
