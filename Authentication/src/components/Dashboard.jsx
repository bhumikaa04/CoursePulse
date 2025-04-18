import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Assume the user is logged in initially
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first.");
            setIsLoggedIn(false); // Update logged-in state
            console.log(" Redirecting to login page.");
            // Redirect to login page if token is not found
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
    }, [navigate]);

    return (
        <>
            {/* Pass isLoggedIn to Navbar */}
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="container mt-4">
                <h1 className="text-center">Dashboard</h1>
                <div className="card p-4 shadow-sm">
                    {user ? (
                        <div>
                            <h2>Welcome, {user.username}!</h2>
                            <p>Email: {user.email}</p>
                            <EditProfile />
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
