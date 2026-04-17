import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './nav';
import Footer from './footer';
import './signUp.css';

function SignUp() {
  return (
    <div className="signup-page">
      <Nav />
      <main className="signup-main" id="about">
        <section className="signup-card">
          <h1>Create Your Account</h1>
          <p>Join Smart Campus Operations and start booking facilities in seconds.</p>

          <form className="signup-form">
            <label htmlFor="signup-name">Full Name</label>
            <input id="signup-name" type="text" placeholder="Your full name" />

            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" placeholder="student@campus.edu" />

            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" placeholder="Create a password" />

            <button type="button" className="signup-btn">Sign Up</button>
          </form>

          <p className="signup-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default SignUp;

  