import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TechnicianDashboard.css';

function TechnicianDashboard() {
  const assignedTickets = [
    { id: 'TCK-1001', title: 'Broken Projector', location: 'Lecture Hall A401', status: 'IN_PROGRESS' },
    { id: 'TCK-1005', title: 'AC Not Working', location: 'Computer Lab B202', status: 'OPEN' },
    { id: 'TCK-1008', title: 'Damaged Chair', location: 'Library 2nd Floor', status: 'OPEN' }
  ];

  return (
    <DashboardLayout role="TECHNICIAN">
      <section className="technician-dashboard-page">
        <div className="technician-dashboard-header">
          <h1>My Assigned Tickets</h1>
          <p>View your assigned maintenance issues and continue work from here.</p>
        </div>

        <div className="technician-ticket-grid">
          {assignedTickets.map((ticket) => (
            <Link
              to={`/tickets/technician/${ticket.id}`}
              className="technician-ticket-card"
              key={ticket.id}
            >
              <span className="ticket-id">{ticket.id}</span>
              <h3>{ticket.title}</h3>
              <p>{ticket.location}</p>
              <span className={`tech-status-badge tech-status-${ticket.status.toLowerCase()}`}>
                {ticket.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default TechnicianDashboard;