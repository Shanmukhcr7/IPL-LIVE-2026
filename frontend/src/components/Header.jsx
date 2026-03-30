import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { socket } from '../socket';
import './Header.css';

const Header = ({ user }) => {
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    socket.emit('get_viewer_count');
    socket.on('viewer_count_update', setViewers);
    return () => socket.off('viewer_count_update');
  }, []);

  const login  = () => signInWithPopup(auth, provider).catch(console.error);
  const logout = () => signOut(auth).catch(console.error);

  const formatViewers = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  return (
    <header className="app-header glass">
      {/* Left: Brand */}
      <div className="hdr-left">
        <span className="hdr-brand">IPL <span>LIVE</span></span>
        <span className="badge-live">LIVE</span>
      </div>

      {/* Centre: Viewers */}
      <div className="hdr-viewers">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span className="hdr-count">{formatViewers(viewers)}</span>
        <span className="hdr-watching">watching</span>
      </div>

      {/* Right: Auth */}
      <div className="hdr-right">
        {user ? (
          <button className="hdr-avatar-btn ripple" onClick={logout} title="Logout">
            <img src={user.photoURL} alt="" className="hdr-avatar" />
          </button>
        ) : (
          <button className="hdr-login-btn ripple" onClick={login}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Sign In
          </button>
        )}
        <button
          className="hdr-telegram-btn ripple"
          onClick={() => window.open('https://t.me/+-mTqb9qmX7Q2ODdl', '_blank')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
