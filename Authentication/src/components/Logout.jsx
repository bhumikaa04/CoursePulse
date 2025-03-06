import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove token
        alert("You have been logged out.");
        navigate("/login"); // Redirect to login
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
}

export default LogoutButton;
