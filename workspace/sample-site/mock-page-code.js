/* ===========================================================================
   MOCK VELO PAGE CODE
   On the live site, each page's Velo code queries the backend and then sets
   data-* attributes on the custom element (ARISE-HANDOFF.md §3, §5c). This
   file plays that role in the sample: it waits for the element to be defined,
   waits a beat (page code arrives after the element has already rendered its
   built-in fallback, exactly as in production), then sets the attributes from
   window.ARISE_FIXTURES.

   The header and footer are NOT fed data-content here, because none of the
   documented page code does that on the live site either (masterPage.js is
   empty). They render their built-in text, as they do in production.
   =========================================================================== */
(function () {
  'use strict';
  var cfg = window.__ARISE_PAGE__ || {};
  var F   = window.ARISE_FIXTURES || {};
  var delay = typeof cfg.delay === 'number' ? cfg.delay : 350;

  function setAttrs(tag, attrs) {
    var els = document.querySelectorAll(tag);
    if (!els.length) { console.warn('[mock page code] no <' + tag + '> on this page'); return; }
    els.forEach(function (el) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    });
    console.log('[mock page code] <' + tag + '> got', Object.keys(attrs).join(', '));
  }

  function feed(tag, attrs) {
    if (!window.customElements) return;
    customElements.whenDefined(tag).then(function () {
      setTimeout(function () { setAttrs(tag, attrs); }, delay);
    });
  }

  if (!cfg.tag) return;

  var attrs = {};
  /* cfg.attrs maps attribute name -> fixture key (JSON-stringified, like the
     real page code does with JSON.stringify(result)). */
  Object.keys(cfg.attrs || {}).forEach(function (attr) {
    var key = cfg.attrs[attr];
    if (F[key] === undefined) { console.warn('[mock page code] no fixture "' + key + '" for ' + attr); return; }
    attrs[attr] = JSON.stringify(F[key]);
  });
  /* cfg.raw maps attribute name -> literal string value (e.g. data-series-active="true"). */
  Object.keys(cfg.raw || {}).forEach(function (attr) { attrs[attr] = String(cfg.raw[attr]); });

  /* Every page's code is documented to also send the PageContent map
     (PAGECONTENT-SETUP.md §2). */
  if (cfg.content !== false && F.pageContent) attrs['data-content'] = JSON.stringify(F.pageContent);

  feed(cfg.tag, attrs);

  /* Optional second element on the page (e.g. arise-service-times in the hero). */
  (cfg.extra || []).forEach(function (x) {
    var a = {};
    Object.keys(x.attrs || {}).forEach(function (attr) {
      if (F[x.attrs[attr]] !== undefined) a[attr] = JSON.stringify(F[x.attrs[attr]]);
    });
    Object.keys(x.raw || {}).forEach(function (attr) { a[attr] = String(x.raw[attr]); });
    if (Object.keys(a).length) feed(x.tag, a);
  });
})();
