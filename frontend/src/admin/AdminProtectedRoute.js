import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('openscroll_admin_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AdminProtectedRoute;
