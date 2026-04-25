import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { LOGOUT_URL, navigateToBackend } from '../config/backendUrls';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me', { skipAuthRedirect: true });
      setUser(response.data);
    } catch (error) {
      const status = error?.response?.status;

      // A 401 here is expected when no active session exists.
      if (status && status !== 401) {
        console.error('Failed to fetch user:', error);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const publicRoutes = new Set(['/', '/login', '/signup']);
    if (publicRoutes.has(location.pathname)) {
      setLoading(false);
      return;
    }

    fetchCurrentUser();
  }, [location.pathname]);

  const logout = () => {
    setUser(null);
    navigateToBackend(LOGOUT_URL);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        fetchCurrentUser,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
