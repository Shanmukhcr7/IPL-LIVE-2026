import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';

// ─── All available streams ───────────────────────────────
const STREAMS = [
  // 🇮🇳 Indian
  { id: 'telugu',     cat: '🇮🇳 Indian',       label: '⭐ Star Telugu',       url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'hindi',      cat: '🇮🇳 Indian',       label: '⭐ Star Hindi',        url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
  { id: 'tamil',      cat: '🇮🇳 Indian',       label: '⭐ Star Tamil',        url: 'https://allrounder-live.pages.dev/star/tamil-1' },
  { id: 'eng',        cat: '🇮🇳 Indian',       label: '⭐ Star Select',       url: 'https://allrounder-live.pages.dev/star/star-1' },
  { id: 'jio-hotstar',cat: '🇮🇳 Indian',       label: '🔵 Jio Hotstar',       url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hotstar',    cat: '🇮🇳 Indian',       label: '🔵 Hotstar',           url: 'https://allrounderlive.pages.dev/dilz?id=dillzy645' },
  { id: 'sony',       cat: '🇮🇳 Indian',       label: '🎬 Sony',              url: 'https://allrounderlive.pages.dev/sonyliv/sonyliv-1' },
  { id: 'sony-3',     cat: '🇮🇳 Indian',       label: '🎬 Sony Ten 5',        url: 'https://cricketstan.github.io/Sony-ten-5/' },
  { id: 'prime-hin',  cat: '🇮🇳 Indian',       label: '🟠 Prime Hindi',       url: 'https://allrounder-live.pages.dev/channel/prame-hin.html' },
  { id: 'prime-eng',  cat: '🇮🇳 Indian',       label: '🟠 Prime English',     url: 'https://allrounder-live.pages.dev/channel/prame.html' },
  { id: 'fancode',    cat: '🇮🇳 Indian',       label: '🏏 FanCode',           url: 'https://allrounder-live.pages.dev/fancode-player?url=https://in-mc-flive.fancode.com/mumbai/141407_english_hls_ab5ff6c24a21542_1ta-di_h264/1080p.m3u8?hdntl=Expires=1773474245~_GO=Generated~acl=/mumbai/141407_english_hls_ab5ff6c24a21542_1ta-di_h264/*~Signature=AR77L-Yyr9Cdj5X_0so3HpmxTUDWXrASgqUxhTGBOrJaU6SPgB5oUrj5FOVZ7FqeaDZnyCZIHYhGDYKbrr-wcsI214oJ' },
  { id: 'myco',       cat: '🇮🇳 Indian',       label: '📡 Myco',              url: 'https://allrounder-rho.vercel.app/channel/myco.html' },
  { id: 'cricbuzz',   cat: '🇮🇳 Indian',       label: '📊 Cricbuzz',          url: 'https://allroundersd.pages.dev/cricbuzz1.html' },

  // 🌍 International
  { id: 'fox',        cat: '🌍 International', label: '🦊 Fox Cricket 501',   url: 'https://allrounder-live2.pages.dev/channel/fox' },
  { id: 'fox-hd',     cat: '🌍 International', label: '🦊 Fox Cricket HD',    url: 'https://cricketstan.github.io/Fox-Cricket-/' },
  { id: 'tnt',        cat: '🌍 International', label: '⚡ TNT Sports',        url: 'https://allrounder-live2.pages.dev/channel/tnt-2' },
  { id: 'tnt-1',      cat: '🌍 International', label: '⚡ TNT Sports 1',      url: 'https://cricketstan.github.io/TNT-1/' },
  { id: 'willow',     cat: '🌍 International', label: '🌿 Willow',            url: 'https://allrounder-live2.pages.dev/channel/willow' },
  { id: 'willow-2',   cat: '🌍 International', label: '🌿 Willow 2',          url: 'https://allrounderlive.pages.dev/willow2' },
  { id: 'willow-sports', cat: '🌍 International', label: '🌿 Willow Sports',  url: 'https://cricketstan.github.io/Willow-Sports/' },
  { id: 'sky-uk',     cat: '🌍 International', label: '🌤 Sky UK',            url: 'https://allroundersd.pages.dev/channel/sky-uk' },
  { id: 'sky-sports-nz', cat: '🌍 International', label: '🌤 Sky NZ',        url: 'https://cricketstan.github.io/Sky-sports-nz-/' },
  { id: 'sky-nz-1',   cat: '🌍 International', label: '🌤 Sky NZ Live',      url: 'https://crickettv.site/sky-nz/player?id=3' },
  { id: 'channel-7',  cat: '🌍 International', label: '7️⃣ 7Plus Cricket',    url: 'https://allrounderlive.pages.dev/player?url=https://hugh.cdn.rumble.cloud/live/gi29le7p/slot-139/bx1o-9vac_720p/chunklist.m3u8' },
  { id: 'prime-nz',   cat: '🌍 International', label: '🟣 Prime NZ',         url: 'https://hff-cricketstan.wasmer.app/' },
  { id: 'asiacup',    cat: '🌍 International', label: '🏆 Asia Cup',          url: 'https://allrounderlive.pages.dev/player?url=https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8' },
  { id: 'ptv',        cat: '🌍 International', label: '📺 PTV Sports',        url: 'https://allrounder-live2.pages.dev/channel/ptv' },
  { id: 'zee',        cat: '🌍 International', label: '📺 Zee Cinema',        url: 'https://zee-seven.vercel.app/' },
  { id: 'youtube',    cat: '🌍 International', label: '▶️ YouTube',           url: 'https://www.youtube.com/embed/C2HtKCVQ6B0' },

  // ⚡ Extra
  { id: 'hub',        cat: '⚡ Extra',         label: '📡 Hub 5',             url: 'https://allrounder-live.pages.dev/channel/hub5' },
  { id: 'wpl',        cat: '⚡ Extra',         label: '🏏 Cric Life',         url: 'https://allrounderlive.pages.dev/cric-life' },
  { id: 'alt',        cat: '⚡ Extra',         label: '⚡ Dillzy',            url: 'https://allrounderlive.pages.dev/player?url=https://dillzy.cricketstream745.workers.dev/live.m3u8' },
  { id: 'ios',        cat: '⚡ Extra',         label: '🍎 Willow Plus',        url: 'https://allrounderlive.pages.dev/player4?url=https://amg01269-amg01269c1-sportstribal-emea-5204.playouts.now.amagi.tv/playlist/amg01269-willowtvfast-willowplus-sportstribalemea/playlist.m3u8' },
];

// Group streams by category
const CATEGORIES = [...new Set(STREAMS.map(s => s.cat))];


const VideoPlayer = () => {
  const [active, setActive]         = useState(STREAMS[0]);
  const [loading, setLoading]       = useState(true);
  const [blocked, setBlocked]       = useState(false);
  const [showCtrl, setShowCtrl]     = useState(false);
  const [iframeKey, setIframeKey]   = useState(0); // force re-mount on switch
  const ctrlTimer                   = useRef(null);
  const playerRef                   = useRef(null);
  const blockTimer                  = useRef(null);

  // Reset state on stream switch
  useEffect(() => {
    setLoading(true);
    setBlocked(false);

    // If iframe hasn't loaded after 8 seconds, likely blocked by X-Frame-Options
    blockTimer.current = setTimeout(() => {
      setLoading(false);
      setBlocked(true);
    }, 8000);

    return () => clearTimeout(blockTimer.current);
  }, [iframeKey]);

  const switchStream = (s) => {
    if (s.id === active.id) return;
    setActive(s);
    setIframeKey(k => k + 1); // re-mounts iframe fresh
  };

  const handleLoad = () => {
    clearTimeout(blockTimer.current);
    setLoading(false);
    setBlocked(false);
  };

  const tapPlayer = () => {
    if (blocked) return;
    setShowCtrl(true);
    clearTimeout(ctrlTimer.current);
    ctrlTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  };

  const goFullscreen = () => {
    const el = playerRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'IPL Live 2026', url: location.href });
      else await navigator.clipboard.writeText(location.href);
    } catch {}
  };

  const retry = () => {
    setIframeKey(k => k + 1);
  };

  const openDirect = () => {
    window.open(active.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="vp-root">
      <div className="vp-wrapper" ref={playerRef} onClick={tapPlayer}>

        {/* Skeleton loading */}
        {loading && !blocked && (
          <div className="vp-skeleton">
            <div className="vp-skeleton-shimmer" />
            <div className="vp-loading-tag">
              <span className="vp-spinner" />
              Loading stream…
            </div>
          </div>
        )}

        {/* Blocked / X-Frame-Options fallback */}
        {blocked && (
          <div className="vp-blocked">
            <div className="vp-blocked-inner">
              <span className="vp-blocked-icon">📺</span>
              <p className="vp-blocked-title">Stream blocked by browser</p>
              <p className="vp-blocked-sub">
                This stream cannot be embedded. Open it directly to watch.
              </p>
              <button className="vp-open-btn ripple" onClick={openDirect}>
                ▶ Watch {active.label.split(' ')[1] || 'Stream'} Live
              </button>
              <button className="vp-retry-link" onClick={retry}>
                Try embedding again
              </button>
            </div>
          </div>
        )}

        {/* The actual iframe — always rendered so onLoad fires */}
        <iframe
          key={iframeKey}
          id="live-iframe"
          src={active.url}
          className={`vp-iframe ${blocked ? 'vp-iframe-hidden' : ''}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer"
          loading="eager"
          onLoad={handleLoad}
        />

        {/* Tap controls overlay */}
        {!blocked && (
          <div className={`vp-overlay ${showCtrl ? 'visible' : ''}`}>
            <div className="vp-overlay-top">
              <span className="badge-live">LIVE</span>
            </div>
            <div className="vp-overlay-bottom">
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); retry(); }} title="Retry">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
                </svg>
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); share(); }} title="Share">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); goFullscreen(); }} title="Fullscreen">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </button>
              <button className="vp-ctrl-btn vp-ctrl-direct" onClick={e => { e.stopPropagation(); openDirect(); }} title="Open in browser">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stream Selector */}
      <div className="vp-controls glass">
        <StreamSelector active={active} onSwitch={switchStream} />
      </div>
    </div>
  );
};

// ─── Stream Selector Sub-component ──────────────────────
const StreamSelector = ({ active, onSwitch }) => {
  const [activeCat, setActiveCat] = React.useState(active.cat);
  const streamsInCat = STREAMS.filter(s => s.cat === activeCat);

  return (
    <div className="ss-root">
      {/* Category tabs */}
      <div className="ss-cats">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`ss-cat-btn ripple ${activeCat === cat ? 'active' : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Streams in selected category */}
      <div className="ss-streams">
        {streamsInCat.map(s => (
          <button
            key={s.id}
            className={`ss-stream-btn ripple ${active.id === s.id ? 'active' : ''}`}
            onClick={() => onSwitch(s)}
          >
            {s.label}
            {active.id === s.id && <span className="ss-active-dot" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
