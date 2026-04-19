import React, { useState } from "react";
import { createBooking } from "../api/Bookingapi";

// Temporary resource data - replace with API call when Module A is ready
// To connect to real API: fetch from http://localhost:8080/api/resources
const RESOURCES = {
  "Lecture Hall": [
    { id: "LH-101", name: "Lecture Hall 101 (Capacity: 100)" },
    { id: "LH-102", name: "Lecture Hall 102 (Capacity: 150)" },
    { id: "LH-201", name: "Lecture Hall 201 (Capacity: 80)" },
  ],
  "Lab": [
    { id: "LAB-CS1", name: "CS Lab 1 (Capacity: 40)" },
    { id: "LAB-CS2", name: "CS Lab 2 (Capacity: 40)" },
    { id: "LAB-NET", name: "Network Lab (Capacity: 30)" },
  ],
  "Meeting Room": [
    { id: "MR-01", name: "Meeting Room A (Capacity: 10)" },
    { id: "MR-02", name: "Meeting Room B (Capacity: 20)" },
    { id: "MR-03", name: "Board Room (Capacity: 15)" },
  ],
  "Equipment": [
    { id: "EQ-PROJ1", name: "Projector Unit 1" },
    { id: "EQ-PROJ2", name: "Projector Unit 2" },
    { id: "EQ-CAM1", name: "Camera Set 1" },
  ],
};

function BookingForm({ onBookingCreated }) {
  const [resourceType, setResourceType] = useState("");
  const [form, setForm] = useState({
    resourceId: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const userEmail = "user@example.com"; // replace with auth later

  const handleTypeChange = (e) => {
    setResourceType(e.target.value);
    setForm((prev) => ({ ...prev, resourceId: "" }));
    setErrors((prev) => ({ ...prev, resourceType: "", resourceId: "" }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!resourceType) newErrors.resourceType = "Please select a resource type.";
    if (!form.resourceId) newErrors.resourceId = "Please select a resource.";
    if (!form.bookingDate) {
      newErrors.bookingDate = "Booking date is required.";
    } else if (form.bookingDate < today) {
      newErrors.bookingDate = "Booking date cannot be in the past.";
    }
    if (!form.startTime) newErrors.startTime = "Start time is required.";
    if (!form.endTime) {
      newErrors.endTime = "End time is required.";
    } else if (form.startTime && form.endTime <= form.startTime) {
      newErrors.endTime = "End time must be after start time.";
    }
    if (!form.purpose.trim()) newErrors.purpose = "Purpose is required.";
    if (form.expectedAttendees && Number(form.expectedAttendees) < 1) {
      newErrors.expectedAttendees = "Attendees must be at least 1.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setApiError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createBooking(form, userEmail);
      setMessage("✅ Booking request submitted! Awaiting admin approval.");
      setResourceType("");
      setForm({ resourceId: "", bookingDate: "", startTime: "", endTime: "", purpose: "", expectedAttendees: "" });
      setErrors({});
      onBookingCreated && onBookingCreated();
    } catch (err) {
      setApiError("❌ Failed to create booking. This resource may already be booked for this time slot.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Request a Booking</h2>
      {message && <p style={styles.success}>{message}</p>}
      {apiError && <p style={styles.error}>{apiError}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Resource Type */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Resource Type *</label>
          <select
            style={{ ...styles.input, ...(errors.resourceType ? styles.inputError : {}) }}
            value={resourceType}
            onChange={handleTypeChange}
          >
            <option value="">-- Select Type --</option>
            {Object.keys(RESOURCES).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.resourceType && <span style={styles.errorText}>{errors.resourceType}</span>}
        </div>

        {/* Resource */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Resource *</label>
          <select
            style={{ ...styles.input, ...(errors.resourceId ? styles.inputError : {}) }}
            name="resourceId"
            value={form.resourceId}
            onChange={handleChange}
            disabled={!resourceType}
          >
            <option value="">-- Select Resource --</option>
            {resourceType && RESOURCES[resourceType].map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {errors.resourceId && <span style={styles.errorText}>{errors.resourceId}</span>}
        </div>

        {/* Booking Date */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Booking Date *</label>
          <input
            style={{ ...styles.input, ...(errors.bookingDate ? styles.inputError : {}) }}
            name="bookingDate"
            type="date"
            value={form.bookingDate}
            onChange={handleChange}
          />
          {errors.bookingDate && <span style={styles.errorText}>{errors.bookingDate}</span>}
        </div>

        {/* Start & End Time */}
        <div style={styles.row}>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>Start Time *</label>
            <input
              style={{ ...styles.input, ...(errors.startTime ? styles.inputError : {}) }}
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
            />
            {errors.startTime && <span style={styles.errorText}>{errors.startTime}</span>}
          </div>
          <div style={{ ...styles.fieldGroup, flex: 1 }}>
            <label style={styles.label}>End Time *</label>
            <input
              style={{ ...styles.input, ...(errors.endTime ? styles.inputError : {}) }}
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
            />
            {errors.endTime && <span style={styles.errorText}>{errors.endTime}</span>}
          </div>
        </div>

        {/* Purpose */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Purpose *</label>
          <input
            style={{ ...styles.input, ...(errors.purpose ? styles.inputError : {}) }}
            name="purpose"
            placeholder="e.g. Lecture, Group Meeting, Lab Session"
            value={form.purpose}
            onChange={handleChange}
          />
          {errors.purpose && <span style={styles.errorText}>{errors.purpose}</span>}
        </div>

        {/* Expected Attendees */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Expected Attendees</label>
          <input
            style={{ ...styles.input, ...(errors.expectedAttendees ? styles.inputError : {}) }}
            name="expectedAttendees"
            type="number"
            min="1"
            placeholder="e.g. 30"
            value={form.expectedAttendees}
            onChange={handleChange}
          />
          {errors.expectedAttendees && <span style={styles.errorText}>{errors.expectedAttendees}</span>}
        </div>

        <button style={styles.button} type="submit">
          Submit Booking Request
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { background: "#fff", border: "1px solid #dcebff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 12px rgba(30,84,167,0.1)", marginBottom: "2rem" },
  heading: { margin: "0 0 1rem", color: "#0c3a89" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  row: { display: "flex", gap: "12px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#3d5f93" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", background: "#fff" },
  inputError: { border: "1px solid #d9534f" },
  errorText: { color: "#d9534f", fontSize: "12px" },
  button: { padding: "12px", backgroundColor: "#0d5dd8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", marginTop: "4px" },
  success: { color: "#2e7d32", fontWeight: "600", background: "#e8f5e9", padding: "10px", borderRadius: "6px" },
  error: { color: "#c62828", fontWeight: "600", background: "#fdecea", padding: "10px", borderRadius: "6px" },
};

export default BookingForm;