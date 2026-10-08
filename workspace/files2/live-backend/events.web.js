import { Permissions, webMethod } from 'wix-web-module';
import { wixEventsV2 } from '@wix/events';
import { auth } from '@wix/essentials';

/* Wix hands media back as `wix:` strings in some places and objects in
   others, so handle both. */
function imgUrl(v) {
  if (!v) return '';
  if (typeof v === 'object') return v.url || v.src || '';
  if (v.indexOf('wix:image://') !== 0) return v;
  const id = v.split('wix:image://v1/')[1].split('/')[0].split('#')[0];
  return 'https://static.wixstatic.com/media/' + id;
}

function ctaFor(ev) {
  const reg = ev.registration || {};
  const type = reg.type;
  const status = String(reg.status || '');

  if (type === 'TICKETING') {
    if (reg.tickets && reg.tickets.soldOut) return { cta: 'Sold Out', ctaEnabled: false };
    if (status.indexOf('OPEN') === 0) return { cta: 'Get Tickets', ctaEnabled: true };
  }
  if (type === 'RSVP') {
    if (status === 'OPEN_RSVP_WAITLIST') return { cta: 'Join Waitlist', ctaEnabled: true };
    if (status.indexOf('OPEN') === 0) return { cta: 'RSVP', ctaEnabled: true };
  }
  if (type === 'EXTERNAL') return { cta: 'Register', ctaEnabled: true };
  return { cta: 'View Event', ctaEnabled: true };
}

function shape(ev) {
  const dt = ev.dateAndTimeSettings || {};
  const f = dt.formatted || {};
  const start = dt.startDate ? new Date(dt.startDate) : null;
  const loc = ev.location || {};
  const url = ev.eventPageUrl;

  return Object.assign({
    id: ev._id || ev.id,
    title: ev.title || '',
    shortDescription: ev.shortDescription || '',
    image: imgUrl(ev.mainImage),
    dateLine: f.dateAndTime || '',
    startDate: f.startDate || '',
    startMonth: start ? start.toLocaleString('en-US', { month: 'short' }) : '',
    startDay: start ? String(start.getDate()) : '',
    location: (loc.address && loc.address.formatted) || loc.name || '',
    url: (url && (url.path || url.url)) || (ev.slug ? '/events-1/' + ev.slug : '')
  }, ctaFor(ev));
}

export const getEvents = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const query = auth.elevate(wixEventsV2.queryEvents);
      const res = await query({ fields: ['DETAILS', 'TEXTS', 'REGISTRATION', 'URLS'] })
        .ne('status', 'CANCELED')
        .limit(50)
        .find();

      const raw = res.items || res.events || [];

      // TEMPORARY -- shows the real field names. Delete once confirmed.
      if (raw.length) {
        console.log('Events: first ->', JSON.stringify(raw[0]).slice(0, 1200));
      }

      const upcoming = [], past = [];
      raw.forEach((ev) => {
        const s = shape(ev);
        if (!s.url) return;
        if (ev.status === 'UPCOMING' || ev.status === 'STARTED') upcoming.push(s);
        else if (ev.status === 'ENDED') past.push(s);
      });

      past.reverse();
      return { upcoming: upcoming, past: past.slice(0, 8) };

    } catch (err) {
      console.error('getEvents failed:', err);
      return { upcoming: [], past: [] };
    }
  }
);
