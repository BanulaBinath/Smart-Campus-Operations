import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

// Original Components
import Home from './Components/home/home';
import SignUp from './Components/home/signUp';
import Login from './Components/home/login';
import RoleRedirect from './Components/RoleRedirect';

// Ticket Components
import UserDashboard from './Components/ticket/UserDashboard';
import CreateTicket from './Components/ticket/CreateTicket';
import TicketChat from './Components/ticket/TicketChat';
import TechnicianDashboard from './Components/ticket/TechnicianDashboard';
import TechnicianTicketDetail from './Components/ticket/TechnicianTicketDetail';
import AdminDashboard from './Components/ticket/admin/AdminDashboard';
import AdminTickets from './Components/ticket/admin/AdminTickets';
import AdminTicketDetail from './Components/ticket/admin/AdminTicketDetail';
import AdminTechs from './Components/ticket/admin/AdminTechs';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/student/dashboard" element={<DashboardPage />} />
          <Route path="/lecturer/dashboard" element={<DashboardPage />} />
          <Route path="/technician/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookings" element={<DashboardPage />} />
          <Route path="/incidents" element={<DashboardPage />} />

          {/* Ticket Routes */}
          <Route path="/tickets" element={<UserDashboard />} />
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/chat" element={<TicketChat role="USER" />} />
          <Route path="/tickets/chat/:ticketId" element={<TicketChat role="USER" />} />
          <Route path="/tickets/technician" element={<TechnicianDashboard />} />
          <Route path="/tickets/technician/:ticketId" element={<TechnicianTicketDetail />} />
        </Route>

        {/* Admin & Technician Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']} />}>
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/technician/chat" element={<TicketChat role="TECHNICIAN" />} />
          <Route path="/tickets/technician/detail" element={<TechnicianTicketDetail />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'USER', 'LECTURER']} />}>
          <Route path="/student/facilities" element={<StudentFacilitiesPage />} />
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/chat" element={<TicketChat role="ADMIN" />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/tickets/:id" element={<AdminTicketDetail />} />
          <Route path="/admin/tickets/:id/assign" element={<AdminTechs />} />
          <Route path="/admin/techs" element={<AdminTechs />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;