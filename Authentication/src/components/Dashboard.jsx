import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext

const Dashboard = () => {
    const { setIsLoggedIn } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in first.");
            setIsLoggedIn(false);
            navigate("/login");
            return;
        }

        fetch("http://localhost:3001/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => {
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              return response.json();
            })
            .then((data) => {
              if (data.user) {
                setUser(data.user);
                setIsLoggedIn(true);
              } else {
                throw new Error("User data missing");
              }
            })
            .catch((err) => {
              console.error("Dashboard fetch failed:", err);
              localStorage.removeItem("token");
              setIsLoggedIn(false);
              navigate("/login");
            });
    }, [navigate, setIsLoggedIn]);

    return (
        <>
            <Navbar isLoggedIn={!!user} />
            <div className="container mt-4">
                <h1 className="text-center">Dashboard</h1>
                <div className="card p-4 shadow-sm">
                    {user ? (
                        <div>
                            <h2>
                                Welcome, {user.username || user.email || "User"}!
                            </h2>
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
