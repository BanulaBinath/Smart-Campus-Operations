import React, { useEffect, useState } from 'react';
import { BookingProvider, useBooking } from '../context/BookingContext';
import TopBar from '../layout/TopBar';
import Sidebar from '../layout/Sidebar';
import BookingCard from '../booking/BookingCard';
import RejectModal from '../booking/RejectModal';

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const AdminBookingsInner = () => {
  const {
    bookings, loading, error,
    fetchAllBookings, handleApprove, handleReject, handleDelete,
  } = useBooking();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch]             = useState('');
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]               = useState(null);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const onApprove = async (id) => {
    if (!window.confirm('Approve this booking?')) return;
    setActionLoading(true);
    try {
      await handleApprove(id);
      showToast('Booking approved.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const onReject = (booking) => setRejectTarget(booking);

  const onConfirmReject = async (id, reason) => {
    setActionLoading(true);
    try {
      await handleReject(id, reason);
      setRejectTarget(null);
      showToast('Booking rejected.');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Permanently delete this booking record?')) return;
    try {
      await handleDelete(id);
      showToast('Booking deleted.');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filtered = bookings
    .filter((b) => statusFilter === 'ALL' || b.status === statusFilter)
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        !q ||
        (b.facilityName || '').toLowerCase().includes(q) ||
        (b.userEmail    || '').toLowerCase().includes(q) ||
        (b.purpose      || '').toLowerCase().includes(q)
      );
    });

  const counts = STATUS_FILTERS.slice(1).reduce((acc, s) => {
    acc[s] = bookings.filter((b) => b.status === s).length;
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar />
      <div className="flex flex-1 flex-col md:ml-[240px]">
        <TopBar title="Booking Management" />
        <main className="flex-1 overflow-y-auto px-6 py-8">

          {/* Toast */}
          {toast && (
            <div style={{
              ...styles.toast,
              background: toast.type === 'error' ? '#EF4444' : '#10B981',
            }}>
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div style={styles.header}>
            <div>
              <h1 style={styles.pageTitle}>Booking Management</h1>
              <p style={styles.pageSubtitle}>Review, approve, and manage all booking requests</p>
            </div>
          </div>

          {/* Summary cards */}
          <div style={styles.summaryRow}>
            {[
              { label: 'Pending',   count: counts.PENDING,   color: '#F59E0B', bg: '#FEF3C7' },
              { label: 'Approved',  count: counts.APPROVED,  color: '#10B981', bg: '#D1FAE5' },
              { label: 'Rejected',  count: counts.REJECTED,  color: '#EF4444', bg: '#FEE2E2' },
              { label: 'Cancelled', count: counts.CANCELLED, color: '#9CA3AF', bg: '#F3F4F6' },
            ].map((s) => (
              <div key={s.label} style={{ ...styles.summaryCard, background: s.bg }}>
                <p style={{ ...styles.summaryCount, color: s.color }}>{s.count}</p>
                <p style={styles.summaryLabel}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <div style={styles.filterBar}>
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  style={{
                    ...styles.filterBtn,
                    ...(statusFilter === s ? styles.filterBtnActive : {}),
                  }}
                  onClick={() => setStatusFilter(s)}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                  {s !== 'ALL' && counts[s] > 0 && (
                    <span style={styles.badge}>{counts[s]}</span>
                  )}
                </button>
              ))}
            </div>
            <input
              style={styles.searchInput}
              placeholder="Search by facility, user, purpose…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Error */}
          {error && <div style={styles.errorBanner}>{error}</div>}

          {/* Grid */}
          {loading ? (
            <div style={styles.center}>
              <div style={styles.spinner} />
              <p style={{ color: '#9CA3AF', marginTop: 12 }}>Loading bookings…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>??</p>
              <p style={styles.emptyTitle}>No bookings found</p>
              <p style={styles.emptyHint}>Try adjusting the filters or search query.</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((b) => (
                <div key={b.id} style={{ position: 'relative' }}>
                  <BookingCard
                    booking={b}
                    isAdmin
                    onApprove={onApprove}
                    onReject={onReject}
                    onCancel={() => {}}
                  />
                  <button
                    style={styles.deleteBtn}
                    title="Delete record"
                    onClick={() => onDelete(b.id)}
                  >
                    ??
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Reject modal */}
          {rejectTarget && (
            <RejectModal
              booking={rejectTarget}
              onConfirm={onConfirmReject}
              onCancel={() => setRejectTarget(null)}
              loading={actionLoading}
            />
          )}

        </main>
      </div>
    </div>
  );
};

const AdminBookingsPage = () => (
  <BookingProvider>
    <AdminBookingsInner />
  </BookingProvider>
);

const styles = {
  toast: {
    position: 'fixed', top: 20, right: 20,
    padding: '12px 20px', borderRadius: 10,
    color: '#fff', fontWeight: 600, fontSize: 14,
    zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  header: {
    maxWidth: 1100, margin: '0 auto 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  pageTitle:    { margin: 0, fontSize: 28, fontWeight: 800, color: '#111827' },
  pageSubtitle: { margin: '4px 0 0', fontSize: 14, color: '#6B7280' },
  summaryRow: {
    maxWidth: 1100, margin: '0 auto 24px',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
  },
  summaryCard: { borderRadius: 10, padding: '16px 20px', textAlign: 'center' },
  summaryCount: { margin: 0, fontSize: 32, fontWeight: 800 },
  summaryLabel: { margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: '#6B7280' },
  controls: {
    maxWidth: 1100, margin: '0 auto 20px',
    display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
  },
  filterBar: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  filterBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 8,
    background: '#fff', border: '1.5px solid #E5E7EB',
    fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer',
  },
  filterBtnActive: { background: '#6366F1', borderColor: '#6366F1', color: '#fff' },
  badge: {
    background: 'rgba(0,0,0,0.15)', borderRadius: 999,
    padding: '1px 6px', fontSize: 11, fontWeight: 700,
  },
  searchInput: {
    padding: '8px 14px', border: '1.5px solid #E5E7EB',
    borderRadius: 8, fontSize: 14, color: '#111827',
    outline: 'none', minWidth: 260, flex: 1,
  },
  errorBanner: {
    maxWidth: 1100, margin: '0 auto 16px',
    background: '#FEE2E2', color: '#991B1B',
    padding: '12px 16px', borderRadius: 8, fontSize: 14,
  },
  grid: {
    maxWidth: 1100, margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: 16,
  },
  deleteBtn: {
    position: 'absolute', top: 12, right: 12,
    background: 'none', border: 'none',
    fontSize: 16, cursor: 'pointer', opacity: 0.45,
  },
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', marginTop: 60,
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid #E5E7EB',
    borderTop: '3px solid #6366F1',
    borderRadius: '50%',
  },
  empty:      { maxWidth: 400, margin: '60px auto', textAlign: 'center' },
  emptyIcon:  { fontSize: 48, margin: 0 },
  emptyTitle: { margin: '12px 0 4px', fontSize: 18, fontWeight: 700, color: '#374151' },
  emptyHint:  { margin: 0, fontSize: 14, color: '#9CA3AF' },
};

export default AdminBookingsPage;
