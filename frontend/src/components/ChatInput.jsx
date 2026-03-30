import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatInput.css';

const COOLDOWN_MS = 2000;

const ChatInput = ({ user, onSend }) => {
  const [text, setText]           = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [cooldown, setCooldown]   = useState(false);
  const [shake, setShake]         = useState(false);
  const inputRef                  = useRef(null);

  const submit = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    if (cooldown) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    onSend(text.trim());
    setText('');
    setShowEmoji(false);
    setCooldown(true);
    setTimeout(() => setCooldown(false), COOLDOWN_MS);
    inputRef.current?.focus();
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  if (!user) {
    return (
      <div className="ci-locked">
        <span className="ci-locked-icon">🔒</span>
        <span>Sign in to join the chat</span>
      </div>
    );
  }

  return (
    <div className="ci-root">
      {showEmoji && (
        <div className="ci-emoji-wrap">
          <EmojiPicker
            onEmojiClick={(e) => { setText(p => p + e.emoji); inputRef.current?.focus(); }}
            theme="dark"
            width="100%"
            height={300}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <form className="ci-form" onSubmit={submit}>
        {/* Emoji toggle */}
        <button type="button" className="ci-icon-btn ripple" onClick={() => setShowEmoji(v => !v)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          className={`ci-input ${shake ? 'ci-shake' : ''}`}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder={cooldown ? 'Slow down… ⏳' : 'Say something…'}
          maxLength={200}
          autoComplete="off"
        />

        {/* Send */}
        <button
          type="submit"
          className={`ci-send ripple ${(!text.trim() || cooldown) ? 'disabled' : ''}`}
          disabled={!text.trim() || cooldown}
        >
          {cooldown ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
