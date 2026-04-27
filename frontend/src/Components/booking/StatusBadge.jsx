import React from 'react';
import TopBar from '../layout/TopBar';
import Sidebar from '../layout/Sidebar';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
  APPROVED:  { label: 'Approved',  bg: '#D1FAE5', color: '#065F46', dot: '#10B981' },
  REJECTED:  { label: 'Rejected',  bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  CANCELLED: { label: 'Cancelled', bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.03em',
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: cfg.dot,
          display: 'inline-block',
        }}
      />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;