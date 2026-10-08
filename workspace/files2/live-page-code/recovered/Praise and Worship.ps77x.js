import { getCreatives, getPageContent } from 'backend/content.web';

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
    const data = await getCreatives();
    console.log('Creatives: ' + data.departments.length + ' departments, ' +
                data.members.length + ' members');
    set('data-depts', data.departments);
    set('data-members', data.members);
  } catch (err) { console.error('Creatives failed:', err); }
});