import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import './TicketChat.css';

function TicketChat({ role = 'USER' }) {
  const { ticketId } = useParams();

  const ticketData = {
    'TCK-1001': {
      id: 'TCK-1001',
      location: 'Lecture Hall A401',
      issue: 'Projector Issue',
      status: 'OPEN',
      messages: [
        {
          id: 1,
          sender: 'user',
          senderName: 'You',
          text: 'The projector in Lecture Hall A401 is not turning on.',
          time: '09:20 AM',
        },
        {
          id: 2,
          sender: 'staff',
          senderName: 'Technician Ryan',
          text: 'Received the issue. I will inspect it shortly.',
          time: '09:35 AM',
        },
        {
          id: 3,
          sender: 'user',
          senderName: 'You',
          text: 'Thank you. Please let me know once it is checked.',
          time: '09:42 AM',
        },
      ],
    },
    'TCK-1002': {
      id: 'TCK-1002',
      location: 'Lab 03',
      issue: 'PC Not Booting',
      status: 'IN_PROGRESS',
      messages: [
        {
          id: 1,
          sender: 'user',
          senderName: 'You',
          text: 'One of the lab computers is not starting.',
          time: '10:10 AM',
        },
        {
          id: 2,
          sender: 'staff',
          senderName: 'Technician Amila',
          text: 'I am checking the power supply and RAM.',
          time: '10:25 AM',
        },
      ],
    },
  };

  const selectedTicket = ticketId ? ticketData[ticketId] : null;

  const [messages, setMessages] = useState(selectedTicket ? selectedTicket.messages : []);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    if (editingId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingId ? { ...msg, text: newMessage } : msg
        )
      );
      setEditingId(null);
      setNewMessage('');
      return;
    }

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      senderName: 'You',
      text: newMessage,
      time: 'Now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleEdit = (message) => {
    setEditingId(message.id);
    setNewMessage(message.text);
  };

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  if (!selectedTicket) {
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
              Ticket ID: {selectedTicket.id} | {selectedTicket.location} |{' '}
              {selectedTicket.issue}
            </p>
          </div>

          <span className="chat-status-badge">{selectedTicket.status}</span>
        </div>

        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-bubble-row ${
                  message.sender === 'user' ? 'own-row' : 'other-row'
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.sender === 'user' ? 'own-bubble' : 'other-bubble'
                  }`}
                >
                  <div className="chat-bubble-top">
                    <span className="chat-sender">{message.senderName}</span>
                    <span className="chat-time">{message.time}</span>
                  </div>

                  <p>{message.text}</p>

                  {message.sender === 'user' && (
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