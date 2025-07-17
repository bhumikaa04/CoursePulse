import React, { useState , useEffect, useContext } from 'react';
import Sidebar from "../components/sidebar";
import { FiBook, FiPlusCircle, FiChevronRight, FiArrowLeft, FiPlus, FiArrowRight } from 'react-icons/fi';
import '../styles/NewCourse.css';
import { AuthContext } from '../context/AuthContext';
import { useNavigate  , Link} from "react-router-dom";
import { useNotification } from '../context/NotificationContext';

//a function is created 
const NewCourse = () => {
  //useState creation 
  const {profile , setIsLoggedIn} = useContext(AuthContext); 
  const [user, setUser] = useState(null);
  const [error , setError] = useState(null); 
  const [courses , setCourses] = useState([]); 
  const [loading , setLoading] = useState(true); 
  const [newTitle , setNewTitle] = useState(''); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    coursesCreated: 0,
    coursesEnrolled: 0,
    completionRate: 0,
    learningStreak: 0,
    hoursLearned: 0,
  });

  const navigate = useNavigate(); 
  const showNotification = useNotification(); 

  useEffect(() => {
    console.log('profile in the tab: ' , profile); 
    const tabData = async() => {
      const token = localStorage.getItem("token"); 
      if(!token){
        setIsLoggedIn(false); 
        navigate("/login"); 
        return; 
      }

      //try and catch
      try{
        setLoading(true); 
        
        const response = await fetch("http://localhost:3001/course" , {
          headers: { 
            Authorization : `Bearer ${token}`
          }, 
        });

        if (!response.ok){
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!data.user) throw new Error("User data missing");

        console.log(data.createdCourses);
        if (data.createdCourses) {
          setCourses(data.createdCourses);
        } else if (data.createdCourses) {
          // If backend returns createdCourses, fetch their full details
          const coursesDetails = await Promise.all(
            data.createdCourses.map(_id => 
              fetch(`http://localhost:3001/course/${_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              }).then(res => res.json())
            )
          );
          setCourses(coursesDetails);
        }
        setIsLoggedIn(true); 
        //ternary operator 
        const completionRate =
              data.coursesEnrolled > 0
        ? Math.round((data.completedCourses / data.coursesEnrolled) * 100)
        : 0;

        // Delay setting stats to allow for animation
        setTimeout(() => {
          setStats({
            coursesCreated: profile?.coursesCreated || 0,
            coursesEnrolled: data.coursesEnrolled || 0,
            completionRate,
            learningStreak: data.learningStreak || 0,
            hoursLearned: data.hoursLearned || 0,
          });
          setLoading(false);
        }, 500);
      }catch (err){
        console.error("Dashboard fetch failed:", err);
        setError(err.message);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setLoading(false);
      }finally {
        setLoading(false); 
      }
    }

    tabData(); 
  }, [navigate, setIsLoggedIn, profile]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //Loading state 
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Preparing your Tab...</p>
      </div>
    );
  }

  //Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3>Oops! Something went wrong</h3>
          <p>
            {error.includes("Failed to fetch")
              ? "We couldn't connect to our servers. Please check your internet connection."
              : "Please login to access your dashboard"}
          </p>
          <div className="error-actions">
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
            <button
              className="btn-secondary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  //function to generate slug
  const generateSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, "-");
  };

  const handleTitleChange= (e) => {
    setNewTitle(e.target.value); 
  }

  const handleCreateCourse = async() => {
    if (!newTitle.trim()) {
      showNotification("Title cannot be empty!" , 'error')
      return;
    }

    setLoading(true); 

    try{
      const userStr = localStorage.getItem('user'); 
      let ownerEmail = null;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          ownerEmail = user.email;
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      }

      if (!ownerEmail) {
        showNotification("User email not found. Please log in.", 'error');
        setLoading(false);
        return;
      } 

      const username = localStorage.getItem('username'); 

      console.log("username : " + username); 
      console.log("ownerEmail : " + ownerEmail); 
      console.log("newTitle : " + newTitle); 
      const responseData = await fetch('http://localhost:3001/course/addCourse' , {
        method : 'POST' , 
        headers : {
          "Content-Type": "application/json",
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }, 
        body : JSON.stringify({
          title : newTitle , 
          ownerEmail : ownerEmail, 
          username : username , 
        })
      }); 

      if(responseData.ok){
        const newCourse = await responseData.json();
        setCourses(prevCourses => [...prevCourses, newCourse.course]);
        showNotification('Course created successfully!' , 'success');
        setNewTitle(''); 
        navigate(`/course/${newCourse.course._id.toString()}/${generateSlug(newCourse.course.title)}`);
      }
    }catch(err){
      console.error('Error creating course:', err);
      showNotification('An unexpected error occurred. Please try again.' , 'error');
    }finally{
      setLoading(false); 
    }
  }

  //return function The main render 
  
  return(
    <div>
      <div className='main-container'>
        {/*sidebar */}
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          profile={profile}
          user={user}
          setIsLoggedIn={setIsLoggedIn}
          stats={stats}
        />

        {/* main-content */}
        <main className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
          <div className="welcome-banner">
            <h1>Create your own course, {profile.username}!</h1>
            <p>Build and share your knowledge with others</p>
          </div>

          <div className="course-section">
            <div className="create-course-form">
              <h3>Create New Course</h3>
              <input type="text" placeholder="Enter course title" onChange={handleTitleChange} />
              <button onClick={handleCreateCourse}><FiPlus /> Create Course!</button>
            </div>

            <div className="your-courses">
              <h3>Your Courses</h3>
              <div className="courses-container">
                {courses
                  .filter(course => course && course.title && course._id) // ✅ skip invalid ones
                  .map((course) => (
                    <div 
                      key={course._id} 
                      className="course-card"
                      onClick={() => navigate(`/course/${course._id}/${generateSlug(course.title)}`, { state: { user } })}
                    >
                      <FiBook className="course-icon" />
                      <div className="course-info">
                        <h4>{course.title}</h4>
                        <div className='course-details'>
                          <p>{course.contents?.length || 0} contents</p>
                          <span className={`status ${course.published ? 'published' : 'draft'}`}>
                            {course.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <FiArrowRight className="arrow-icon" />
                    </div>
                ))}

              </div>
            </div>
          </div>
              
          <div className="course-tips">
            <h3>Course Creation Tips</h3>
            <div className="tips-container">
              <div className="tip tip-blue">
                <h4>Diverse Content</h4>
                <p>Mix videos, articles, and other content types to create an engaging learning experience.</p>
              </div>
              <div className="tip tip-green">
                <h4>Clear Structure</h4>
                <p>Organize your content in a logical sequence from basic to advanced concepts.</p>
              </div>
              <div className="tip tip-purple">
                <h4>Quality Thumbnails</h4>
                <p>Use high-quality thumbnails to make your course content visually appealing.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default NewCourse;
