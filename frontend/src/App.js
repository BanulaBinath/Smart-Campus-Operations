import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';

// Original Components
import Home from './components/home/home';
import SignUp from './components/home/signUp';
import Login from './components/home/login';

// Role Redirect logic
import RoleRedirect from './components/RoleRedirect';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Original Public Routes from other members */}
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />

        {/* My Public Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes (Any Authenticated User) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/dashboard" element={<RoleRedirect />} />
          
          {/* Role Specific Dashboards */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/student/dashboard" element={<DashboardPage />} />
          <Route path="/lecturer/dashboard" element={<DashboardPage />} />
          <Route path="/technician/dashboard" element={<DashboardPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Stubs for other modules */}
          <Route path="/facilities" element={<DashboardPage />} />
          <Route path="/bookings" element={<DashboardPage />} />
          <Route path="/incidents" element={<DashboardPage />} />
        </Route>
        
        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users" element={<UserManagementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
