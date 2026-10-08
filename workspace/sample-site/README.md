# Arise Church — local sample site

A local render of the Velo custom elements, composed the way the published Wix site composes them:
header element + one page element + footer element.

Two renders are served side by side:

| URL | What it runs |
|---|---|
| `/` , `/about`, `/praise-worship` … and `/_fixed/…` | **The 14 Sept 2026 fixed set**: elements from `files2/arise-fixed-2026-09-14/custom-elements/`, the **real Velo page code** from `files2/arise-fixed-2026-09-14/page-code/` (run through `velo-shim.js`), and a mocked backend (`backend/*.js`) that returns the real CMS rows |
| `/_before/…` | The previous render: the 23 Aug 2026 elements fed by `mock-page-code.js` |

## Run it

```bash
node sample-site/server.js
```

Then open **http://localhost:4173/_sample** — the hub lists every page, the element each one uses, its page-code
file, and what to look for. `/_before/_sample` is the old hub.

Clean URLs work exactly like the live site. `/tithes-and-offerings` and `/podcast` stop at a stand-in page
instead of redirecting off-site. Wix app pages (`/events-1/...`, `/classes/...`) show a stand-in too.

## How the fixed set is wired

- `build-fixed.js` generates `pages-fixed/`. Each page tags its element with `data-velo-id` (the Velo element ID).
  Pages whose live element ID does not match their page code (the six Creative Arts department pages, Serve and
  the four galleries) are generated with the element as `customElement5` while the code still asks for
  `#customElement1`, so the sample proves the page code still finds it.
- `velo-shim.js` provides `$w('#id')`, `$w('CustomElement')` and `$w.onReady` with Velo's behaviour (an unknown ID
  yields no element; header and footer containers report `$w.Header` / `$w.Footer`).
- `server.js` serves `/page-code/<file>` with its `backend/...` and `wix-data` imports rewritten to the mocks in
  `backend/`, so the page-code files run unchanged.
- `fixtures-cms.json` holds real rows read from the live CMS on 2026-09-13 (including the five `c3b2d0_` image
  URLs that answer 403). `fixtures-data.js` holds clearly labelled sample data for things the CMS does not have
  yet. `make-fixtures.js` merges them into `fixtures.js`.

## Tests

```bash
node sample-site/tests/backend.test.mjs     # backend files under node with Wix modules mocked
node sample-site/tests/page-code.test.mjs   # every page-code file, right ID and wrong ID, plus masterPage and Sermons
```

In the browser (any sample page, console):

| Helper | What it checks |
|---|---|
| `__audit()` | overflow, H1 count, empty elements, duplicate IDs, missing alt, broken images, small tap targets, contrast |
| `await __cmsTest()` | feeds every `data-ck` / `data-ci` hook a test value and confirms it shows; counts visible text and images with no CMS hook |
| `await __remountTest()` | removes and re-attaches every element (as Wix can) and confirms the page is unchanged, with no duplicate menu panels |
| `await __roundTrip()` | merges the proposed new Page Content rows (`/cms-new-rows.json`) and confirms the page text is unchanged |
| `__errors` | every uncaught error on the page |

`tools/build-cms-rows.js` turns the per-element hook manifests in `files2/arise-fixed-2026-09-14/cms/manifest/`
into `PageContent-new-rows.csv` (for CMS import), `PageContent-new-rows.json` (for `__roundTrip`) and
`PageContent-all-keys.md`.

## Forms

The elements POST to `/_functions/ariseForm`. `server.js` mocks that endpoint with the same validation as the live
`http-functions.js` (ALLOWED list, email regex, required fields). Submissions are printed to the console and listed
at `/_sample/submissions.json`. Nothing is emailed or saved.

## Rebuild after editing

```bash
node sample-site/build-fixed.js
node sample-site/build.js && node sample-site/make-fixtures.js   # old render only
```
