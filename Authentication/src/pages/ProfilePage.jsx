import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import "../styles/ProfilePage.css"; // Import CSS for styling

const ProfilePage = () => {
  const {  profile: storedProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(storedProfile || {});

  useEffect(() => {
    console.log("storedProfile", storedProfile);

    console.log("image", profileData.profilePhoto);
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-photo-container">
          <div className="profile-photo-wrapper">
            <img
              src={`http://localhost:3001${profileData.profilePhoto}` || "https://i.imgur.com/default-profile.jpg"}
              alt={`${profileData.username || "User"}'s profile`}
              className="profile-photo"
            />
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-top">
            <h1>{profileData.username || "No Username"}</h1>
            <button className="edit-button" onClick={handleEditProfile}>
              <FiEdit /> Edit Profile
            </button>
          </div>
          <h2>{profileData.firstName || "No First Name"} {profileData.lastName || "No Last Name"}</h2>
          <p className="profile-bio">{profileData.bio || "No bio available."}</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <h2>Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <h3>Courses Created</h3>
            <p>{profileData.courseCreated || 0}</p>
          </div>
          <div className="course-card">
            <h3>Courses Published</h3>
            <p>{profileData.coursePublished || 0}</p>
          </div>
          <div className="course-card">
            <h3>Courses Enrolled</h3>
            <p>{profileData.courseEnrolled || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
