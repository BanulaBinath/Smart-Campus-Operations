import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load dashboard data.');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const stats = useMemo(() => {
    const openCount = tickets.filter((ticket) => ticket.status === 'OPEN').length;
    const progressCount = tickets.filter((ticket) => ticket.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter((ticket) => ticket.status === 'RESOLVED').length;
    const rejectedCount = tickets.filter((ticket) => ticket.status === 'REJECTED').length;

    return [
      { label: 'Open Tickets', count: openCount, color: 'open' },
      { label: 'In Progress', count: progressCount, color: 'progress' },
      { label: 'Resolved', count: resolvedCount, color: 'resolved' },
      { label: 'Rejected', count: rejectedCount, color: 'rejected' },
    ];
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tickets]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
          <p>Monitor ticket activity and manage the workflow.</p>
        </div>

        {loading && <p>Loading dashboard...</p>}
        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

        {!loading && !errorMessage && (
          <>
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
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/admin/tickets/${ticket.id}`}
                      className="admin-ticket-item"
                    >
                      <div>
                        <h4>
                          #{ticket.id} {ticket.title || ticket.category || 'Maintenance Ticket'}
                        </h4>
                        <p>Priority: {ticket.priority || 'N/A'}</p>
                      </div>
                      <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </Link>
                  ))
                ) : (
                  <p>No recent tickets found.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;