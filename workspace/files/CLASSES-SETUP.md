# Classes page — setup

Lists every published Online Program. **Free or paid is set in the Online Programs dashboard, not in code** — this page shows whatever they configure and follows any change.

**Element:** `arise-classes.js` · **Tag:** `arise-classes`

---

## 1. Add to `backend/gallery.web.js`

Same file the galleries use. Add these imports at the top:

```javascript
import { programs } from '@wix/online-programs';
```

Then add this export at the bottom:

```javascript
export const getPrograms = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const list = auth.elevate(programs.queryPrograms);
      const res = await list().eq('status', 'PUBLISHED').find();
      const items = res.items || res.programs || [];

      // TEMPORARY -- shows the real field names. Delete once confirmed.
      if (items.length) {
        console.log('Programs: first ->', JSON.stringify(items[0]).slice(0, 1200));
      }

      return items.map((p) => {
        const d = p.description || {};
        const media = d.media || d.image || {};
        const img = typeof media === 'string' ? media : (media.image || media.url || '');
        const price = p.price && p.price.value
          ? (p.price.currency === 'USD' ? '$' : '') + p.price.value
          : 'Free';

        return {
          id: p.id,
          title: d.title || '',
          details: d.details || '',
          image: img,
          price: price,
          steps: p.stepCount || 0,
          sections: p.sectionCount || 0,
          selfPaced: !!(p.timeline && p.timeline.selfPaced),
          url: (p.seo && p.seo.slug) ? '/classes/' + p.seo.slug : ''
        };
      });
    } catch (err) {
      console.error('getPrograms failed:', err);
      return [];
    }
  }
);
```

---

## 2. Classes page code

```javascript
import { getPrograms } from 'backend/gallery.web';

const EL = '#customElement1';

$w.onReady(async () => {
  try {
    const classes = await getPrograms();
    console.log('Classes: ' + classes.length + ' programs');
    $w(EL).setAttribute('data-classes', JSON.stringify(classes));
  } catch (err) {
    console.error('Classes load failed:', err);
    $w(EL).setAttribute('data-classes', '[]');
  }
});
```

---

## 3. After the first program — send me one line

Create and **publish** a program, then open the live Classes page and look for:

```
Programs: first -> {...}
```

**Paste that to me.** Online Programs has no items on your site right now, so the field mapping above is written from the docs rather than from your real data — one real program and I'll lock it down.

That's the same step that made the photo galleries work first time.

---

## What the page does

**Three-column grid** of class cards — image, price badge in brand red, title, description, step and section counts, and a View Class button.

**Price badge** reads whatever Online Programs reports. No price configured shows **Free**.

**Self-paced** classes say so; scheduled ones show their duration.

**No programs yet** shows a "Classes are coming" panel rather than a blank page — so it's safe to publish now.

---

## Two things to confirm

**The class URL.** I've assumed `/classes/{slug}`. If the Online Programs app uses a different path on your site, tell me and it's a one-line change.

**Where it sits in the nav.** I'd put Classes under **Media**, alongside Past Sermons and Bible Search — that dropdown is already the "learn and grow" section. Say the word and I'll add it to the header.
