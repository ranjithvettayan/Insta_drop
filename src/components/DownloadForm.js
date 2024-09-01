import React, { useState, useRef } from 'react';
import axios from 'axios';
import './DownloadForm.css';
import videoImageVideo from '../assets/images/webpc-passthru.jpg';
import videoImagepng from '../assets/images/picture1.png';
import story from '../assets/images/story.png';
import photo from '../assets/images/photo.png';
import video from '../assets/images/video.png';
import reels from '../assets/images/reel.png';
import igtv from '../assets/images/igtv.png';

function DownloadForm() {
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]); // Holds multiple media files
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
    setMediaFiles([]); // Reset media files
    setLoading(true);

    const contentType = determineContentType(url);
    if (!contentType) {
      setMessage('The URL provided is not a valid Instagram post, reel, or story.');
      setLoading(false);
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    let apiUrl = '';
    if (contentType === 'reel') {
      apiUrl = 'http://127.0.0.1:8000/api/download/reel';
    } else if (contentType === 'post') {
      apiUrl = 'http://127.0.0.1:8000/api/download/post';
    } else if (contentType === 'story') {
      apiUrl = 'http://127.0.0.1:8000/api/download/story';
    }

    try {
      const response = await axios.post(apiUrl, { url }, { responseType: 'blob' });

      const contentType = response.headers['content-type'];

      if (contentType === 'application/json') {

        const jsonText = await response.data.text();
        const mediaResponse = JSON.parse(jsonText);

        if (Array.isArray(mediaResponse.media_files)) {
           const con = mediaResponse.media_files;
           const contentFetch = con.map(item => item.content);
           const contentType = con.map(item => item.content_type);
          
          const files = contentFetch.map((encodedFile, index) => {
            const binaryString = atob(encodedFile);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
        
            const isVideo = contentType[index].includes('mp4');
            
            const mimeType = isVideo ? 'video/mp4' : 'image/jpeg';
            const blob = new Blob([bytes], { type: mimeType });
            const mediaObjectUrl = URL.createObjectURL(blob);
        
            return {
              content: encodedFile,
              mediaObjectUrl, 
              isVideo
            };
          });
          setMediaFiles(files);
        } else {
          setMessage('No media found for the provided URL.');
        }
      } else {
        // Handle case when the response is a single media file
        const contentType = response.headers['content-type'];
        const isVideo = contentType.includes('video/mp4');
        const mediaObjectUrl = URL.createObjectURL(response.data);

        setMediaFiles([
          { mediaObjectUrl, isVideo },
        ]);
      }

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
        <div className='pageTunerWrapper__items'>
          <div className='pageTunerWrapper__item'>
            <a href='/Insta_drop'>
              <img src={video} alt="Video" /><span>Video</span>
            </a>
          </div>
          <div className='pageTunerWrapper__item'>
            <a href='/Insta_drop'>
              <img src={photo} alt="instaphoto" /><span>Photo</span>
            </a>
          </div>
          <div className='pageTunerWrapper__item border_400'>
            <a href='/Insta_drop'> 
              <img src={story} alt="Story-saver" /><span>Story</span>
            </a>
          </div>
          <div className='pageTunerWrapper__item border_mobile'>
            <a href='/Insta_drop'>
              <img src={reels} alt="Reels-downloader" /><span>Reels</span>
            </a>
          </div>
          <div className='pageTunerWrapper__item border_none'>
            <a href='/'>
              <img src={igtv} alt="IGTV" /><span>IGTV</span>
            </a>
          </div>
        </div>
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
        <div className="containerm">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {mediaFiles.length > 0 && (
        <div className="media-container">
          {mediaFiles.map((file, index) => (
            <div key={index} className="media-item">
              {file.isVideo ? (
                <video controls>
                  <source src={file.mediaObjectUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={file.mediaObjectUrl} alt={`Downloaded content ${index + 1}`} />
              )}
              <a href={file.mediaObjectUrl} download={file.isVideo ? `downloaded-video-${index + 1}.mp4` : `downloaded-image-${index + 1}.jpg`}>
                <button type="button" className="download-button">Download {file.isVideo ? 'Video' : 'Image'}</button>
              </a>
            </div>
          ))}
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
              <h4><a href="/Insta_drop">Instagram video downloader</a></h4>
              <p>InstaDrop allows you to Download Instagram Video from your own content. InstaDrop supports downloading videos for many video types from Insta.</p>
            </div>
            <div className="tool-thumb">
              <img src={videoImageVideo} alt="Instagram" />
            </div>
          </div>
          <div className="tool-box tool-reverse">
            <div className="tool-info">
              <h4><a href="/Insta_drop">Instagram photo downloader</a></h4>
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
