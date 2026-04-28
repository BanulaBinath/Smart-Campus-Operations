import React from 'react';
import StatusBadge from './StatusBadge';



const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

const BookingCard = ({ booking, onCancel, onApprove, onReject, isAdmin }) => {
  const {
    id,
    facilityName,
    resourceType,
    date,
    startTime,
    endTime,
    purpose,
    attendees,
    status,
    rejectionReason,
    createdAt,
    userEmail,
  } = booking;

  const canCancel  = status === 'APPROVED';
  const canApprove = isAdmin && status === 'PENDING';
  const canReject  = isAdmin && status === 'PENDING';

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.resourceType}>{resourceType || 'Resource'}</p>
          <h3 style={styles.facilityName}>{facilityName || `Booking #${id}`}</h3>
          {isAdmin && userEmail && (
            <p style={styles.userEmail}>?? {userEmail}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Details grid */}
      <div style={styles.grid}>
        <Detail label="Date"      value={fmt(date)} />
        <Detail label="Time"      value={`${startTime} – ${endTime}`} />
        <Detail label="Attendees" value={attendees ?? '—'} />
        <Detail label="Submitted" value={fmt(createdAt)} />
      </div>

      {purpose && (
        <div style={styles.purposeBox}>
          <span style={styles.purposeLabel}>Purpose</span>
          <p style={styles.purposeText}>{purpose}</p>
        </div>
      )}

      {status === 'REJECTED' && rejectionReason && (
        <div style={styles.rejectionBox}>
          <span style={styles.rejectionLabel}>Rejection reason</span>
          <p style={styles.rejectionText}>{rejectionReason}</p>
        </div>
      )}

      {/* Actions */}
      {(canApprove || canReject || canCancel) && (
        <div style={styles.actions}>
          {canApprove && (
            <button
              style={{ ...styles.btn, ...styles.btnApprove }}
              onClick={() => onApprove(id)}
            >
              ? Approve
            </button>
          )}
          {canReject && (
            <button
              style={{ ...styles.btn, ...styles.btnReject }}
              onClick={() => onReject(booking)}
            >
              ? Reject
            </button>
          )}
          {canCancel && (
            <button
              style={{ ...styles.btn, ...styles.btnCancel }}
              onClick={() => onCancel(id)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </p>
    <p style={{ margin: '2px 0 0', fontSize: 14, color: '#111827', fontWeight: 500 }}>
      {value}
    </p>
  </div>
);

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  resourceType: {
    margin: 0,
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    fontWeight: 600,
  },
  facilityName: {
    margin: '4px 0 0',
    fontSize: 17,
    fontWeight: 700,
    color: '#111827',
  },
  userEmail: {
    margin: '4px 0 0',
    fontSize: 12,
    color: '#6B7280',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px 20px',
    background: '#F9FAFB',
    borderRadius: 8,
    padding: '14px 16px',
  },
  purposeBox: {
    borderLeft: '3px solid #6366F1',
    paddingLeft: 12,
  },
  purposeLabel: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  purposeText: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#374151',
  },
  rejectionBox: {
    borderLeft: '3px solid #EF4444',
    background: '#FFF5F5',
    borderRadius: '0 6px 6px 0',
    padding: '8px 12px',
  },
  rejectionLabel: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  rejectionText: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#374151',
  },
  actions: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    paddingTop: 4,
    borderTop: '1px solid #F3F4F6',
  },
  btn: {
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  btnApprove: { background: '#D1FAE5', color: '#065F46' },
  btnReject:  { background: '#FEE2E2', color: '#991B1B' },
  btnCancel:  { background: '#F3F4F6', color: '#374151' },
};

export default BookingCard;
