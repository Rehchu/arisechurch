# Bible Search element checks

The element talks to the site's HTTP functions, which only exist on the live
site, so these checks run it against `mock.js`: a sample backend that answers the
same URLs (`bibleBibles`, `bibleBooks`, `bible`, `bibleReference`,
`bibleDictionary`) with King James text and a few dictionary entries. The element
uses it whenever `window.__abiMock` is defined.

```
node workspace/sample-site/tests/element/bible/build.cjs            # writes bible-preview.html next to it (the preview page)
node workspace/sample-site/tests/element/bible/check.cjs <outdir>   # four sizes, screenshots, report.json
```

`check.cjs` renders phone / tablet / desktop / wide, then on phone and desktop
drives the page: a chip, Prev / Next, a whole chapter, the Study room and an
entry expander, Listen with and without a recording, the Bibles wall and its
filter, a bad reference, the strap lock under a pinned header, every `data-ck`
key. `report.json` has the numbers; errors must be `[]`, `scrollW` must equal
`innerW`, `smallTaps` must be empty.
