import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminTechs.css';

function AdminTechs() {
  const navigate = useNavigate();
  const { id } = useParams();

  const technicians = [
    { id: 1, name: 'Nimal', role: 'IT Technician', activeTickets: 3, status: 'Available' },
    { id: 2, name: 'Kasun', role: 'Electrical Technician', activeTickets: 1, status: 'Available' },
    { id: 3, name: 'Saman', role: 'Maintenance Technician', activeTickets: 5, status: 'Busy' },
    { id: 4, name: 'Ravindu', role: 'Network Technician', activeTickets: 2, status: 'Available' },
  ];

  const handleAssign = (techName) => {
    alert(`Assigned to ${techName}`);
    navigate(`/admin/tickets/${id}`);
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

        <div className="admin-techs-grid">
          {technicians.map((tech) => (
            <div key={tech.id} className="admin-tech-card">
              <div className="admin-tech-card-top">
                <div>
                  <h3>{tech.name}</h3>
                  <p>{tech.role}</p>
                </div>
                <span
                  className={`tech-status ${tech.status.toLowerCase()}`}
                >
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
                  >
                    Select
                  </button>
                ) : (
                  <button className="admin-tech-view-btn">
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