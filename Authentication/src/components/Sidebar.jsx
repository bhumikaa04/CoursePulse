// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiMenu, FiBook, FiPlusCircle, FiTrendingUp, FiSearch, FiAward, FiUser, FiLogOut, FiBarChart2 } from "react-icons/fi";
// import { useNotification } from "../context/NotificationContext";
// import "../styles/Dashboard.css";

// const Sidebar = ({ 
//   sidebarCollapsed, 
//   toggleSidebar, 
//   profile, 
//   user, 
//   setIsLoggedIn, 
//   stats 
// }) => {
//   const navigate = useNavigate();
//   const showNotification = useNotification(); // Access notification context

//   const handleLogout = () => {
//     // Remove tokens and update auth state
//     localStorage.removeItem("token");
//     sessionStorage.removeItem("token");
//     setIsLoggedIn(false);

//     // Show notification and redirect after delay
//     showNotification("You have been logged out.", "logout");
//     setTimeout(() => {
//       navigate("/login");
//     }, 2000); // Redirect after 2 seconds
//   };

//   return (
//     <aside className={`dashboard-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-toggle" onClick={toggleSidebar}>
//         <FiMenu />
//       </div>
//       <div className="sidebar-header">
//         <div className="sidebar-user">
//           <div className="user-avatar">
//             {profile?.profilePhoto ? (
//               <img
//                 src={`http://localhost:3001${profile.profilePhoto}`}
//                 alt="Profile"
//                 onError={(e) => {
//                   e.target.src = "/default-profile.jpg";
//                   e.target.onerror = null;
//                 }}
//               />
//             ) : (
//               <span>{user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
//             )}
//           </div>
//           {!sidebarCollapsed && (
//             <div className="user-info">
//               <h3>{profile?.username || user?.username || user?.email?.split("@")[0]}</h3>
//               <p>Learner</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <nav className="sidebar-nav">
//         <ul>
//           <li className="active">
//             <a href="/dashboard">
//               <FiBarChart2 />
//               {!sidebarCollapsed && <span>Dashboard</span>}
//             </a>
//           </li>
//           <li>
//             <a href="/my-courses">
//               <FiBook />
//               {!sidebarCollapsed && <span>My Courses</span>}
//             </a>
//           </li>
//           <li>
//             <Link to="/create-course">
//               <FiPlusCircle />
//               {!sidebarCollapsed && <span>Create Courses</span>}
//             </Link>
//           </li>
//           <li>
//             <Link to="/newCourse">
//               <FiPlusCircle />
//               {!sidebarCollapsed && <span>New Courses</span>}
//             </Link>
//           </li>
//           <li>
//             <a href="/progress">
//               <FiTrendingUp />
//               {!sidebarCollapsed && <span>Progress</span>}
//             </a>
//           </li>
//           <li>
//             <a href="/search">
//               <FiSearch />
//               {!sidebarCollapsed && <span>Search</span>}
//             </a>
//           </li>
//           <li>
//             <a href="/achievements">
//               <FiAward />
//               {!sidebarCollapsed && <span>Achievements</span>}
//             </a>
//           </li>
//           <li>
//             <Link to={`/profile/${profile.username}`}>
//               <FiUser />
//               {!sidebarCollapsed && <span>Profile</span>}
//             </Link>
//           </li>
//           <li onClick={handleLogout}>
//             <a>
//                 <FiLogOut />
//                 {!sidebarCollapsed && <span>Logout</span>}    
//             </a>
//           </li>
//         </ul>
//       </nav>
//       {!sidebarCollapsed && (
//         <div className="sidebar-footer">
//           <p>Learning streak: {stats.learningStreak} days</p>
//           <div className="streak-progress">
//             <div
//               className="streak-progress-bar"
//               style={{ width: `${Math.min(stats.learningStreak * 10, 100)}%` }}
//             ></div>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default Sidebar;

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FiMenu, FiBook, FiPlusCircle, FiTrendingUp, FiSearch, FiAward, FiUser, FiLogOut, FiBarChart2 } from "react-icons/fi";
import { useNotification } from "../context/NotificationContext";
import "../styles/Dashboard.css";

const Sidebar = ({
  sidebarCollapsed,
  toggleSidebar,
  profile,
  user,
  setIsLoggedIn,
  stats
}) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object
  const showNotification = useNotification(); // Access notification context

  const handleLogout = () => {
    // Remove tokens and update auth state
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);

    // Show notification and redirect after delay
    showNotification("You have been logged out.", "logout");
    setTimeout(() => {
      navigate("/login");
    }, 2000); // Redirect after 2 seconds
  };

  return (
    <aside className={`dashboard-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
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
                  e.target.src = "/default-profile.jpg";
                  e.target.onerror = null;
                }}
              />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}</span>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <h3>{profile?.username || user?.username || user?.email?.split("@")[0]}</h3>
              <p>Learner</p>
            </div>
          )}
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* Dashboard Link */}
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard"> {/* Use Link for navigation */}
              <FiBarChart2 />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {/* My Courses Link */}
          <li className={location.pathname === "/my-courses" ? "active" : ""}>
            <Link to="/my-courses"> {/* Use Link for navigation */}
              <FiBook />
              {!sidebarCollapsed && <span>My Courses</span>}
            </Link>
          </li>
          {/* New Courses Link */}
          <li className={location.pathname === "/course" ? "active" : ""}>
            <Link to="/course">
              <FiPlusCircle />
              {!sidebarCollapsed && <span>New Courses</span>}
            </Link>
          </li>
          {/* Progress Link */}
          <li className={location.pathname === "/progress" ? "active" : ""}>
            <Link to="/progress"> {/* Use Link for navigation */}
              <FiTrendingUp />
              {!sidebarCollapsed && <span>Progress</span>}
            </Link>
          </li>
          {/* Search Link */}
          <li className={location.pathname === "/search" ? "active" : ""}>
            <Link to="/search"> {/* Use Link for navigation */}
              <FiSearch />
              {!sidebarCollapsed && <span>Search</span>}
            </Link>
          </li>
          {/* Achievements Link */}
          <li className={location.pathname === "/achievements" ? "active" : ""}>
            <Link to="/achievements"> {/* Use Link for navigation */}
              <FiAward />
              {!sidebarCollapsed && <span>Achievements</span>}
            </Link>
          </li>
          {/* Profile Link */}
          <li className={location.pathname.startsWith("/profile/") ? "active" : ""}>
            <Link to={`/profile/${profile.username}`}>
              <FiUser />
              {!sidebarCollapsed && <span>Profile</span>}
            </Link>
          </li>
          {/* Logout Link (assuming it's not a direct route but an action) */}
          <li onClick={handleLogout}>
            <a>
              <FiLogOut />
              {!sidebarCollapsed && <span>Logout</span>}
            </a>
          </li>
        </ul>
      </nav>
      {/* {!sidebarCollapsed && (
        <div className="sidebar-footer">
          <p>Learning streak: {stats.learningStreak} days</p>
          <div className="streak-progress">
            <div
              className="streak-progress-bar"
              style={{ width: `${Math.min(stats.learningStreak * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      )} */}
    </aside>
  );
};

export default Sidebar;