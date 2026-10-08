# Arise Church — Final Build Plan
**Page by page, starting with the Home page.** This replaces the earlier staged walkthrough.

---

## Step 0 — Before you open the Editor

You're duplicating the site. Good — Site History restores a *whole* site state, so a duplicate lets you compare old and new side by side, which History can't do.

**Dashboard → Site Actions → Duplicate Site** → name it `arise-2026`.
Build there. Publish to the domain when you're satisfied.

---

## Step 1 — Global settings (~20 minutes, once)

**Do this before the Home page.** Colors and fonts are site-wide settings. Build a page first and you'll rebuild it after changing them.

### 1a. Colors — Site Design (paintbrush) → Color

| Slot | Set to | Used for |
|---|---|---|
| Accent 1 | **`#D6222D`** | Arise Red — buttons, dashes, strips, badges |
| Accent 2 | **`#DB3F48`** | Small red text **on dark only** |
| Black | **`#0A0A0C`** | Dark sections, header, footer |
| Grey | **`#F4F2F0`** | Alternating light sections |
| White | **`#FFFFFF`** | Light sections |

**Retire** the blue `#0088CB` and yellow `#FFCB05`. Your brand kit is explicit: Arise Red is the only accent.

> **Why two reds.** `#D6222D` on near-black measures 3.89:1 — fine for big headlines, fails accessibility for 11px labels. `#DB3F48` is the same red lightened 13% and clears the bar. Use it *only* for small text on dark; everywhere else use `#D6222D`.

### 1b. Fonts — Site Design → Text → Upload Fonts

Download Anton and Oswald from Google Fonts, upload the `.ttf` files.

| Style | Font | Size | Treatment |
|---|---|---|---|
| H1 | Anton | 64–88px | UPPERCASE, letterspacing 6 |
| H2 | Anton | 36–56px | UPPERCASE, letterspacing 6 |
| H3 | Anton | 18–22px | UPPERCASE, letterspacing 4 |
| Kicker | Oswald Medium | 12px | UPPERCASE, letterspacing 14 |
| Body | Oswald Light (300) | 16–17px | Sentence case |
| Buttons | Oswald SemiBold | 12px | UPPERCASE, letterspacing 16 |

**Never put Anton below 18px.** It's designed for 148pt thumbnail headlines; small it becomes a wall.

### 1c. Logo
Upload `arise-logo-transparent@4x.png`. On the near-black header use `arise-logo-white@4x.png`.

### 1d. The spacing ruler
Not a setting — a rule you follow. **Every** gap is one of: `8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`. Nothing in between. This single habit does more for "looks designed" than any other change here.

**Publish. The site already looks different.**

---

## PAGE 1 — Home

Open `arise-homepage-redesign.html` beside the Editor. Nine sections, top to bottom.

### Section 1 — Header (applies to every page)

Strip, background `#0A0A0C`, height 76px, sticky.

- **Left:** logo (38px tall) + "ARISE CHURCH" in Anton 17px white, letterspacing 10. Under it "#YOUBELONGHERE" in Oswald 9px, `#DB3F48`, letterspacing 26.
- **Right:** menu items — Oswald 12.5px, white at 86% opacity, UPPERCASE, letterspacing 15, **29px apart**
- **Far right:** GIVE button — solid `#D6222D`, white text, 11px vertical / 21px horizontal padding

**Delete the raw-URL link** above the menu (`https://www.arisecenla.church/information-desk-registration`). Same link is in the footer copyright — delete that too. It appears on every page and goes to a blank password-protected page.

### Section 2 — Hero

Full-width strip, minimum height 88vh (cap ~760px).

1. **Background:** your worship photo, position center 32%
2. **Scrim:** dark overlay, left-to-right gradient — 94% opacity at the left edge fading to about 34% at 74% across. This is what makes the text readable, and it's what your current hero is missing.
3. **Content, left 64%:**
   - Red double-dash + kicker "ARISE CHURCH · PINEVILLE, LA"
   - H1: **YOU BELONG HERE.** — the period in `#D6222D`
   - Sub-line, white at 80%
   - Two buttons: **Plan Your Visit** (solid red) · **Watch a Message** (white outline)
4. **Service Times panel, top right** — Stage 3 below

> ⚠️ **Decision.** The sub-line in the mockup is *my* copy: "One church, two campuses. Multiethnic, multigenerational, and expecting God to move — this Sunday at 10:30." Your live homepage says: *"Welcome to our multicultural, multiethnic, and multigenerational church! We are thrilled to have you join our vibrant community…"* — that reads long in a hero. **Tell me which you want**, or write a new line yourself.

### Section 3 — Who We Are · white

Kicker "WHO WE ARE" → H2 → lede paragraph → skewed red strip reading "APOSTLE BRYANT SANDERS · PASTOR VANESSA SANDERS".

Then the **four-part pathway** — a 4-column strip with a 3px red rule across the top, 1px dividers between:

`01 CONNECT` · `02 GROW` · `03 SERVE` · `04 SHARE`

That's your own mission language from the brand kit, turned into structure. Gather Asheville does exactly this with their four verbs.

### Section 4 — Campuses · `#F4F2F0`

Kicker "TWO CAMPUSES" → H2 "ONE CHURCH, TWO LOCATIONS" → two cards, 2px gap.

**Main Campus · Pineville** — 501 Ates Road, Pineville, LA 71360
Sunday 10:30 AM · Glory Night Mon 7:00 PM · Midweek Wed 7:00 PM · Corporate Prayer Mon–Thu 5:00 AM

**Second Campus · Alexandria** — 5305 North Blvd, Alexandria, LA 71301
Sunday 10:30 AM · *Weeknight services meet at the Main Campus*

Each gets a red tag, address, times table, and a Get Directions link.

**This section is the single most important thing on the page.** Nothing on your site currently says you're one church in two places.

### Section 5 — Ministries · `#0A0A0C`

Kicker → H2 "MINISTRIES" → 4 tiles, 2px gap, **1:1 crops**, images at 28% greyscale / 60% brightness.

Caption block bottom of each tile with a gradient behind it: title in Anton 16.5px white, category below in **white at 92%** — *not red*. Photos vary too much in brightness for a small red label to stay legible.

### Section 6 — Latest Message · white

Two columns, 1.15 / 0.85. Left: 16:9 video still with a red circular play button. Right: message title, one-line description, skewed red strip with speaker and service, then an "All Messages" outline button.

### Section 7 — What To Expect · `#0A0A0C`

Kicker "FIRST TIME?" → H2 → three columns, each opening with a 32×4px red bar:

**Parking** — Park wherever there's room. Our parking ushers are out on Sunday mornings.
**What to wear** — There's no dress code. You'll see jeans and you'll see suits.
**When to arrive** — Come a little early your first time.

Then a **Get Directions** button.

### Section 8 — Give · `#D6222D`

Full red band. Kicker, H2, one paragraph, white button with red text.

### Section 9 — Footer · `#0A0A0C`

Three columns — Arise Church / Visit / Connect — over a bottom bar reading `© 2026 Arise Church` and `Sunday 10:30 AM · Both campuses`.

**Remove the information-desk link from the copyright.**

### Section 10 — Service Times custom element

1. Velo sidebar → **Public → custom-elements/** → paste `arise-service-times-final.js` into the file Wix generated
2. **Add → Embed Code → Custom Element**
3. **Choose Source → Velo file** (not Server URL — Velo files have no URL)
4. **Tag Name:** `arise-service-times`
5. Place top-right of the hero, size **360 × 80**
6. **Publish**

**It will look clipped in Editor and Preview.** Wix renders custom elements in an iframe there; only the published site puts it in the real page DOM. Check the live site.

> Your current dropdown says Corporate Prayer **Mon–Wed**. It's **Mon–Thu**. This fixes it.

### Home page checklist

- [ ] Header rebuilt, raw-URL link deleted
- [ ] Hero with scrim, H1, two buttons
- [ ] Sub-line decided
- [ ] Who We Are + four-part pathway
- [ ] Campuses — both, with times
- [ ] Ministries — 4 tiles, 1:1
- [ ] Latest Message
- [ ] What To Expect — 3 columns
- [ ] Give band
- [ ] Footer, copyright link removed
- [ ] Service Times custom element live
- [ ] Checked on a phone
- [ ] Checked in the **Facebook in-app browser** — this is where the dark-mode problem showed up

**Then tell me.** I'll crawl the live page and verify structure, headings, contrast, and metadata before you move on.

---

## The page order after Home

| # | Page | Mockup | Why here |
|---|---|---|---|
| 2 | **Contact** | `page-01-contact-v2.html` | Small, high traffic, fixes the empty "Our Locations" |
| 3 | **About** | `page-03-about.html` | Both popups already filled with your Beliefs and Promises |
| 4 | **Leaders** | `pages-ministries-leaders.html` | Photo remap + all text corrections |
| 5 | **Ministries** | `pages-ministries-leaders.html` | Kills the four dead buttons |
| 6 | **Past Sermons** | `page-02-sermons.html` | Adds the missing H1 |
| 7 | **Events** | `page-04-events.html` | Pulls the buried event detail forward |
| 8 | **Serve** | `pages-05-11.html` | Move it out of Contact in the menu |
| 9 | **Children's · Youth · Outreach · Lead Network** | `pages-05-11.html` | Four small pages |
| 10 | **Bible Search · Training** | `pages-05-11.html` | Training needs its URL fixed |
| 11 | **NEW: Plan Your Visit** | copy in `batch-1-brand-alignment.md` | Hero links to it |
| 12 | **NEW: Campuses** | homepage section as the base | — |

**One page per session. Publish after each. Tell me when it's live and I'll verify.**

---

## Housekeeping — any time, not blocking

**Rename three pages** (Pages → ⋮ → SEO Basics → URL slug). **Wix will offer a 301 redirect — say yes every time.** That's the whole redirect job.

`/general-4` → `/lead-network` · `/s-projects-basic` → `/training` · `/previous-events-1` → `/past-events`

**Unpublish four:** `/application-form` · `/schedule` · `/devotional` · `/events-2`

**Uninstall Online Programs** (Dashboard → Apps → Manage Apps) — removes six pages at once.

**Clean `/thank-you-page`** — Wix demo data is live on it: "Product option 1/2/3", "$0.00", and an outbound link to `kamille.info`, a domain unconnected to you.

**Rebuild the menu:**
```
I'M NEW · ABOUT · MINISTRIES · MEDIA · EVENTS · GET INVOLVED · [GIVE]
```
Bible Search moves under Media. Serve moves out of Contact into Get Involved.

---

## The section pattern — memorise this one thing

```
1. Red double-dash + uppercase tracked kicker
2. Anton headline, uppercase, 1–2 lines
3. Body in Oswald Light
4. The content — grid, cards, or form
5. Optional skewed red strip for attribution
```

Alternate **white → `#F4F2F0` → `#0A0A0C`** down every page. That rhythm is most of the visual improvement, and it's why the mockups look composed rather than assembled.

---

## Already done — don't redo these

| | |
|---|---|
| `/leaders` meta description | Fixed — was leaking an AI prompt into Google |
| Homepage Church structured data | Live — both campuses, all service times |
| `/contact` + `/arise-bible` meta descriptions | Added |
| 2022 Woman's Conference | Hidden |
| Online Pathway class | Hidden |
| `/podcast` → Spotify | Already working — verified 301 |

---

## Still waiting on you

1. **Hero sub-line** — mine, yours, or new
2. **Service end times** — completes the structured data so Google can show your hours
3. **Which past events** belong in the Events archive
4. **Which Bible translations** the search tool supports
5. **Serve form** — does it really have two email fields?
6. **Photography** — the biggest remaining win. Your About page uses Wix stock ("Group Hug", "Praying Hands"); all four of your reference sites use real service photos throughout. Pull frames from your YouTube channel. Your brand kit already says how: *speaker mid-gesture, eyes open, lit.*
