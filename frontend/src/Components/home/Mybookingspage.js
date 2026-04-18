import React, { useEffect, useState } from "react";
import { getMyBookings } from "../api/bookingApi";
import BookingForm from "./BookingForm";
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
  const userEmail = "user@example.com"; 

  const fetchBookings = async () => {
    const data = await getMyBookings(userEmail);
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f9ff" }}>
      <Nav />
      <div style={styles.container}>
        <h1 style={styles.title}>My Bookings</h1>
        <BookingForm onBookingCreated={fetchBookings} />
        <h2 style={styles.subtitle}>Booking History</h2>
        {bookings.length === 0 ? (
          <p style={{ color: "#666" }}>No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={styles.card}>
              <div style={{ ...styles.badge, backgroundColor: statusColors[b.status] }}>
                {b.status}
              </div>
              <p><strong>Resource:</strong> {b.resourceId}</p>
              <p><strong>Date:</strong> {b.bookingDate}</p>
              <p><strong>Time:</strong> {b.startTime} - {b.endTime}</p>
              <p><strong>Purpose:</strong> {b.purpose}</p>
              {b.adminReason && <p><strong>Admin Reason:</strong> {b.adminReason}</p>}
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
  subtitle: { color: "#093883", marginTop: "2rem" },
  card: { background: "#fff", border: "1px solid #dcebff", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 4px 10px rgba(30,84,167,0.08)" },
  badge: { display: "inline-block", padding: "4px 12px", borderRadius: "12px", color: "white", fontSize: "12px", fontWeight: "600", marginBottom: "10px" },
};

export default MyBookingsPage; 