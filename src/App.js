import React, { useEffect, useState } from 'react';
import DownloadForm from './components/DownloadForm';
import './App.css'; 
import logo from './assets/images/download.png';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className="App">
      <div className="drop-nav">
        <div className='container'>
          <img alt='logo' src={logo}></img>
          <h1>InstaDrop</h1>
        </div>
      </div>
      <DownloadForm />
      {deferredPrompt && (
        <button onClick={handleInstallClick} className="install-button">
          Install App
        </button>
      )}
    </div>
  );
}

export default App;
