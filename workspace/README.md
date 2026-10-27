# Workspace

Everything about the Arise Church site that isn't the site's own code: how it was built, what was wrong with it, how it's tested, and the full history of the work.

**Wix never reads this folder.** It only syncs `src/backend`, `src/pages`, `src/public` and `wix.config.json`, so nothing here can affect the live site.

## What's here

| Folder | What it holds |
|---|---|
| `files2/arise-fixed-2026-09-14/` | The build that is live today, kept as a reference copy: the custom elements, page code, backend files, the CMS CSV, and **`INSTALL.md`**, which records every change and why. Start here |
| `files2/live-elements/`, `live-backend/`, `live-page-code/` | The code as it was *before* the September fixes, recovered from the site. Pasting these back undoes everything |
| `files2/arise-fixed-2026-08-23/`, `files/` | The earlier August build and its working notes |
| `audit/` | What the audit found, the live-site crawl, a CMS reference, the backups taken before each live CMS change, and the snapshot of the code taken before the speed work |
| `audit/check.mjs` | The headless-browser check used to verify every change on the real site |
| `audit/preview-check-evidence/` | Before-and-after screenshots and the measurement summaries behind the speed claims |
| `sample-site/` | A local copy of the site used for testing: the two test suites, the fake Wix shims, fixtures and build tools |
| `claude-memory/` | Claude Code's memory notes: the church's facts, the working rules, the architecture, and a diary of the work |
| `chat/` | The full chat that produced all of this: the raw transcript and Claude Code's session export |

## Running the tests

From the repo root:

```bash
node workspace/sample-site/tests/backend.test.mjs
```

```bash
node workspace/sample-site/tests/page-code.test.mjs
```

28 and 92 tests. They read the files in `workspace/files2/arise-fixed-2026-09-14`, so keep that folder in step when the site's code in `src/` changes.

## Checking the real site

```bash
node workspace/audit/check.mjs --pages=home,classes --sites=live --vps=desktop,phone
```

It drives headless Edge over the pages, and records console messages, broken photos, loading times, the text each element rendered, and screenshots. Results land in `workspace/audit/preview-check-results/`. Useful flags: `--sites=preview --previewq="siteRevision=2&branchId=..."`, `--workers=1 --nocache --repeat=2` for timing, `--noshots` to skip screenshots. Set `ARISE_EDGE` if Edge isn't in the usual Windows location.

## Two things to know

- **The page-code generator is gone.** The 22 page files were produced by a script that lived in a temporary folder, which Windows has since cleared. The page files themselves (`src/pages/` and the copy in `files2/.../page-code/`) are now the only version. Edit them directly; a snapshot of the older generator is in `audit/working-snapshots-2026-09-15/before-speed-fixes/gen-page-code.js` for reference.
- **No personal data lives here, deliberately.** `ArchivedFormSubmissions` — the 50 rescued form submissions with real names, emails, phone numbers and addresses — stays in the CMS, admin-only. The `.gitignore` blocks that filename, and the chat in `chat/` was scanned before it was committed: it names the collection's *fields* only.

## Restoring a working setup

1. Node 20.11 or later, Git, GitHub CLI, Claude Code, then `npm install -g @wix/cli`.
2. `gh auth login`, then `wix login` in a normal terminal window.
3. `git clone https://github.com/Rehchu/arisechurch.git && cd arisechurch && npm install --ignore-scripts`.
4. For Claude Code to remember the history, copy `workspace/claude-memory/` into
   `C:\Users\<you>\.claude\projects\<project folder>\memory\`.
5. To browse the old chat, `workspace/chat/*.jsonl` goes in that same project folder.
