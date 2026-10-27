# Bible Search page — 2026-10-27

- Rebuilt `/arise-bible` in the Media page theatre (masthead, locked tab strap, sliding rooms 01 Read / 02 Study / 03 Listen / 04 Bibles, "Hear It Taught" above the footer). Element `arise-bible.js`, no page code.
- Backend `src/backend/bible.js` = AriseHub lib/bible.ts + usfm-books + /api/bible routes converted to Velo (wix-fetch, wix-secrets-backend). Eight sources incl. ESV API and **AriseHub itself as a source** (personal API key → one-hour session; brings every AriseHub Bible + the Easton/Smith dictionary). English only (user's rule, 27 Oct). HTTP functions `get_bible`, `get_bibleBibles`, `get_bibleBooks`, `get_bibleReference`, `get_bibleDictionary`, `get_bibleStatus`.
- Keys stored in Wix Secrets Manager via the connector on 27 Oct (user is not the Wix admin and could not): `YOUVERSION_APP_KEY`, `API_BIBLE_KEY` (+ older `APIbible` from 2025-12-25), `BIBLIA_API_KEY`, `ARISEHUB_API_KEY`. `ESV_API_KEY` not set. The user pasted the keys in chat; they are in the chat log — rotating later is sensible.
- AriseHub's Supabase already holds the dictionary (5,990 entries / 35,046 refs) with RLS for authenticated only; the bridge reads it through AriseHub's routes, so no DB policy change was needed.
- Two AriseHub slips found while porting (not fixed there): KJV rule `authoris[ez]d` never matches "Authorized"; Biblia lists language "en", which `/english/i` drops. Suggested as follow-up tasks.
- Preview artifact: https://claude.ai/artifact/Hg6iomuBQtD3fPnNPRcYBm (sample data). User approves the preview before anything is merged or published.
- Docs: `workspace/files2/arise-bible-page-2026-10-27/BRIEF.md`; CMS plan in `cms/PageContent-bible-page-2026-10-27.{csv,json}`; manifest `cms/manifest/arise-bible.json` (28 keys).

## Status 27 Oct (later)
- Preview approved ("It's Great! DO IT!"). PR Rehchu/arisechurch#4 merged to main as 3197c54. User publishes in Wix.
- CMS (via connector): 12 new bible.* rows inserted, 3 reworded (form labels -> Bible / Verse or chapter / Read). Four retired rows (bible.cta.pineville, bible.cta.alexandria, bible.cta.end, bible.results.ready) still present: delete once the new page is published.
- After publish: check https://www.arisecenla.church/_functions/bibleStatus (keys true/false, sources offered/listed/error), then the page.
- A 5-lens adversarial review workflow (wf_ef7ce064-b7c) was still running at merge time; its findings, if any, go in a follow-up PR.

## Bridge fix 27 Oct (later)
- Live: 48 Bibles (YouVersion 20, free 12, API.Bible 9, Biblia 7). The AriseHub bridge answered `AriseHub token 403 — Just a moment... Enable JavaScript and cookies` = Cloudflare's challenge page on arisehub.myfaithtech.com (Bot Fight Mode off did not help). Fix: secret `ARISEHUB_URL = https://arisehub.dyer-hq.workers.dev` (the Worker's workers.dev address, outside the zone's security). User turned Bot Fight Mode off and was given a WAF Skip rule as the alternative.
- Review workflow findings applied (see BRIEF.md "Review pass"). bibleStatus re-reads keys on every call; `?refresh=1` refetches catalogues.
- The user pasted a Supabase SECRET key in chat (not used, not stored anywhere); advised rotation + updating the Worker's SUPABASE_SECRET_KEY together.
- AriseHub key `ahk_JLE2Cpah…` ("Arise Website"): expires_at set to NULL at the user's request (keyIsLive treats null as never).
- 05:10Z: bridge confirmed (dictionary.ok true, 25 entries for John 3, AriseHub offered 59 / listed 1, 49 Bibles total). The four retired Page Content rows deleted; 28 bible.* rows remain. Nothing outstanding on the Bible page.

## Ten more free Bibles 27 Oct (later)
- User: "of the other unused ones, which ones do people actually read or want to read? pick the top 10". Source of truth for the 75 free English editions and their ids: `AriseHub/BIBLE-LIST.md` (section A); the live 48-list is in the chat log (pasted bibleBibles JSON). Already on the page from keyed sources, so NOT gaps: Revised Version 1885, Brenton's Septuagint, Cambridge Paragraph KJV, Targum Onkelos, Family 35, TCENT (API.Bible); Orthodox Jewish Bible, WMB British (YouVersion).
- Added to KEYLESS_KEEP: eng_wyc2018 (Wycliffe), eng_tnt (Tyndale NT), eng_wbs (Webster 1833), oeb-us (Open English Bible, bible-api.com), eng_msb (Majority Standard Bible), eng_webc (WEB Catholic), eng_emtv, eng_noy, eng_lee, eng_lxx. `HELLOAO_NAMES` renames the four awkward eBible titles; "English: " prefixes and the upstream "BIble" typo are tidied for every AO Lab entry.
- Left out on purpose: WEB Classic/British/Updated/British+Deuterocanon (editions of a listed work), ASV Byzantine, Updated Brenton / British LXX 2012 (merge into Brenton's or duplicate eng_lxx), Unlocked Literal Bible (translators' tool), God's Living Word, One Unity Resource, Garth's Hyper-literal, Wycliffe 2017/portions, Aboriginal English editions (Anindilyakwa, Barkly, Nyangumarta), Belize Kriol, Gullah.
- The container cannot reach arisecenla.church, bible.helloao.org, jsDelivr or workers.dev (proxy 403); raw.githubusercontent.com works. The BibleStatus collection had 0 rows: nobody has opened `bibleStatus?...&save=1` yet.
