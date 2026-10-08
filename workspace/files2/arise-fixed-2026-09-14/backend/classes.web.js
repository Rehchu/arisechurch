/* Arise Church - backend/classes.web.js
   Fixed 2026-09-14: removed the debug log of the first program; a price of 0
   now shows Free. Links stay /class-detail/<slug> (the live Online Programs page). */
import { Permissions, webMethod } from 'wix-web-module';
import { programs } from '@wix/online-programs';
import { auth } from '@wix/essentials';

function fromImage(info) {
  if (typeof info !== 'string') return '';
  if (info.indexOf('wix:image://') !== 0) return info;
  const id = info.split('wix:image://v1/')[1].split('/')[0].split('#')[0];
  return 'https://static.wixstatic.com/media/' + id;
}

export const getPrograms = webMethod(
  Permissions.Anyone,
  async () => {
    try {
      const query = auth.elevate(programs.queryPrograms);
      const res = await query().eq('status', 'PUBLISHED').find();
      const items = res.items || res.programs || [];

      return items.map((p) => {
        const d = p.description || {};
        const media = d.media || d.image || {};
        const rawImg = typeof media === 'string'
          ? media
          : (media.image || media.url || media.imageInfo || '');
        // A program priced 0 (or with no price) is Free; '0' is a truthy string.
        const amount = p.price && p.price.value != null ? Number(p.price.value) : 0;
        const price = amount > 0
          ? (p.price.currency === 'USD' ? '$' : '') + p.price.value
          : 'Free';

        // Dates for a scheduled class: startDate is a local date, durationInDays
        // counts the first day, so day 1 + (duration - 1) is the last day.
        const tl = p.timeline || {};
        const startDate = tl.startDate || '';
        let endDate = '';
        if (startDate && tl.durationInDays) {
          const d0 = new Date(startDate + 'T00:00:00Z');
          d0.setUTCDate(d0.getUTCDate() + (Number(tl.durationInDays) - 1));
          endDate = d0.toISOString().slice(0, 10);
        }

        return {
          id: p.id,
          slug: (p.seo && p.seo.slug) || '',
          title: d.title || '',
          details: d.details || '',
          image: fromImage(rawImg),
          price: price,
          steps: p.stepCount || 0,
          sections: p.sectionCount || 0,
          selfPaced: !!(p.timeline && p.timeline.selfPaced),
          startDate: startDate,
          endDate: endDate,
          url: (p.seo && p.seo.slug) ? '/class-detail/' + p.seo.slug : ''
        };
      });

    } catch (err) {
      console.error('getPrograms failed:', err);
      return [];
    }
  }
);
