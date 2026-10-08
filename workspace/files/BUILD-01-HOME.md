# PAGE 1 — HOME
**Full build guide · Wix Editor (classic) · building directly on the live site**

Open `arise-homepage-redesign.html` in a second window and keep it beside the Editor. That's your visual target; this is the instruction set.

**Estimated time:** Step 0–1 about 40 minutes. Sections 2–10 about 2–3 hours, and you can stop after any section.

---

## STEP 0 — Safety net (2 minutes, do not skip)

1. Editor → top bar → **Site History**
2. Note the topmost entry — date and time. That's your restore point.
3. Close the panel.

If anything goes wrong at any stage: Site History → select that entry → **Restore**.

> Publish only when a section is finished and looks right. A half-built section left published is the one thing worth avoiding.

---

## STEP 1 — Global settings (~40 min, before any layout)

**Everything below inherits from these. Do them first or you'll rebuild the page.**

### 1a. Colors

**Site Design (paintbrush icon) → Color → Edit Colors**

| Slot | Set to | Where it's used |
|---|---|---|
| 1 | `#FFFFFF` | Light sections |
| 2 | `#F4F2F0` | Alternating sections |
| 3 | `#0A0A0C` | Dark sections, header, footer |
| 4 | `#D6222D` | **Arise Red** — buttons, dashes, strips, badges |
| 5 | `#DB3F48` | Small red text **on dark only** |
| 6 | `#6A6A6E` | Body text on light backgrounds |

**Remove** the blue `#0088CB` and yellow `#FFCB05`. Your brand kit says Arise Red is the only accent.

> **Why two reds.** `#D6222D` on near-black measures 3.89:1 — fine for large headlines, fails accessibility at label sizes. `#DB3F48` is the same red lightened 13% and clears 4.5:1. Use it *only* for small text on dark. Everywhere else, `#D6222D`.

### 1b. Fonts

Download from Google Fonts (free): **Anton** and **Oswald** (Light 300, Regular 400, Medium 500, SemiBold 600).

**Site Design → Text → Upload Fonts** → upload the `.ttf` files.

Then **Site Design → Text → Edit Text Themes**:

| Theme | Font | Size | Settings |
|---|---|---|---|
| Heading 1 | Anton | 72px | UPPERCASE, letterspacing 6, line height 1.02 |
| Heading 2 | Anton | 46px | UPPERCASE, letterspacing 6, line height 1.02 |
| Heading 3 | Anton | 22px | UPPERCASE, letterspacing 4 |
| Heading 4 | Oswald Medium | 13px | UPPERCASE, letterspacing 12 |
| Paragraph 1 | Oswald Light | 17px | line height 1.6 |
| Paragraph 2 | Oswald Light | 14.5px | line height 1.7 |

**Never set Anton below 18px.** It's designed for 148pt thumbnail headlines; small, it becomes an unreadable block.

### 1c. Logo

**Media → Upload** → `arise-logo-transparent@4x.png` and `arise-logo-white@4x.png`.

### 1d. The red double-dash (build once, reuse everywhere)

This is your section marker and it appears on every section.

1. **Add → Decorative → Shape** → pick a plain rectangle
2. Size it **46 × 7px**, fill `#D6222D`, no border
3. Duplicate it (Ctrl+D), place the copy **16px to the right**
4. Select both → **Group**
5. Right-click the group → **Save to My Designs** (or Add to Saved Elements)

Now it's one click every time you need it.

### 1e. The spacing ruler

Not a setting — a discipline. **Every** gap you set is one of:

`8 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

Nothing in between. This single habit does more for "looks designed" than anything else in this document.

**Publish now.** The site already looks different, and nothing is half-built.

---

## STEP 2 — Header (appears on every page)

Work on the header itself, not inside a page section.

### 2a. Delete first

Two things are on every page and both should go:

- The link above the menu whose visible text is the raw URL `https://www.arisecenla.church/information-desk-registration`
- The **footer copyright link** to the same page

That page is password-protected and blank to visitors. It's currently your most-linked page — 70 links sitewide. Bookmark it instead.

### 2b. Rebuild

Header background `#0A0A0C`, height **76px**, sticky on scroll.

**Left group:**
- Logo image, height **38px**
- Text beside it: `ARISE CHURCH` — Anton 17px, `#FFFFFF`, letterspacing 10
- Below that: `#YOUBELONGHERE` — Oswald Regular 9px, `#DB3F48`, letterspacing 26

**Right group:**
- Menu — Oswald Regular 12.5px, `#FFFFFF` at 86% opacity, UPPERCASE, letterspacing 15, **29px between items**
- Hover state: `#D6222D`
- **GIVE** button — solid `#D6222D`, white Oswald SemiBold 12px, letterspacing 16, padding 11px vertical / 21px horizontal. Links to your Tithe.ly URL.

---

## STEP 3 — Hero

**Add → Section**, full width, minimum height **760px**.

### 3a. Background

1. Section settings → **Background → Image**
2. Choose your worship photo
3. Set position **center 32%**, scale to fill

### 3b. The scrim — the most important part

Without this, text over a photo is unreadable. This is what your current hero is missing.

1. **Add → Decorative → Shape** → rectangle
2. Stretch it to cover the **entire** section
3. Fill → **Gradient**, linear, direction **left to right**
4. Gradient stops:
   - 0% → `#060608` at **94%** opacity
   - 42% → `#060608` at **86%**
   - 74% → `#060608` at **34%**
   - 100% → `#060608` at **52%**
5. Right-click → **Arrange → Move Backward** until it sits above the photo but below your text

### 3c. Content — left 64% of the section

Stack these with the spacing shown:

1. **Red double-dash** (your saved element) + text `ARISE CHURCH · PINEVILLE, LA` — Oswald Medium 12px, `#DB3F48`, letterspacing 30, positioned 78px right of the dashes
2. *(16px gap)*
3. **H1** — `YOU BELONG HERE.` Anton 72px (mobile 42px), `#FFFFFF`, letterspacing 6, two lines. **Make the final period `#D6222D`** — select just that character and change its color.
4. *(22px gap)*
5. **Sub-line** — Oswald Light 19px, `#FFFFFF` at 80%, max width 48 characters
6. *(34px gap)*
7. **Two buttons, 13px apart:**
   - `PLAN YOUR VISIT` — solid `#D6222D`, white text
   - `WATCH A MESSAGE` — transparent, 1.5px white border, white text
   - Both Oswald SemiBold 12px, letterspacing 16, padding 15/30

> ⚠️ **Decide the sub-line before you type it.** The mockup uses *my* copy: "One church, two campuses. Multiethnic, multigenerational, and expecting God to move — this Sunday at 10:30." Your live homepage says *"Welcome to our multicultural, multiethnic, and multigenerational church! We are thrilled to have you join our vibrant community…"* — accurate but long for a hero. **Mine, yours, or write a new one.** It's the only place on this page where the words aren't already yours.

### 3d. Service Times panel — leave a gap for now

Reserve a **360 × 80** space in the **top right** of the hero. We'll fill it in Step 10, after the rest works.

---

## STEP 4 — Who We Are

**Add → Section.** Background `#FFFFFF`. Padding **96px top and bottom**.

Content in a container **1180px wide**, centered:

1. Red double-dash + `WHO WE ARE` — Oswald Medium 12px, `#D6222D`, letterspacing 30
2. *(16px)*
3. **H2** — Anton 46px, `#0A0A0C`
4. *(24px)*
5. **Lede paragraph** — Oswald Light 20px, `#0A0A0C`, line height 1.62, max 64 characters wide
6. *(24px)*
7. **The skewed red strip:**
   - Add a rectangle, fill `#D6222D`, padding 8px vertical / 19px horizontal
   - **Rotate it −9°**
   - Put text inside — and **rotate the text +9°** so it sits level while the box stays skewed
   - Text: `APOSTLE BRYANT SANDERS · PASTOR VANESSA SANDERS` — Oswald SemiBold 12px, white, letterspacing 16

### 4a. The four-verb pathway

Directly below, still on white:

1. Draw a **3px** horizontal line, full container width, `#D6222D`
2. Below it, **four equal columns** with 1px `rgba(10,10,12,.12)` dividers between (none after the fourth)
3. Each column, 30px top padding / 26px sides:
   - Number — Anton 13px, `#D6222D`, letterspacing 12 → `01` `02` `03` `04`
   - *(13px gap)*
   - **H3** — Anton 22px → `CONNECT` `GROW` `SERVE` `SHARE`
   - *(9px gap)*
   - Body — Oswald Light 14.5px, `#6A6A6E`

This is your own mission language from the brand kit, turned into structure.

---

## STEP 5 — Campuses

**The single most valuable block on this page.** Nothing on your site currently says you're one church in two places.

**Add → Section.** Background `#F4F2F0`. Padding 96px.

1. Red double-dash + `TWO CAMPUSES`
2. **H2** — `ONE CHURCH, TWO LOCATIONS`
3. *(50px)*
4. **Two containers side by side, 2px apart**, each white:

**Left — Main Campus**
- Red tag: `MAIN CAMPUS` — white Oswald SemiBold 10px on `#D6222D`, letterspacing 18, padding 5/11
- **H3** — `PINEVILLE`
- Address — Oswald Light 16px: `501 Ates Road` / `Pineville, LA 71360`
- *(20px, then a 1px `#0A0A0C` 12% divider, then 18px)*
- Four rows, each label left / time right, Oswald Light 14.5px:
  - `Sunday Service` → **10:30 AM**
  - `Glory Night` → **Mon 7:00 PM**
  - `Midweek Service` → **Wed 7:00 PM**
  - `Corporate Prayer` → **Mon–Thu 5:00 AM**
- `GET DIRECTIONS →` — Oswald SemiBold 12px, `#D6222D`, letterspacing 15

**Right — Alexandria**
- Red tag: `SECOND CAMPUS`
- **H3** — `ALEXANDRIA`
- Address: `5305 North Blvd` / `Alexandria, LA 71301`
- One row: `Sunday Service` → **10:30 AM**
- Italic note, `#6A6A6E`: *Weeknight services meet at the Main Campus.*
- `GET DIRECTIONS →`

**Stack these vertically on mobile.**

---

## STEP 6 — Ministries (CMS-driven)

Your `Ministries` collection is already populated with 8 items. This section pulls from it.

### 6a. Build it

**Add → Section.** Background `#0A0A0C`. Padding 96px.

1. Red double-dash + `FIND YOUR PEOPLE` — use `#DB3F48` here, it's on dark
2. **H2** — `MINISTRIES`, white
3. *(50px)*
4. **Add → List & Grid → Repeater** → **Grid layout, 4 columns, 2px gap**

### 6b. Build one card — Wix clones the rest

Inside **one** repeater item:

| Element | Set ID to | Settings |
|---|---|---|
| Image | `hmImage` | 1:1 ratio, fill crop, grayscale 28%, brightness 60% |
| Container | — | Bottom-anchored over the image, gradient `transparent → rgba(6,6,8,.97)`, padding 34px top / 18px sides / 20px bottom |
| Text | `hmTitle` | Anton 16.5px, white |
| Text | `hmCat` | Oswald Medium 11px, **white at 92%**, letterspacing 17 |

**Set IDs in Properties** (right-click element → View Properties). The code depends on these exact names.

> **Captions are white, not red.** Photos vary too much in brightness for a small red label to stay legible over them.

### 6c. Page code

**Pages → Home → ⋮ → Page Code.** Paste:

```javascript
import wixData from 'wix-data';

$w.onReady(async () => {
  try {
    const { items } = await wixData.query('Ministries')
      .eq('comingSoon', false)      // homepage shows only live ministries
      .ascending('sortOrder')
      .limit(4)
      .find();

    $w('#homeMinRepeater').onItemReady(($item, m) => {
      $item('#hmTitle').text = m.title || '';
      $item('#hmCat').text   = m.category || '';
      if (m.image) {
        $item('#hmImage').src = m.image;
        $item('#hmImage').alt = m.title || 'Arise Church ministry';
      }
    });

    $w('#homeMinRepeater').data = items;
  } catch (err) {
    console.error('Ministries load failed:', err);
  }
});
```

**Rename the repeater to `homeMinRepeater`** in Properties, or change the code to match its actual ID.

That `.alt` line is what fixes your filename-as-alt-text problem — one line, every image.

**This pulls the four with pages: Lead Network, Children's, Youth, Outreach.** The four marked `comingSoon` stay off the homepage automatically.

---

## STEP 7 — Latest Message

**Add → Section.** White. Padding 96px.

1. Red double-dash + `LATEST MESSAGE`
2. *(46px)*
3. **Two columns**, ratio roughly 1.15 / 0.85, gap 62px:

**Left:** 16:9 image at 72% opacity, with a **74px red circle** centered on it containing a white play triangle. Link it to the message.

**Right:**
- **H2** at 40px — the message title
- *(16px)* one-line description, Oswald Light, `#6A6A6E`
- *(26px)* skewed red strip — `APOSTLE BRYANT SANDERS · SUNDAY SERVICE`
- *(30px)* `ALL MESSAGES` button — transparent, 1.5px `#0A0A0C` border, dark text

---

## STEP 8 — What To Expect

**Add → Section.** Background `#0A0A0C`. Padding 96px.

1. Red double-dash + `FIRST TIME?` (in `#DB3F48`)
2. **H2** — `WHAT TO EXPECT`, white
3. *(48px)*
4. **Three equal columns, 44px apart.** Each opens with a **32 × 4px** `#D6222D` bar, then 16px, then:

| Heading | Body |
|---|---|
| `PARKING` | Park wherever there's room. Our parking ushers are out on Sunday mornings — follow their direction and they'll get you where you need to be. |
| `WHAT TO WEAR` | There's no dress code. You'll see jeans and you'll see suits. Come as you are — we mean it. |
| `WHEN TO ARRIVE` | Come a little early your first time. Room to park without rushing, find a seat you like, and meet somebody before service starts. |

Headings Anton 17px white; body Oswald Light 14.5px, white at 80%.

5. *(44px)* `GET DIRECTIONS` button, solid red

---

## STEP 9 — Give, then Footer

### Give band
**Add → Section.** Background **solid `#D6222D`**. Padding 96px.

Red double-dash won't show on red — use **white** dashes here. Kicker `GIVE` in white. H2 white. One paragraph, pure `#FFFFFF` (not 90% — it fails contrast). Button: **white background, red text**.

### Footer
Background `#0A0A0C`. Padding 56px top / 30px bottom.

**Three columns:**
- `ARISE CHURCH` — one line, plus the skewed strip reading `#YOUBELONGHERE`
- `VISIT` — both addresses, phone
- `CONNECT` — Ministries · Messages · Events · Serve · Prayer Request

Column headings Anton 13px white, letterspacing 16. Links Oswald Light 13.5px, white at 80%, hover `#DB3F48`.

**Bottom bar** above a 1px white-15% divider: `© 2026 Arise Church` left, `Sunday 10:30 AM · Both campuses` right.

**Remember: no information-desk link in the copyright.**

---

## STEP 10 — Service Times custom element (last)

Do this only once everything else works.

1. **Velo sidebar → Public → `custom-elements/`** — paste `arise-service-times-final.js` into the file Wix generated for you
2. **Add → Embed Code → Custom Element**
3. **Choose Source → Velo file** — *not* Server URL. Velo files have no URL; that's what tripped you up before.
4. **Tag Name:** `arise-service-times`
5. Place it in the gap you left in the hero, size **360 × 80**
6. **Publish**

**It will look clipped in Editor and Preview.** Wix renders custom elements in an iframe there. Only the published site puts it in the real DOM. **Check the live site.**

> ⚠️ This file goes in `public/custom-elements/` — **never** in `masterPage.js` or Home's page code. Page code runs server-side first, where `document` and `HTMLElement` don't exist. That's the exact error you hit.
>
> This also fixes your current dropdown showing Corporate Prayer as **Mon–Wed**. It's **Mon–Thu**.

---

## STEP 11 — Mobile

Editor → **phone icon** (top bar) to switch to the mobile layout. Wix keeps this separate from desktop.

Per section:
- **Hero** — H1 down to 42px. Service times panel goes **below** the buttons, not beside them.
- **Pathway** — 4 columns → 2, then 1 on narrow phones
- **Campuses** — side by side → stacked
- **Ministries** — 4 across → 2
- **What To Expect** — 3 columns → stacked
- **Footer** — 3 columns → stacked

Check **every** section for text overflowing its container. That's the most common mobile break.

---

## STEP 12 — Publish and verify

- [ ] Site History restore point noted (Step 0)
- [ ] Global colors set, blue and yellow retired
- [ ] Anton + Oswald loaded and mapped
- [ ] Header rebuilt, raw-URL link deleted
- [ ] Hero: scrim, H1, sub-line, two buttons
- [ ] Who We Are + four-verb pathway
- [ ] Campuses — both, with times
- [ ] Ministries repeater pulling from CMS
- [ ] Latest Message
- [ ] What To Expect
- [ ] Give band
- [ ] Footer, copyright link removed
- [ ] Service Times element live
- [ ] Mobile layout checked section by section
- [ ] **Opened on a real phone**
- [ ] **Opened in the Facebook in-app browser** — that's where the dark-mode issue surfaced

**Then tell me it's live.** I'll crawl it and verify: the H1 exists, the ministries content is in the server HTML, contrast passes, structured data survived, and nothing regressed.

---

## If something goes wrong

| Symptom | Cause |
|---|---|
| Ministries repeater empty | Element IDs don't match the code. Check Properties. |
| Repeater shows one blank item | `.data` was set before `onItemReady`. Handler first. |
| Service times clipped | Expected in Editor/Preview. Check the published site. |
| `document is not defined` | Custom element code is in page code. Move it to `public/custom-elements/`. |
| Text invisible on dark | A component color is overriding the section. Set it explicitly to white or `#DB3F48`. |
| Anton looks like a black block | It's under 18px. Raise it or switch to Oswald. |

**Restore point is in Site History.** Nothing here is one-way.

---

## Still open on this page

1. **Hero sub-line** — mine, yours, or new
2. **Latest Message** — which message, and its link
3. **Service end times** — completes the structured data
