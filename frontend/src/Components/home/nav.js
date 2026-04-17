import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';

function Nav() {
  return (
    <header className="nav-wrapper">
      <nav className="nav-inner">
        <Link to="/" className="brand">Smart Campus</Link>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact Us</a>
          <a href="#facilities">Facilities</a>
          <Link to="/login" className="login-link">Login</Link>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
  