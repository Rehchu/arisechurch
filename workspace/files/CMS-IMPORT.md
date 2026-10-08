# Two collections to create and import

---

# 1. Archived Form Submissions

**Why:** 50 real submissions from 2019 to 2025 sitting in the old Wix Forms collections you're about to delete. Names, emails, phone numbers, home addresses.

**CMS → Create Collection → `ArchivedFormSubmissions`**

| Field | Type |
|---|---|
| `source` | Text |
| `submitted` | Text |
| `firstName` | Text |
| `lastName` | Text |
| `email` | Text |
| `phone` | Text |
| `address` | Text |
| `firstTime` | Text |
| `sessions` | Text |
| `inquiries` | Text |
| `originalId` | Text |

> **Set permissions to ADMIN ONLY — for every action including read.**
>
> This is 50 people's contact details and home addresses. Every other collection on your site is publicly readable because it holds public content. **This one must not be.**

Then **Import CSV → `ArchivedFormSubmissions.csv`**.

**Check the row count says 50**, then delete `Multistep Registration`, `Contact01` and `SalesLead`.

---

# 2. Page Content

**CMS → Create Collection → `PageContent`**

| Field | Type |
|---|---|
| `contentKey` | Text |
| `page` | Text |
| `label` | Text |
| `text` | Text |
| `imageUrl` | Text |
| `image` | **Image** |
| `where` | Text |

Permissions: **Anyone can read** (it's public site copy).

Then **Import CSV → `PageContent.csv`** — 34 rows.

> **Create the collection first, import second.** Import straight from a CSV and Wix names it `Import2`, which is then what the code has to query forever.

### Why two image columns

**`imageUrl`** holds the image the site uses today, as a plain link. Leave it alone.

**`image`** is empty and is an upload field. **Drop a new image in and it replaces the old one.** Leave it empty and the original shows.

So the current images keep working, and swapping one is an upload rather than hunting down a URL.

---

## What's in it, and why only 34 rows

These are the things that **actually change**: service times, campus addresses, the hero paragraph, What To Expect, section intros, and the Connect Groups season dates.

**I deliberately left out the 135 headings and kickers.** "WHO WE ARE" and "THIS IS ARISE" don't change, and 135 rows of things you'll never edit makes the useful 25 impossible to find.

If you do want a heading editable later, it's one new row — the system supports any key.

| Group | Rows | Examples |
|---|---|---|
| `site.*` | 8 | Service times, both addresses, email, tagline |
| `home.*` | 9 | Hero paragraph, Who We Are, all three What To Expect cards |
| `connect.*` | 5 | Season name, start, end, host deadline |
| Page intros | 3 | Serve, Creative Arts, Classes |
| **Images** | **9** | Both campus photos, Children's welcome + kids + Superkid, Youth banner, Outreach supplies, both Lead Network minister photos |

**9 of the 34 rows are images** — every hardcoded photo on the site. Swap one by uploading over it; no code, no republish.

**Not in here:** leader portraits, ministry tiles, group flyers, department photos. Those already live in Leaders, Ministries, ConnectGroups and CreativeDepartments, and are editable there.

**The service times and addresses are the ones worth having.** They appear on Home, Contact, the footer and the structured data — changing them in one place beats hunting through five files.

---

## How the pages use it

Every element gets a lookup that falls back to what's in the code:

```javascript
T('home.hero.body', 'Welcome to our multicultural...')
```

**CMS value wins. Empty or missing, the built-in text shows.** So the site can't break from a bad CMS edit, and it works exactly as now until you change something.

**Videos** work the same way. The `video` field is there for when you want one — the Church Culture video already has its own row in Home Settings.

Once both collections are imported, tell me and I'll send the updated element files and the backend function.

---

## Type normally when you edit

The text is plain — real apostrophes, real dashes. **Write it the way you'd write it anywhere else.** The code converts anything that needs escaping before it reaches the page.
