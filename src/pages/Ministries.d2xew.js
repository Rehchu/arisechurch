import { getMinistries } from 'backend/content.web';

$w.onReady(async () => {
  const ministries = await getMinistries();
  console.log('Ministries: ' + ministries.length);

  const fill = (n) => {
    const el = $w('#customElement1');
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-ministries', JSON.stringify(ministries));
      console.log('Ministries: rendered');
      return;
    }
    if (n < 10) setTimeout(() => fill(n + 1), 300);
    else console.warn('Ministries: element never became ready');
  };
  fill(1);
});