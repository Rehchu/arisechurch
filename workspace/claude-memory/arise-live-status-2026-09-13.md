---
name: arise-live-status-2026-09-13
description: "Dated snapshot of arisecenla.church live state on 2026-09-13 — URL statuses, installed apps, SEO gaps; later findings in the audit and fix-build memories supersede the code details"
metadata:
  type: project
---

**Superseded in part:** code-level details here were refined by [[arise-audit-2026-09-14]] (e.g. the events backend IS installed; the failing pages fail because of element IDs, not missing page code). Nothing had been installed from the fix build as of 2026-09-15 ([[arise-fix-build-2026-09-14]]).

As of **2026-09-13** (curl crawl of the published site + Wix API, read-only):

- Header, home, footer and every page element are installed, but as pre-fix or older versions. Service Times element is NOT on the homepage. Wix says the site was last updated Aug 23 2026 16:48.
- **200:** /about /leaders /contact /ministries /sermons /events /serve /classes /arise-bible /childrens /youth /outreach /lead-network /connect-groups /creative-arts /praise-worship /musicians /production /sound /media-team /content /arise-alexandria /s-projects-basic /events-2 /events-1 /information-desk-registration /thank-you-page /application-form /schedule /job-board /book-online /cart-page.
- **301:** /general-4 → /lead-network · /home → / · /podcast → Spotify · /tithes-and-offerings → Tithe.ly · /challenges → /class-detail.
- **404:** /alexandria /prayer /previous-events-1 /past-events /training /devotional /plan-your-visit /campuses /arise-team.
- Homepage server HTML has **no `<h1>` and no meta description**; JSON-LD present as LocalBusiness + WebSite.
- Installed apps: Promote SEO, Bookings, Chat, Events & Tickets, Forms, Forms & Payments, Groups, Hotels, Invoices, Members Area, Multilingual, Online Programs, Pay Links, Portfolio, Stores (catalog V1, public but under construction).
- Open from the Aug 23 handoff that are not code: 5 legacy form automations still active; service end times unknown; Studies video links blank; Kristina's bio; native H1 + campus addresses on the homepage; theme colours.

Related: [[arise-church-facts]], [[arise-site-architecture]]
