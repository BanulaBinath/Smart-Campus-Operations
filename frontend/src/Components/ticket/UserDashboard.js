import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './UserDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';
const CURRENT_USER = 'user@example.com';

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await fetch(`${API_BASE_URL}/user/${CURRENT_USER}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load tickets.');
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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

        {loading && <p>Loading tickets...</p>}
        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

        {!loading && !errorMessage && tickets.length === 0 && (
          <p>No tickets found yet.</p>
        )}

        {!loading && !errorMessage && tickets.length > 0 && (
          <div className="ticket-list-wrap">
            {tickets.map((ticket) => (
              <div className="ticket-card" key={ticket.id}>
                <div className="ticket-card-top">
                  <div>
                    <h3>Ticket #{ticket.id}</h3>
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
                    <span className="meta-value">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
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
        )}
      </section>
    </DashboardLayout>
  );
}

export default UserDashboard;