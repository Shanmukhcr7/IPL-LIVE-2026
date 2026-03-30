import React, { useState, useEffect } from 'react';
import { User, LogOut, Radio, Send, LogIn } from 'lucide-react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { socket } from '../socket';
import './Header.css';

const Header = ({ user }) => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    // Request current viewer count immediately when component mounts
    socket.emit('get_viewer_count');

    socket.on('viewer_count_update', (count) => {
      setViewers(count);
    });

    return () => {
      socket.off('viewer_count_update');
    };
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="app-header glass-panel">
      <div className="header-left">
        <h1 className="brand">
          IPL <span className="accent">LIVE</span>
        </h1>
        <div className="live-badge">
          <Radio className="live-icon" size={14} />
          <span>LIVE</span>
        </div>
      </div>

      <div className="header-right">
        <button 
          className="telegram-btn"
          onClick={() => window.open('https://t.me/+-mTqb9qmX7Q2ODdl', '_blank')}
        >
          <Send size={14} />
          <span className="hidden-mobile">Join Telegram</span>
        </button>

        <div className="viewers-count glass-tag">
          <User size={14} className="viewers-icon" />
          <span className="viewers-number">{viewers}</span>
          <span className="viewers-text hidden-mobile">Watching</span>
        </div>

        {user ? (
          <div className="user-profile glass-tag">
            <img src={user.photoURL} alt={user.displayName} className="avatar" />
            <span className="username hidden-mobile">{user.displayName}</span>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="login-btn">
            <LogIn size={16} />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
