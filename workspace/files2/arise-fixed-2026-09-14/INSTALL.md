# Arise Church — installing the 14 Sept 2026 fixes in Wix

Everything in this folder was tested in the local sample before it came to you (see "What was tested" at the end).
Do the steps in order. **Publish once, at step 5, and import the new CMS rows only after that publish.**
Custom elements and page code do not run properly in the Editor or Preview, so check the published site.

> **15 Sept 2026: the site is now connected to GitHub** (repo `Rehchu/arisechurch`). Use **"Installing through GitHub"**
> below instead of steps 2 to 4. While the site is connected, the Editor's code panel is read-only, so pasting no longer works.

The live code as it was before these changes is saved in `files2/live-elements/src/`, `files2/live-backend/`
and `files2/live-page-code/`. Pasting those back undoes everything.

| Folder | What it holds |
|---|---|
| `custom-elements/` | 21 element files (bug fixes + CMS hooks on every text block and image) |
| `page-code/` | 22 page-code files, one per page, plus `masterPage.js` |
| `backend/` | the backend files; four change |
| `cms/` | `PageContent-new-rows.csv` to import in step 6, `PageContent-all-keys.md` listing every editable spot by page |

---

## Step 1 — CMS fixes (no publish needed)

**1a. Five broken images — DONE on 15 Sept 2026.** Claude updated these rows through the Wix connector with
Bradly's go-ahead and read them back to confirm; nothing else in the rows changed. The old values are saved in
`audit/cms-backups/PageContent-image-rows-before-2026-09-15.json`. Skip this step. For the record: the rows pointed
at image addresses starting `c3b2d0_`, which return "forbidden"; the same photos exist under `1f9fa2_`, and each
new address below was checked and loads.

| contentKey | Page | New imageUrl |
|---|---|---|
| childrens.kids.photo | Children's Ministry | https://static.wixstatic.com/media/1f9fa2_a5448e514cc14ea08cb657e4f1a9cec4~mv2.jpg |
| childrens.superkid.logo | Children's Ministry | https://static.wixstatic.com/media/1f9fa2_8c21ef4200d44594bcec41ac5680c2c0~mv2.jpg |
| outreach.supplies.image | Outreach | https://static.wixstatic.com/media/1f9fa2_ef28ad94288a4068ac9c2974b4d4d545~mv2.jpg |
| leadnetwork.austin.photo | Lead Network | https://static.wixstatic.com/media/1f9fa2_0118a2141a564a909b5c493b2f55211d~mv2.png |
| leadnetwork.calloway.photo | Lead Network | https://static.wixstatic.com/media/1f9fa2_1331547403e94f94a08912f08d45d1de~mv2.png |

**1b. Two copy decisions: both settled on 15 Sept 2026.**

| contentKey | Result |
|---|---|
| alexandria.pastor.bio2 | **No change.** Kept exactly as Pastor Sheron wrote it, including "Apostle Bryant and Prophet Vanessa Sanders". Both paragraphs of her bio were checked for typos and grammar and none were found. The code's built-in copy of the bio now matches it word for word |
| connect.season.hostby | **DONE.** Host sign-up deadline extended to Sunday, September 20; the row now reads "September 20". Backup: `audit/cms-backups/PageContent-connect-hostby-before-2026-09-15.json`. The season start ("the week of September 14") was left as it is |

## Installing through GitHub (use this instead of steps 2 to 4)

Already done on 15 Sept, on Bradly's computer:

- The repo is cloned to `D:projectsArise Church Websitearisechurch`. It was cloned over HTTPS because this computer has no SSH key, so the `git clone git@github.com:...` command in Wix's setup window fails here.
- The Wix CLI is installed (`wix` 1.1.246). `npm install` fails on the `wix-test-ports` entry in `package.json`, which only installs from Wix's private registry. Use `npm install --ignore-scripts`, which has already been run.
- Before any change, the repo matched the live code exactly, except `arise-bible.js`, which was an empty file.
- The fixed files are copied in and `backend/events.jsw` is deleted. That is 45 changed files: 19 elements including `arise-bible.js`, 4 backend files and 22 page files. Committed as `77f2fad`, pushed to `main`, checked on a preview (every checklist item passed on 26 pages), and **published by Bradly on 15 Sept 2026**. The tests were re-run on the final files: 19/19 and 44/44.

Still to do, in this order:

1. **Log in** (Bradly, once): in a terminal, in the `arisechurch` folder, run `wix login` and approve in the browser.
2. **Preview before anything goes live:** `wix preview` → choose **Local code**. It prints a preview link built from these files, running on the real CMS. Go through the step 5 checklist on that link. This changes neither the live site nor the repo.
3. **Push:** commit and push to `main`. The code then appears in the Editor, and the GitHub Integration panel shows the commit; there can be a short delay.
4. **Publish** (Bradly's call): click Publish in the Editor, or run `wix publish` → **Latest commit from origin/main**. Do not publish "Local code": that leaves the live site and the repo out of sync.
5. In the Editor, open Bible Search, click the custom element → Choose Source, and confirm it points at `arise-bible.js`.
6. Then do step 6 below (import the new CMS rows).

From now on, change code by editing files in `arisechurch/src` and pushing. Do not delete the repo, and do not remove the Velo GitHub app's access to it: either one can break the connection for good.

## Step 2 — Backend (Velo sidebar → Backend) — only if the site is disconnected from GitHub

| File | Action |
|---|---|
| `backend/content.web.js` | Replace the whole file with `backend/content.web.js` from this folder |
| `backend/youtube.jsw` | Replace the whole file with `backend/youtube.jsw` from this folder |
| `backend/events.web.js` | Replace the whole file with `backend/events.web.js` from this folder |
| `backend/classes.web.js` | Replace the whole file with `backend/classes.web.js` from this folder |
| `backend/events.jsw` | **Delete** — nothing uses it (the Events page imports `events.web.js`) |
| `http-functions.js`, `gallery.web.js` | Leave as they are — identical to what is live |

What the changed backend files fix:
- `content.web.js` now reads every Page Content row. The old file stopped at 500 rows. Step 6 brings the
  collection to 571 rows, so on the old file some rows, possibly the service times, would silently disappear.
- `youtube.jsw` reads the newest Shorts for the Sermons page, asks YouTube for the desktop page (the old file got
  the mobile page, so automatic series detection never worked), and no longer treats an upcoming scheduled stream
  as live. Without that last fix the Sermons page would say "Live Now" over a "waiting to start" screen.
- `events.web.js` sorts events by real date; `classes.web.js` shows a price of 0 as Free.

## Step 3 — Custom elements (Velo sidebar → Public → custom-elements)

**First, re-create the Bible file you deleted:** New file → `arise-bible.js` → paste
`custom-elements/arise-bible.js` from this folder. Then open the Bible Search page in the Editor, click the
custom element → Choose Source and make sure it points at `arise-bible.js`.

Then, for each file below, open the file of the same name in Velo, select all, and paste the new file over it:

arise-about.js · arise-alexandria.js · arise-childrens.js · arise-classes.js · arise-connect.js ·
arise-contact.js · arise-creatives.js · arise-events.js · arise-footer.js · arise-header.js · arise-home.js ·
arise-leaders.js · arise-leadnetwork.js · arise-ministries.js · arise-outreach.js · arise-sermons.js ·
arise-serve.js · arise-youth.js

Optional, not installed today: `arise-service-times-final.js` (the Service Times dropdown for the homepage
hero) and `arise-form.js` (reusable form). Both are fixed, CMS-hooked and tested, but placing them is a design
decision.

## Step 4 — Page code

Open each page in the Editor, open its code panel, select all, and paste the file of the same name from
`page-code/`. For the site-wide file use Code panel → Site Code → `masterPage.js`.

Home · Arise Church Alexandria · Connect Groups · Creative Arts · Praise and Worship · Musicians · Production ·
Sound · Media · Social Media and Content · Classes · Past Sermons · Ministries · Events · Contact ·
Sign Up to Serve! · Meet our Leaders · Children's Ministry · Youth Ministry · Outreach · Lead Network ·
masterPage.js

Pages that need no code: About, Bible Search, Give, Job Board, Information Desk Registration, Podcast, Training.
(About and Bible Search still get their CMS text, from `masterPage.js`.)

Every page file finds its element even if the element ID is not the one written at the top, so you do not need
to look up IDs. Each file writes a line in the browser console when data arrives, and a warning if it cannot
find the element.

## Step 5 — Publish and check

Publish, then open each page on the live site. On a computer, press F12 → Console to see the log lines.

- [ ] Home — no stray code text under "Who We Are"; campus rows read "Sunday Service 10:30 AM" (no doubled day); Alexandria shows Prayer 6:00 PM and Bible Study 6:45 PM
- [ ] Header menu on a phone — Sunday times, Glory Night, phone number; footer bottom line shows both campuses
- [ ] Contact — "Sunday 10:30 AM" not "Sunday Sunday"; Directions open in a new tab
- [ ] Praise & Worship, Musicians, Production, Sound, Media, Social Media & Content — department name as the heading, department tabs underneath, team cards
- [ ] Serve — 7 positions (Praise & Worship and Production & Sound included)
- [ ] Sermons — series band "The Kingdom · Culture of Giving"; the clips section shows the newest Shorts from YouTube (the console says "8 newest Shorts"); the badge says "Latest Service" unless a stream is actually playing
- [ ] Events — "Previous Events" button no longer goes to a 404
- [ ] Bible Search — search "John 3:16" returns the verse
- [ ] Children's, Youth, Outreach, Lead Network — page renders, photos show
- [ ] Connect Groups — only "Host a Group" shows; a host sign-up submits (a row appears in CMS → Form Submissions)

## Step 6 — After publishing: add the new editable rows

**DONE on 15 Sept 2026.** Claude added all 526 rows through the Wix connector after the publish, with Bradly's go-ahead. The collection now has 571 rows with no duplicates, and every row matches the CSV exactly (checked page by page). The live pages read the same before and after, and the site console shows "Site content: 571 keys". The steps below are kept for reference only.

CMS → Page Content → More actions → Import → choose `cms/PageContent-new-rows.csv` → **add as new items** (do not
replace existing items). The file has **526 rows**: one for every heading, paragraph, button label, card label and
photo that did not have a CMS row yet. Each row already holds the text the page shows today, so importing changes
nothing you can see. From then on, editing a row's `text`, or `imageUrl` for a photo, changes that spot on the
site. `cms/PageContent-all-keys.md` lists all 578 keys by page, with where each one appears. The CSV's empty
`image` column can be skipped when Wix asks how to map columns; the collection uses `imageUrl`.

Do this only after step 5, so the new `content.web.js` that reads every row is already live.

Then check: change one Page Content row's text, and see it change on the page after a refresh.

Notes for editors:
- `text` is shown as written. You may use `<br>` for a line break. Do not type a lone `<`.
- To change a photo, paste the Wix media address of the new image into `imageUrl`.
- Service times keep the day in the value ("Sunday 10:30 AM"). Rows whose label already names the day drop the
  repeated day automatically.
- Seven row labels are shared by several pages and differ between them (for example "Sunday Service" on Home and
  "Sunday" on Contact). They are **not** in the CSV, because one row sets that label on every page at once. Add
  one only if you want the same wording everywhere. They are listed at the end of `PageContent-all-keys.md`.
- The footer year updates itself and has no row. The Sermons Shorts come from YouTube and have no rows.

## 15 Sept 2026 update: faster loading (published, commit `0d8dee0`)

Built in `files2/arise-fixed-2026-09-14` (the code before this change is saved in
`audit/working-snapshots-2026-09-15/before-speed-fixes/`). Each change was reviewed separately, tested, checked on
a preview, and published after Bradly's go-ahead.

- **Photos:** every Wix photo is now requested at the size it is shown, and Wix picks the best format for the
  browser. For example, a 4.6 MB leader portrait arrives as about 50 KB. Photos below the first screen load when
  you scroll to them. Nothing looks different, and replacing a photo in the CMS works the same way.
- **Page text:** the site code (`masterPage.js`) is now the only place that loads Page Content; the page files no
  longer load it a second time. Other data on each page (leaders, Shorts, events, and so on) is requested at the
  same time instead of one after another.

Measured with the browser cache off, averaged over two visits per page: old code on its preview vs the live site
after publishing.

| Page (desktop / phone) | Page loaded, old → new | Main content drawn, old → new | Downloaded, old → new |
|---|---|---|---|
| Home | 1.8 s → 1.4 s / 3.5 s → 1.4 s | 2.5 s → 2.0 s / 5.2 s → 1.9 s | 9.4 MB → 1.9 MB |
| Meet our Leaders | 1.3 s → 0.3 s / 2.9 s → 0.4 s | 1.8 s → 0.9 s / 4.0 s → 0.7 s | 26.6 MB → 1.4 MB |
| Children's Ministry | 1.6 s → 0.3 s / 1.3 s → 0.3 s | 2.1 s → 0.8 s / 1.7 s → 0.8 s | 6.6 MB → 1.4 MB |
| Lead Network | 2.9 s → 0.3 s / 1.7 s → 0.3 s | 5.1 s → 0.7 s / 2.1 s → 0.8 s | 5.3–9.7 MB → 1.3 MB |
| Sermons | 1.3 s → 0.3 s / 1.7 s → 0.3 s | 1.7 s → 0.7 s / 2.1 s → 0.7 s | 1.3 MB → 1.2 MB |

After publishing, all 26 pages were checked at desktop and phone width. There were no broken photos and no errors
from our code, the page text is identical to before, and every checklist item still passes.

When publishing from the command line, Wix warned that the Editor has design changes newer than the design version
saved in the repo. To make sure the live site carries the newest design, click **Publish** once in the Editor. It
publishes the newest design together with the code from GitHub.

## Small wording changes you may notice

These places now show the CMS value instead of text that was typed into the code, so wording matches the rest
of the site:

- Bible Search, bottom box: "Sunday 10:30 AM in Pineville, Sunday 10:00 AM in Alexandria. Glory Nights Monday 7:00 PM."
- Sermons, Glory Nights box: "Monday 7:00 PM" (was "Mondays 7:00 PM")
- Contact, main campus rows: the Glory Night, Wednesday and Corporate Prayer times come from the CMS
- Alexandria and Home: the two Wednesday rows are labelled "Prayer" and "Bible Study"
- Sermons, clips section: tall Short-shaped cards with the Short's title, in place of the eight hand-picked clips with descriptions. The section heading "Clips & Announcements" can be renamed in the CMS (`sermons.clips.heading`)

## Settled on 14–15 Sept

- **Pastor Vanessa Sanders is Pastor and Prophet.** The Leaders entry ("Apostle · Pastor & Prophet") is correct as it is.
- **Pastor Sheron Turner is not a prophet**, and nothing on the site calls her one.
- **Sermons shows the newest Shorts automatically.** Upload a Short to the Arise Church channel and it appears on the
  Sermons page within about 10 minutes. The built-in list, used only if YouTube cannot be reached, is the 8 newest
  Shorts as of 14 Sept.
- **Connect Groups is host registration only.** The "Join a Group" tab, the join form and the "Join This Group"
  buttons stay hidden. When groups are scheduled, open joining with one CMS row: add `connect.join.open` with the
  text `yes`, and publish.
- There is no Thelma; the 14 Creative Members are complete.
- **Connect Groups host deadline extended to Sunday, September 20** (CMS row updated 15 Sept).
- **Pastor Sheron's bio stays exactly as she wrote it.** It was checked for typos and grammar and nothing needed fixing.

## Still open (not changed in the code)

- "Tioga, Louisiana" in Pastor Sheron's second paragraph (the main campus address is Pineville)
- Portfolio projects for the galleries and the homepage news panel are empty; Online Programs has no published class

## What was tested

| Test | Result |
|---|---|
| Backend files under node with Wix mocked: Page Content reads every row past 1000; image conversion; event sorting and buttons; forms; and the YouTube readers against real channel pages saved on 14 Sept (newest Shorts, series detection, an upcoming stream not counted as live, a live stream counted) (`node sample-site/tests/backend.test.mjs`) | 19 of 19 pass |
| Every page-code file, right element ID and wrong element ID, plus masterPage and Sermons with and without Shorts (`node sample-site/tests/page-code.test.mjs`) | 44 of 44 pass |
| Every sample page at desktop width: no script errors, no blank elements, Wix remove-and-re-add leaves the page unchanged, every CMS hook shows a changed CMS value, importing the CSV leaves the page unchanged, nothing worse than today's code (overflow, missing alt text, broken images, contrast, tap targets, heading count) | 35 of 35 pages pass |
| The same checks at phone width (390 px) | 20 of 20 pages pass |
| Connect Groups: default, with groups listed, joining opened from the CMS, deadline cleared | all 4 behave as described above |
| Sermons Shorts: 8 cards from YouTube, 4 columns on desktop and 2 on a phone, links open the Short, all 8 thumbnails load, built-in list shows when YouTube is unreachable | pass |
| All 21 element files parse; no syntax older iPhones reject; every observed attribute kept | pass |

Run the sample yourself with `node sample-site/server.js` and open http://localhost:4173/_sample.
