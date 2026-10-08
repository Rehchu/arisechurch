# Published page code, recovered from Wix's source maps — 14 Sept 2026

Every Velo page-code file on the published site is served (bundled) to the browser, and Wix also
publishes its source map at

    https://bundler.wix-code.com/<metaSiteId>/undefined/<gridAppId>/pages/<pageId>.js.map

whose `sourcesContent` entry `public/pages/<pageId>.js` is the original code. Page IDs come from the
browser console line "Running the code for the <Page> page … open <pageId>.js". Files here are named
`<Page name>.<pageId>.js`.

Pages with code: Sign Up to Serve (j9kva), Meet our Leaders (gliws), Children's Ministry (ih40z),
Youth Ministry (gqfab), Outreach (j03bc), Lead Network (coke9), Home (qpco5), Arise Church Alexandria
(hgxqe), Connect Groups (zvxz2), Creative Arts (m59gp), Praise and Worship (ps77x), Sound (wtsvl),
Media (bv9n3), Classes (b4yyk), Past Sermons (sg492), Ministries (d2xew), Events (c24vq),
Contact (rjf74), masterPage.

Bible Search (uevmu) has NO custom code — its map holds only the module wrapper — which is fine,
the element is self-contained. The other boilerplate pages (Give, Job Board, Information Desk
Registration, About, Podcast, Training) were not fetched for the same reason.

The 13 files Bradly pasted from the Editor are byte-identical to the published versions (only a
trailing newline differs), so there are no unpublished page-code changes.
