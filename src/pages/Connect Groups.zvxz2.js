import { getConnectGroups, getPageContent } from 'backend/content.web';

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
    const groups = await getConnectGroups();
    console.log('Connect Groups: ' + groups.length);
    set('data-groups', groups);
  } catch (err) { console.error('Groups failed:', err); }
});