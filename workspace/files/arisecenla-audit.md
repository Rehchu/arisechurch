# AriseCenla.church — Full Site Audit
**Date:** August 17, 2026
**Site:** arisecenla.church (Wix, Editor type, Premium, Velo enabled)
**Scope:** Design, navigation, content, accessibility, SEO, technical
**Changes made:** **None.** Everything below is read-only observation. Nothing was edited.

---

## 0. Headline

The design is solid — you're right about that. The problems aren't visual, they're **structural**. Three things stand out:

1. **The site is far bigger than the menu admits.** 51 pages exist. 9 are in the menu. Entire working features — a store, a giving page, discipleship classes, an online program — are live and unreachable.
2. **Service times exist (custom-coded dropdown) but aren't machine-visible.** *(Corrected — see §3.3.)* They do not appear in the server-rendered HTML of any page I fetched, which is what search engines and directory scrapers read first.
3. **1,099 accessibility findings**, including 2 critical ones, and 12 pages that couldn't even be analyzed.

---

## 1. NAVIGATION & INFORMATION ARCHITECTURE

*(Your flagged priority — most of the value is here.)*

### 1.1 The menu shows 7 items; the site has 51 pages

Desktop menu at full width: Home · About (→ Leaders) · Ministries · Events (→ Previous Events) · Past Sermons · Bible Search · Contact (→ Sign Up to Serve) · Log In · GIVE ONLINE

**Correction:** my first pass called "More..." a menu item burying content. It isn't — it's Wix's responsive overflow container, which is present in the DOM and only surfaces when the window is too narrow to fit all items. At full desktop width it doesn't appear. It *will* appear on smaller laptops and tablets, so it still matters at those widths, but it isn't the cause of the problem.

The actual problem is simpler: **7 top-level destinations for 51 pages.** Everything below is unreachable from navigation regardless of overflow behavior.

### 1.2 Live features with zero path from the menu

Found via the site crawl — all of these are published and being served:

| Feature | Evidence | In menu? |
|---|---|---|
| **Wix Stores** — **UNDER CONSTRUCTION but publicly live** | `/product-page/impacttioga-t-shirt`, `/product-page/arise-church-yard-sign`, categories `/apparel`, `/yard-decor`, `/all-products`, `/cart-page` | No — see warning below |
| **`/tithes-and-offerings`** — *intentional redirect to Tithe.ly, used for livestreams and social* | Working as designed | Correctly not in menu |
| **Wix Bookings — classes** | "Pathway to Discipleship – In-Person Class", "Pathway to Discipleship – Online Class" | No |
| **Wix Online Programs** | `/challenges`, `/challenge-page/101af5b6…` | No |
| **Devotional page** | `/devotional` | No |
| **Application form** | `/application-form` | No |
| **Outreach** | `/outreach` (only reachable via one ministry card) | No |
| **Serve signup** | `/serve` (buried under Contact) | Barely |

**Additional pages found in the site router** (second pass, reading the page manifest directly): **Beliefs · Promises · Podcast · Job Board · Training · Classes · Give · Unlimited · Visitor Page · Schedule** (`/schedule` — live, returns 200) · **Devotional** (`/devotional` — live).

A **Podcast** page and a **Job Board** are notable. So are **Beliefs** and **Promises** — the About page has "We Believe" and "We Promise" as bare text with no links, which suggests those pages were built and never wired up.

You have a **store with merch** that no visitor can find from the menu — see the warning immediately below.

### 1.2b ⚠️ The under-construction store is publicly live and crawlable

Confirmed: the store is **under construction** — but its pages are **published and reachable right now**. Wix's scanner crawled them, which means Google can index them too.

Currently live: the Impact Tioga T-Shirt and Arise Church Yard Sign product pages, the Apparel / Yard Decor / All Products category pages, and the cart page.

**Two risks:**
1. Someone finds a product page through search, tries to buy, and hits an unfinished checkout. Bad first impression, and it's a *payment* flow.
2. Google indexes half-built commerce pages under your domain, which is hard to walk back later.

**Recommended (pending your approval):** unpublish the store pages, or set them to `noindex` and remove them from the sitemap until launch. Wix can hide pages without deleting any of your work.

**Correction:** I previously flagged `/tithes-and-offerings` as an orphaned duplicate giving path. **That was wrong** — it's a deliberate redirect to Tithe.ly used as a clean link target for livestreams and social posts. Working as intended. *(One small thing worth deciding: whether that redirect page should be `noindex`, since thin redirect pages in the search index add no value.)*

### 1.3 Leftover template junk that's live and crawlable

- **Wix Portfolio demo content** — `/portfolio-collections/my-portfolio` and `/project-title-6`. These are untouched Wix sample pages.
- `/s-projects-basic` — another default template page.
- `/thank-you-page`, `/payment-request-page` — utility pages, probably fine, but confirm they're not indexable.

### 1.4 Stale content still published

- **"2022 Woman's Conference"** is still a live bookable service.
- **14+ past event pages** live: Kidz Kamp, Father Figure Brunch, Men's Retreat (×2), The Path (×2), Unshakeable Men's Conference, Women of Impact, Women Rising, Women's Retreat (×3 + waitlist), Thrive Lake Day, "flow-1".
- Only **one upcoming event** on `/events`: The Lead Network 2026 Camp Meeting (Fri, Oct 30).
- `/arise-team` is **still in Google's index** but returns **404**. Google's cached copy shows a 2018 footer.

### 1.5 Header oddity

Above the menu on every page there's a link whose **visible text is a raw URL**:
`https://www.arisecenla.church/information-desk-registration`

That same page is also what the **footer copyright links to** on every page. And the page itself **renders no content** — no header, no footer, no body. It's a dead end that appears twice on every page of the site.

### 1.6 Label and grouping problems

- **"Past Sermons"** — the page also carries current announcements (Phase Two launch, baby shower). "Watch" or "Messages" fits better.
- **"Bible Search"** is a tool sitting at the same level as About and Ministries. Belongs under a Resources group.
- **"Sign Up to Serve!"** is nested under Contact. Serving is a next step, not a contact method.
- **"Meet our Leaders"** under About is correct.
- Site name renders as lowercase **"arisechurch"** in every page title, but the brand everywhere else is **"Arise Church"**.

### 1.7 Proposed structure — for discussion only

```
I'M NEW      → Plan Your Visit · What to Expect · Kids · Our Beliefs
ABOUT        → Our Story · Leaders · Locations
MINISTRIES   → (the 8 you have)
MEDIA        → Messages · Devotional · Bible Tool
EVENTS       → Upcoming · Past
GET INVOLVED → Serve · Classes · Programs · Outreach
[ GIVE ]     (button)
[ SHOP ]     (button, if keeping the store)
```

Six items plus two buttons — no overflow, everything reachable in one or two clicks.

---

## 2. ACCESSIBILITY — hard numbers

Ran Wix's official full-site accessibility scan.

| Metric | Result |
|---|---|
| Pages discovered | 51 |
| Pages scanned | 39 |
| **Pages that failed to analyze** | **12** |
| Total findings | **1,099** |
| Critical | **2** |
| Serious | 1,097 |
| Pages affected | 38 of 39 |

**By category:** screen reader 1,080 · alternative text 1,069 · color contrast 19 · heading structure 9 · keyboard 2

### 2.1 The two criticals

Both are `inaccessible-component` — a component that can't provide keyboard or assistive-tech behavior at all (WCAG 4.1.2, Level A).
- **Homepage** (element `comp-jqh1ozf6`)
- **Contact page**

### 2.2 Biggest concentration

**`/sermons` alone accounts for 1,031 of the 1,099 findings.** These are `media-alternatives` — video and audio with no captions, transcripts, or text alternative. 337 distinct media items.

### 2.3 Homepage heading structure

The homepage is flagged for **missing a main heading or skipping heading levels**. "WHO WE ARE" renders as an H2 with no H1 above it. This hurts screen readers *and* SEO.

### 2.4 The 12 pages that couldn't be scanned

`/ministries` · `/serve` · `/outreach` · `/previous-events-1` · `/tithes-and-offerings` · `/book-online` · `/booking-form` · `/cart-page` · `/payment-request-page` · `/s-projects-basic` · 2 booking service pages

Failure code: `ANALYSIS_FAILED`. This usually means the page is heavy or slow enough that the renderer timed out. **Worth treating as a performance red flag**, not just a scanner quirk — `/ministries` is one of your main pages.

---

## 3. CONTENT ERRORS

### 3.1 Leaders page — needs a full copy pass

**The meta description in Google right now literally reads:**
> "Recommended Meta Description for the Meet Our Leaders page: 'Meet the passionate pastors, ministers, and leaders of Arise Church…'"

The AI prompt label got pasted in with the answer. This is live in search results.

**Name mismatches:**
- Heading "Chad and Tabitha **Kerik**" → body says "Chad and Tabitha **Ker**"
- Heading "Will **Robinson**" → body says "Will **Robertson**"

**Truncated sentences (words missing mid-phrase):**
- "a source of ___ and strength for our community"
- "are truly remarkable ___ of our church community"
- "as one of our esteemed ___, leads with passion"
- "contributes to our community in ___ and impactful ways"
- "a committed member of ___ praise and worship team"
- "shine through in all ___ efforts"

**Tone inconsistency:** Bryant Sanders' bio is written in **second person** ("We are truly honored to have **you** lead us… **your** years of dedicated ministry"). Every other bio is third person. It reads like an appreciation card dropped into a staff directory.

**Layout:** Ethan Mayes has **no photo**. Vanessa Sanders' photo is 344×400; everyone else is 251×344.

**Titles:** Vanessa is called both "Pastor" and "Prophet" in one sentence. Bryant is "Apostle." Norman is "elder." No consistent title convention, and the top leader appears second in the list.

**Image filenames = alt text:** `image0 (2).png`, `image2.png`, `image3.png`, `image5.png`, `image6.png`, `image7.png`. Straight off a phone.

### 3.2 Ministries page

**Four of eight "Learn More" buttons are dead** — plain text, no link:
- Thrive For Young Adults
- Mvmt 6:14
- Worship Team
- In Edge / X Edge

Working: Lead Network (→ `/general-4`), Children's, Youth, Outreach.

**"Lead Network" points to `/general-4`** — a default Wix slug. Should be `/lead-network`.

**Image filenames leaking into URLs and alt text:**
- `ChatGPT Image May 14, 2025, 04_36_03 PM.png`
- `515499984_1033890948907446_8820358226701242830_n_edited_edited.jpg` (Facebook download)
- `Untitled design.png`
- `Pasted_Image_t1qdjcue.png`
- `Movment.PNG` — misspelled

### 3.3 Homepage

- Two missing periods: "join our vibrant community Here" and "…each person brings"
- No address, no "plan your visit," no next step for a first-time visitor.
- Prayer Request is a **`mailto:` link**. These fail silently on most phones, and you keep no record of the request.

**CORRECTION — service times.** My first pass said service times appear nowhere. **That was wrong.** They're in a custom-coded "Service Times ▾" dropdown, **top-right of the homepage hero, above the fold.** My method (reading server-rendered HTML) can't see client-side Velo output, so I reported an absence I hadn't established.

**Placement is good.** Above the fold, top-right is a conventional spot for utility info, and "Service Times" is the exact phrase visitors scan for. Three fixable things:

**1. Measured contrast failure.** Sampling the actual pixels of the button:

| Measurement | Ratio | Verdict |
|---|---|---|
| White text vs. average panel color | **3.91:1** | Passes AA for large bold text (3.0) · **fails AA for normal text (4.5)** |
| White text vs. lightest 10% of panel | **2.18:1** | **Fails AA at any text size** |

The panel is translucent, so its color is whatever the hero image is behind it. Across that strip of the hero, background luminance ranges from 0.004 to 1.000 — **near the full possible range.** As the hero image changes, or on a different slide of that carousel, the text can land on near-white and become nearly unreadable. This is almost certainly among the 19 `color-contrast` findings in §2.

*Fix:* give the panel a solid or near-solid fill (85–100% opacity) instead of relying on the image behind it. That alone takes it well past 4.5:1 and makes it stable regardless of the background.

**2. It's collapsed by default.** The single most-searched fact about a church costs a click. Service times are 2–4 short lines — there's room to show them expanded. Keep the control for a full schedule, but let the core times render immediately.

**3. It's not in the server-rendered HTML.** The complete server-rendered text of the homepage is: nav → "WHO WE ARE" → welcome paragraph → prayer quote → footer. **No time strings anywhere.** Crawlers read that first; Google runs JavaScript on a slower, less reliable second pass, and collapsed content is deprioritized regardless. Third-party directories publishing invented hours is weak circumstantial support that they didn't see yours either.

*Fix:* keep the dropdown, and **also** emit the times as plain text plus JSON-LD (§12). Additive, not a redesign.

### 3.3b Homepage carousel is the critical accessibility failure

The critical finding `comp-jqh1ozf6` is a **stock Wix media Carousel rendered inside an iframe** (`Carousel.b605841e.html`) — not custom code. Carousels rendered that way can't expose keyboard or screen-reader behavior, which is why it trips WCAG 4.1.2 Level A.

### 3.3c Header branding

The header wordmark is **"# YouBelongHere"** — the church's name doesn't appear in the header at all. It's a strong tagline, but a first-time visitor landing from a search result has no name-level confirmation they're in the right place until they scroll to the logo in the hero.

### 3.4 Two campuses — the site never says so

**CORRECTION:** I flagged Pineville / Tioga / Alexandria as a three-town contradiction. It isn't. **Tioga is a town inside Pineville**, so "Impact Tioga" and the Pineville branding are consistent. And the two addresses are **two real campuses**:

| Campus | Address | Role |
|---|---|---|
| **Main** | 501 Ates Road, Pineville, LA 71360 | Primary |
| **Second** | 5305 North Blvd, Alexandria, LA 71301 | Second campus |

**The real problem is that a visitor can't tell any of this.** The Contact page has an **"Our Locations" heading with nothing under it**, then two bare addresses with no labels, no campus names, and no indication which is main. Nothing anywhere else on the site mentions being multi-campus.

A two-campus church needs this to be obvious — it changes where someone drives on Sunday. Recommended: a real **Locations** page (or a Locations section in the nav), each campus with its own name, address, map, times, and photo.

### 3.4b Confirmed service times

| When | What |
|---|---|
| **Sunday 10:30am** | Service |
| **Monday 7pm** | — |
| **Wednesday 7pm** | — |
| **Monday–Thursday 5am** | Corporate Prayer |

These now need to land in three places: the existing dropdown (already done), plain text in the page body, and JSON-LD structured data (§12). *Pending: whether both campuses share this schedule, and what the Monday/Wednesday 7pm gatherings are called.*

### 3.5 Contact info sprawl — four addresses

- `info.arisenow@gmail.com` — Wix site contact setting
- `arisenow.church@gmail.com` — Contact page
- `arisechurchprayer@gmail.com` — Prayer request
- `(318) 640-1865`

All gmail, on a premium plan with a custom domain. Also, the Contact page renders the email address **as an H2 heading**, which is semantically wrong.

### 3.6 Third-party listings are publishing confirmed misinformation

**Both of these are now confirmed wrong by Bradly:**

| Listings say | Reality |
|---|---|
| Lead Pastor **Chad Stecker** | **No longer connected to the church** |
| **Assemblies of God** | **Independent** — no longer affiliated |

This isn't a stale-data nitpick anymore. Directories with real search visibility are naming a former leader and a denomination you've left. Someone searching "Arise Church Pineville" can land on these before they ever reach your site.

Sites carrying it: JoinMyChurch, UnitedStatesChurches, YellowPages, FindOpen, Wikizer, PlaceDigger.

FindOpen also publishes hours you never set (Sun 9:00–13:00, Tue 18:30–20:00, Wed 18:30–20:30) — all wrong against the confirmed schedule in §3.4b.

**Priority: high.** Claim Google Business Profile first (it feeds many others), then work down the list. Both campuses need their own profile.

---

## 4. SEO

| Issue | Detail |
|---|---|
| Missing meta descriptions | `/contact`, `/arise-bible`, `/information-desk-registration` |
| Broken meta description | `/leaders` (contains the AI prompt label) |
| Weak title | "Contact \| arisechurch" — no city, no keywords |
| Brand inconsistency | Lowercase "arisechurch" in all titles |
| 404 in index | `/arise-team` needs a 301 redirect |
| No structured data | No Church / LocalBusiness JSON-LD found — this is what powers Google's service-times panel |
| Social links inconsistent | Homepage: FB, IG, Twitter. Contact: FB, Twitter, IG, YouTube. Twitter icons still branded Twitter, not X. |
| Thin homepage | Very little indexable text for your most important page |

---

## 5. UPGRADES & ENHANCEMENTS

### Tier 1 — fast, free, high impact
1. **Make the existing service times machine-readable.** Keep the dropdown; additionally emit the times as plain text in the page body (and in JSON-LD, §12) so crawlers and scrapers get them without a click. Adding the address alongside them is the natural pairing.
2. **"Plan Your Visit" page** — times, parking, what to wear, what happens with kids, who to look for.
3. Fix the 4 dead "Learn More" buttons.
4. Full copy pass on Leaders (names, truncated sentences, meta description, Ethan's photo).
5. 301 redirect `/arise-team`.
6. Delete Portfolio demo content and `/s-projects-basic`.
7. Fix the raw-URL link in the header.
8. Alt-text pass on the top 8 pages.

### Tier 2 — structural
9. Nav restructure (§1.7).
10. Surface the store, giving page, classes, and programs.
11. Move email to `@arisecenla.church` addresses.
12. **Add Church schema markup** — Velo is already enabled, so JSON-LD can be injected sitewide. This is what gets service times into Google's sidebar.
13. **Captions/transcripts on sermons** — YouTube auto-captions can be pulled and attached. Clears the majority of your 1,099 findings and makes sermons searchable.
14. Convert Prayer Request from `mailto:` to a real Wix Form.
15. Claim and correct Google Business Profile and the directory listings.
16. Investigate why 12 pages fail to render for the scanner.

### Tier 3 — bigger plays
17. Live-stream embed on the homepage that appears during service.
18. Sermon archive with notes, scripture references, and series grouping.
19. Wix Members Area is installed — is it doing anything?
20. Wix Multilingual is installed but the site is English-only. For a self-described multicultural church, Spanish is an obvious opportunity.
21. Wix Chat is installed — an unmonitored chat widget is worse than none.
22. Consolidate giving: one path, not two.

---

## 6. INSTALLED APPS — usage check

Installed: Promote SEO · Bookings · Chat · Events & Tickets · Forms · Forms & Payments · Groups · Invoices · Members Area · **Multilingual** · Online Programs · Pay Links · **Portfolio** · Stores · Video

Several look installed-but-idle (**Portfolio** is definitely just demo content). Every unused app adds page weight and clutter. Worth an audit of which ones earn their place.
