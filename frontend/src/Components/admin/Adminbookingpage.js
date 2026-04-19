import React, { useEffect, useState } from "react";
import { getAllBookings, updateBookingStatus } from "../api/Bookingapi";
import BookingCard from "./Bookingcard";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  // Store reason per booking id
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAll = async () => {
    const data = await getAllBookings();
    setBookings(data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleReasonChange = (id, value) => {
    setReasons((prev) => ({ ...prev, [id]: value }));
  };

  const handleApprove = async (id) => {
    setError("");
    setSuccessMsg("");
    await updateBookingStatus(id, "APPROVED", "");
    setSuccessMsg(`Booking #${id} approved successfully.`);
    fetchAll();
  };

  const handleReject = async (id) => {
    setError("");
    setSuccessMsg("");
    const reason = reasons[id] || "";
    // Validation: reason is required for rejection
    if (!reason.trim()) {
      setError(`Please provide a reason before rejecting booking #${id}.`);
      return;
    }
    await updateBookingStatus(id, "REJECTED", reason);
    setReasons((prev) => ({ ...prev, [id]: "" }));
    setSuccessMsg(`Booking #${id} rejected.`);
    fetchAll();
  };

  return (
    <div>
      <h2 style={{ color: "#072a67", marginBottom: "1rem" }}>All Bookings</h2>

      {error && <p style={styles.error}>{error}</p>}
      {successMsg && <p style={styles.success}>{successMsg}</p>}

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id}>
            <BookingCard booking={b} />
            {b.status === "PENDING" && (
              <div style={styles.actionBox}>
                <input
                  placeholder="Rejection reason (required to reject)"
                  value={reasons[b.id] || ""}
                  onChange={(e) => handleReasonChange(b.id, e.target.value)}
                  style={styles.reasonInput}
                />
                <div style={styles.actionRow}>
                  <button onClick={() => handleApprove(b.id)} style={styles.approveBtn}>
                    ✅ Approve
                  </button>
                  <button onClick={() => handleReject(b.id)} style={styles.rejectBtn}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  actionBox: { background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "16px" },
  reasonInput: { padding: "8px", width: "100%", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px", boxSizing: "border-box" },
  actionRow: { display: "flex", gap: "10px" },
  approveBtn: { padding: "8px 20px", backgroundColor: "#5cb85c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  rejectBtn: { padding: "8px 20px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  error: { color: "#c62828", fontWeight: "600", background: "#fdecea", padding: "10px", borderRadius: "6px", marginBottom: "12px" },
  success: { color: "#2e7d32", fontWeight: "600", background: "#e8f5e9", padding: "10px", borderRadius: "6px", marginBottom: "12px" },
};

export default AdminBookingsPage;