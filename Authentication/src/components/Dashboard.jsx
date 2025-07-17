import React, { useEffect, useState, useContext } from "react";
import { useNavigate  , Link} from "react-router-dom";
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
import Sidebar from "./sidebar";


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

      <div className="dashboard-container">
        <Sidebar 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
          profile={profile} 
          user={user}  
          setIsLoggedIn={setIsLoggedIn}
          stats={stats} 
        />

        <main className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
          {/* Header Section */}
          <header className="dashboard-header">
            <div className="header-content">
              <h1>The Learning Dashboard</h1>
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

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;