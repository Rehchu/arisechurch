# Arise Church — Velo + CMS Integration Guide
**Your collections are live and populated.** This is how to bind them.

---

## What's already on your site

I created and filled four CMS collections via the API. Open **Editor → CMS** and you'll see them.

| Collection | Items | Fields |
|---|---|---|
| **Leaders** | **6** | `name` · `role` · `bio` · `photo` · `featured` · `sortOrder` |
| **Ministries** | **8** | `title` · `category` · `image` · `pageLink` · `comingSoon` · `sortOrder` |
| **Studies** | **2** | `title` · `description` · `speaker` · `image` · `videoUrl` · `sortOrder` |
| **PastEvents** | 0 — schema only | `title` · `image` · `pageLink` · `eventDate` · `sortOrder` |

Permissions on all four: **read = ANYONE**, write = ADMIN. Public read is what lets crawlers see the content.

> **If you already duplicated the site**, these are on the *original*. Tell me and I'll create them on the copy — I need its site ID.
> **If you duplicate after this**, they come along automatically.

`PastEvents` is empty because you haven't told me which of the fourteen past events to surface.

---

## Why repeaters instead of custom elements

A custom element renders **client-side**. Its text never exists in the server HTML.

You've already seen what that costs: your service-times dropdown was invisible to crawlers, and FindOpen and JoinMyChurch published invented hours because they couldn't read yours.

A **repeater is a native Wix element.** Wix server-renders it, so the content is in the HTML on first response — indexed, shareable, readable by scrapers. You still drive everything from code.

**Rule of thumb:** if it's words you want found, use a repeater. If it's a tool or a widget, use a custom element.

---

## PART 1 — Build the Leaders page

### 1. Add the repeater

**Add → List & Grid → Repeater.** Pick any layout; you'll restyle it. Set it to **Grid, 3 columns**.

### 2. Build one card, then Wix clones it

Inside **one** repeater item, place:

| Element | ID | Settings |
|---|---|---|
| Image | `leaderPhoto` | 3:4 ratio, fill crop |
| Text | `leaderRole` | Oswald 10px, uppercase, letterspacing 16, white on `#D6222D`, padding 5×10 |
| Text | `leaderName` | Anton 20px, uppercase, letterspacing 4 |
| Text | `leaderBio` | Oswald Light 14.5px, colour `#6A6A6E`, line height 1.7 |

Set element IDs in the Properties panel (right-click → View Properties). **The code depends on these exact IDs.**

### 3. Page code

**Pages → Leaders → ⋮ → Page Code.** Paste:

```javascript
import wixData from 'wix-data';

$w.onReady(async () => {
  try {
    const { items } = await wixData.query('Leaders')
      .ascending('sortOrder')
      .limit(50)
      .find();

    $w('#repeater1').onItemReady(($item, leader) => {
      $item('#leaderName').text = leader.name || '';
      $item('#leaderRole').text = leader.role || '';
      $item('#leaderBio').text  = leader.bio  || '';

      if (leader.photo) {
        $item('#leaderPhoto').src = leader.photo;
        $item('#leaderPhoto').alt = leader.name || 'Arise Church leader';
        $item('#leaderPhoto').show();
      } else {
        $item('#leaderPhoto').collapse();
      }
    });

    $w('#repeater1').data = items;
  } catch (err) {
    console.error('Leaders load failed:', err);
  }
});
```

> **Always set `.alt` from the data.** That's what fixes the filename-as-alt-text problem across the whole site — one line, every leader.

### 4. Feature the Sanders

They're the lead couple and their card should be wider. Two options:

**Simple:** leave them in the repeater; they read first because `sortOrder` is 1.

**Better:** put a separate static section above the repeater for the Sanders, and filter them out of the grid:

```javascript
const { items } = await wixData.query('Leaders')
  .eq('featured', false)      // grid gets everyone except the Sanders
  .ascending('sortOrder')
  .find();

const featured = await wixData.query('Leaders').eq('featured', true).find();
if (featured.items.length) {
  const f = featured.items[0];
  $w('#featName').text  = f.name;
  $w('#featRole').text  = f.role;
  $w('#featBio').text   = f.bio;
  $w('#featPhoto').src  = f.photo;
  $w('#featPhoto').alt  = f.name;
}
```

---

## PART 2 — Ministries page

Same repeater pattern, plus a **Coming Soon** badge and conditional linking.

Elements inside the item: `minImage` · `minTitle` · `minCategory` · `minBadge` (text, white on `#D6222D`) · `minLink` (a transparent Button covering the card).

```javascript
import wixData from 'wix-data';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(async () => {
  const { items } = await wixData.query('Ministries')
    .ascending('sortOrder')
    .find();

  $w('#repeater1').onItemReady(($item, m) => {
    $item('#minTitle').text    = m.title || '';
    $item('#minCategory').text = m.category || '';
    $item('#minImage').src     = m.image;
    $item('#minImage').alt     = m.title || 'Arise Church ministry';

    if (m.comingSoon) {
      $item('#minBadge').text = 'Coming Soon';
      $item('#minBadge').show();
      $item('#minLink').hide();                 // no dead link
    } else {
      $item('#minBadge').hide();
      $item('#minLink').show();
      $item('#minLink').onClick(() => {
        if (m.pageLink) wixLocationFrontend.to(m.pageLink);
      });
    }
  });

  $w('#repeater1').data = items;
});
```

**This is what kills the four dead "Learn More" buttons for good.** Not by deleting them — by making the data decide. Build a ministry's page later, flip `comingSoon` to false in the CMS, add the `pageLink`, and the card starts working. No layout edit.

---

## PART 3 — Studies page (Training)

```javascript
import wixData from 'wix-data';

$w.onReady(async () => {
  const { items } = await wixData.query('Studies').ascending('sortOrder').find();

  $w('#repeater1').onItemReady(($item, s) => {
    $item('#studyTitle').text  = s.title || '';
    $item('#studySpeaker').text = s.speaker || '';
    $item('#studyDesc').text   = s.description || '';
    $item('#studyImage').src   = s.image;
    $item('#studyImage').alt   = s.title || 'Arise Church Bible study';

    if (s.videoUrl) {
      $item('#studyBtn').link = s.videoUrl;
      $item('#studyBtn').target = '_blank';
      $item('#studyBtn').show();
    } else {
      $item('#studyBtn').hide();
    }
  });

  $w('#repeater1').data = items;
});
```

Video URLs are blank — I don't have the links for those two studies. Add them in the CMS and the buttons appear on their own.

---

## PART 4 — Homepage: the ministries strip

Same collection, first four only:

```javascript
import wixData from 'wix-data';

$w.onReady(async () => {
  const { items } = await wixData.query('Ministries')
    .eq('comingSoon', false)
    .ascending('sortOrder')
    .limit(4)
    .find();

  $w('#homeMinRepeater').onItemReady(($item, m) => {
    $item('#hmTitle').text = m.title;
    $item('#hmCat').text   = m.category;
    $item('#hmImage').src  = m.image;
    $item('#hmImage').alt  = m.title;
  });

  $w('#homeMinRepeater').data = items;
});
```

One collection, two pages, always in sync.

---

## PART 5 — Service Times custom element

**The one place a custom element is right.** It needs to escape section boundaries, and its content is already duplicated in the homepage JSON-LD, so crawlers have the times regardless.

1. **Velo sidebar → Public → `custom-elements/`** — paste `arise-service-times-final.js`
2. **Add → Embed Code → Custom Element**
3. **Choose Source → Velo file** — *not* Server URL. Velo files have no URL; that's the step that tripped you up.
4. **Tag Name:** `arise-service-times`
5. Place top-right of the hero, size **360 × 80**
6. **Publish**

**It will look clipped in Editor and Preview.** Wix renders custom elements in an iframe there. Only the published site puts it in the real DOM. Check live.

> ⚠️ Do **not** paste this into `masterPage.js` or a page's code file. Velo page code runs server-side first, where `document` and `HTMLElement` don't exist — that's the exact error you hit.

---

## PART 6 — Site-wide code (masterPage.js)

Runs on every page. Keep it small:

```javascript
import wixWindowFrontend from 'wix-window-frontend';

$w.onReady(() => {
  // nothing global needed yet — leave this file empty
  // until you have behaviour that genuinely belongs on every page
});
```

**Resist filling this.** Page-specific code belongs in the page's own file.

---

## PART 7 — Free elements you need

All included with your Premium plan. No paid apps.

| Element | Used for |
|---|---|
| **Repeater** | Leaders, Ministries, Studies, Past Events |
| Section / Strip | Every band down the page |
| Container Box | Cards, groupings |
| Text | Every heading and paragraph |
| Image | Photos |
| Button | CTAs, card links |
| Vector Art | The red double-dash marker |
| Divider | Section rules |
| **Wix Forms** | Contact, Serve signup |
| Menu | Navigation |
| Lightbox | Beliefs, Promises popups |
| Video Box | Sermon player |
| **Custom Element** | Service Times only |
| HTML iframe | Map embeds |

**Vector Art trick:** the red double-dash is two rectangles, 46×7px, 16px apart, filled `#D6222D`. Group them and save as a reusable element — you'll place it on every section.

---

## PART 8 — The order

1. Global colors, fonts, logo *(~20 min, before any page)*
2. **Leaders** — collection is populated, best place to learn the repeater pattern
3. **Ministries** — same pattern plus conditional logic
4. **Home** — reuses the Ministries repeater
5. Contact, About, Sermons, Events
6. Serve, Children's, Youth, Outreach, Lead Network
7. Bible Search, Studies
8. New: Plan Your Visit, Campuses

**Start with Leaders, not Home.** Home is the biggest page and uses the pattern you haven't learned yet. Leaders is one repeater with six rows already in place — get it working there, then Home is assembly.

---

## Gotchas worth knowing before you hit them

**Element IDs must match the code exactly.** Wix names them `#text1`, `#image3`. Rename them in Properties or the code silently does nothing.

**`onItemReady` before `.data`.** Set the handler first, assign data second. Reversed, the first render is blank.

**Images:** `.src` accepts both `wix:image://` and `https://` URLs. Yours are stored as https — fine.

**Test on the published site.** Preview doesn't reflect custom elements, and repeaters sometimes behave differently there.

**Repeaters cap at 1,000 items.** Irrelevant here, but worth knowing.

---

## What I still need

1. **Which past events** for the archive — `PastEvents` is empty until you pick
2. **Video URLs** for the two studies
3. **Service end times** — completes the structured data
4. **Site ID of your duplicate**, if you already made it, so I can create the collections there too

Tell me when Leaders is live and I'll crawl it — I'll confirm the repeater content is in the server HTML, which is the whole point of doing it this way.
