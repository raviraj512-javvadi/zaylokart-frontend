import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // This useEffect runs once when the app first loads
  useEffect(() => {
    // It checks if user info is already saved in the browser's local storage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const login = (userData) => {
    // 1. Update the state so the app knows you're logged in
    setUserInfo(userData);
    // 2. Save the user info to the browser's storage so it's not lost on refresh
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  const logout = () => {
    // 1. Clear the state
    setUserInfo(null);
    // 2. Remove the user info from the browser's storage
    localStorage.removeItem('userInfo');
  };

  // We provide the userInfo object and the functions to all components
  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};