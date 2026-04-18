import React from 'react';
import DashboardLayout from './DashboardLayout';
import './UserDashboard.css';

function UserDashboard() {
  return (
    <DashboardLayout>
      <section className="user-dashboard-box">
        <h1>User Ticket Dashboard</h1>
        <p>Users can access ticket-related pages from the sidebar.</p>
      </section>
    </DashboardLayout>
  );
}

export default UserDashboard;