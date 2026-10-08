# Events — automatic from Wix Events

Two files. Once they're in, **every event you create in Wix Events appears on the page by itself** — with its own uploaded image, the right button, and a link to its own registration page.

Nothing to edit in code when you add an event.

---

## What the button says

Read straight from each event's registration settings:

| Event setup | Button |
|---|---|
| RSVP, open | **RSVP** |
| Ticketed, open | **Get Tickets** |
| Sold out | **Sold Out** — greyed, not clickable |
| Closed or ended | **View Event** |
| External registration | **Register** |
| No registration | **View Event** |

---

## 1. Backend — `backend/events.jsw`

```javascript
import { events } from 'wix-events.v2';
import { elevate } from 'wix-auth';

const elevatedQuery = elevate(events.queryEvents);

function ctaFor(ev) {
  const reg = ev.registration || {};
  const type = reg.type;
  const status = reg.status || '';

  if (reg.registrationDisabled) return { cta: 'View Event', ctaEnabled: true };

  if (type === 'TICKETING') {
    if (reg.tickets && reg.tickets.soldOut) return { cta: 'Sold Out', ctaEnabled: false };
    if (status.indexOf('OPEN') === 0) return { cta: 'Get Tickets', ctaEnabled: true };
    return { cta: 'View Event', ctaEnabled: true };
  }
  if (type === 'RSVP') {
    if (status === 'OPEN_RSVP_WAITLIST') return { cta: 'Join Waitlist', ctaEnabled: true };
    if (status.indexOf('OPEN') === 0) return { cta: 'RSVP', ctaEnabled: true };
    return { cta: 'View Event', ctaEnabled: true };
  }
  if (type === 'EXTERNAL') return { cta: 'Register', ctaEnabled: true };
  return { cta: 'View Event', ctaEnabled: true };
}

function shape(ev) {
  const dt = ev.dateAndTimeSettings || {};
  const f  = dt.formatted || {};
  const start = dt.startDate ? new Date(dt.startDate) : null;
  const loc = ev.location || {};
  const addr = (loc.address && loc.address.formatted) || '';

  return Object.assign({
    id: ev._id || ev.id,
    title: ev.title || '',
    shortDescription: ev.shortDescription || '',
    image: (ev.mainImage && (ev.mainImage.url || ev.mainImage)) || '',
    dateLine: f.dateAndTime || '',
    startDate: f.startDate || '',
    startMonth: start ? start.toLocaleString('en-US', { month: 'short' }) : '',
    startDay: start ? String(start.getDate()) : '',
    location: addr || loc.name || '',
    url: (ev.eventPageUrl && ev.eventPageUrl.path) || ''
  }, ctaFor(ev));
}

/**
 * Upcoming events (soonest first) and past events (most recent first).
 */
export async function getEvents() {
  try {
    const res = await elevatedQuery({ fields: ['DETAILS', 'TEXTS', 'REGISTRATION', 'URLS'] })
      .ne('status', 'CANCELED')
      .limit(50)
      .find();

    const all = (res.items || []).map(shape);
    const raw = res.items || [];

    const upcoming = [], past = [];
    raw.forEach((ev, i) => {
      const s = all[i];
      if (!s.url) return;
      if (ev.status === 'UPCOMING' || ev.status === 'STARTED') upcoming.push(s);
      else if (ev.status === 'ENDED') past.push(s);
    });

    upcoming.sort((a, b) => (a.dateLine > b.dateLine ? 1 : -1));
    past.reverse();

    return { upcoming, past: past.slice(0, 8) };
  } catch (err) {
    console.error('getEvents failed:', err);
    return { upcoming: [], past: [] };
  }
}
```

---

## 2. Events page code

```javascript
import { getEvents } from 'backend/events.jsw';

// Right-click the custom element -> View Properties to confirm this ID.
const EL = '#customElement1';

$w.onReady(async () => {
  if (!$w(EL).length) {
    console.warn('Events: custom element ' + EL + ' not found.');
    return;
  }

  try {
    const data = await getEvents();
    if (data && (data.upcoming.length || data.past.length)) {
      $w(EL).setAttribute('data-events', JSON.stringify(data));
      console.log('Events loaded:', data.upcoming.length, 'upcoming,', data.past.length, 'past');
    }
  } catch (err) {
    console.error('Events load failed:', err);
    // element keeps its built-in fallback
  }
});
```

---

## What the page becomes

**Featured** — your next upcoming event, using its own uploaded poster, with the date block, time, location, and the correct button.

**Also Coming Up** — every other upcoming event as a card.

**Previous Events** — your past events with their real images, most recent first, capped at eight. That section was an empty placeholder before.

You have **13 events** in Wix Events right now, so the past grid fills immediately.

---

## Adding a new event

Create it in Wix Events as normal. Nothing else. The site picks up its image, dates, location, registration type and link on the next page load.

**The image is whatever you upload as the event's main image** — so make it a good one. It's the biggest thing on the page.

---

## If the backend import fails

Some sites expose the events module differently. If `wix-events.v2` errors, try:

```javascript
import { events } from 'wix-events-backend';
```

and drop the `elevate` wrapper — `queryEvents` on that module runs with site permissions already.

Everything else stays the same. Tell me which one your site accepts and I'll lock the file to it.
