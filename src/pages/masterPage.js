/* Arise Church - Velo site code
   Paste into: Code panel -> Site Code -> masterPage.js  (replaces the whole file)
   Fixed 2026-09-14: the old file used $w('*'), which Velo does not support, so
   the header and footer never received the Page Content map. This version uses
   the documented type selector and sends data-content to every custom element
   on the page (header, footer and the page's own element). Elements that arrive
   a moment later are caught by the re-check loop.
   Sped up 2026-09-15: this is now the ONLY file that loads the Arise Church Page
   Content map (page code no longer loads it a second time). The re-check loop
   runs 20 passes, 300 ms apart (about 6 seconds), and an element only counts as
   done once setAttribute has worked on it; a failed try is repeated next pass. */
import { getPageContent } from 'backend/content.web';

const PASSES = 20;     // look for custom elements this many times...
const PASS_MS = 300;   // ...this far apart

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

  const done = {};     // element id -> true once setAttribute worked
  const failed = {};   // element id -> last error, while it keeps failing
  const pass = (n) => {
    const list = [];
    try {
      const sel = $w('CustomElement');
      if (sel && typeof sel.length === 'number') { for (let i = 0; i < sel.length; i++) list.push(sel[i]); }
      else if (sel && typeof sel.setAttribute === 'function') list.push(sel);
    } catch (e) { console.error('Site content: custom element lookup failed', e); }

    list.forEach((el) => {
      if (done[el.id]) return;
      try {
        el.setAttribute('data-content', json);
        done[el.id] = true;
        delete failed[el.id];
      } catch (e) {
        failed[el.id] = e;   // not marked done, so the next pass tries again
      }
    });

    if (n < PASSES) { setTimeout(() => pass(n + 1), PASS_MS); return; }
    Object.keys(failed).forEach((k) => console.error('Site content: could not set data-content on #' + k, failed[k]));
    if (!Object.keys(done).length && !Object.keys(failed).length) console.warn('Site content: no custom elements on this page');
    else if (Object.keys(done).length) console.log('Site content -> ' + Object.keys(done).map((k) => '#' + k).join(', '));
  };
  pass(1);
});
