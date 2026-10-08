# Sermons — Automatic Live Stream Detection

Two files. Once these are in, the featured player switches to your live stream on its own — Sunday mornings, Monday Glory Nights, and any other time you go live.

**No API key. No cost. Nothing to remember on a Sunday.**

---

## What happens

| State | Player shows | Badge |
|---|---|---|
| **You're streaming** | The live stream | **LIVE NOW** — red, pulsing dot |
| Not streaming | Your most recent livestream | **Latest Service** |

The page also **re-checks every 60 seconds**. So if a visitor opens the page five minutes before service and you start streaming, it switches over for them without a refresh.

---

## 1. Backend — `backend/youtube.jsw`

Velo sidebar → **Backend** → new file named exactly `youtube.jsw`.

```javascript
import { fetch } from 'wix-fetch';

const CHANNEL_ID = 'UCGS9j7B_prcJkbTNgzlGrKg';

// Short cache so a busy Sunday doesn't hammer YouTube.
let cache = { value: null, at: 0 };
const CACHE_MS = 45000;

/**
 * Returns the videoId of the current live stream, or null when not streaming.
 * Reads YouTube's public /live page — no API key needed.
 */
export async function getLiveVideoId() {
  const now = Date.now();
  if (now - cache.at < CACHE_MS) return cache.value;

  let result = null;

  try {
    const res = await fetch(
      `https://www.youtube.com/channel/${CHANNEL_ID}/live`,
      { method: 'get', headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' } }
    );

    if (res.ok) {
      const html = await res.text();

      // Signal 1 — when live, the canonical link is a watch URL.
      const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
      if (canonical && canonical[1].includes('/watch?v=')) {
        const id = canonical[1].split('/watch?v=')[1].split('&')[0];
        if (/^[A-Za-z0-9_-]{11}$/.test(id)) result = id;
      }

      // Signal 2 — fallback if the canonical is missing.
      if (!result && html.includes('"isLive":true')) {
        const vid = html.match(/"videoId":"([A-Za-z0-9_-]{11})"/);
        if (vid) result = vid[1];
      }
    }
  } catch (err) {
    console.error('Live check failed:', err);
    result = null;           // fail quiet — player keeps the latest stream
  }

  cache = { value: result, at: now };
  return result;
}
```

---

## 2. Past Sermons page code

Pages → **Past Sermons** → ⋮ → Page Code.

```javascript
import { getLiveVideoId } from 'backend/youtube.jsw';

// Rename this if your element's ID differs.
// Right-click the custom element -> View Properties to check.
const ELEMENT_ID = '#customElement1';

$w.onReady(() => {
  if (!$w(ELEMENT_ID).length) {
    console.warn('Sermons: custom element ' + ELEMENT_ID + ' not found.');
    return;
  }

  let current = null;

  async function check() {
    try {
      const liveId = await getLiveVideoId();
      if (liveId === current) return;      // nothing changed
      current = liveId;

      if (liveId) {
        $w(ELEMENT_ID).setAttribute('data-live-video', liveId);
        console.log('Live stream detected:', liveId);
      } else {
        $w(ELEMENT_ID).setAttribute('data-live-video', '');
      }
    } catch (err) {
      console.error('Live check failed:', err);
    }
  }

  check();                        // on load
  setInterval(check, 60000);      // and every 60 seconds after
});
```

**Check the element's ID before you paste.** Right-click the custom element → View Properties. Wix usually names it `#customElement1`, but not always — and a wrong ID here fails silently.

---

## How the detection works

YouTube's `/live` URL gives it away without any API:

- **Streaming** → its canonical link points at a `watch?v=` URL
- **Not streaming** → it points back at the channel

I tested this against your channel. It correctly reported not-live, and returned the channel canonical exactly as expected.

There's a second check on `"isLive":true` in case the canonical is ever missing.

---

## The featured playlist

Separately from live detection, the player's default is your **live streams playlist**:

| Prefix | Contains |
|---|---|
| `UU` | All uploads, Shorts included |
| `UULF` | Long-form only |
| **`UULV`** | **Live streams only** ← the player uses this |
| `UUSH` | Shorts only |

```
Channel:      UCGS9j7B_prcJkbTNgzlGrKg
Live streams: UULVGS9j7B_prcJkbTNgzlGrKg
```

Verified — its first entry matches the newest video on your `/streams` tab.

---

## Testing it

**Best test is a real one.** Next time you go live, open the Sermons page and watch the badge turn red.

**Before then**, open the browser console on the published page. You should see the check running with no errors. When live, it logs `Live stream detected: <videoId>`.

---

## Honest caveat

This reads YouTube's public HTML rather than an official API. It works today and needs no key, but YouTube could change their markup without warning.

**If that ever happens, the page doesn't break** — it falls back to showing your most recent livestream, which during a service is usually that same stream anyway. You'd lose the LIVE badge, not the video.

If you'd rather have something contract-backed, the official YouTube Data API does this properly with a free key. Say the word and I'll write that version instead.
