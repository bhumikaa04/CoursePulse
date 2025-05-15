// import React, { useState, useEffect , useContext} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import axios from "axios";
// import { FiEdit } from "react-icons/fi";
// import "../styles/ProfilePage.css"; // Import CSS for styling

// const ProfilePage = () => {
//     const { username } = useParams(); // Access the username from URL params
//     const { username: contextUsername } = useContext(AuthContext); // Access username from context

//     // Use either contextUsername or the one from params
//     const displayUsername = username || contextUsername;
//     const navigate = useNavigate();
//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

// useEffect(() => {

//     if (!displayUsername) {
//             setError("Username is not available.");
//             setLoading(false);  // Stop loading if username is not available
//             return;  // Stop further execution
//     }

//     const fetchProfile = async () => {
//         try {
//             console.log("Fetching profile for username:", displayUsername);
//             const response = await axios.get(`http://localhost:3001/profile/${displayUsername}`);
//             console.log("Profile data fetched:", response.data);
//             setProfileData(response.data);
//         } catch (err) {
//             console.error("Error fetching profile:", err);
//             setError(err.response?.data?.message || "An unexpected error occurred.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (username) {
//         fetchProfile();
//     } else {
//         console.error("Username is undefined");
//     }
// }, [username]);


//     const handleEditProfile = () => {
//         navigate(`/edit-profile/${displayUsername}`);
//     };

//     if (loading) {
//         return <p>Loading profile...</p>;
//     }

//     if (error) {
//         return <p className="error-message">{error}</p>;
//     }

//     return (
//         // <div className="profile-page">
//         //     <div className="profile-header">
//         //         <div className="profile-photo-container">
//         //             <img
//         //                 src={profileData.profilePhoto}
//         //                 alt={`${profileData.username}'s profile`}
//         //                 className="profile-photo"
//         //             />
//         //         </div>
//         //         <div className="profile-info">
//         //             <div className="profile-top">
//         //                 <h1>{profileData.username}</h1>
//         //                 <button className="edit-button" onClick={handleEditProfile}>
//         //                     <FiEdit /> Edit Profile
//         //                 </button>
//         //             </div>
//         //             <p className="profile-bio">{profileData.bio || "No bio available"}</p>
//         //             <div className="profile-stats">
//         //                 <span><strong>{profileData.followers || 0}</strong> Followers</span>
//         //                 <span><strong>{profileData.following || 0}</strong> Following</span>
//         //                 <span><strong>{profileData.courseCreated || 0}</strong> Courses</span>
//         //             </div>
//         //         </div>
//         //     </div>
//         //     <div className="profile-content">
//         //         <h2>Courses</h2>
//         //         <div className="courses-grid">
//         //             <div className="course-card">
//         //                 <h3>Courses Created</h3>
//         //                 <p>{profileData.courseCreated || 0}</p>
//         //             </div>
//         //             <div className="course-card">
//         //                 <h3>Courses Published</h3>
//         //                 <p>{profileData.coursePublished || 0}</p>
//         //             </div>
//         //             <div className="course-card">
//         //                 <h3>Courses Enrolled</h3>
//         //                 <p>{profileData.courseEnrolled || 0}</p>
//         //             </div>
//         //         </div>
//         //     </div>
//         // </div>

//         <>
//         <h1>
//             {profileData.username}'s Profile
//             <button className="edit-button" onClick={handleEditProfile}>
//                 <FiEdit /> Edit Profile
//             </button>
//         </h1>
//         </>
//     );
//};

// export default ProfilePage;
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function ProfilePage() {
    const { username } = useParams(); // Extract username from URL
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            
            if (!username) {
                setError("Username is missing. Redirecting...");
                setTimeout(() => navigate("/"), 3000);
                return;
            }

            if (!token) {
                setError("You need to login first. Redirecting...");
                setTimeout(() => navigate("/login"), 3000);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3001/profile/${username}`, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.data) {
                    throw new Error("Profile data not found");
                }

                setProfileData(response.data);
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(err.response?.data?.message || "Failed to load profile");
                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, navigate, setIsLoggedIn]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '0.25rem solid #3498db',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '1rem', color: '#2c3e50' }}>Loading profile data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 1rem'
            }}>
                <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '0.25rem',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
                <button 
                    style={{
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate("/")}
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
                marginBottom: '2rem'
            }}>
                <h1 style={{
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {profileData?.username || username}'s Profile
                </h1>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h3 style={{
                            color: '#6c757d',
                            marginBottom: '0.5rem'
                        }}>Basic Information</h3>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '0.25rem'
                        }}>
                            <p><strong>First Name:</strong> {profileData?.firstName || 'Not specified'}</p>
                            <p><strong>Last Name:</strong> {profileData?.lastName || 'Not specified'}</p>
                            <p><strong>Age:</strong> {profileData?.age || 'Not specified'}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style={{
                            color: '#6c757d',
                            marginBottom: '0.5rem'
                        }}>Bio</h3>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            minHeight: '100%'
                        }}>
                            <p>{profileData?.bio || 'No bio available'}</p>
                        </div>
                    </div>
                </div>
                
                <div style={{
                    marginTop: '2rem'
                }}>
                    <h3 style={{
                        color: '#6c757d',
                        marginBottom: '0.5rem'
                    }}>Activity Stats</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{
                            backgroundColor: '#e9f7fe',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#3498db',
                                margin: '0.5rem 0'
                            }}>{profileData?.followers || 0}</p>
                            <p>Followers</p>
                        </div>
                        <div style={{
                            backgroundColor: '#e8f5e9',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#2ecc71',
                                margin: '0.5rem 0'
                            }}>{profileData?.following || 0}</p>
                            <p>Following</p>
                        </div>
                        <div style={{
                            backgroundColor: '#f3e5f5',
                            padding: '1rem',
                            borderRadius: '0.25rem',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#9b59b6',
                                margin: '0.5rem 0'
                            }}>{profileData?.courseEnrolled || 0}</p>
                            <p>Courses Enrolled</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;


// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// function ProfilePage() {
//     const { username } = useParams();
//     const [profileData, setProfileData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`http://localhost:3001/profile/${username}`);
//                 setProfileData(response.data);
//             } catch (err) {
//                 setError(err.response?.data?.message || "Failed to fetch profile");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (username) {
//             fetchProfile();
//         }
//     }, [username]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div>
//             <h1>{username}'s Profile</h1>
//             <div>
//                 <h2>Basic Information</h2>
//                 <p><strong>First Name:</strong> {profileData.firstName}</p>
//                 <p><strong>Last Name:</strong> {profileData.lastName}</p>
//                 <p><strong>Age:</strong> {profileData.age}</p>
//             </div>
//         </div>
//     );
// }

// export default ProfilePage;

// import React, { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const profilePage = () => {
//     const { userDetails } = useContext(AuthContext);

//     return (
//         <div>
//             <h1>Welcome, {userDetails?.username}!</h1>
//             <p>Email: {userDetails?.email}</p>
//             {/* Add more user details if needed */}
//         </div>
//     );
// };

// export default profilePage;
