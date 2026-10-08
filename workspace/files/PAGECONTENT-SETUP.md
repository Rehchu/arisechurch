# Page Content — making CMS edits actually show

**This is the piece that was missing.** `PageContent` existed but nothing read it, so your Wednesday and prayer times went in and nothing changed. Now they will.

---

## What I already did

**Deleted `Import2`** — 74 rows, every key duplicated because the CSV was imported twice.

**Created `PageContent` properly** with 37 clean rows, no duplicates. Nothing to import; it's already populated.

---

## 1. Add to `backend/content.web.js`

```javascript
/* Page copy and images. Edit in CMS -> Page Content. */
export const getPageContent = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('PageContent')
        .limit(200)
        .find({ suppressAuth: true });

      const map = {};
      res.items.forEach((r) => {
        if (!r.contentKey) return;
        map[r.contentKey] = {
          text: (r.text || '').trim(),
          image: imgUrl(r.image) || (r.imageUrl || '')
        };
      });
      return map;

    } catch (err) {
      console.error('getPageContent failed:', err);
      return {};
    }
  }
);
```

`imgUrl` is already in that file.

---

## 2. Add to EVERY page's code

Same three lines on every page, alongside whatever's already there:

```javascript
import { getPageContent } from 'backend/content.web';

// ...inside $w.onReady, after your existing calls:
  try {
    const content = await getPageContent();
    console.log('Content: ' + Object.keys(content).length + ' keys');
    $w(EL).setAttribute('data-content', JSON.stringify(content));
  } catch (err) {
    console.error('Content load failed:', err);
  }
```

**Use the same `EL` that page already uses.** If the page has no page code yet, it needs the retry wrapper — see any existing page for the pattern.

---

## 3. Then it just works

Change `site.times.second.midweek` in the CMS from blank to `Wednesday 6:30 PM`, refresh, and it appears on Home and Contact. No republish.

---

## How it works

The markup carries invisible tags. `data-ck` for text, `data-ci` for images:

```html
<b data-ck="site.times.sunday.main">10:30 AM</b>
```

When the CMS value arrives it replaces the contents. **Empty or missing keys are left alone**, so the built-in wording always shows if the CMS has nothing to say. A bad CMS edit can't produce a blank page.

---

## What's wired right now

| Page | Editable |
|---|---|
| **Home** | Hero kicker + paragraph, all three What To Expect cards, all four campus times, both campus photos |
| **Contact** | All four campus times |
| **Serve** | Intro paragraph |
| **Connect Groups** | Intro paragraph |
| **Creative Arts** | Intro paragraph |
| **Classes** | Intro paragraph |
| **Children's** | Welcome graphic, kids photo, Superkid logo |
| **Youth** | Banner image |
| **Outreach** | Supplies graphic |
| **Lead Network** | Both minister photos |

**All 18 elements can receive content** — these are just the ones with tagged targets so far. Adding another is a CMS row plus one `data-ck` attribute.

---

## The two images columns

**`imageUrl`** is the image in use today, as a link. Leave it.

**`image`** is an upload field. **Drop a file in and it wins.** Empty and the original shows.
