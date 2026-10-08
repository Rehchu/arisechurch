/* ===========================================================================
   VELO SHIM for the sample site
   Lets the REAL Velo page code (files2/arise-fixed-2026-09-14/page-code/*.js)
   run in a plain browser. It reproduces the parts of $w the page code uses:

     $w('#customElement1')  -> the element whose data-velo-id is customElement1,
                               or an empty object when no such element exists
                               (Velo returns something with no setAttribute).
     $w('CustomElement')    -> array of every custom element on the page
                               (header, footer and page element), each with
                               id, type, parent chain and setAttribute().
     $w('*')                -> [] (not a Velo selector; the OLD masterPage.js
                               relied on it and silently did nothing).
     $w.onReady(fn)         -> runs fn once the DOM is ready.

   Elements are tagged in the generated pages with data-velo-id. The header and
   footer strips carry data-velo-id="SITE_HEADER" / "SITE_FOOTER" so the
   page code's ariseInMaster() check behaves as on Wix.
   =========================================================================== */
(function () {
  'use strict';

  function wrap(node) {
    if (!node) return null;
    if (node.__velo) return node.__velo;
    var api = {
      get id() { return node.getAttribute('data-velo-id') || ''; },
      get type() {
        if (node.tagName.indexOf('-') > -1) return '$w.CustomElement';
        var id = node.getAttribute('data-velo-id');
        return id === 'SITE_HEADER' ? '$w.Header' : id === 'SITE_FOOTER' ? '$w.Footer' : '$w.Container';
      },
      get parent() {
        var p = node.parentElement;
        while (p && !p.hasAttribute('data-velo-id')) p = p.parentElement;
        return p ? wrap(p) : null;
      },
      setAttribute: function (name, value) { node.setAttribute(name, value); },
      getAttribute: function (name) { return node.getAttribute(name); },
      node: node
    };
    node.__velo = api;
    return api;
  }

  function $w(selector) {
    if (typeof selector !== 'string') return {};
    if (selector.charAt(0) === '#') {
      var el = document.querySelector('[data-velo-id="' + selector.slice(1) + '"]');
      if (!el) { console.warn('[velo shim] no element with id ' + selector + ' on this page'); return {}; }
      return wrap(el);
    }
    if (selector === 'CustomElement') {
      return Array.prototype.slice.call(document.querySelectorAll('[data-velo-id]'))
        .filter(function (n) { return n.tagName.indexOf('-') > -1; })
        .map(wrap);
    }
    if (selector === '*') { console.warn('[velo shim] $w("*") is not a Velo selector; returning []'); return []; }
    return [];
  }

  $w.onReady = function (fn) {
    var run = function () {
      Promise.resolve().then(fn).catch(function (e) { console.error('[velo shim] onReady error', e); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  };

  window.$w = $w;
})();
