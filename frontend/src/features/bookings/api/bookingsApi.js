import { api } from "../../../services/api";

export async function createBooking(payload) {
  const { data } = await api.post("/bookings", payload);
  return data;
}

export async function fetchMyBookings() {
  const { data } = await api.get("/bookings/my");
  return data;
}

export async function cancelBooking(bookingId) {
  const { data } = await api.patch(`/bookings/${bookingId}/cancel`);
  return data;
}
