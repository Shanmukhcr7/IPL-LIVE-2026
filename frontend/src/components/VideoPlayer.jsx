import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoPlayer.css';

// ─── All streams ─────────────────────────────────────────
const STREAMS = [
  // 🇮🇳 Indian
  { id: 'telugu',      cat: '🇮🇳 Indian',       label: '⭐ Star Telugu',     url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'hindi',       cat: '🇮🇳 Indian',       label: '⭐ Star Hindi',      url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
  { id: 'tamil',       cat: '🇮🇳 Indian',       label: '⭐ Star Tamil',      url: 'https://allrounder-live.pages.dev/star/tamil-1' },
  { id: 'eng',         cat: '🇮🇳 Indian',       label: '⭐ Star Select',     url: 'https://allrounder-live.pages.dev/star/star-1' },
  { id: 'jio-hotstar', cat: '🇮🇳 Indian',       label: '🔵 Jio Hotstar',     url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hotstar',     cat: '🇮🇳 Indian',       label: '🔵 Hotstar',         url: 'https://allrounderlive.pages.dev/dilz?id=dillzy645' },
  { id: 'sony',        cat: '🇮🇳 Indian',       label: '🎬 Sony',            url: 'https://allrounderlive.pages.dev/sonyliv/sonyliv-1' },
  { id: 'sony-3',      cat: '🇮🇳 Indian',       label: '🎬 Sony Ten 5',      url: 'https://cricketstan.github.io/Sony-ten-5/' },
  { id: 'prime-hin',   cat: '🇮🇳 Indian',       label: '🟠 Prime Hindi',     url: 'https://allrounder-live.pages.dev/channel/prame-hin.html' },
  { id: 'prime-eng',   cat: '🇮🇳 Indian',       label: '🟠 Prime English',   url: 'https://allrounder-live.pages.dev/channel/prame.html' },
  { id: 'fancode',     cat: '🇮🇳 Indian',       label: '🏏 FanCode',         url: 'https://allrounder-live.pages.dev/fancode-player?url=https://in-mc-flive.fancode.com/mumbai/141407_english_hls_ab5ff6c24a21542_1ta-di_h264/1080p.m3u8' },
  { id: 'myco',        cat: '🇮🇳 Indian',       label: '📡 Myco',            url: 'https://allrounder-rho.vercel.app/channel/myco.html' },
  { id: 'cricbuzz',    cat: '🇮🇳 Indian',       label: '📊 Cricbuzz',        url: 'https://allroundersd.pages.dev/cricbuzz1.html' },
  // 🌍 International
  { id: 'fox',         cat: '🌍 International', label: '🦊 Fox Cricket 501', url: 'https://allrounder-live2.pages.dev/channel/fox' },
  { id: 'fox-hd',      cat: '🌍 International', label: '🦊 Fox Cricket HD',  url: 'https://cricketstan.github.io/Fox-Cricket-/' },
  { id: 'tnt',         cat: '🌍 International', label: '⚡ TNT Sports',      url: 'https://allrounder-live2.pages.dev/channel/tnt-2' },
  { id: 'tnt-1',       cat: '🌍 International', label: '⚡ TNT Sports 1',    url: 'https://cricketstan.github.io/TNT-1/' },
  { id: 'willow',      cat: '🌍 International', label: '🌿 Willow',          url: 'https://allrounder-live2.pages.dev/channel/willow' },
  { id: 'willow-2',    cat: '🌍 International', label: '🌿 Willow 2',        url: 'https://allrounderlive.pages.dev/willow2' },
  { id: 'willow-sports',cat:'🌍 International', label: '🌿 Willow Sports',   url: 'https://cricketstan.github.io/Willow-Sports/' },
  { id: 'sky-uk',      cat: '🌍 International', label: '🌤 Sky UK',          url: 'https://allroundersd.pages.dev/channel/sky-uk' },
  { id: 'sky-sports-nz',cat:'🌍 International', label: '🌤 Sky NZ',          url: 'https://cricketstan.github.io/Sky-sports-nz-/' },
  { id: 'sky-nz-1',    cat: '🌍 International', label: '🌤 Sky NZ Live',     url: 'https://crickettv.site/sky-nz/player?id=3' },
  { id: 'channel-7',   cat: '🌍 International', label: '7️⃣ 7Plus Cricket',   url: 'https://allrounderlive.pages.dev/player?url=https://hugh.cdn.rumble.cloud/live/gi29le7p/slot-139/bx1o-9vac_720p/chunklist.m3u8' },
  { id: 'prime-nz',    cat: '🌍 International', label: '🟣 Prime NZ',        url: 'https://hff-cricketstan.wasmer.app/' },
  { id: 'asiacup',     cat: '🌍 International', label: '🏆 Asia Cup',        url: 'https://allrounderlive.pages.dev/player?url=https://d3ssd0juqbxbw.cloudfront.net/mtvsinstlive/master.m3u8' },
  { id: 'ptv',         cat: '🌍 International', label: '📺 PTV Sports',      url: 'https://allrounder-live2.pages.dev/channel/ptv' },
  { id: 'zee',         cat: '🌍 International', label: '📺 Zee Cinema',      url: 'https://zee-seven.vercel.app/' },
  { id: 'youtube',     cat: '🌍 International', label: '▶️ YouTube',         url: 'https://www.youtube.com/embed/C2HtKCVQ6B0' },
  // ⚡ Extra
  { id: 'hub',         cat: '⚡ Extra',         label: '📡 Hub 5',           url: 'https://allrounder-live.pages.dev/channel/hub5' },
  { id: 'wpl',         cat: '⚡ Extra',         label: '🏏 Cric Life',       url: 'https://allrounderlive.pages.dev/cric-life' },
  { id: 'alt',         cat: '⚡ Extra',         label: '⚡ Dillzy',          url: 'https://allrounderlive.pages.dev/player?url=https://dillzy.cricketstream745.workers.dev/live.m3u8' },
  { id: 'ios',         cat: '⚡ Extra',         label: '🍎 Willow Plus',     url: 'https://allrounderlive.pages.dev/player4?url=https://amg01269-amg01269c1-sportstribal-emea-5204.playouts.now.amagi.tv/playlist/amg01269-willowtvfast-willowplus-sportstribalemea/playlist.m3u8' },
];

const CATEGORIES = [...new Set(STREAMS.map(s => s.cat))];

// ─── Device detection ─────────────────────────────────────
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// IOS specifically needs window.open or location.href — no iframe ever works
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

// ─── VideoPlayer Component ────────────────────────────────
const VideoPlayer = () => {
  const [active, setActive]       = useState(STREAMS[0]);
  const [iframeKey, setIframeKey] = useState(0);
  const [phase, setPhase]         = useState('loading'); // loading | playing | mobile | blocked | redirecting
  const [countdown, setCountdown] = useState(5);
  const blockTimerRef             = useRef(null);
  const countdownRef              = useRef(null);
  const playerRef                 = useRef(null);
  const [showCtrl, setShowCtrl]   = useState(false);
  const ctrlTimerRef              = useRef(null);

  const mobile = isMobileDevice();

  // ── Switch stream ──────────────────────────────────────
  const switchStream = useCallback((stream) => {
    if (stream.id === active.id) return;
    clearTimeout(blockTimerRef.current);
    clearInterval(countdownRef.current);
    setActive(stream);
    setIframeKey(k => k + 1);

    if (mobile) {
      setPhase('mobile');
    } else {
      setPhase('loading');
    }
  }, [active.id, mobile]);

  // ── On mount / stream change ───────────────────────────
  useEffect(() => {
    clearTimeout(blockTimerRef.current);
    clearInterval(countdownRef.current);

    if (mobile) {
      // Mobile: never bother with iframe — show redirect page immediately
      setPhase('mobile');
      return;
    }

    // Desktop: try iframe, 9s timeout
    setPhase('loading');
    blockTimerRef.current = setTimeout(() => {
      setPhase('blocked');
    }, 9000);

    return () => {
      clearTimeout(blockTimerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [iframeKey, mobile]);

  // ── Iframe loaded successfully ─────────────────────────
  const handleLoad = () => {
    clearTimeout(blockTimerRef.current);
    setPhase('playing');
  };

  // ── Auto-redirect with countdown ──────────────────────
  const startRedirect = useCallback(() => {
    setPhase('redirecting');
    setCountdown(3);
    let n = 3;
    countdownRef.current = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) {
        clearInterval(countdownRef.current);
        window.location.href = active.url; // same-tab redirect — keeps full-screen on mobile
      }
    }, 1000);
  }, [active.url]);

  // ── Open in new tab ───────────────────────────────────
  const openNewTab = () => {
    window.open(active.url, '_blank', 'noopener,noreferrer');
  };

  // ── Tap overlay ───────────────────────────────────────
  const tapPlayer = () => {
    if (phase !== 'playing') return;
    setShowCtrl(true);
    clearTimeout(ctrlTimerRef.current);
    ctrlTimerRef.current = setTimeout(() => setShowCtrl(false), 3000);
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

  const retry = () => {
    clearTimeout(blockTimerRef.current);
    clearInterval(countdownRef.current);
    setPhase('loading');
    setIframeKey(k => k + 1);
  };

  // ─────────────────────────────────────────────────────
  return (
    <div className="vp-root">
      <div className="vp-wrapper" ref={playerRef} onClick={tapPlayer}>

        {/* ── LOADING skeleton ── */}
        {phase === 'loading' && <LoadingSkeleton />}

        {/* ── MOBILE redirect screen ── */}
        {phase === 'mobile' && (
          <MobileScreen stream={active} onRedirect={startRedirect} onNewTab={openNewTab} />
        )}

        {/* ── BLOCKED fallback screen ── */}
        {phase === 'blocked' && (
          <BlockedScreen stream={active} onRedirect={startRedirect} onNewTab={openNewTab} onRetry={retry} />
        )}

        {/* ── REDIRECTING countdown ── */}
        {phase === 'redirecting' && <RedirectingScreen countdown={countdown} stream={active} />}

        {/* ── DESKTOP iframe (always rendered so onLoad fires) ── */}
        {!mobile && (
          <iframe
            key={iframeKey}
            src={active.url}
            className={`vp-iframe ${phase === 'playing' ? 'vp-iframe-visible' : 'vp-iframe-hidden'}`}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
            loading="eager"
            onLoad={handleLoad}
          />
        )}

        {/* ── Controls overlay (desktop playing) ── */}
        {phase === 'playing' && (
          <div className={`vp-overlay ${showCtrl ? 'visible' : ''}`}>
            <div className="vp-overlay-top">
              <span className="badge-live">LIVE</span>
            </div>
            <div className="vp-overlay-bottom">
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); retry(); }} title="Retry">
                <IconRefresh />
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); share(); }} title="Share">
                <IconShare />
              </button>
              <button className="vp-ctrl-btn" onClick={e => { e.stopPropagation(); openNewTab(); }} title="Open in browser">
                <IconExternal />
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

// ─── Sub-screens ─────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="vp-skeleton">
    <div className="vp-skeleton-shimmer" />
    <div className="vp-loading-tag">
      <span className="vp-spinner" />
      Loading stream…
    </div>
  </div>
);

const MobileScreen = ({ stream, onRedirect, onNewTab }) => (
  <div className="vp-screen">
    <div className="vp-screen-inner">
      <div className="vp-screen-icon">📺</div>
      <p className="vp-screen-title">Ready to Watch</p>
      <p className="vp-screen-sub">
        <strong>{stream.label}</strong> — tap below to stream live.
        Streams open in full screen for the best experience.
      </p>
      <button className="vp-primary-btn ripple" onClick={onRedirect}>
        ▶&nbsp; Watch Now
      </button>
      <button className="vp-ghost-btn ripple" onClick={onNewTab}>
        Open in New Tab ↗
      </button>
    </div>
  </div>
);

const BlockedScreen = ({ stream, onRedirect, onNewTab, onRetry }) => (
  <div className="vp-screen">
    <div className="vp-screen-inner">
      <div className="vp-screen-icon">🔒</div>
      <p className="vp-screen-title">Stream Blocked Here</p>
      <p className="vp-screen-sub">
        <strong>{stream.label}</strong> prevents embedding. Open it directly — it works perfectly!
      </p>
      <button className="vp-primary-btn ripple" onClick={onRedirect}>
        ▶&nbsp; Open Stream (Auto-redirects)
      </button>
      <button className="vp-ghost-btn ripple" onClick={onNewTab}>
        Open in New Tab ↗
      </button>
      <button className="vp-text-btn" onClick={onRetry}>
        ↺ Retry embed
      </button>
    </div>
  </div>
);

const RedirectingScreen = ({ countdown, stream }) => (
  <div className="vp-screen vp-redirecting">
    <div className="vp-screen-inner">
      <div className="vp-countdown-ring">
        <span className="vp-countdown-num">{countdown}</span>
      </div>
      <p className="vp-screen-title">Opening {stream.label}…</p>
      <p className="vp-screen-sub">Redirecting you to the stream in {countdown} second{countdown !== 1 ? 's' : ''}.</p>
    </div>
  </div>
);

// ─── Stream Selector ─────────────────────────────────────
const StreamSelector = ({ active, onSwitch }) => {
  const [activeCat, setActiveCat] = React.useState(active.cat);
  const streamsInCat = STREAMS.filter(s => s.cat === activeCat);

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

// ─── SVG icon helpers ─────────────────────────────────────
const IconRefresh   = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>;
const IconShare     = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const IconExternal  = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const IconFullscreen= () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>;

export default VideoPlayer;
