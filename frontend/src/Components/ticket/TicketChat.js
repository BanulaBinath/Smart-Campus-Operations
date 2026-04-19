import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TicketChat.css';

const API_BASE_URL = 'http://localhost:8080/api/tickets';
const CURRENT_USER = 'user@example.com';

function TicketChat({ role = 'USER' }) {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const ticketResponse = await fetch(`${API_BASE_URL}/${ticketId}`);
        if (!ticketResponse.ok) {
          const errorData = await ticketResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load ticket.');
        }

        const ticketData = await ticketResponse.json();
        setTicket(ticketData);

        const commentsResponse = await fetch(`${API_BASE_URL}/${ticketId}/comments`);
        if (!commentsResponse.ok) {
          const errorData = await commentsResponse.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load comments.');
        }

        const commentsData = await commentsResponse.json();
        setMessages(commentsData);
      } catch (error) {
        setErrorMessage(error.message || 'Something went wrong while loading the ticket.');
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !ticket) return;

    try {
      setErrorMessage('');

      if (editingId) {
        const response = await fetch(`${API_BASE_URL}/comments/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: newMessage,
            requestedBy: CURRENT_USER
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to update comment.');
        }

        const updatedComment = await response.json();
        setMessages((prev) =>
          prev.map((msg) => (msg.id === editingId ? updatedComment : msg))
        );
        setEditingId(null);
        setNewMessage('');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: newMessage,
          createdBy: CURRENT_USER,
          createdByRole: role
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add comment.');
      }

      const createdComment = await response.json();
      setMessages((prev) => [...prev, createdComment]);
      setNewMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while sending the message.');
    }
  };

  const handleEdit = (message) => {
    setEditingId(message.id);
    setNewMessage(message.message);
  };

  const handleDelete = async (id) => {
    try {
      setErrorMessage('');

      const response = await fetch(
        `${API_BASE_URL}/comments/${id}?requestedBy=${encodeURIComponent(CURRENT_USER)}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete comment.');
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong while deleting the message.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <section className="ticket-chat-page">
          <p>Loading ticket...</p>
        </section>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout role={role}>
        <section className="ticket-chat-page">
          <div className="ticket-chat-empty-state">
            <h1>Comments</h1>
            <p>Choose a ticket to start conversation.</p>
          </div>
        </section>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <section className="ticket-chat-page">
        <div className="ticket-chat-header">
          <div>
            <h1>Ticket Chat</h1>
            <p>
              Ticket ID: {ticket.id} | {ticket.location} | {ticket.category}
            </p>
          </div>

          <span className="chat-status-badge">{ticket.status}</span>
        </div>

        {errorMessage && <p className="form-message error-message">{errorMessage}</p>}

        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble-row ${message.createdBy === CURRENT_USER ? 'own-row' : 'other-row'}`}
              >
                <div
                  className={`chat-bubble ${message.createdBy === CURRENT_USER ? 'own-bubble' : 'other-bubble'}`}
                >
                  <div className="chat-bubble-top">
                    <span className="chat-sender">{message.createdBy || 'User'}</span>
                    <span className="chat-time">
                      {message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
                    </span>
                  </div>

                  <p>{message.message}</p>

                  {message.createdBy === CURRENT_USER && (
                    <div className="chat-actions">
                      <button type="button" onClick={() => handleEdit(message)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(message.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <textarea
              placeholder="Type your message here..."
              rows="3"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>

            <button
              type="button"
              className="send-message-btn"
              onClick={handleSend}
            >
              {editingId ? 'Update Message' : 'Send Message'}
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default TicketChat;