import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './UserDashboard.css';

function UserDashboard() {
  const tickets = [
    {
      id: 'TCK-1001',
      location: 'Lecture Hall A401',
      category: 'Projector Issue',
      priority: 'HIGH',
      status: 'OPEN',
      createdDate: '2026-04-18'
    },
    {
      id: 'TCK-1002',
      location: 'Computer Lab B202',
      category: 'Air Conditioning',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdDate: '2026-04-17'
    },
    {
      id: 'TCK-1003',
      location: 'Library 2nd Floor',
      category: 'Lighting',
      priority: 'LOW',
      status: 'RESOLVED',
      createdDate: '2026-04-16'
    }
  ];

  return (
    <DashboardLayout role="USER">
      <section className="user-dashboard-box">
        <div className="dashboard-top-row">
          <div>
            <h1>My Tickets</h1>
            <p>View your submitted maintenance tickets and track their current progress.</p>
          </div>

          <Link to="/tickets/create" className="create-ticket-btn">
            Create Ticket
          </Link>
        </div>

        <div className="ticket-list-wrap">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div className="ticket-card-top">
                <div>
                  <h3>{ticket.id}</h3>
                  <p className="ticket-location">{ticket.location}</p>
                </div>

                <span className={`status-badge status-${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>

              <div className="ticket-meta-grid">
                <div className="ticket-meta-item">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{ticket.category}</span>
                </div>

                <div className="ticket-meta-item">
                  <span className="meta-label">Priority</span>
                  <span className={`priority-badge priority-${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </div>

                <div className="ticket-meta-item">
                  <span className="meta-label">Created Date</span>
                  <span className="meta-value">{ticket.createdDate}</span>
                </div>
              </div>

              <div className="ticket-card-actions">
                <Link to={`/tickets/chat/${ticket.id}`} className="ticket-action-link">
                  Open Conversation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default UserDashboard;