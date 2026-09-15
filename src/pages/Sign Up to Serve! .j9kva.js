import { getServePositions, getPageContent } from 'backend/content.web';

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
    set('data-content', content);
  } catch (err) { console.error('Content failed:', err); }

  try {
    const positions = await getServePositions();
    console.log('Serve: ' + positions.length + ' positions');
    set('data-positions', positions);
  } catch (err) { console.error('Positions failed:', err); }
});