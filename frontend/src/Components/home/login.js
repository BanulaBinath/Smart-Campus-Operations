import React from 'react';
import { Link } from 'react-router-dom';
import Nav from './nav';
import Footer from './footer';
import './login.css';

function Login() {
  return (
    <div className="auth-page">
      <Nav />
      <main className="auth-main" id="about">
        <section className="auth-card">
          <h1>Welcome Back</h1>
          <p>Log in to continue managing your campus facility bookings.</p>

          <form className="auth-form">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" type="email" placeholder="student@campus.edu" />

            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" placeholder="Enter your password" />

            <button type="button" className="auth-btn">Login</button>
          </form>

          <p className="auth-switch">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
