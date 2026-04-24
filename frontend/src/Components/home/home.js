import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './nav';
import Footer from './footer';
import './home.css';

function Home() {
  const features = [
    {
      title: 'Lecture Hall',
      text: 'Reserve modern lecture spaces with real-time availability and schedule tracking.'
    },
    {
      title: 'Conference Hall',
      text: 'Book professional meeting halls for seminars, presentations, and student events.'
    },
    {
      title: 'Sports Ground',
      text: 'Plan games and tournaments by checking open slots for campus sports grounds.'
    },
    {
      title: 'Sports Items',
      text: 'Request and manage sports equipment with quick pickup and return workflows.'
    }
  ];

  return (
    <div className="home-page">
      <Nav />

      <section className="hero" id="home">

        <div className="hero-content">
          <p className="hero-tag">Smart Booking. Smooth Campus Life.</p>
          <h1 style={{ fontWeight: '900', letterSpacing: '-0.02em', color: '#1a56db' }}>Welcome to CampusOps</h1>

          <p>
            Manage bookings for lecture halls, conference halls, sports grounds, and facility items
            from one student-friendly platform designed for speed and clarity.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/signup" className="btn btn-secondary">Sign Up</Link>
          </div>
        </div>
      </section>

      <section className="about-strip" id="about">
        <div className="about-inner">
          <h2>Built for Students, Staff, and Campus Teams</h2>
          <p>
            CampusOps helps everyone coordinate spaces and resources with fewer
            conflicts, faster approvals, and a better campus experience.
          </p>
        </div>
      </section>

      <section className="features" id="facilities">
        <div className="section-heading">
          <h2>Facility Highlights</h2>
          <p>Everything you need to run your academic and activity schedule seamlessly.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;