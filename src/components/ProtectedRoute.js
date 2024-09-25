// components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateToken } from '../utils/tokenValidation';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null, we are checking

  useEffect(() => {
    const checkToken = async () => {
      const { valid } = await validateToken();
      setIsAuthenticated(valid);
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can show a loading spinner here
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;  // Redirect to sign-in page if not authenticated
  }

  return children;  // Render the protected component if authenticated
};

export default ProtectedRoute;
