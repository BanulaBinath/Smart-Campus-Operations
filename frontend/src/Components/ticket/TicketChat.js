import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import './TicketChat.css';

function TicketChat({ role }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      senderName: 'You',
      text: 'The projector in Lecture Hall A401 is not turning on.',
      time: '09:20 AM'
    },
    {
      id: 2,
      sender: 'staff',
      senderName: 'Technician Ryan',
      text: 'Received the issue. I will inspect it shortly.',
      time: '09:35 AM'
    },
    {
      id: 3,
      sender: 'user',
      senderName: 'You',
      text: 'Thank you. Please let me know once it is checked.',
      time: '09:42 AM'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;

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
      time: 'Now'
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

  return (
    <DashboardLayout role={role}>
      <section className="ticket-chat-page">
        <div className="ticket-chat-header">
          <div>
            <h1>Ticket Chat</h1>
            <p>Ticket ID: TCK-1001 | Lecture Hall A401 | Projector Issue</p>
          </div>

          <span className="chat-status-badge">OPEN</span>
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

            <button type="button" className="send-message-btn" onClick={handleSend}>
              {editingId ? 'Update Message' : 'Send Message'}
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default TicketChat;