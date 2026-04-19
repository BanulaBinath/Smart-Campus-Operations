import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages

import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import FacilitiesPage from './pages/admin/FacilitiesPage';

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
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Any Authenticated User) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Role Specific Dashboards */}
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/student/dashboard" element={<DashboardPage />} />
          <Route path="/lecturer/dashboard" element={<DashboardPage />} />
          <Route path="/technician/dashboard" element={<DashboardPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Stubs for other modules */}
          <Route path="/bookings" element={<DashboardPage />} />
          <Route path="/incidents" element={<DashboardPage />} />
        </Route>

        {/* Admin and Technician Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']} />}>
          <Route path="/facilities" element={<FacilitiesPage />} />
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
