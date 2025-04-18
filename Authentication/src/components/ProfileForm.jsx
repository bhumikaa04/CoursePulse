import React, { useState } from 'react';
import '../styles/ProfileForm.css';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    bio: '',
    profilePhoto: '',
    followers: '',
    following: '',
    courseCreated: '',
    coursePublished: '',
    courseEnrolled: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add logic to send formData to the server
  };

  return (
    <div className="form-container">
      <h2>Let's Get To Know You!</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

        <label>Middle Name:</label>
        <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} required />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />

        <label>Bio:</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} required></textarea>

        <label>Profile Photo URL:</label>
        <input type="text" name="profilePhoto" value={formData.profilePhoto} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ProfileForm;
