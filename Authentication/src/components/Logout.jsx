import React from "react";
import { useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

function LogoutButton({ sidebarCollapsed }) {
    const { setIsLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (typeof setIsLoggedIn !== "function") {
            console.error("setIsLoggedIn is not a function");
            return;
        }
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        alert("You have been logged out.");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <button onClick={handleLogout} className="sidebar-item">
            <FiLogOut />
            {!sidebarCollapsed && <span>Logout</span>}
        </button>
    );
}

export default LogoutButton;
