# Leaders & Ministries from the CMS

Both pages now read from collections you already have. **Adding a leader or flipping a ministry from Coming Soon to live is a dashboard edit — no code, no republish.**

---

## 1. `backend/content.web.js` — new file

```javascript
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';

/* Leaders. Edit in CMS -> Leaders.
   featured: true puts them in the wide card at the top.
   sortOrder controls the order. */
export const getLeaders = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('Leaders')
        .ascending('sortOrder')
        .limit(50)
        .find({ suppressAuth: true });

      return res.items.map((l) => ({
        name: l.name || '',
        role: l.role || '',
        bio: l.shortBio || l.bio || '',
        photo: l.photo || '',
        featured: !!l.featured
      })).filter((l) => l.name);

    } catch (err) {
      console.error('getLeaders failed:', err);
      return [];
    }
  }
);

/* Ministries. Edit in CMS -> Ministries.
   comingSoon: true shows the badge and removes the link. */
export const getMinistries = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('Ministries')
        .ascending('sortOrder')
        .limit(50)
        .find({ suppressAuth: true });

      return res.items.map((m) => ({
        title: m.title || '',
        cat: m.category || '',
        link: m.pageLink || '',
        img: m.image || '',
        soon: !!m.comingSoon
      })).filter((m) => m.title);

    } catch (err) {
      console.error('getMinistries failed:', err);
      return [];
    }
  }
);
```

---

## 2. Leaders page code

```javascript
import { getLeaders } from 'backend/content.web';

$w.onReady(async () => {
  const leaders = await getLeaders();
  console.log('Leaders: ' + leaders.length);

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-leaders', JSON.stringify(leaders));
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Leaders: element never became ready');
  };
  fill(1);
});
```

## 3. Ministries page code

```javascript
import { getMinistries } from 'backend/content.web';

$w.onReady(async () => {
  const ministries = await getMinistries();
  console.log('Ministries: ' + ministries.length);

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-ministries', JSON.stringify(ministries));
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Ministries: element never became ready');
  };
  fill(1);
});
```

**Both use the retry loop** — custom elements register a moment after `onReady`, which cost us an hour on the Classes page.

**Check the element ID on each page** — right-click → View Properties.

---

## What you can now do from the dashboard

**CMS → Leaders**
- Add someone: new row with name, role, shortBio, photo, sortOrder
- Remove someone: delete the row
- Reorder: change sortOrder
- Feature someone: tick `featured` for the wide card at the top

**CMS → Ministries**
- Launch one: untick `comingSoon` and add its `pageLink`
- Add one: new row with title, category, image, sortOrder
- Reorder: change sortOrder

Changes appear on the next page load. No publish needed.

---

## The fallback

**Both elements keep their hardcoded lists built in.** If the CMS is empty or the query fails, the page renders exactly as it does today rather than going blank.

That means you can paste these files now and nothing changes until the page code is added.

---

## What's in the collections already

**Leaders (6):** Bryant & Vanessa Sanders (featured), Norman and Margie Youngblood, Chad and Tabitha Kerik, Herbert and Erica Perry, Will Robertson, Ethan Mayes

**Ministries (8):** including four flagged `comingSoon` — Thrive, Mvmt 6:14, Worship Team, In Edge/X Edge

**Kristina Robinson** isn't in Leaders — she had no photo when I built it. Add a row when you have one.
