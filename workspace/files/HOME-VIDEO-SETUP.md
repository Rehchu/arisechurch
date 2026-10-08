# Church Culture video — setup

**Upload the video in the CMS. Nothing else.**

---

## Where it lives

**CMS → Home Settings** — one row, already created, `settingKey` = `churchCulture`.

| Field | What it does |
|---|---|
| `cultureVideo` | **Upload the video here.** A real video field, so you upload straight into it |
| `posterImage` | Optional still frame. Leave empty and Wix generates one |
| `heading` | The big heading. Currently "This Is Arise" |
| `kicker` | The small red label. Currently "Church Culture" |
| `active` | Untick to go back to the photo collage |

**Empty or unticked, the photo collage shows instead** — so nothing breaks while the video is being cut.

---

## 1. Add to `backend/content.web.js`

```javascript
/* Church Culture video. Edit in CMS -> Home Settings. */
export const getHomeSettings = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const res = await wixData.query('HomeSettings')
        .eq('settingKey', 'churchCulture')
        .limit(1)
        .find({ suppressAuth: true });

      const row = res.items[0];
      if (!row) return null;

      /* A CMS video field returns a wix:video:// string -- pull the id out. */
      let videoId = '';
      let poster = row.posterImage || '';
      const v = row.cultureVideo;

      if (typeof v === 'string' && v.indexOf('wix:video://') === 0) {
        videoId = v.split('wix:video://v1/')[1].split('/')[0];
        if (!poster) {
          const m = (v.split('#')[1] || '').match(/posterUri=([^&]+)/);
          if (m) poster = 'https://static.wixstatic.com/media/' + decodeURIComponent(m[1]);
        }
      } else if (v && typeof v === 'object') {
        videoId = v.id || '';
      }

      if (poster && poster.indexOf('wix:image://') === 0) {
        poster = 'https://static.wixstatic.com/media/' +
          poster.split('wix:image://v1/')[1].split('/')[0].split('#')[0];
      }

      return {
        videoId: videoId,
        poster: poster,
        heading: row.heading || 'This Is Arise',
        kicker: row.kicker || 'Church Culture',
        active: row.active !== false
      };

    } catch (err) {
      console.error('getHomeSettings failed:', err);
      return null;
    }
  }
);
```

---

## 2. Add to the Home page code

Alongside what's already there:

```javascript
  try {
    const culture = await getHomeSettings();
    if (culture) {
      console.log('Culture video: ' + (culture.videoId || 'none set'));
      $w(EL).setAttribute('data-culture', JSON.stringify(culture));
    }
  } catch (err) {
    console.error('Culture load failed:', err);
  }
```

And add `getHomeSettings` to the import at the top.

---

## How it behaves

**Mobile (under 900px)** — autoplays muted and loops when it scrolls into view, pauses when it leaves. A **Sound On** button sits bottom-right.

**Desktop** — poster frame with a big red play button. Clicking plays it **with sound**, full controls.

**Reduced motion** — no autoplay anywhere, controls instead.

---

## The one hard limit

**Autoplay only works muted.** Every browser, every platform. Unmuted autoplay is blocked and shows a frozen frame instead of playing.

That's why mobile starts silent with a one-tap Sound On, and why desktop waits for a click — a click counts as permission, so desktop gets sound immediately.

**Worth telling Kristina while she's still cutting it:** on mobile it has to work without sound. Burned-in captions or on-screen text will carry it. That's why every autoplay video on Instagram and Facebook is built that way.
