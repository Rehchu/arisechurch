# ARISE CHURCH WEBSITE — PROJECT HANDOFF
**arisecenla.church · Wix classic Editor · Velo custom-element rebuild**
Handoff written Aug 23, 2026. Paste this into a new chat as the first message.

---

## 0. HOW TO USE THIS

**Start the new chat by uploading this file** and saying:

> "This is the handoff for my church website build. Read it, then let's continue."

**Before you leave the old chat, download these files** — they live in that
conversation's sandbox and cannot be moved automatically. Scroll to the most
recent file cards and save every one:

```
pages/arise-home.js          pages/arise-header.js
pages/arise-footer.js        pages/arise-about.js
pages/arise-contact.js       pages/arise-leaders.js
pages/arise-ministries.js    pages/arise-sermons.js
pages/arise-events.js        pages/arise-serve.js
pages/arise-bible.js         pages/arise-form.js
pages/arise-connect.js       pages/arise-creatives.js
pages/arise-classes.js       arise-service-times-final.js

CREATIVES-SETUP.md   PAGES-CHECKLIST.md   FORMS-SETUP.md
FINAL-BUILD-PLAN.md  site-map-complete.md VELO-CMS-GUIDE.md
```

Put them in one folder. Upload the ones you're actively working on to the new
chat — not all at once, just what that session needs.

**Also free up context in the new chat:** turn OFF every connector except
**Wix**. Canva, Stripe, Supabase, Cloudflare and the rest each load large tool
definitions, and they were a big part of why the old chat filled up.

---

## 1. STANDING RULES — these never change

1. **No design or code change without my explicit permission.** Ask lots of
   questions first.
2. **Always write "Arise Church"** — never bare "Arise".
3. **Use the text already live on the site.** Do not invent marketing copy.
4. **One page at a time**, with a mockup for approval before implementing.
5. **The site must stay functional** as a church website throughout.
6. **Nothing gets dropped** — every page reachable from any menu keeps a home.

---

## 2. IDs AND SAFETY NET

| Thing | Value |
|---|---|
| **LIVE site ID** | `5fff0585-70f7-4075-9289-b6e4e3d38059` |
| Domain | arisecenla.church (Premium) |
| Abandoned duplicate | `47f04120-ff90-40fb-89dd-b284a293054f` — do not use |
| **RESTORE POINT** | Wix Site History version **Jul 13, 2026, 8:31 PM** |
| Automation ID | `0bdad8ca-eab9-426e-8d72-afcfe1f8d40a` (revision 22, ACTIVE) |
| YouTube channel | `UCGS9j7B_prcJkbTNgzlGrKg` |
| Livestream playlist | `UULVGS9j7B_prcJkbTNgzlGrKg` |
| Canva brand kit | `kAGtjOFMWFA` |

**Wix page IDs:** home `c1dmp` · leaders `gliws` · about `nlpo7` · contact
`rjf74` · sermons `sg492` · events `c24vq` · ministries `d2xew` · arise-bible
`uevmu` · serve `j9kva` · outreach `j03bc` · devotional `o7wyk` · childrens
`ih40z` · youth `gqfab` · tithes-and-offerings `p5rxw` ·
information-desk-registration `dnzka`

---

## 3. THE ARCHITECTURE

Wix exposes **no REST API** for layout, sections, colours, fonts, page
management, or redirects. Those are Editor-only. So whole pages ship as **Velo
custom elements** instead of being dragged together by hand.

### The four-layer pattern

```
CMS collection  →  backend web module  →  page code  →  custom element
(Wix Data)         (content.web.js)       ($w.onReady)   (renders the HTML)
                                          sets data-* attribute
```

**This is the key trick.** A custom element cannot call `wix-data` directly.
But page code CAN — so page code queries the backend, JSON-stringifies the
result, and sets it as a `data-*` attribute on the element. The element reads
the attribute and renders. That's how Leaders, Ministries, Events, Creatives
and Classes are data-driven despite the limitation.

### Forms take a different route

A custom element **cannot** call a Velo backend module, but it **can** `fetch`
a **Velo HTTP Function** — a real same-origin URL at `/_functions/...`.

```
arise-form element  →  POST /_functions/ariseForm  →  backend/http-functions.js
                                                        ├─ save to FormSubmissions (CMS)
                                                        └─ trigger the email
```

Saving before emailing means **nothing is lost if mail fails**.

### Non-negotiable rules of this architecture

- Element files go in **`public/custom-elements/`** — exactly that folder. A
  file in plain `public/` will not appear in the Choose Source dropdown.
- Custom elements render **inside an iframe in Editor AND Preview**. Only the
  **published** site shows them correctly. This is normal, not a failure.
- The tag only reaches the live site on **Publish**, not Save.
- **`/_functions/` URLs do not work in Preview.** Published only.
- Element code pasted into `masterPage.js` or a page file throws
  *"document is not defined"* / *"HTMLElement is not defined"* — Velo page code
  runs server-side first. It belongs ONLY in `public/custom-elements/`.
- A half-configured element (no source selected) emits **no tag at all** and
  looks identical in the Editor. Fix: delete it, add a fresh one.
- **Check the element ID on every page** — right-click → View Properties.
  Classes turned out to be `customElement5`, not `customElement1`.
- **Custom-element text is invisible to Google.** It is not in the server HTML.
  Anything that matters for search needs native Wix text alongside it.

---

## 4. FILE INVENTORY

### Custom elements — `public/custom-elements/`

| File | Tag(s) | Page |
|---|---|---|
| `arise-home.js` | `arise-home` | Home |
| `arise-header.js` | `arise-header` | Every page (in the header) |
| `arise-footer.js` | `arise-footer` | Every page (in the footer) |
| `arise-about.js` | `arise-about` | About (incl. both popups) |
| `arise-contact.js` | `arise-contact` | Contact |
| `arise-leaders.js` | `arise-leaders` | Leaders |
| `arise-ministries.js` | `arise-ministries` | Ministries |
| `arise-sermons.js` | `arise-sermons` | Sermons |
| `arise-events.js` | `arise-events` | Events |
| `arise-serve.js` | `arise-serve` | Serve |
| `arise-bible.js` | `arise-bible` | Bible Search |
| `arise-form.js` | `arise-form` | Reusable — `data-form="contact\|serve\|prayer"` |
| `arise-connect.js` | `arise-connect` | /connect-groups |
| `arise-creatives.js` | `arise-creatives` | **Serves all 7 Creative Arts pages** |
| `arise-classes.js` | `arise-classes` | Classes |
| `arise-service-times-final.js` | `arise-service-times` | Home hero — LIVE and working |

### Backend — Velo `backend/`

| File | Exports |
|---|---|
| `content.web.js` | `getLeaders` · `getMinistries` · `getConnectGroups` · `getCreatives` · `getServePositions` |
| `gallery.web.js` | `getProjectPhotos` |
| `classes.web.js` | `getPrograms` |
| `events.web.js` | `getEvents` — **not installed yet** |
| `http-functions.js` | `post_ariseForm` |
| `youtube.jsw` | `getLiveVideoId` · `getCurrentSeries` |
| ~~`bibleApis.jsw`~~ | Delete it — `arise-bible.js` calls bible-api.com directly from the browser |

### CMS collections

| Collection | Fields | State |
|---|---|---|
| `Leaders` | name, role, bio, shortBio, photo, featured, sortOrder | 6 items |
| `Ministries` | title, category, image, pageLink, comingSoon, sortOrder | 8 items |
| `PastEvents` | title, image, pageLink, eventDate, sortOrder | **EMPTY** — awaiting your picks |
| `Studies` | title, description, speaker, image, videoUrl, sortOrder | 2 items, videoUrl blank |
| `FormSubmissions` | formType, name, email, phone, subject, message, position, handled | ADMIN-only |
| `PageContent` | contentKey, page, label, text, where | CSV built — lets copy be edited without touching code |

Permissions on the content collections: read = ANYONE, insert/update/remove = ADMIN.

---

## 5. CODE TO CARRY OVER

### 5a. `backend/http-functions.js` — the one-line change still pending

```javascript
const ALLOWED = ['contact', 'serve', 'prayer', 'connect-host', 'connect-join'];
```

Reference shape of the whole file (compare against what's in your Velo backend
now before overwriting — this is the structure, not a byte-for-byte copy):

```javascript
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { triggeredEmails } from 'wix-crm-backend';

const ROUTES = {
  contact:        'arisenow.church@gmail.com',
  serve:          'arisenow.church@gmail.com',
  prayer:         'arisechurchprayer@gmail.com',
  'connect-host': 'arisenow.church@gmail.com',
  'connect-join': 'arisenow.church@gmail.com'
};

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 2000);
}

export async function post_ariseForm(request) {
  try {
    const body = await request.body.json();

    const formType = clean(body.formType, 40).toLowerCase();
    if (!ROUTES[formType]) return badRequest({ body: { error: 'unknown form' } });

    const name    = clean(body.name, 120);
    const email   = clean(body.email, 200);
    const message = clean(body.message, 4000);

    if (!name || !email) return badRequest({ body: { error: 'name and email required' } });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest({ body: { error: 'invalid email' } });
    }

    const record = {
      formType, name, email,
      phone:    clean(body.phone, 60),
      subject:  clean(body.subject, 200),
      position: clean(body.position, 120),
      message,
      handled:  false
    };

    // 1. Always store first — nothing is lost even if email fails.
    await wixData.insert('FormSubmissions', record, { suppressAuth: true });

    // 2. Then notify.
    return ok({ body: { ok: true } });

  } catch (err) {
    console.error('ariseForm failed:', err);
    return serverError({ body: { error: 'server error' } });
  }
}
```

> **NOTE THE REGEX.** `\s`, one backslash. The Connect file shipped with `\\s`
> and rejected every valid email address. If a form ever refuses a good
> address, check this first.

### 5b. `backend/events.web.js` — tail of the file (get the full version from the old chat)

```javascript
export const getEvents = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const query = auth.elevate(wixEventsV2.queryEvents);
      const res = await query({ fields: ['DETAILS', 'TEXTS', 'REGISTRATION', 'URLS'] })
        .ne('status', 'CANCELED')
        .limit(50)
        .find();

      const raw = res.items || res.events || [];

      // TEMPORARY -- shows the real field names. Delete once confirmed.
      if (raw.length) {
        console.log('Events: first ->', JSON.stringify(raw[0]).slice(0, 1200));
      }

      const upcoming = [], past = [];
      raw.forEach((ev) => {
        const s = shape(ev);
        if (!s.url) return;
        if (ev.status === 'UPCOMING' || ev.status === 'STARTED') upcoming.push(s);
        else if (ev.status === 'ENDED') past.push(s);
      });

      past.reverse();
      return { upcoming: upcoming, past: past.slice(0, 8) };

    } catch (err) {
      console.error('getEvents failed:', err);
      return { upcoming: [], past: [] };
    }
  }
);
```

### 5c. Events → Page Code (complete)

```javascript
import { getEvents } from 'backend/events.web';

$w.onReady(async () => {
  const data = await getEvents();
  console.log('Events: ' + data.upcoming.length + ' upcoming, ' + data.past.length + ' past');

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-events', JSON.stringify(data));
      console.log('Events: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Events: element never became ready');
  };
  fill(1);
});
```

**This retry-until-ready pattern is the template for every data-driven page.**
Swap the import, the element ID, and the attribute name.

### 5d. Connect Groups season constants — top of `arise-connect.js`

```javascript
const SEASON = {
  name:   'Fall Connect Groups',
  starts: 'the week of September 14',
  ends:   'the week of November 16',
  hostBy: 'September 2'
};
```

Next season, change those four lines. Nothing else.

### 5e. YouTube playlists without an API key

Take the channel ID, drop the leading `UC`, prefix:

| Prefix | Gives you |
|---|---|
| `UU` | all uploads including Shorts |
| `UULF` | long-form only |
| **`UULV`** | **livestreams only** ← the featured player uses this |
| `UUSH` | Shorts only |

Embed as `videoseries?list=UULVGS9j7B_prcJkbTNgzlGrKg`.
Live-vs-recorded without a key: fetch `youtube.com/channel/<ID>/live` and read
the canonical link — a `/watch?v=` URL means live.
**The channel RSS feed now 404s — do not rely on it.**

---

## 6. AUTOMATIONS — current state

Automation `0bdad8ca-eab9-426e-8d72-afcfe1f8d40a`, revision 22, ACTIVE.

```
Form submitted
├─ prayer?  ─→ confirmation → the sender
│              team email    → arisenow.church@gmail.com
│              Wix Inbox
├─ contact? ─→ same three
├─ serve?   ─→ same three
└─ else     ─→ same three   (connect-host, connect-join)
```

- 4 team emails → `arisenow.church@gmail.com`, with `triggerContactExcluded: true`
  so the sender never gets a staff alert.
- 4 confirmations → the sender via `contactId`, staff removed so no duplicates.
- 4 inbox actions → `PARTICIPANT_TO_BUSINESS`, not silent.

**What was wrong before:** every email — confirmations *and* team alerts — was
addressed to the same contributor role, so team notifications never fired at all.

**Still to do:** five legacy form automations are still ACTIVE and will error
silently once their Wix Forms are deleted — *"Thank visitors who submit a
form"*, *"Contact 9"*, *"Home Page Contact 2"*, *"Application Form"*,
*"Information Desk Registration Form"*.

---

## 7. TASK QUEUE

### Time-critical — host signups close **September 2**
- [ ] Paste `arise-connect.js`, `arise-header.js`, `arise-footer.js`
- [ ] Add `connect-host` and `connect-join` to `ALLOWED` in `http-functions.js`
- [ ] Create the `/connect-groups` page and place the element
- [ ] Test a host signup end to end
- [ ] Swap the Connect Groups tile image in CMS → Ministries (currently using
      the Youth banner as a placeholder)
- [ ] **Consider trimming the host form** — it now requires five fields (first
      name, last name, phone, email, venue). That's a lot of friction for a
      volunteer signup with a deadline.

### Next
- [ ] Install `backend/events.web.js` + Events page code — events are still hardcoded
- [ ] Send me the `Events: first ->` console line so the field mapping can be locked
- [ ] "Past Sermons" → "Sermons" rename across five files
- [ ] Church culture video: upload to Media Manager, paste the ID into the
      constant at the top of `arise-home.js` (muted autoplay on mobile,
      click-to-play on desktop; falls back to the photo collage if left empty)
- [ ] Creative Arts: create the eight pages in the Editor per `CREATIVES-SETUP.md`

### Older carry-overs
- [ ] **Native Wix H1 + campus addresses on the homepage** — crawlers cannot see
      custom-element text, and the homepage currently has no H1 and no meta
      description
- [ ] Site theme colours (Wix assigned a default maroon/tan/green theme)
- [ ] The Arise Hub video is sitting as a project cover rather than an item
- [ ] Disable the five legacy automations

### Waiting on you (content)
- [ ] Service **end** times — needed to finish `openingHoursSpecification` in the JSON-LD
- [ ] Which past events to surface (`PastEvents` collection is empty)
- [ ] The two `Studies` video links
- [ ] Kristina's bio, if she goes back on Leaders
- [ ] Whether the Serve form really has two email fields

---

## 8. GOTCHAS THAT COST REAL TIME

**Test rendered output, not source.** Two contrast bugs were completely
invisible to CSS analysis: a dangling comma chained a colour rule into a
`background:#D6222D` rule, and failed `<img>` elements render their **alt text**
in the inherited colour — alt text is not a DOM node, so no CSS audit catches it.
Render with Playwright and *look at the screenshot*.

**You review on an iPhone in the Facebook in-app browser in dark mode.** It
force-darkens backgrounds while leaving explicitly-set text colours dark, so
white sections turn near-black with black text on them. Every mockup needs
`<meta name="color-scheme" content="light">`, `:root{color-scheme:light only}`,
an explicit `background-color` on every surface, and a
`@media (prefers-color-scheme: dark)` block. Test at 390px with dark forced.

**Never infer image-to-person mapping from DOM order on Wix.** Absolute
positioning means document order is not visual order. Download the images and
look at them. (Bryant and Vanessa share one portrait, which threw every
photo one slot off.)

**Wix classic Editor has no text-transform control.** Uppercase must be typed
literally.

**Static Wix pages keep separate draft and published SEO revisions.** Set Item
SEO Tags must be called twice — once plain, once with `publish:true` — and the
API response is not proof the live page changed. Always verify by fetching the
live URL.

**Do not overwrite the Bible Search page code carelessly** — it runs your own
Velo tool. It supports 16 translations (KJV, WEB, ASV, BBE, YLT, Darby, DRA,
OEB ×2, WEBBE, Cherokee NT, Chinese Union, Clementine Vulgate, Almeida,
Romanian Cornilescu, Czech kralická). **No NIV, no ESV.**

**I have no browser tools.** Claude in Chrome is a separate surface. The working
loop is: you build → paste screenshots when stuck → publish → I crawl the live
URL and use the Wix API.

**Re-download files after every fix.** You have opened stale copies before.

---

## 9. BRAND QUICK REFERENCE

| | |
|---|---|
| Accent | **Arise Red `#D6222D`** — the only accent. No second accent, no gradient, no coloured shadow |
| Small red text on dark | `#DB3F48` — brand red is 3.89:1 on near-black and fails AA |
| White | `#FFFFFF` |
| Near-black | `#0A0A0C` · Scrim `#060608` |
| Headlines | **Anton**, always uppercase |
| Kicker | **Oswald Medium** for "ARISE CHURCH" |
| Body/strips | Oswald Regular. Bebas Neue in reserve |
| Section marker | Two red dashes + uppercase tracked kicker |
| Photography | Real service photography, left-scrimmed. **No stock photos** |
| Crops | 4:5 ministries · 3:4 leaders · 16:10 info |
| Voice | Direct, warm, unhurried, specific. No hype, no teasing, no marketing voice |

**Service times:** Sunday 10:30am · Monday 7pm (**Glory Night**) · Wednesday 7pm
· Corporate Prayer 5am **Monday–Thursday**

**Campuses:** MAIN — 501 Ates Road, Pineville LA 71360 · SECOND — 5305 North
Blvd, Alexandria LA 71301. Both hold Sunday service; Main hosts everything else.
