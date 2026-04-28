import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const RoleRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'TECHNICIAN':
      return <Navigate to="/technician/dashboard" replace />;
    case 'LECTURER':
      return <Navigate to="/lecturer/dashboard" replace />;
    case 'USER':
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
};

export default RoleRedirect;
