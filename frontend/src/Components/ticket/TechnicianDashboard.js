import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TechnicianDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';
const CURRENT_TECHNICIAN = 'tech1@example.com';

function TechnicianDashboard() {
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAssignedTickets = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await fetch(`${API_BASE_URL}/technician/${CURRENT_TECHNICIAN}`);

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
  }, []);

  return (
    <DashboardLayout role="TECHNICIAN">
      <section className="technician-dashboard-page">
        <div className="technician-dashboard-header">
          <h1>My Assigned Tickets</h1>
          <p>View your assigned maintenance issues and continue work from here.</p>
        </div>

        {loading && <p>Loading assigned tickets...</p>}
        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

        {!loading && !errorMessage && assignedTickets.length === 0 && (
          <p>No assigned tickets found.</p>
        )}

        {!loading && !errorMessage && assignedTickets.length > 0 && (
          <div className="technician-ticket-grid">
            {assignedTickets.map((ticket) => (
              <Link
                to={`/tickets/technician/${ticket.id}`}
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
    </DashboardLayout>
  );
}

export default TechnicianDashboard;