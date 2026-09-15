import { Permissions, webMethod } from 'wix-web-module';
import { projectItems } from '@wix/portfolio';
import { auth } from '@wix/essentials';

function fromImage(info) {
  if (typeof info !== 'string') return '';
  if (info.indexOf('wix:image://') !== 0) return info;
  const id = info.split('wix:image://v1/')[1].split('/')[0].split('#')[0];
  return 'https://static.wixstatic.com/media/' + id;
}

function fromVideo(info) {
  if (typeof info !== 'string' || info.indexOf('wix:video://') !== 0) {
    return { id: '', poster: '' };
  }
  const id = info.split('wix:video://v1/')[1].split('/')[0];
  const hash = info.split('#')[1] || '';
  const m = hash.match(/posterUri=([^&]+)/);
  return {
    id: id,
    poster: m ? 'https://static.wixstatic.com/media/' + decodeURIComponent(m[1]) : ''
  };
}

export const getProjectPhotos = webMethod(
  Permissions.Anyone,
  async (projectId) => {
    try {
      const list = auth.elevate(projectItems.listProjectItems);
      const res = await list(projectId);
      const items = res.items || [];

      return items.map((it) => {
        if (it.type === 'VIDEO') {
          const v = fromVideo(it.video && it.video.videoInfo);
          return { src: v.poster, videoId: v.id, alt: it.title || '', caption: it.description || '' };
        }
        return {
          src: fromImage(it.image && it.image.imageInfo),
          alt: it.title || '',
          caption: it.description || ''
        };
      }).filter((p) => p.src || p.videoId);

    } catch (err) {
      console.error('getProjectPhotos failed for ' + projectId + ':', err);
      return [];
    }
  }
);