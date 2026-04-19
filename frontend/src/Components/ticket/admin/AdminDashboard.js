import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const stats = [
    { label: 'Open Tickets', count: 12, color: 'open' },
    { label: 'In Progress', count: 5, color: 'progress' },
    { label: 'Resolved', count: 8, color: 'resolved' },
    { label: 'Rejected', count: 2, color: 'rejected' },
  ];

  const recentTickets = [
    { id: 1, title: 'Broken Projector', priority: 'High', status: 'OPEN' },
    { id: 2, title: 'AC Not Working', priority: 'Low', status: 'IN_PROGRESS' },
    { id: 3, title: 'Damaged Chair', priority: 'Medium', status: 'RESOLVED' },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
          <p>Monitor ticket activity and manage the workflow.</p>
        </div>

        <div className="admin-stats-grid">
          {stats.map((item) => (
            <div key={item.label} className={`admin-stat-card ${item.color}`}>
              <h3>{item.count}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="admin-section-card">
          <div className="admin-section-header">
            <h3>Recent Tickets</h3>
            <Link to="/admin/tickets" className="admin-view-all-btn">
              View All
            </Link>
          </div>

          <div className="admin-ticket-list">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/admin/tickets/${ticket.id}`}
                className="admin-ticket-item"
              >
                <div>
                  <h4>#{ticket.id} {ticket.title}</h4>
                  <p>Priority: {ticket.priority}</p>
                </div>
                <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;