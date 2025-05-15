import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [userDetails, setUserDetails] = useState(null);

    // Load data from localStorage on app reload
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUserDetails(JSON.parse(storedUser)); // Parse JSON string
            setUsername(JSON.parse(storedUser).username);
        }

        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            setUsername(savedUsername);
            setIsLoggedIn(true);
        }
    }, []);


    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            username, 
            setUsername, 
            userDetails,
            setUserDetails}}>
                
            {children}
        </AuthContext.Provider>
    );
};

// Hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);
