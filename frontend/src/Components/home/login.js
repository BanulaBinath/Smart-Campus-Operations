import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../../api/axios';
import Nav from './nav';
import Footer from './footer';
import './login.css';

import { useAuth } from '../context/AuthContext';

function Login() {
  const { isAuthenticated, loading, fetchCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f4f9ff]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d57c8] border-t-transparent"></div>
      </div>
    );
  }

  // If already logged in via context, redirect to home/dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id.split('-')[1]]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Fetch the current user to update the global AuthContext state
      await fetchCurrentUser();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Nav />
      <main className="auth-main" id="about">
        <section className="auth-card">
          <h1>Welcome Back</h1>
          <p>Log in to continue managing your campus facility bookings.</p>

          {error && <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>
            <label htmlFor="login-email">Email</label>
            <input 
              id="login-email" 
              type="email" 
              placeholder="student@campus.edu" 
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="login-password">Password</label>
            <input 
              id="login-password" 
              type="password" 
              placeholder="Enter your password" 
              required
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Login with Email'}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <hr style={{ flex: 1, borderColor: '#c6ddff' }} />
              <span style={{ margin: '0 10px', color: '#4a6798', fontSize: '12px', fontWeight: 'bold' }}>OR USE SSO</span>
              <hr style={{ flex: 1, borderColor: '#c6ddff' }} />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'http://localhost:8080/oauth2/authorization/google';
              }}
              className="flex w-full items-center justify-center gap-3 rounded-[12px] border border-[#c6ddff] bg-white px-4 py-3 text-sm font-semibold text-[#0b347c] shadow-sm transition-all hover:bg-[#f4f9ff] hover:-translate-y-0.5"
              type="button"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
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
