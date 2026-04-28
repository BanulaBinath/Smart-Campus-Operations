import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import FacilitiesPage from './pages/admin/FacilitiesPage';
import StudentFacilitiesPage from './pages/student/StudentFacilitiesPage';

// Booking Module
import MyBookingsPage from './components/home/Mybookingspage';
import AdminBookingsPage from './components/admin/Adminbookingpage';

// Original Components
import Home from './components/home/home';
import Login from './components/home/login';
import SignUp from './components/home/signUp';

// Role Redirect logic
import RoleRedirect from './components/RoleRedirect';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/"       element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes (Any Authenticated User) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* Role Specific Dashboards */}
          <Route path="/admin/dashboard"      element={<DashboardPage />} />
          <Route path="/student/dashboard"    element={<DashboardPage />} />
          <Route path="/lecturer/dashboard"   element={<DashboardPage />} />
          <Route path="/technician/dashboard" element={<DashboardPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/incidents"     element={<DashboardPage />} />

          {/* Bookings - student/user views and manages their own bookings */}
          <Route path="/bookings" element={<MyBookingsPage />} />
        </Route>

        {/* Admin and Technician Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']} />}>
          <Route path="/facilities" element={<FacilitiesPage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'USER', 'LECTURER']} />}>
          <Route path="/student/facilities" element={<StudentFacilitiesPage />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users"    element={<UserManagementPage />} />
          {/* Admin booking management - approve / reject / view all */}
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
