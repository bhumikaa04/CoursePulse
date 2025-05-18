import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [storedUser, setStoredUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Update profile and sync with localStorage
  const updateProfile = (newProfileData) => {
    setProfile((prev) => {
      const updatedProfile = { ...prev, ...newProfileData };

      // Save the updated profile to localStorage
      localStorage.setItem("profile", JSON.stringify(updatedProfile));

      return updatedProfile;
    });
  };

  // Load data from localStorage on app reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userFromStorage = localStorage.getItem("user");
    const profileFromStorage = localStorage.getItem("profile");

    // Log data for debugging (optional, remove for production)
    // console.log("profileFromStorage:", profileFromStorage);
    // console.log("userFromStorage:", userFromStorage);
    // console.log("token:", token);

    if (token && userFromStorage) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(userFromStorage);
      setUserDetails(parsedUser);
      setStoredUser(parsedUser);
      setUsername(parsedUser.username);
    }

    if (profileFromStorage) {
      setProfile(JSON.parse(profileFromStorage));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        username,
        setUsername,
        userDetails,
        setUserDetails,
        storedUser,
        profile,
        updateProfile, // Provide updateProfile function in context
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to auth context
export const useAuth = () => useContext(AuthContext);
