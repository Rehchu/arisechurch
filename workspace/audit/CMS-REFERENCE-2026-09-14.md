# Arise Church — CMS reference
**Read from the live Wix site (ID `5fff0585-70f7-4075-9289-b6e4e3d38059`) on 14 Sept 2026, read-only.**
This is how the site is edited. Every collection, every field, what reads it, and how to change things.

---

## How the CMS drives the site

```
CMS collection  →  backend function (backend/content.web.js etc.)  →  page code ($w.onReady)  →  custom element
                                                                       sets a data-* attribute     reads it and renders
```

A custom element cannot read the CMS itself. The page's Velo code fetches the rows, `JSON.stringify`s them, and sets
them as a `data-*` attribute on the element (`data-leaders`, `data-ministries`, `data-content` …). If a page has no
page code, its element shows the copy that is built into the file. **That is why some pages ignore the CMS today**
(six Creative Arts department pages, Serve, Children's, Youth, Outreach, Lead Network, Sermons — see the audit).

Forms go the other way: the element POSTs to `/_functions/ariseForm`, the backend writes a row into **Form Submissions**.

Permissions on every content collection: **read = Anyone, insert/update/remove = Admin**. The two collections holding
people's details (Form Submissions, ArchivedFormSubmissions) are **Admin-only for everything, including read**. Correct.

---

## The 12 custom collections

### Leaders — `Leaders` · 7 rows · read by `/leaders` via `getLeaders()` → `data-leaders`
| Field | Type | Notes |
|---|---|---|
| name | Text | display field |
| role | Text | e.g. "Apostle · Pastor & Prophet" |
| shortBio | Text | **this is what the page shows** (backend prefers shortBio over bio) |
| bio | Text | long version, kept for reference |
| photo | Image | 3:4 portrait |
| featured | Boolean | ticked = the wide card at the top (only the first featured row is shown) |
| sortOrder | Number | 1 = first |

Rows (sortOrder): 1 Bryant & Vanessa Sanders (featured) · 2 Norman and Margie Youngblood · 3 Chad and Tabitha Kerik · 4 Herbert and Erica Perry · 5 Will Robertson · 6 Ethan Mayes · 16 Kristina Robinson (Creative Arts Director · Minister, added 23 Aug).
Six photos are stored as https URLs (seeded by API); Kristina's is a Wix image upload. Both work live.

### Ministries — `Ministries` · 9 rows · read by `/ministries` via `getMinistries()` → `data-ministries`
| Field | Type | Notes |
|---|---|---|
| title | Text | display field |
| category | Text | small line under the title, e.g. "Birth – 5th Grade" |
| image | Image | 4:5 tile |
| pageLink | Text | `/childrens` etc. Empty when coming soon |
| comingSoon | Boolean | ticked = "Coming Soon" badge, no link |
| sortOrder | Number | |

Rows: 1 Lead Network (/lead-network) · 2 Children's Ministry (/childrens) · 3 Youth Ministry (/youth) · 4 Outreach (/outreach) · **5 Connect Groups (/connect-groups) and 5 Thrive For Young Adults (coming soon) share sortOrder 5** · 6 Mvmt 6:14 (coming soon) · 7 Arise Creative Arts (/creative-arts) · 8 In Edge/ X Edge (coming soon).
The Home page's ministries strip is hardcoded to the first four; it does not read this collection.

### Page Content — `PageContent` · 45 rows · read by most pages via `getPageContent()` → `data-content`
The copy-and-times collection. Each row is one editable thing.

| Field | Type | Notes |
|---|---|---|
| contentKey | Text | the key the code looks for (`data-ck="…"` for text, `data-ci="…"` for images) |
| page | Text | which page it belongs to (filter on this in the CMS) |
| label | Text | human description |
| text | Text | the copy shown. **Plain text only** — a stray `<` breaks the page today |
| imageUrl | Text | the image URL in use today |
| image | Image | optional upload; if set it wins over imageUrl |
| where | Text | where on the page it appears |

**All 45 keys, by page** (✓ = an element reads it today; ✗ = nothing reads it yet)

| Key | ✓ | Current value / note |
|---|---|---|
| site.times.sunday.main | ✓ | "Sunday 10:30 AM" → should be `10:30 AM` (the word Sunday is doubled on Contact/Home) |
| site.times.sunday.second | ✓ | "Sunday 10:00 AM" → should be `10:00 AM` (confirmed 10:00 by Pastor Sheron) |
| site.times.main.glorynight | ✓ | Monday 7:00 PM |
| site.times.main.midweek | ✓ | Wednesday 7:00 PM |
| site.times.main.prayer | ✓ | Mon-Thu 5:00 AM |
| site.times.second.prayer | ✓ | Wednesday 6:00 PM (label in code: "Pre-Service Prayer") |
| site.times.second.midweek | ✓ | Wednesday 6:45 PM (label in code: "Midweek Service" — Pastor Sheron calls it Bible Study) |
| site.campus.main | ✓ | 501 Ates Road, Pineville, LA 71360 |
| site.campus.second | ✓ | 5305 North Blvd, Alexandria, LA 71301 |
| site.email | ✓ footer only | arisenow.church@gmail.com (footer never receives the map today) |
| site.tagline | header only | #YouBelongHere (header never receives the map today) |
| home.hero.kicker | ✓ | Arise Church - Pineville, LA |
| home.hero.body | ✓ | Welcome to our multicultural… |
| home.who.h2 | ✓ | Who We Are |
| home.who.body | ✓ | We can't wait to grow together… |
| home.campus.h2 | ✓ | Two Campuses |
| home.campus.main.photo | ✓ | image (works) |
| home.campus.second.photo | ✓ | image (works) |
| home.visit.h2 | ✓ | What To Expect |
| home.visit.parking | ✓ | Park without rushing… |
| home.visit.whattowear | ✓ | Come as you are… |
| home.visit.whentoarrive | ✓ | Arrive a little early… |
| childrens.welcome.image | ✓ | image (works) |
| childrens.kids.photo | ✓ | **image URL returns 403** — use the `1f9fa2_…` file |
| childrens.superkid.logo | ✓ | **image URL returns 403** — use the `1f9fa2_…` file |
| youth.banner.image | ✓ | image (works) |
| outreach.supplies.image | ✓ | **image URL returns 403** — use the `1f9fa2_…` file |
| leadnetwork.austin.photo | ✓ | **image URL returns 403** — use the `1f9fa2_…` file |
| leadnetwork.calloway.photo | ✓ | **image URL returns 403** — use the `1f9fa2_…` file |
| serve.hero.body | ✓ | Join our congregation in making a difference… |
| connect.hero.body | ✓ | Where real people build real faith… |
| connect.season.name | ✓ | Fall Connect Groups |
| connect.season.starts | ✓ | the week of September 14 |
| connect.season.ends | ✓ | the week of November 16 |
| connect.season.hostby | ✓ | September 2 (past) |
| creatives.hero.body | ✓ | Every song, every screen, every sound… |
| classes.hero.body | ✓ | Go deeper at your own pace… |
| alexandria.hero.kicker | ✓ | Arise Church Alexandria |
| alexandria.hero.body | ✓ | Our second campus on North Boulevard… |
| alexandria.pastor.name | ✓ | Pastor Sheron Turner |
| alexandria.pastor.role | ✓ | Lead Pastor, Arise Church Alexandria |
| alexandria.pastor.bio1 | ✓ | her words, keep verbatim |
| alexandria.pastor.bio2 | ✓ | her words, keep verbatim |
| alexandria.pastor.photo | ✓ | image (works) |
| alexandria.address | ✓ | 5305 North Blvd, Alexandria, LA 71301 |

Not in the CMS but read by the code: nothing — every key the elements look for exists. Not read by any code: `site.times.second.other` is in the old CSV only, not in the live CMS.

### Serve Positions — `ServePositions` · 7 rows · meant for `/serve` via `getServePositions()` → `data-positions` (page code not installed; page shows 5 built-in roles)
Fields: title (Text) · description (Text) · team (Text) · image (Image, unused by the element) · urgent (Boolean = "Most Needed" badge) · active (Boolean) · sortOrder (Number).
Rows: 1 Children's Department (urgent) · 2 Outreach (urgent) · 3 Media / Social Media · 4 Edge / X Edge · 5 Maintenance · 6 Praise & Worship · 7 Production & Sound.

### Connect Groups — `ConnectGroups` · 0 rows · read by `/connect-groups` via `getConnectGroups()` → `data-groups`
Fields: title · hostName · day · time · location · dates · description (Text) · flyer (Image) · audience (Text) · isFull (Boolean = "Full" badge, button disabled) · active (Boolean, untick to hide) · sortOrder (Number).
Empty, so the page shows "Groups are forming". Add a row and it appears.

### Creative Departments — `CreativeDepartments` · 6 rows · read by `/creative-arts` and the six department pages via `getCreatives()` → `data-depts`
Fields: name · slug · tagline · description (Text) · groupPhoto (Image) · pageLink (Text) · active (Boolean) · sortOrder (Number).
Rows: 1 Praise & Worship (/praise-worship) · 2 Musicians (/musicians) · 3 Production (/production) · 4 Sound (/sound) · 5 Media (/media-team) · 6 Social Media & Content (/content). All have taglines; description and groupPhoto are empty.
**The `slug` must equal the `data-dept` attribute set on that page's element, and the `name` must equal each member's `department` text exactly** (case and spacing) or the member is not shown.

### Creative Members — `CreativeMembers` · 14 rows · same backend → `data-members`
Fields: name · department (Text — must match a department `name`) · role · bio (Text) · photo (Image) · isLeader (Boolean, not used by the element yet) · active (Boolean) · sortOrder (Number).
Praise & Worship: Kristina Robinson (Praise Team Leader, isLeader), Ethan Mayes, Linda Lemon, Yolanda Foreman, Brandis Mayes, Cailey Norman, Margie Youngblood · Musicians: Nick Robinson, Geremiah Branch · Production: Darek Foreman, Ronnie Odom, Brandon Sizemore · Sound: Ty Sanders · Media: Bradly Dyer. No photos or bios yet (monogram cards show). CREATIVES-SETUP.md listed Thelma as a fifteenth member; she is not in the collection.

### Home Settings — `HomeSettings` · 1 row (`churchCulture`) · read by `/` via `getHomeSettings()` → `data-culture`
Fields: settingKey · cultureVideo (Video — **uploaded: Arise_This_Is_Our_Culture.mp4**) · posterImage (Image, set) · heading ("This Is Arise") · kicker ("Church Culture") · active (Boolean, **ticked**).
The video is live on the homepage. heading/kicker are in the CMS but the element still prints its built-in text (audit item).

### Site Settings — `SiteSettings` · 1 row (`sermonSeries`) · meant for `/sermons` page code → `data-series-*` (page code not installed)
Fields: settingKey · seriesActive (ticked) · seriesTitle ("The Kingdom") · seriesLine ("Culture of Giving") · seriesLink (YouTube /streams) · seriesButton ("Watch the Full Message").
The live page shows the same words only because they are also the file's built-in fallback.

### Studies — `Studies` · 2 rows · read by nothing yet (Training page never rebuilt; Lead Network lists the same two studies from its own file)
Fields: title · description · speaker (Text) · image (Image) · videoUrl (Text, **both blank**) · sortOrder.
Rows: Guarding the Anointing: Unmasking the Spirit of Delilah (Apostle Bryant Sanders) · Leading with Purpose (Pastors Derrick and Pam Calloway).

### Form Submissions — `FormSubmissions` · 1 row · written by `/_functions/ariseForm` · Admin-only
Fields: formType (contact/serve/prayer/connect-host/connect-join) · name · email · phone · subject · message · position · handled (Boolean).
One contact submission, **unhandled**. Tick `handled` when answered.

### ArchivedFormSubmissions — collection ID `Import1` · 50 rows · Admin-only · read by nothing
The 2019–2025 submissions rescued from the old Wix Forms. Fields: title · source · submitted (Date) · firstName · lastName · email · phone (**Number** — formatting and leading zeros lost) · address · firstTime · sessions · inquiries · originalId.

### What the docs describe that does not exist
- `PastEvents` — never created (the Events page reads Wix Events instead).
- `Import2` — deleted, as PAGECONTENT-SETUP says.
- A "Church Culture" Portfolio project — gone; the video lives in Home Settings now.

---

## Wix app collections that matter

| Collection | Rows | What it is | Used by |
|---|---|---|---|
| Portfolio/Projects | 5 | Children's Ministry `621e6fdb…` · Youth Ministry `c2be296e…` · Outreach `78e5e5f9…` · Lead Network `885f9ceb…` · Exciting News `b2697282…`. All five still wear the same Wix placeholder cover | the gallery page code (GALLERY-SETUP.md) — **not installed on any page yet** |
| Portfolio/ProjectItems | 1 | one video, "Arise Hub", attached to no project | galleries → empty until photos are added to the projects |
| Portfolio/Collections | 1 | "Church Collection" (/photos) | — |
| Events/Events | 20 | 1 scheduled (The Outpour, 30 Oct–1 Nov 2026), 14 ended, 5 canceled (four of them duplicates of "Apostle Joan Hunter Power To Heal") | `/events` page code (installed, working) |
| Events/Categories | 8 | | |
| Bookings/Services | 3 | "Pathway to Discipleship-In person Class" (class) · "The Pathway to Discipleship=Online Class" (class) · "2022 Woman's Conference" (course, still present) | /book-online app pages |
| Stores/Products | 2 | #ImpactTioga T-Shirt $25 · Arise Church Yard Sign $10 (store publicly reachable) | store app pages |
| Locations/Locations | 2 | **"Ates Road" and "Ates Rd" — two copies of the Pineville campus, no Alexandria** | Wix business info / Bookings |
| Members/PublicData | 82 | site member accounts | Members Area |
| Forms/contact032, Forms/stripsContact042 | 8 + 8 | legacy Wix Forms submissions (the other five Forms/* are empty) | nothing — candidates for archive and delete |
| WixForms/* (3) | 0 | newer Wix Forms app collections, empty | nothing |
| @hanas535/events-calendar/events | 16 | **a third-party Events Calendar app still holding its demo rows** (Yoga by the River, Farmers Market, Pasta-Making Workshop…) | nothing on the rebuilt pages; likely the old /schedule page |
| Marketing/Coupons | 0 | | |

---

## How to change things (today)

| I want to… | Do this |
|---|---|
| Change a service time | Page Content → the `site.times.*` row → `text`. Home, Contact and the Alexandria page pick it up on next load, no publish. (Header menu, footer strip and the Service Times dropdown do **not** — they are hardcoded; audit item.) |
| Rename "Midweek Service" to "Bible Study" | Not possible from the CMS yet — the label is in the code. Audit proposes label rows. |
| Fix the doubled "Sunday" | Page Content → `site.times.sunday.main` = `10:30 AM`, `site.times.sunday.second` = `10:00 AM` |
| Add or reorder a leader | Leaders → new row (name, role, shortBio, photo, sortOrder) |
| Launch a ministry page | Ministries → untick comingSoon, set pageLink |
| Add a Connect Group | Connect Groups → new row (active ticked). Mark full with isFull |
| Add a serve role | Serve Positions → new row (needs the Serve page code installed to show) |
| Add a Creative Arts member | Creative Members → new row; `department` must match the department `name` exactly |
| Put photos on a ministry page | Portfolio → the project (Children's Ministry, Youth Ministry, Outreach, Lead Network) → add items. Title becomes alt text, description the caption. Needs the gallery page code installed. |
| Put news in the homepage hero | Portfolio → Exciting News → add an item (needs Home page code that sets `data-news`; none is documented yet) |
| Change the culture video | Home Settings → cultureVideo. Untick active to show the photo collage instead |
| Set the sermon series band | Site Settings → sermonSeries (needs the Sermons page code installed to take effect) |
| Answer a form message | Form Submissions → tick handled |
| Change the Connect season | Page Content → the four `connect.season.*` rows (the tab label is hardcoded; audit item) |

## Data-quality notes found while reading
1. Five Page Content image URLs use `c3b2d0_` media IDs that return 403; the working files are `1f9fa2_` (the old CSV has them).
2. `site.times.sunday.*` rows carry the word "Sunday" that the markup also prints.
3. `connect.season.hostby` = September 2 (past); the whole season block needs new dates.
4. Ministries: Connect Groups and Thrive share sortOrder 5.
5. Creative Members: Thelma missing (docs list 15, CMS has 14). No photos or bios yet.
6. Studies: both `videoUrl` blank.
7. Locations app: duplicate Pineville entry, Alexandria absent.
8. Third-party events-calendar app still holds 16 demo rows.
9. ArchivedFormSubmissions `phone` is a Number field.
10. Legacy Wix Forms collections still hold 16 old submissions (contact032, stripsContact042).
