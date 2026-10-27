# Bible Search page — 2026-10-27

- Rebuilt `/arise-bible` in the Media page theatre (masthead, locked tab strap, sliding rooms 01 Read / 02 Study / 03 Listen / 04 Bibles, "Hear It Taught" above the footer). Element `arise-bible.js`, no page code.
- Backend `src/backend/bible.js` = AriseHub lib/bible.ts + usfm-books + /api/bible routes converted to Velo (wix-fetch, wix-secrets-backend). Eight sources incl. ESV API and **AriseHub itself as a source** (personal API key → one-hour session; brings every AriseHub Bible + the Easton/Smith dictionary). English only (user's rule, 27 Oct). HTTP functions `get_bible`, `get_bibleBibles`, `get_bibleBooks`, `get_bibleReference`, `get_bibleDictionary`, `get_bibleStatus`.
- Keys stored in Wix Secrets Manager via the connector on 27 Oct (user is not the Wix admin and could not): `YOUVERSION_APP_KEY`, `API_BIBLE_KEY` (+ older `APIbible` from 2025-12-25), `BIBLIA_API_KEY`, `ARISEHUB_API_KEY`. `ESV_API_KEY` not set. The user pasted the keys in chat; they are in the chat log — rotating later is sensible.
- AriseHub's Supabase already holds the dictionary (5,990 entries / 35,046 refs) with RLS for authenticated only; the bridge reads it through AriseHub's routes, so no DB policy change was needed.
- Two AriseHub slips found while porting (not fixed there): KJV rule `authoris[ez]d` never matches "Authorized"; Biblia lists language "en", which `/english/i` drops. Suggested as follow-up tasks.
- Preview artifact: https://claude.ai/artifact/Hg6iomuBQtD3fPnNPRcYBm (sample data). User approves the preview before anything is merged or published.
- Docs: `workspace/files2/arise-bible-page-2026-10-27/BRIEF.md`; CMS plan in `cms/PageContent-bible-page-2026-10-27.{csv,json}`; manifest `cms/manifest/arise-bible.json` (28 keys).
