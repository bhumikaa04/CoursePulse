import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiPlus,
  FiSearch,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowRight,
  FiCalendar,
  FiTag
} from "react-icons/fi";
import "../styles/AllCoursesPage.css";

const AllCoursesPage = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [createdCourses, setCreatedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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
        const response = await fetch("http://localhost:3001/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();

        setCreatedCourses(data.createdCourses || []);
        setEnrolledCourses(data.enrolledCourses || []);
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
  if (!createdCourses.length && !enrolledCourses.length) {
    return (
      <div className="my-courses">
        <div className="empty-container">
          <h2>You don't have any courses yet! 😞</h2>
          <div className="actions">
            <button 
              className="btn-primary"
              onClick={() => navigate("/create-course")}
            >
              <FiPlus /> Create Your First Course
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/search")}
            >
              <FiSearch /> Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="courses-header">
        <div>
          <h1>My Courses</h1>
          <p>Manage your learning and teaching materials</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigate("/create-course")}
          >
            <FiPlus /> Create New Course
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/search")}
          >
            <FiSearch /> Browse Courses
          </button>
        </div>
      </div>

      {createdCourses.length > 0 && (
        <div className="section">
          <h2 className="section-title">Created Courses</h2>
          <div className="courses-grid">
            {createdCourses.map((course) => (
              <div 
                key={course.id} 
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="course-card-top">
                  <div className="course-category">
                    <FiTag /> {course.category || "Uncategorized"}
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
      )}

      {enrolledCourses.length > 0 && (
        <div className="section">
          <h2 className="section-title">Enrolled Courses</h2>
          <div className="courses-grid">
            {enrolledCourses.map((course) => (
              <div 
                key={course.id} 
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="course-card-top">
                  <div className="course-category">
                    <FiTag /> {course.category || "Uncategorized"}
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
      )}
    </div>
  );
};

export default AllCoursesPage;