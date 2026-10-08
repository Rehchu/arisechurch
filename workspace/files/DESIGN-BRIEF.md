# Arise Church — Design Brief

A complete specification for the Arise Church website. Written to be handed to an AI site generator, a designer, or a future editor.

---

## The church

**Arise Church** — multicultural, multiethnic and multigenerational. Independent, not affiliated with any denomination.

**Led by** Apostle Bryant Sanders and Pastor Vanessa Sanders.

**One church, two campuses:**
- **Main Campus** — 501 Ates Road, Pineville, LA 71360
- **Second Campus** — 5305 North Blvd, Alexandria, LA 71301

**Service times**
| When | What | Where |
|---|---|---|
| Sunday 10:30 AM | Sunday Service | Both campuses |
| Monday 7:00 PM | Glory Night | Main Campus |
| Wednesday 7:00 PM | Midweek Service | Main Campus |
| Mon–Thu 5:00 AM | Corporate Prayer | Main Campus |

**Contact** — (318) 640-1865 · arisenow.church@gmail.com · prayer: arisechurchprayer@gmail.com

**Tagline** — `#YouBelongHere`

**Mission language, verbatim** — help people **CONNECT** with God and His family, **GROW** in God's character, **SERVE** in God's Church, and **SHARE** God's message.

---

## Color

| Role | Hex | Use |
|---|---|---|
| **Arise Red** | `#D6222D` | The only accent. Buttons, dashes, strips, badges, tags. |
| **Light Red** | `#DB3F48` | Small red text **on dark backgrounds only** |
| **Near-Black** | `#0A0A0C` | Dark sections, header, footer |
| **Scrim** | `#060608` | Photo overlays |
| **Bone** | `#F4F2F0` | Alternating light sections |
| **Paper** | `#FFFFFF` | Light sections |
| **Muted** | `#6A6A6E` | Body text on light |

**One accent, no exceptions.** No second accent color, no gradients as decoration, no colored shadows. If a design needs another hue, it belongs to the photograph, not the graphics.

**Why two reds:** `#D6222D` on `#0A0A0C` measures 3.89:1 — fine for large headlines, fails WCAG AA for label-sized text. `#DB3F48` is the same red lightened 13% and clears 4.5:1. Use it only for small text on dark.

---

## Type

| Role | Font | Size | Treatment |
|---|---|---|---|
| H1 | **Anton** | 44–88px | UPPERCASE, letterspacing 6, line height 1.02 |
| H2 | **Anton** | 28–52px | UPPERCASE, letterspacing 6 |
| H3 | **Anton** | 17–22px | UPPERCASE, letterspacing 4 |
| Kicker | **Oswald Medium** | 12px | UPPERCASE, letterspacing **30** |
| Body | **Oswald Light (300)** | 15.5–17px | line height 1.6 |
| Small | **Oswald Light** | 14.5px | line height 1.7 |
| Buttons | **Oswald SemiBold** | 12px | UPPERCASE, letterspacing 16 |

**Anton never below 18px.** It's a display face built for 148pt thumbnail headlines; small, it becomes an unreadable block.

**The wide letterspacing on kickers is the signature.** Tracking is what makes this read as Arise rather than generic bold-white-on-photo.

---

## Spacing

Every gap is one of: **8 · 16 · 24 · 32 · 48 · 64 · 96 · 128**. Nothing in between.

Section padding: 56–104px top and bottom, scaling with viewport.
Content column: max 1180px, centered, 20–56px side gutters.

This single rule does more for "looks designed" than any other decision here.

---

## Two signature devices

Both are lifted from the church's YouTube thumbnail system, so the website reads as the same brand as the channel.

### The double dash
Two red rectangles, **46 × 7px**, **16px apart**, `#D6222D`. Followed 80px later by an uppercase tracked kicker.

**Opens every section.** Replaces the generic centered heading.

### The skewed strip
A `#D6222D` rectangle **rotated −9°**, with text inside rotated **+9°** so it sits level while the box stays skewed. White Oswald SemiBold 12px, letterspacing 16, padding 9/20.

For attributions, speaker names, taglines. **Never for body copy.**

---

## Section rhythm

Alternate grounds down every page:

`white → #F4F2F0 → #0A0A0C → white → …`

Each section follows the same internal pattern:

1. Double dash + tracked uppercase kicker
2. Anton headline, uppercase, 1–2 lines
3. Body copy in Oswald Light
4. The content — grid, cards, or form
5. Optional skewed strip for attribution

---

## Photography

**Real photographs of real services. No stock, ever.**

The single loudest "rushed" signal is stock imagery sitting next to genuine photos. Pull frames from the church's own service footage: speaker mid-gesture, eyes open, lit.

**Fixed crops:** 4:5 ministries · 3:4 leaders · 16:9 events and campus cards · 1:1 homepage ministry tiles.

**Text over photography always needs a scrim** — a dark gradient beneath the text. Without it, legibility depends on whatever happens to be behind the words.

Hero scrim, left to right:
`rgba(6,6,8,.94) 0% → .86 42% → .34 74% → .52 100%`

Plus a floor gradient over the bottom 34%.

**Captions over photos are white, never red.** Photos vary too much in brightness for a small red label to stay legible.

---

## Homepage structure

| # | Section | Ground |
|---|---|---|
| 1 | **Hero** — full-bleed worship photo, left scrim, kicker, H1 "You Belong Here." with the period in red, welcome paragraph, two buttons. Service Times panel top right. | Photo + scrim |
| 2 | **Who We Are** — welcome copy, skewed strip with the pastors' names, then the four-verb pathway (01 Connect · 02 Grow · 03 Serve · 04 Share) as four columns under a 3px red rule | White |
| 3 | **Campuses** — two cards, photo above, red tag, address, service times table, directions link | Bone |
| 4 | **Ministries** — four 4:5 photo tiles, grayscale 28% / brightness 60%, caption block over a bottom gradient | Near-black |
| 5 | **What To Expect** — three columns, each opening with a 32×4px red bar: Parking, What To Wear, When To Arrive | Near-black |
| 6 | **Prayer Request** — the Beth Moore quote, attribution, button, photo alongside | White |
| 7 | **Give** — full red band, white text, white button with red text | Arise Red |
| 8 | **Footer** — three columns (Arise Church / Visit / Connect), bottom bar with copyright and service time | Near-black |

---

## Voice

**Direct, warm, unhurried, specific.**

- Say what something is. Don't tease it.
- No hype punctuation. Three exclamation marks is not the voice.
- Titles are always used: Apostle, Pastor, Minister, Elder.
- Second person is fine and good.
- **Avoid:** "you won't believe," "must watch," "this will change your life," anything that sounds like marketing.

**Use the church's own words wherever they exist.** Don't write new copy where live copy already says it.

---

## Accessibility, non-negotiable

- **4.5:1 minimum** for normal text, 3:1 for large. Verify, don't estimate.
- Text over photos requires a scrim.
- Real `<button>` and `<a>` elements, never styled divs.
- `alt` text from the content, never from the filename.
- Respect `prefers-reduced-motion`.
- Declare `color-scheme: light only` and pin every background explicitly — iOS in-app browsers force-darken pages and will otherwise turn dark text on white into dark text on black.

---

## What this replaces

The current site's problems, for context on what to avoid:

- Wix-default Helvetica instead of the brand faces
- Five palette colors instead of one accent
- Stock photography mixed with real
- Inconsistent image crops
- No spacing system
- Headings that skip levels, and pages with no H1
- Filenames serving as alt text
