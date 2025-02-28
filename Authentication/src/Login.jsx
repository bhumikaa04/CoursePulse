import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        axios.post('http://localhost:3001/login', formData)
            .then(res => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token); // Store JWT in localStorage
                    alert('Login successful!');
                    navigate('/dashboard'); // Redirect to home page
                } else {
                    alert('Login failed: No token received');
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response) {
                    if (err.response.status === 401) {
                        alert('Login failed: Invalid email or password');
                    } else {
                        alert('Login failed: Server error');
                    }
                } else if (err.request) {
                    alert('Login failed: No response from server');
                } else {
                    alert('Login failed: An error occurred');
                }
            });
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Login</h1>
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
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <div className="text-center mt-3">
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="btn btn-secondary">Signup</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;