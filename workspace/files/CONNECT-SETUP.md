# Connect Groups — setup

Groups are created and managed in the CMS. **Add a group, upload its flyer, and it appears on the page.** No code.

---

## 1. Create the collection

**CMS → Create Collection → name it exactly `ConnectGroups`**

| Field name | Type | What it's for |
|---|---|---|
| `title` | Text | Group name, e.g. "Tuesday Night in Tioga" |
| `hostName` | Text | Who's hosting |
| `day` | Text | Tuesday, Thursday... |
| `time` | Text | 7:00 PM |
| `location` | Text | Where it meets — see the note below |
| `dates` | Text | e.g. "Sept 16 - Nov 18" |
| `description` | Text | A line or two about the group |
| `flyer` | **Image** | Their own flyer |
| `audience` | Text | Who it's for — "Families", "Men", "Women" |
| `isFull` | **Boolean** | Tick when it's full — shows a badge, disables the button |
| `active` | **Boolean** | Untick to hide without deleting |
| `sortOrder` | **Number** | Controls the order |

**Set permissions to "Anyone can read."** Otherwise the page can't see them.

> **On `location`:** groups meet in homes, at the church, and in businesses, so this is free text — put whatever fits. **For homes, a neighbourhood is usually enough** — "A home in Tioga", "Off Ates Road" — and send the exact address once someone's signed up. For the church or a business, name it: "Arise Church, Main Campus".

---

## 2. Add to `backend/content.web.js`

```javascript
/* Connect Groups. Edit in CMS -> ConnectGroups. */
export const getConnectGroups = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('ConnectGroups')
        .eq('active', true)
        .ascending('sortOrder')
        .limit(50)
        .find({ suppressAuth: true });

      return res.items.map((g) => ({
        title: g.title || '',
        hostName: g.hostName || '',
        day: g.day || '',
        time: g.time || '',
        location: g.location || '',
        dates: g.dates || '',
        description: g.description || '',
        flyer: g.flyer || '',
        audience: g.audience || '',
        isFull: !!g.isFull
      })).filter((g) => g.title);

    } catch (err) {
      console.error('getConnectGroups failed:', err);
      return [];
    }
  }
);
```

---

## 3. Connect Groups page code

```javascript
import { getConnectGroups } from 'backend/content.web';

$w.onReady(async () => {
  const groups = await getConnectGroups();
  console.log('Connect Groups: ' + groups.length);

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-groups', JSON.stringify(groups));
      console.log('Connect Groups: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Connect Groups: element never became ready');
  };
  fill(1);
});
```

---

## 4. Allow the two form types

In `backend/http-functions.js`:

```javascript
const ALLOWED = ['contact', 'serve', 'prayer', 'connect-host', 'connect-join'];
```

---

## How the page works

**Groups This Season** — a card per group showing its flyer, description, and a labelled list: **Host · Where · When · Dates · For**. Full groups show a badge and a disabled button.

**Join This Group** jumps to the signup form with that group already filled in, and scrolls there. One tap from browsing to signing up.

### The two forms are built for different jobs

**Host a Connect Group** asks what's needed to actually list the group: first and last name, phone, email, **where** (my home / the church / a business / not sure yet), **what area**, **which day**, **what time**, and **who it's for**. Every answer maps to a field on the CMS row, so creating the listing is copying across rather than chasing them for details.

**Join a Connect Group** asks four things only — first name, last name, phone, email — plus which group, pre-filled when they tap a card. Nothing else stands between someone and joining.

**Two tabs** below: Host a Group (open by default, since sign-ups close September 2) and Join a Group.

**No groups yet** shows "Groups are forming" rather than an empty page — safe to publish now, while hosts are still signing up.

---

## What you manage from the dashboard

| Task | Where |
|---|---|
| Add a group | CMS → ConnectGroups → new row |
| Upload its flyer | The `flyer` field on that row |
| Mark one full | Tick `isFull` |
| Hide one | Untick `active` |
| Reorder | Change `sortOrder` |

**Season dates** are still in the element — `SEASON` at the top of `arise-connect.js`. Four lines, changed twice a year.

---

## Where signups land

**CMS → Form Submissions**, with `formType` set to:

- **`connect-host`** — `subject` holds venue and area, `position` holds day and time, `message` holds who it's for plus any notes
- **`connect-join`** — `subject` holds which group they want. First and last name are combined into `name`.

Filter on `formType` to separate hosts from joiners.

**Add both types to your email automation** or they'll fall through to the default branch.
