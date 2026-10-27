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
