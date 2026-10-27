---
name: arise-media-page-2026-10-27
description: "The 27 Oct 2026 Media page (/sermons) build: what the page shows, which attributes drive it, the playlist ids, what Bradly asked for and what stays as it was"
metadata:
  type: project
---

Bradly's ask (27 Oct 2026): on the Media page the top player shows the **latest video, live when live**; the Glory Night section shows the **latest Glory Night** (previous week); a **Sermons section like the channel playlists** (Apostle Bryant, Pastor Vanessa, …); **keep the Shorts where they are**; make it look fabulous in the **current theme**. He gave the playlists: Pastor Vanessa `PLeDfl1m-bAzo`, Apostle Bryant `PLa-Nxr2f-qHY`, Glory Night `PLYhdT3QigNmY`, Sunday Sermons `PLb-9QSfkRhnE2aI5nXA_Vv-UJDr8Fn4mI`.

"Media page" = the MEDIA menu's Past Sermons page at `/sermons` (`src/pages/Past Sermons.sg492.js` + `arise-sermons.js`). The Wix page file named `Media.bv9n3.js` is the Creative Arts *Media team* department page (`/media-team`) and was not touched.

- `backend/youtube.jsw` new readers: `getLatestVideo()` (Live tab `/streams`, newest non-upcoming), `getLatestGloryNight()` (playlist page, newest by `ageDays`; falls back to the newest "Glory Night" stream, then the playlist's first video), `getPlaylists()` (`/playlists`, featured three first, Glory Nights excluded). `parseVideoList` reads both the `*VideoRenderer` and `lockupViewModel` layouts. All cached 10 min, keep last good answer.
- Page code sends `data-latest-video`, `data-glory-video`, `data-playlists` (JSON); live stream still arrives as `data-live-video` and wins over the latest video.
- Element: featured player embeds the latest video with `list=UULV…` so the playlist continues; Glory player embeds the newest Glory Night with `list=PLYhdT3QigNmY`; the Sermons section is a bone-coloured section between Glory Nights and Clips: inline playlist player + a list of playlist cards (vertical on desktop, horizontal snap strip on phones), built-in `PLAYLISTS` fallback. New CMS hooks `sermons.playlists.kicker/heading/lede/button`; rows ready in `cms/PageContent-media-page-2026-10-27.csv` (not yet imported into the live CMS).
- Tests: backend 28, page-code 92. Synthetic fixtures for `/streams` and the playlist page because YouTube is unreachable from the cloud container.

## Redesign, approved 27 Oct 2026 ("House Lights Down", Sample C)
Bradly rejected the first layout ("too busy, a lot going on", liked the design elements) and asked for something modern, exciting, adventurous, unique to Arise, not like other church sermon pages. A judge panel picked the "cinema" direction (`workspace/files2/arise-media-page-2026-10-27/DESIGN.md`); Sample B (phone-first) was built from it, then Sample C turned B into a **running order**: compact masthead (SERMONS + "now showing" ticker), a tab strap 01 Latest · 02 Series · 03 Glory Nights · 04 Sermons · 05 Clips, and a deck that shows one room at a time, sliding left/right (swipe on phones, arrow keys on the strap). **No Visit tab**: "Better in the Room" sits under the deck above the footer always. **Strap locked** to the top while scrolling: script-driven `position:fixed` + spacer (`initPin`), top offset measured from a pinned Wix header (`#SITE_HEADER`, fixed/sticky) else 0, slides away with the element's end. Sample A (B pushed bigger on desktop) was shown and not chosen.
- CTA fixed per Bradly: three lines with rules, "Monday 7:00 PM Glory Night in Pineville"; keys `sermons.cta.place1/2/3` replace `bodyMain/bodySecond/bodyEnd` so the live CMS can never reattach Glory Night to Alexandria.
- Element checks (Playwright, in the cloud container): `workspace/sample-site/tests/element/render.cjs` (contracts + screenshots at 390/768/1366/1920), `probe.cjs` (no IntersectionObserver, pre-set attributes, hostile titles, reduced motion, idempotent src, 360px, keys), `tour.cjs` (every room, keyboard, swipe, pin). YouTube is unreachable there, so thumbnails are placeholders.
- Not done in Wix yet: merge + publish; import the 7 rows; optionally delete the 3 old cta rows.
