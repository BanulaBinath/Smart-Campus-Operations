const BASE_URL = "http://localhost:8080/api/bookings";

export const createBooking = async (bookingData, userEmail) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Email": userEmail,
    },
    body: JSON.stringify(bookingData),
  });
  return response.json();
};

export const getMyBookings = async (userEmail) => {
  const response = await fetch(`${BASE_URL}/my`, {
    headers: { "X-User-Email": userEmail },
  });
  return response.json();
};

export const getAllBookings = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const updateBookingStatus = async (id, status, adminReason) => {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, adminReason }),
  });
  return response.json();
};

export const cancelBooking = async (id, userEmail) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { "X-User-Email": userEmail },
  });
};