import React, { createContext, useState } from "react";

// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
    const [user, setUser] = useState({ email: 'papa@gmail.com' }); // Replace with real auth data

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
