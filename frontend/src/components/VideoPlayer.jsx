import React, { useState, useRef } from 'react';
import './VideoPlayer.css';

const STREAMS = [
  { id: 'telugu',  label: '🇮🇳 Telugu',  url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'english', label: '🌍 English', url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hindi',   label: '🇮🇳 Hindi',   url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
];

const VideoPlayer = () => {
  const [active, setActive]       = useState(STREAMS[0]);
  const [loading, setLoading]     = useState(true);
  const [showCtrl, setShowCtrl]   = useState(false);
  const ctrlTimer                 = useRef(null);
  const playerRef                 = useRef(null);

  const switchStream = (s) => {
    if (s.id === active.id) return;
    setLoading(true);
    setActive(s);
  };

  const tapPlayer = () => {
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
      else { await navigator.clipboard.writeText(location.href); }
    } catch {}
  };

  const retry = () => { setLoading(true); const f = document.getElementById('live-iframe'); if (f) f.src = f.src; };

  return (
    <div className="vp-root">
      <div className="vp-wrapper" ref={playerRef} onClick={tapPlayer}>
        {/* Loading skeleton */}
        {loading && (
          <div className="vp-skeleton">
            <div className="vp-skeleton-shimmer" />
            <div className="vp-loading-tag">
              <span className="vp-spinner" />
              Loading stream…
            </div>
          </div>
        )}

        <iframe
          id="live-iframe"
          src={active.url}
          className="vp-iframe"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onLoad={() => setLoading(false)}
        />

        {/* Gradient overlay + controls */}
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
          </div>
        </div>
      </div>

      {/* Language Selector */}
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
