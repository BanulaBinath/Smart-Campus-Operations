import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminTickets.css';

function AdminTickets() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const tickets = [
    {
      id: 1,
      title: 'Broken Projector',
      location: 'A401',
      priority: 'High',
      status: 'OPEN',
      assignedTo: 'Not Assigned',
    },
    {
      id: 2,
      title: 'AC Not Working',
      location: 'B203',
      priority: 'Low',
      status: 'IN_PROGRESS',
      assignedTo: 'Nimal',
    },
    {
      id: 3,
      title: 'Damaged Chair',
      location: 'C110',
      priority: 'Medium',
      status: 'RESOLVED',
      assignedTo: 'Kasun',
    },
    {
      id: 4,
      title: 'Lab PC Not Booting',
      location: 'Lab 2',
      priority: 'High',
      status: 'REJECTED',
      assignedTo: 'Not Assigned',
    },
  ];

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
            </select>
          </div>
        </div>

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
                  <td>{ticket.title}</td>
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
                  <td>{ticket.assignedTo}</td>
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
      </div>
    </DashboardLayout>
  );
}

export default AdminTickets;