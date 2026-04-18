import React from "react";
import { cancelBooking } from "../api/bookingApi";

const statusColors = {
  PENDING: "#f0ad4e",
  APPROVED: "#5cb85c",
  REJECTED: "#d9534f",
  CANCELLED: "#999",
};

function BookingCard({ booking, userEmail, onUpdate }) {
  const handleCancel = async () => {
    if (window.confirm("Cancel this booking?")) {
      await cancelBooking(booking.id, userEmail);
      onUpdate && onUpdate();
    }
  };

  return (
    <div style={styles.card}>
      <div style={{ ...styles.badge, backgroundColor: statusColors[booking.status] }}>
        {booking.status}
      </div>
      <p><strong>Resource:</strong> {booking.resourceId}</p>
      <p><strong>Requested By:</strong> {booking.requestedBy}</p>
      <p><strong>Date:</strong> {booking.bookingDate}</p>
      <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
      <p><strong>Purpose:</strong> {booking.purpose}</p>
      {booking.expectedAttendees && <p><strong>Attendees:</strong> {booking.expectedAttendees}</p>}
      {booking.adminReason && <p><strong>Reason:</strong> {booking.adminReason}</p>}
      {booking.status === "APPROVED" && userEmail && (
        <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #dcebff", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 4px 10px rgba(30,84,167,0.08)" },
  badge: { display: "inline-block", padding: "4px 12px", borderRadius: "12px", color: "white", fontSize: "12px", fontWeight: "600", marginBottom: "10px" },
  cancelBtn: { padding: "6px 12px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default BookingCard;