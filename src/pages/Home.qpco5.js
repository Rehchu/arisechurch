import { getProjectPhotos } from 'backend/gallery.web';
import { getPageContent, getHomeSettings } from 'backend/content.web';

const EXCITING_NEWS = 'b2697282-735e-42fc-979a-2b8dc2118f1e';
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
      else console.warn('Home: element not ready for ' + attr);
    };
    fill(1);
  };

  try {
    const content = await getPageContent();
    console.log('Content: ' + Object.keys(content).length + ' keys');
    set('data-content', content);
  } catch (err) { console.error('Content failed:', err); }

  try {
    const culture = await getHomeSettings();
    console.log('Culture video:', culture && culture.videoId ? culture.videoId : 'none');
    if (culture) set('data-culture', culture);
  } catch (err) { console.error('Culture failed:', err); }

  try {
    const news = await getProjectPhotos(EXCITING_NEWS);
    const items = news.map(n => ({
      src: n.src, videoId: n.videoId || '', title: n.alt,
      description: n.caption, alt: n.alt
    }));
    console.log('News: ' + items.length + ' items');
    set('data-news', items);
  } catch (err) { console.error('News failed:', err); }
});