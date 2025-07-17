import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfilePage.css";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://localhost:3001";

const EditProfilePage = () => {
  const { profile, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [previewImage, setPreviewImage] = useState("/default-profile.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data when profile is available
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        bio: profile.bio || "",
      });
      setPreviewImage(
        profile.profilePhoto 
          ? `${BASE_URL}${profile.profilePhoto}`
          : "/default-profile.png"
      );
    }
  }, [profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleImageClick = () => fileInputRef.current.click();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile) return; // Guard clause
    
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("bio", formData.bio);
      if (selectedFile) {
        data.append("profilePhoto", selectedFile);
      }

      const response = await fetch(
        `${BASE_URL}/edit-profile/${profile.username}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: data,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      updateProfile(updatedProfile);
      navigate(`/profile/${profile.username}`);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>; // Or your preferred loading state
  }

  return (
    <div className="edit-profile-page">
      <h1>Edit Profile</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="profile-photo-container">
        <div
          className="profile-photo-preview"
          onClick={handleImageClick}
          style={{
            backgroundImage: `url(${previewImage})`,
            cursor: "pointer",
          }}
        >
          {!profile.profilePhoto && !selectedFile && (
            <span>Click to upload photo</span>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />

        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => navigate(`/profile/${profile.username}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfilePage;