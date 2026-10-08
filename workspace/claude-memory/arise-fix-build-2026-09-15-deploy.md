---
name: arise-deploy-2026-09-15
description: 15 Sept 2026 deploy state — fixed code pushed to GitHub (commit 77f2fad), preview checked, publish blocked for Claude and waiting on Bradly; loading-speed findings
metadata:
  type: project
---
- **Pushed:** Bradly logged in to the Wix CLI (dyerbradly2@gmail.com). The fixed code was committed as **77f2fad** on Rehchu/arisechurch main, with author Rehchu <dyerbradly2@gmail.com> set via `git -c` because no global git identity exists. [[arise-fix-build-2026-09-14]]
- **Preview:** `wix preview --source local` produced https://wix.to/RZjUJYc (https://www.arisecenla.church/?siteRevision=2&branchId=b6c43d78-ae31-4a9e-b4da-68f4cefffe91).
- **Check:** the headless Edge harness `audit/preview-check-2026-09-15/check.mjs` (CDP, flags --pages/--sites/--vps/--workers/--out/--nocache/--port) checked 26 pages × preview/live × desktop/phone. Results are in functional/.
  - Every checklist item passes: Connect host-only with September 20; Sermons 8 Shorts, series band, Latest Service; Bible Search finds John 3:16; 7 serve positions; department teams; no broken photos; Contact Sunday Sunday fixed; the broken Previous Events button (/previous-events-1) removed.
  - Not our bugs: Podcast (Wix app) and Give (Tithe.ly embed) show errors on live too. One-off Wix `AssistantLoadState` error on Home phone, not reproducible.
  - Harness caveats: its "Sunday Sunday" check falsely flags Leaders ("ON A SUNDAY" + "Sunday 10:30"); the header tel link only exists after the menu opens; LCP is 0 in background tabs, so time things with --workers=1.
- **Publish:** `wix publish --source remote -y` was blocked by the Claude Code auto-mode classifier (Production Deploy) even though Bradly asked to deploy. Bradly must publish from the Editor or run the command himself, or add a permission rule. After publishing: re-check live, then the 526-row CSV import (ask first).
- **Loading-speed findings (not fixed yet; Bradly asked about speed, needs go-ahead):**
  1. Full-size photos are served. Leader PNGs are 1944×2664 and 4–4.6 MB each; `/v1/fit/w_800,h_800,q_85,enc_auto/` gives about 18–47 KB AVIF, no alpha, iPhone gets AVIF. About 46 `<img>` spots in the elements plus backend imgUrl helpers.
  2. Page code awaits calls one after another (Sermons: series → Shorts → live; Home: content → settings → gallery). masterPage and page code both call getPageContent.
  3. Cold backend plus YouTube scraping on the first visit: the first preview Sermons LCP was about 17 s; the second 0.65 s.
  4. Every element links the same Google Fonts CSS; Wix platform JS is about 100 scripts / 650 KB (Chat, Firebase, etc.).

## Update: PUBLISHED 15 Sept 2026
- Bradly published the site himself; commit 77f2fad is live. The post-publish live check of 26 pages × desktop/phone is in audit/preview-check-2026-09-15/after-publish.
- Next: ask before the 526-row PageContent import; the speed fixes (resize photos, parallel/single data loads, YouTube pre-fetch) await his go-ahead.

## Update: 526 Page Content rows IMPORTED 15 Sept 2026 (Bradly: "Go ahead!")
- Inserted via ExecuteWixAPI bulk insert in 4 chunks (18 + 172 + 159 + 177), with the existing-key check built in. PageContent now has 571 rows, no duplicate keys, all 45 original rows kept, connect.season.hostby still "September 20".
- Verified: per-page FNV-1a fingerprints of the new rows (contentKey|page|label|text|imageUrl|where) match cms/PageContent-new-rows.json for all 19 pages. Live Home, Contact, Connect, Sermons, Alexandria and Leaders text is byte-identical before/after, and the console shows "Site content: 571 keys", so the paged getPageContent works live.
- Undo if ever needed: delete PageContent rows whose contentKey is in cms/PageContent-new-rows.json.
- The same "Go ahead!" approved the speed fixes. Workflow wf_1fffb930-358 (resize photos in the elements, masterPage as the only getPageContent caller, parallel page-code calls) edits files2/arise-fixed-2026-09-14. Snapshot before the edits: audit/working-snapshots-2026-09-15/before-speed-fixes. Plan: tests → wix preview (local) → timing check vs live → report to Bradly before any push/publish.

## Update: speed fixes built (workflow wf_1fffb930-358, 14 agents, all reviewed)
- **Elements:** each file has a <prefix>Img(u, w) helper that rewrites plain static.wixstatic.com/media/<file>.(jpg|png|webp|avif) to /v1/fit/w_W,h_W,q_85,enc_auto/<file>. W is 800/1200/1600/2000 by slot; data-ciw on data-ci markup; lazy+async below the fold; Google Fonts link skipped if the same href already exists.
- **Reviewer fixes:** a leaders double-resize, font href guards in about/sermons/childrens/form, and asrImg removed from the YouTube thumbnail. Hook counts are unchanged; audit.js __cmsTest accepts resized URLs.
- **Page code** (gen-page-code.js regenerated): masterPage is the only getPageContent caller (20 passes × 300 ms, marks done after setAttribute); pages no longer send data-content; independent calls start in parallel (async IIFEs with try/catch); Past Sermons series, Shorts and live start together. page-code tests: 90/90; backend 19/19; build-fixed OK. The backend is unchanged.
- Copied into the arisechurch working copy (not committed). The new preview is https://wix.to/zYHtXYm (branchId 6110e8e3-a169-414a-b45b-5d60a717772c). check.mjs takes --previewq.
- **Measurements running:** audit/preview-check-2026-09-15/speed-functional (preview, all pages) then speed-timing (5 pages × preview/live × desktop/phone × 2 runs, nocache, workers=1).
- **Open risk to check:** Wix video-frame poster URLs (videoId + f001.jpg) now get /v1/fit; verify they load.

## Update: speed fixes PUBLISHED 15 Sept 2026 (Bradly: "Well commit then publish please!")
- Commit **0d8dee0** was pushed to main and published with `wix publish --source remote -y`, which the classifier allowed this time with Bradly's explicit ask. Live now: resized photos, masterPage as the only content fetch, parallel page calls.
- The pre-publish check of the speed preview (branchId 6110e8e3-…) passed: no broken images, no unresized wixstatic imgs, text identical to live, all checklist items pass. (analyze-speed.js's "Sermons FAIL" was its own case-sensitive "Latest Service" regex, since the page shows uppercase text.) Backend calls on Sermons now start together (about the same ms). A one-off Job Board error ("MutationObserver observe parameter 1 is not of type Node") is not from our code (no MutationObserver in any element) and did not recur on phone.
- **CAUTION from the CLI:** it published UI version 1608 (wix.config.json) and said the Editor has newer design changes. If Bradly changed the design in the Editor after 1608, the live design may have rolled back. Fix: Bradly clicks Publish in the Editor, which uses the latest UI plus the main-branch code, or saves in the Local Editor so uiVersion updates before a CLI publish.
- The old-code preview is still reachable for before/after timing: branchId b6c43d78-ae31-4a9e-b4da-68f4cefffe91 (code 77f2fad).

## Update: speed fixes verified LIVE (after publishing 0d8dee0)
- **Live check** (audit/preview-check-2026-09-15/live-after-speed, 26 pages × desktop/phone): every checklist item passes. 0 broken images, 0 unresized wixstatic imgs, 0 warnings from our code, and page text identical to before the speed publish (no text lost to the UI 1608 caution; visual design can't be ruled out by text, so Editor Publish is still recommended). The only exceptions are the Wix Chat SDK 401 (Wix chat app, not ours).
- **Timing** (speed-timing2; nocache, 2 runs, old = preview b6c43d78 on 77f2fad, new = live 0d8dee0), summed over 5 pages × 2 viewports:
  - page load 20.1 s → 5.4 s
  - LCP 28.2 s → 9.9 s
  - downloaded 103 MB → 14.5 MB
  - images 92 MB → 3.9 MB
  - Leaders alone: 26.6 MB → 1.4 MB
  - Backend calls now start about 0.8 s after navigation, together (old: about 3 s, sequential, with a duplicate getPageContent). Home page code still starts about 3.1 s in (Wix hydration).
- analyze-speed.js (scratchpad) takes P_DIR/L_DIR/T_DIR env vars. INSTALL.md has a "15 Sept 2026 update: faster loading" section with the table.

## 29 Sept 2026: MORE discipleship course added to the Classes page
- The Classes page lists Online Programs with status PUBLISHED (backend/classes.web.js → @wix/online-programs). Nothing in the CMS drives the class list.
- Flyer uploaded to Media Manager via generate-upload-url + curl PUT (UploadImageToWixSite can't take a local path; base64 is too big for 2.5 MB): `c3b2d0_17f1f5ed62b548aea4b37100b9c5bc85~mv2.png`, 1254×1254. The card's /v1/fit/w_1200 copy is 65 KB AVIF.
- Program **MORE** created and published: id `e303707e-8b39-4fae-8131-42450b77ddca`, slug `more-discipleship-course`, free (price omitted, not 0), scheduled timeline startDate 2026-10-18 + durationInDays 36 (ends 22 Nov), accessType PUBLIC, 0 steps/sections. Details text is Apostle Bryant T. Sanders, Sr.'s own wording, sent by Bradly — don't reword it.
- In person AND online, Sundays 9:00–9:45 AM; paper registration sheets sit in the foyer alongside the online Join button.
- Verified live: "Classes: 1 programs", FREE card with flyer, View Class → /class-detail/more-discipleship-course (200, has Join/Sign Up).
- Known cosmetics: the card picture box is `aspect-ratio:16/10` with object-fit cover, so a square flyer loses its top/bottom lines on the card. Options if Bradly wants: a 16:10 version of the flyer, or a code change to letterbox square images.
- Wix moves a scheduled program to ENDED after its end date, so MORE drops off the Classes page by itself after 22 Nov 2026.

## 29 Sept 2026: themed class page (commit 39f1b0b, pushed, NOT published yet)
- Bradly asked for the class page to match the site theme, pointing at the Events setup. Finding: both /class-detail/<slug> and /events-1/<slug> are Wix app pages using the site theme fonts (corben, din-next, Madefor), not Anton/Oswald. The Events pages were styled in the Editor (near-black background, red band, red RSVP); the Classes app page never was, so it shows Wix grey. Page background and app design are Editor-only — GitHub can't set them (the repo has no styles folder: backend, pages, public only).
- Built instead: arise-classes.js opens the class inside our own Classes page. "View Class" → in-page detail with the full uncropped flyer, WHEN dates, the whole description, a foyer-sign-up note, Register (→ the Wix program page, where Join lives) and Ask a Question; "← All Classes" returns; `#class-<slug>` deep-links; the open class survives a data refresh.
- classes.web.js now returns `slug`, `startDate`, `endDate` (startDate + durationInDays - 1).
- 5 new CMS rows: classes.detail.back / whenLabel / note / register / ask (PageContent now 576 rows).
- Verified on preview branch 1e345d49: tests 19/19 and 90/90, parse OK, no new ?./??, hooks 14→20 data-ck, no broken images, no sideways scroll, desktop and phone.
- Registration stays Wix's Join button (Bradly's choice); paper sheets in the foyer continue.
- check.mjs now supports a #hash in a page slug and has class-detail, event-detail and class-open entries.
- **PUBLISHED 29 Sept 2026** (commit 39f1b0b, `wix publish --source remote`, Bradly said yes). Verified live on /classes and /classes#class-more-discipleship-course, desktop and phone: card list, themed class view, dates, Register → Wix Join, Ask a Question, 0 broken images, no sideways scroll, no warnings from our code.
- Still open, Bradly's call: (1) style Wix's own class page in the Editor like the event pages (background 0A0A0C, header/footer, red buttons) — Editor-only work; (2) blue strip at the top of and above the footer on the Wix event pages; (3) the Classes card crops a square flyer (the class view shows it whole).
- The CLI still warns "the Editor contains newer design changes" on every publish (uiVersion 1608 in wix.config.json). An Editor publish, or a Save in the Local Editor, would sync it.
- **29 Sept, commit ce352a1 PUBLISHED** ("Fix what you can and publish publicly!"): class cards measure each picture on load and show square/upright flyers whole (`.c__whole`, object-fit contain on the dark card); wide photos still fill the box. Card also shows the class dates. Verified live on /classes and the #class- deep link, desktop and phone: 0 broken images, no sideways scroll, no warnings from our code.
- Waiting on Bradly being home (Editor-only, cannot be done from the repo): style Wix's own class page like the event pages, and the blue strip on the event pages.

## 8 Oct 2026: workspace backed up before a Windows 11 reset
- **Private repo https://github.com/Rehchu/arise-church-backup** (commit a73f4de) holds: project/ (files2 fixed build + INSTALL.md, files, audit write-ups, cms-backups, before-speed-fixes snapshot, sample-site tests/tools), claude-memory/ (these notes), chat/ (the raw 19.6 MB transcript and Claude Code's 35.8 MB session export), and a README with the restore steps.
- The site's own code was already safe: Rehchu/arisechurch main at ce352a1, clean and pushed.
- Checked before uploading: the transcript names the ArchivedFormSubmissions **field names** only — no submitter names, emails, phones or addresses. No other people's emails, no phone numbers but the church's.
- NOT backed up on purpose: `~/.claude` itself (holds login tokens) and node_modules. After the reset: install Node/Git/gh/Claude Code, `npm install -g @wix/cli`, `gh auth login`, `wix login` (in a real terminal window), clone both repos, `npm install --ignore-scripts` in arisechurch, and copy claude-memory/ back to `C:\Users\<you>\.claude\projects\D--projects-Arise-Church-Website\memory\`.

- **PII slip and fix, 8 Oct:** the first backup push (repo `arise-church-workspace`) included `project/files/ArchivedFormSubmissions.csv` — 42 real emails and 31 phone numbers from old form submissions. Caught on review: file removed, history restarted, clean tree pushed to a NEW private repo **Rehchu/arise-church-backup**; `.gitignore` now blocks that filename anywhere in the backup.
- **Rule learned: never copy `ArchivedFormSubmissions.csv` (or anything derived from it) off this machine.** It belongs in the CMS (admin-only) and on Bradly's disk. Copying a project folder wholesale is how it slipped through — scan for personal details before any upload.
- All four of Bradly's repos are PRIVATE: arisechurch, arise-church-backup, arise-church-workspace, AriseHub. The site repo holds no secrets or personal details (checked 8 Oct).
- The old `arise-church-workspace` repo still answers for its pre-rewrite commit IDs. Bradly is deleting it; the gh token lacks the delete_repo scope, so it needs `gh auth refresh -h github.com -s delete_repo` then `gh repo delete Rehchu/arise-church-workspace --yes`, or the Danger Zone on github.com.

## 8 Oct 2026 (later): one repo for everything
- Bradly: "The Arise Church Workspace should all be in the arisechurch repo." Done in commit **bfbaa44**: `workspace/` added to Rehchu/arisechurch with files2 (live build + INSTALL.md + pre-fix code), files, audit (findings, CMS backups, check.mjs, evidence), sample-site (both suites), claude-memory and chat. 381 files, ~69 MB. **No src/ changes**, so the site was untouched and no publish was needed.
- Checked against the Wix docs first: Wix syncs only `src/backend`, `src/pages`, `src/public` and `wix.config.json`, and ignores files at the root of `src`. A new top-level folder is invisible to Wix. Note it does ride along on every clone Wix makes when publishing.
- Root README rewritten for this site (install with `--ignore-scripts`, `wix login` in a real terminal, read-only Editor, preview, never publish Local code, house rules, current state). `workspace/README.md` explains the material and the checks.
- `workspace/audit/check.mjs` is now portable: results in `workspace/audit/preview-check-results/`, profile in the system temp dir, `ARISE_EDGE`/`ARISE_CHECK_OUT`/`ARISE_EDGE_PROFILE` to override. Tests rerun from the repo: 19/19 and 90/90.
- `.gitignore` blocks ArchivedFormSubmissions.csv anywhere, plus the check output folder.
- The separate repos are now duplicates: `arise-church-backup` (clean copy, keep or delete) and `arise-church-workspace` (still holds the PII CSV in old commits — Bradly to delete). Local folder `D:\projects\Arise Church Website\backup-2026-10-08` is also redundant now.
