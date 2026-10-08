# Arise Church website — full audit
**arisecenla.church · audited 13–14 Sept 2026 · nothing changed, nothing written to Wix**

Companion files: `audit/findings-2026-09-14.json` (all 183 findings with evidence and fixes),
`audit/live-crawl-2026-09-13.md` (live slug statuses), `sample-site/` (local render, see its README).

---

## The one thing to know

**The 13 element files fixed on 23 August were never pasted into Wix.** Every version marker on the
published site is the pre-fix version:

| Fix claimed 23 Aug | Live today | Page |
|---|---|---|
| #1 three `<h2` openers restored | literal `data-ck="home.who.h2">Who We Are` printed above three sections | / |
| #3 TBA rows hidden via `data-ckrow` | no `data-ckrow` on the page | /contact |
| #9 https socials | `http://instagram.com/…`, `http://twitter.com/…` | footer |
| #10 maps links new tab | all three still `target="_top"` | / |
| #11 required selects "Choose…" | "No preference" | /connect-groups |
| #12 input `name` + autocomplete tokens | no `name`, `autocomplete="on"` | /connect-groups, /serve |
| #17 dead Previous Events button removed | present, links to `/previous-events-1` (404) | /events |

The fixed files in `files2/arise-fixed-2026-08-23/` are correct on disk.

## Broken on the live site now (verified in a browser)

1. **Homepage prints raw code** above Who We Are, One Church Two Campuses, What To Expect. Fix: paste the fixed `arise-home.js`.
2. **Events "Previous Events" button → 404.** Fix: paste the fixed `arise-events.js`. (The events backend IS installed live: the page receives `data-events` with nine real events.)
3. **Contact reads "Sunday Sunday 10:30 AM" / "Sunday Sunday 10:00 AM"**; Home reads "Sunday Service Sunday 10:30 AM". The CMS rows `site.times.sunday.main/second` contain the word "Sunday" that the markup also prints as the label. Fix: change the two CMS texts to `10:30 AM` and `10:00 AM`.
4. **The six Creative Arts department pages** (/praise-worship, /musicians, /production, /sound, /media-team, /content) show the raw slug as the H1, "Team coming soon", and an empty "The Other Teams" section — the department tabs only render when the page code sends `data-depts`/`data-members`. The hub works; the six pages get no data. Fix: paste CREATIVES-SETUP.md §2 page code on each page and check the element ID.
5. **The Service Times dropdown is not on the live homepage** (handoff says it is). Fix: place the element (FINAL-BUILD-PLAN.md §10).
6. **Serve shows the five built-in positions**, not the seven CMS rows; no `data-positions` arrives. Fix: SERVE-SETUP.md §2 page code.
7. **Children's, Youth, Outreach, Lead Network** receive no `data-content`/`data-photos` (galleries empty). See latent item 12 before adding that code.
8. **Connect Groups** still shows "Host sign-up closes September 2" as the urgent card and default tab; season "starts the week of September 14". Both `SEASON` in `arise-connect.js` and CMS `connect.season.*` hold the old dates.
9. **Footer socials are `http://`** (pre-fix footer).
10. **Homepage still has no `<h1>` and no meta description** in server HTML; JSON-LD is `LocalBusiness`. INSTALL-ORDER step 7 still open.
11. **One unhandled contact submission** sits in FormSubmissions. The pipeline works: the live `/_functions/ariseForm` accepts contact, serve, prayer, connect-host, connect-join and rejects unknown types (probed with bodies that fail validation, nothing stored). The Wix Chat widget floats over every page.

## Will break the moment the page code goes in (verified in the sample with the real CMS rows)

12. **Five Page Content image rows 403 on the CDN** — `childrens.kids.photo`, `childrens.superkid.logo`, `outreach.supplies.image`, `leadnetwork.austin.photo`, `leadnetwork.calloway.photo` use a `c3b2d0_` media ID; the working files are `1f9fa2_`. Fix: edit the five `imageUrl` values in CMS → Page Content.
13. **Outreach and Lead Network:** `this.fillGallery(); this.applyContent();` sit inside a `.map()` callback after `return` (arise-outreach.js:251, arise-leadnetwork.js:322) — unreachable on first build; only matters when attributes precede upgrade (Wix re-mount).
14. **Class links** would go to `/classes/{slug}`; the live Online Programs page is `/class-detail`.
15. **Sermons series band** hides only on `data-series-active="false"`; the live page gets no attributes, so the hardcoded "The Kingdom · Culture of Giving" shows (matches today).
16. **Connect flyers / ministry images** depend on the backend converting Wix image fields; the docs' getters pass them raw (the live backend evidently converts — leader portraits load).
17. **Service Times panel dies on a Wix re-mount** (`disconnectedCallback` removes the panel, the `_built` guard never rebuilds it).

## What the CMS can and cannot change today (added 14 Sept after Bradly's note)

Bradly's expectation: every editable fact comes from the CMS. Today that holds for the **times** but not for the words around them, and not for four elements at all.

| Thing | State | Where |
|---|---|---|
| Alexandria times (Sunday, Wed prayer, Wed Bible study) on Home, Contact, Alexandria page | **CMS-linked** (`site.times.second.*`), values already right in the CMS | — |
| Row labels "Pre-Service Prayer" / "Midweek Service" | **Hardcoded.** Pastor Sheron calls them Prayer and Bible Study; cannot be renamed from the CMS | arise-home.js:462–463, arise-contact.js:306–307, arise-alexandria.js:217–218 |
| Service Times dropdown ("10:30 AM · Both campuses") | **Entirely hardcoded**, no `data-content` support; wrong for Alexandria | arise-service-times-final.js:78–80 |
| Header mobile menu times and phone | **Hardcoded**; panel sits outside the element so hooks cannot reach it; header never receives `data-content` (masterPage.js is empty) | arise-header.js:254–259 |
| Footer columns / footer bottom strip | Columns hooked but footer never receives `data-content`; bottom strip hardcoded | arise-footer.js:121–122, 153 |
| "Sunday 10:30 AM in Pineville, 10:00 AM in Alexandria" sentences | **Hardcoded**, no hooks | about:318, leaders:331, ministries:298, events:260, bible:230, childrens:285, youth:247 |
| Connect Groups tab label "Sign up by September 2" | Hardcoded (the card is hooked) | arise-connect.js:388 |
| Culture video heading/kicker | CMS fields exist in Home Settings; element ignores them | arise-home.js:429 |

To make all of it CMS-driven: add label rows to Page Content (e.g. `site.times.second.prayer.label`) with `data-ck` hooks; give `arise-service-times` a `data-content` attribute and bind its rows; add a small `masterPage.js` that fetches Page Content once and sets `data-content` on the header and footer (and scope the header's panel); add hooks to the seven CTA sentences and the footer strip. One Page Content map then feeds every element.

## Decisions — two resolved on 14 Sept

18. **Resolved: Alexandria Sunday is 10:00 AM** (Pastor Sheron via Bradly). Also Wednesday **6:00 PM Prayer** and **6:45 PM Bible Study**. The CMS rows are right; DESIGN-BRIEF, FINAL-BUILD-PLAN, HANDOFF §9 and the Service Times dropdown text ("10:30 AM · Both campuses") are wrong and need correcting.
19. **Connect season dates** — new dates or a late-comer message.
20. **"This Is Arise"** — the only bare "Arise" left.
21. **Resolved: the Alexandria bio stands as written** — it is Pastor Sheron's own text (matches the CMS word for word, "Prophet Vanessa Sanders" and "Tioga" included).
22. **Thelma** is not in CreativeMembers (docs say 15, CMS has 14).
23. **Prayer failure fallback email** in `arise-form.js` is the general inbox.
24. **Dated Sermons clips** (22 Aug baby shower, "Upcoming…") are hardcoded.
25. **PastEvents collection does not exist**; is an archive page still wanted?

## Documents that will mislead the next paste

- INSTALL-ORDER step 4: Serve as `arise-form.js`; "11 elements". Use SERVE-SETUP (arise-serve.js); there are 21.
- ALL-PAGE-CODE / VELO-CMS-GUIDE: repeater-era page code that never sets `data-*`; superseded by the *-SETUP blocks.
- PAGES-CHECKLIST: "keep the native Wix form" — the Contact element has its own form (and `arise-contact.js` lines 16–19 still say the opposite).
- ALEXANDRIA-SETUP: slug `/alexandria` (404; live is `/arise-alexandria`); second `getPageContent` with a different return shape (string | {text,imageUrl}) than every element expects ({text,image}).
- PAGECONTENT-SETUP: calls `imgUrl()` that no doc defines (the live backend has it).
- CLASSES-SETUP: uses `auth`/`webMethod`/`Permissions` without imports; `gallery.web.js` vs handoff's `classes.web.js`; hardcodes `#customElement1` (Classes is `customElement5`); links to `/classes/{slug}`.
- EVENTS-SETUP vs handoff §5b: `events.jsw` vs `events.web.js`; sorts by the formatted date string; handoff page code overwrites the fallback with an empty list on backend error.
- FORMS-SETUP: `triggeredEmails.emailContact(…, emailAddress)` — second arg is a contact ID; never sends. Handoff §5a is the working shape.
- CONNECT-SETUP §4 adds `ALLOWED` to a file that gates on `ROUTES` (docs only; live endpoint already allows connect types).
- HANDOFF §7: "paste the video ID into the constant at the top of arise-home.js" — no such constant; the culture video is already uploaded and active in CMS → Home Settings.
- GALLERY-SETUP: nothing ever sets `data-news`; Lead Network listed as `/general-4`.
- AUDIT-REPORT test matrix mentions an "archive link" that fix #17 removed.
- `files/` holds 13 older copies of the element files plus five legacy files registering the same tag names (`arise-pages.js`, `arise-hero.js`, `arise-events-sermons.js`, `arise-service-times.js`, `-v2.js`). `ArchivedFormSubmissions.csv` (50 people's contact details) is inside the shared zip.

## Code review of the 21 canonical files (static; live impact none today)

- **Escaping:** all 18 elements with `applyContent()` write CMS text via `innerHTML` unescaped and build a CSS selector from the CMS key; Leaders, Ministries, Sermons (series title), Home and the galleries (video IDs/poster) concatenate CMS values raw. Admin-only writes, so robustness rather than security.
- **Accessibility:** About popups, home and gallery lightboxes, mobile menu lack dialog role / focus trap / focus return (menu returns focus); form status never announced, no `aria-required`/`aria-invalid` (contact, serve, connect, form); Connect tabs half-ARIA; Events "Sold Out" is a link with `pointer-events:none`; placeholders at 3.0:1.
- **Brand:** Anton below 18px in contact labels (13), creatives badge/switcher/h3 (13/14/16), events h3 and labels (15/13), header wordmark/panel title (17/15), about popup labels (16).
- **Dead CMS hooks:** header/footer never receive `data-content` (`site.tagline` dead; the mobile panel is outside the element anyway); About, Leaders, Events, Ministries, Bible observe `data-content` with no hooks; Home ignores CMS `heading`/`kicker`; `isLeader` unused; footer bottom strip hardcodes times.
- **Lifecycle:** service-times re-mount (17); home re-attach does not restart the news timer/video observer; news timer not cleared on empty list; header re-attach with the menu open; Bible overlapping requests.
- **Dead weight:** duplicated culture-video CSS in home; Events constants/CSS inside sermons; ~100 lines of unused shared CSS in leaders/ministries; unused `_setOpen` in header; stale file headers ("PAST SERMONS", `events.jsw`, "delete the Bible page code").

One finder claim was refuted on re-check: "sermons iframe reloads every 60 s" — the documented page code only re-sets the attribute when the video ID changes.

## What checked out (rendered, 27 routes × 1366 and 390, plus forced dark)

0 JavaScript errors · 0 horizontal overflow · 0 contrast failures on rendered text · 0 tap targets under 24px · 0 duplicate IDs · 0 images without alt · one H1 per page · dark mode identical to light · every internal link in the 21 files resolves to a live 200/301 · menu, dropdown, popups, lightbox, tabs, join pre-fill all work · contact form validates and saves against the mock backend · Bible Search returns John 3:16 from the live API · live Events images and Leaders portraits all load.

## Suggested order, when you say go

1. CMS edits (five image URLs, two Sunday rows, four season rows) — no publish needed.
2. Paste the 13 fixed files and publish (optionally with the small code fixes above — say which).
3. Page code on the pages that have none (6 department pages, Serve, Children's, Youth, Outreach, Lead Network, Sermons), checking the element ID on each.
4. Place the Service Times element on Home, after settling the Alexandria time.
5. Native H1 + campus addresses on the homepage.
6. Docs cleanup; move the archived-submissions CSV out of the shared zip.
