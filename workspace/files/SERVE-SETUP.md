# Serve page — setup

Replaces the old Wix form page. **Positions come from the CMS, and the form is built into the element** — no separate Wix form to keep styled.

**Element:** `arise-serve.js` · **Tag:** `arise-serve`

---

## Already built and seeded

**CMS → Serve Positions**, with the five roles from your live page plus two Creative Arts teams:

| Position | Team | Most Needed |
|---|---|---|
| Children's Department | Children's Ministry | ✓ |
| Outreach | Outreach | ✓ |
| Media / Social Media | Arise Creative Arts | |
| Edge / X Edge | Youth & Young Adults | |
| Maintenance | Facilities | |
| Praise & Worship | Arise Creative Arts | |
| Production & Sound | Arise Creative Arts | |

Descriptions are your original wording. The two Creative Arts additions are new — **delete them if the Apostle would rather not advertise those yet.**

---

## 1. Add to `backend/content.web.js`

```javascript
/* Serve positions. Edit in CMS -> ServePositions. */
export const getServePositions = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('ServePositions')
        .eq('active', true)
        .ascending('sortOrder')
        .limit(50)
        .find({ suppressAuth: true });

      return res.items.map((p) => ({
        title: p.title || '',
        description: p.description || '',
        team: p.team || '',
        image: p.image || '',
        urgent: !!p.urgent
      })).filter((p) => p.title);

    } catch (err) {
      console.error('getServePositions failed:', err);
      return [];
    }
  }
);
```

---

## 2. Serve page code

```javascript
import { getServePositions } from 'backend/content.web';

const EL = '#customElement1';   // right-click the element -> View Properties

$w.onReady(async () => {
  const positions = await getServePositions();
  console.log('Serve: ' + positions.length + ' positions');

  const fill = (n) => {
    const el = $w(EL);
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-positions', JSON.stringify(positions));
      console.log('Serve: rendered');
      return;
    }
    if (n < 30) setTimeout(() => fill(n + 1), 300);
    else console.warn('Serve: element never became ready');
  };
  fill(1);
});
```

---

## 3. In the Editor

**Delete the old Wix form and the text block on the right.** Then place the element and stretch it full width.

---

## What changed from the old page

**The old form had two email fields** — "Your Email" at the top and "Email" below, both unlabelled as duplicates. Gone.

**The positions were a plain bulleted list** on the right. They're now cards you can tap, which fills the position into the form. Nobody has to retype "Children's Department".

**Most Needed** gets a red badge and a red top edge — Children's and Outreach are flagged. Change that with the `urgent` tick in the CMS.

**The old form used Wix's default serif font** and didn't match anything else on the site. This one uses Anton and Oswald like every other page.

---

## What you manage from the dashboard

| Task | Where |
|---|---|
| Add a position | CMS → Serve Positions → new row |
| Mark one urgent | Tick `urgent` |
| Hide one | Untick `active` |
| Reorder | `sortOrder` |
| Change the description | That row |

**Submissions land in CMS → Form Submissions** with `formType` **serve**, and `position` holding which role they picked — same as before, so your automation needs no change.

---

## The old arise-form.js

You no longer need it for Serve. **Keep it if you're using `data-form="prayer"` anywhere**, otherwise it can go.
