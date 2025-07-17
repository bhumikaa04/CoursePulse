import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../styles/ViewComponent.css';
import { FiX } from 'react-icons/fi';

pdfjs.GlobalWorkerOptions.workerSrc = `http://localhost:3001/pdf-workers/pdf.worker.min.mjs`;

const ViewComponent = ({ contentItem, onClose }) => {
  const dialogRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  function extractYouTubeId(url) {
    const regExp = /(?:youtube\.com.*(?:\/|v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  function extractSpotifyId(url) {
    const match = url.match(/(?:track\/)([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  // Helper function to construct full URLs for local files
  const getFullUrl = (url) => {
    if (!url) return null;
    // If it's already a full URL (http/https) or external service, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If it's a relative path, prepend server URL
    if (url.startsWith('/')) {
      return `http://localhost:3001${url}`;
    }
    return url;
  };

  const renderContent = () => {
    console.log("Content Item in renderContent:", contentItem);

    const fileUrl = contentItem.url;

    if (!contentItem || !contentItem.type) {
      return <p className="no-content-message">No content available for viewing.</p>;
    }

    if (!fileUrl) {
      return <p className="no-content-message">File URL is missing for this content type.</p>;
    }

    switch (contentItem.type) {
      case 'document': {
        const pdfUrl = getFullUrl(fileUrl);

        if (!pdfUrl) {
          return <p className="no-content-message">PDF document URL is missing or invalid.</p>;
        }
      
        return (
          <div className="pdf-viewer scrollable-pdf">
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => {
                console.log(`PDF loaded with ${numPages} pages`);
                setNumPages(numPages);
              }}
              onLoadError={(error) => {
                console.error('PDF load error:', error);
              }}
              loading={<div>Loading PDF...</div>}
              error={<div>Failed to load PDF.</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={Math.min(600, window.innerWidth * 0.8)}
                  loading={<div>Loading page {index + 1}...</div>}
                />
              ))}
            </Document>
          </div>
        );
      }

      case 'audio': {
        if (fileUrl.includes('spotify.com')) {
          return (
            <div className="spotify-wrapper">
              <iframe
                src={`https://open.spotify.com/embed/track/${extractSpotifyId(fileUrl)}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          );
        } else {
          const audioUrl = getFullUrl(fileUrl);
          return (
            <audio controls className="media-player">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          );
        }
      }

      case 'video': {
        // Determine if it's a YouTube video or local file
        const isYouTube = fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be');
        const fullVideoUrl = getFullUrl(fileUrl);
        
        console.log('Video debug info:', {
          originalUrl: fileUrl,
          fullVideoUrl,
          isYouTube,
          fileExtension: fileUrl.split('.').pop()
        });
        
        return (
          <div className="video-wrapper">
            {isYouTube ? (
              <iframe
                className="responsive-iframe"
                src={`https://www.youtube.com/embed/${extractYouTubeId(fileUrl)}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                controls 
                className="responsive-video"
                onError={(e) => {
                  console.error('Video error:', e);
                  console.error('Video error details:', e.target.error);
                }}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}
                onLoadedData={() => console.log('Video data loaded')}
              >
                <source src={fullVideoUrl} type="video/mp4" />
                <source src={fullVideoUrl} type="video/webm" />
                <source src={fullVideoUrl} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        );
      }

      case 'url': {
        return (
          <div className="no-content-message">
            This content cannot be embedded directly.
            <br />
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              Click here to open it in a new tab
            </a>
          </div>
        );
      }

      case 'image': {
        const imageUrl = getFullUrl(fileUrl);
        return (
          <img src={imageUrl} alt={contentItem.title || "Content Image"} className="image-view" />
        );
      }

      default:
        return <p className="unsupported-type-message">Unsupported content type: {contentItem.type}</p>;
    }
  };

  return (
    <div className="view-overlay">
      <div className="view-dialog" ref={dialogRef}>
        <button className="view-close-button" onClick={onClose}>
          <FiX />
        </button>
        <div className="view-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ViewComponent;