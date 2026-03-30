import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import Chat from './components/Chat';
import './index.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="app-loader">
        <div className="app-loader-ring" />
        <p className="app-loader-text">IPL <span>LIVE</span></p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header user={user} />
      <div className="app-body">
        <VideoPlayer />
        <Chat user={user} />
      </div>
    </div>
  );
}

export default App;
