import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileFormButton.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/profileForm");
  };

  return (
    <button className="profile-button" onClick={handleClick}>
      Edit Profile
    </button>
  );
};

export default EditProfile;
