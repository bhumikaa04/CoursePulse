import React, { useEffect, useState, useContext } from "react";
import { useNavigate  , Link} from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../context/AuthContext";
import {
  FiBook,
  FiPlusCircle,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiBarChart2,
  FiUsers,
  FiBookmark,
  FiCheckCircle,
  FiStar,
  FiCalendar,
  FiChevronRight,
  FiArrowRight,
  FiRefreshCw,
  FiSearch, 
  FiMenu, 
  FiUser, 
  FiLogOut
} from "react-icons/fi";
import CourseProgressChart from "./CourseProgressChart";
import RecentActivity from "./RecentActivity";
import RecommendedCourses from "./RecommendedCourses";
import StatCard from "./StatCard";
import "../styles/Dashboard.css"; // Import CSS for styling
import LogoutButton from "./Logout";

const Dashboard = () => {
  const { profile, updateProfile, setIsLoggedIn , username} = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    coursesCreated: 0,
    coursesEnrolled: 0,
    completionRate: 0,
    learningStreak: 0,
    hoursLearned: 0,
  });
  const [activeTab, setActiveTab] = useState("week");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimateStats(true);
  }, []);

  useEffect(() => {

    console.log('profile in Dashboard: ' , profile); 

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

        const completionRate =
          data.coursesEnrolled > 0
            ? Math.round((data.completedCourses / data.coursesEnrolled) * 100)
            : 0;

        // Delay setting stats to allow for animation
        setTimeout(() => {
          setStats({
            coursesCreated: profile?.coursesCreated || 0,
            coursesEnrolled: data.coursesEnrolled || 0,
            completionRate,
            learningStreak: data.learningStreak || 0,
            hoursLearned: data.hoursLearned || 0,
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError(err.message);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, setIsLoggedIn, profile]);

  const handleRefresh = () => {
    setLoading(true);
    setAnimateStats(false);
    setTimeout(() => {
      setAnimateStats(true);
      // Re-fetch data would go here in a real implementation
      setLoading(false);
    }, 600);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading && !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Preparing your learning dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h3>Oops! Something went wrong</h3>
          <p>
            {error.includes("Failed to fetch")
              ? "We couldn't connect to our servers. Please check your internet connection."
              : "Please login to access your dashboard"}
          </p>
          <div className="error-actions">
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
            <button
              className="btn-secondary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar isLoggedIn={!!user} />
      
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar}>
            <FiMenu />
          </div>
          
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="user-avatar">
              {profile?.profilePhoto ? (
                <img 
                  src={`http://localhost:3001${profile.profilePhoto}`} 
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = '/default-profile.jpg';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <span>{user?.username?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <h3>{profile.username || user?.username || user?.email?.split("@")[0]}</h3>
                <p>Learner</p>
              </div>
            )}
          </div>
        </div>
          
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <a href="/dashboard">
                  <FiBarChart2 />
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </a>
              </li>
              <li>
                <a href="/my-courses">
                  <FiBook />
                  {!sidebarCollapsed && <span>My Courses</span>}
                </a>
              </li>
              <li>
                <Link 
                   to="/create-course" >
                  <FiPlusCircle />
                  {!sidebarCollapsed && <span>Create Courses</span>}
                </Link>
              </li>
              <li>
                <a href="/progress">
                  <FiTrendingUp />
                  {!sidebarCollapsed && <span>Progress</span>}
                </a>
              </li>
              <li>
                <a href="/search">
                  <FiSearch />
                  {!sidebarCollapsed && <span> Search </span>}
                </a>
              </li>
              <li>
                <a href="/achievements">
                  <FiAward />
                  {!sidebarCollapsed && <span>Achievements</span>}
                </a>
              </li>
              <li>
                <Link to={`/profile/${username}`}>
                  <FiUser />
                  {!sidebarCollapsed && <span>Profile</span>}
                </Link>
              </li>
              {/* <li className="sidebar-list-item">
                <LogoutButton sidebarCollapsed={sidebarCollapsed} />
              </li> */}
            </ul>
          </nav>
          
          {!sidebarCollapsed && (
            <div className="sidebar-footer">
              <p>Learning streak: {stats.learningStreak} days</p>
              <div className="streak-progress">
                <div 
                  className="streak-progress-bar" 
                  style={{ width: `${Math.min(stats.learningStreak * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </aside>

        <main className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
          {/* Header Section */}
          <header className="dashboard-header">
            <div className="header-content">
              <h1>Learning Dashboard</h1>
              <div className="header-actions">
                <div className="date-info">
                  <FiCalendar className="calendar-icon" />
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
                  <FiRefreshCw className={loading ? "spinning" : ""} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
            
            <div className="welcome-message">
              <h2>Welcome back, {user?.username || user?.email?.split("@")[0]}!</h2>
              <p>Continue your learning journey where you left off</p>
            </div>
          </header>

          {/* Stats Overview */}
          <section className={`stats-section ${animateStats ? 'animate-in' : ''}`}>
            <div className="stats-grid">
              <StatCard
                icon={<FiBook />}
                value={stats.courseEnrolled || 0}
                label="Courses Enrolled"
                color="#4a90e2"
                trend="up"
                trendValue="+2"
                onClick={() => navigate("/my-courses")}
              />
              <StatCard
                icon={<FiPlusCircle />}
                value={profile.courseCreated}
                label="Courses Created"
                color="#2ecc71"
                onClick={() => navigate("/my-created-courses")}
              />
              <StatCard
                icon={<FiCheckCircle />}
                value={`${stats.completionRate}%`}
                label="Completion Rate"
                color="#9b59b6"
                progress={stats.completionRate}
                onClick={() => navigate("/progress")}
              />
              <StatCard
                icon={<FiClock />}
                value={stats.learningStreak}
                label="Day Streak"
                color="#e74c3c"
                streakBadge
                onClick={() => navigate("/achievements")}
              />
              <StatCard
                icon={<FiBarChart2 />}
                value={stats.hoursLearned}
                label="Hours Learned"
                color="#f39c12"
                onClick={() => navigate("/activity")}
              />
            </div>
          </section>

          {/* Time Range Tabs */}
          <div className="time-range-tabs">
            <button 
              className={activeTab === 'week' ? 'active' : ''} 
              onClick={() => handleTabChange('week')}
            >
              This Week
            </button>
            <button 
              className={activeTab === 'month' ? 'active' : ''} 
              onClick={() => handleTabChange('month')}
            >
              This Month
            </button>
            <button 
              className={activeTab === 'year' ? 'active' : ''} 
              onClick={() => handleTabChange('year')}
            >
              This Year
            </button>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            <div className="main-content-area">
              <div className="progress-section">
                <div className="section-header">
                  <h3>Learning Progress</h3>
                  <button className="view-all-btn" onClick={() => navigate('/progress')}>
                    View Details <FiArrowRight />
                  </button>
                </div>
                <CourseProgressChart timeRange={activeTab} />
              </div>
              
              <div className="recommendations-section">
                <div className="section-header">
                  <h3>Recommended For You</h3>
                  <button className="view-all-btn" onClick={() => navigate('/recommendations')}>
                    See All <FiArrowRight />
                  </button>
                </div>
                <RecommendedCourses />
              </div>
            </div>
            
            <div className="sidebar-content">
              <div className="activity-section">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                </div>
                <RecentActivity />
              </div>
              
              {/* <div className="quick-stats">
                <h3>Quick Stats</h3>
                <div className="quick-stat-item">
                  <FiStar />
                  <div>
                    <p>Average Rating</p>
                    <span>4.8/5.0</span>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <FiUsers />
                  <div>
                    <p>Learning Buddies</p>
                    <span>12</span>
                  </div>
                </div>
                <div className="quick-stat-item">
                  <FiBookmark />
                  <div>
                    <p>Saved Courses</p>
                    <span>8</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;