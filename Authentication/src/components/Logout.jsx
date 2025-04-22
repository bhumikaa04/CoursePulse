import React from "react";
import { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LogoutButton() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // const handleLogout = () => {
    //     localStorage.removeItem("token"); // Remove token from local storage
    //     alert("You have been logged out.");
    //     setIsLoggedIn(false); // Update the state to reflect the user is logged out
    //     console.log(" Redirecting to login page.");
    //     navigate("/login"); // Redirect to the login page
    // };
    
    // console.log("setIsLoggedIn:", setIsLoggedIn); // Debug the prop
    // console.log("LogoutButton Props:", { setIsLoggedIn }); // Debugging


    const handleLogout = () => {
        if (typeof setIsLoggedIn !== "function") {
            console.error("setIsLoggedIn is not a function");
            return;
        }
        localStorage.removeItem("token");
        alert("You have been logged out.");
        setIsLoggedIn(false);
        navigate("/login");
    };
    return (
        <button onClick={handleLogout} className="btn logout-button">
            Logout
        </button>
    );
}

export default LogoutButton;
