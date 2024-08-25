import React, { useEffect, useState } from 'react';
import DownloadForm from './components/DownloadForm';
import './App.css';
import './InstallPopup.css'; 
import logo from './assets/images/download.png';

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPopup(true);
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
        setShowInstallPopup(false);
      });
    }
  };

  const handleClosePopup = () => {
    setShowInstallPopup(false);
  };

  return (
    <div className="App">
      <div className="drop-nav">
        <div className='container'>
          <img alt='logo' src={logo} />
          <h1>InstaDrop</h1>
        </div>
      </div>
      <DownloadForm />
      {showInstallPopup && (
        <div className="install-popup">
          <div className="install-popup-content">
            <h2>Install App</h2>
            <p>Install our app for a better experience!</p>
            <button onClick={handleInstallClick} className="install-button">
              Install
            </button>
            <button onClick={handleClosePopup} className="close-button">
              &times;
            </button>
          </div>
        </div>
      )}
      {/* New Content Section */}
      <div className="features-section">
        <h2>Why Use InstaDrop?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Download Instagram Stories</h3>
            <p>Save Instagram stories to your device easily and quickly.</p>
          </div>
          <div className="feature">
            <h3>Save Reels Instantly</h3>
            <p>Download popular Instagram reels and keep them for offline viewing.</p>
          </div>
          <div className="feature">
            <h3>Video Downloader</h3>
            <p>Get any Instagram video downloaded with just a few clicks.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>&copy; 2024 InstaDrop | All rights reserved.</p>
        {/* <ul className="footer-links">
          <li><a href="#privacy">Privacy Policy</a></li>
          <li><a href="#terms">Terms of Service</a></li>
          <li><a href="#contact">Contact Us</a></li>
        </ul> */}
      </footer>
    </div>
  );
}

export default App;
