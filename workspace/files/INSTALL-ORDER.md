# Arise Church — Install Order

Everything current, in the order you asked for. **Header and footer first.**

Every element file goes in the same place: **Velo sidebar → Public → `custom-elements/`**

Every element is placed the same way: **Add (+) → Embed Code → Custom Element → Choose Source → Velo file → pick the file → set Tag Name → stretch FULL WIDTH.**

> **Custom elements look broken in Editor and Preview.** Wix renders them in an iframe there. Only the **published** site is a real test. Every time.

---

# STEP 1 — Header (do this first)

**File:** `arise-header.js` · **Tag:** `arise-header`

1. In the Editor, click the **header** — not a page.
2. Delete what's inside it: old logo, old menu, and **the raw-URL link** (`https://www.arisecenla.church/information-desk-registration`). Keep the header container — Wix won't let you delete it.
3. Set the header container's background to **`#0A0A0C`**.
4. Add the custom element, tag `arise-header`, stretch full width, height **76**.
5. **Publish.** Check on a phone.

**What you get**
- Desktop: logo, wordmark, nav with dropdowns, GIVE button. Current page gets a red underline.
- **Mobile: hamburger → full-height slide-out side menu** with accordion submenus, Give button, service times, phone number.
- Escape closes it, tapping a link closes it, background scroll locks.

**The nav is hardcoded** — edit the `NAV` array at the top of the file. It does **not** read your Wix Pages list. When you rename `/general-4` → `/lead-network`, change it here too.

---

# STEP 2 — Footer

**File:** `arise-footer.js` · **Tag:** `arise-footer`

1. Click the **footer**. Delete everything inside — **including the copyright line**, which currently links to the information-desk page on all 70 pages.
2. Set the footer container's background to **`#0A0A0C`**.
3. Add the element, tag `arise-footer`, stretch full width, height about **420**.
4. **Publish.**

Four columns: brand + social, both campuses with all service times, Explore, Connect. Copyright year is computed, not typed.

---

# STEP 3 — Backend files (before the pages that need them)

Velo sidebar → **Backend**. Filenames must match exactly.

### `http-functions.js` — **required for all forms**
Full code in **`pages/FORMS-SETUP.md`**. Without it, forms render but submissions fail.

### `events.jsw` — **required for real event data**
Full code in **`pages/EVENTS-SETUP.md`**. Without it, Events shows a hardcoded fallback.

### `youtube.jsw` — optional
Full code in **`pages/SERMONS-LIVE-SETUP.md`** plus the series function in **`pages/SERMONS-SERIES-AUTO.md`**. Sermons works without it — you'd lose live detection and auto series.

### `bibleApis.jsw` — **delete this one**
The new Bible page calls the API itself. Remove the file *after* confirming the new page works.

---

# STEP 4 — Pages

One element per page. Keep every page and URL; replace the contents.

| # | Page | URL | File | Tag |
|---|---|---|---|---|
| 1 | Home | `/` | `arise-home.js` | `arise-home` |
| 2 | About | `/about` | `arise-about.js` | `arise-about` |
| 3 | Meet our Leaders | `/leaders` | `arise-leaders.js` | `arise-leaders` |
| 4 | Ministries | `/ministries` | `arise-ministries.js` | `arise-ministries` |
| 5 | Past Sermons | `/sermons` | `arise-sermons.js` | `arise-sermons` |
| 6 | Events | `/events` | `arise-events.js` | `arise-events` |
| 7 | Contact | `/contact` | `arise-contact.js` | `arise-contact` |
| 8 | Bible Search | `/arise-bible` | `arise-bible.js` | `arise-bible` |
| 9 | Serve | `/serve` | `arise-form.js` | `arise-form` + attribute `data-form="serve"` |

**Contact:** delete the old Wix form. Its replacement is built into the element.

**Serve:** in the element's settings add a custom attribute — name `data-form`, value `serve`.

---

# STEP 5 — Page code

Only **two** pages need any. Everything else: leave empty or `$w.onReady(() => {});`

### Past Sermons
From **`pages/SERMONS-SERIES-AUTO.md`** — handles live-stream detection *and* the series band.

### Events
From **`pages/EVENTS-SETUP.md`** — feeds real event data to the element.

**Both assume the element's ID is `#customElement1`.** Right-click the element → View Properties to confirm. Wrong ID fails silently.

### masterPage.js
Replace everything with:
```javascript
$w.onReady(() => {});
```

> ⚠️ **Never put custom element code in page code or masterPage.js.** Page code runs server-side first, where `document` and `HTMLElement` don't exist. That's what caused your errors.

---

# STEP 6 — Campus photos

Upload `photos/campus-pineville@2x.jpg` and `photos/campus-alexandria@2x.jpg` to Media Manager.

Then paste their URLs into the constants near the top of **two** files:

```javascript
const CAMPUS_PINEVILLE  = 'paste-url-here';
const CAMPUS_ALEXANDRIA = 'paste-url-here';
```

In `arise-home.js` and `arise-contact.js`. Until you do, they fall back to existing library images — nothing breaks.

**Also delete** `c3b2d0_8a199ddf4578496ab80d396484b004eb` from Media Manager. That was my bad upload.

---

# STEP 7 — The SEO gap (don't skip)

Custom element text is **not in the server HTML**. Right now visitors see everything and Google sees an empty page.

**On the homepage, add native Wix text elements for:**
- An **H1** — "You Belong Here" or "Arise Church"
- **Both campus addresses** — 501 Ates Road, Pineville, LA 71360 · 5305 North Blvd, Alexandria, LA 71301

They can sit discreetly; they just need to exist as real Wix text. **Fifteen minutes.** This is the single most important item here.

The Church structured data I added already covers your service times and both campuses.

---

# STEP 8 — Housekeeping (any time)

**Rename three pages** — Pages → ⋮ → SEO Basics → URL slug. **Say yes to the 301 redirect.**

| From | To |
|---|---|
| `/general-4` | `/lead-network` |
| `/s-projects-basic` | `/training` |
| `/previous-events-1` | `/past-events` |

Then update the `NAV` array in `arise-header.js` and the links in `arise-home.js` and `arise-events.js`.

**Unpublish four:** `/application-form` · `/schedule` · `/devotional` · `/events-2`

**Uninstall Online Programs** — Dashboard → Apps → Manage Apps. Removes six pages at once.

**Clean `/thank-you-page`** — it still has Wix demo data live: "Product option 1/2/3", "$0.00", and a link to `kamille.info`, a domain unconnected to you.

---

# Quick reference — everything, one table

| File | Goes in | Tag / purpose |
|---|---|---|
| `arise-header.js` | `public/custom-elements/` | `arise-header` — nav + hamburger side menu |
| `arise-footer.js` | `public/custom-elements/` | `arise-footer` |
| `arise-home.js` | `public/custom-elements/` | `arise-home` |
| `arise-about.js` | `public/custom-elements/` | `arise-about` |
| `arise-leaders.js` | `public/custom-elements/` | `arise-leaders` |
| `arise-ministries.js` | `public/custom-elements/` | `arise-ministries` |
| `arise-sermons.js` | `public/custom-elements/` | `arise-sermons` |
| `arise-events.js` | `public/custom-elements/` | `arise-events` |
| `arise-contact.js` | `public/custom-elements/` | `arise-contact` — form built in |
| `arise-bible.js` | `public/custom-elements/` | `arise-bible` — no backend needed |
| `arise-form.js` | `public/custom-elements/` | `arise-form` — Serve / prayer |
| `http-functions.js` | `backend/` | Form submissions |
| `events.jsw` | `backend/` | Real event data |
| `youtube.jsw` | `backend/` | Live stream + series (optional) |
| `bibleApis.jsw` | `backend/` | **Delete** |

**11 elements. 3 backend files. 2 page-code files. 1 to delete.**

---

# CMS collections — already created

| Collection | Contents |
|---|---|
| **Leaders** | 6 rows, with `shortBio` |
| **Ministries** | 8 rows, with `comingSoon` flags |
| **Studies** | 2 rows — add the video URLs |
| **PastEvents** | empty — Events reads Wix Events instead |
| **SiteSettings** | series band override |
| **FormSubmissions** | where form submissions land |

Nothing to set up. They're live on your site.
