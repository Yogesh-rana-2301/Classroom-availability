import { bookingsRepository } from "./bookings.repository.js";
import { bookingConflictService } from "./booking-conflict.service.js";
import { ROLES } from "../../common/auth/authorization.js";

export const bookingsService = {
  async create(user, payload) {
    await bookingConflictService.assertNoConflict(payload);
    const booking = await bookingsRepository.createWithAudit(user.id, payload);
    return { booking };
  },

  async mine(userId, query) {
    return bookingsRepository.findByUser(userId, query);
  },

  async getById(id) {
    const item = await bookingsRepository.findById(id);
    if (!item) {
      const error = new Error("Booking not found");
      error.status = 404;
      throw error;
    }
    return { item };
  },

  async cancel(user, bookingId) {
    const updated = await bookingsRepository.cancel(
      bookingId,
      user.id,
      user.role === ROLES.ADMIN,
    );
    return { booking: updated };
  },
};
