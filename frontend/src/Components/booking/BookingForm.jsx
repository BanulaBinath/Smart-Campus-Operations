import React, { useState, useEffect } from 'react';


import { getFacilities, getFacilityAvailability } from '../../services/bookingService';

const initialState = {
  facilityId: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  attendees: '',
};

const BookingForm = ({ onSubmit, onCancel, loading }) => {
  const [form, setForm]               = useState(initialState);
  const [facilities, setFacilities]   = useState([]);
  const [facilitySearch, setFacilitySearch] = useState('');
  const [availability, setAvailability]     = useState([]);
  const [errors, setErrors]           = useState({});
  const [fetchingAvail, setFetchingAvail]   = useState(false);

  useEffect(() => {
    getFacilities({ status: 'ACTIVE' })
      .then((data) => setFacilities(Array.isArray(data) ? data : data.content || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.facilityId || !form.date) return;
    setFetchingAvail(true);
    getFacilityAvailability(form.facilityId, form.date)
      .then(setAvailability)
      .catch(() => setAvailability([]))
      .finally(() => setFetchingAvail(false));
  }, [form.facilityId, form.date]);

  const filtered = facilities.filter((f) =>
    f.name.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.facilityId)    errs.facilityId = 'Please select a facility.';
    if (!form.date)          errs.date       = 'Date is required.';
    if (!form.startTime)     errs.startTime  = 'Start time is required.';
    if (!form.endTime)       errs.endTime    = 'End time is required.';
    if (form.startTime && form.endTime && form.startTime >= form.endTime)
      errs.endTime = 'End time must be after start time.';
    if (!form.purpose.trim()) errs.purpose   = 'Please describe the purpose.';
    if (form.attendees && isNaN(Number(form.attendees)))
      errs.attendees = 'Must be a number.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({
      ...form,
      attendees: form.attendees ? Number(form.attendees) : null,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.title}>New Booking Request</h2>
          <button style={styles.closeBtn} onClick={onCancel}>?</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* Facility picker */}
          <Field label="Facility / Resource" error={errors.facilityId} required>
            <input
              style={styles.input}
              placeholder="Search facilities..."
              value={facilitySearch}
              onChange={(e) => setFacilitySearch(e.target.value)}
            />
            <div style={styles.facilityList}>
              {filtered.length === 0 && (
                <p style={styles.noResult}>No active facilities found.</p>
              )}
              {filtered.map((f) => (
                <label
                  key={f.id}
                  style={{
                    ...styles.facilityItem,
                    ...(form.facilityId === String(f.id) ? styles.facilityItemSelected : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="facilityId"
                    value={f.id}
                    checked={form.facilityId === String(f.id)}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <div>
                    <p style={styles.facilityName}>{f.name}</p>
                    <p style={styles.facilityMeta}>
                      {f.type} · {f.location}{f.capacity ? ` · Cap: ${f.capacity}` : ''}
                    </p>
                  </div>
                  {form.facilityId === String(f.id) && (
                    <span style={styles.checkmark}>?</span>
                  )}
                </label>
              ))}
            </div>
          </Field>

          {/* Date */}
          <Field label="Date" error={errors.date} required>
            <input
              type="date"
              name="date"
              min={today}
              value={form.date}
              onChange={handleChange}
              style={styles.input}
            />
          </Field>

          {/* Availability hint */}
          {fetchingAvail && <p style={styles.hint}>Checking availability…</p>}
          {!fetchingAvail && availability.length > 0 && (
            <div style={styles.availBox}>
              <p style={styles.availTitle}>? Already booked slots on this date:</p>
              {availability.map((slot, i) => (
                <span key={i} style={styles.slot}>{slot.start} – {slot.end}</span>
              ))}
            </div>
          )}

          {/* Time range */}
          <div style={styles.row}>
            <Field label="Start Time" error={errors.startTime} required style={{ flex: 1 }}>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>
            <Field label="End Time" error={errors.endTime} required style={{ flex: 1 }}>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                style={styles.input}
              />
            </Field>
          </div>

          {/* Purpose */}
          <Field label="Purpose" error={errors.purpose} required>
            <textarea
              name="purpose"
              rows={3}
              placeholder="Describe the purpose of this booking…"
              value={form.purpose}
              onChange={handleChange}
              style={{ ...styles.input, resize: 'vertical' }}
            />
          </Field>

          {/* Attendees */}
          <Field label="Expected Attendees" error={errors.attendees}>
            <input
              type="number"
              name="attendees"
              min={1}
              placeholder="e.g. 20"
              value={form.attendees}
              onChange={handleChange}
              style={styles.input}
            />
          </Field>

          {/* Buttons */}
          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.btnSecondary}
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" style={styles.btnPrimary} disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, required, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
      {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ margin: 0, fontSize: 12, color: '#EF4444' }}>{error}</p>}
  </div>
);

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 16,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 0',
  },
  title: { margin: 0, fontSize: 20, fontWeight: 800, color: '#111827' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: 18,
    cursor: 'pointer', color: '#6B7280', padding: 4,
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: 18,
    padding: '20px 24px 24px',
  },
  input: {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid #E5E7EB', borderRadius: 8,
    fontSize: 14, color: '#111827', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
  },
  row: { display: 'flex', gap: 14 },
  facilityList: {
    maxHeight: 180, overflowY: 'auto',
    border: '1.5px solid #E5E7EB', borderRadius: 8, marginTop: 2,
  },
  facilityItem: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', cursor: 'pointer',
    borderBottom: '1px solid #F3F4F6',
  },
  facilityItemSelected: { background: '#EEF2FF' },
  facilityName: { margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' },
  facilityMeta: { margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' },
  checkmark: { color: '#6366F1', fontWeight: 700 },
  noResult: { margin: 0, padding: 14, fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  hint: { margin: 0, fontSize: 12, color: '#9CA3AF' },
  availBox: {
    background: '#FFF7ED', border: '1px solid #FED7AA',
    borderRadius: 8, padding: '10px 14px',
    display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
  },
  availTitle: { margin: 0, fontSize: 12, fontWeight: 700, color: '#92400E', width: '100%' },
  slot: {
    background: '#FEF3C7', color: '#92400E',
    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
  },
  formActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 },
  btnPrimary: {
    padding: '10px 22px', borderRadius: 8,
    background: '#6366F1', color: '#fff',
    border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 22px', borderRadius: 8,
    background: '#F3F4F6', color: '#374151',
    border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
  },
};

export default BookingForm;
