import React, { useState, useEffect, useRef } from 'react';
import { formatRelative } from 'date-fns';
import { socket } from '../socket';
import ChatInput from './ChatInput';
import Reactions from './Reactions';
import './Chat.css';

const Chat = ({ user }) => {
  const [messages, setMessages]     = useState([]);
  const [joinNote, setJoinNote]     = useState(null);
  const listRef                     = useRef(null);
  const prevLen                     = useRef(0);

  useEffect(() => {
    socket.on('chat_history', (h) => setMessages(h));
    socket.on('receive_message', (m) =>
      setMessages(prev => [...prev.slice(-99), m])
    );
    socket.on('viewer_count_update', (n) => {
      if (n > 1) {
        setJoinNote(`${n} viewers watching!`);
        setTimeout(() => setJoinNote(null), 3000);
      }
    });
    return () => {
      socket.off('chat_history');
      socket.off('receive_message');
      socket.off('viewer_count_update');
    };
  }, []);

  // Smooth auto-scroll
  useEffect(() => {
    if (messages.length > prevLen.current && listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
    prevLen.current = messages.length;
  }, [messages]);

  const send = (text) => {
    if (!text.trim() || !user) return;
    socket.emit('send_message', {
      text,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: false,
      createdAt: Date.now(),
    });
  };

  const fmt = (ts) => {
    try { return formatRelative(new Date(ts), new Date()); }
    catch { return ''; }
  };

  return (
    <div className="chat-root">
      {/* Header strip */}
      <div className="chat-hdr">
        <span className="chat-hdr-title">Live Chat</span>
        <span className="chat-hdr-pill">
          <span className="chat-hdr-dot" />
          Real-time
        </span>
      </div>

      {/* Join notification */}
      {joinNote && (
        <div className="chat-join-note" key={joinNote}>
          🔴 {joinNote}
        </div>
      )}

      {/* Message list */}
      <div className="chat-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <span>💬</span>
            <p>Be the first to chat!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={m.id || i}
            className={`msg-row ${m.isAdmin ? 'msg-admin' : ''}`}
            style={{ animationDelay: `${Math.min(i * 0.02, 0.1)}s` }}
          >
            <img
              src={m.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.uid}`}
              alt=""
              className="msg-avatar"
            />
            <div className="msg-body">
              <div className="msg-meta">
                <span className="msg-name">
                  {m.displayName}
                  {m.isAdmin && <span className="msg-badge-admin">ADMIN</span>}
                </span>
                <span className="msg-time">{fmt(m.createdAt)}</span>
              </div>
              <div className="msg-bubble">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom: reactions + input */}
      <div className="chat-footer glass">
        <Reactions user={user} />
        <ChatInput user={user} onSend={send} />
      </div>
    </div>
  );
};

export default Chat;
