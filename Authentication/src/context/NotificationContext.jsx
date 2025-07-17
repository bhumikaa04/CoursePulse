import React, { createContext, useState, useContext } from "react";
import "../styles/NotificationContext.css"

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: "", type: "", show: false });

    const showNotification = (message, type = "success") => {
        setNotification({ message, type, show: true });
        setTimeout(() => setNotification({ message: "", type: "", show: false }), 2000); // Auto-hide after 3 seconds
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <span>{notification.message}</span>
                    <div className="progress-bar" />
                </div>
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
