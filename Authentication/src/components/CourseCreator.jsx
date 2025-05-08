import React, { useState, useEffect, useContext } from 'react';
import '../styles/CourseCreator.css'; 
import { AuthContext } from '../context/AuthContext'; 
import { FiMoreVertical, FiEdit2, FiTrash2, FiExternalLink, FiPlus } from 'react-icons/fi';
import VideoPlayer from './VideoPlayer';

const CourseCreator = () => {
  const { user } = useContext(AuthContext);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [playingContent, setPlayingContent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video',
    url: '',
    description: '',
    thumbnail: ''
  });
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch('/courses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Error fetching courses: ${errText}`);
        }

        const userCourses = await response.json();
        const formattedCourses = userCourses.map(course => ({
          ...course,
          id: course._id || course.id,
          contents: course.contents || []
        }));

        if (formattedCourses.length > 0) {
          setCourses(formattedCourses);
        }
      } catch (error) {
        console.error("Error fetching user courses:", error);
      }
    };

    fetchUserCourses();
  }, [user?.email]);

  const handleCreateCourse = () => {
    if (newCourseTitle.trim() === '') {
      alert('Please enter a course title');
      return;
    }
    
    const newCourse = {
      id: Date.now(),
      title: newCourseTitle,
      contents: []
    };
    
    setCourses([...courses, newCourse]);
    setSelectedCourse(newCourse);
    setNewCourseTitle('');
  };

  const handleSaveCourse = async () => {
    if (!user?.email) {
      alert('Please log in first');
      return;
    }
  
    if (!selectedCourse?.title) {
      alert('Course title is required');
      return;
    }
  
    try {
      const response = await fetch('/create-course/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          course: {
            ...selectedCourse,
            contents: selectedCourse.contents || []
          },
          userEmail: user.email
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save course');
      }
  
      const savedCourse = await response.json();
      setCourses(prevCourses =>
        prevCourses.map(c =>
          c.id === selectedCourse.id ? savedCourse : c
        )
      );
      setSelectedCourse(savedCourse);
      alert('Course saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert(`Save failed: ${err.message}`);
    }
  };

  const handlePublishCourse = async () => {
    if (!user?.email) {
      alert('Please log in first');
      return;
    }
    
    if (!selectedCourse) {
      alert('Please select a course to publish');
      return;
    }
    
    if (!selectedCourse.contents || selectedCourse.contents.length === 0) {
      alert('Please add content to your course before publishing');
      return;
    }
    
    try {
      setIsPublishing(true);
      
      const response = await fetch('/api/courses/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          userEmail: user.email
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish course');
      }
      
      const publishedCourse = await response.json();
      
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === selectedCourse.id ? { ...c, published: true } : c
        )
      );
      
      setSelectedCourse(prev => ({ ...prev, published: true }));
      alert('Course published successfully!');
    } catch (err) {
      console.error('Publish error:', err);
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleContentClick = (content) => {
    setPlayingContent(content);
  };

  const updateThumbnail = async () => {
    if (newContent.type !== 'video' || !newContent.url) return;
    
    try {
      setThumbnailLoading(true);
      const videoId = getYouTubeId(newContent.url);
      
      if (videoId) {
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        
        const response = await fetch(thumbnailUrl, { method: 'HEAD' });
        
        if (response.ok) {
          setNewContent(prev => ({
            ...prev,
            thumbnail: thumbnailUrl
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching YouTube thumbnail:', error);
    } finally {
      setThumbnailLoading(false);
    }
  };
  
  useEffect(() => {
    let debounceTimer;
    
    if (newContent.type === 'video' && newContent.url) {
      debounceTimer = setTimeout(() => {
        updateThumbnail();
      }, 500);
    }
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [newContent.url, newContent.type]);

  const isValidUrl = (url) => {
    if (!url) return false;
    
    try {
      const newUrl = new URL(url);
      return ['http:', 'https:'].includes(newUrl.protocol);
    } catch {
      return false;
    }
  };

  const handleAddContent = () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }
    
    if (!newContent.title.trim()) {
      alert('Content title is required');
      return;
    }
    
    if (!['video', 'article', 'audio'].includes(newContent.type)) {
      alert('Please select a valid content type');
      return;
    }

    if (!isValidUrl(newContent.url)) {
      alert('Please enter a valid URL starting with http:// or https://');
      return;
    }
  
    const updatedCourse = {
      ...selectedCourse,
      contents: [...(selectedCourse.contents || []), {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        ...newContent
      }]
    }; 

    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setSelectedCourse(updatedCourse);
    resetContentForm();
  };

  const resetContentForm = () => {
    setNewContent({
      title: '',
      type: 'video',
      url: '',
      description: '',
      thumbnail: ''
    });
    setIsAddingContent(false);
  };

  const handleContentChange = (e) => {
    const { name, value } = e.target;
    setNewContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleAddContentForm = () => {
    setIsAddingContent(!isAddingContent);
    if (isAddingContent) {
      resetContentForm();
    }
  };

  const toggleDropdown = (contentId) => {
    setDropdownOpen(dropdownOpen === contentId ? null : contentId);
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    setNewContent({
      title: content.title,
      type: content.type || 'video',
      url: content.url || '',
      description: content.description || '',
      thumbnail: content.thumbnail || ''
    });
    setIsAddingContent(true);
  };

  const handleDeleteContent = (contentId) => {
    if (!selectedCourse || !selectedCourse.contents) return;
    
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    const updatedCourse = {
      ...selectedCourse,
      contents: selectedCourse.contents.filter(content => content.id !== contentId)
    };
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setSelectedCourse(updatedCourse);
    setDropdownOpen(null);
  };

  const handleUpdateContent = () => {
    if (!selectedCourse || !editingContent) return;
    
    if (!newContent.title.trim()) {
      alert('Content title is required');
      return;
    }
    
    if (!isValidUrl(newContent.url)) {
      alert('Please enter a valid URL');
      return;
    }
    
    const updatedCourse = {
      ...selectedCourse,
      contents: (selectedCourse.contents || []).map(content => 
        content.id === editingContent.id ? { ...content, ...newContent } : content
      )
    };
    
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    setSelectedCourse(updatedCourse);
    resetContentForm();
    setEditingContent(null);
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }
  
    setThumbnailLoading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewContent(prev => ({
        ...prev,
        thumbnail: event.target.result
      }));
      setThumbnailLoading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setThumbnailLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const courseContents = selectedCourse?.contents || [];

  const getContentTypeIcon = (type) => {
    switch(type) {
      case 'video': return '🎬';
      case 'article': return '📄';
      case 'audio': return '🎧';
      default: return '📑';
    }
  };

  return (
    <div className="course-creator-container">
      {/* Sidebar Container */}
      <div className={`course-sidebar-container ${isSidebarVisible ? 'visible' : 'hidden'}`}>
        <div className="sidebar-header">
          <h3>Your Courses</h3>
          <button 
            className="create-course-btn"
            onClick={() => setSelectedCourse(null)}
          >
            Create A New Course
          </button>
        </div>

        <ul className="course-list">
          {courses.map(course => (
            <li 
              key={course.id}
              className={`course-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
              onClick={() => setSelectedCourse(course)}
            >
              {course.title}
              {course.published && <span className="published-indicator">✓</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Persistent Toggle Button */}
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? '◄' : '►'}
      </button>
      
      <div className={`main-content ${isSidebarVisible ? '' : 'full-width'}`}>
        {!selectedCourse ? (
          <div className="create-course-prompt">
            <h1>Create Your OWN Personalized Course</h1>
            <div className="new-course-form">
              <input
                type="text"
                placeholder="Enter course title"
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="course-title-input"
              />
              <button 
                onClick={handleCreateCourse}
                className="create-btn"
              >
                Create Course
              </button>
            </div>
          </div>
        ) : (
          <div className="course-editor">
            <div className="course-header">
              <h1>{selectedCourse.title}</h1>
              <div className="course-actions">
                <button
                  className="save-btn" 
                  onClick={handleSaveCourse} 
                  disabled={!selectedCourse}
                >
                  Save Course
                </button>
                <button 
                  className="publish-btn"
                  onClick={handlePublishCourse}
                  disabled={!selectedCourse || isPublishing || courseContents.length === 0}
                >
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
            
            <div className="content-horizontal-layout">
              {courseContents.length === 0 ? (
                <div className="empty-content-message">
                  <p>No content added yet. Click "Add New Content" to start building your course.</p>
                </div>
              ) : (
                <div className="content-flow-container">
                  <div className="connecting-line"></div>
                  <div className="content-boxes-row">
                    {courseContents.map((content, index) => (
                      <div key={content.id} className="content-box">
                        <div className="content-box-inner">
                          <div className="box-header">
                            <h3 onClick={() => handleContentClick(content)} style={{ cursor: 'pointer' }}>
                              {content.title}
                            </h3>
                            <div className="box-actions">
                              <button 
                                className="action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(content.id);
                                }}
                                aria-label="Content options"
                              >
                                <FiMoreVertical />
                              </button>
                              {dropdownOpen === content.id && (
                                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditContent(content);
                                  }}>
                                    <FiEdit2 /> Edit
                                  </button>
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContent(content.id);
                                  }}>
                                    <FiTrash2 /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div 
                            className="box-thumbnail" 
                            onClick={() => handleContentClick(content)}
                            style={{ cursor: 'pointer' }}
                          >
                            {content.thumbnail ? (
                              <img src={content.thumbnail} alt={content.title} />
                            ) : (
                              <div className="thumbnail-placeholder">
                                {getContentTypeIcon(content.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="box-content-info">
                            <div className="content-type-badge">
                              {content.type}
                            </div>
                            
                            <div className="box-link">
                              <button 
                                className="content-url-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContentClick(content);
                                }}
                              >
                                <FiExternalLink /> Open {content.type}
                              </button>
                            </div>
                            
                            {content.description && (
                              <div className="box-description">
                                <p>{content.description}</p>
                              </div>
                            )}
                          </div>
                          
                          {index < courseContents.length - 1 && (
                            <div className="connector-dot"></div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="add-content-box">
                      <button 
                        className="add-content-box-btn" 
                        onClick={toggleAddContentForm}
                        aria-label="Add new content"
                      >
                        <FiPlus />
                        <span>Add Content</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`add-content-container ${isAddingContent ? 'expanded' : ''}`}>
              {isAddingContent ? (
                <div className="add-content-card">
                  <div className="add-content-header">
                    <h3>{editingContent ? 'Edit Content' : 'Add New Content'}</h3>
                    <button 
                      className="close-form-btn"
                      onClick={() => {
                        setIsAddingContent(false);
                        setEditingContent(null);
                        resetContentForm();
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="content-title">Title <span className="required">*</span></label>
                      <input
                        id="content-title"
                        type="text"
                        name="title"
                        value={newContent.title}
                        onChange={handleContentChange}
                        placeholder="Enter content title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="content-type">Type <span className="required">*</span></label>
                      <select
                        id="content-type"
                        name="type"
                        value={newContent.type}
                        onChange={handleContentChange}
                        required
                      >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="content-url">URL <span className="required">*</span></label>
                    <input
                      id="content-url"
                      type="url"
                      name="url"
                      value={newContent.url}
                      onChange={handleContentChange}
                      placeholder="Enter content URL (https://...)"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="content-description">Description</label>
                    <textarea
                      id="content-description"
                      name="description"
                      value={newContent.description}
                      onChange={handleContentChange}
                      placeholder="Enter content description"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-row thumbnail-section">
                    <div className="form-group thumbnail-upload">
                      <label htmlFor="content-thumbnail">Thumbnail</label>
                      <input
                        id="content-thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={thumbnailLoading}
                      />
                      {thumbnailLoading && <div className="loading-indicator">Uploading thumbnail...</div>}
                      <small>Max file size: 2MB. Recommended size: 16:9 aspect ratio.</small>
                    </div>
                    
                    {newContent.thumbnail && (
                      <div className="thumbnail-preview">
                        <img 
                          src={newContent.thumbnail} 
                          alt="Thumbnail preview" 
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => {
                        setIsAddingContent(false);
                        setEditingContent(null);
                        resetContentForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={editingContent ? handleUpdateContent : handleAddContent}
                      className="add-content-btn"
                      disabled={!newContent.title || !newContent.url || thumbnailLoading}
                    >
                      {thumbnailLoading ? 'Loading...' : editingContent ? 'Update Content' : 'Add Content'}
                    </button>
                  </div>
                </div>
              ) : (
                courseContents.length === 0 && (
                  <button 
                    className="add-content-toggle" 
                    onClick={toggleAddContentForm}
                  >
                    <span className="plus-icon">+</span> Add New Content
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {playingContent && (
        <VideoPlayer 
          content={playingContent} 
          onClose={() => setPlayingContent(null)} 
        />
      )}
    </div>
  );
};

export default CourseCreator;