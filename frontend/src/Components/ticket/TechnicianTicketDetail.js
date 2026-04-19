import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TechnicianTicketDetail.css';

function TechnicianTicketDetail() {
  const { ticketId } = useParams();

  const ticket = useMemo(() => {
    const sampleTickets = [
      { id: 'TCK-1001', title: 'Broken Projector', location: 'Lecture Hall A401' },
      { id: 'TCK-1005', title: 'AC Not Working', location: 'Computer Lab B202' },
      { id: 'TCK-1008', title: 'Damaged Chair', location: 'Library 2nd Floor' },
    ];

    return sampleTickets.find((t) => t.id === ticketId) || sampleTickets[0];
  }, [ticketId]);

  const [status, setStatus] = useState('IN_PROGRESS');
  const [resolutionNote, setResolutionNote] = useState('');

  return (
    <DashboardLayout role="TECHNICIAN">
      <section className="technician-detail-page">
        <div className="technician-detail-top">
          <Link to="/tickets/technician" className="back-link">
            ← Back
          </Link>
        </div>

        <div className="technician-detail-card">
          <div className="technician-detail-header">
            <div>
              <h1>TICKET {ticket.id} DETAIL</h1>
              <p>
                {ticket.title} — {ticket.location}
              </p>
            </div>

            <div className="status-select-group">
              <label>Status:</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
              <span className="status-help">can change status from here</span>
            </div>
          </div>

          <div className="evidence-section">
            <h3>Evidence Images</h3>
            <div className="evidence-grid">
              <div className="evidence-box">Image 1</div>
              <div className="evidence-box">Image 2</div>
              <div className="evidence-box">Image 3</div>
            </div>
          </div>

          <div className="tech-chat-section">
            <h3>Chat Section</h3>
            <div className="tech-chat-box">
              <div className="tech-chat-message user-msg">
                <strong>User:</strong> The projector is not turning on during lectures.
              </div>
              <div className="tech-chat-message tech-msg">
                <strong>You:</strong> I am checking the issue now.
              </div>
            </div>

            <textarea
              className="resolution-note"
              rows="4"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add resolution note..."
            ></textarea>

            <button type="button" className="save-note-btn">
              Save Note
            </button>

            <div className="tech-chat-input-row">
              <input type="text" placeholder="Type message..." />
              <button type="button">Send</button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default TechnicianTicketDetail;