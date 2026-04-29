import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TopBar from '../../layout/TopBar';
import Sidebar from '../../layout/Sidebar';
import { useAuth } from '../../../context/AuthContext';
import './AdminTicketDetail.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

function AdminTicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserEmail = user?.email || '';
  const currentUserRole = user?.role || 'ADMIN';

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('OPEN');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const ticketResponse = await fetch(`${API_BASE_URL}/${id}`);
        if (!ticketResponse.ok) {
          const errorData = await ticketResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load ticket.');
        }

        const ticketData = await ticketResponse.json();
        setTicket(ticketData);
        setStatus(ticketData.status || 'OPEN');
        setRejectionReason(ticketData.rejectionReason || '');

        const commentsResponse = await fetch(`${API_BASE_URL}/${id}/comments`);
        if (!commentsResponse.ok) {
          const errorData = await commentsResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load comments.');
        }

        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading ticket details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${id}/status`, {
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
      setSuccessMessage(`Ticket marked as ${updatedTicket.status}.`);
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while updating the status.');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setErrorMessage('Rejection reason is required.');
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: rejectionReason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to reject ticket.');
      }

      const updatedTicket = await response.json();
      setTicket(updatedTicket);
      setStatus(updatedTicket.status);
      setRejectionReason(updatedTicket.rejectionReason || rejectionReason);
      setSuccessMessage('Ticket rejected successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while rejecting the ticket.');
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUserEmail) {
      setErrorMessage('Could not determine your account email. Please re-login.');
      return;
    }

    try {
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(`${API_BASE_URL}/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: newComment,
          createdBy: currentUserEmail,
          createdByRole: currentUserRole
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add comment.');
      }

      const createdComment = await response.json();
      setComments((prev) => [...prev, createdComment]);
      setNewComment('');
      setSuccessMessage('Comment added successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while sending the comment.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Sidebar />
        <div className="flex flex-1 flex-col md:ml-[240px]">
          <TopBar title="Support Tickets" />
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl">
              <div className="admin-ticket-detail-page">
                <p>Loading ticket details...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Sidebar />
        <div className="flex flex-1 flex-col md:ml-[240px]">
          <TopBar title="Support Tickets" />
          <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-full max-w-5xl">
              <div className="admin-ticket-detail-page">
                <p>Ticket not found.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Support Tickets" />

        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <div className="w-full max-w-5xl">
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
                    <p>{ticket.title || ticket.category || 'Maintenance Ticket'}</p>
                  </div>

                  <span className={`detail-status-badge ${status.toLowerCase()}`}>
                    {status.replace('_', ' ')}
                  </span>
                </div>

                {errorMessage && <p className="form-message error-message">{errorMessage}</p>}
                {successMessage && <p className="form-message success-message">{successMessage}</p>}

                <div className="admin-ticket-meta-grid">
                  <div className="meta-box">
                    <span>Category</span>
                    <strong>{ticket.category || 'N/A'}</strong>
                  </div>
                  <div className="meta-box">
                    <span>Location</span>
                    <strong>{ticket.location || 'N/A'}</strong>
                  </div>
                  <div className="meta-box">
                    <span>Priority</span>
                    <strong>{ticket.priority || 'N/A'}</strong>
                  </div>
                  <div className="meta-box">
                    <span>Submitted By</span>
                    <strong>{ticket.createdBy || 'N/A'}</strong>
                  </div>
                  <div className="meta-box">
                    <span>Assigned Technician</span>
                    <strong>{ticket.assignedTo || 'Not Assigned'}</strong>
                  </div>
                </div>

                <div className="admin-ticket-description">
                  <h3>Description</h3>
                  <p>{ticket.description || 'No description available.'}</p>
                </div>

                {status === 'REJECTED' && (
                  <div className="admin-ticket-description">
                    <h3>Rejection Reason</h3>
                    <p>{ticket.rejectionReason || rejectionReason}</p>
                  </div>
                )}

                <div className="admin-ticket-actions">
                  <Link to={`/admin/tickets/${ticket.id}/assign`} className="action-btn assign-btn">
                    Assign Technician
                  </Link>

                  <button
                    className="action-btn progress-btn"
                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                  >
                    Mark In Progress
                  </button>

                  <button
                    className="action-btn close-btn"
                    onClick={() => handleStatusUpdate('RESOLVED')}
                  >
                    Close
                  </button>

                  <button
                    className="action-btn reject-btn"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                </div>

                <div className="admin-comment-box" style={{ marginTop: '16px' }}>
                  <input
                    type="text"
                    placeholder="Enter rejection reason before rejecting..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-comments-card">
                <h3>Comments</h3>

                <div className="admin-comments-list">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="admin-comment-item">
                        <strong>{comment.createdBy || 'User'}</strong>
                        <p>{comment.message}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>

                <div className="admin-comment-box">
                  <input
                    type="text"
                    placeholder="Type a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={handleSendComment}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminTicketDetail;