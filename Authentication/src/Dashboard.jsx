import React, { useEffect, useState } from "react";

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch data from a protected route
        fetch('http://localhost:3001/dashboard', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                console.log("Response data:", data); // Log the response
                if (data && data.user) {
                    setData(data);
                } else {
                    throw new Error("Invalid data structure received");
                }
            })
            .catch(err => {
                console.error("Error fetching protected data:", err);
                alert("Failed to fetch data. Please log in again.");
            });
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center">Dashboard</h1>
            <div className="card p-4 shadow-sm">
                {data && data.user ? (
                    <div>
                        <h2>Welcome, {data.user.username}!</h2>
                        <p>Your email: {data.user.email}</p>
                    </div>
                ) : (
                    <p>No user data available. Please log in again.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;