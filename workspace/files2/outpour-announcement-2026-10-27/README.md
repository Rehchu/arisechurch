# The Outpour 2026 — announcement embed (2026-10-27)

`outpour-announcement.html` is a self-contained page for Wix's **Embed HTML**
element (Add → Embed Code → Embed HTML → Code), in the same house as the Media
and Bible pages: Anton and Oswald from Google Fonts, the red footlight under the
dark room, the red call-to-action block at the foot. Nothing in it depends on
the site's own CSS, because the element is an iframe.

The letter is Apostle Bryant T. Sanders, Sr.'s text, word for word; the event
details (October 30 – November 1, 2026, Arise Church, 501 Ates Rd, Pineville)
are the Events collection's, as `arise-events.js` carries them.

Heights to set on the element (the iframe does not size itself):

| Width | Height |
|---|---|
| 1180 px (desktop) | 1950 px |
| 820 px (tablet) | 1880 px |
| 390 px (phone) | 2060 px |

Links: "See the Event" opens the event page in the site itself (`target="_top"`);
"Get Directions" opens Google Maps in a new tab.

Email clients would not render this (web fonts, clip-path); if it is also to go
out by email, make a table-based version rather than pasting this one.
