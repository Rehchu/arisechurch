# Arise Church — All Velo Page Code
**Copy each block into its file. One at a time.**

---

## ⚠️ READ THIS FIRST — two pages you must NOT overwrite

**Bible Search (`/arise-bible`)** runs your own custom Velo code — the Bible reference tool. **I have not written a replacement and you should not paste anything into it.** Leave that file exactly as it is.

**Any page where you've already written working code** — same rule. Check before pasting. If a file has code you wrote, tell me and I'll merge rather than replace.

---

## The rule that caused today's errors

| File type | What's allowed |
|---|---|
| `masterPage.js` and page code | **Only** `$w` and `wix-*` imports. Runs server-side first. |
| `public/custom-elements/` | Anything with `HTMLElement`, `customElements.define`, `document.*`, `window.*` |

`document is not defined` or `HTMLElement is not defined` **always** means a file is in the wrong place.

---

## 1. masterPage.js

Site-wide. Replace everything currently in it.

```javascript
// masterPage.js — site-wide code for Arise Church
// Runs on the SERVER first, then in the browser.
// No document, no window, no DOM APIs. $w only.
// Custom elements belong in public/custom-elements/

$w.onReady(() => {
  // Nothing site-wide yet.
});
```

---

## 2. Home

Drives the ministries strip from the CMS. The `.length` guards mean it's safe to paste before the repeater exists.

```javascript
// Home — page code
import wixData from 'wix-data';

$w.onReady(async () => {
  if (!$w('#homeMinRepeater').length) return;

  try {
    const { items } = await wixData.query('Ministries')
      .eq('comingSoon', false)
      .ascending('sortOrder')
      .limit(4)
      .find();

    $w('#homeMinRepeater').onItemReady(($item, m) => {
      if ($item('#hmTitle').length) $item('#hmTitle').text = m.title || '';
      if ($item('#hmCat').length)   $item('#hmCat').text   = m.category || '';
      if ($item('#hmImage').length && m.image) {
        $item('#hmImage').src = m.image;
        $item('#hmImage').alt = m.title || 'Arise Church ministry';
      }
    });

    $w('#homeMinRepeater').data = items;
  } catch (err) {
    console.error('Home ministries load failed:', err);
  }
});
```

---

## 3. Meet our Leaders

Six leaders already in the CMS. The Sanders are flagged `featured` and get the wide card.

```javascript
// Meet our Leaders — page code
import wixData from 'wix-data';

$w.onReady(async () => {
  try {
    // Featured couple — Apostle Bryant & Pastor Vanessa Sanders
    if ($w('#featName').length) {
      const f = await wixData.query('Leaders').eq('featured', true).limit(1).find();
      if (f.items.length) {
        const lead = f.items[0];
        $w('#featName').text = lead.name || '';
        if ($w('#featRole').length)  $w('#featRole').text = lead.role || '';
        if ($w('#featBio').length)   $w('#featBio').text  = lead.bio  || '';
        if ($w('#featPhoto').length && lead.photo) {
          $w('#featPhoto').src = lead.photo;
          $w('#featPhoto').alt = lead.name || 'Arise Church leader';
        }
      }
    }

    // Everyone else
    if (!$w('#leaderRepeater').length) return;

    const featured = $w('#featName').length;   // exclude the Sanders if featured above
    let q = wixData.query('Leaders').ascending('sortOrder');
    if (featured) q = q.eq('featured', false);
    const { items } = await q.limit(50).find();

    $w('#leaderRepeater').onItemReady(($item, l) => {
      if ($item('#leaderName').length) $item('#leaderName').text = l.name || '';
      if ($item('#leaderRole').length) $item('#leaderRole').text = l.role || '';
      if ($item('#leaderBio').length)  $item('#leaderBio').text  = l.bio  || '';
      if ($item('#leaderPhoto').length) {
        if (l.photo) {
          $item('#leaderPhoto').src = l.photo;
          $item('#leaderPhoto').alt = l.name || 'Arise Church leader';
          $item('#leaderPhoto').show();
        } else {
          $item('#leaderPhoto').collapse();
        }
      }
    });

    $w('#leaderRepeater').data = items;
  } catch (err) {
    console.error('Leaders load failed:', err);
  }
});
```

---

## 4. Ministries

All eight. The four without pages get a **Coming Soon** badge and no link — driven by the `comingSoon` field, not by layout.

```javascript
// Ministries — page code
import wixData from 'wix-data';
import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(async () => {
  if (!$w('#minRepeater').length) return;

  try {
    const { items } = await wixData.query('Ministries')
      .ascending('sortOrder')
      .limit(50)
      .find();

    $w('#minRepeater').onItemReady(($item, m) => {
      if ($item('#minTitle').length)    $item('#minTitle').text    = m.title || '';
      if ($item('#minCategory').length) $item('#minCategory').text = m.category || '';
      if ($item('#minImage').length && m.image) {
        $item('#minImage').src = m.image;
        $item('#minImage').alt = m.title || 'Arise Church ministry';
      }

      if (m.comingSoon) {
        if ($item('#minBadge').length) {
          $item('#minBadge').text = 'Coming Soon';
          $item('#minBadge').show();
        }
        if ($item('#minLink').length) $item('#minLink').hide();
      } else {
        if ($item('#minBadge').length) $item('#minBadge').hide();
        if ($item('#minLink').length) {
          $item('#minLink').show();
          $item('#minLink').onClick(() => {
            if (m.pageLink) wixLocationFrontend.to(m.pageLink);
          });
        }
      }
    });

    $w('#minRepeater').data = items;
  } catch (err) {
    console.error('Ministries load failed:', err);
  }
});
```

---

## 5. Training

Both Bible studies. The Watch button hides itself until you add a `videoUrl` in the CMS.

```javascript
// Training — page code
import wixData from 'wix-data';

$w.onReady(async () => {
  if (!$w('#studyRepeater').length) return;

  try {
    const { items } = await wixData.query('Studies')
      .ascending('sortOrder')
      .limit(50)
      .find();

    $w('#studyRepeater').onItemReady(($item, s) => {
      if ($item('#studyTitle').length)   $item('#studyTitle').text   = s.title || '';
      if ($item('#studySpeaker').length) $item('#studySpeaker').text = s.speaker || '';
      if ($item('#studyDesc').length)    $item('#studyDesc').text    = s.description || '';
      if ($item('#studyImage').length && s.image) {
        $item('#studyImage').src = s.image;
        $item('#studyImage').alt = s.title || 'Arise Church Bible study';
      }
      if ($item('#studyBtn').length) {
        if (s.videoUrl) {
          $item('#studyBtn').link = s.videoUrl;
          $item('#studyBtn').target = '_blank';
          $item('#studyBtn').show();
        } else {
          $item('#studyBtn').hide();
        }
      }
    });

    $w('#studyRepeater').data = items;
  } catch (err) {
    console.error('Studies load failed:', err);
  }
});
```

---

## 6. Previous Events

The `PastEvents` collection is **empty** — you haven't told me which of the fourteen past events to surface. This code works the moment you do.

```javascript
// Previous Events — page code
import wixData from 'wix-data';

$w.onReady(async () => {
  if (!$w('#eventRepeater').length) return;

  try {
    const { items } = await wixData.query('PastEvents')
      .ascending('sortOrder')
      .limit(50)
      .find();

    if (!items.length) {
      if ($w('#eventRepeater').length) $w('#eventRepeater').collapse();
      if ($w('#eventsEmpty').length)   $w('#eventsEmpty').show();
      return;
    }
    if ($w('#eventsEmpty').length) $w('#eventsEmpty').hide();

    $w('#eventRepeater').onItemReady(($item, e) => {
      if ($item('#evTitle').length) $item('#evTitle').text = e.title || '';
      if ($item('#evImage').length && e.image) {
        $item('#evImage').src = e.image;
        $item('#evImage').alt = e.title || 'Arise Church event';
      }
      if ($item('#evLink').length && e.pageLink) $item('#evLink').link = e.pageLink;
    });

    $w('#eventRepeater').data = items;
  } catch (err) {
    console.error('Past events load failed:', err);
  }
});
```

---

## 7. Pages that need NO code

Leave these empty. Their content is native Wix elements or Wix apps.

```javascript
$w.onReady(() => {});
```

**About · Contact · Events · Past Sermons · Serve · Children's Ministry · Youth Ministry · Outreach · Lead Network · Devotional · Podcast · Schedule**

If any already has code you wrote, **leave it** and tell me — I'll merge instead of replace.

---

## 8. Custom elements — a different folder entirely

These are **not** page code. They go in `public/custom-elements/`:

| File | Tag name |
|---|---|
| `arise-service-times.js` | `arise-service-times` |
| `arise-hero.js` | `arise-hero` |

More section files to come, all to the same folder.

---

## Order to do this in

1. **masterPage.js** — paste the four-line version. Kills `document is not defined`.
2. **Home** — paste section 2. Kills `HTMLElement is not defined`.
3. **Move the Service Times code** out of Home and into `public/custom-elements/arise-service-times.js`.
4. **Add `arise-hero.js`** to the same folder.
5. **Save.** Console should be clean.
6. Paste the remaining page files as you build each page — they do nothing until the repeaters exist, so pasting early is harmless.

---

## Element IDs the code expects

Set these in **Properties** (right-click element → View Properties). If an ID doesn't match, that element is silently skipped — no error, just nothing.

**Home:** `homeMinRepeater` · `hmTitle` · `hmCat` · `hmImage`

**Leaders:** `leaderRepeater` · `leaderName` · `leaderRole` · `leaderBio` · `leaderPhoto` · `featName` · `featRole` · `featBio` · `featPhoto`

**Ministries:** `minRepeater` · `minTitle` · `minCategory` · `minImage` · `minBadge` · `minLink`

**Training:** `studyRepeater` · `studyTitle` · `studySpeaker` · `studyDesc` · `studyImage` · `studyBtn`

**Previous Events:** `eventRepeater` · `evTitle` · `evImage` · `evLink` · `eventsEmpty`
