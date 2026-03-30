import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import Chat from './components/Chat';
import Reactions from './components/Reactions';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="loader-ring"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header user={user} />
      
      <main className="main-content">
        <VideoPlayer />
        <Chat user={user} />
      </main>
    </div>
  );
}

export default App;
