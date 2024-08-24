import React, { useState, useRef } from 'react';
import axios from 'axios';
import './DownloadForm.css';
import videoImageVideo from '../assets/images/webpc-passthru.jpg';
import videoImagepng from '../assets/images/picture1.png';
import 'ldrs/ring';

function DownloadForm() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState(''); 
  const [isVideo, setIsVideo] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const inputRef = useRef(null);

  const determineContentType = (url) => {
    if (url.includes('/reel/')) {
      return 'reel';
    } else if (url.includes('/p/')) {
      return 'post';
    } else if (url.includes('/stories/')) {
      return 'story';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMediaUrl(''); 
    setIsVideo(false);
    setLoading(true); 

    const contentType = determineContentType(url);
    if (!contentType) {
      setMessage('The URL provided is not a valid Instagram post, reel, or story.');
      setLoading(false); 
      return;
    }

    let apiUrl = '';
    if (contentType === 'reel') {
      apiUrl = 'https://insta-drop-3.onrender.com/api/download/video';
    } else if (contentType === 'post') {
      apiUrl = 'https://insta-drop-3.onrender.com/api/download/post';
    } else if (contentType === 'story') {
      apiUrl = 'https://insta-drop-3.onrender.com/api/download/story';
    }

    try {
      const response = await axios.post(apiUrl, { url }, {
        responseType: 'blob'
      });

      const contentTypeHeader = response.headers['content-type'];
      const mediaBlob = new Blob([response.data], { type: contentTypeHeader });
      const mediaObjectUrl = URL.createObjectURL(mediaBlob);

      setMediaUrl(mediaObjectUrl);
      setIsVideo(contentTypeHeader.startsWith('video/'));

    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.error}`);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false); 
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      inputRef.current.focus();
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className="download-form">
      <header>
        <h1>Instagram Media Download</h1>
        <h5>Download Instagram Video, Photo, Reels, Stories, IGTV online</h5>
      </header>
      <form className='downForm' onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Instagram post URL"
            ref={inputRef}
          />
          <button type="button" className="paste-button" onClick={handlePaste}>
            Paste
          </button>
        </div>
        <button type="submit"><span>Download</span></button>
      </form>

      {loading && (
        <div class="containerm">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      )}

      {message && <p className="message">{message}</p>}
      
      {mediaUrl && (
        <div className="media-container">
          {isVideo ? (
            <video controls>
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={mediaUrl} alt="Downloaded content" /> 
          )}
          <a href={mediaUrl} download={isVideo ? 'downloaded-video.mp4' : 'downloaded-image.jpg'}>
            <button type="button" className="download-button">Download {isVideo ? 'Video' : 'Image'}</button>
          </a>
        </div>
      )}
      <div className="content" id="content">
      <div className="title-box">
        <h3 className="title">All features of InstaDrop</h3>
        <p className="sub">InstaDrop supports all types of Instagram videos/images links</p>
      </div>
      <div className="list-tools">
        <div className="tool-box">
          <div className="tool-info">
            <h4><a href="/">Instagram video downloader</a></h4>
            <p>InstaDrop allows you to Download Instagram Video from your own content. InstaDrop supports downloading videos for many video types from Insta.</p>
          </div>
          <div className="tool-thumb">            
              <img src={videoImageVideo} alt="Instagram" />            
          </div>
        </div>
        <div className="tool-box tool-reverse">
          <div className="tool-info">
            <h4><a href="/instagram-photo-download">Instagram photo downloader</a></h4>
            <p>Instagram Photo Downloader from InstaDrop allows you to save any photo or collage from Instagram without any difficulty. With InstaDrop you can download a single post image as well as download multiple Instagram photos.</p>
          </div>
          <div className="tool-thumb">
              <img src={videoImagepng} alt="Instagram" />
          </div>
        </div>
      </div>     
    </div>
    </div>    
  );
}

export default DownloadForm;
