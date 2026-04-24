import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './nav.css';

function Nav() {
  return (
    <header className="nav-wrapper">
      <nav className="nav-inner">
        <Link to="/" className="brand flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-1.5 shadow-md">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 m-0">CampusOps</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="/#about">About Us</a>
          <a href="/#contact">Contact Us</a>
          <a href="/#facilities">Facilities</a>
          <Link to="/tickets" className="tickets-link">Support Tickets</Link>
          <Link to="/login" className="login-link">Login</Link>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
