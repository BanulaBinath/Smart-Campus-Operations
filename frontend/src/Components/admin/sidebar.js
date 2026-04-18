import React from 'react'
import { Link } from 'react-router-dom'
import './sidebar.css'

function Sidebar() {
  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: 'D' },
    { to: '/admin/facilities', label: 'Manage Facilities', icon: 'M' },
    { to: '/admin/add-facility', label: 'Add Facility', icon: 'A' },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">SC</div>
        <div>
          <p className="brand-kicker">Admin Panel</p>
          <h1>Smart Campus Admin</h1>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to} className="sidebar-link">
            <span className="sidebar-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
