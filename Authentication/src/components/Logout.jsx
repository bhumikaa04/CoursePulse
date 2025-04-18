import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token from local storage
        alert("You have been logged out.");
        setIsLoggedIn(false); // Update the state to reflect the user is logged out
        console.log(" Redirecting to login page.");
        navigate("/login"); // Redirect to the login page
    };

    return (
        <button onClick={handleLogout} className="btn logout-button">
            Logout
        </button>
    );
}

export default LogoutButton;
