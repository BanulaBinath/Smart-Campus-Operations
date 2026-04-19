import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminTickets.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminTickets() {
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'ALL') return tickets;
    return tickets.filter((ticket) => ticket.status === statusFilter);
  }, [statusFilter, tickets]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-tickets-page">
        <div className="admin-tickets-header">
          <div>
            <h2>All Tickets</h2>
            <p>Review, filter, and open any ticket from the system.</p>
          </div>

          <div className="admin-ticket-filter">
            <label htmlFor="statusFilter">Filter by Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {loading && <p>Loading tickets...</p>}
        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

        {!loading && !errorMessage && (
          <div className="admin-tickets-table-wrapper">
            <table className="admin-tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.title || ticket.category || 'Maintenance Ticket'}</td>
                    <td>{ticket.location}</td>
                    <td>
                      <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${ticket.status.toLowerCase()}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{ticket.assignedTo || 'Not Assigned'}</td>
                    <td>
                      <Link
                        to={`/admin/tickets/${ticket.id}`}
                        className="admin-open-btn"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTickets.length === 0 && (
              <div className="admin-no-tickets">
                <p>No tickets found for this filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AdminTickets;