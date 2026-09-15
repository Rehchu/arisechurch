import { getLeaders } from 'backend/content.web';

$w.onReady(async () => {
  const leaders = await getLeaders();
  console.log('Leaders: ' + leaders.length);

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-leaders', JSON.stringify(leaders));
      console.log('Leaders: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Leaders: element never became ready');
  };
  fill(1);
});