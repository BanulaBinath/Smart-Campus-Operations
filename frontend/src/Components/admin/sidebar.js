import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  const location = useLocation();

  const links = [
    { path: '/admin', label: '📊 Dashboard' },
    { path: '/admin/bookings', label: '📅 Bookings' },
    { path: '/admin/facilities', label: '🏛️ Facilities' },
    { path: '/admin/tickets', label: '🔧 Maintenance' },
    { path: '/admin/users', label: '👥 Users' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>Smart Campus</h2>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link to="/" className="sidebar-link">🚪 Logout</Link>
      </div>
    </div>
  );
}

export default Sidebar;