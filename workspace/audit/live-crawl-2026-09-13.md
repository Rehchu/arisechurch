# Live crawl of https://www.arisecenla.church — 2026-09-13 (curl with a desktop Chrome UA, no cookies)

## 200 — page exists
/ /about /leaders /contact /ministries /sermons /events /serve /classes /arise-bible /childrens /youth /outreach /lead-network /connect-groups /creative-arts /praise-worship /musicians /production /sound /media-team /content /arise-alexandria /s-projects-basic /events-2 /events-1 /events-1/the-lead-network-2026-camp-meeting-the-outpour /information-desk-registration /thank-you-page /application-form /schedule /job-board /book-online /cart-page

## 301 — redirects
/general-4 → /lead-network
/home → /
/podcast → https://open.spotify.com/show/2IZBmQxgmUOC7xsr8uaAkc?si=739b3ad26ea94769
/tithes-and-offerings → https://tithe.ly/give_new/www/#/tithely/give-one-time/586780
/challenges → /class-detail   (NEW since Aug 23 — Online Programs is still installed; /class-detail is its app page)

## 404 — does not exist
/alexandria /prayer /previous-events-1 /past-events /training /devotional /arise-team /plan-your-visit /campuses

## Homepage server-rendered HTML (863 KB)
- Custom element tags present in the server markup: `<arise-header>`, `<arise-home>`, `<arise-footer>` — the rebuilt header, home and footer elements ARE installed on the live site.
- `<title>Home | arisechurch</title>`; NO `<h1>` in the server HTML; NO `<meta name="description">` found. (The SEO gap described in INSTALL-ORDER.md step 7 is still open.)
- Two JSON-LD blocks: `@type` LocalBusiness (+ PostalAddress) and WebSite. Docs describe it as "Church structured data".
- Sitemap index lists: store-products, store-categories, event-pages, booking-services, member-profiles, portfolio-projects, portfolio-collections, pages sitemaps.

## Changes versus the Aug 23 2026 status recorded in files2/AUDIT-REPORT.md
- /devotional was live on Aug 17 (site-map-complete.md lists it; the handoff lists page id o7wyk) — now 404 (unpublished or deleted).
- /challenges now 301s to /class-detail.
- Everything else matches the Aug 23 table.

## Site properties (Wix API, read-only, 2026-09-13)
- Site name "arisechurch", Premium, custom domain, classic Editor, Velo enabled, last updated Aug 23 2026 16:48.
- Site contact email in Wix settings: info.arisenow@gmail.com (a third email, alongside arisenow.church@gmail.com and arisechurchprayer@gmail.com). Phone + 318-640-1865.
- Installed apps: Promote SEO, Bookings, Chat, Events & Tickets, Forms, Forms & Payments, Groups, **Hotels**, Invoices, Members Area, Multilingual, Online Programs, Pay Links, Portfolio, Stores (catalog V1).
