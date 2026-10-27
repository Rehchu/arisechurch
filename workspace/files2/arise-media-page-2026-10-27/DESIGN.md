# Arise Media page — DESIGN.md ("House Lights Down")

Final spec for `arise-sermons.js`. Builds the winning "cinema" direction with the grafts the judges
agreed on. Contracts (ids, data-ck keys, attributes, escaping, lazy rules) are in BRIEF.md and
are not repeated as prose here; they appear in the DOM outline where they live.

## Thesis
The whole page is one dark theatre lit by the church's own footage: the latest service's poster is a
full-bleed stage under an oversized Anton SERMONS, every dark room below is lit by the thumbnail of
the thing it plays, and one red "footlight" runs along every diagonal cut and comes on when the
church goes live. It is the home page's exact vocabulary (ink, red, upright Anton over photography,
the mark, the skewed strip, the four buttons) turned up to cinematic scale, with the Clips section
as the bone "lobby" and the CTA as the red curtain.

## Tokens (one `:root`-scoped block on `.aes`)
```css
.aes{
  --red:#D6222D; --redL:#DB3F48; --ink:#0A0A0C; --scrim:#060608; --bone:#F4F2F0;
  --paper:#fff; --muted:#6A6A6E; --ruleD:rgba(255,255,255,.15); --ruleL:rgba(10,10,12,.12);
  --shell:1180px; --gut:clamp(20px,5vw,56px); --sect:clamp(56px,8vw,104px);
  --cut:28px; --foot:4px;            /* diagonal rise + footlight thickness; 48px / 5px at >=900 */
  --hang:40px;                       /* stage screen overhang; 72px at >=900 */
  --hdr:76px;                        /* fixed Wix header above the element */
  --h1:clamp(70px,18vw,196px);       /* 196 at >=1200 (ANGLES graft), 70 at 390 */
  --h2:clamp(40px,7vw,96px);         /* Sermons, Better In The Room */
  --h2s:clamp(36px,5.4vw,72px);      /* Glory Nights, Clips, series */
  --h3:clamp(24px,2.6vw,36px);       /* Sunday Morning Service, Now Playing title */
  --fig:clamp(56px,7vw,96px);        /* oversized red count figure */
  --lede:clamp(16px,1.4vw,18px); --body:clamp(15px,1.3vw,17px);
  --ease:cubic-bezier(.2,.7,.2,1);
  font-family:'Oswald',Helvetica,Arial,sans-serif; font-weight:300; color:#fff;
  background:var(--scrim); color-scheme:light only; overflow-x:clip; display:block;
}
/* Breakpoints: phone <=560 · small tablet 561–899 · tablet 900–1199 · desktop >=1200.
   Anton everywhere for headings/figures: uppercase, line-height 1.02 (.92 on h1), letter-spacing .02em.
   Mark, kicker, strip, .btn/.btn--ghost/.btn--dark/.btn--onRed, focus outline: copied verbatim from
   arise-home.js (incl. the 620px mark compaction), prefixed .aes instead of .ah. */
```
Shell grid: `.shell{max-width:var(--shell);margin:0 auto;padding:0 var(--gut)}`;
`.g12{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}` at >=900, single column below.
Full-bleed rails: `width:100%; margin:0 calc(-1*var(--gut))` inside the shell, never `100vw`;
`padding-left:max(var(--gut),calc((100% - var(--shell))/2 + var(--gut)))` so card 1 aligns to the shell.
Folio numerals (house `.path__n` device): Anton 13px, red/redL, letter-spacing .12em, "01"…"06",
sit 10px above every section's mark; they match the strap's jump list.

## DOM outline (order is the page order; `§` = full-bleed section)
```
<arise-sermons class="aes [aes-js] [is-live]">
 §1 .stage #aesStage             (scrim; backdrop clipped with cut + footlight)
   .stage__bg  > img.stage__img (latest poster) ; ::after = footlight
   .shell.g12 > .stage__txt (cols 1-5)
       .folio "01" · .mark.mark--l > .kicker[data-ck=sermons.hero.kicker] "Arise Church"
       h1[data-ck=sermons.hero.heading] "Sermons"
       .strip#ariseBadge > span "Latest Service"      (#ariseBadge is the strip itself; text swaps)
       h2[data-ck=sermons.latest.heading] "Sunday Morning<br>Service"
       .strip.strip--ghost > span[data-ck=sermons.latest.strip] "Arise Church"
       p#ariseLatestTitle (hidden until data) · p#ariseLatestWhen (hidden until data)
       a#ariseLatestLink "Watch on YouTube" (channel /streams, _blank noopener)
     .screen.screen--stage (cols 6-12) > iframe#ariseFeatured (eager, title kept)
 §2 .strap #aesStrap             (ink; jump list + ticker at rest, red LIVE strap when live)
   .strap__tick (aria-hidden copy ×2) · nav.strap__jump > button×6 "01 Latest … 06 Visit"
   a.strap__watch "Watch" (live only, scrolls to #ariseFeatured)
 §3 .series #ariseSeries [hidden unless data-series-active="true"]  (scrim)
   .shell > .folio "02" · .mark.mark--l > .kicker[data-ck=sermons.series.kicker] "Current Series"
     .strip.strip--xl > h2#ariseSeriesTitle (+ optional .series__line from data-series-line)
     a.btn.btn--onRed#ariseSeriesBtn (href data-series-link, text data-series-button)
 §4 .glory #aesGlory             (ink; backdrop = Glory thumb at .18 + red radial glow; cut rising right)
   .shell.g12 > .screen (cols 1-7) > iframe#ariseGloryFrame (lazy)
     .glory__txt (cols 8-12): .folio "03" · .mark.mark--l > .kicker[data-ck=sermons.glory.kicker]
       h2[data-ck=sermons.glory.heading] "Glory Nights"
       dl.sheet: When → span[data-ck=site.times.main.glorynight] "Monday 7:00 PM"
                 Where → span[data-ck=sermons.glory.campus] "Main Campus"
                 Address → span[data-ck=sermons.glory.address] "501 Ates Road, Pineville"
       p#ariseGloryNow (hidden until data) · a.btn.btn--ghost[data-ck=sermons.glory.button] "All Glory Nights"
 §5 .plays #aesSermons           (scrim, the darkest room; two crossfading backdrop layers)
   .shell > .folio "04" · .mark.mark--l > .kicker[data-ck=sermons.playlists.kicker] "Messages & Series"
     h2[data-ck=sermons.playlists.heading] "Sermons" · p.lede[data-ck=sermons.playlists.lede]
   .shell.g12.now: .screen (cols 1-8) > iframe#arisePlaylistFrame (lazy)
     .now__rail (cols 9-12): .strip > span "Now Playing" · h3#arisePlaylistTitle
       p#arisePlaylistCount (figure + label) · a#arisePlaylistLink "Open on YouTube"
   .rail__hd (shell): "Pick a playlist" · button.rail__btn×2 (prev/next)
   .rail#aesPlaylists[role=tablist aria-label="Sermon playlists"] > button.pl[data-list][role=tab]…
   .shell > a.btn.btn--ghost[data-ck=sermons.playlists.button] "All Playlists on YouTube"
 §6 .clips #aesClipsSect         (bone; cut right-high into the CTA)
   .shell > .folio "05" · .mark > .kicker[data-ck=sermons.clips.kicker] "More From Arise Church"
     h2[data-ck=sermons.clips.heading] "Clips &amp; Announcements"
   .rail#aesClips > a.short×N (youtube.com/shorts/<id>, _blank noopener)
   .shell > a.btn.btn--dark[data-ck=sermons.clips.button] "All Messages on YouTube"
 §7 .cta #aesCta                 (red; straight bottom)
   .shell.g12 > .cta__txt (cols 1-7): .folio "06" (white) · .mark (white) > .kicker[data-ck=sermons.cta.kicker]
       h2[data-ck=sermons.cta.heading] "Better In The Room"
       p.cta__p > span[site.times.sunday.main] span[sermons.cta.bodyMain] span[site.times.sunday.second]
                 span[sermons.cta.bodySecond] span[site.times.main.glorynight] span[sermons.cta.bodyEnd]
     a.btn.btn--onRed[data-ck=sermons.cta.button] (cols 9-12) "Plan Your Visit" → /contact target=_top
```
Every device (dot, folio, strip box, index number, scrims) lives OUTSIDE data-ck nodes, because
`applyContent()` overwrites their innerHTML. `#ariseBadge` is the strip element; JS sets
`badge.firstChild.textContent`, and the live dot is `#ariseBadge::before`.

## Section 1 — The stage
Backdrop (`.stage__bg`, absolute, inset 0, overflow hidden, z 0): `<img>` cover, `object-position:
center 30%` (center top on phones), `filter:saturate(.85)`. Source: `hqdefault.jpg` below 1024;
at >=1024 the element swaps to `maxresdefault.jpg` and keeps it only if `onload` reports
`naturalWidth>120` (YouTube serves a 120×90 grey placeholder with status 200), else back to
hqdefault. `onerror` also falls back. Scrims (ink only): desktop left→right
`rgba(6,6,8,.94) 0%, .80 40%, .30 72%, .55 100%`; floor `transparent 55% → rgba(6,6,8,.96) 100%`;
1px top hairline `var(--ruleD)`. Phone: the horizontal scrim becomes vertical `.70 top → .35 mid →
.98 bottom`. The backdrop carries the diagonal: `clip-path:polygon(0 0,100% 0,100% calc(100% -
var(--cut)),0 100%)`, and its `::after` is the footlight parallelogram (`var(--foot)` thick, red)
along that cut. The section itself is not clipped; the iframe is a sibling of the backdrop.

**1366+ (>=1200):** `min-height:clamp(560px,78vh,760px)`, padding-top 72px, padding-bottom 0.
Cols 1-5: folio → mark--l → h1 Anton `var(--h1)` (196px, line-height .92, `overflow-wrap:anywhere`,
`text-shadow:0 6px 30px rgba(0,0,0,.55)`) → 24px → `#ariseBadge` strip → h2 `var(--h3)` white,
margin-top 16px → ghost strip (transparent, 1.5px white border, white text) 12px below → title
Oswald 500 18px white, margin-top 20px → when Oswald 500 12px uppercase .22em `rgba(255,255,255,.62)`
→ link Oswald 600 12px uppercase .16em white, 2px red underline that slides to full width. Cols
6-12 (~670px): `.screen--stage` 16:9, 1px `var(--ruleD)` border, hard offset block
`box-shadow:12px 12px 0 var(--red)` (the only offset frame on the page), `align-self:end`,
`margin-bottom:calc(-1*var(--hang))`, `z-index:3`, `margin-top:-.28em` relative to the h1 row so the
screen's top-left corner covers the feet of SERMONS (poster-title effect; the h1 keeps `z-index:1`
so a longer CMS heading simply runs behind the picture). Backdrop push-in: scale 1.04→1 over 12s.

**768 (561–899):** single column, padding 56px 0 0; folio/mark/h1 (`18vw` ≈ 138px) → badge →
screen full shell width 16:9 (hang `var(--hang)`=40px, offset shadow 8px) → caption (h2, ghost
strip, title, when, link) in that order, below the screen, as the first 24px of the strap zone's
padding. **390:** same stack, h1 70px, screen 358×201 directly under the badge so the latest
service is above the fold, caption beneath; link row 44px tall via padding.

**The pit:** below the stage the element shows `var(--hang)` of plain scrim before the strap (the
strap gets `margin-top:var(--hang)`), so the screen hangs into dark and never covers the strap.

## Section 2 — Programme strap (`#aesStrap`)
Ink `#0A0A0C`, 1px red top rule, 48px tall (44px phone), `position:relative`; sticky only when
live. **At rest, desktop:** shell flex, `.strap__tick` left (cols 1-6, `mask-image` fade on both
ends): one Oswald 500 12px uppercase .24em `--redL` line "NOW SHOWING · <latest title> · STREAMED N
DAYS AGO · ARISE CHURCH" duplicated (second copy aria-hidden) translating 0→-50% over 36s linear
infinite, paused on hover. Right: `nav.strap__jump` of six `<button>`s "01 Latest · 02 Series ·
03 Glory · 04 Sermons · 05 Clips · 06 Visit", Oswald 500 12px uppercase .16em, number in redL,
44px tall, 1px `var(--ruleD)` left rules; each calls `scrollIntoView({block:'start'})` on its section
(every section has `scroll-margin-top:calc(var(--hdr) + 16px)`); never hash hrefs (Wix routing). The
02 button is `hidden` while `#ariseSeries` is hidden. **Phone/tablet:** the jump list alone, a
horizontally scrolling 44px chip row with 16px gutters; the ticker is dropped (its text lives in the
stage caption already). **Live:** see Live takeover.

## Section 3 — Current series (`#ariseSeries`)
`display:none` unless `data-series-active="true"` (then `display:block`); no cut, no footlight, so
absence leaves no seam. Scrim background, padding 56px 0 (40px 0 phone). Shell flex, align-items
end, gap 24px, wrap: folio "02" + mark--l above an XL strip (`.strip--xl`: red, skewX(-9deg),
padding 18px 40px, phone 14px 22px) holding `h2#ariseSeriesTitle` Anton `clamp(32px,5vw,64px)` white
and the optional `.series__line` Oswald 400 14px uppercase .16em white; `#ariseSeriesBtn` as
`btn--onRed` on the same baseline (phone: `display:block`, full width, margin-top 16px). A 4px
red rule, width 50vw-capped `min(50%, 520px)`, runs from the shell's left edge behind the strip.

## Section 4 — Glory Nights (`#aesGlory`)
Ink, `padding:calc(var(--sect) + 24px) 0 var(--sect)`; backdrop layer clipped with the cut rising
the other way (`polygon(0 0,100% 0,100% 100%,0 calc(100% - var(--cut)))`) + footlight: Glory
`hqdefault.jpg` cover, `transform:scale(1.15)`, opacity .18 (a low-res image scaled reads as blur
at zero GPU cost; no `filter:blur` anywhere on the page), radial red glow
`radial-gradient(60% 70% at 85% 50%, rgba(214,34,45,.28), transparent 70%)` (40% size, top-right on
phones), floor scrim to ink. The iframe is outside the clipped layer.

**1366+:** `g12`; screen cols 1-7 (~680×383), `.screen` = 1px `var(--ruleD)` border + 3px red top
rule (no offset shadow); text cols 8-12: folio "03" → mark--l "Monday Nights" → h2 `var(--h2s)` →
call sheet `dl.sheet` (grid `96px 1fr`, rows 1px `var(--ruleD)` rules, each row min-height 52px):
labels Oswald 500 11px uppercase .24em muted; row 1 value = the time span in Anton 26px `--redL`;
rows 2-3 values Oswald 400 16px white → `#ariseGloryNow` 24px below (label "Latest Glory Night"
Oswald 500 11px uppercase .24em redL, title Oswald 500 18px white, when Oswald 300 13px
rgba(255,255,255,.62)) → btn--ghost margin-top 28px. **768 and 390:** text first (so heading and
time lead the section), sheet rows 48px with 14px values, button inline min-height 48px, then the
screen full width 16:9 margin-top 28px. The three data-ck spans are the direct `dd` grid items.

## Section 5 — Sermons / playlists (`#aesSermons`)
Scrim, `padding:calc(var(--sect) + 16px) 0 var(--sect)`, cut (left-high) + footlight into bone.
Backdrop: two absolute layers `.plays__bg` A/B, each the SELECTED playlist's `hqdefault` cover,
`scale(1.15)`, opacity .14, under a floor scrim; on selection the inactive layer loads the new thumb
and the two swap opacity over .6s. Header in shell: folio "04" → mark--l → h2 `var(--h2)` → lede
Oswald 300 `var(--lede)` rgba(255,255,255,.82) max 58ch.

**Now-playing stage (1366+):** `g12`, margin-top 48px; `#arisePlaylistFrame` in `.screen` cols 1-8
(~778×438, 3px red top rule); `.now__rail` cols 9-12 `align-self:end` padding-bottom 12px: strip
"Now Playing" → h3 `#arisePlaylistTitle` Anton `var(--h3)` white → `#arisePlaylistCount` rendered as
`<b>113</b><small>messages on YouTube</small>`: figure Anton `var(--fig)` red line-height .9, label
Oswald 500 12px uppercase .22em rgba(255,255,255,.62) → `#arisePlaylistLink` white 12px uppercase
.16em with the sliding red underline. **768/390:** screen full width, then the now-playing block
stacked (h3 24px, figure 56px), link row 44px.

**Programme wall (`#aesPlaylists`):** `.rail__hd` 56px above (shell-aligned): "Pick a playlist"
Oswald 500 12px uppercase .24em muted left; two 44×44 `rail__btn` ghost squares (1.5px white
border, chevrons, `scrollBy(±clientWidth*.8)`) right, hidden under `(hover:none)` or when
`scrollWidth<=clientWidth`. The rail: full-bleed, `overflow-x:auto`, scrollbar hidden,
`scroll-snap-type:x proximity`, `scroll-padding-left` = the shell-aligned padding, gap 18px (12px
phone), `padding-bottom 8px`. Cards `.pl[data-list]` = `<button role=tab>` with `tabindex` roving
(selected 0, others -1): 220×275 (4:5) desktop, 160×200 phone, `flex:0 0 auto`,
`scroll-snap-align:start`. **Lead poster (POSTER graft):** card 1 (Sunday Sermons) is 458×275 (3:2)
desktop / 300×200 phone, `.pl--lead`, title Anton 34px. Card anatomy: `img` cover
`loading=lazy decoding=async width/height` set, `saturate(.75)`; bottom scrim to scrim from 45%;
index "01"…"13" Anton 56px (40px phone) `--redL` at top-left 14px/12px, aria-hidden; title Anton
20px (16px phone) white at the bottom, 2-line clamp (-webkit-box), 14px inset; count Oswald 500
11px uppercase .16em rgba(255,255,255,.7). Selected: `aria-selected=true`, 6px red bar across the
bottom (`scaleX 0→1 .25s`), index flips to white on a small red strip, thumb `saturate(1)`, a
skewed "Playing" strip overlapping the top-left corner (phone-readable selection). Hover
`(hover:hover)`: thumb `scale(1.06)` .5s `var(--ease)`, scrim deepens. On load and after any
re-render the rail sets `rail.scrollLeft` so the selected card is in view (never `scrollIntoView`
on load). Picking: compare src, set `videoseries?list=<id>&rel=0&autoplay=1`, keep selection by
id across re-renders, `.swapping` cut on the frame, `scrollIntoView({block:'nearest'})` on the
player only if it is off-screen. Arrow keys move selection and scroll the tab into view. Below the
rail in shell: btn--ghost "All Playlists on YouTube", margin-top 48px (36px phone).

## Section 6 — Clips & Announcements (`#aesClipsSect`) — position and 9:16 kept
Bone, `padding:calc(var(--sect) + 16px) 0 var(--sect)`, colour ink, cut (right-high) + footlight
into the CTA. Header: folio "05" (red) → mark (red dashes, red kicker) → h2 `var(--h2s)` ink.
`#aesClips` rail 40px below, same rail mechanics (full-bleed, snap proximity, hidden scrollbar,
no prev/next): cards `a.short` 236×420 desktop, every even card `translateY(36px)` with 36px extra
rail padding-bottom; 150×267 phone, no stagger; gap 18px/12px; one `<a>` per card to
`youtube.com/shorts/<id>`, ink background, 1px `var(--ruleL)` rule: `frame0.jpg` cover lazy
(alt = title), bottom scrim to scrim from 50%, index "01"…"08" Anton 40px (32px phone) white
top-left with a 3px red underline 36px wide, title Oswald 500 15px (14px phone) uppercase .04em
white at the bottom, 3-line clamp, 16px inset; 44×44 (40 phone) play glyph bottom-right: ink square
`skewX(-9deg)` with 1.5px white border and a white triangle. Hover `(hover:hover)`: thumb
`scale(1.05)`, a 4px red bar grows along the bottom (`scaleX 0→1 .25s`). Below, in shell:
btn--dark "All Messages on YouTube", margin-top 56px (40px phone).

## Section 7 — Join us in person (`#aesCta`)
Red, `padding:calc(var(--sect) + 16px) 0 var(--sect)`, straight bottom. `g12`: cols 1-7 folio
"06" white → mark with white dashes/white kicker → h2 `var(--h2)` white → `p.cta__p` (the one
existing `<p>` with its six spans in order) Oswald 400 19px (17px phone) rgba(255,255,255,.92),
max 44ch, line-height 1.7: the three time spans (`site.times.*`) styled via `[data-ck^="site.times"]`
as Anton 30px (24px phone) white uppercase with a 3px white underline (`text-decoration-thickness`),
`white-space:nowrap`; the body spans stay Oswald. Cols 9-12 `align-self:center; justify-self:end`:
btn--onRed "Plan Your Visit", padding 19px 38px, min-height 56px. Phone: stacked, button
`display:block` full width min-height 52px, margin-top 26px.

## Section diagonal cuts, summary
Stage: left-high, bottom. Glory: right-high (rises the other way), bottom. Sermons: left-high
into bone. Clips: right-high into red. Series and CTA: no cut. Footlight = `::after` of the clipped
backdrop layer, `var(--foot)` thick, red, same polygon offset by the thickness, so it can never
paint outside. The section after a cut gets `padding-top` + `var(--cut)`; backgrounds of adjacent
sections show through the wedge (scrim/ink/bone/red), which is the whole point.

## Motion
All CSS; JS only toggles classes. `.aes-js` is added to the root only after an IntersectionObserver
is constructed successfully. Reveal rule scoped as `.aes-js .r:not(.in){opacity:0;transform:
translateY(18px)}`, `.in` → opacity 1 / translate 0 over .6s `var(--ease)`. Observed `.r`: each
section's header block, each `.screen`, each rail; cards inside a rail stagger with
`transition-delay:min(index,8)*60ms` set inline at render. Each observed element also gets a
1500ms `setTimeout` that force-adds `.in`, and a 1800ms root class `.aes-settled` forces every `.r`
visible. The stage never hides anything. Stage push-in: `.stage__img` `scale(1.04)→1` 12s ease-out
once, >=900 only (1.02 on phones). Ticker: `translateX(0→-50%)` 36s linear infinite, pause on
hover. Hover/focus: thumbs scale 1.06/1.05 .5s; red bars `scaleX` .25s from left; link underlines
.2s; buttons keep the home `.18s` background/colour transitions; `focus-visible` 3px red outline
offset 3px everywhere. Playlist pick: new card's bar in, old card's bar out; `.screen.swapping::after`
scrim overlay opacity .6 for 350ms while src changes; backdrop crossfade .6s. Rails: native
scroll, `scroll-behavior:smooth`. `will-change:transform` only on the two pulsing live elements.
`@media (prefers-reduced-motion: reduce)`: every animation/transition `none`, `.r` always visible,
ticker static single line with ellipsis, no push-in, no pulse (solid red outline/dot), hover
scales off, `scroll-behavior:auto`.

## Live takeover (`data-live-video` → root `.is-live`)
Applied when the id matches `^[A-Za-z0-9_-]{11}$`; removed when it becomes `''`. Only four things
change, nothing else on the page relayouts: (1) `#ariseFeatured` src → `embed/<id>?rel=0` (compared
first; latest-video arriving later does not override while live); (2) stage backdrop img → the live
id's poster (same hq/maxres rule, crossfade .6s, no iframe reload if src unchanged); the left scrim
becomes red→ink `rgba(214,34,45,.78) 0%, rgba(6,6,8,.72) 55%, rgba(6,6,8,.4) 100%`; (3) `#ariseBadge`
text "Live Now" + a 10px white dot `::before` pulsing (`scale 1→1.6, opacity 1→.3`, 1.2s ease-in-out
infinite); the stage screen border turns red with a pulse ring (`box-shadow 0 0 0 0
rgba(214,34,45,.7) → 0 0 0 22px rgba(214,34,45,0)`, 1.8s ease-out infinite); the stage footlight
pulses `#D6222D↔#DB3F48` at 1.8s; (4) `#aesStrap` turns solid red, `position:sticky; top:var(--hdr);
z-index:5` on every breakpoint, 56px tall (48 phone), content "LIVE NOW · <title>" in Anton
`clamp(20px,2.4vw,32px)` white (ticker when wider than the strap, otherwise static) with the white
dot, plus `a.strap__watch` "Watch ↑" Oswald 600 12px uppercase 44px tall that scrolls to
`#ariseFeatured`; the jump list hides. Playlist and Glory players are never touched by live state.
Reverting removes the class, restores "Latest Service", the latest poster and the resting strap in
the same frame. If a Wix wrapper breaks sticky, the strap is static; the takeover still reads.

## Late or missing data
- No `data-latest-video`: `#ariseFeatured` = the UULV videoseries embed, badge "Latest Service",
  title/when stay `display:none`, link → `/streams`, backdrop = no image: stage is plain scrim with
  the scrims, the footlight and a red 260×180 corner wedge (clip-path) top-right so it is not a
  black slab; ticker reads "NOW SHOWING · SUNDAY MORNING SERVICE · ARISE CHURCH".
- `data-glory-video` missing: playlist embed, `#ariseGloryNow` hidden, backdrop = glow only.
- `data-playlists` missing: the built-in 13 render identically (ids, thumbs, counts), card 1 lead.
  On arrival: diff by id, keep `aria-selected` and `scrollLeft`, never reset a matching src.
- `data-clips` missing: the built-in 8 Shorts. A lagging `frame0.jpg` still shows an ink card
  with index and title.
- Series attributes absent: `#ariseSeries` display:none and the 02 jump chip hidden.
- Images: every `<img>` has `width`/`height`, `alt`, ink/bone background; `onerror` falls back
  hq→nothing (the scrim remains). Thumbnails below the fold are `loading=lazy decoding=async`; the
  stage image is eager with `fetchpriority=high` (it is the LCP).

## Accessibility
One h1 ("Sermons"); h2 per section; h3 only for `#arisePlaylistTitle`. `#aesPlaylists` is
`role=tablist` with real `<button role=tab aria-selected>` cards (accessible name = title; index
and count aria-hidden), roving tabindex, Left/Right/Home/End keys, Enter/Space picks. Shorts are
real `<a>` with alt text and visible titles; the play glyph is aria-hidden. Jump list and rail arrows
are `<button>`s with labels; the duplicated ticker copy, folios, indices and footlights are
aria-hidden. Every iframe keeps its `title`; `#ariseFeatured` title updates to the live/latest
title. 44px minimum tap targets; contrast: white/ink, redL on ink, white on red all >= 4.5:1;
muted text only at 11-12px uppercase labels on ink at `rgba(255,255,255,.62)` (>= 4.5:1).
Focus outlines: 24px clearance from every diagonal cut so clip-path never eats them.

## Engineering notes the developer must keep
- Light DOM; every class prefixed `.aes`; CSS injected once by id `aes-sermons-css`; reset
  `h1,h2,h3,p,button,img,iframe,dl,dt,dd` inside `.aes`. No `position:sticky` at rest; no
  `position:fixed` ever. Both players stay outside any clipped, transformed or overflow-hidden
  ancestor; the overhang is margin + z-index, not transform.
- `overflow-x:clip` on the root; rails are the only horizontal scrollers; width:100% + negative
  margins, never 100vw. Test at 390/768/1366/1920 for zero page overflow.
- maxres check is `naturalWidth>120`, not `onerror` alone. hqdefault below 1024 everywhere.

## Do not
- Do not skew headings or body text (only the strip, the play glyph, the series XL strip).
- No blur filters, no grey/soft shadows, no rounded corners, no centred sections, no hues beyond
  red/redL/ink/scrim/bone/white/muted; gradients only as ink/red scrims and the one radial glow.
- No second hard offset frame; no ghost brand words; no outlined (text-stroke) type.
- No 100vh, no 100vw, nothing sticky at rest, no extra header/nav bar above the stage.
- No devices inside data-ck nodes; no hash-href in-page links; no autoplay except on a user pick.
- Do not run headlines off the viewport; long CMS headings wrap (`overflow-wrap:anywhere`).
- Do not move or reshape the Shorts: fifth section, 9:16 cards, rail on phones.
