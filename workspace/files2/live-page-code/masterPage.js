import { getPageContent } from 'backend/content.web';

$w.onReady(async () => {
  try {
    const content = await getPageContent();
    console.log('Site content: ' + Object.keys(content).length + ' keys');
    const json = JSON.stringify(content);

    const fill = (n) => {
      const all = $w('*').filter(e => e.type === '$w.CustomElement');
      if (all.length) {
        all.forEach(el => {
          if (typeof el.setAttribute === 'function') {
            el.setAttribute('data-content', json);
          }
        });
        return;
      }
      if (n < 30) setTimeout(() => fill(n + 1), 300);
    };
    fill(1);
  } catch (err) {
    console.error('Site content failed:', err);
  }
});
