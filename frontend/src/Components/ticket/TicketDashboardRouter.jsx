import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import UserDashboard from './UserDashboard';
import TechnicianDashboard from './TechnicianDashboard';

function TicketDashboardRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }

  if (user?.role === 'TECHNICIAN') {
    return <TechnicianDashboard />;
  }

  // Default to UserDashboard for students, lecturers, and other users
  return <UserDashboard />;
}

export default TicketDashboardRouter;
