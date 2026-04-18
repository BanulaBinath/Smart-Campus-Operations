import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';
import './AdminTicketDetail.css';

function AdminTicketDetail() {
  const { id } = useParams();
  const [status, setStatus] = useState('OPEN');

  const ticket = {
    id,
    title: 'Broken Projector',
    category: 'Equipment',
    location: 'A401',
    priority: 'High',
    description: 'The classroom projector is not turning on during lectures.',
    submittedBy: 'Kamal Perera',
    assignedTo: 'Not Assigned',
  };

  const comments = [
    { id: 1, author: 'Admin', text: 'We are checking this issue now.' },
    { id: 2, author: 'User', text: 'This is affecting the 10 AM lecture.' },
  ];

  return (
    <DashboardLayout role="ADMIN">
      <div className="admin-ticket-detail-page">
        <div className="admin-ticket-topbar">
          <Link to="/admin/tickets" className="admin-back-link">
            ← Back to All Tickets
          </Link>
        </div>

        <div className="admin-ticket-detail-card">
          <div className="admin-ticket-detail-header">
            <div>
              <h2>Ticket #{ticket.id}</h2>
              <p>{ticket.title}</p>
            </div>

            <span className={`detail-status-badge ${status.toLowerCase()}`}>
              {status.replace('_', ' ')}
            </span>
          </div>

          <div className="admin-ticket-meta-grid">
            <div className="meta-box">
              <span>Category</span>
              <strong>{ticket.category}</strong>
            </div>
            <div className="meta-box">
              <span>Location</span>
              <strong>{ticket.location}</strong>
            </div>
            <div className="meta-box">
              <span>Priority</span>
              <strong>{ticket.priority}</strong>
            </div>
            <div className="meta-box">
              <span>Submitted By</span>
              <strong>{ticket.submittedBy}</strong>
            </div>
            <div className="meta-box">
              <span>Assigned Technician</span>
              <strong>{ticket.assignedTo}</strong>
            </div>
          </div>

          <div className="admin-ticket-description">
            <h3>Description</h3>
            <p>{ticket.description}</p>
          </div>

          <div className="admin-ticket-actions">
            <Link to={`/admin/tickets/${ticket.id}/assign`} className="action-btn assign-btn">
              Assign Technician
            </Link>

            <button
              className="action-btn progress-btn"
              onClick={() => setStatus('IN_PROGRESS')}
            >
              Mark In Progress
            </button>

            <button
              className="action-btn close-btn"
              onClick={() => setStatus('RESOLVED')}
            >
              Close
            </button>

            <button
              className="action-btn reject-btn"
              onClick={() => setStatus('REJECTED')}
            >
              Reject
            </button>
          </div>
        </div>

        <div className="admin-comments-card">
          <h3>Comments</h3>

          <div className="admin-comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="admin-comment-item">
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="admin-comment-box">
            <input type="text" placeholder="Type a comment..." />
            <button>Send</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminTicketDetail;