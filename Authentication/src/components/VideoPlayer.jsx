import React, { useState } from 'react';
import '../styles/VideoPlayer.css'; // Assuming you have a CSS file for styling

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoPlayer = ({ content, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!content) return null;

  const getEmbedUrl = (url) => {
    if (content.type !== 'video') return url;

    // const videoId = getYouTubeId(url);
    // if (videoId) {
    //   console.log('YouTube Video ID:', videoId); // Log the video ID
    //   return `https://www.youtube.com/embed/${videoId}?rel=0`; // Prevent related videos
    // }
    console.error('URL:', url); // Log invalid URL
    return url;
  };

  return (
    <div 
      className="video-player-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-player-title"
    >
      <div className="video-player-content">
        <button className="close-player-btn" onClick={onClose}>
          ×
        </button>
        
        {content.type === 'video' ? (
          <div className="video-embed-container">
            <iframe
              src={getEmbedUrl(content.url)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={content.title}
              onLoad={() => setLoading(false)}
              onError={() => setError('Failed to load video')}
            />
            {loading && <div className="loading-spinner">Loading...</div>}
            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="external-content-container">
            <p>This content will open in a new tab:</p>
            <a 
              href={content.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-content-link"
            >
              Open {content.type}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;