import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminTechs.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminTechs() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [technicians, setTechnicians] = useState([
    { id: 1, name: 'tech1@example.com', role: 'IT Technician', activeTickets: 0, status: 'Available' },
    { id: 2, name: 'tech2@example.com', role: 'Electrical Technician', activeTickets: 0, status: 'Available' },
    { id: 3, name: 'tech3@example.com', role: 'Maintenance Technician', activeTickets: 0, status: 'Available' },
    { id: 4, name: 'tech4@example.com', role: 'Network Technician', activeTickets: 0, status: 'Available' },
  ]);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [assigningTech, setAssigningTech] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
          return;
        }

        const tickets = await response.json();

        setTechnicians((prev) =>
          prev.map((tech) => {
            const activeCount = tickets.filter(
              (ticket) =>
                ticket.assignedTo === tech.name &&
                ticket.status !== 'RESOLVED' &&
                ticket.status !== 'CLOSED' &&
                ticket.status !== 'REJECTED'
            ).length;

            return {
              ...tech,
              activeTickets: activeCount,
              status: activeCount >= 3 ? 'Busy' : 'Available',
            };
          })
        );
      } catch (error) {
      }
    };

    fetchTickets();
  }, []);

  const handleAssign = async (techName) => {
    if (!id) return;

    try {
      setAssigningTech(techName);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${id}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: techName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to assign technician.');
      }

      setSuccessMessage(`Assigned to ${techName} successfully.`);

      setTimeout(() => {
        navigate(`/admin/tickets/${id}`);
      }, 700);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while assigning technician.');
    } finally {
      setAssigningTech('');
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-techs-page">
        <div className="admin-techs-header">
          <div>
            <h2>{id ? 'Select a Technician' : 'Technician Management'}</h2>
            <p>
              {id
                ? 'Choose a technician to assign for this ticket.'
                : 'View technician roles and their current workload.'}
            </p>
          </div>

          {id && (
            <Link to={`/admin/tickets/${id}`} className="admin-techs-back-btn">
              Back to Ticket
            </Link>
          )}
        </div>

        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}
        {successMessage && <p className="form-message success-message">{successMessage}</p>}

        <div className="admin-techs-grid">
          {technicians.map((tech) => (
            <div key={tech.id} className="admin-tech-card">
              <div className="admin-tech-card-top">
                <div>
                  <h3>{tech.name}</h3>
                  <p>{tech.role}</p>
                </div>
                <span className={`tech-status ${tech.status.toLowerCase()}`}>
                  {tech.status}
                </span>
              </div>

              <div className="admin-tech-info">
                <div className="tech-info-box">
                  <span>Active Tickets</span>
                  <strong>{tech.activeTickets}</strong>
                </div>
              </div>

              <div className="admin-tech-actions">
                {id ? (
                  <button
                    className="admin-tech-select-btn"
                    onClick={() => handleAssign(tech.name)}
                    disabled={assigningTech === tech.name}
                  >
                    {assigningTech === tech.name ? 'Assigning...' : 'Select'}
                  </button>
                ) : (
                  <button className="admin-tech-view-btn" type="button">
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminTechs;