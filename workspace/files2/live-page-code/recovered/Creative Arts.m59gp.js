import { getCreatives, getPageContent } from 'backend/content.web';

const EL = '#customElement5';

$w.onReady(async () => {
  const content = await getPageContent();
  const data = await getCreatives();
  console.log('Creatives: ' + data.departments.length + ' departments, ' +
              data.members.length + ' members');

  const fill = (n) => {
    const el = $w(EL);
    if (el && typeof el.setAttribute === 'function') {
      el.setAttribute('data-content', JSON.stringify(content));
      el.setAttribute('data-depts', JSON.stringify(data.departments));
      el.setAttribute('data-members', JSON.stringify(data.members));
      console.log('Creatives: rendered on ' + EL);
      return;
    }
    if (n < 40) setTimeout(() => fill(n + 1), 300);
    else console.warn('Creatives: element never became ready — check the ID');
  };
  fill(1);
});