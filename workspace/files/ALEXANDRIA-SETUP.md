# Arise Church Alexandria — setup

A page for the second campus, with Pastor Sheron Turner's bio. **All text is in CMS → Page Content** under keys starting `alexandria.` — already seeded, 8 rows.

**Element:** `arise-alexandria.js` · **Tag:** `arise-alexandria` · **Page:** `/alexandria`

---

## 1. Her photo

**Media Manager → upload `IMG_1824.jpeg`**, copy its URL, then paste it into
**CMS → Page Content → `alexandria.pastor.photo` → `imageUrl`**.

Until then a red **ST** monogram card shows in its place — deliberate, not a gap.

---

## 2. Backend — add to `content.web.js`

```javascript
/* Page text and images. Edit in CMS -> Page Content. */
export const getPageContent = webMethod(
  Permissions.Anyone,
  async (prefix) => {
    try {
      let q = wixData.query('PageContent').limit(300);
      if (prefix) q = q.startsWith('contentKey', prefix);
      const res = await q.find({ suppressAuth: true });

      const out = {};
      res.items.forEach((r) => {
        if (!r.contentKey) return;
        const img = imgUrl(r.image) || r.imageUrl || '';
        out[r.contentKey] = img ? { text: r.text || '', imageUrl: img } : (r.text || '');
      });
      return out;

    } catch (err) {
      console.error('getPageContent failed:', err);
      return {};
    }
  }
);
```

**This is the function that was missing** — the reason CMS edits never reached the site.

---

## 3. Alexandria page code

```javascript
import { getPageContent } from 'backend/content.web';

const EL = '#customElement1';   // right-click -> View Properties

$w.onReady(async () => {
  const content = await getPageContent();
  console.log('Page content: ' + Object.keys(content).length + ' keys');

  const fill = (n) => {
    const el = $w(EL);
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-content', JSON.stringify(content));
      console.log('Alexandria: rendered');
      return;
    }
    if (n < 30) setTimeout(() => fill(n + 1), 300);
    else console.warn('Alexandria: element never became ready');
  };
  fill(1);
});
```

---

## What's on the page

**Header** — ARISE CHURCH ALEXANDRIA with the intro line.

**Lead Pastor** — her photo beside both bio paragraphs, exactly as she wrote them.

**Find Us** — the address with directions, and the service times.

**A time row only appears when there's a time in the CMS.** Fill in `site.times.second.midweek` and it shows; leave it blank and it doesn't. No "TBA" sitting there for months.

**Come As You Are** closing band linking to Contact.

---

## Two things worth checking with her

**Her bio says the Sanders lead "Arise Church in Tioga, Louisiana."** Every other page on the site says Pineville, and the address is 501 Ates Road, Pineville. Both may be right locally — but the site should pick one and stick to it.

**Her bio says "Prophet Vanessa Sanders."** The Leaders page says "Pastor Vanessa Sanders." Worth confirming which title she uses publicly.

I've left her wording exactly as written. These are hers and the Apostle's calls, not mine.

---

## Nav

Not added yet. Options:

- Under **About** — alongside Meet our Leaders
- Its own **Campuses** dropdown with Pineville and Alexandria
- Linked from the campus card on Home and Contact

**I'd link it from the campus cards first** — that's where someone already looking for Alexandria will be. Tell me and I'll wire it.
