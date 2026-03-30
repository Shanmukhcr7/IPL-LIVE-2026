import React, { useState, useRef, useEffect } from 'react';
import { Maximize, Share2, RefreshCw } from 'lucide-react';
import './VideoPlayer.css';

const STREAMS = [
  { id: 'telugu', label: 'Telugu', flag: '🇮🇳', url: 'https://allrounder-live.pages.dev/star/telugu' },
  { id: 'english', label: 'English', flag: '🌍', url: 'https://allrounder-live2.pages.dev/channel/hotstar' },
  { id: 'hindi', label: 'Hindi', flag: '🇮🇳', url: 'https://allrounder-live2.pages.dev/star/star-1-hindi' },
];

const VideoPlayer = () => {
  const [activeStream, setActiveStream] = useState(STREAMS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);

  const handleStreamChange = (stream) => {
    setIsLoading(true);
    setActiveStream(stream);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'AllRounder Live IPL Streaming',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    const iframe = document.getElementById('main-player-iframe');
    if (iframe) {
      iframe.src = iframe.src; // Reload
    }
  };

  return (
    <div className="video-container" ref={playerRef}>
      <div className="player-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading Stream...</p>
          </div>
        )}
        <iframe
          id="main-player-iframe"
          src={activeStream.url}
          className="iframe-player"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>

      <div className="player-controls">
        <div className="stream-select-wrapper">
          <span className="stream-label">🌐 Language</span>
          <select
            className="stream-dropdown"
            value={activeStream.id}
            onChange={(e) => {
              const s = STREAMS.find(s => s.id === e.target.value);
              if (s) handleStreamChange(s);
            }}
          >
            {STREAMS.map((stream) => (
              <option key={stream.id} value={stream.id}>
                {stream.flag} {stream.label}
              </option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button onClick={handleRetry} className="action-btn" title="Reload Stream">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleShare} className="action-btn" title="Share Stream">
            <Share2 size={18} />
          </button>
          <button onClick={handleFullscreen} className="action-btn" title="Fullscreen">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
