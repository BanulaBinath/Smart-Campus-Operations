import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

/**
 * @param {Object} props
 * @param {string[]} [props.allowedRoles] - Optional array of roles that are allowed to access this route
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--color-bg)]">
        <h1 className="text-4xl font-bold text-[var(--color-danger)] mb-4">403</h1>
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Access Denied</h2>
        <p className="text-[var(--color-text-muted)] mb-6">
          You don't have permission to view this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          Go Back
        </button>
      </div>
    );
  }

  // If authenticated and authorized, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
