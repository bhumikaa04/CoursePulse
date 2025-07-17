import React, { useState, useEffect } from 'react';
import '../styles/EditComponent.css';

const EditContentForm = ({ contentItem, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('document');
  const [currentThumbnail, setCurrentThumbnail] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [newThumbnailFile, setNewThumbnailFile] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(''); // This holds the path/URL from backend
  const [documentFileName, setDocumentFileName] = useState(''); // NEW STATE for displaying file name
  const [newDocumentFile, setNewDocumentFile] = useState(null);

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setDescription(contentItem.description || '');
      setType(contentItem.type || 'document');
      setCurrentThumbnail(contentItem.thumbnail || '');
      setThumbnailPreview(contentItem.thumbnail || '');
      setCurrentDocument(contentItem.url || '');

      // Set initial document file name if it's a file type
      if (['document', 'video', 'audio'].includes(contentItem.type) && contentItem.url) {
        setDocumentFileName(contentItem.url.split('/').pop());
      } else {
        setDocumentFileName(''); // Clear if not a file type
      }

      setNewThumbnailFile(null);
      setNewDocumentFile(null);
    }
  }, [contentItem]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('contentId', contentItem._id);

    // Append thumbnail
    if (newThumbnailFile) {
      formData.append('thumbnail', newThumbnailFile);
    } else if (currentThumbnail) {
      formData.append('currentThumbnailPath', currentThumbnail);
    } else {
        // If currentThumbnail is empty (e.g., cleared by user or initially none)
        formData.append('currentThumbnailPath', '');
    }


    // Append document file or url based on type
    const fileTypes = ['document', 'video', 'audio'];
    const urlTypes = ['link', 'article', 'notes']; // Assuming 'notes' is also URL-based

    if (fileTypes.includes(type)) {
      if (newDocumentFile) {
        formData.append('document', newDocumentFile);
      } else if (currentDocument) {
        formData.append('currentDocumentPath', currentDocument);
      } else {
          // If currentDocument is empty (e.g., cleared by user or initially none)
          formData.append('currentDocumentPath', '');
      }
      formData.delete('url'); // Ensure URL is not sent if it's a file type
    } else if (urlTypes.includes(type)) {
      formData.append('url', currentDocument); // currentDocument holds the URL string in these cases
      formData.delete('document'); // Ensure document file is not sent if it's a URL type
      formData.delete('currentDocumentPath'); // Also clear document path
    }

    onSave(formData);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setNewThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(currentThumbnail); // Revert to original if input cleared
    }
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    setNewDocumentFile(file);
    if (file) {
      // If a new file is selected, update the displayed file name
      setDocumentFileName(file.name);
      setCurrentDocument(''); // Clear currentDocument as a new file is being uploaded
    } else {
      // If file input is cleared, revert to the original document name/path if it exists
      setNewDocumentFile(null);
      setDocumentFileName(contentItem.url ? contentItem.url.split('/').pop() : '');
      setCurrentDocument(contentItem.url || ''); // Restore original URL/path
    }
  };

  const showFileInput = ['document', 'video', 'audio'].includes(type);
  const showUrlInput = ['link', 'article', 'notes'].includes(type); // Added 'notes'

  return (
    <div className="edit-overlay">
      <div className="edit-dialog">
        <form onSubmit={handleSubmit} className="edit-form">
          <h2 className="edit-form-title">Edit Your Content</h2>

          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              value={type}
              onChange={(e) => {
                  setType(e.target.value);
                  // Reset document/URL related states when type changes
                  setNewDocumentFile(null);
                  setCurrentDocument('');
                  setDocumentFileName('');
              }}
              required
            >
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="link">Link</option>
              <option value="article">Article</option> {/* Added article */}
              <option value="notes">Notes</option> {/* Added notes */}
            </select>
          </div>

          <div className="form-group">
            <label>Current Thumbnail:</label>
            {thumbnailPreview && (
              <img
                src={thumbnailPreview.startsWith('blob:') ? thumbnailPreview : (thumbnailPreview.startsWith('/') ? `http://localhost:3001${thumbnailPreview}` : thumbnailPreview)}
                alt="Current Thumbnail"
                className="edit-thumbnail-preview"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            <small>Upload a new image to change the thumbnail.</small>
          </div>

          {showFileInput && (
            <div className="form-group">
              <label>Current Document:</label>
              {documentFileName && ( // Use documentFileName for display
                <p className="current-file-name">{documentFileName}</p>
              )}
              <input
                type="file"
                // Adjust accept attribute based on expected file types for document, video, audio
                accept={type === 'document' ? '.pdf,.doc,.docx' : (type === 'video' ? 'video/*' : 'audio/*')}
                onChange={handleDocumentChange}
              />
              <small>Upload a new file ({type === 'document' ? 'PDF, DOC, DOCX' : (type === 'video' ? 'Video file' : 'Audio file')}).</small>
            </div>
          )}

          {showUrlInput && (
            <div className="form-group">
              <label htmlFor="url">URL:</label>
              <input
                type="text"
                id="url"
                value={currentDocument} // Use currentDocument for URL input
                onChange={(e) => setCurrentDocument(e.target.value)}
                placeholder={`Enter ${type} URL`}
                required
              />
              <small>Provide a valid {type} URL (e.g., YouTube, SoundCloud, article link).</small>
            </div>
          )}

          <div className="edit-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContentForm;