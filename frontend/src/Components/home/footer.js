import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div>
          <h3>Smart Campus Operations</h3>
          <p>
            A student-friendly platform to simplify facility scheduling, bookings, and campus activity planning.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#facilities">Facilities</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4>Contact Information</h4>
          <p>Email: support@smartcampus.edu</p>
          <p>Phone: +94 11 555 1234</p>
          <p>Address: Student Services Center, Main Campus</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright 2026 Smart Campus Operations. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
