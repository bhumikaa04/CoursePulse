import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import "../styles/style.css";

const Navbar = () => {
    // State to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Set this based on your authentication logic

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
                        <Link to={isLoggedIn ? "/dashboard" : "/"}>Home</Link>
                    </li>

                    {/* Show these links only when logged out */}
                    {!isLoggedIn && (
                        <>
                            <li>
                                <Link to="/explore">Explore</Link>
                            </li>
                            <li>
                                <Link to="/about-us">About Us</Link>
                            </li>
                        </>
                    )}

                    {/* Show Create Course link for both logged-in and logged-out users */}
                    <li>
                        <Link to="/create-course">Create Course</Link>
                    </li>
                </ul>

                {/* Profile or Login/Signup Button */}
                <div className="profile">
                    {isLoggedIn ? (
                        <Link to="/profile">
                            <FaUserCircle size={40} />
                        </Link>
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