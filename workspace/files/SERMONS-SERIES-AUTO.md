# Sermons — Automatic Series Detection

The site reads your YouTube playlists and uses the most recent one as the Current Series band.

**The habit:** when a series starts, make a YouTube playlist named after it and add the messages as you go. That's useful on YouTube anyway — and it's how the website finds out.

---

## How it decides — your own naming convention

You have twelve playlists, and four already say **"Series"** in the name:

- Fruit of the Spirit **(Series)**
- No Killer, No King **(Series)**
- The Believers Authority **(Series)**
- Sermon **Series**: This Is Us (2019)

So that's the rule: **a playlist is the current series if its name contains "series".**

Opt-in, unambiguous, nothing to maintain — and it's already how you name them. Glory Nights, Sunday Sermons, Conferences & Special Events and the rest are simply never candidates.

An ignore list stays as a backstop in case an evergreen playlist ever gets an awkward name:

```javascript
const IGNORE = ['sunday sermons', 'lead network', 'iserve september',
                'glory nights | arise church', 'conferences & special events',
                'apostle bryant sanders — messages'];
```

> **Name your series playlists with "(Series)".** One word, and the website updates itself.

---

## Order of precedence

1. **Manual override** — if `seriesActive` is ticked in **CMS → Site Settings**, that wins. Always.
2. **Auto-detect** — otherwise, the newest playlist not on the ignore list.
3. **Nothing** — if neither applies, the band hides itself.

So you can always overrule it, and between series the band simply disappears.

---

## 1. Backend — add to `backend/youtube.jsw`

```javascript
/* ---- Current series, read from the channel's playlists ---------------- */

const IGNORE = ['sunday sermons', 'lead network', 'iserve september'];

let seriesCache = { value: null, at: 0 };
const SERIES_CACHE_MS = 600000;   // 10 minutes

/**
 * Returns { title, url } for the newest playlist that isn't on the ignore
 * list, or null. Playlists appear newest-first on the channel's tab.
 */
export async function getCurrentSeries() {
  const now = Date.now();
  if (now - seriesCache.at < SERIES_CACHE_MS) return seriesCache.value;

  let result = null;

  try {
    const res = await fetch(
      `https://www.youtube.com/channel/${CHANNEL_ID}/playlists`,
      { method: 'get', headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } }
    );

    if (res.ok) {
      const html = await res.text();
      const seen = new Set();

      // NOTE: playlist IDs come in two lengths — 13 and 34 characters.
      // Matching {16,} silently misses most of them.
      const re = /"playlistId":"(PL[A-Za-z0-9_-]{10,})"/g;
      let m;
      while ((m = re.exec(html)) !== null) {
        const pid = m[1];
        if (seen.has(pid)) continue;
        seen.add(pid);

        // title sits near the id in the same block
        const seg = html.slice(m.index, m.index + 3000);
        const t = seg.match(/"title":\{"runs":\[\{"text":"([^"]{2,90})"/) ||
                  seg.match(/"title":\{"simpleText":"([^"]{2,90})"/);
        if (!t) continue;

        const title = t[1].trim();
        const lower = title.toLowerCase();

        if (IGNORE.includes(lower)) continue;
        if (!lower.includes('series')) continue;   // opt-in by name

        result = {
          // drop a trailing "(Series)" so the heading reads cleanly
          title: title.replace(/\s*\(series\)\s*$/i, '').trim(),
          url: `https://www.youtube.com/playlist?list=${pid}`
        };
        break;                       // first non-ignored = newest
      }
    }
  } catch (err) {
    console.error('Series lookup failed:', err);
    result = null;
  }

  seriesCache = { value: result, at: now };
  return result;
}
```

---

## 2. Past Sermons page code — replace the whole file

```javascript
import wixData from 'wix-data';
import { getLiveVideoId, getCurrentSeries } from 'backend/youtube.jsw';

// Right-click the custom element -> View Properties to confirm this ID.
const EL = '#customElement1';

$w.onReady(async () => {
  if (!$w(EL).length) {
    console.warn('Sermons: custom element ' + EL + ' not found.');
    return;
  }

  // ---- Series band ------------------------------------------------------
  try {
    let title = null, line = null, link = null, label = null;

    // 1. Manual override from the CMS always wins
    const { items } = await wixData.query('SiteSettings')
      .eq('settingKey', 'sermonSeries')
      .limit(1)
      .find();

    const s = items[0];
    if (s && s.seriesActive && s.seriesTitle) {
      title = s.seriesTitle;
      line  = s.seriesLine  || null;
      link  = s.seriesLink  || null;
      label = s.seriesButton || null;
    } else {
      // 2. Otherwise auto-detect from YouTube playlists
      const auto = await getCurrentSeries();
      if (auto) {
        title = auto.title;
        link  = auto.url;
        label = 'Watch the Series';
      }
    }

    if (title) {
      $w(EL).setAttribute('data-series-active', 'true');
      $w(EL).setAttribute('data-series-title', title);
      $w(EL).setAttribute('data-series-line', line || '');
      if (link)  $w(EL).setAttribute('data-series-link', link);
      if (label) $w(EL).setAttribute('data-series-button', label);
      console.log('Series band:', title);
    } else {
      $w(EL).setAttribute('data-series-active', 'false');   // hides the band
      console.log('Series band: none active, hidden');
    }
  } catch (err) {
    console.error('Series lookup failed:', err);
  }

  // ---- Live stream detection -------------------------------------------
  let current = null;

  async function checkLive() {
    try {
      const liveId = await getLiveVideoId();
      if (liveId === current) return;
      current = liveId;
      $w(EL).setAttribute('data-live-video', liveId || '');
      if (liveId) console.log('Live stream detected:', liveId);
    } catch (err) {
      console.error('Live check failed:', err);
    }
  }

  checkLive();
  setInterval(checkLive, 60000);
});
```

---

## Using it day to day

**New series starts** — make the playlist with **"(Series)"** in the name. The site picks it up within ten minutes.

**Series ends, nothing new** — rename the playlist to drop "Series", or set the CMS override. Band disappears.

**Want to override** — tick `seriesActive` in CMS → Site Settings and set the title. Manual always beats automatic.

**Playlist name is the heading**, so name it the way you want it read on the site. "The Kingdom Culture of Giving" reads better than "kingdom giving series 2026".

---

## Two honest caveats

**Playlist name = series name.** Whatever you type on YouTube appears on the site, "(Series)" included — so write it the way you want it read. The code strips a trailing "(Series)" for you, but nothing else.

**This reads YouTube's public HTML**, not an official API. It works today, needs no key, and is cached for ten minutes. If YouTube changes their markup, detection stops and the band falls back to your CMS setting — or hides. **It degrades quietly; it doesn't break the page.**

If you'd rather have something contract-backed, the official YouTube Data API does playlists properly with a free key. Say the word.
