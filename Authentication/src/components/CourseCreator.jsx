import React, { useState, useEffect , useContext } from 'react';
import '../styles/CourseCreator.css'; // Assuming you have a CSS file for styling
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext


const CourseCreator = () => {
  const { user } = useContext(AuthContext); // From your auth provider
  const [courses, setCourses] = useState([
    { id: 1, title: 'Web Development Fundamentals', contents: [] },
    { id: 2, title: 'Graphic Design Basics', contents: [] },
  ]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newContent, setNewContent] = useState({
    title: '',
    type: 'video',
    url: '',
    description: '',
    thumbnail: ''
  });
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveCourse = async () => {
    try {
      if (!user || !user.email) {
        throw new Error('User is not authenticated or email is missing.');
      }
      const response = await fetch('/create-course/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          course: selectedCourse,
          userEmail: user.email  // Get from auth context
        })
      });
  
      if (!response.ok) throw new Error('Failed to save course');
      
      const savedCourse = await response.json();
      
      // Update both courses list AND selected course
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === selectedCourse.id ? { ...savedCourse, id: savedCourse._id } : c
        )
      );
      
      setSelectedCourse({ ...savedCourse, id: savedCourse._id });
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    console.log('User object:', user); // Debugging: Check if user is available
  
    const fetchYouTubeThumbnail = async (url) => {
      try {
        const videoId = getYouTubeId(url);
        if (!videoId) return '';
        
        // Test if thumbnail exists
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        const response = await fetch(thumbnailUrl);
        
        if (response.ok) {
          return thumbnailUrl;
        }
        return '';
      } catch (error) {
        console.error('Error checking YouTube thumbnail:', error);
        return '';
      }
    };
  
    const updateThumbnail = async () => {
      if (newContent.type === 'video' && newContent.url.includes('youtube.com')) {
        setThumbnailLoading(true);
        
        try {
          const thumbnailUrl = await fetchYouTubeThumbnail(newContent.url);
          
          if (isMounted) {
            setNewContent(prev => ({
              ...prev,
              thumbnail: thumbnailUrl
            }));
          }
        } catch (error) {
          console.error('Error processing YouTube URL:', error);
          if (isMounted) {
            setNewContent(prev => ({
              ...prev,
              thumbnail: ''
            }));
          }
        } finally {
          if (isMounted) {
            setThumbnailLoading(false);
          }
        }
      } else if (isMounted) {
        setNewContent(prev => ({
          ...prev,
          thumbnail: ''
        }));
      }
    };
  
    // Debounce the thumbnail fetch to avoid rapid updates
    const debounceTimer = setTimeout(updateThumbnail, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [newContent.url, newContent.type]);

  const handleCreateCourse = () => {
    if (newCourseTitle.trim() === '') return;
    
    const newCourse = {
      id: Date.now(),
      title: newCourseTitle,
      contents: []
    };
    
    setCourses([...courses, newCourse]);
    setSelectedCourse(newCourse);
    setNewCourseTitle('');
  };

  const handleAddContent = () => {
    if (!selectedCourse || !newContent.title.trim()) return;
    
    const updatedCourse = {
      ...selectedCourse,
      contents: [...selectedCourse.contents, {
        id: Date.now(),
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

  return (
    <div className="course-creator-container">
      <div className="sidebar">
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
            </li>
          ))}
        </ul>
      </div>

      <div className="main-content">
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
                <button className="publish-btn">Publish</button>
              </div>
            </div>

            <div className="course-contents">
              {selectedCourse.contents.map(content => (
                <div key={content.id} className="content-card">
                  <div className="content-header">
                    <span className={`content-type ${content.type}`}>
                      {content.type}
                    </span>
                    <h3>{content.title}</h3>
                  </div>
                  {content.description && (
                    <p className="content-description">{content.description}</p>
                  )}
                  {content.url && (
                    <div className="content-preview">
                      {content.type === 'video' && content.thumbnail ? (
                        <img 
                          src={content.thumbnail} 
                          alt="Video thumbnail" 
                          className="video-thumbnail"
                        />
                      ) : content.type === 'article' ? (
                        <div className="article-placeholder">
                          <span>Article: {content.url}</span>
                        </div>
                      ) : (
                        <div className="podcast-placeholder">
                          <span>Podcast: {content.url}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="content-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}

              <div className={`add-content-container ${isAddingContent ? 'expanded' : ''}`}>
                {!isAddingContent ? (
                  <button 
                    className="add-content-toggle"
                    onClick={toggleAddContentForm}
                  >
                    <span className="plus-icon">+</span> Add New Content
                  </button>
                ) : (
                  <div className="add-content-card">
                    <div className="add-content-header">
                      <h3>Add New Content</h3>
                      <button 
                        className="close-form-btn"
                        onClick={toggleAddContentForm}
                      >
                        ×
                      </button>
                    </div>
                    <div className="content-form">
                      <div className="form-group">
                        <label>Content Type</label>
                        <select
                          name="type"
                          value={newContent.type}
                          onChange={handleContentChange}
                          className="content-type-select"
                        >
                          <option value="video">Video</option>
                          <option value="article">Article</option>
                          <option value="podcast">Podcast</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          name="title"
                          placeholder="Content title"
                          value={newContent.title}
                          onChange={handleContentChange}
                          className="content-title-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>URL</label>
                        <input
                          type="text"
                          name="url"
                          placeholder={newContent.type === 'video' ? 'YouTube URL' : 'Content URL'}
                          value={newContent.url}
                          onChange={handleContentChange}
                          className="content-url-input"
                        />
                      </div>
                      
                      {newContent.type === 'video' && newContent.thumbnail && (
                        <div className="form-group">
                          <label>Thumbnail Preview</label>
                          <div className="thumbnail-preview">
                            <img 
                              src={newContent.thumbnail} 
                              alt="Video thumbnail preview" 
                              className="video-thumbnail-preview"
                            />
                            {thumbnailLoading && <div className="thumbnail-loading">Loading...</div>}
                          </div>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Description (optional)</label>
                        <textarea
                          name="description"
                          placeholder="Enter description..."
                          value={newContent.description}
                          onChange={handleContentChange}
                          className="content-description-input"
                          rows="3"
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button 
                          className="cancel-btn"
                          onClick={toggleAddContentForm}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleAddContent}
                          className="add-content-btn"
                          disabled={!newContent.title || !newContent.url || thumbnailLoading}
                        >
                          {thumbnailLoading ? 'Loading...' : 'Add Content'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCreator;