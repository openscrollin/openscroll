import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, token } = useContext(UserContext);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait one tick for hydration from localStorage
    const timer = setTimeout(() => setHydrated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isWriterRoute = location.pathname.startsWith('/writer');
  const isReaderRoute = !isWriterRoute;

  if (!hydrated) {
    return null; // or <Loading /> if you want to show a spinner
  }

  if (!user || !token) {
    return <Navigate to={isWriterRoute ? '/writer/login' : '/login'} replace />;
  }

  if (isWriterRoute && user.role !== 'writer') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isReaderRoute && user.role !== 'reader') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
