---
name: arise-working-rules
description: "Standing rules Bradly set for work on the Arise Church website — permission before changes, test everything before handing over, CMS drives all text and images, naming, copy, phone review"
metadata:
  type: feedback
---

1. **No design or code change without explicit permission.** Audit, report with evidence, wait for "fix it". Nothing goes onto the live Wix site without Bradly's go-ahead; publishing is his call.
2. **Fix without breaking, and test before finalizing** (2026-09-14: "fix any issues in the existing codes, don't break them, and test them before finalizing"; "do a code test to make sure it works before I add the new files to Wix"). Every existing behaviour must keep working; hand over only after automated tests and a rendered check pass, and report the results.
3. **The CMS is how the site is edited.** Every text block, image, time, label, address and fact should come from CMS → Page Content (or its own collection), not be typed into a JS file (2026-09-14: "it should use CMS to update text, images, etc."). Built-in text stays only as the default until a CMS row exists; importing default rows must not change the page.
4. **Always write "Arise Church"**, never bare "Arise" ("This Is Arise" is the one known exception awaiting his call).
5. **Use the text already live on the site.** Don't invent copy; get titles and facts exactly right (see [[arise-church-facts]] — Pastor Sheron is not a prophet; Pastor Vanessa is Pastor and Prophet).
6. **The site must stay functional** throughout; every page reachable from a menu keeps a home.
7. **Bradly reviews on an iPhone, often in the Facebook in-app browser in dark mode** — `color-scheme: light only`, explicit backgrounds, test at 390 px with dark forced.
8. Test rendered output, not just source; verify live URLs by fetching; the live site beats any doc; publish, not save, is what ships a custom element.

**Why:** he maintains a live church site and has been burned by unrequested changes, invented copy, stale file copies, a wrong doc slug, dark-mode bugs, and a fix set that was prepared but never installed.

**How to apply:** report findings with evidence and wait; build and run tests (sample site + node suites) before handing anything over; route every editable fact through the CMS; phrase anything about people's titles so it can't be misread.

Related: [[arise-fix-build-2026-09-14]], [[arise-church-facts]], [[user-bradly]]
