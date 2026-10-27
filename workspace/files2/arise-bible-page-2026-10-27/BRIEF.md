# Bible Search page — rebuild, 27 Oct 2026

Page: `/arise-bible` (MEDIA / Resources → Bible Search). Element `arise-bible`
(`src/public/custom-elements/arise-bible.js`), no page code. Preview with sample
data: https://claude.ai/artifact/Hg6iomuBQtD3fPnNPRcYBm

## What it is

The same theatre as the Media page ("House Lights Down"): masthead, a numbered
tab strap that locks to the top of the screen, one room on stage at a time
sliding in from the side, a red footlight on each room's diagonal cut, and the
"Hear It Taught" invitation always below the deck, above the footer.

| Room | What is in it |
|---|---|
| 01 Read | Bible dropdown, reference box (verse, range, chapter, or a range across chapters), six suggestion chips, Book / Chapter pickers, Prev / Next, the passage with Anton verse numerals, the copyright line, Copy / Share / Study notes |
| 02 Study | Translator's notes for the verses on screen (borrowed from the Berean Standard Bible when the chosen Bible has none, and labelled so), the Easton / Smith dictionary entries that cite the passage, "Look up a word" |
| 03 Listen | Narrated chapters (Berean Standard Bible, Accessible Ancients Bible), narrator buttons; for a Bible with no recording, one button switches to one that has |
| 04 Bibles | Every Bible as a numbered wall, a filter box, the count; picking one re-opens the passage in it |

Deep links work: `/arise-bible?ref=Romans+8:28&bible=BSB`. The last passage and
Bible are remembered on the device.

## How it works

Browser → `/_functions/bible*` (same origin, `backend/http-functions.js`) →
`backend/bible.js` → the sources. Keys never reach the browser.

`backend/bible.js` is AriseHub's `lib/bible.ts` + `lib/usfm-books.ts` + the
`/api/bible/*` routes, converted to plain JavaScript for Velo (`wix-fetch`,
`wix-secrets-backend`). Same rules: the free list is curated to 18 editions,
duplicates collapse under one canonical name, a licensed copy of the BSB keeps
its recording, notes are borrowed and said so, a range across chapters is fetched
as whole chapters and trimmed (six at most), errors come back as a sentence a
reader can act on. Differences from AriseHub, on purpose:

- **English only** (decided 27 Oct): no Greek or Hebrew texts, so no verse
  renumbering either. ISO codes (`en`, `eng`) count as English.
- **ESV API** added (`ESV_API_KEY`), with Crossway's copyright line.
- **AriseHub is itself a source** (`ARISEHUB_API_KEY`, an AriseHub personal API
  key traded for a one-hour session): every Bible AriseHub can serve, and the
  dictionary, without the website holding those keys. The website's own keyed
  sources outrank it, so a Bible the site can read directly is read directly.
- The KJV rule accepts "Authorized" with a z (AriseHub's regex only matched
  "Authorised").

Sources, most preferred first: youversion, esv, helloao, api-bible, biblia,
bible-api, wldeh, arisehub.

## Keys (Wix Secrets Manager — all five stored 27 Oct)

`YOUVERSION_APP_KEY`, `API_BIBLE_KEY` (an older `APIbible` is read as a fallback),
`BIBLIA_API_KEY`, `ARISEHUB_API_KEY`; `ESV_API_KEY` is optional. None is
required: with no keys the page still has the 18 free Bibles.

## Checking it after publishing

1. `https://www.arisecenla.church/_functions/bibleStatus` — `keys` shows which
   secrets are set (true/false, never values); `sources[].offered` is how many
   Bibles each source listed, `listed` how many survived into the page's list,
   `error` what a source answered if it failed.
2. `/_functions/bibleBibles` — the list the page shows.
3. `/_functions/bible?ref=John+3:16&translation=BSB` — one passage.
4. The page itself: tabs, chips, Prev / Next, a Bible card, a dictionary entry.

Custom elements and `/_functions/` only run on the LIVE site, not in Preview.

## CMS

`cms/manifest/arise-bible.json` is the full key set (28). To apply after
approval: insert the 12 rows in `cms/PageContent-bible-page-2026-10-27.csv`,
reword `bible.form.versionLabel` → "Bible", `bible.form.verseLabel` → "Verse or
chapter", `bible.form.button` → "Read", and once published delete
`bible.cta.pineville`, `bible.cta.alexandria`, `bible.cta.end`,
`bible.results.ready` (`PageContent-bible-page-2026-10-27.json` lists all three
sets).

## Checks

- `node workspace/sample-site/tests/bible.test.mjs` — 27 (references, the list,
  each source, notes / audio / span, the AriseHub bridge, the HTTP functions)
- `node workspace/sample-site/tests/backend.test.mjs` — 28, `page-code.test.mjs` — 92
- Browser (Playwright, sample backend): four sizes, no console errors, no
  horizontal scroll, no small tap targets; chips, Prev / Next, Study, the entry
  expander, Listen with and without a recording, the Bibles wall and filter, a
  bad reference, the strap lock under a pinned header, every `data-ck` key.
