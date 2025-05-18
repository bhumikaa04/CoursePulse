import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { profile: storedProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(storedProfile || {});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/profile/${storedProfile.username}`);
        setProfileData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    if (storedProfile.username) {
      fetchProfile();
    } else {
      setError("Username is not available.");
      setLoading(false);
    }
  }, [storedProfile.username]);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${storedProfile.username}`);
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper">
            <img
              src={`http://localhost:3001${profileData.profilePhoto}` || "https://i.imgur.com/default-profile.jpg"}
              alt={`${profileData.username || "User"}'s profile`}
              className="profile-photo"
              onError={(e) => {
                e.target.src = "https://i.imgur.com/default-profile.jpg";
              }}
            />
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-top-row">
            <h1 className="profile-username">{profileData.username || "No Username"}</h1>
            <button className="edit-profile-button" onClick={handleEditProfile}>
              <FiEdit className="edit-icon" /> Edit Profile
            </button>
          </div>
          
          <h2 className="profile-name">
            {profileData.firstName || "No First Name"} {profileData.lastName || "No Last Name"}
          </h2>
          
          <p className="profile-bio">
            {profileData.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="profile-courses-section">
        <h2 className="courses-section-title">Courses</h2>
        <div className="courses-stats-container">
          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Created</h3>
            <p className="course-stat-value">{profileData.courseCreated || 0}</p>
          </div>
          
          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Published</h3>
            <p className="course-stat-value">{profileData.coursePublished || 0}</p>
          </div>
          
          <div className="course-stat-card">
            <h3 className="course-stat-title">Courses Enrolled</h3>
            <p className="course-stat-value">{profileData.courseEnrolled || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;