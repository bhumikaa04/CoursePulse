import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    // Handling input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handling form submit
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log("Form Data:", formData); // Debugging what is being sent

        try {
            // Axios request to the backend API
            const response = await axios.post("http://localhost:3001/register", formData, {
                headers: {
                    "Content-Type": "application/json" // Tells the server it's JSON data
                }
            });

            console.log("Response:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Store JWT token
                alert("Registration successful!");
                navigate("/login"); // Redirect to login page
            } else {
                alert("Registration failed: No token received");
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            alert("Registration failed: Invalid data or server error");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Signup</h1>
            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Sign Up
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-secondary">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
