# ARISE CHURCH — CODE AUDIT & RENDER TEST REPORT
**Aug 23, 2026 · all 21 current element files · fixed set: `arise-fixed-2026-08-23.zip`**

---

## How it was tested

**Static pass** — every file: syntax (`node --check`), every validation regex extracted
and *executed* against real sample input, every internal link cross-checked against the
canonical slug map, every service time/name/phone cross-checked against the known facts,
listener-cleanup analysis, escaping analysis, and a scan for attribute-text corruption.

**Render pass** — every element loaded in real Chromium at **390px (phone), 768px
(tablet), 1366px (desktop)**, in **normal AND forced dark mode** (your Facebook in-app
browser), with interactions exercised: hamburger menu opened, About popup opened, a
Connect group's "Join" tapped, Service Times opened, the home lightbox opened.
**132 renders**, each automatically checked for JavaScript errors, horizontal overflow,
WCAG contrast on every text node, tap-target sizes, duplicate IDs, and missing alt text
— then key screenshots inspected by eye.

## Verdict

The codebase is **genuinely good**. Zero JavaScript errors in 132 renders. Zero
horizontal overflow at any width. Forced dark mode renders **identically** to light on
every page — the protection you needed for the Facebook browser holds everywhere. The
escaping discipline, focus management, and reduced-motion support are consistent.

But it was **not ship-ready**: one file was corrupted, one link 404'd, and a "TBA" was
about to go live on your homepage. All fixed. **13 files changed, 8 untouched.**

---

## FIXED — ship blockers

### 1. Corrupted headings printing raw code on the homepage  `arise-home.js`
Three `<h2` tag openers were missing — eaten, most likely by a find/replace at some
point. The browser rendered the leftovers as **literal visible text**:

> `data-ck="home.who.h2">Who We Are`

…above every one of these sections: **Who We Are**, **One Church, Two Campuses**,
**What To Expect**. The headings also lost their Anton styling and their H2 semantics.
This is almost certainly one of the mobile glitches you saw. Restored all three,
confirmed on screenshots.

### 2. Alexandria campus link — verified against the live site  `arise-home.js`
**Correction, with thanks to Bradly:** my first pass "fixed" this link to `/alexandria`
because ALEXANDRIA-SETUP.md says that's the page URL — but the live site says
otherwise: **`/arise-alexandria` is the real page (200, in the sitemap) and
`/alexandria` 404s.** The link is restored to `/arise-alexandria`, now verified
against the published site rather than the doc. The setup doc is what's wrong.

### 3. "TBA" shipping on the homepage and Contact  `arise-home.js` `arise-contact.js`
The Alexandria card hardcoded **Pre-Service Prayer: TBA** and **Midweek Service: TBA**
on two pages — while the Alexandria page itself was built on the principle *"no TBA
sitting there for months."* Both rows are now **hidden by default** and appear
automatically the moment you put a time into CMS → Page Content
(`site.times.second.prayer` / `site.times.second.midweek`). Verified both ways in a
live render — including a CSS override that was needed because `display:flex` was
beating the `hidden` attribute (caught on the screenshot, not by the scanner).

---

## FIXED — bugs and robustness

### 4. Brand red failing contrast in Service Times  `arise-service-times-final.js`
"Sunday Service" and "Monday Nights" used **#D6222D on near-black — 3.89:1**, below
the 4.5:1 minimum. This is the *exact* failure your brand system created `#DB3F48`
for. Switched both rules; re-tested at 4.5+. The dashes and buttons keep brand red,
as designed.

### 5. Carousel dots were 9×9px  `arise-home.js`
Practically untappable on a phone. Now a **26×26px hit area** with the same 9px
visual dot — the design is pixel-identical, the target is nearly 9× larger.

### 6. Menu/lightbox die if Wix re-attaches an element  `arise-home.js` `arise-header.js`
Both elements append a panel to `document.body` and remove it on disconnect — but if
Wix detaches and re-attaches the element, the old guard skipped rebuilding, leaving a
hamburger that opens nothing and gallery tiles that open nothing. Both now restore
their body-mounted panels and key handlers on re-attach.

### 7. Unescaped lightbox markup  `arise-home.js`
Thumbnails escaped captions/URLs; the full-size lightbox didn't. An alt like
`Youth "Edge" Night` would have broken the markup. Escaped, matching the rest.

### 8. Listener hygiene  `arise-home.js`
The lightbox's document-level keyboard handler now detaches with the element, and the
carousel's hover pause/resume no longer stacks a new pair of listeners on every data
refresh.

### 9. Insecure social links  `arise-footer.js` `arise-contact.js`
Instagram and X linked as `http://`. Now `https://`.

### 10. Maps links behaved inconsistently  `arise-home.js`
Home opened Google Maps **in the same tab** (navigating people off your site); the
footer opened a new tab. Standardized: all three home maps links now
`target="_blank" rel="noopener"`, matching the footer.

### 11. Required select said "No preference," then errored "Required"  `arise-connect.js`
The host form's required venue dropdown offered *No preference* as its default, then
rejected it. Required selects now read **"Choose…"**; optional ones keep
*No preference* (correct there).

### 12. Mobile autofill  `arise-connect.js` `arise-serve.js` `arise-form.js`
Inputs had `autocomplete="on"` and no `name` — phones couldn't offer name/email/phone
autofill. All form controls now carry `name` plus real tokens (`given-name`,
`family-name`, `email`, `tel`). On a phone this turns the Connect signup into
three taps. (Contact already had proper tokens — untouched.)

### 13. Small tap targets  `arise-home.js` `arise-contact.js` `arise-footer.js` `arise-header.js`
"Get Directions" links were 19px tall; footer links ~28px; the menu's phone number
20px. Padding added (visually invisible): everything now ≥26px, clearing the WCAG
2.1 AA minimum of 24px; footer social icons are 44px on mobile.

### 14. Dead code out  `arise-home.js` `arise-connect.js` `arise-footer.js`
Home's leftover footer CSS (the footer markup was already removed — the footer file's
install note claiming otherwise was stale and is now corrected), and Connect's join
pre-fill writing to a `#connect-join-position` field that doesn't exist.

### 15. The four gallery pages carried home's lightbox bugs, byte-for-byte
`arise-childrens.js` `arise-youth.js` `arise-outreach.js` `arise-leadnetwork.js`
Their lightbox code is an exact copy of home's original — so all three defects came
along: unescaped media markup, a document keyboard handler that never detaches, and a
gallery that goes dead if Wix re-attaches the element. The same fix set (7 edits each)
was applied to all four, then torture-tested on Youth: a hostile alt text
(`Youth "Edge" <Night>`) round-trips intact, and after a forced detach/re-attach the
lightbox still opens and arrow-key navigation still works. Zero errors.

### 16. About's Escape handler leaked  `arise-about.js`
The popups' Escape-to-close listener sat on `document` with no cleanup at all — it
survived the element's removal and would stack another copy on every re-attach. Now
stored, removed on disconnect, and re-armed on re-attach.

### 17. Dead "Previous Events" button  `arise-events.js`
The archive button pointed at `/previous-events-1` — verified live: that page is
**gone** (404, absent from the sitemap, no redirect). Every tap was a dead end. The
button is removed with a comment marking where to re-add it if a past-events page
returns; the element's own inline past-events section is untouched.

---

## LIVE SITE VERIFICATION (crawled Aug 23)

Every slug the code references was checked against the published site, not the docs:

| Live and correct | Status |
|---|---|
| /about /leaders /contact /ministries /sermons /events /serve /classes /arise-bible /childrens /youth /outreach | 200 |
| **/connect-groups /creative-arts /lead-network** + all six dept pages (/musicians /praise-worship /sound /production /media-team /content) | **200 — already created** |
| **/arise-alexandria** | 200 (page exists; its element isn't added yet) |
| /general-4 | 301 → /lead-network — **that rename is done** |
| /podcast → Spotify · /tithes-and-offerings → Tithe.ly | 301s working |

| Gone or pending | Status |
|---|---|
| /alexandria | 404 — the setup doc's slug, never used |
| /previous-events-1 | 404, deleted — button removed (fix #17) |
| /past-events · /training | 404 — those renames not done; /s-projects-basic still live |
| /prayer | 404 — doesn't exist yet (decision item 3) |
| /events-2 | 200 but hidden from sitemap — still on the cleanup list |
| /arise-home-test | 301 → homepage — old test page resolved |

**Element install state:** the header and footer elements are live **sitewide**, and
every rebuilt page already has its element installed — home, about, contact, leaders,
ministries, sermons, events, serve, connect, classes, creatives (hub *and* dept
pages), childrens, youth, outreach, leadnetwork. Only `/arise-alexandria` is waiting
on its element.

**Live form check (safe, nothing submitted):** on the live /connect-groups, a valid
email passes validation while empty required fields flag correctly — **the live
element already runs the fixed email regex.** The page renders fully: hero, both
tabs, "Groups are forming" empty state, the Sept 2 card. No page errors.

---

## FLAGGED — your call, not changed

1. **"This Is Arise"** — the homepage collage heading uses bare *Arise*, which your
   own rule prohibits ("Arise Church, never Arise"). If it's a deliberate tagline,
   keep it; if not, say the word and it becomes "This Is Arise Church."
2. **Host form requires five fields** (first name, last name, phone, email, venue)
   with a Sept 2 deadline. My recommendation: make **phone optional** — email is the
   follow-up channel anyway, and every removed required field measurably raises
   volunteer completion.
3. **The prayer pipeline is built but nothing uses it.** `arise-form.js` has a
   complete prayer form, the backend allows `prayer`, the automation branches on it —
   yet Home and the footer both link `mailto:arisechurchprayer@gmail.com`. Mailto
   requires a working mail app (many phones don't have one configured) and bypasses
   your CMS + automation entirely. Recommend: a `/prayer` page with
   `arise-form` + `data-form="prayer"`, and point both links there.
4. **Header logo URL** points at Media asset `c3b2d0_e3158…`. Confirm that's the
   *transparent* logo upload; if it's the old white-boxed raster, upload
   `arise-logo-white@4x.png` and swap the `LOGO` constant.
5. **Past events archive** — `/previous-events-1` was deleted from the site, so I
   removed the dead button (fix #17). When you decide where past events live (a new
   /past-events page, or just the inline section the Events element already has),
   say the word and the button comes back pointing there. `/training` is the one
   remaining rename (`/s-projects-basic` is still live under the template slug).
6. **Alexandria's bio wording** (per your setup doc, unresolved): "Arise Church in
   *Tioga*" vs Pineville everywhere else, and "*Prophet* Vanessa Sanders" vs
   *Pastor* on Leaders. Sanders' call — worth settling before the page goes live.

---

## Per-file status

| File | Result |
|---|---|
| arise-home.js | **13 fixes** — headings, link, TBA, dots, lightbox, listeners, maps, CSS |
| arise-contact.js | 5 fixes — TBA rows + reveal, https, tap targets |
| arise-connect.js | 3 fixes — autofill, required-select copy, dead code |
| arise-header.js | 2 fixes — re-mount guard, phone tap target |
| arise-footer.js | 4 fixes — https ×2, mobile taps, stale note |
| arise-serve.js | 1 fix — autofill names/tokens |
| arise-form.js | 1 fix — autocomplete tokens |
| arise-service-times-final.js | 2 fixes — contrast reds |
| arise-childrens / youth / outreach / leadnetwork.js | **7 fixes each** — lightbox escaping, keyboard cleanup, re-mount survival |
| arise-about.js | 3 fixes — Escape handler stored, cleaned up, re-armed |
| arise-events.js | 1 fix — dead archive button removed (live-verified 404) |
| leaders, ministries, sermons, bible, creatives, classes, alexandria | **Clean — unchanged** |

## Final test matrix

| Check | Result |
|---|---|
| Syntax, all 21 files | Pass |
| JavaScript errors across 132 renders | **0** |
| Horizontal overflow (390/768/1366) | **0** |
| WCAG contrast failures | **0** (was 2 classes of failure) |
| Forced dark mode vs light | **Identical** on every page |
| Duplicate IDs / missing alt | 0 / 0 |
| Validation regexes, executed | All correct (Connect email fix confirmed present) |
| Tap targets | All ≥26px (AA minimum is 24px) |
| Interactions (menu, popup, tabs, join-prefill, lightbox, service times) | All working |
| Bible Search against the **live** bible-api.com | 16 translations load; John 3:16 and multi-verse Psalm 23 both render; Enter key works |
| arise-form variants (contact / serve / prayer) | All three render correct fields + submit |
| Events with no page data | Full fallback renders: Outpour featured card, date badge, RSVP, archive link |
| Creatives hub + department mode + unknown dept | Renders; unknown slug shows quiet placeholder (CMS supplies real names) |
| Composite header + home + footer, mobile | Menu overlays content + locks scroll; lightbox covers header; 0 overflow |
| Gallery lightbox after forced detach/re-attach | Opens, arrow-keys navigate, hostile alt text stays escaped |

**Use the files from `arise-fixed-2026-08-23.zip` from here on** — your originals in
`files.zip` now differ in 8 files. Same install steps as before; nothing about
placement or tags changed.
