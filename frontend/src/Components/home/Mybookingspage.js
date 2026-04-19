import React, { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/Bookingapi";
import BookingForm from "./Bookingform";
import Nav from "./nav";
import Footer from "./footer";

const statusColors = {
  PENDING: "#f0ad4e",
  APPROVED: "#5cb85c",
  REJECTED: "#d9534f",
  CANCELLED: "#999",
};

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const userEmail = "user@example.com"; // replace with auth later

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings(userEmail);
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id, userEmail);
      setMessage("✅ Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      setMessage("❌ Failed to cancel booking.");
    }
    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f9ff" }}>
      <Nav />
      <div style={styles.container}>
        <h1 style={styles.title}>My Bookings</h1>

        <BookingForm onBookingCreated={fetchBookings} />

        <h2 style={styles.subtitle}>Booking History</h2>

        {message && (
          <p style={message.startsWith("✅") ? styles.success : styles.error}>
            {message}
          </p>
        )}

        {bookings.length === 0 ? (
          <p style={{ color: "#666" }}>No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={styles.card}>
              {/* Status Badge */}
              <div style={{ ...styles.badge, backgroundColor: statusColors[b.status] }}>
                {b.status}
              </div>

              <p><strong>Resource:</strong> {b.resourceId}</p>
              <p><strong>Date:</strong> {b.bookingDate}</p>
              <p><strong>Time:</strong> {b.startTime} - {b.endTime}</p>
              <p><strong>Purpose:</strong> {b.purpose}</p>
              {b.expectedAttendees && <p><strong>Attendees:</strong> {b.expectedAttendees}</p>}
              {b.adminReason && (
                <p style={styles.reasonText}>
                  <strong>Admin Reason:</strong> {b.adminReason}
                </p>
              )}

              {/* Cancel button only for APPROVED bookings */}
              {b.status === "APPROVED" && (
                <button
                  style={styles.cancelBtn}
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  container: { maxWidth: "750px", margin: "0 auto", padding: "6rem 1.25rem 3rem" },
  title: { color: "#072a67", fontSize: "2rem", marginBottom: "1rem" },
  subtitle: { color: "#093883", marginTop: "2rem", marginBottom: "1rem" },
  card: { background: "#fff", border: "1px solid #dcebff", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 4px 10px rgba(30,84,167,0.08)" },
  badge: { display: "inline-block", padding: "4px 12px", borderRadius: "12px", color: "white", fontSize: "12px", fontWeight: "600", marginBottom: "10px" },
  cancelBtn: { marginTop: "10px", padding: "8px 18px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" },
  reasonText: { color: "#856404", background: "#fff3cd", padding: "6px 10px", borderRadius: "6px" },
  success: { color: "#2e7d32", fontWeight: "600", background: "#e8f5e9", padding: "10px", borderRadius: "6px", marginBottom: "12px" },
  error: { color: "#c62828", fontWeight: "600", background: "#fdecea", padding: "10px", borderRadius: "6px", marginBottom: "12px" },
};

export default MyBookingsPage;