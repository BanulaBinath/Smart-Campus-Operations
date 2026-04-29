import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../layout/TopBar';
import Sidebar from '../../layout/Sidebar';
import api from '../../../api/axios';
import './AdminAssignTechnician.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminAssignTechnician() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const techOptions = useMemo(() => {
    return technicians
      .filter((t) => !!t?.email)
      .map((t) => ({
        value: t.email,
        label: t.name ? `${t.name} (${t.email})` : t.email,
      }));
  }, [technicians]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [ticketRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/${id}`),
          api.get('/users'),
        ]);

        if (!ticketRes.ok) {
          const errorData = await ticketRes.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load ticket.');
        }

        const ticketData = await ticketRes.json();
        setTicket(ticketData);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const techUsers = users.filter((u) => u?.role === 'TECHNICIAN');
        setTechnicians(techUsers);

        const currentAssigned = ticketData.assignedTo;
        const techEmails = techUsers.map((u) => u.email).filter(Boolean);
        const defaultTech = techEmails.includes(currentAssigned) ? currentAssigned : techEmails[0] || '';
        setSelectedTech(defaultTech);
      } catch (err) {
        setErrorMessage(err?.message || 'Something went wrong while loading ticket.');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleAssign = async () => {
    if (!selectedTech) {
      setErrorMessage('Please select a technician.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const res = await fetch(`${API_BASE_URL}/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignedTo: selectedTech }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to assign technician.');
      }

      await res.json();
      navigate(`/admin/tickets/${id}`);
    } catch (err) {
      setErrorMessage(err?.message || 'Something went wrong while assigning technician.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Support Tickets" />

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <div className="admin-assign-page">
              <div className="admin-assign-topbar">
                <Link to={`/admin/tickets/${id}`} className="admin-back-link">
                  ← Back to Ticket
                </Link>
              </div>

              <div className="admin-assign-card">
                <h2 className="admin-assign-title">Assign Technician</h2>

                {loading && <p>Loading ticket...</p>}

                {!loading && ticket && (
                  <p className="admin-assign-subtitle">
                    Ticket #{ticket.id} • Current: {ticket.assignedTo || 'Not Assigned'}
                  </p>
                )}

                {errorMessage && (
                  <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-[8px] text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                {!loading && (
                  <div className="admin-assign-form">
                    <label htmlFor="technician" className="admin-assign-label">
                      Technician
                    </label>

                    <select
                      id="technician"
                      value={selectedTech}
                      onChange={(e) => setSelectedTech(e.target.value)}
                      className="admin-assign-select"
                      disabled={techOptions.length === 0}
                    >
                      {techOptions.length > 0 ? (
                        techOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))
                      ) : (
                        <option value="">No technicians found</option>
                      )}
                    </select>

                    <button
                      type="button"
                      className="admin-assign-btn"
                      onClick={handleAssign}
                      disabled={submitting || loading}
                    >
                      {submitting ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminAssignTechnician;
