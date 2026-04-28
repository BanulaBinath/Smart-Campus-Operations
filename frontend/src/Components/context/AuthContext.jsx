import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
      console.log('User authenticated successfully:', response.data);
    } catch (error) {
      // Only log non-401 errors as these are expected for unauthenticated users
      if (error.response?.status !== 401) {
        console.error('Unexpected error fetching user:', error);
      } else {
        console.log('User not authenticated (401) - this is normal for logged out users');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const logout = () => {
    setUser(null);
    window.location.href = 'http://localhost:8080/api/v1/auth/logout';
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
