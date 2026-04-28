import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getMyBookings,
  getAllBookings,
  createBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
  deleteBooking,
} from '../../services/bookingService';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });

  const clearError = () => setError(null);

  const fetchMyBookings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings(params);
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings(data.content || []);
        setPagination({
          page: data.number || 0,
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || 0,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBookings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllBookings(params);
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings(data.content || []);
        setPagination({
          page: data.number || 0,
          totalPages: data.totalPages || 1,
          totalElements: data.totalElements || 0,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitBooking = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createBooking(formData);
      setBookings((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = useCallback(async (id) => {
    setError(null);
    try {
      const updated = await approveBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleReject = useCallback(async (id, reason) => {
    setError(null);
    try {
      const updated = await rejectBooking(id, reason);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleCancel = useCallback(async (id) => {
    setError(null);
    try {
      const updated = await cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleDelete = useCallback(async (id) => {
    setError(null);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        error,
        pagination,
        clearError,
        fetchMyBookings,
        fetchAllBookings,
        submitBooking,
        handleApprove,
        handleReject,
        handleCancel,
        handleDelete,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
};
