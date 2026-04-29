import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import './AdminTechs.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminTechs() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [usersResponse, ticketsResponse] = await Promise.all([
          api.get('/users'),
          fetch(API_BASE_URL),
        ]);

        const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const techUsers = users.filter((u) => u?.role === 'TECHNICIAN');

        const tickets = ticketsResponse.ok ? await ticketsResponse.json() : [];

        const computed = techUsers.map((tech) => {
          const email = tech.email;
          const activeCount = Array.isArray(tickets)
            ? tickets.filter(
                (ticket) =>
                  ticket.assignedTo === email &&
                  ticket.status !== 'RESOLVED' &&
                  ticket.status !== 'CLOSED' &&
                  ticket.status !== 'REJECTED'
              ).length
            : 0;

          return {
            id: tech.id,
            name: email,
            role: tech.role === 'TECHNICIAN' ? 'Technician' : tech.role,
            activeTickets: activeCount,
            status: activeCount >= 3 ? 'Busy' : 'Available',
            displayName: tech.name || email,
          };
        });

        setTechnicians(computed);
      } catch (error) {
        console.error('Failed to load technicians:', error);
        setErrorMessage('Failed to load technicians.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6">
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

      {!loading && !errorMessage && technicians.length === 0 && (
        <div className="p-8 text-center text-[var(--color-text-muted)]">
          No technicians found.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white border border-[var(--color-border)] rounded-[12px] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-text)] mb-1">{tech.displayName || tech.name}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{tech.name}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                tech.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {tech.status}
              </span>
            </div>

            <div className="bg-[var(--color-bg)] rounded-[8px] p-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-muted)]">Active Tickets</span>
                <strong className="text-lg font-bold text-[var(--color-text)]">{tech.activeTickets}</strong>
              </div>
            </div>

            <button 
              className="w-full px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-[8px] hover:bg-[var(--color-primary-hover)] transition-colors"
              type="button"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTechs;