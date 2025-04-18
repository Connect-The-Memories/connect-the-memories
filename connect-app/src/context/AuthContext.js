// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

// Helper function to get initial token
const getInitialToken = () => {
  try {
    return sessionStorage.getItem('authToken');
  } catch (e) {
    console.error("Error reading sessionStorage:", e);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getInitialToken); // Initialize from storage
  const [user, setUser] = useState(null); // Optional: store other user details
  const [isLoading, setIsLoading] = useState(true); // Prevent rendering until token check is done

  useEffect(() => {
    if (token) {
      // Token exists, set default header for subsequent requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Persist token in sessionStorage for refresh resilience
      try {
        sessionStorage.setItem('authToken', token);
      } catch (e) {
         console.error("Error writing to sessionStorage:", e);
      }
      // Optionally fetch user data here if needed on load
      // fetchInitialUserData();
    } else {
      // No token, remove default header and clear storage
      delete axiosInstance.defaults.headers.common['Authorization'];
       try {
        sessionStorage.removeItem('authToken');
      } catch (e) {
         console.error("Error removing from sessionStorage:", e);
      }
    }
    setIsLoading(false); // Initial check complete
  }, [token]); // Run this effect whenever the token state changes

  const login = (newToken, userData = null) => {
    setToken(newToken); // Update state, useEffect will handle header/storage
    setUser(userData); // Store any user details if provided
  };

  const logout = () => {
    // Optional: Call backend logout endpoint. Header will be attached if token exists.
    // axiosInstance.post('/auth/account/logout').catch(err => {
    //   console.error("Backend logout failed:", err);
    //   // Still proceed with frontend logout regardless
    // });
    setToken(null); // Update state, useEffect will handle header/storage removal
    setUser(null);
  };

  // Prevent rendering children until initial token check is done
  if (isLoading) {
    return <div>Loading authentication...</div>; // Or a spinner component
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
