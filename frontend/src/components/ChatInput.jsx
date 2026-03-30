import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import './ChatInput.css';

const ChatInput = ({ user, onSend }) => {
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [lastSent, setLastSent] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Spam protection: 2 seconds cooldown
    const now = Date.now();
    if (now - lastSent < 2000) {
      alert("Please wait 2 seconds before sending another message.");
      return;
    }

    onSend(text);
    setText('');
    setShowEmoji(false);
    setLastSent(now);
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  if (!user) {
    return (
      <div className="chat-login-prompt">
        <p>Login to participate in chat</p>
      </div>
    );
  }

  return (
    <div className="chat-input-container">
      {showEmoji && (
        <div className="emoji-picker-wrapper">
          <EmojiPicker 
            onEmojiClick={onEmojiClick} 
            theme="dark"
            width={300}
            height={350}
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="chat-form">
        <button 
          type="button" 
          className="emoji-btn"
          onClick={() => setShowEmoji(!showEmoji)}
        >
          <Smile size={20} />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="chat-field"
          maxLength={200}
        />
        <button type="submit" className="send-btn" disabled={!text.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
