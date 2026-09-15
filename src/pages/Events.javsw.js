import { getEvents } from 'backend/events.web';

$w.onReady(async () => {
  const data = await getEvents();
  console.log('Events: ' + data.upcoming.length + ' upcoming, ' + data.past.length + ' past');

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-events', JSON.stringify(data));
      console.log('Events: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Events: element never became ready');
  };
  fill(1);
});