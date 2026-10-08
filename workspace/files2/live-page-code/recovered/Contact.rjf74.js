import { getPageContent } from 'backend/content.web';

const EL = '#customElement1';   // right-click -> View Properties

$w.onReady(async () => {
  const content = await getPageContent();
  console.log('Content: ' + Object.keys(content).length + ' keys');

  const fill = (n) => {
    const el = $w(EL);
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-content', JSON.stringify(content));
      console.log('Contact: rendered on ' + EL);
      return;
    }
    if (n < 40) setTimeout(() => fill(n + 1), 300);
    else console.warn('Contact: element never became ready');
  };
  fill(1);
});