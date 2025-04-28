import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('openscroll_current_user'));

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
