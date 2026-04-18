import React, { useState } from "react";
import { createBooking } from "../api/Bookingapi";

function BookingForm({ onBookingCreated }) {
  const [form, setForm] = useState({
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userEmail = "user@example.com";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await createBooking(form, userEmail);
      setMessage("✅ Booking created successfully!");
      setForm({ resourceId: "", bookingDate: "", startTime: "", endTime: "", purpose: "", expectedAttendees: "" });
      onBookingCreated && onBookingCreated();
    } catch (err) {
      setError("❌ Failed to create booking. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Request a Booking</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} name="resourceId" placeholder="Resource ID" value={form.resourceId} onChange={handleChange} required />
        <input style={styles.input} name="bookingDate" type="date" value={form.bookingDate} onChange={handleChange} required />
        <input style={styles.input} name="startTime" type="time" value={form.startTime} onChange={handleChange} required />
        <input style={styles.input} name="endTime" type="time" value={form.endTime} onChange={handleChange} required />
        <input style={styles.input} name="purpose" placeholder="Purpose of Booking" value={form.purpose} onChange={handleChange} required />
        <input style={styles.input} name="expectedAttendees" type="number" placeholder="Expected Attendees" value={form.expectedAttendees} onChange={handleChange} />
        <button style={styles.button} type="submit">Submit Booking</button>
      </form>
    </div>
  );
}

const styles = {
  container: { background: "#fff", border: "1px solid #dcebff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 12px rgba(30,84,167,0.1)", marginBottom: "2rem" },
  heading: { margin: "0 0 1rem", color: "#0c3a89" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" },
  button: { padding: "12px", backgroundColor: "#0d5dd8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px" },
  success: { color: "#2e7d32", fontWeight: "600" },
  error: { color: "#c62828", fontWeight: "600" },
};

export default BookingForm;