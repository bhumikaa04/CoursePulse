import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css"; // Optional: Add custom CSS for styling

const ProfilePage = () => {
    const { username } = useParams(); // Get username from the route params
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch profile data
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/profile/${username}`);
                setProfileData(response.data);
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={profileData.profilePhoto}
                    alt={`${profileData.username}'s profile`}
                    className="profile-photo"
                />
                <h1>{profileData.username}</h1>
                <p>{profileData.bio}</p>
            </div>
            <div className="profile-details">
                <h2>Details</h2>
                <p><strong>First Name:</strong> {profileData.firstName}</p>
                <p><strong>Middle Name:</strong> {profileData.middleName || "N/A"}</p>
                <p><strong>Last Name:</strong> {profileData.lastName || "N/A"}</p>
                <p><strong>Age:</strong> {profileData.age}</p>
                <p><strong>Followers:</strong> {profileData.followers}</p>
                <p><strong>Following:</strong> {profileData.following}</p>
            </div>
            <div className="profile-courses">
                <h2>Courses</h2>
                <p><strong>Courses Created:</strong> {profileData.courseCreated}</p>
                <p><strong>Courses Published:</strong> {profileData.coursePublished}</p>
                <p><strong>Courses Enrolled:</strong> {profileData.courseEnrolled}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
