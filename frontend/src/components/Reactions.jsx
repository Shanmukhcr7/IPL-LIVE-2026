import React, { useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';
import './Reactions.css';

const EMOJIS = ['❤️', '🔥', '😂', '👏', '😮'];

// Each emoji gets its own unique drift profile so they feel physical
const DRIFTS = [-30, -12, 0, 12, 30];

let emojiId = 0;

const Reactions = ({ user }) => {
  const [floaters, setFloaters] = useState([]);

  useEffect(() => {
    socket.on('receive_reaction', ({ emoji }) => spawnFloater(emoji));
    return () => socket.off('receive_reaction');
  }, []);

  const spawnFloater = useCallback((emoji) => {
    const id    = ++emojiId;
    const drift = (Math.random() - 0.5) * 60; // px left/right
    setFloaters(p => [...p.slice(-15), { id, emoji, drift }]);
    setTimeout(() => setFloaters(p => p.filter(f => f.id !== id)), 3200);
  }, []);

  const tap = (emoji) => {
    if (!user) return;
    // Instant local feedback
    spawnFloater(emoji);
    socket.emit('send_reaction', { emoji, uid: user.uid });
  };

  return (
    <div className="rx-root">
      {/* Floating layer */}
      <div className="rx-float-layer" aria-hidden="true">
        {floaters.map(({ id, emoji, drift }) => (
          <span
            key={id}
            className="rx-floater"
            style={{ '--drift': `${drift}px` }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Reaction buttons */}
      <div className="rx-bar">
        {EMOJIS.map((emoji, i) => (
          <button
            key={emoji}
            className="rx-btn ripple"
            onClick={() => tap(emoji)}
            style={{ '--i': i }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reactions;
