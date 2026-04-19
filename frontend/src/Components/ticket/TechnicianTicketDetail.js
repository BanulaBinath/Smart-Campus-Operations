import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TechnicianTicketDetail.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function TechnicianTicketDetail() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [resolutionNote, setResolutionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const ticketResponse = await fetch(`${API_BASE_URL}/${ticketId}`);
        if (!ticketResponse.ok) {
          const errorData = await ticketResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load ticket.');
        }

        const ticketData = await ticketResponse.json();
        setTicket(ticketData);
        setStatus(ticketData.status || 'OPEN');
        setResolutionNote(ticketData.resolutionNotes || '');

        const attachmentResponse = await fetch(`${API_BASE_URL}/${ticketId}/attachments`);
        if (!attachmentResponse.ok) {
          const errorData = await attachmentResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load attachments.');
        }

        const attachmentData = await attachmentResponse.json();
        setAttachments(attachmentData);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading the ticket.');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId]);

  const handleStatusChange = async (newStatus) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update status.');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
      setSuccessMessage('Status updated successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while updating status.');
    }
  };

  const handleSaveResolution = async () => {
    if (!resolutionNote.trim()) {
      setErrorMessage('Resolution note cannot be empty.');
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${ticketId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resolutionNotes: resolutionNote })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save resolution note.');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
      setResolutionNote(updatedTicket.resolutionNotes || '');
      setSuccessMessage('Resolution note saved and ticket marked as RESOLVED.');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while saving the resolution note.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="TECHNICIAN">
        <section className="technician-detail-page">
          <p>Loading ticket details...</p>
        </section>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout role="TECHNICIAN">
        <section className="technician-detail-page">
          <p>Ticket not found.</p>
        </section>
      </DashboardLayout>
    );
  }

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
                {ticket.category} — {ticket.location}
              </p>
            </div>

            <div className="status-select-group">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setStatus(newStatus);
                  handleStatusChange(newStatus);
                }}
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
              <span className="status-help">can change status from here</span>
            </div>
          </div>

          {errorMessage && <p className="form-message error-message">{errorMessage}</p>}
          {successMessage && <p className="form-message success-message">{successMessage}</p>}

          <div className="evidence-section">
            <h3>Evidence Images</h3>
            <div className="evidence-grid">
              {attachments.length > 0 ? (
                attachments.map((attachment) => (
                  <div className="evidence-box" key={attachment.id}>
                    <p>{attachment.fileName}</p>
                  </div>
                ))
              ) : (
                <div className="evidence-box">No images uploaded</div>
              )}
            </div>
          </div>

          <div className="tech-chat-section">
            <h3>Ticket Details</h3>
            <div className="tech-chat-box">
              <div className="tech-chat-message user-msg">
                <strong>Description:</strong> {ticket.description}
              </div>
              <div className="tech-chat-message tech-msg">
                <strong>Priority:</strong> {ticket.priority}
              </div>
              <div className="tech-chat-message tech-msg">
                <strong>Contact:</strong> {ticket.contactDetails}
              </div>
            </div>

            <textarea
              className="resolution-note"
              rows="4"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add resolution note..."
            ></textarea>

            <button type="button" className="save-note-btn" onClick={handleSaveResolution}>
              Save Note
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default TechnicianTicketDetail;