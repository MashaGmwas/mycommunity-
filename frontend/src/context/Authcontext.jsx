import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('access_token');
    });

    const [user, setUser] = useState(null); 

    const login = (token, userData = null) => {
        localStorage.setItem('access_token', token);
        setIsLoggedIn(true);
        if (userData) {
            setUser(userData);
        }
        
        window.dispatchEvent(new Event('storage')); 
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        setUser(null);
        window.dispatchEvent(new Event('storage'));
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};