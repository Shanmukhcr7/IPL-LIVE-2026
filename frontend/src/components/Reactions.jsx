import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import './Reactions.css';

const REACTION_TYPES = ['❤️', '😂', '🔥', '👏', '😮'];

const Reactions = ({ user }) => {
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  useEffect(() => {
    // Listen for incoming reactions from socket
    socket.on('receive_reaction', (reaction) => {
      triggerAnimation(reaction.emoji, reaction.id);
    });

    return () => {
      socket.off('receive_reaction');
    };
  }, []);

  const triggerAnimation = (emoji, id) => {
    const xPos = Math.random() * 80 + 10; // Random X position 10% to 90%
    setFloatingEmojis(prev => [...prev, { id, emoji, xPos }]);

    // Remove emoji after animation completes (3s)
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 3000);
  };

  const handleReactionClick = (emoji) => {
    if (!user) {
      alert("Please login to react!");
      return;
    }

    const payload = {
      emoji,
      uid: user.uid,
    };

    // Emit to socket server
    socket.emit('send_reaction', payload);
  };

  return (
    <div className="reactions-container">
      <div className="reaction-animations-layer">
        {floatingEmojis.map(item => (
          <div 
            key={item.id} 
            className="floating-emoji" 
            style={{ left: `${item.xPos}%` }}
          >
            {item.emoji}
          </div>
        ))}
      </div>

      <div className="reaction-buttons-bar glass-panel">
        {REACTION_TYPES.map(emoji => (
          <button
            key={emoji}
            className="reaction-btn"
            onClick={() => handleReactionClick(emoji)}
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reactions;
