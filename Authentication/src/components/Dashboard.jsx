import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext

const Dashboard = () => {
    const {isLoggedIn,  setIsLoggedIn } = useContext(AuthContext); // Accessing the AuthContext to manage login state
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first.");
            setIsLoggedIn(false); // Update logged-in state
            console.log("Redirecting to login page.");
            navigate("/login");
            return;
        }

        // Fetch data from a protected route
        fetch("http://localhost:3001/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Welcome to the dashboard");
                setIsLoggedIn(true); // Update logged-in state`
                console.log("User data:", data.user); // Debugging
                if (data?.user) {
                    setUser(data.user);
                } else {
                    throw new Error("Invalid response format");
                }
            })
            .catch((err) => {
                console.error("Error:", err);
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token"); // Remove token if session is invalid
                setIsLoggedIn(false); // Update logged-in state
                navigate("/login");
            });
    }, [navigate, setIsLoggedIn]);

    return (
        <>
            {/* Pass isLoggedIn to Navbar */}
            <Navbar isLoggedIn={!!user} />
            <div className="container mt-4">
                <h1 className="text-center">Dashboard</h1>
                <div className="card p-4 shadow-sm">
                    {user ? (
                        <div>
                            <h2>Welcome, {user.username}!</h2>
                            <p>Email: {user.email}</p>
                            <EditProfile />
                            <br />
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
