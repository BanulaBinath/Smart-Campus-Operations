import React, { useState } from 'react';



const RejectModal = ({ booking, onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState('');
  const [error, setError]   = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) { setError('A rejection reason is required.'); return; }
    onConfirm(booking.id, reason.trim());
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Reject Booking</h3>
        <p style={styles.subtitle}>
          You are about to reject the booking for{' '}
          <strong>{booking.facilityName || `#${booking.id}`}</strong>.
          Please provide a reason that will be shown to the user.
        </p>

        <textarea
          rows={4}
          placeholder="Enter rejection reason…"
          value={reason}
          onChange={(e) => { setReason(e.target.value); setError(''); }}
          style={styles.textarea}
        />
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.actions}>
          <button style={styles.btnCancel} onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button style={styles.btnReject} onClick={handleConfirm} disabled={loading}>
            {loading ? 'Rejecting…' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1100, padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 14, padding: 28,
    width: '100%', maxWidth: 440,
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column', gap: 14,
  },
  title:    { margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' },
  subtitle: { margin: 0, fontSize: 14, color: '#6B7280', lineHeight: 1.6 },
  textarea: {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid #E5E7EB', borderRadius: 8,
    fontSize: 14, color: '#111827', resize: 'vertical',
    fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
  },
  error:   { margin: 0, fontSize: 12, color: '#EF4444' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10 },
  btnCancel: {
    padding: '9px 20px', borderRadius: 8,
    background: '#F3F4F6', color: '#374151',
    border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
  btnReject: {
    padding: '9px 20px', borderRadius: 8,
    background: '#EF4444', color: '#fff',
    border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer',
  },
};

export default RejectModal;
