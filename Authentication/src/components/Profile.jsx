// profile.jsx
import React from "react";
import "../styles/profile.css";

const Profile = () => {
    const user = {
        name: "John Doe",
        age: 25,
        bio: "I am a software engineer with a passion for teaching.",
        coursesCreated: 5,
        coursesPublished: 3,
    };
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-header">Profile</h2>
        <div className="profile-details">
          <p><span className="detail-label">Name:</span> {user.name}</p>
          <p><span className="detail-label">Age:</span> {user.age}</p>
          <p><span className="detail-label">Bio:</span> {user.bio}</p>
          <p><span className="detail-label">Courses Created:</span> {user.coursesCreated}</p>
          <p><span className="detail-label">Courses Published:</span> {user.coursesPublished}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;