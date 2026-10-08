# Arise Church — Email Build Spec

For building the form emails in a drag-and-drop editor. Four emails, shared styling, exact values.

---

## Shared rules — apply to all four

### Colors

| Use | Hex |
|---|---|
| Brand red — bars, buttons, accents | **`#D6222D`** |
| Light red — small red text **on black only** | **`#DB3F48`** |
| Near-black — headers, footers | **`#0A0A0C`** |
| Bone — quote blocks, page background | **`#F4F2F0`** |
| Body text on white | **`#4A4A4E`** |
| Headings / strong text on white | **`#0A0A0C`** |
| Muted text on black | **`#8D8D92`** |

> **Never put `#D6222D` text on black** — it fails contrast at small sizes. Use `#DB3F48` there.

### Font

**Arial** (or Helvetica) throughout. Not Anton, not Oswald.

Email clients don't load web fonts — the site's fonts would silently fall back and look broken. Bold Arial with wide letterspacing gets close enough.

| Element | Size | Weight | Letterspacing | Case |
|---|---|---|---|---|
| Big headline | 34px | Bold | 1px | UPPERCASE |
| Section heading | 27px | Bold | 1px | UPPERCASE |
| Small red label | 11px | Bold | **3px** | UPPERCASE |
| Field label | 11px | Bold | **2px** | UPPERCASE |
| Body | 16px | Regular | 0 | Sentence |
| Greeting | 17px | Regular | 0 | Sentence |
| Button | 12px | Bold | **3px** | UPPERCASE |
| Footer small | 13px | Regular | 0 | Sentence |

**The wide letterspacing is the signature.** If the builder won't do letterspacing, use bold uppercase and accept it.

### Layout

- Width **600px**, centred, on a `#F4F2F0` background
- Content padding **32px** left and right
- Line height **1.7** on body text

### Buttons

Rectangular, **no rounded corners**. Fill `#D6222D`, white bold text, padding **15px vertical / 32px horizontal**.

### The red double-dash

Appears above the small red label in every header. Two red rectangles, **34×5px**, **12px apart**, `#D6222D`.

If the builder can't do that, use a single **80×5px** red bar instead.

---

# EMAIL A — Staff alert

**Trigger:** `formSubmission` → arisenow.church@gmail.com
**Subject:** `New {{formType}} submission from {{name}}`

| # | Block | Content |
|---|---|---|
| 1 | Divider | Solid `#D6222D`, 6px tall, full width |
| 2 | Header — bg `#0A0A0C`, padding 28/32 | Double-dash · label **NEW SUBMISSION** in `#DB3F48` 11px · heading **{{formType}} FORM** white 27px |
| 3 | Detail rows — white bg | Five rows, thin `#E6E4E2` line between each |
| 4 | Quote block | bg `#F4F2F0`, **5px `#D6222D` left border**, padding 22/24 |
| 5 | Button | **REPLY TO {{name}}** → `mailto:{{email}}` |
| 6 | Footer — bg `#0A0A0C` | "Sent from the website form · also saved in CMS › Form Submissions" in `#8D8D92` 12px |

**Detail rows** — label left (110px wide, `#D6222D`, 11px bold, 2px spacing), value right (`#0A0A0C`, 16px):

`NAME` {{name}} · `EMAIL` {{email}} · `PHONE` {{phone}} · `SUBJECT` {{subject}} · `POSITION` {{position}}

**Quote block:** label `MESSAGE` in `#D6222D`, then {{message}} at 16px.

---

# EMAIL B — Contact confirmation

**Trigger:** `formReceived` where `formType` = **contact**
**Subject:** `We got your message`

| # | Block | Content |
|---|---|---|
| 1 | Divider | `#D6222D`, 6px |
| 2 | Hero — bg `#0A0A0C`, padding 40/32 | Double-dash · **ARISE CHURCH** in `#DB3F48` · headline **WE GOT YOUR MESSAGE.** white 34px — **the full stop in `#D6222D`** |
| 3 | Body — white | See copy below |
| 4 | Quote block | bg `#F4F2F0`, 5px red left border. Label `WHAT YOU SENT`, then {{message}} |
| 5 | Line | One sentence, see below |
| 6 | Times row | Thin lines above and below. Left: **Sunday Service** / 10:30 AM · both campuses. Right: **Glory Night** / Mondays 7:00 PM |
| 7 | Button | **PLAN YOUR VISIT** → `https://www.arisecenla.church/contact` |
| 8 | Footer | Standard, below |

**Body copy:**

> Hi {{name}},
>
> Thanks for reaching out to Arise Church. We've got your message and someone will get back to you soon.
>
> If you need to add anything, just reply to this email.

**Block 5:**

> We'd love to see you on a Sunday — and you're welcome exactly as you are.

---

# EMAIL C — Serve confirmation

**Trigger:** `formReceived` where `formType` = **serve**
**Subject:** `Thanks for signing up to serve`

Same structure as B, with these changes:

**Hero:** label **SERVE WITH US** · headline **THANKS FOR STEPPING UP.**

**Body copy:**

> Hi {{name}},
>
> We've got your sign-up, and someone from that team will reach out about next steps.
>
> You don't need experience — just a willingness to show up. We'll take it from there.

**Quote block** — label `YOU SIGNED UP FOR`, then:
- **{{position}}** on its own line, **19px bold `#0A0A0C`**
- then {{message}} at 15px in `#4A4A4E`

**Block 5:** "Questions before then? Just reply to this email."

**Button:** **SEE ALL MINISTRIES** → `https://www.arisecenla.church/ministries`

---

# EMAIL D — Prayer confirmation

**Trigger:** `formReceived` where `formType` = **prayer**
**Subject:** `We're praying with you`

**Deliberately quieter than the others.** No button, no service-times row, no invitation push. Someone sending a prayer request is in a different frame of mind, and a marketing email would land badly.

| # | Block | Content |
|---|---|---|
| 1 | Divider | `#D6222D`, 6px |
| 2 | Hero | Double-dash · **PRAYER REQUEST** in `#DB3F48` · headline **WE'RE PRAYING WITH YOU.** — full stop in `#D6222D` |
| 3 | Body | See below |
| 4 | Quote block | Label `YOUR REQUEST`, then {{message}} |
| 5 | Thin line, then one sentence | See below |
| 6 | One more line | See below |
| 7 | Footer | **Main Campus address only**, no second campus |

**Body copy:**

> Hi {{name}},
>
> Thank you for trusting us with this. Our prayer team has your request, and we're praying.
>
> You're not carrying it alone.

**Block 5:** "If there's more you'd like us to know, just reply to this email."

**Block 6:** "Corporate Prayer meets Monday to Thursday at 5:00 AM at the Main Campus. You're welcome any morning."

---

## Footer — B and C

Background `#0A0A0C`, padding 28/32.

- **ARISE CHURCH** — white 13px bold, 2px letterspacing, uppercase
- 501 Ates Road, Pineville, LA 71360 — `#8D8D92` 13px
- 5305 North Blvd, Alexandria, LA 71301 — `#8D8D92` 13px
- **arisecenla.church** — `#DB3F48` 12px bold, 2px spacing, uppercase, links to the site
- "This is an automatic confirmation — a real person will reply separately." — `#6A6A6E` 11px

**Email D:** same, but Main Campus address only and no website link.

**No phone number in any of them.**

---

## Variables

`formType` · `name` · `email` · `phone` · `subject` · `position` · `message`

Insert with the builder's variable picker, not by typing `{{name}}`.

---

## If the builder can't branch on formType

Use **Email B** for all three confirmations. It reads fine across the board.

Better a working general email than a clever broken one — but if branching is available, **D is worth having separately.** The tone difference matters most there.

---

## Before going live

Send yourself one of each and **open them on your phone in Gmail.** That's where most people will read them, and it's the fastest way to catch anything that didn't survive the builder.
