import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  FiPlus, 
  FiRefreshCw, 
  FiArrowRight, 
  FiBook, 
  FiCalendar, 
  FiTag,
  FiAlertCircle
} from "react-icons/fi";
import "../styles/MyCourses.css";

const MyCourses = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/my-created-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        setCourses(data.courses || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [setIsLoggedIn, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="my-courses">
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="loader-text">Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="my-courses">
        <div className="error-container">
          <FiAlertCircle className="error-icon" />
          <h2>Failed to load courses</h2>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!courses.length) {
    return (
      <div className="my-courses">
        <div className="empty-container">
          <h2>You haven't made any courses yet! 😞</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate("/create-course")}
          >
            <FiPlus /> Create Your First Course
          </button>
        </div>
      </div>
    );
  }

  // Courses list
  return (
    <div className="my-courses">
      <div className="courses-header">
        <div>
          <h1>My Created Courses</h1>
          <p>Manage and share your teaching materials</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate("/create-course")}
        >
          <FiPlus /> Create New Course
        </button>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="course-card"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <div className="course-card-top">
              <div className="course-category">
                <FiTag /> {course.category}
              </div>
              <h3>{course.title}</h3>
              <p className="course-description">{course.description}</p>
            </div>
            
            <div className="course-card-bottom">
              <div className="course-date">
                <FiCalendar /> {new Date(course.createdAt).toLocaleDateString()}
              </div>
              <button className="btn-secondary">
                View Details <FiArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
