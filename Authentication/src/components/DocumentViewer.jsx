import React from 'react';
import { FiExternalLink, FiDownload } from 'react-icons/fi';

const DocumentViewer = ({ content, onClose }) => {
  const getDocumentType = () => {
    if (content.fileType) {
      if (content.fileType.includes('pdf')) return 'PDF';
      if (content.fileType.includes('word')) return 'Word';
      if (content.fileType.includes('powerpoint')) return 'PowerPoint';
      if (content.fileType.includes('plain')) return 'Text';
      if (content.fileType.includes('rtf')) return 'Rich Text';
    }
    return 'Document';
  };

  return (
    <div className="document-viewer-overlay">
      <div className="document-viewer-container">
        <div className="document-viewer-header">
          <h2>{content.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="document-info">
          <div className="document-meta">
            <span className="document-type">{getDocumentType()}</span>
            <span className="document-size">
              {content.fileSize ? (content.fileSize / 1024 / 1024).toFixed(2) + 'MB' : ''}
            </span>
          </div>
          
          {content.fileName && (
            <div className="document-filename">
              {content.fileName}
            </div>
          )}
        </div>
        
        <div className="document-preview-container">
          {content.fileType?.includes('pdf') ? (
            <iframe 
              src={content.url} 
              title={content.title}
              className="pdf-iframe"
            />
          ) : (
            <div className="unsupported-document">
              <p>Preview not available for this document type</p>
              <a 
                href={content.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-btn"
              >
                <FiDownload /> Download {getDocumentType()} File
              </a>
            </div>
          )}
        </div>
        
        <div className="document-actions">
          <a 
            href={content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="open-new-tab"
          >
            <FiExternalLink /> Open in new tab
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;