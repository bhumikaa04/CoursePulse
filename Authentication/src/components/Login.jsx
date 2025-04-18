import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FormCSS.css";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(""); // For displaying error messages
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const navigate = useNavigate();

    // Handling input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(""); // Clear error messages when the user types
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
            setError("Please enter a valid email address");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true); // Start loading
        setError(""); // Clear previous errors

        try {
            const response = await axios.post("http://localhost:3001/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Response:", response.data);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Store token
                navigate("/dashboard"); // Redirect to Dashboard
            } else {
                setError("Login failed: No token received");
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            setError(
                error.response?.data?.message ||
                "Login failed: Invalid credentials or server error"
            );
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="container mt-4 flex row justify-content-center">
            <h1 className="text-center">Login</h1>
            <div className="card p-4 shadow-sm">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email address
                        </label>
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
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
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
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/signup" className="hyperlink">
                        Don't have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;