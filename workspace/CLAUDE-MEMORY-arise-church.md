Arise Church website (arisecenla.church) — memory from the 13–15 Sept 2026 Claude Code chat

WHO I AM
- I'm Bradly (dyerbradly2@gmail.com). I maintain the Arise Church website on Wix (classic Editor + Velo) and serve on the Media team of Arise Creative Arts.
- I install code myself by pasting Velo files in the Wix Editor. Nothing goes on the live site without my go-ahead.
- Work on my computer is in the folder <repo>/workspace. The full Claude Code transcript of this chat is <repo>/workspace/chat/claude-code-transcript-456ec4ba.jsonl.

HOW I WANT WORK DONE
- Tell me what's broken with evidence, then wait for me to decide what to fix.
- Fix without breaking anything that works, and test before handing anything over.
- The CMS is how the site is edited: every text block, image, time, label and fact should come from the Wix CMS (Page Content), not be typed into code.
- Always write "Arise Church", never just "Arise". Use the copy already on the site; don't invent copy.
- I review on an iPhone, often in the Facebook in-app browser in dark mode.

CHURCH FACTS (exact)
- Apostle Bryant Sanders and Pastor Vanessa Sanders lead Arise Church. Pastor Vanessa is both Pastor and Prophet.
- Pastor Sheron Turner is Lead Pastor of Arise Church Alexandria. She is NOT a prophet. Her bio is her own wording and stays exactly as written (checked 15 Sept: no typos); its "Prophet Vanessa Sanders" refers to Pastor Vanessa.
- Main Campus: 501 Ates Road, Pineville, LA 71360. Sunday 10:30 AM, Monday 7:00 PM Glory Night, Wednesday 7:00 PM, Corporate Prayer Mon–Thu 5:00 AM.
- Alexandria Campus: 5305 North Blvd, Alexandria, LA 71301. Sunday 10:00 AM, Wednesday 6:00 PM Prayer, Wednesday 6:45 PM Bible Study.
- Contact: (318) 640-1865, arisenow.church@gmail.com; prayer requests arisechurchprayer@gmail.com. Tagline #YouBelongHere.
- Connect Groups is host registration only for now; joining opens after groups are scheduled. Host sign-up deadline extended to Sunday, September 20.
- The Sermons page should show the newest YouTube Shorts automatically.
- Creative Arts has 6 departments and 14 members. There is no Thelma.
- Brand: Arise Red #D6222D, near-black #0A0A0C, bone #F4F2F0; fonts Anton and Oswald.

WHAT WAS FOUND (audit, 14 Sept 2026)
- Fixes prepared on 23 Aug 2026 were never installed; the live site runs three older generations of code.
- 11 pages (the six Creative Arts department pages, Serve, Children's, Youth, Outreach, Lead Network) look for the wrong element ID, so their data never shows. Sermons page code stops on its first line. masterPage.js never reaches the header or footer.
- Five Page Content image rows point at dead "c3b2d0_" image addresses; the same photos exist under "1f9fa2_".
- The YouTube backend got YouTube's mobile page (series detection never worked) and would call a scheduled stream "Live Now".
- I deleted arise-bible.js from Velo by accident; it must be re-created before the next publish.

WHAT WAS BUILT (finished, tested and published 15 Sept 2026)
- Folder files2/arise-fixed-2026-09-14 (plus a .zip) with INSTALL.md: 21 fixed custom elements with CMS hooks on every text block and image, 22 page-code files that find their element even with the wrong ID, 3 changed backend files (youtube.jsw, events.web.js, classes.web.js; delete events.jsw), and a CSV of 526 new Page Content rows that change nothing until edited.
- Connect Groups join options stay hidden until the CMS row connect.join.open is set to "yes". Clearing connect.season.hostby hides the sign-up deadline.
- Sermons shows the 8 newest Shorts, refreshed about every 10 minutes.
- Tests: backend 18/18, page code 44/44, sample pages 35/35 desktop and 20/20 phone.
- Install order: CMS fixes (five image URLs, deadline row, optional "Prophet" to "Pastor" for Pastor Vanessa in the Alexandria bio, CSV import), backend, re-create arise-bible.js, paste elements, paste page code, publish once, run the checklist.

NEXT STEPS / OPEN
- 15 Sept: the site is connected to GitHub (repo Rehchu/arisechurch, cloned to D:projectsArise Church Websitearisechurch). 15 Sept: the fixes are LIVE (commit 77f2fad; I published after a full preview check). The 526 new CMS rows were imported and checked the same day, so every heading, paragraph, button and photo is now editable in CMS -> Page Content (571 rows). The speed fixes were published the same day (commit 0d8dee0): photos are sent at the size shown, and data loads once and in parallel. First visits are about 4x faster, with 7x less data (Meet our Leaders went from 26.6 MB to 1.4 MB). To-do: click Publish once in the Editor so the newest design version is live. Speed fix to consider: resize photos (leader photos are 4+ MB each).
- Sample site: on my computer run "node sample-site/server.js"; on my phone on the same Wi-Fi open http://192.168.1.211:4173/_sample.
- Still open: "Tioga, Louisiana" in Pastor Sheron's bio; empty photo galleries and no published classes.

## Where everything lives now (8 Oct 2026)
Everything is in **one private repo: https://github.com/Rehchu/arisechurch**.
- The live site code: `src/backend`, `src/pages`, `src/public/custom-elements` (Wix syncs only these).
- Everything else under **`workspace/`**, which Wix ignores: `files2/arise-fixed-2026-09-14` (the live build + INSTALL.md), `files2/live-*` (the pre-fix code), `files`/`files2/arise-fixed-2026-08-23` (August build), `audit/` (findings, CMS backups, check.mjs, evidence), `sample-site/` (both test suites), `claude-memory/` (these notes) and `chat/` (the full transcript and session export).
- Paths that used to read `D:\projects\Arise Church Website\<x>` are now `<repo>/workspace/<x>`. Tests still run as `node workspace/sample-site/tests/backend.test.mjs` and `...page-code.test.mjs`, because the folder layout inside workspace/ is unchanged.
- `workspace/audit/check.mjs` no longer hardcodes machine paths: output goes to `workspace/audit/preview-check-results/`, the browser profile to the system temp folder, and `ARISE_EDGE` / `ARISE_CHECK_OUT` / `ARISE_EDGE_PROFILE` override them.
- The separate backup repo `arise-church-backup` is now a duplicate; `arise-church-workspace` (the one that briefly held the submissions CSV) is being deleted by Bradly.
- **Lost and not recoverable:** the page-code generator that lived in the session scratchpad. The 22 page files in `src/pages` are the only copy now — edit them directly. The older generator snapshot is at `workspace/audit/working-snapshots-2026-09-15/before-speed-fixes/gen-page-code.js`.
