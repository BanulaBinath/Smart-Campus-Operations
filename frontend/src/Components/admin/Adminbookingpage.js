import React, { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../api/bookingApi";
import BookingCard from "./BookingCard";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [reason, setReason] = useState("");

  const fetchAll = async () => {
    const data = await getAllBookings();
    setBookings(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatus = async (id, status) => {
    await updateBookingStatus(id, status, reason);
    setReason("");
    fetchAll();
  };

  return (
    <div>
      <h2 style={{ color: "#072a67", marginBottom: "1rem" }}>All Bookings</h2>
      <input
        placeholder="Reason (required for rejection)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        style={styles.reasonInput}
      />
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id}>
            <BookingCard booking={b} />
            {b.status === "PENDING" && (
              <div style={styles.actionRow}>
                <button onClick={() => handleStatus(b.id, "APPROVED")} style={styles.approveBtn}>
                  ✅ Approve
                </button>
                <button onClick={() => handleStatus(b.id, "REJECTED")} style={styles.rejectBtn}>
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  reasonInput: { padding: "8px", width: "100%", marginBottom: "16px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" },
  actionRow: { display: "flex", gap: "10px", marginBottom: "16px" },
  approveBtn: { padding: "6px 16px", backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  rejectBtn: { padding: "6px 16px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default AdminBookingsPage;