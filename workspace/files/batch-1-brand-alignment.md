# Batch 1 — Brand Alignment
**Arise Church · arisecenla.church**
Everything here is either a file you can use or a step you click. **I have changed nothing on your live site.**

---

## A note on what I can and can't do

I checked the Wix API surface directly: **Wix exposes no REST endpoint for site theme colors or typography.** Palette and font changes live in the Editor only. So Section 2 below is instructions for you, not something I can push.

What I *can* do through the API when you say go: SEO tags and meta descriptions, structured data, the Bookings cleanup (2022 conference, online class), and CMS work. That's Batch 2.

---

## 1. Logo files — ready to use

Your source was 304×274, RGB, white baked in. I un-matted it (proper alpha reconstruction, so the grunge texture and soft edges survive) and produced four files.

| File | Size | Use it for |
|---|---|---|
| `arise-logo-transparent@4x.png` | 1216×1096 | **Main file.** Header, hero, anywhere on light or dark |
| `arise-logo-transparent.png` | 304×274 | Native resolution, if you need the original size |
| `arise-logo-white@4x.png` | 1216×1096 | Solid white version for dark backgrounds and the near-black header |
| `arise-logo-brandred@4x.png` | 1216×1096 | Texture preserved, recolored to exactly **#D6222D** |

### How the "A" behaves — check `logo-preview.png`

The A is a **knockout** — an open counter, not a filled shape. It connects to the outside edge of the flame, so it takes on whatever is behind it:

- **On white** → A reads white. Correct.
- **On #0A0A0C near-black** → A goes dark. Still high contrast against the red. **Looks good** — see the preview.
- **On a busy photo** → the photo shows through the A. Avoid this; use the white version instead.

I could not auto-fill the A to solid white because it isn't an enclosed region. Filling it properly needs the vector source.

### The real fix

**304×274 is too small.** For a retina header you want 600px+ wide natively; for print or signage you need vector. My 4× files are resampled — sharper in use, but no new detail was invented.

**Ask whoever made the logo for the `.ai`, `.eps`, or `.svg`.** If nobody has it, it's worth paying someone to redraw it once. That single file solves the header, print, favicon, and social sizes permanently.

---

## 2. Wix Editor steps — colors and fonts

### 2a. Colors

**Editor → Site Design (paintbrush) → Color**

| Slot | Currently | Change to | Why |
|---|---|---|---|
| `color_3` | `#ED1C24` | **`#D6222D`** | Brand kit is canonical |
| `color_2` | `#000000` | **`#0A0A0C`** | Brand near-black |
| `color_4` | `#0088CB` blue | retire | Kit: "Arise Red is the only accent" |
| `color_5` | `#FFCB05` yellow | retire | Same |

Leave whites alone. Retiring 4 and 5 means repointing anything using them to red, black, or grey — check as you go.

### 2b. Fonts

**Editor → Site Design → Text → Upload Fonts.** Anton, Oswald, and Bebas Neue are all free on Google Fonts.

| Style | Font | Treatment |
|---|---|---|
| Heading 1 / 2 | **Anton** | Uppercase always, letterspacing ~6 |
| Kicker / eyebrow | **Oswald Medium** | Uppercase, letterspacing ~14 |
| Body / buttons | **Oswald Regular** | Sentence case fine |
| Reserve | Bebas Neue | Alternate condensed display |

**One caution.** Anton is very heavy and very condensed. It's built for 148pt thumbnail headlines — at 24–32pt web subheads it gets dense fast. My suggestion: **Anton for H1 and hero only, Oswald for everything below.** Try one page before rolling it out site-wide.

### 2c. Service Times button

Same panel. Set the fill to **85–100% opacity** instead of translucent. Fixes the 2.18:1 contrast failure. Appearance otherwise unchanged.

---

## 3. Service times — corrected

Your brand kit says only *"Sundays 10:30 AM · Monday night Glory Nights."* That's incomplete. Actual:

| When | What | Where |
|---|---|---|
| **Sunday 10:30 AM** | Sunday Service | **Both campuses** |
| **Monday 7:00 PM** | **Glory Night** | Main campus |
| **Wednesday 7:00 PM** | Midweek Service | Main campus |
| **Mon–Thu 5:00 AM** | Corporate Prayer | Main campus |

Two things worth saying plainly: **"Glory Night" appears nowhere on your website** despite being a named format with its own YouTube playlist. And **Corporate Prayer at 5am, four mornings a week, is a genuine differentiator** — no other church in your comparison set offers anything like it.

---

## 4. Plan Your Visit — copy, ready to paste

Written in your brand voice: direct, warm, unhurried, specific. No hype.

---

### Plan Your Visit

**Sunday at 10:30 AM. Both campuses. Come as you are.**

**Where we meet**
Main Campus — 501 Ates Road, Pineville, LA 71360
Alexandria Campus — 5305 North Blvd, Alexandria, LA 71301

Sunday service runs at both. Everything during the week meets at the Main Campus.

**Parking**
Park wherever there's room. We have parking ushers on Sunday mornings — follow their direction and they'll get you where you need to be.

**What to wear**
There's no dress code. You'll see jeans and you'll see suits. Come as you are — we mean it.

**When to arrive**
If it's your first time, come a little early. It gives you room to park without rushing, find a seat you like, and meet somebody before the service starts.

**During the week**
Glory Night — Mondays at 7:00 PM
Midweek Service — Wednesdays at 7:00 PM
Corporate Prayer — 5:00 AM, Monday through Thursday

All at the Main Campus. Corporate Prayer is early and it's open to anyone.

**Who we are**
We're multiethnic and multigenerational. Our heart is to help you CONNECT with God and His family, GROW in God's character, SERVE in God's Church, and SHARE God's message.

---

## 5. Leaders page — corrected copy

Only the errors are fixed. Titles and names kept exactly as you confirmed.

**Chad and Tabitha Kerik** — *"Ker" → "Kerik", missing word restored*
> Chad and Tabitha Kerik not only serve as Elders, but they also take on the vital roles of our Youth Ministers and Leaders of Thrive for young adults. Their dedication and passion for youth and young adult ministry shine through in all their efforts. For more information about their ministries and how you can get involved, be sure to check out our Ministry section!

**Bryant Sanders** — *rewritten in third person, as you approved*
> Apostle Bryant Sanders leads Arise Church and serves as Leader of the Lead Network. His years of dedicated ministry and guidance shape the direction of this church, and his leadership is a source of strength for our community.

**Herbert and Erica Perry** — *two missing words restored*
> Herbert and Erica Perry are truly remarkable members of our church community. Their unwavering dedication and commitment inspire us all. Herbert, as one of our esteemed ministers, leads with passion and grace, setting a shining example for everyone. We are grateful for their contributions and the positive impact they have on our congregation.

**Will Robertson** — *heading corrected from "Robinson"; two missing words restored*

The heading said **Robinson**, the body said **Robertson**. These are two different people: **Kristina Robinson** is the Praise Team Leader; **Pastor Will Robertson** is a Minister. The heading had borrowed the wrong surname. The body was right all along.

> Will Robertson is an exceptional pastor and an even more extraordinary individual! As an essential member of our Pastoral Team, he contributes to our community in meaningful and impactful ways. His kindness and compassion shine through in all his efforts, positively influencing the lives of those he serves. We are truly fortunate to have him on our team!

**Ethan Mayes** — *missing word restored*
> Ethan Mayes is a committed member of our praise and worship team and is also one of our ministers. His passion and dedication to serving the community are inspiring. We are grateful for all the effort and love you bring to everything you do, Ethan! Thank you for your positive impact!

> **Worth flagging:** your brand kit says the voice is *direct, warm, unhurried, specific — no hype, no marketing voice.* These bios lean on "esteemed," "truly remarkable," "exceptional... and an even more extraordinary individual!" I've left that tone intact because you said the page was otherwise correct. If you want, I'll do a second pass rewriting all seven to match your own voice guide.

**Also still open:** Ethan has no image element on the live page, while all six others do. Worth opening that page in the Editor.

---

## 6. Meta description fix

Live on `/leaders` right now, visible in Google:

> "Recommended Meta Description for the Meet Our Leaders page: 'Meet the passionate pastors...'"

Replace with:

> Meet the pastors, ministers, and leaders of Arise Church in Pineville and Alexandria, LA — the team serving our multiethnic, multigenerational church family.

**I can push this one through the SEO API the moment you say go.**

---

## 7. Suggested order

1. Upload the transparent logo — immediate, visible, zero risk
2. Change `color_3` to `#D6222D` — one field
3. Service Times panel to solid fill — fixes the contrast failure
4. Load Anton + Oswald, test on **one page** before going site-wide
5. Paste the corrected Leaders copy
6. Tell me to push the meta description fix and the Bookings cleanup

---

## Open questions

1. **Will Robinson or Will Robertson?**
2. Anton on all headings, or Anton for H1/hero only and Oswald below?
3. Should **Glory Night** get its own page, or just a named line in the Service Times dropdown?
4. Do you want the full voice rewrite of all seven leader bios?
5. Does anyone have the logo vector (`.ai` / `.eps` / `.svg`)?
6. Green light to push the meta description + Bookings cleanup via API?
