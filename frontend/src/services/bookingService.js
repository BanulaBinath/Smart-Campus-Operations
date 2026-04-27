const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
};

export const getMyBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${API_BASE}/bookings/my${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);
};

export const getAllBookings = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${API_BASE}/bookings${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);
};

export const getBookingById = (id) =>
  fetch(`${API_BASE}/bookings/${id}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);

export const createBooking = (data) =>
  fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  }).then(handleResponse);

export const approveBooking = (id) =>
  fetch(`${API_BASE}/bookings/${id}/approve`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);

export const rejectBooking = (id, reason) =>
  fetch(`${API_BASE}/bookings/${id}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ reason }),
  }).then(handleResponse);

export const cancelBooking = (id) =>
  fetch(`${API_BASE}/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);

export const deleteBooking = (id) =>
  fetch(`${API_BASE}/bookings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);

export const getFacilities = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${API_BASE}/facilities${query ? `?${query}` : ''}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);
};

export const getFacilityAvailability = (facilityId, date) =>
  fetch(`${API_BASE}/bookings/availability?facilityId=${facilityId}&date=${date}`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  }).then(handleResponse);