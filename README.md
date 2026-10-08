# Arise Church — arisecenla.church

The code for the Arise Church website, and the working material around it.
The live site is published from this repo's `main` branch.

| Folder | What it is |
|---|---|
| `src/backend` | Server-side code: Page Content, YouTube, events, classes, galleries, forms |
| `src/pages` | One file per page, named `<Page Name>.<page id>.js`, plus `masterPage.js` for every page |
| `src/public/custom-elements` | The 20 custom elements that draw the site: header, footer, home, sermons, classes and the rest |
| `wix.config.json` | Ties the repo to the site. Wix maintains it — don't edit it by hand |
| `workspace/` | Everything that isn't the site itself: the build notes, audits, tests, CMS backups and the project history. **Wix ignores this folder** |

Wix only reads `src/backend`, `src/pages`, `src/public` and `wix.config.json`. Anything else in the repo, `workspace/` included, is never synced to the Editor and can't affect the site.

## Working on it

```bash
git clone https://github.com/Rehchu/arisechurch.git
cd arisechurch
npm install --ignore-scripts
npm install -g @wix/cli
wix login
```

Two things that catch people out:

- **Use `npm install --ignore-scripts`.** A plain `npm install` fails on the `wix-test-ports` entry in `package.json`, which only installs from Wix's private registry.
- **Run `wix login` in a real terminal window**, not inside an app's panel. It shows a one-time code and waits for a keypress, which panels swallow.

While the site is connected to GitHub, **the Editor's code panel is read-only**. Change code here and push to `main`; the Editor picks it up within a few minutes. Design — page backgrounds, section colours, where elements sit — is still only changeable in the Editor.

## Seeing changes before they go live

```bash
wix preview --source local
```

That builds a private preview from the files on your computer, on the real CMS, and prints a link. It changes neither the live site nor GitHub.

## Publishing

```bash
wix publish --source remote
```

Publishes the latest commit on `main`. **Never choose "Local code"** — that puts the live site out of step with GitHub, and the next publish from the repo overwrites your local work.

Publishing from the command line uses the design version recorded in `wix.config.json`, so Wix warns that the Editor may hold newer design changes. Publishing once from the Editor clears that.

## Checking your work

```bash
node workspace/sample-site/tests/backend.test.mjs      # 19 tests, the server-side code under Node
node workspace/sample-site/tests/page-code.test.mjs    # 90 tests, every page file against a fake Wix
node workspace/audit/check.mjs --pages=home,classes --sites=live --vps=desktop,phone
```

The last one drives a headless browser over the real pages and reports console errors, broken photos, loading times and screenshots. `--sites=preview` needs `--previewq="siteRevision=2&branchId=..."` from the preview link.

## House rules

- **Every word and photo on the site comes from the CMS** (Page Content, 576 rows). Don't type copy into the code; add or edit a row.
- **Never copy `ArchivedFormSubmissions` out of the CMS.** It holds real names, emails, phone numbers and addresses from old form submissions. It stays admin-only in the CMS.
- **Write "Arise Church"**, never just "Arise".
- Test before handing anything over, and check the published site: custom elements don't run properly in the Editor or in Preview.

## Where things stand (8 October 2026)

- Published: the September fix build, the speed work, the MORE class page and whole-flyer class cards.
- First visits are about four times faster than in September and download roughly a seventh of the data.
- **MORE**, a free six-week discipleship course, is published: Sundays 18 Oct – 22 Nov 2026, 9:00–9:45 AM, in person and online. Wix ends it by itself after 22 November.
- Still to do, and only possible in the Editor: style Wix's own class page like the event pages (background `0A0A0C`, header and footer showing, red buttons), and the stray blue strip on the event pages.

`workspace/README.md` explains the rest of the material and how the site got here.
