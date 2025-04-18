import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import "../styles/style.css";
import LogoutButton from "./Logout"; // Import the LogoutButton component

const Navbar = ({ isLoggedIn , setIsLoggedIn }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container">
                {/* Website Name */}
                <Link to="/" className="brand">
                    COURSEPULSE
                </Link>

                {/* Navigation Links */}
                <ul className="nav-links">
                    {/* Home Link - Different for logged-in and logged-out users */}
                    <li>
                        <Link to={isLoggedIn ? "/dashboard" : "/home"}>Home</Link>
                    </li>

                    {/* Show these links only when logged out */}
                    {!isLoggedIn && (
                        <>
                            <li>
                                <Link to="/explore">Explore</Link>
                            </li>
                            <li>
                                <Link to="/about">About Us</Link>
                            </li>
                        </>
                    )}

                    {/* Show Create Course link for both logged-in and logged-out users */}
                    <li>
                        <Link to={isLoggedIn ? "/create-course" : "/login"}>Create Course</Link>
                    </li>

                    {isLoggedIn && (
                        <>
                            <li>
                                <Link to="/search">Search</Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Profile or Login/Signup Button */}
                <div className="profile">
                    {isLoggedIn ? (
                        <div
                        className="profile-dropdown"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <FaUserCircle size={40} className="profile-icon" />
                        {isDropdownOpen && (
                          <ul className="dropdown-menu">
                            <li>
                              <Link to="/profile">View Profile</Link>
                            </li>
                            <li>
                              <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                            </li>
                          </ul>
                        )}
                      </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-button">
                                Login
                            </Link>
                            <Link to="/signup" className="auth-button">
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
