import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ContentForm.css';
import { useNotification } from '../context/NotificationContext';
import { FiUpload, FiCheck, FiX, FiLink, FiFile } from 'react-icons/fi';

const ContentForm = ({ onClose, courseId, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    description: '',
    url: '',
    file: null,
    thumbnail: null,
    inputMethod: 'url', // 'url' or 'file'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [fileName, setFileName] = useState('');

  const showNotification = useNotification();

  // Content types that support both URL and file upload
  const uploadableTypes = ['video', 'audio', 'document', 'image'];

  // Validate URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate file types and sizes
  const isValidFile = (file, allowedTypes, maxSizeMB) => {
    if (!file) return false;
    const typeValid = allowedTypes.some(type => file.type.includes(type));
    const sizeValid = file.size <= maxSizeMB * 1024 * 1024;
    return typeValid && sizeValid;
  };

  // Get allowed file types based on content type
  const getAllowedFileTypes = (type) => {
    switch (type) {
      case 'video':
        return ['video'];
      case 'audio':
        return ['audio'];
      case 'document':
        return ['pdf', 'msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
      case 'image':
        return ['image'];
      default:
        return [];
    }
  };

  // Get max file size based on content type (in MB)
  const getMaxFileSize = (type) => {
    switch (type) {
      case 'video':
        return 100; // 100MB for videos
      case 'audio':
        return 50; // 50MB for audio
      case 'document':
        return 10; // 10MB for documents
      case 'image':
        return 5; // 5MB for images
      default:
        return 2;
    }
  };

  // YouTube thumbnail extractor
  const getYoutubeThumbnail = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `http://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  // Form validation
  const isValid = () => {
    const { title, type, description, inputMethod } = formData;
    if (!title.trim() || !type || !description.trim()) {
      return false;
    }
    
    if (uploadableTypes.includes(type)) {
      if (inputMethod === 'url') {
        return formData.url.trim() && isValidUrl(formData.url);
      } else {
        return formData.file !== null;
      }
    }
    
    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    if (error) setError('');
    const { name, value, files } = e.target;
    
    if (name === 'thumbnail' && files && files[0]) {
      if (!isValidFile(files[0], ['image'], 2)) {
        setError('Thumbnail must be an image (JPG/PNG) under 2MB');
        return;
      }
      setThumbnailPreview(URL.createObjectURL(files[0]));
      setFormData(prev => ({ ...prev, thumbnail: files[0] }));
      return;
    }
    
    if (name === 'file' && files && files[0]) {
      const allowedTypes = getAllowedFileTypes(formData.type);
      const maxSize = getMaxFileSize(formData.type);
      
      if (!isValidFile(files[0], allowedTypes, maxSize)) {
        setError(`File must be ${allowedTypes.join('/')} under ${maxSize}MB`);
        return;
      }
      setFileName(files[0].name);
      setFormData(prev => ({ ...prev, file: files[0] }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input method toggle
  const handleInputMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      inputMethod: method,
      url: method === 'file' ? '' : prev.url,
      file: method === 'url' ? null : prev.file,
    }));
    setFileName('');
    setError('');
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      title: '',
      type: 'video',
      description: '',
      url: '',
      file: null,
      thumbnail: null,
      inputMethod: 'url',
    });
    setThumbnailPreview(null);
    setFileName('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setError('Please fill all required fields correctly');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      let youtubeThumbnailUrl = null;

      // Handle thumbnail
      if (formData.type === 'video' && !formData.thumbnail && formData.url.includes('youtube')) {
        youtubeThumbnailUrl = getYoutubeThumbnail(formData.url);
        if (youtubeThumbnailUrl) {
          formDataToSend.append('thumbnailUrl', youtubeThumbnailUrl);
        }
      } else if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail);
      }

      // Append all fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('inputMethod', formData.inputMethod);

      // Append content based on input method
      if (formData.inputMethod === 'url') {
        formDataToSend.append('url', formData.url);
      } else {
        formDataToSend.append('file', formData.file);
      }

      const response = await fetch(
        `http://localhost:3001/course/${courseId}/addContent`,
        {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add content');
      }

      const result = await response.json();
      setIsSuccess(true);
      showNotification("Content added successfully!", 'success');
      
      setTimeout(() => {
        onClose(true);
        resetForm();
        setIsSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to add content');
      showNotification(err.message || "Error adding content", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal">
        <h2>Add New Content</h2>
        
        {error && (
          <div className="error-message" role="alert">
            <FiX className="error-icon" /> {error}
          </div>
        )}
        
        {isSuccess ? (
          <div className="success-message">
            <FiCheck className="success-icon" /> Content added successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title-input">
                Title *
                <input
                  id="title-input"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="type-select">
                Content Type *
                <select 
                  id="type-select"
                  name="type" 
                  value={formData.type} 
                  onChange={(e) => {
                    handleChange(e);
                    // Reset input method when type changes
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value,
                      inputMethod: 'url',
                      file: null,
                      url: '',
                    }));
                    setFileName('');
                  }}
                  required
                  aria-required="true"
                >
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="url">Link (URL only)</option>
                </select>
              </label>
            </div>

            {uploadableTypes.includes(formData.type) && (
              <div className="form-group">
                <label>Content Source *</label>
                <div className="input-method-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${formData.inputMethod === 'url' ? 'active' : ''}`}
                    onClick={() => handleInputMethodChange('url')}
                  >
                    <FiLink /> URL
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${formData.inputMethod === 'file' ? 'active' : ''}`}
                    onClick={() => handleInputMethodChange('file')}
                  >
                    <FiFile /> File Upload
                  </button>
                </div>
              </div>
            )}

            {uploadableTypes.includes(formData.type) ? (
              formData.inputMethod === 'url' ? (
                <div className="form-group">
                  <label htmlFor="url-input">
                    Content URL *
                    <input
                      id="url-input"
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder={
                        formData.type === 'video' ? 'https://youtube.com/watch?v=...' : 
                        formData.type === 'image' ? 'https://example.com/image.jpg' : 
                        'https://example.com'
                      }
                      required
                      aria-required="true"
                    />
                  </label>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="file-input">
                    Upload File *
                    <div className="file-input-wrapper">
                      <input
                        id="file-input"
                        type="file"
                        name="file"
                        onChange={handleChange}
                        accept={
                          formData.type === 'video' ? 'video/*' :
                          formData.type === 'audio' ? 'audio/*' :
                          formData.type === 'document' ? '.pdf,.doc,.docx,.txt' :
                          formData.type === 'image' ? 'image/*' : ''
                        }
                        required
                        aria-required="true"
                      />
                      <span className="file-input-label">
                        {fileName || `Choose ${formData.type} file...`}
                        <FiUpload className="upload-icon" />
                      </span>
                    </div>
                    <small>
                      {formData.type === 'video' ? 'MP4, MOV (max 100MB)' :
                       formData.type === 'audio' ? 'MP3, WAV (max 50MB)' :
                       formData.type === 'document' ? 'PDF, DOC, DOCX (max 10MB)' :
                       formData.type === 'image' ? 'JPG, PNG (max 5MB)' : ''}
                    </small>
                  </label>
                </div>
              )
            ) : (
              <div className="form-group">
                <label htmlFor="url-input">
                  URL *
                  <input
                    id="url-input"
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                    aria-required="true"
                  />
                </label>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="description-textarea">
                Description *
                <textarea
                  id="description-textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  aria-required="true"
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail-input">
                Thumbnail
                <div className="file-input-wrapper">
                  <input
                    id="thumbnail-input"
                    type="file"
                    name="thumbnail"
                    onChange={handleChange}
                    accept="image/*"
                  />
                  <span className="file-input-label">
                    {thumbnailPreview ? 'Change thumbnail' : 'Choose thumbnail...'}
                    <FiUpload className="upload-icon" />
                  </span>
                </div>
                <small>JPG, PNG (max 2MB)</small>
              </label>
              {thumbnailPreview && (
                <div className="thumbnail-preview">
                  <img src={thumbnailPreview} alt="Thumbnail preview" />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel" 
                onClick={() => onClose()}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit" 
                disabled={!isValid() || isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

ContentForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default ContentForm;