import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { userInfo } = useAuth();
  // Redirect to login if not logged in, or to home if not an admin
  if (!userInfo) return <Navigate to="/login" replace />;
  if (!userInfo.isAdmin) return <Navigate to="/" replace />;
  // If logged in and an admin, show the component
  return children;
};
export default AdminProtectedRoute;