import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../../layout/TopBar';
import Sidebar from '../../layout/Sidebar';
import AdminTickets from './AdminTickets';
import AdminTechs from './AdminTechs';
import './AdminDashboard.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminDashboard({ initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'dashboard' | 'tickets' | 'technicians'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchTickets();
    }
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load dashboard data.');
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while loading dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const openCount = tickets.filter((ticket) => ticket.status === 'OPEN').length;
    const progressCount = tickets.filter((ticket) => ticket.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter((ticket) => ticket.status === 'RESOLVED').length;
    const rejectedCount = tickets.filter((ticket) => ticket.status === 'REJECTED').length;

    return [
      { label: 'Open Tickets', count: openCount, color: 'open' },
      { label: 'In Progress', count: progressCount, color: 'progress' },
      { label: 'Resolved', count: resolvedCount, color: 'resolved' },
      { label: 'Rejected', count: rejectedCount, color: 'rejected' },
    ];
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [tickets]);

  const renderContent = () => {
    if (activeTab === 'tickets') {
      return <AdminTickets />;
    }
    
    if (activeTab === 'technicians') {
      return <AdminTechs />;
    }

    // Dashboard view
    return (
      <>
        {loading && (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          </div>
        )}
        
        {errorMessage && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-[8px] text-red-700 text-sm">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((item) => (
                <div 
                  key={item.label} 
                  className={`admin-stat-card ${item.color} bg-[var(--color-surface)] rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-t-4`}
                >
                  <h3 className="text-3xl font-bold mb-2">{item.count}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[var(--color-surface)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Recent Tickets</h3>
                <button 
                  onClick={() => setActiveTab('tickets')}
                  className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-[var(--color-border)]">
                {recentTickets.length > 0 ? (
                  recentTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/admin/tickets/${ticket.id}`}
                      className="flex items-center justify-between p-4 hover:bg-[var(--color-bg)] transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-[var(--color-text)] mb-1">
                          Ticket #{ticket.id} - {ticket.title || ticket.category || 'Maintenance Ticket'}
                        </h4>
                        <p className="text-sm text-[var(--color-text-muted)]">
                          Priority: {ticket.priority || 'N/A'} • Created: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === 'OPEN' ? 'bg-red-100 text-red-700' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                        ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center text-[var(--color-text-muted)]">
                    No recent tickets found.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Support Tickets" />
        
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-text)]">
                  {activeTab === 'dashboard' && 'Admin Dashboard'}
                  {activeTab === 'tickets' && 'All Tickets'}
                  {activeTab === 'technicians' && 'Technician Management'}
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {activeTab === 'dashboard' && 'Monitor ticket activity and manage the workflow.'}
                  {activeTab === 'tickets' && 'Review, filter, and manage all tickets in the system.'}
                  {activeTab === 'technicians' && 'View technician roles and their current workload.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 bg-[var(--color-surface)] p-1 border border-[var(--color-border)] rounded-[10px]">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-[8px] ${
                    activeTab === 'dashboard' 
                      ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-[8px] ${
                    activeTab === 'tickets' 
                      ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  All Tickets
                </button>
                <button
                  onClick={() => setActiveTab('technicians')}
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-[8px] ${
                    activeTab === 'technicians' 
                      ? 'bg-[var(--color-primary)] text-white shadow-sm' 
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  Technicians
                </button>
              </div>
            </div>

            <div className="bg-[var(--color-surface)] rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;