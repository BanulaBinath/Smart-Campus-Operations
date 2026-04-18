import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="ticket-sidebar">
      <h3 className="ticket-sidebar-title">Support Tickets</h3>

      <div className="ticket-sidebar-links">
        <Link to="/tickets">Dashboard</Link>
        <Link to="/tickets/create">Create Ticket</Link>
        <Link to="/tickets/chat">Ticket Chat</Link>
      </div>
    </aside>
  );
}

export default Sidebar;