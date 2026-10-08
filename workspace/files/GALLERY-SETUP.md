# Photo Collage — setup

**No separate element.** The collage is built into each page's own element, so it stays one element per page.

Photos uploaded to a Portfolio project appear on that department's page automatically.

---

## Your projects

Read from your live site:

| Page | Project | Project ID |
|---|---|---|
| `/childrens` | Children's Ministry | `621e6fdb-57f1-4b84-9834-e861e6407476` |
| `/youth` | Youth Ministry | `c2be296e-9eb4-4a02-b6b8-428128fbe50d` |
| `/outreach` | Outreach | `78e5e5f9-6560-4edb-9e09-fc74dadab9f3` |
| `/general-4` | Lead Network | `885f9ceb-b1ea-4259-8388-284c180062e6` |
| `/` (homepage) | Church Culture | `a68b2630-d56d-4abe-a3d4-8d6e0ce8e0d5` |
| `/` hero panel | **Exciting News** | `b2697282-735e-42fc-979a-2b8dc2118f1e` |

---

## Page code

**Same block on every page. Change one line — the project ID.**

```javascript
import wixData from 'wix-data';

// Which portfolio project feeds this page. See the table above.
const PROJECT_ID = 'a68b2630-d56d-4abe-a3d4-8d6e0ce8e0d5';   // Church Culture

// Right-click the custom element -> View Properties to confirm this ID.
const EL = '#customElement1';

/* Portfolio stores media as wix: URLs, which a custom element can't read.
   These turn them into normal https links. */
function imageUrl(info) {
  if (!info) return '';
  if (info.indexOf('wix:image://') !== 0) return info;
  const id = info.split('wix:image://v1/')[1].split('/')[0];
  return 'https://static.wixstatic.com/media/' + id;
}
function videoBits(info) {
  if (!info || info.indexOf('wix:video://') !== 0) return { id: '', poster: '' };
  const id = info.split('wix:video://v1/')[1].split('/')[0];
  const hash = info.split('#')[1] || '';
  const m = hash.match(/posterUri=([^&]+)/);
  return {
    id: id,
    poster: m ? 'https://static.wixstatic.com/media/' + decodeURIComponent(m[1]) : ''
  };
}

$w.onReady(async () => {
  if (!$w(EL).length) {
    console.warn('Gallery: element ' + EL + ' not found.');
    return;
  }

  try {
    // NOTE: the field is `project` (a reference), NOT `projectId`.
    const res = await wixData.query('Portfolio/ProjectItems')
      .eq('project', PROJECT_ID)
      .ascending('sortOrder')
      .limit(60)
      .find();

    const photos = res.items.map(it => {
      if (it.type === 'VIDEO') {
        const v = videoBits(it.video && it.video.videoInfo);
        return {
          src: v.poster,
          videoId: v.id,
          alt: it.title || '',
          caption: it.description || ''
        };
      }
      return {
        src: imageUrl(it.image && it.image.imageInfo),
        alt: it.title || '',
        caption: it.description || ''
      };
    }).filter(p => p.src || p.videoId);

    $w(EL).setAttribute('data-photos', JSON.stringify(photos));
    console.log('Gallery: ' + photos.length + ' items loaded');
  } catch (err) {
    console.error('Gallery load failed:', err);
  }
});
```

**Nothing else to place.** The gallery section already exists inside each page element, sitting just above the closing red band.

---

## Field names, confirmed

Read from your live site, not guessed:

| Field | What it holds |
|---|---|
| `project` | **REFERENCE** to the project. Filter on this, not `projectId` |
| `type` | `IMAGE` or `VIDEO` |
| `image.imageInfo` | a `wix:image://` URL |
| `video.videoInfo` | a `wix:video://` URL, with the poster in its hash |
| `title` | becomes the alt text |
| `description` | becomes the lightbox caption |
| `sortOrder` | Portfolio's own ordering |

**Videos:** the code pulls the poster from the URL hash and offers 1080p, 720p and 480p as sources. Which renditions exist varies per upload — one of your Church Culture clips has no 1080p — so the browser takes the first that works.

---

## What it does

**Mosaic, not a grid.** Tiles vary on a 7-tile repeat — wide, tall, square. Portrait and landscape together is what makes it look deliberate.

**A one-degree scrapbook tilt** on alternating tiles. Straightens on hover.

**Hover** lifts the tile, zooms the photo, flashes a red corner.

**Click** opens a full-screen lightbox — arrow keys, Escape, click outside to dismiss, counter and caption.

**Videos work too.** A video item shows its poster with a red play badge, and plays full-screen in the lightbox. The counter reads "12 items - 3 videos".

**Lazy loading** on every image, so 60 photos won't slow the page.

**Reduced motion respected** — tilts and transitions switch off for anyone who's asked their device for less animation.

**Renders nothing until photos exist.** No empty frames. The pages are safe to publish right now.

---

## Section headings, already set

| Page | Kicker | Heading |
|---|---|---|
| Children's | Moments | Sunday Mornings |
| Youth | Moments | Youth Life |
| Outreach | In The Community | Impact Tioga |
| Lead Network | Gatherings | Camp Meetings & Teachings |
| Homepage | Church Culture | This Is Arise |

Change them in the file if you'd rather — they're plain text in the markup.

---

## Notes

**Ten or more photos** per department to start. The rhythm needs a few tiles; under six it just looks like a small grid.

**Add titles and descriptions as you upload.** Portfolio's title becomes the alt text, description becomes the lightbox caption. Much quicker now than retrofitting later.
