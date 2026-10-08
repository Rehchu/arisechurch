# Pages Checklist

Everything you need to create, keep, or remove. Tick as you go.

---

## Pages that already exist — add the element

Keep the page and its URL. Delete the old content, add one Custom Element, stretch it full width.

| Page | URL | File | Tag name |
|---|---|---|---|
| Home | `/` | `arise-home.js` | `arise-home` |
| About | `/about` | `arise-about.js` | `arise-about` |
| Meet our Leaders | `/leaders` | `arise-leaders.js` | `arise-leaders` |
| Ministries | `/ministries` | `arise-ministries.js` | `arise-ministries` |
| Past Sermons | `/sermons` | `arise-sermons.js` | `arise-sermons` |
| Events | `/events` | `arise-events.js` | `arise-events` |
| Contact | `/contact` | `arise-contact.js` | `arise-contact` |
| Bible Search | `/arise-bible` | `arise-bible.js` | `arise-bible` |

**Eight pages. Eight files. Nothing new to create.**

> **Contact:** keep your native Wix form. Place it under the "Send Us a Message" heading inside the element. A custom element can't submit to Wix Forms.

---

## Pages to CREATE — two

| Page | URL | Why |
|---|---|---|
| **Plan Your Visit** | `/plan-your-visit` | Optional. The Home hero currently scrolls to What To Expect, which covers parking, attire and arrival. Only build this if you want it as its own page. |
| **Our Campuses** | `/campuses` | Optional. Both campuses already appear on Home and Contact. Build it if you want a dedicated page. |

**Neither is required.** Both subjects are already covered. Create them only if you want the menu entries.

---

## Pages to RENAME — three

Pages → ⋮ → SEO Basics → URL slug. **Wix offers a 301 redirect — say yes every time.**

| From | To |
|---|---|
| `/general-4` | `/lead-network` |
| `/s-projects-basic` | `/training` |
| `/previous-events-1` | `/past-events` |

> After renaming, update `arise-home.js` (Lead Network tile) and `arise-events.js` (Previous Events link). Tell me when they're done and I'll send corrected files.

---

## Pages to UNPUBLISH — four

`/application-form` · `/schedule` · `/devotional` · `/events-2`

Empty, duplicated, or abandoned.

---

## Uninstall Online Programs

Dashboard → Apps → Manage Apps → **Online Programs → Uninstall.**

Removes six pages at once: `/challenges`, `/challenge-page`, `/challenge-payment`, `/challenge-thanks`, `/participant-page`, `/my-programs`.

---

## Pages to KEEP as they are

| Page | Why |
|---|---|
| `/serve` | Wix form, works. Restyle later. |
| `/childrens` `/youth` `/outreach` | Small pages, low traffic. Elements later if you want. |
| `/general-4` (Lead Network) | Rename, then leave |
| `/s-projects-basic` (Training) | Rename, then leave |
| `/previous-events-1` | Rename, then leave |
| `/tithes-and-offerings` | Your Give short link |
| `/podcast` | Already redirects to Spotify correctly |
| `/job-board` | Unpublish until you're hiring |
| `/information-desk-registration` | Keep password-protected. **Remove it from the header and footer** — it's linked 70 times sitewide. |

---

## Fix while you're in there

**`/thank-you-page`** still has Wix demo data live — "Product option 1/2/3", "$0.00", and an outbound link to `kamille.info`, a domain unconnected to you. Delete those elements.

**Homepage needs native Wix text** — an H1 and both campus addresses, as real Wix text elements. Custom element content isn't in the server HTML, so Google currently sees an empty homepage. **This is the most important item on this list.**

---

## Order I'd do it in

1. **Native text on the homepage** — 15 minutes, closes the SEO gap
2. **The eight elements** — one page per sitting
3. **Contact form positioning**
4. Three renames, four unpublishes, uninstall Online Programs
5. Clean the thank-you page, fix the header/footer link
6. Decide on Plan Your Visit and Campuses

---

## Backend files

| File | For | Required? |
|---|---|---|
| `backend/youtube.jsw` | Sermons — live detection + series | Optional. Sermons works without it. |
| `backend/events.jsw` | Events — real event data | **Yes**, for correct images and buttons |
| `backend/bibleApis.jsw` | Bible Search | **Delete once `arise-bible` is live** — the element calls the API itself |

Page code needed on: **Sermons** and **Events** only. Every other page needs none.
