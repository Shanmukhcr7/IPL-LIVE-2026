import React, { useState, useRef, useEffect } from 'react';
import './VideoPlayer.css';

const STREAMS = [
  { id: 'telugu',  label: '🇮🇳 Telugu',  url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'english', label: '🌍 English', url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hindi',   label: '🇮🇳 Hindi',   url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
];

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

      {/* Language pills */}
      <div className="vp-controls glass">
        <label className="vp-lang-label">🌐 Language</label>
        <div className="vp-lang-pills">
          {STREAMS.map(s => (
            <button
              key={s.id}
              className={`vp-pill ripple ${active.id === s.id ? 'active' : ''}`}
              onClick={() => switchStream(s)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
