import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AdminBookingsPage from './Adminbookingpage';
import Facility from './Facility';
import { getAllBookings } from '../api/Bookingapi';
import './adminPage.css';

// Temporary tickets data - replace with API call when Module C is ready
// To connect: fetch from http://localhost:8080/api/tickets
const TEMP_TICKETS = [
  { id: 1, title: "Projector not working", location: "LH-101", category: "Equipment", priority: "HIGH", status: "OPEN" },
  { id: 2, title: "AC unit broken", location: "MR-02", category: "Facility", priority: "MEDIUM", status: "IN_PROGRESS" },
  { id: 3, title: "Network issue in lab", location: "LAB-CS1", category: "Network", priority: "HIGH", status: "OPEN" },
];

const ticketStatusColors = {
  OPEN: "#d9534f",
  IN_PROGRESS: "#f0ad4e",
  RESOLVED: "#5cb85c",
  CLOSED: "#999",
};

const priorityColors = {
  HIGH: "#d9534f",
  MEDIUM: "#f0ad4e",
  LOW: "#5cb85c",
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [tickets] = useState(TEMP_TICKETS); // replace with useEffect API call later

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const approvedBookings = bookings.filter((b) => b.status === "APPROVED").length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter((t) => t.status === "IN_PROGRESS").length;

  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <div className="dash-card">
          <h3>Total Bookings</h3>
          <p className="dash-number">{bookings.length}</p>
        </div>
        <div className="dash-card">
          <h3>Pending Approvals</h3>
          <p className="dash-number" style={{ color: "#f0ad4e" }}>{pendingBookings}</p>
        </div>
        <div className="dash-card">
          <h3>Approved Bookings</h3>
          <p className="dash-number" style={{ color: "#5cb85c" }}>{approvedBookings}</p>
        </div>
        <div className="dash-card">
          <h3>Open Tickets</h3>
          <p className="dash-number" style={{ color: "#d9534f" }}>{openTickets}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recent Bookings</h3>
        {bookings.length === 0 ? (
          <p style={{ color: "#666" }}>No bookings yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Resource</th>
                <th style={styles.th}>Requested By</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id}>
                  <td style={styles.td}>{b.resourceId}</td>
                  <td style={styles.td}>{b.requestedBy}</td>
                  <td style={styles.td}>{b.bookingDate}</td>
                  <td style={styles.td}>{b.startTime} - {b.endTime}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: b.status === "PENDING" ? "#f0ad4e" : b.status === "APPROVED" ? "#5cb85c" : "#d9534f" }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tickets Section - Temporary */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          Recent Tickets
          <span style={styles.tempBadge}>Temporary Data</span>
        </h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}>
                <td style={styles.td}>{t.title}</td>
                <td style={styles.td}>{t.location}</td>
                <td style={styles.td}>{t.category}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: priorityColors[t.priority] }}>
                    {t.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: ticketStatusColors[t.status] }}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={styles.tempNote}>⚠️ Replace TEMP_TICKETS with API call when Module C is ready.</p>
      </div>

      {/* In Progress Tickets */}
      {inProgressTickets > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>In Progress Tickets ({inProgressTickets})</h3>
          {tickets.filter(t => t.status === "IN_PROGRESS").map((t) => (
            <div key={t.id} style={styles.ticketCard}>
              <strong>{t.title}</strong>
              <span style={{ marginLeft: "10px", color: "#666" }}>{t.location}</span>
              <span style={{ ...styles.badge, backgroundColor: priorityColors[t.priority], marginLeft: "10px" }}>
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/bookings" element={<AdminBookingsPage />} />
          <Route path="/facilities" element={<Facility />} />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  section: { marginTop: "2rem", background: "#fff", borderRadius: "16px", padding: "1.25rem", border: "1px solid #dcebff", boxShadow: "0 4px 10px rgba(30,84,167,0.08)" },
  sectionTitle: { margin: "0 0 1rem", color: "#072a67", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "10px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "8px 12px", background: "#f0f5ff", color: "#3d5f93", fontSize: "13px", fontWeight: "600" },
  td: { padding: "8px 12px", borderBottom: "1px solid #f0f0f0", fontSize: "14px", color: "#333" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: "12px", color: "white", fontSize: "11px", fontWeight: "600" },
  ticketCard: { padding: "10px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center" },
  tempBadge: { fontSize: "11px", background: "#fff3cd", color: "#856404", padding: "2px 8px", borderRadius: "8px", fontWeight: "500" },
  tempNote: { marginTop: "8px", fontSize: "12px", color: "#856404" },
};

export default AdminPage;