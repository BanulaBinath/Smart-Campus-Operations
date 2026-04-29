import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../layout/TopBar';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import './UserDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function UserDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        if (!user?.email) {
          setTickets([]);
          setLoading(false);
          setErrorMessage('Could not determine your account email. Please re-login.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(user.email)}`);

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
  }, [user?.email]);

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Support Tickets" />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <section className="user-dashboard-box max-w-6xl mx-auto">
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
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;