import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext' ;

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;