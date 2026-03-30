import React, { useState, useEffect, useRef } from 'react';
import { formatRelative } from 'date-fns';
import { ShieldAlert } from 'lucide-react';
import ChatInput from './ChatInput';
import Reactions from './Reactions';
import { socket } from '../socket';
import './Chat.css';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for chat history on connection
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Listen for new incoming messages
    socket.on('receive_message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socket.off('chat_history');
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim() || !user) return;
    
    const messageData = {
      text,
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: false, // Set this correctly via custom claims if needed later
      createdAt: Date.now()
    };
    
    socket.emit('send_message', messageData);
  };

  const formatDate = (dateNum) => {
    if (!dateNum) return '';
    return formatRelative(new Date(dateNum), new Date());
  };

  return (
    <div className="chat-container glass-panel">
      <div className="chat-header">
        <h3>Live Chat</h3>
        <div className="live-status">
          <span className="dot"></span>
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="chat-messages custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isAdmin ? 'admin-msg' : ''}`}>
            <img src={msg.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} alt="user" className="msg-avatar" />
            <div className="msg-content">
              <div className="msg-header">
                <span className="msg-name">
                  {msg.displayName}
                  {msg.isAdmin && <ShieldAlert size={14} className="admin-icon" />}
                </span>
                <span className="msg-time">{formatDate(msg.createdAt)}</span>
              </div>
              <p className="msg-text">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <Reactions user={user} />
        <ChatInput user={user} onSend={sendMessage} />
      </div>
    </div>
  );
};

export default Chat;
