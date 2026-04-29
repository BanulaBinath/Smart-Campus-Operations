import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../layout/TopBar';
import Sidebar from '../layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import './TechnicianDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function TechnicianDashboard() {
  const { user } = useAuth();
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        if (!user?.email) {
          setAssignedTickets([]);
          setLoading(false);
          setErrorMessage('Could not determine your account email. Please re-login.');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/technician/${encodeURIComponent(user.email)}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load assigned tickets.');
        }

        const data = await response.json();
        setAssignedTickets(data);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading technician tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTickets();
  }, [user?.email]);

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="My Assigned Tickets" />

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <section className="technician-dashboard-page">
              <div className="technician-dashboard-header">
                <h1>My Assigned Tickets</h1>
                <p>View your assigned maintenance issues and continue work from here.</p>
              </div>

              {loading && <p>Loading assigned tickets...</p>}
              {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

              {!loading && !errorMessage && assignedTickets.length === 0 && <p>No assigned tickets found.</p>}

              {!loading && !errorMessage && assignedTickets.length > 0 && (
                <div className="technician-ticket-grid">
                  {assignedTickets.map((ticket) => (
                    <Link
                      to={`/technician/tickets/${ticket.id}`}
                      className="technician-ticket-card"
                      key={ticket.id}
                    >
                      <span className="ticket-id">Ticket #{ticket.id}</span>
                      <h3>{ticket.category}</h3>
                      <p>{ticket.location}</p>
                      <span className={`tech-status-badge tech-status-${ticket.status.toLowerCase()}`}>
                        {ticket.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TechnicianDashboard;