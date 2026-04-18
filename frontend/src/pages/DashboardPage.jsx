import React from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../Components/layout/TopBar';
import Sidebar from '../Components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Extract role prefix from path (e.g. /admin/dashboard -> admin)
  const rolePrefix = location.pathname.split('/')[1] || 'student';
  const roleTitle = rolePrefix.charAt(0).toUpperCase() + rolePrefix.slice(1);
  
  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title={`${roleTitle} Dashboard`} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8">
             <h2 className="text-2xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h2>
             <p className="text-[var(--color-text-muted)]">Here's your {rolePrefix} view of campus operations today.</p>
          </div>
          
          {/* Quick Metrics Stubs */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              { title: 'My Bookings', value: '2', color: 'var(--color-primary)' },
              { title: 'Open Tickets', value: '1', color: 'var(--color-warning)' },
              { title: 'Facilities Online', value: '24', color: 'var(--color-success)' },
              { title: 'Pending Approval', value: '0', color: 'var(--color-info)' }
            ].map((stat) => (
              <div key={stat.title} className="rounded-xl bg-white p-6 shadow-sm border border-[var(--color-border)]">
                <p className="text-sm font-medium text-[var(--color-text-muted)] mb-2">{stat.title}</p>
                <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="p-8 border-2 border-dashed border-[var(--color-border)] rounded-xl bg-[var(--color-bg)]/50 text-center">
             <h3 className="text-lg font-semibold text-[var(--color-text-muted)]">Dashboard Area</h3>
             <p className="text-sm text-[var(--color-text-placeholder)] mt-2">
               (Colleague handles Module A, B, and C implementations which will integrate here)
             </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
