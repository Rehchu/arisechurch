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

      if (items.length) {
        console.log('Programs: first ->', JSON.stringify(items[0]).slice(0, 1500));
      }

      return items.map((p) => {
        const d = p.description || {};
        const media = d.media || d.image || {};
        const rawImg = typeof media === 'string'
          ? media
          : (media.image || media.url || media.imageInfo || '');
        const price = p.price && p.price.value
          ? (p.price.currency === 'USD' ? '$' : '') + p.price.value
          : 'Free';

        return {
          id: p.id,
          title: d.title || '',
          details: d.details || '',
          image: fromImage(rawImg),
          price: price,
          steps: p.stepCount || 0,
          sections: p.sectionCount || 0,
          selfPaced: !!(p.timeline && p.timeline.selfPaced),
          url: (p.seo && p.seo.slug) ? '/class-detail/' + p.seo.slug : ''
        };
      });

    } catch (err) {
      console.error('getPrograms failed:', err);
      return [];
    }
  }
);
