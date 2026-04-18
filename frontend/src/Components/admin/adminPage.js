import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AdminBookingsPage from './AdminBookingsPage';
import './adminPage.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Total Bookings</h3>
          <p className="dash-number">—</p>
        </div>
        <div className="dash-card">
          <h3>Pending Approvals</h3>
          <p className="dash-number">—</p>
        </div>
        <div className="dash-card">
          <h3>Open Tickets</h3>
          <p className="dash-number">—</p>
        </div>
        <div className="dash-card">
          <h3>Active Facilities</h3>
          <p className="dash-number">—</p>
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;