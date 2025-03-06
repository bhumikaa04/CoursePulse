import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FormCSS.css";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    // Handling input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3001/login", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Response:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Store token
                alert("Login successful!");
                navigate("/dashboard"); // Redirect to Dashboard
            } else {
                alert("Login failed: No token received");
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            alert("Login failed: Invalid credentials or server error");
        }
    };

    return (
        <div className="container mt-5 col-md-4">
            <div className="heading">
            <h1 className="text-center">Login</h1>
            </div>
            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="btn btn-secondary">
                        Signup
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
