import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiPlus,
  FiSearch,
  FiAlertCircle,
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
      <div className="all-courses-page">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="all-courses-page">
        <div className="error-container">
          <FiAlertCircle className="error-icon" />
          <h2>Error Loading Courses</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!createdCourses.length && !enrolledCourses.length) {
    return (
      <div className="all-courses-page empty-state">
        <h2>You don't have any courses yet!</h2>
        <div className="actions">
          <button
            className="btn-primary"
            onClick={() => navigate("/create-course")}
          >
            <FiPlus /> Create a Course
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/search")}
          >
            <FiSearch /> Search Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="all-courses-page">
      <div className="section">
        <h2>Created Courses</h2>
        {createdCourses.length > 0 ? (
          <div className="courses-grid">
            {createdCourses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't created any courses yet.</p>
        )}
      </div>

      <div className="section">
        <h2>Enrolled Courses</h2>
        {enrolledCourses.length > 0 ? (
          <div className="courses-grid">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
