import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If no roles specified or user's role is allowed, show the page
  if (!allowedRoles || allowedRoles.includes(currentUser.role)) {
    return children;
  }

  // If user's role is not allowed, redirect based on role
  if (currentUser.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (currentUser.role === 'resident') {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;