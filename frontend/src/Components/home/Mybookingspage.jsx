import React, { useEffect, useState } from 'react';
import { BookingProvider, useBooking } from '../../context/BookingContext';
import TopBar from '../layout/TopBar';
import Sidebar from '../layout/Sidebar';
import BookingCard from '../booking/BookingCard';
import BookingForm from '../booking/BookingForm';

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

const MyBookingsInner = () => {
  const { bookings, loading, error, fetchMyBookings, submitBooking, handleCancel } = useBooking();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      await submitBooking(data);
      setShowForm(false);
      showToast('Booking request submitted successfully!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await handleCancel(id);
      showToast('Booking cancelled.');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filtered =
    statusFilter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* TopBar */}
        <TopBar />

        {/* Page Content */}
        <div style={styles.page}>
          {/* Toast */}
          {toast && (
            <div
              style={{
                ...styles.toast,
                background: toast.type === 'error' ? '#EF4444' : '#10B981',
              }}
            >
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>My Bookings</h1>
              <p style={styles.pageSubtitle}>
                Track and manage your resource reservations
              </p>
            </div>
            <button style={styles.btnNew} onClick={() => setShowForm(true)}>
              + New Booking
            </button>
          </div>

          {/* Filters */}
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
                {s === 'ALL'
                  ? 'All'
                  : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && <div style={styles.errorBanner}>{error}</div>}

          {/* Content */}
          {loading ? (
            <div style={styles.center}>
              <div style={styles.spinner} />
              <p style={{ color: '#9CA3AF', marginTop: 12 }}>
                Loading bookings…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>📅</p>
              <p style={styles.emptyTitle}>No bookings found</p>
              <p style={styles.emptyHint}>
                {statusFilter === 'ALL'
                  ? "You haven't made any bookings yet. Click '+ New Booking' to get started."
                  : `No ${statusFilter.toLowerCase()} bookings.`}
              </p>
            </div>
          ) : (
            <div style={styles.grid}>
              {filtered.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancelBooking}
                  isAdmin={false}
                />
              ))}
            </div>
          )}

          {/* Booking Form */}
          {showForm && (
            <BookingForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              loading={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Wrapper
const MyBookingsPage = () => (
  <BookingProvider>
    <MyBookingsInner />
  </BookingProvider>
);

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F9FAFB',
    padding: '32px 24px',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
  },
  toast: {
    position: 'fixed',
    top: 20,
    right: 20,
    padding: '12px 20px',
    borderRadius: 10,
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    zIndex: 2000,
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: 960,
    margin: '0 auto 24px',
  },
  pageTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: '#111827',
  },
  pageSubtitle: {
    margin: '4px 0 0',
    fontSize: 14,
    color: '#6B7280',
  },
  btnNew: {
    padding: '10px 20px',
    background: '#6366F1',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
  },
  filterBar: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    maxWidth: 960,
    margin: '0 auto 24px',
  },
  filterBtn: {
    padding: '7px 16px',
    borderRadius: 8,
    background: '#fff',
    border: '1.5px solid #E5E7EB',
    fontSize: 13,
    fontWeight: 600,
    color: '#6B7280',
    cursor: 'pointer',
  },
  filterBtnActive: {
    background: '#6366F1',
    borderColor: '#6366F1',
    color: '#fff',
  },
  errorBanner: {
    maxWidth: 960,
    margin: '0 auto 16px',
    background: '#FEE2E2',
    color: '#991B1B',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 14,
  },
  grid: {
    maxWidth: 960,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: 16,
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 60,
  },
  spinner: {
    width: 36,
    height: 36,
    border: '3px solid #E5E7EB',
    borderTop: '3px solid #6366F1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  empty: {
    maxWidth: 400,
    margin: '60px auto',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: 48, margin: 0 },
  emptyTitle: {
    margin: '12px 0 4px',
    fontSize: 18,
    fontWeight: 700,
    color: '#374151',
  },
  emptyHint: {
    margin: 0,
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 1.6,
  },
};

export default MyBookingsPage;