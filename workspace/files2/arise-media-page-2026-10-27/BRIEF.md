# Arise Church Media page (`/sermons`) — redesign brief

## The ask, in the client's words
Bradly (maintains arisecenla.church, Wix + Velo) on the current Media page layout:
"I don't like that layout on mobile or desktop. Make it modern while keeping the theme. But it
needs to be exciting and adventurous." Earlier: "keep the shorts where they're at" and "make it look
fabulous and keep our current theme". The playlists he named: Sunday Sermons, Apostle Bryant,
Pastor Vanessa, Glory Night.

So: a genuinely different layout (not a restyle of the current one), bold and modern, that still
reads as the same site as the home page and header. Mobile matters as much as desktop.

## What the page must contain (same content, same data, any new arrangement)
1. **Hero / latest service.** The newest service video (`data-latest-video` JSON {id,title,when,url}),
   which becomes the LIVE stream while one runs (`data-live-video` = video id, '' when it ends).
   Badge "Latest Service" / "Live Now" (pulsing when live). Title and "Streamed N days ago" line,
   a Watch-on-YouTube link. When neither attribute arrives, the player embeds
   `https://www.youtube.com/embed/videoseries?list=UULVGS9j7B_prcJkbTNgzlGrKg&rel=0`.
2. **Current series band** — hidden unless `data-series-active="true"`; title (`data-series-title`,
   optional second line `data-series-line`), link + button label.
3. **Glory Nights** — Monday 7:00 PM, Main Campus, 501 Ates Road, Pineville. Player shows the newest
   Glory Night (`data-glory-video` JSON {id,title,when,url}) embedded as
   `https://www.youtube.com/embed/<id>?list=PLYhdT3QigNmY&rel=0`, fallback the playlist embed.
   "Latest Glory Night · title · when" line. Button "All Glory Nights" → the playlist on YouTube.
4. **Sermons (playlists)** — the channel's playlists (`data-playlists` JSON [{id,title,count,thumb,url}])
   with Sunday Sermons, Apostle Bryant Sanders — Messages, Pastor Vanessa Sanders — Messages first.
   Picking one plays it inline (`https://www.youtube.com/embed/videoseries?list=<id>&rel=0`, add
   `&autoplay=1` only on a user pick). A built-in fallback list (13 playlists, in the current file)
   shows until data arrives. Glory Nights is never in this list.
5. **Clips & Announcements (Shorts)** — the newest Shorts (`data-clips` JSON [{id,title}]), 9:16
   cards linking to `https://www.youtube.com/shorts/<id>`, thumbnail `https://i.ytimg.com/vi/<id>/frame0.jpg`.
   Built-in fallback list (8 Shorts, in the current file). The client said to keep the Shorts
   where they are: this section stays in this position in the page order and stays a set of 9:16
   cards; it may be restyled and may become a swipe rail on phones.
6. **Join us in person CTA** — Sunday 10:30 AM Pineville, Sunday 10:00 AM Alexandria, Glory Nights
   Monday 7:00 PM, button "Plan Your Visit" → `/contact` (target="_top").

Thumbnails you can use for art: `https://i.ytimg.com/vi/<id>/hqdefault.jpg` (480x360, always exists),
`maxresdefault.jpg` (1280x720, exists for most streams; use as a backdrop with hqdefault as a fallback
via onerror). The latest service, the Glory Night and every playlist have an id/thumb, so cinematic
imagery is available everywhere: hero backdrops, poster cards, blurred stages.

## Theme (non-negotiable — it must look like the rest of arisecenla.church)
- Fonts: `Anton` for all headings (uppercase, tight line-height 1.02, letter-spacing .02em) and
  `Oswald` 300/400/500/600 for everything else. Google Fonts link:
  `https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600&display=swap`.
- Colours: red `#D6222D` (lighter `#DB3F48` on dark), ink `#0A0A0C`, scrim `#060608`, white, bone
  `#F4F2F0`, muted `#6A6A6E`, rules `rgba(10,10,12,.12)` / `rgba(255,255,255,.15)`. No other hues.
  Gradients only as black/red scrims over imagery.
- House devices, used across the site: the "mark" kicker (two red dashes then small uppercase red
  text, letter-spacing .30em), the skewed red "strip" tag (`skewX(-9deg)` red block, white
  uppercase text), uppercase 12px letter-spaced buttons with 1.5px borders (red fill / white ghost
  / ink outline), 3px red focus outline. Keep these; invent new devices only in that family
  (angles, skews, red rules, oversized type).
- Shell: max-width 1180px, gutter clamp(20px,5vw,56px). Header above the element is a fixed-height
  76px ink bar (the element starts below it; do not add your own header or nav bar).
- Light-only colour scheme inside the element (`color-scheme: light only`), the element paints its
  own backgrounds.

## Engineering constraints (Velo custom element)
- One file: `arise-sermons.js`, vanilla JS, `class AriseSermons extends HTMLElement`,
  `customElements.define('arise-sermons', AriseSermons)`, light DOM (no shadow root), CSS injected
  into `document.head` once (id `aes-sermons-css`), fonts link once. No libraries, no build step,
  no external CSS. ES2017-level syntax is fine (the current file's style).
- Keep every public attribute and its behaviour: `data-clips`, `data-live-video`, `data-latest-video`,
  `data-glory-video`, `data-playlists`, `data-series-active`, `data-series-title`, `data-series-line`,
  `data-series-link`, `data-series-button`, `data-content`. They can arrive in any order, after
  render, and change later (`attributeChangedCallback`). Re-applying the same value must not reload
  a player (compare src before setting). Re-rendering a list must keep the selected playlist.
- Keep the CMS hooks: every `data-ck="<key>"` element currently in the file must still exist with
  the same key and the same default text, because Page Content overwrites their innerHTML:
  sermons.hero.kicker, sermons.hero.heading, sermons.latest.heading, sermons.latest.strip,
  sermons.series.kicker, sermons.glory.kicker, sermons.glory.heading, sermons.glory.campus,
  sermons.glory.address, sermons.glory.button, site.times.main.glorynight (used twice),
  sermons.playlists.kicker, sermons.playlists.heading, sermons.playlists.lede,
  sermons.playlists.button, sermons.clips.kicker, sermons.clips.heading, sermons.clips.button,
  sermons.cta.kicker, sermons.cta.heading, site.times.sunday.main, sermons.cta.bodyMain,
  site.times.sunday.second, sermons.cta.bodySecond, sermons.cta.bodyEnd, sermons.cta.button.
  Keep `applyContent()` (data-ck / data-ci / data-ciw) as is.
- Keep these element ids, since the methods use them: `#ariseFeatured` (top iframe), `#ariseBadge`,
  `#ariseLatestTitle`, `#ariseLatestWhen`, `#ariseLatestLink`, `#ariseSeries`, `#ariseSeriesTitle`,
  `#ariseSeriesBtn`, `#ariseGloryFrame`, `#ariseGloryNow`, `#aesClips`, `#aesPlaylists`
  (the playlist chooser container with `.pl[data-list]` buttons, `aria-selected`),
  `#arisePlaylistFrame`, `#arisePlaylistTitle`, `#arisePlaylistCount`, `#arisePlaylistLink`.
  You may change the methods, but the harness checks these ids and attribute behaviours.
- All video ids validated `^[A-Za-z0-9_-]{11}$`, playlist ids `^[A-Za-z0-9_-]{13,40}$`, all text
  escaped before innerHTML (there is an `asrEsc`). Only the top player loads eagerly; every other
  iframe `loading="lazy"`; images `loading="lazy" decoding="async"` below the fold.
- Performance: no layout thrash, no per-frame JS; CSS transitions/animations only, under
  `@media (prefers-reduced-motion: reduce)` everything static. Scroll reveals are allowed only with
  IntersectionObserver AND a no-JS/failed-JS fallback where content is visible (never leave
  anything at opacity 0 if the observer never fires; use a class the element adds, with a timeout
  fallback). The page must be complete at rest with no interaction.
- Mobile (390px): no horizontal page overflow, 16px+ gutters, tap targets 44px+, no 100vh hero,
  readable type (body 15px+), players full width 16:9, Shorts cards readable. Test at 390, 768,
  1366 and 1920.
- Accessibility: real buttons/links, visible focus, alt text on images, `role="tablist"` /
  `aria-selected` for the playlist chooser, iframe titles, headings in order (one h1).

## What "modern, exciting, adventurous" can mean here (ideas, not a list to tick)
Cinematic hero using the latest video's poster as a full-bleed backdrop under a huge Anton title;
diagonal/skewed section edges echoing the strip tag; horizontal snap rails with oversized numbers;
a "now playing" stage that swaps content without scrolling; big red type bands; staggered reveals;
a sticky mini-player; poster-card playlists with hover zoom and red rules; asymmetric type/video
grids; marquee kicker text; a live-pulse treatment that takes over the hero when live. Pick a
coherent idea and push it, rather than sprinkling effects. Avoid generic "AI landing page" looks:
no gradient-purple, no rounded-everything, no centered-everything, no card-with-shadow soup.

## Files to read
- Current element (keep its contracts, replace its layout): `/home/user/arisechurch/src/public/custom-elements/arise-sermons.js`
- Home page element for the house style in practice: `/home/user/arisechurch/src/public/custom-elements/arise-home.js`
- Header (what sits above): `/home/user/arisechurch/src/public/custom-elements/arise-header.js`
- Render harness: `node /tmp/claude-0/-home-user/ac3f9982-70af-5564-bac9-0c1d571a04b0/scratchpad/redesign/render.cjs <element.js> <outdir>`
  writes desktop/phone/tablet full-page and above-the-fold PNGs plus `info.json` (overflow, console
  errors, contract checks). YouTube is unreachable from this machine, so the harness swaps thumbnails
  for coloured placeholders and video iframes for dark panels showing their src. Judge layout and
  type, not the placeholder art.
