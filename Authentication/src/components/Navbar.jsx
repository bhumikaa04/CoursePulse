import React, { useState , useContext} from "react";
import { Link , useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import "../styles/style.css"; // Import the LogoutButton component
import { AuthContext } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Navbar = () => {
    const { isLoggedIn , setIsLoggedIn } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { username } = useAuth(); // Get username from the route params

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
                </ul>

                {/* Profile or Login/Signup Button */}
                <div className="profile">
                        <div className="auth-buttons">
                            <Link to="/login" className="auth-button">
                                Login
                            </Link>
                            <Link to="/signup" className="auth-button">
                                Signup
                            </Link>
                        </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
