import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

// Pages

import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import FacilitiesPage from './pages/admin/FacilitiesPage';
import StudentFacilitiesPage from './pages/student/StudentFacilitiesPage';

// Ticket System Components
import TicketDashboardRouter from './Components/ticket/TicketDashboardRouter';
import CreateTicket from './Components/ticket/CreateTicket';
import TicketChat from './Components/ticket/TicketChat';
import TechnicianDashboard from './Components/ticket/TechnicianDashboard';
import TechnicianTicketDetail from './Components/ticket/TechnicianTicketDetail';
import AdminDashboard from './Components/ticket/admin/AdminDashboard';
import AdminTicketDetails from './Components/ticket/admin/AdminTicketDetails';
import AdminAssignTechnician from './Components/ticket/admin/AdminAssignTechnician';

// Original Components
import Home from './Components/home/home';
import SignUp from './Components/home/signUp';
import Login from './Components/home/login';

// Role Redirect logic
import RoleRedirect from './Components/RoleRedirect';

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

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Ticket/Incident Routes */}
          <Route path="/incidents" element={<TicketDashboardRouter />} />
          <Route path="/tickets" element={<TicketDashboardRouter />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/chat/:ticketId" element={<TicketChat />} />

          {/* Stubs for other modules */}
          <Route path="/bookings" element={<DashboardPage />} />
        </Route>

        {/* Admin and Technician Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']} />}>
          <Route path="/facilities" element={<FacilitiesPage />} />
        </Route>

        {/* Technician Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
          <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
          <Route path="/technician/tickets/:ticketId" element={<TechnicianTicketDetail />} />

          {/* Back-compat routes used by older technician ticket pages */}
          <Route path="/tickets/technician" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/tickets/technician/:ticketId" element={<TechnicianTicketDetail />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'USER', 'LECTURER']} />}>
          <Route path="/student/facilities" element={<StudentFacilitiesPage />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/tickets" element={<AdminDashboard initialTab="tickets" />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetails />} />
          <Route path="/admin/tickets/:id/assign" element={<AdminAssignTechnician />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
