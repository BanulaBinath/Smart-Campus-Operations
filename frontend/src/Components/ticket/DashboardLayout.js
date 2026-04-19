import React from 'react';
import Nav from '../home/nav';
import Footer from '../home/footer';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout({ children, role }) {
  return (
    <div className="dashboard-page">
      <Nav />

      <div className="dashboard-body">
        <Sidebar role={role} />

        <main className="dashboard-content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default DashboardLayout;