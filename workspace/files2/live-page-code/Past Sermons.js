import wixData from 'wix-data';
import { getLiveVideoId, getCurrentSeries } from 'backend/youtube.jsw';

// Right-click the custom element -> View Properties to confirm this ID.
const EL = '#customElement1';

$w.onReady(async () => {
  if (!$w(EL).length) {
    console.warn('Sermons: custom element ' + EL + ' not found.');
    return;
  }

  // ---- Series band ------------------------------------------------------
  try {
    let title = null, line = null, link = null, label = null;

    // 1. Manual override from the CMS always wins
    const { items } = await wixData.query('SiteSettings')
      .eq('settingKey', 'sermonSeries')
      .limit(1)
      .find();

    const s = items[0];
    if (s && s.seriesActive && s.seriesTitle) {
      title = s.seriesTitle;
      line  = s.seriesLine  || null;
      link  = s.seriesLink  || null;
      label = s.seriesButton || null;
    } else {
      // 2. Otherwise auto-detect from YouTube playlists
      const auto = await getCurrentSeries();
      if (auto) {
        title = auto.title;
        link  = auto.url;
        label = 'Watch the Series';
      }
    }

    if (title) {
      $w(EL).setAttribute('data-series-active', 'true');
      $w(EL).setAttribute('data-series-title', title);
      $w(EL).setAttribute('data-series-line', line || '');
      if (link)  $w(EL).setAttribute('data-series-link', link);
      if (label) $w(EL).setAttribute('data-series-button', label);
      console.log('Series band:', title);
    } else {
      $w(EL).setAttribute('data-series-active', 'false');   // hides the band
      console.log('Series band: none active, hidden');
    }
  } catch (err) {
    console.error('Series lookup failed:', err);
  }

  // ---- Live stream detection -------------------------------------------
  let current = null;

  async function checkLive() {
    try {
      const liveId = await getLiveVideoId();
      if (liveId === current) return;
      current = liveId;
      $w(EL).setAttribute('data-live-video', liveId || '');
      if (liveId) console.log('Live stream detected:', liveId);
    } catch (err) {
      console.error('Live check failed:', err);
    }
  }

  checkLive();
  setInterval(checkLive, 60000);
});
