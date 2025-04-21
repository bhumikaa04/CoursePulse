import { useState , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Signup() {
    const { setIsLoggedIn } = useContext(AuthContext); // Accessing the AuthContext to manage login state
    const [formData, setFormData] = useState({ email: "", password: "" , username: "" });
    const navigate = useNavigate();

    // Handling input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

// Handling form submit
// const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent page reload
//     console.log("Form Data:", formData); // Debugging what is being sent

//     try {
//         // Axios request to the backend API
//         const response = await axios.post("http://localhost:3001/register", formData, {
//             headers: {
//                 "Content-Type": "application/json", // Tells the server it's JSON data
//             },
//         });

//         console.log("Response:", response.data);

//         if (response.data.token) {
//             // Store the JWT token in localStorage
//             localStorage.setItem("token", response.data.token);
//             alert("Registration successful!");
//             navigate("/login"); // Redirect to the login page
//         }
//     } catch (error) {
//         console.error("Error Response:", error.response);

//         // Handle backend error messages dynamically
//         if (error.response && error.response.data && error.response.data.message) {
//             alert(`Registration failed: ${error.response.data.message}`);
//         } else {
//             alert("Registration failed: Unexpected error occurred");
//         }
//     }
// };


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:3001/register", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Response:", response.data);

        if (response.data.message) {
            alert(response.data.message); // Show success message
            setIsLoggedIn(true); // Update login state
            localStorage.setItem("token", response.data.token); // Store token
            navigate("/login"); // Redirect to the login page
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            alert(error.response.data.message); // Show error message from backend
        } else {
            alert("Registration failed: Unexpected error occurred");
        }
    }
};


    return (
        <div className="container mt-4 flex row justify-content-center">
            <h1 className="text-center">Signup</h1>
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
                        <label htmlFor="password" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Define Username"
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
                    <Link to="/login" className="hyperlink">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
