import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();

  // If user is not logged in, redirect them to the login page
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the component they were trying to access
  return children;
};

export default ProtectedRoute;