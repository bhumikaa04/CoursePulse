import { useState } from "react";
import {Link , useNavigate} from 'react-router-dom';
import axios from "axios";

function Signup() {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', formData)
    .then(res => {
        console.log(res);
        navigate('/login'); // Redirect to login after successful signup
    })
    .catch(err => {
        console.error("Error during signup:", err.response?.data); // Log the server's error response
        alert("Signup failed: " + (err.response?.data?.message || "Invalid data or server error"));
    });
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
                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </form>
                <div className="text-center mt-3">
                    <p>Already have an account?</p>
                    <Link to="/login" className="btn btn-secondary">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
