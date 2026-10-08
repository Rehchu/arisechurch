# Arise Creative Arts — setup

Laid out the way Kristina described: **a hub page describing the department as a whole, with each sub-department linking to its own page.** Uniform and clean, without breaking up the departments.

**One element file serves every page.** No attribute means the hub; `data-dept="slug"` means that department.

---

## Pages to create

| Page | Slug | Element attribute |
|---|---|---|
| Arise Creative Arts | `/creative-arts` | *(none — this is the hub)* |
| Praise & Worship | `/praise-worship` | `data-dept="praise-worship"` |
| Musicians | `/musicians` | `data-dept="musicians"` |
| Production | `/production` | `data-dept="production"` |
| Sound | `/sound` | `data-dept="sound"` |
| Media | `/media-team` | `data-dept="media-team"` |
| Social Media & Content | `/content` | `data-dept="content"` |

Every page gets the same element, tag `arise-creatives`, stretched full width. Only the attribute differs.

> Change a slug if you prefer — just keep `pageLink` and `slug` in the CMS matching the real page.

---

## Already built and seeded

**CMS → Creative Departments** — all six, in order, with taglines and page links.

**CMS → Creative Members** — all fifteen people Kristina listed, assigned to their departments:

| Department | Who |
|---|---|
| Praise & Worship | Kristina *(leader)*, Ethan, Linda, Yolanda, Brandis, Cailey, Margie, Thelma |
| Musicians | Nick, Geremiah |
| Production | Darek, Ronnie, Brandon |
| Sound | Ty |
| Media | Bradly |

**Photos and bios are blank** — that's what Kristina is putting together. Add them per row and they appear.

**Voice parts are deliberately left out**, as she asked — Yolanda and Cailey sing two parts each.

---

## 1. Add to `backend/content.web.js`

```javascript
/* Creative Arts. Edit in CMS -> Creative Departments / Creative Members. */
export const getCreatives = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const [d, m] = await Promise.all([
        wixData.query('CreativeDepartments')
          .eq('active', true).ascending('sortOrder').limit(50)
          .find({ suppressAuth: true }),
        wixData.query('CreativeMembers')
          .eq('active', true).ascending('sortOrder').limit(200)
          .find({ suppressAuth: true })
      ]);

      return {
        departments: d.items.map((x) => ({
          name: x.name || '',
          slug: x.slug || '',
          tagline: x.tagline || '',
          description: x.description || '',
          groupPhoto: x.groupPhoto || '',
          pageLink: x.pageLink || ''
        })).filter((x) => x.name),

        members: m.items.map((x) => ({
          name: x.name || '',
          department: x.department || '',
          role: x.role || '',
          bio: x.bio || '',
          photo: x.photo || '',
          isLeader: !!x.isLeader
        })).filter((x) => x.name)
      };

    } catch (err) {
      console.error('getCreatives failed:', err);
      return { departments: [], members: [] };
    }
  }
);
```

---

## 2. Page code — the same on every one of the seven pages

```javascript
import { getCreatives } from 'backend/content.web';

$w.onReady(async () => {
  const data = await getCreatives();
  console.log('Creatives: ' + data.departments.length + ' departments, ' +
              data.members.length + ' members');

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-depts', JSON.stringify(data.departments));
      el.setAttribute('data-members', JSON.stringify(data.members));
      console.log('Creatives: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Creatives: element never became ready');
  };
  fill(1);
});
```

**Identical on all seven.** The `data-dept` attribute — set in the Editor, not in code — is what makes each page different.

**Check the element ID on each page** with right-click → View Properties.

---

## What the pages look like

**Hub** — Arise Creative Arts header, then six numbered tiles with group photo, name and tagline, each linking to its department. Closes with a Serve invitation.

**Department page** — the department name, its description, the group photo full width, then a card per person with photo, role and bio. Links back to the hub.

**No photo yet** shows a monogram card in brand red on near-black — deliberate, not a gap.

---

## Two things to check with Kristina

**The praise team list.** Her message read *"Praise and Worship team is me Ethan, Linda, Yolanda, Brandis, Cailey and Margie. Thelma"* — I read that as eight people including her and Thelma, but the punctuation is loose. Worth confirming.

**Cailey or Caliey.** Spelled both ways across her two messages. I used **Cailey**.

Both are one-field edits in the CMS.

---

## What you manage from the dashboard

| Task | Where |
|---|---|
| Add a person | CMS → Creative Members → new row with their department |
| Add photos and bios | Those fields on each row |
| Add a department | CMS → Creative Departments, then create its page |
| Group photo | The `groupPhoto` field on the department |
| Reorder | `sortOrder` on either collection |
| Hide someone | Untick `active` |
