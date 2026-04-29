import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-sm font-semibold text-[var(--color-text)]">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[var(--color-border)] rounded-[8px] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-[var(--color-primary)] cursor-pointer"
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

      {loading && (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-[8px] text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {!loading && !errorMessage && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">#{ticket.id}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text)]">{ticket.title || ticket.category || 'Maintenance Ticket'}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{ticket.location}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      ticket.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                      ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                      ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-text-muted)]">{ticket.assignedTo || 'Not Assigned'}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/tickets/${ticket.id}`}
                      className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTickets.length === 0 && (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              No tickets found for this filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminTickets;