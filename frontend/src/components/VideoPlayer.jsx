import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoPlayer.css';

// ─── Backend URL ──────────────────────────────────────────
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const proxyUrl = (url) => `${BACKEND}/proxy?url=${encodeURIComponent(url)}`;

// ─── All streams ──────────────────────────────────────────
const STREAMS = [
  // 🇮🇳 Indian
  { id: 'telugu',       cat: '🇮🇳 Indian',       label: '⭐ Star Telugu',     url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'hindi',        cat: '🇮🇳 Indian',       label: '⭐ Star Hindi',      url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
  { id: 'tamil',        cat: '🇮🇳 Indian',       label: '⭐ Star Tamil',      url: 'https://allrounder-live.pages.dev/star/tamil-1' },
  { id: 'eng',          cat: '🇮🇳 Indian',       label: '⭐ Star Select',     url: 'https://allrounder-live.pages.dev/star/star-1' },
  { id: 'jio-hotstar',  cat: '🇮🇳 Indian',       label: '🔵 Jio Hotstar',     url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hotstar',      cat: '🇮🇳 Indian',       label: '🔵 Hotstar',         url: 'https://allrounderlive.pages.dev/dilz?id=dillzy645' },
  { id: 'sony',         cat: '🇮🇳 Indian',       label: '🎬 Sony',            url: 'https://allrounderlive.pages.dev/sonyliv/sonyliv-1' },
  { id: 'sony-3',       cat: '🇮🇳 Indian',       label: '🎬 Sony Ten 5',      url: 'https://cricketstan.github.io/Sony-ten-5/' },
  { id: 'prime-hin',    cat: '🇮🇳 Indian',       label: '🟠 Prime Hindi',     url: 'https://allrounder-live.pages.dev/channel/prame-hin.html' },
  { id: 'prime-eng',    cat: '🇮🇳 Indian',       label: '🟠 Prime English',   url: 'https://allrounder-live.pages.dev/channel/prame.html' },
  { id: 'fancode',      cat: '🇮🇳 Indian',       label: '🏏 FanCode',         url: 'https://allrounder-live.pages.dev/fancode-player?url=https://in-mc-flive.fancode.com/mumbai/141407_english_hls_ab5ff6c24a21542_1ta-di_h264/1080p.m3u8' },
  { id: 'myco',         cat: '🇮🇳 Indian',       label: '📡 Myco',            url: 'https://allrounder-rho.vercel.app/channel/myco.html' },
  { id: 'cricbuzz',     cat: '🇮🇳 Indian',       label: '📊 Cricbuzz',        url: 'https://allroundersd.pages.dev/cricbuzz1.html' },
  // 🌍 International
  { id: 'fox',          cat: '🌍 International', label: '🦊 Fox Cricket 501', url: 'https://allrounder-live2.pages.dev/channel/fox' },
  { id: 'fox-hd',       cat: '🌍 International', label: '🦊 Fox Cricket HD',  url: 'https://cricketstan.github.io/Fox-Cricket-/' },
  { id: 'tnt',          cat: '🌍 International', label: '⚡ TNT Sports',      url: 'https://allrounder-live2.pages.dev/channel/tnt-2' },
  { id: 'tnt-1',        cat: '🌍 International', label: '⚡ TNT Sports 1',    url: 'https://cricketstan.github.io/TNT-1/' },
  { id: 'willow',       cat: '🌍 International', label: '🌿 Willow',          url: 'https://allrounder-live2.pages.dev/channel/willow' },
  { id: 'willow-2',     cat: '🌍 International', label: '🌿 Willow 2',        url: 'https://allrounderlive.pages.dev/willow2' },
  { id: 'willow-sports',cat: '🌍 International', label: '🌿 Willow Sports',   url: 'https://cricketstan.github.io/Willow-Sports/' },
  { id: 'sky-uk',       cat: '🌍 International', label: '🌤 Sky UK',          url: 'https://allroundersd.pages.dev/channel/sky-uk' },
  { id: 'sky-sports-nz',cat: '🌍 International', label: '🌤 Sky NZ',          url: 'https://cricketstan.github.io/Sky-sports-nz-/' },
  { id: 'sky-nz-1',     cat: '🌍 International', label: '🌤 Sky NZ Live',     url: 'https://crickettv.site/sky-nz/player?id=3' },
  { id: 'channel-7',    cat: '🌍 International', label: '7️⃣ 7Plus Cricket',   url: 'https://allrounderlive.pages.dev/player?url=https://hugh.cdn.rumble.cloud/live/gi29le7p/slot-139/bx1o-9vac_720p/chunklist.m3u8' },
  { id: 'prime-nz',     cat: '🌍 International', label: '🟣 Prime NZ',        url: 'https://hff-cricketstan.wasmer.app/' },
  { id: 'asiacup',      cat: '🌍 International', label: '🏆 Asia Cup',        url: 'https://allrounderlive.pages.dev/player?url=https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8' },
  { id: 'ptv',          cat: '🌍 International', label: '📺 PTV Sports',      url: 'https://allrounder-live2.pages.dev/channel/ptv' },
  { id: 'zee',          cat: '🌍 International', label: '📺 Zee Cinema',      url: 'https://zee-seven.vercel.app/' },
  { id: 'youtube',      cat: '🌍 International', label: '▶️ YouTube',         url: 'https://www.youtube.com/embed/C2HtKCVQ6B0' },
  // ⚡ Extra
  { id: 'hub',          cat: '⚡ Extra',         label: '📡 Hub 5',           url: 'https://allrounder-live.pages.dev/channel/hub5' },
  { id: 'wpl',          cat: '⚡ Extra',         label: '🏏 Cric Life',       url: 'https://allrounderlive.pages.dev/cric-life' },
  { id: 'alt',          cat: '⚡ Extra',         label: '⚡ Dillzy',          url: 'https://allrounderlive.pages.dev/player?url=https://dillzy.cricketstream745.workers.dev/live.m3u8' },
  { id: 'ios',          cat: '⚡ Extra',         label: '🍎 Willow Plus',     url: 'https://allrounderlive.pages.dev/player4?url=https://amg01269-amg01269c1-sportstribal-emea-5204.playouts.now.amagi.tv/playlist/amg01269-willowtvfast-willowplus-sportstribalemea/playlist.m3u8' },
];

const CATEGORIES = [...new Set(STREAMS.map(s => s.cat))];

// ─── VideoPlayer ──────────────────────────────────────────
const VideoPlayer = () => {
  const [active, setActive]       = useState(STREAMS[0]);
  const [iframeKey, setIframeKey] = useState(0);
  const [phase, setPhase]         = useState('loading'); // loading | playing | error
  const [src, setSrc]             = useState('direct');  // direct | proxy
  const [showCtrl, setShowCtrl]   = useState(false);
  const blockTimer                = useRef(null);
  const ctrlTimer                 = useRef(null);
  const playerRef                 = useRef(null);

  // Current iframe src: try direct first, proxy as fallback
  const iframeSrc = src === 'proxy' ? proxyUrl(active.url) : active.url;

  // ── Switch stream ─────────────────────────────────────
  const switchStream = useCallback((s) => {
    if (s.id === active.id) return;
    clearTimeout(blockTimer.current);
    setActive(s);
    setSrc('direct');
    setPhase('loading');
    setIframeKey(k => k + 1);
  }, [active.id]);

  // ── Timer logic: direct → proxy → error ──────────────
  useEffect(() => {
    clearTimeout(blockTimer.current);
    setPhase('loading');

    if (src === 'direct') {
      // 8s: direct didn't fire onLoad → try proxy
      blockTimer.current = setTimeout(() => {
        setSrc('proxy');
        setIframeKey(k => k + 1);
      }, 8000);
    } else {
      // 12s: proxy also failed → show error
      blockTimer.current = setTimeout(() => setPhase('error'), 12000);
    }

    return () => clearTimeout(blockTimer.current);
  }, [iframeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoad = () => {
    clearTimeout(blockTimer.current);
    setPhase('playing');
  };

  const retry = () => {
    clearTimeout(blockTimer.current);
    setSrc('direct');
    setPhase('loading');
    setIframeKey(k => k + 1);
  };

  const tapPlayer = () => {
    if (phase !== 'playing') return;
    setShowCtrl(true);
    clearTimeout(ctrlTimer.current);
    ctrlTimer.current = setTimeout(() => setShowCtrl(false), 3000);
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'IPL Live 2026', url: active.url });
      else await navigator.clipboard.writeText(active.url);
    } catch {}
  };

  const goFullscreen = () => {
    const el = playerRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="vp-root">
      <div className="vp-wrapper" ref={playerRef} onClick={tapPlayer}>

        {/* Skeleton — shows while loading, z-index 2 (above iframe) */}
        {phase === 'loading' && (
          <div className="vp-skeleton">
            <div className="vp-skeleton-shimmer" />
            <div className="vp-loading-tag">
              <span className="vp-spinner" />
              {src === 'proxy' ? 'Connecting via proxy…' : 'Loading stream…'}
            </div>
          </div>
        )}

        {/* Error screen */}
        {phase === 'error' && (
          <div className="vp-screen">
            <div className="vp-screen-inner">
              <div className="vp-screen-icon">⚠️</div>
              <p className="vp-screen-title">Stream unavailable</p>
              <p className="vp-screen-sub">
                <strong>{active.label}</strong> couldn't load.
                Try another stream or retry.
              </p>
              <button className="vp-primary-btn ripple" onClick={retry}>
                ↺ Retry
              </button>
            </div>
          </div>
        )}

        {/* iframe — NO sandbox attribute, full permissions for video */}
        <iframe
          key={iframeKey}
          src={iframeSrc}
          className={`vp-iframe ${phase === 'playing' ? 'vp-iframe-visible' : 'vp-iframe-hidden'}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write; web-share"
          allowFullScreen
          loading="eager"
          onLoad={handleLoad}
        />

        {/* Controls overlay — only when playing */}
        {phase === 'playing' && (
          <div className={`vp-overlay ${showCtrl ? 'visible' : ''}`}>
            <div className="vp-overlay-top">
              <span className="badge-live">LIVE</span>
              {src === 'proxy' && <span className="vp-proxy-badge">proxy</span>}
            </div>
            <div className="vp-overlay-bottom">
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); retry(); }} title="Reload">
                <IconRefresh />
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); share(); }} title="Share">
                <IconShare />
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); goFullscreen(); }} title="Fullscreen">
                <IconFullscreen />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stream selector */}
      <div className="vp-controls glass">
        <StreamSelector active={active} onSwitch={switchStream} />
      </div>
    </div>
  );
};

// ─── Stream Selector ─────────────────────────────────────
const StreamSelector = ({ active, onSwitch }) => {
  const [activeCat, setActiveCat] = React.useState(active.cat);
  const streams = STREAMS.filter(s => s.cat === activeCat);

  return (
    <div className="ss-root">
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
      <div className="ss-streams">
        {streams.map(s => (
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

// ─── Icons ───────────────────────────────────────────────
const IconRefresh    = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>;
const IconShare      = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IconFullscreen = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;

export default VideoPlayer;
