import { useEffect, useContext, useState } from "react";
import Sidebar from "./sidebar";
import '../styles/newCourse.css';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from "../context/NotificationContext";
import { useNavigate, useParams, useLocation, data } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUpload, FiEdit, FiTrash2, FiPlus , FiBook, FiMoreVertical } from 'react-icons/fi';
import ContentForm from "./ContentForm";
import PreviewComponent from "./PreviewComponent";
import EditComponent from "./EditComponent";
import ViewComponent from "./ViewComponent";

const CourseComponent = () => {
    const { profile, setIsLoggedIn, userDetails } = useContext(AuthContext);
    const { id , title} = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const showNotification = useNotification(); 

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('contents');
    const [showDropdown, setShowDropdown] = useState(null);
    const [courseTitle , setCourseTitle] = useState('') ; 
    const [courseDescription , setCourseDescription] = useState('') ; 
    const [showModal, setShowModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [selectedContentItem, setSelectedContentItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [contentItemToEdit, setContentItemToEdit] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [contentItemToView, setContentItemToView] = useState(null);

useEffect(() => {
    const fetchCourseData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/course/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            //console.log("data from backend :", data); 
            setCourse(data);
        } catch (err) {
            console.error("Course fetch failed:", err);
            setError(err.message);
            showNotification(err.message || "Failed to load course", "error");
            
            // Redirect if unauthorized
            if (err.message.includes('403')) {
                navigate(-1);
            }
        }finally{
            setLoading(false); 
        }
    };
    fetchCourseData();
}, [id, navigate, showNotification]); // Add all dependencies
    

    useEffect(() => {
      if (activeTab === 'settings') {
        window.scrollTo(0, 0);
      }
    }, [activeTab , showDropdown ]);

    useEffect(()=> {
        if(course){
            setCourseTitle(course.title || ''); 
            setCourseDescription(course.description || ''); 
        }
    } , [course]); 

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Preparing your Tab...</p>
            </div>
        );
    }

    if (error) return <div>Error: {error}</div>;
    if (!course) return <div>Course not found</div>;


    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleDropdown = (index) => {
        setShowDropdown(showDropdown === index ? null : index);
    };

    const handleSaveCourse = async (e) => {
    e.preventDefault();

    console.log("handleSaveCourse called!"); 

    try {
        const updatedCourse = {
            ...course, // Ensure 'course' state is up-to-date here
            title: courseTitle,
            description: courseDescription,
        };
        console.log("Sending updatedCourse object:", updatedCourse);

        const response = await fetch(`http://localhost:3001/course/${id}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ course: updatedCourse }),
        });

        //console.log("Response received. Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Save failed raw text response:', errorText);
            // Attempt to parse as JSON for better error messages if it's actually JSON
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.error || 'Failed to save course');
            } catch (jsonParseError) {
                // If it's not JSON, just use the raw text
                throw new Error(errorText || 'Failed to save course (non-JSON error)');
            }
        }

        const data = await response.json();
        console.log('Course saved successfully (data from server):', data.course);
        showNotification('Course saved successfully!', 'success');
        setCourse(data.course); // Update the course state with the latest data from the server

    } catch (err) {
        console.error('Save course error (client-side catch):', err);
        showNotification(`Error saving course: ${err.message}`, 'error');
    }
};

    const handlePublish = async(e) => {
        try{
            console.log("togglePublish!"); 
            const response = await fetch(`http://localhost:3001/course/${id}/publish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to toggle publish status');
        }
    
        const data = await response.json(); 

        // Update the course state with the new published status
        setCourse(prevCourse => ({
          ...prevCourse,
          published: !prevCourse.published
        }));

        showNotification(data.message, 'success');
        }catch(err){
            console.error('Publish toggle error:', err);
            showNotification(`Error: ${err.message}`, 'error');
        }
    }; 

    const deleteCourse = async(e) => {
        if(!window.confirm(`Are you sure you want to delete "${courseTitle}" ? This action cannot be undone.`)){
            return ; 
            //the person says no!
        }
        //the person says yes!!
        setLoading(true)
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No authentication token found.");
            }

            const response = await fetch(`http://localhost:3001/course/${id}/delete` , {
                method: 'DELETE', // Use DELETE HTTP method
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }); 
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
            }

            // If successful, the backend might send a success message or just a 204 No Content
            const result = await response.json().catch(() => ({ message: 'Course deleted successfully.' })); // Try to parse, fallback if no content

            showNotification(result.message || 'Course deleted successfully!', 'success');
            navigate('/course'); // Redirect to coursePage or courses list after deletion
        }catch(err){
            console.error('Delete course error:', err);
            showNotification(`Error deleting course: ${err.message}`, 'error');
        }finally{
            setLoading(false); 
        }
    }

    const handleContentSubmit = (data) => {
        console.log("Submitted data:", data);
        // You can send it to backend here
    };

    const handleDeleteContent = async(contentIndex) => {
        if(!window.confirm("Are you sure you want to delete this content?")){
            //the user says no
            return; 
        }
        //the user says yes. 
        try{
            //response 
            const response = await fetch(`http://localhost:3001/course/${id}/${contentIndex}` , {
                method : 'DELETE', 
                headers : {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }, 
            })
            //!response.ok
            if(!response.ok){
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
            }
            //update the local state to delete the content
                setCourse(prevCourse => {
                 const updatedContents = [...prevCourse.contents];
                 updatedContents.splice(contentIndex, 1);
                 return {
                   ...prevCourse,
                   contents: updatedContents
                 };
                }); 
            //show notification 
            showNotification("Content Deleted!" , 'success'); 
        }catch(err){
            console.error("Delete content error:", err);
            showNotification(err.message || "Failed to delete content", "error");
        }finally{
            setShowDropdown(null); 
        }
    }

    const handlePreviewItem = (item) => {
        console.log("clicked!!"); 
        setSelectedContentItem(item);
        setShowPreviewModal(true);
    };

    const handleClosePreviewModal = () => {
        setShowPreviewModal(false);
        setSelectedContentItem(null);
    };

    const handleViewContentFromPreview = () => {
        console.log('Navigating to view content:', selectedContentItem);
        handleClosePreviewModal();
    };

    const handleEditItem = (item) => {
        setContentItemToEdit(item);
        setShowEditModal(true);
        setShowDropdown(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setContentItemToEdit(null);
    };

    const handleSaveEditedContent = async (formData) => {
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      try {
        const response = await fetch(
          `http://localhost:3001/course/${id}/${formData.get('contentId')}`,
          {
            method: 'PUT',
            headers: {
              // Do NOT set 'Content-Type' manually for FormData
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          }
        );
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
        }
    
        const updatedContent = await response.json();
        console.log("Updated content from server:", updatedContent); // ✅
    
        showNotification('Content updated successfully!', 'success');
    
        // ✅ Update the state immutably to reflect UI changes
        setCourse((prevCourse) => {
          const updatedContents = prevCourse.contents.map((item) =>
            item._id === updatedContent._id ? { ...updatedContent } : item
          );
          return { ...prevCourse, contents: [...updatedContents] };
        });
    
        handleCloseEditModal(); // ✅ Close modal after update
      } catch (err) {
        console.error('Error saving edited content:', err);
        showNotification(`Error saving content: ${err.message}`, 'error');
      }
    };
    
    const handleViewComponent = async(item) => {
        console.log("Viewing item:", item);
        setContentItemToView(item);
        setShowViewModal(true);
    }

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setContentItemToView(null);
    };

    return (
        <div className="main-container">
            <Sidebar
                sidebarCollapsed={sidebarCollapsed}
                toggleSidebar={toggleSidebar}
                profile={profile}
                user={userDetails}
                setIsLoggedIn={setIsLoggedIn}
            />

            {showModal && (
                <ContentForm
                  onClose={() => setShowModal(false)}
                  onSubmit={handleContentSubmit}
                  courseId = {id}
                />
            )}

            {showEditModal && contentItemToEdit && (
                <EditComponent
                    contentItem={contentItemToEdit}
                    onSave={handleSaveEditedContent}
                    onCancel={handleCloseEditModal}
                />
            )}

            {showPreviewModal && (
                <PreviewComponent
                    contentItem={selectedContentItem} // Pass the content item to the modal
                    onViewContent={handleViewContentFromPreview}
                    onCancel={handleClosePreviewModal}
                />
            )}

            {showViewModal && contentItemToView && (
                <ViewComponent
                    contentItem={contentItemToView}
                    onClose={handleCloseViewModal}
                    
                />
            )}

            <main className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
                {/* Welcome Banner */}
                <div className="welcome-banner">
                    <h1>Create your own course, {profile.username}!</h1>
                    <p>Build and share your knowledge with others</p>
                </div>

                {/* Back Button */}
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Go Back To Courses
                </button>

                {/* Course Header */}
                <div className="course-header">
                    <div className="course-info">
                        <h2>{course.title}</h2>
                        <h4><span>{course.description}</span></h4>
                        <div className="course-meta">
                            <span>{course.contents?.length || 0} contents</span>
                            <span className={`status ${course.published ? 'published' : 'draft'}`}>
                                {course.published ? 'Published' : 'Draft'}
                            </span>
                        </div>
                    </div>
                    <div className="course-actions">
                        <button className="btn-save" onClick={handleSaveCourse} >
                            <FiSave /> Save
                        </button>
                        <button className="btn-delete" onClick={deleteCourse}>
                            Delete
                        </button>
                        <button className="btn-publish" onClick={handlePublish}>
                            <FiUpload /> {course.published ? 'Unpublish' : 'Publish'}
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="course-tabs">
                    <button className={activeTab === 'contents' ? 'active' : ''} onClick={() => setActiveTab('contents')}>
                        Course Contents
                    </button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                        Course Settings
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'contents' ? (
                <div className="contents-section">
                  {/* Conditional rendering for "No Contents" message */}
                  {(course.contents && course.contents.length > 0) ? (
                    (course.contents || []).map((item , index) => (
                      <div key={item._id?.toString() || index} className="content-item"> {/* Use item._id for key if available */}
                        <div className="content-thumbnail">
                          <img src={item.thumbnail && item.thumbnail.startsWith('/') ? `http://localhost:3001${item.thumbnail}` : item.thumbnail} alt={item.name} />
                        </div>
                        <div className="content-details">
                          <h3>{item.title}</h3>
                          <h4>{item.name}</h4>
                          <span className="content-type">{item.type}</span>
                          <div className="content-actions">
                            <button className="btn-view" onClick={()=> handleViewComponent(item)}>View Item</button>
                            <button
                            className="btn-preview"
                            onClick={() => handlePreviewItem(item)}
                            >
                              Preview Item
                            </button>
                          </div>
                        </div>
                        <div className="content-more">
                          <button
                          className="content-more-icon"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            toggleDropdown(index);
                          }}>
                              <FiMoreVertical />
                          </button>
                          {showDropdown === index && (
                              <div className="dropdown-menu">
                                  <button onClick={() => handleEditItem(item)}><FiEdit /> Edit</button>
                                  <button onClick={() => handleDeleteContent(index)}><FiTrash2 /> Delete</button>
                              </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-contents-message">
                      <p>You have No Contents in here!!</p>
                      <button className="btn-blue" onClick={() => setShowModal(true)}>
                        <FiPlus /> Add Content Now!
                      </button>
                    </div>
                  )}
                </div>
                    ) : (
                        <div className="settings-section">
                            <form onSubmit={handleSaveCourse}>
                                <div className="form-group">
                                    <label>Course Name</label>
                                    <input 
                                        type="text" 
                                        value={courseTitle}
                                        onChange={(e) => setCourseTitle(e.target.value)}  />
                                </div>
                                <div className="form-group">
                                    <label>Course Description</label>
                                    <textarea 
                                        value={courseDescription} 
                                        onChange={(e) => setCourseDescription(e.target.value)} 
                                        rows="5" />
                                </div>
                                <button type="submit" className="btn-save">
                                    <FiSave /> Save Settings
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer Sections */}
                <div className="course-footer">
                    {/* Course Stats */}
                    <div className="course-stats">
                        <h3>Course Stats</h3>
                        <div className="stats-grid">
                            <div>
                                <h4>Content Items</h4>
                                <p>{course.contents?.length || 0}</p>
                            </div>
                            <div>
                                <h4>Status</h4>
                                <p className={`status ${course.published ? 'published' : 'draft'}`}>
                                    {course.published ? 'Published' : 'Draft'}
                                </p>
                            </div>
                            <div>
                                <h4>Last Updated</h4>
                                <p>{new Date(course.updatedAt).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric'
                                    }).replace(/\//g, '-')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                        {/* The button to open the modal */}
                            <button className="btn-blue" onClick={() => setShowModal(true)}>
                                <FiPlus /> Add Content
                            </button>
                            {/* The ContentForm component, rendered conditionally */}
                            {showModal && (
                                <ContentForm
                                    onClose={() => setShowModal(false)} // Function to close the modal
                                    onSubmit={handleContentSubmit} // Function to handle submitted data
                                    courseId= {id} 
                                />
                            )}
                            <button className="btn-green" onClick={() => setActiveTab('settings')}>
                                <FiEdit /> Edit Settings
                            </button>
                            <button className="btn-purple" onClick={() => navigate(-1)} >
                                <FiBook /> New Course
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseComponent;
