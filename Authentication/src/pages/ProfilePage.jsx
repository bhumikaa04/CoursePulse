import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FiEdit, FiArrowLeft } from "react-icons/fi";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { profile: storedProfile } = useContext(AuthContext);
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/profile/${username}`);
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        const status = err.response?.status || 500;
        setError(status === 404 ? "Profile not found." : "An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    } else {
      setError("Username is not available.");
      setLoading(false);
    }
  }, [username]);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${username}`);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <FiArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Back Arrow */}
      <FiArrowLeft className="back-arrow" onClick={() => navigate(-1)} />

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-photo-container">
          <img
            src={
              profileData.profilePhoto
                ? `http://localhost:3001${profileData.profilePhoto}`
                : "https://i.imgur.com/default-profile.jpg"
            }
            alt={`${profileData.username || "User"}'s profile`}
            className="profile-photo"
            onError={(e) => {
              e.target.src = "https://i.imgur.com/default-profile.jpg";
            }}
          />
        </div>

        <div className="profile-info">
          <div className="profile-top-row">
            <h1 className="profile-username">@{profileData.username || "No Username"}</h1>
            {storedProfile.username === username && (
              <button className="edit-profile-button" onClick={handleEditProfile}>
                <FiEdit className="edit-icon" /> Edit Profile
              </button>
            )}
          </div>
          <h2 className="profile-name">
            {profileData.firstName || "First Name"} {profileData.lastName || "Last Name"}
          </h2>
          <p className="profile-bio">{profileData.bio || "This user hasn't added a bio yet."}</p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="profile-courses-section">
        <h2 className="courses-section-title">Courses</h2>
        <div className="courses-stats-container">
          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Created</h3>
            <p className={`course-stat-value ${profileData.courseCreated > 5 ? "high-stat" : "low-stat"}`}>
              {profileData.courseCreated || 0}
            </p>
          </div>

          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Published</h3>
            <p className={`course-stat-value ${profileData.coursePublished > 5 ? "high-stat" : "low-stat"}`}>
              {profileData.coursePublished || 0}
            </p>
          </div>

          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Enrolled</h3>
            <p className={`course-stat-value ${profileData.courseEnrolled > 5 ? "high-stat" : "low-stat"}`}>
              {profileData.courseEnrolled || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
