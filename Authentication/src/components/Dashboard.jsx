import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./Logout"; // Import Logout button
import Navbar from "./Navbar";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first.");
            navigate("/login");
            return;
        }

        // Fetch data from a protected route
        fetch('http://localhost:3001/dashboard', {
            headers: { "Authorization": `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then(data => {
                console.log("Response data:", data);
                if (data?.user) {
                    setUser(data.user);
                } else {
                    throw new Error("Invalid response format");
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token"); // Remove token if session is invalid
                navigate("/login");
            });
    }, [navigate]);

    return (
        <>
        <Navbar />
        <div className="container mt-4">
            <h1 className="text-center">Dashboard</h1>
            <div className="card p-4 shadow-sm">
                {user ? (
                    <div>
                        <h2>Welcome, {user.username}!</h2>
                        <p>Email: {user.email}</p>
                        <LogoutButton /> 
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
