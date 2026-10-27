# Element checks for `arise-sermons.js`

Headless-browser checks for the Media page element (Playwright + Chromium; `require('playwright')`
must resolve). YouTube is swapped for placeholders, so judge layout, not the art.

```bash
node workspace/sample-site/tests/element/render.cjs src/public/custom-elements/arise-sermons.js /tmp/aes   # contracts + screenshots
node workspace/sample-site/tests/element/probe.cjs  src/public/custom-elements/arise-sermons.js            # failure modes
node workspace/sample-site/tests/element/tour.cjs   src/public/custom-elements/arise-sermons.js /tmp/aes   # every room, keys, swipe, pin
```

`render.cjs` passes when every size reports `errors: []` and `scrollW === innerW`, and the contract block
has `missingIds: []`, `missingCk: []`, one selected playlist after a pick and after a re-render, live
on/off switching the top player and badge, the series band hidden when inactive, and `cmsApplied: true`.
