---
name: arise-audit-2026-09-14
description: "Findings of the full audit of arisecenla.church (13–14 Sept 2026) — the Aug 23 fixes were never installed, exact live code versions, page-code defects confirmed in the live browser, latent CMS breakages, backend facts, prior chats"
metadata:
  type: project
---

Audit report `ARISE-AUDIT-2026-09-14.md`, findings `audit/findings-2026-09-14.json` (183), live-code matrix `audit/LIVE-CODE-2026-09-14.md`, CMS reference `audit/CMS-REFERENCE-2026-09-14.md`. The fixes that came out of it are in [[arise-fix-build-2026-09-14]].

**Headline:** the element files fixed on 23 Aug 2026 (`files2/arise-fixed-2026-08-23/`) were **never pasted into Wix**. Exact live sources recovered from the bundler source maps (`files2/live-elements/src/`): 4 match that set (alexandria, leaders, ministries, sermons), 7 are the pre-fix originals (about, connect, contact, events, footer, header, home), 8 are older than files.zip with no Page Content hooks (bible, childrens, classes, creatives, leadnetwork, outreach, serve, youth).

**Page-code defects confirmed live (browser console + DOM):**
- 11 pages target `#customElement1` but their element has another ID, so data never lands: the six Creative Arts department pages (raw slug heading, no tabs, "Team coming soon"), Serve (shows 5 fallback roles instead of 7), Children's, Youth, Outreach, Lead Network. Silent 30-retry loops. Pages that work: Home, Connect Groups, Ministries, Events, Contact, Leaders (`#customElement1`) and Alexandria, Creative Arts hub, Classes (`#customElement5`).
- Past Sermons bails on `if (!$w(EL).length)` (a single-element selection has no length) — no series band data, no live detection.
- masterPage.js used `$w('*')`, which Velo does not support — header, footer, About and every page without its own content code never got Page Content.
- All page code recovered from published maps into `files2/live-page-code/recovered/`; Editor page code = published page code. Bible Search has no page code (fine).

**Broken live at audit time:** homepage raw `data-ck` text; Events "Previous Events" → `/previous-events-1` 404; Contact "Sunday Sunday 10:30 AM"; Service Times element absent; Connect host deadline "September 2" past; no native H1 / meta description; `arise-bible.js` deleted from Velo by Bradly on 14 Sept (live page works until the next publish).

**Latent (would break when fixed elements go in):** five Page Content image rows use `c3b2d0_` media IDs that 403 (childrens.kids.photo, childrens.superkid.logo, outreach.supplies.image, leadnetwork.austin.photo, leadnetwork.calloway.photo) — the same files exist under `1f9fa2_`; gallery calls unreachable inside a map callback in outreach/leadnetwork; service-times panel lost on re-mount.

**YouTube backend bugs found 2026-09-15:** live `youtube.jsw` sends a generic User-Agent, gets YouTube's mobile page, so series auto-detect never worked; its live check treats an upcoming scheduled stream as live (would show "Live Now" over a waiting screen).

**Backend facts (from Bradly's paste):** `content.web.js` has `imgUrl`, `getPageContent` returns `{text,image}`; `http-functions.js` inserts FormSubmissions, then `contacts.appendOrCreateContact`, then Automations `customTrigger.runTrigger` (trigger `519d3164-8dae-4448-a362-35ff96ed2068`), extras in try/catch; `gallery.web.js` uses `@wix/portfolio`; Events page imports `events.web.js`, so `events.jsw` is dead; `getPrograms` already links `/class-detail/<slug>`.

**Prior chats:** Aug 23–24 chat (https://claude.ai/share/79b79a15-6632-4919-aa82-f290c6d64fe2) produced AUDIT-REPORT.md + the Aug 23 zip; the 890-turn build chat (https://claude.ai/share/733c5420-9d61-4cfd-bbdb-8293d5455896) is inaccessible, but its outputs were recovered from the live site. This audit and build chat: [[arise-chat-2026-09-13-to-15]].

**Working notes:** ground truth beats docs — check `[...el.attributes]` in the live DOM and the Velo console logs; multi-agent audits hit session usage limits, lean waves with medium effort complete.

Related: [[arise-fix-build-2026-09-14]], [[arise-site-architecture]], [[arise-church-facts]], [[arise-live-status-2026-09-13]]
