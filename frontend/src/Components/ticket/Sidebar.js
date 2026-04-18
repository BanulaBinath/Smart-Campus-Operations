import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ role }) {
  const menus = {
    USER: [
      { to: '/tickets', label: 'Dashboard' },
      { to: '/tickets/create', label: 'Create Ticket' },
      { to: '/tickets/chat', label: 'Comments' },
    ],
    TECHNICIAN: [
      { to: '/technician', label: 'Dashboard' },
      { to: '/technician/tickets', label: 'My Tickets' },
      { to: '/technician/chat', label: 'Comments' },
    ],
    ADMIN: [
      { to: '/admin', label: 'Stats' },
      { to: '/admin/tickets', label: 'All Tickets' },
      { to: '/admin/techs', label: 'Techs' },
    ],
  };

  const links = menus[role] || [];

  return (
    <aside className="ticket-sidebar">
      <h3 className="ticket-sidebar-title">
        {role === 'ADMIN'
          ? 'Admin Panel'
          : role === 'TECHNICIAN'
          ? 'Technician Panel'
          : 'Support Tickets'}
      </h3>

      <div className="ticket-sidebar-links">
        {links.map((item) => (
          <Link key={item.to} to={item.to}>
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;