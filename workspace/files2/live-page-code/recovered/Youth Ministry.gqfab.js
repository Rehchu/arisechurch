import { getProjectPhotos } from 'backend/gallery.web';
import { getPageContent } from 'backend/content.web';

const PROJECT_ID = 'c2be296e-9eb4-4a02-b6b8-428128fbe50d';
const EL = '#customElement1';

$w.onReady(async () => {
  const set = (attr, val) => {
    const fill = (n) => {
      const el = $w(EL);
      if (el && typeof el.setAttribute === 'function') {
        el.setAttribute(attr, JSON.stringify(val));
        return;
      }
      if (n < 30) setTimeout(() => fill(n + 1), 300);
    };
    fill(1);
  };

  try {
    const content = await getPageContent();
    console.log('Content: ' + Object.keys(content).length + ' keys');
    set('data-content', content);
  } catch (err) { console.error('Content failed:', err); }

  try {
    const photos = await getProjectPhotos(PROJECT_ID);
    console.log('Gallery: ' + photos.length + ' items');
    set('data-photos', photos);
  } catch (err) { console.error('Gallery failed:', err); }
});