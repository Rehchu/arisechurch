import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';

const opts = { suppressAuth: true };
const q = (c) => wixData.query(c);
const empty = (name) => (e) => { console.error(name + ':', e); return { items: [] }; };

function imgUrl(v) {
  if (!v) return '';
  if (typeof v === 'object') return v.url || v.src || '';
  if (v.indexOf('wix:image://') !== 0) return v;
  return 'https://static.wixstatic.com/media/' +
    v.split('wix:image://v1/')[1].split('/')[0].split('#')[0];
}

/* Page text and images. Edit in CMS -> Page Content. */
export const getPageContent = webMethod(Permissions.Anyone, async () => {
  const res = await q('PageContent').limit(500).find(opts)
    .catch(empty('getPageContent'));
  const out = {};
  res.items.forEach((r) => {
    if (r.contentKey) {
      out[r.contentKey] = {
        text: r.text || '',
        image: imgUrl(r.image) || r.imageUrl || ''
      };
    }
  });
  return out;
});

/* Leaders. featured: true = wide card at the top. */
export const getLeaders = webMethod(Permissions.Anyone, async () => {
  const res = await q('Leaders').ascending('sortOrder').limit(50).find(opts)
    .catch(empty('getLeaders'));
  return res.items.map((l) => ({
    name: l.name || '',
    role: l.role || '',
    bio: l.shortBio || l.bio || '',
    photo: imgUrl(l.photo),
    featured: !!l.featured
  })).filter((l) => l.name);
});

/* Ministries. comingSoon: true = badge, no link. */
export const getMinistries = webMethod(Permissions.Anyone, async () => {
  const res = await q('Ministries').ascending('sortOrder').limit(50).find(opts)
    .catch(empty('getMinistries'));
  return res.items.map((m) => ({
    title: m.title || '',
    cat: m.category || '',
    link: m.pageLink || '',
    img: imgUrl(m.image),
    soon: !!m.comingSoon
  })).filter((m) => m.title);
});

/* Connect Groups. */
export const getConnectGroups = webMethod(Permissions.Anyone, async () => {
  const res = await q('ConnectGroups').eq('active', true)
    .ascending('sortOrder').limit(50).find(opts)
    .catch(empty('getConnectGroups'));
  return res.items.map((g) => ({
    title: g.title || '',
    hostName: g.hostName || '',
    day: g.day || '',
    time: g.time || '',
    location: g.location || '',
    dates: g.dates || '',
    description: g.description || '',
    flyer: imgUrl(g.flyer),
    audience: g.audience || '',
    isFull: !!g.isFull
  })).filter((g) => g.title);
});

/* Creative Arts: departments and members. */
export const getCreatives = webMethod(Permissions.Anyone, async () => {
  const d = await q('CreativeDepartments').eq('active', true)
    .ascending('sortOrder').limit(50).find(opts).catch(empty('getCreatives.depts'));
  const m = await q('CreativeMembers').eq('active', true)
    .ascending('sortOrder').limit(200).find(opts).catch(empty('getCreatives.members'));
  return {
    departments: d.items.map((x) => ({
      name: x.name || '',
      slug: x.slug || '',
      tagline: x.tagline || '',
      description: x.description || '',
      groupPhoto: imgUrl(x.groupPhoto),
      pageLink: x.pageLink || ''
    })).filter((x) => x.name),
    members: m.items.map((x) => ({
      name: x.name || '',
      department: x.department || '',
      role: x.role || '',
      bio: x.bio || '',
      photo: imgUrl(x.photo),
      isLeader: !!x.isLeader
    })).filter((x) => x.name)
  };
});

/* Serve positions. */
export const getServePositions = webMethod(Permissions.Anyone, async () => {
  const res = await q('ServePositions').eq('active', true)
    .ascending('sortOrder').limit(50).find(opts)
    .catch(empty('getServePositions'));
  return res.items.map((p) => ({
    title: p.title || '',
    description: p.description || '',
    team: p.team || '',
    image: imgUrl(p.image),
    urgent: !!p.urgent
  })).filter((p) => p.title);
});

/* Church Culture video. Edit in CMS -> Home Settings. */
export const getHomeSettings = webMethod(Permissions.Anyone, async () => {
  const res = await q('HomeSettings').eq('settingKey', 'churchCulture')
    .limit(1).find(opts).catch(empty('getHomeSettings'));
  const row = res.items[0];
  if (!row) return null;

  const v = row.cultureVideo;
  let id = '', poster = '';
  if (typeof v === 'string' && v.indexOf('wix:video://') === 0) {
    id = v.split('wix:video://v1/')[1].split('/')[0];
    const m = (v.split('#')[1] || '').match(/posterUri=([^&]+)/);
    if (m) poster = 'https://static.wixstatic.com/media/' + decodeURIComponent(m[1]);
  }

  return {
    videoId: id,
    poster: imgUrl(row.posterImage) || poster,
    heading: row.heading || 'This Is Arise',
    kicker: row.kicker || 'Church Culture',
    active: row.active !== false
  };
});
