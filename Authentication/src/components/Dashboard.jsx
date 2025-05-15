import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import { AuthContext } from "../context/AuthContext";
import { FiBook, FiPlusCircle, FiTrendingUp, FiAward } from "react-icons/fi";

const Dashboard = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        coursesCreated: 0,
        coursesEnrolled: 0,
        progress: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const response = await fetch("http://localhost:3001/dashboard", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                
                if (!data.user) throw new Error("User data missing");
                
                setUser(data.user);
                setIsLoggedIn(true);
                
                setStats({
                    coursesCreated: 3,
                    coursesEnrolled: 5,
                    progress: 65
                });
                
            } catch (err) {
                console.error("Dashboard fetch failed:", err);
                setError(err.message);
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate, setIsLoggedIn]);

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
                <p style={{ marginTop: '1rem', color: '#2c3e50' }}>Loading your learning dashboard...</p>
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
                    {error.includes("Failed to fetch") 
                        ? "Cannot connect to the server. Please try again later."
                        : "Please login to access your dashboard"}
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
                    onClick={() => navigate("/login")}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar isLoggedIn={!!user} />
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem'
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontWeight: '700',
                        color: '#2c3e50',
                        marginBottom: '0.5rem'
                    }}>
                        Welcome back, {user.username || user.email.split('@')[0]}!
                    </h1>
                    <p style={{
                        color: '#6c757d',
                        fontSize: '1.1rem'
                    }}>
                        Continue your learning journey or create something new
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        borderLeft: '4px solid #3498db'
                    }}>
                        <FiBook size={24} style={{ color: '#3498db' }} />
                        <h3 style={{
                            fontSize: '2rem',
                            margin: '1rem 0',
                            color: '#3498db'
                        }}>{stats.coursesEnrolled}</h3>
                        <p>Courses Enrolled</p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        borderLeft: '4px solid #2ecc71'
                    }}>
                        <FiPlusCircle size={24} style={{ color: '#2ecc71' }} />
                        <h3 style={{
                            fontSize: '2rem',
                            margin: '1rem 0',
                            color: '#2ecc71'
                        }}>{stats.coursesCreated}</h3>
                        <p>Courses Created</p>
                    </div>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease',
                        borderLeft: '4px solid #9b59b6'
                    }}>
                        <FiTrendingUp size={24} style={{ color: '#9b59b6' }} />
                        <h3 style={{
                            fontSize: '2rem',
                            margin: '1rem 0',
                            color: '#9b59b6'
                        }}>{stats.progress}%</h3>
                        <p>Learning Progress</p>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        borderLeft: '4px solid #3498db'
                    }}>
                        <FiPlusCircle size={32} style={{ color: '#3498db', marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Create New Course</h3>
                        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                            Combine videos, articles and resources into a structured learning path
                        </p>
                        <button 
                            style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate("/create-course")}
                        >
                            Get Started
                        </button>
                    </div>

                    <div style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        borderLeft: '4px solid #2ecc71'
                    }}>
                        <FiAward size={32} style={{ color: '#2ecc71', marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Explore Courses</h3>
                        <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
                            Discover knowledge shared by our community of creators
                        </p>
                        <button 
                            style={{
                                backgroundColor: 'transparent',
                                color: '#2ecc71',
                                border: '1px solid #2ecc71',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate("/courses")}
                        >
                            Browse Courses
                        </button>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginTop: '2rem'
                }}>
                    <EditProfile />
                </div>
            </div>
        </>
    );
};

export default Dashboard;