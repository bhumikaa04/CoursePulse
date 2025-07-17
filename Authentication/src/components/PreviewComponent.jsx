import React from 'react';
import '../styles/previewComponent.css';

const PreviewComponent = ({ contentItem, onViewContent, onCancel }) => {
  if (!contentItem) return null;

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/\//g, '-');
  };

  return (
    <div className="preview-overlay">
      <div className="preview-dialog">
        <div className="preview-header">
          {contentItem.thumbnail && (
            <img
              src={contentItem.thumbnail.startsWith('/') 
                ? `http://localhost:3001${contentItem.thumbnail}` 
                : contentItem.thumbnail}
              alt={contentItem.title || 'Content Thumbnail'}
              className="preview-thumbnail"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="preview-header-text">
            <h2 className="preview-title">{contentItem.title}</h2>
            
            <div className="preview-meta">
              {contentItem.type && (
                <span className="preview-type-badge">{contentItem.type}</span>
              )}
              {contentItem.createdAt && (
                <span className="preview-date">
                  Updated: {formatDateTime(contentItem.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="preview-content">
          <p className="preview-description">
            Description : &nbsp;
            {contentItem.description || 'No description available.'}
          </p>
        </div>

        <div className="preview-actions">
            <button className="btn btn-primary" onClick={onViewContent}>
              View Content
            </button>

          <button className="btn btn-secondary" onClick={onCancel}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewComponent;