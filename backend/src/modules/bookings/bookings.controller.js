import { bookingsService } from "./bookings.service.js";
import { sendSuccess } from "../../common/response/formatter.js";
import { toBookingDto, toBookingListDto } from "./bookings.dto.js";

export const bookingsController = {
  async create(req, res) {
    const data = await bookingsService.create(req.user, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: "Booking created",
      data: { booking: toBookingDto(data.booking) },
      meta: { module: "bookings", action: "create" },
    });
  },

  async mine(req, res) {
    const data = await bookingsService.mine(req.user.id, req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "My bookings",
      data: toBookingListDto(data),
      meta: { module: "bookings", action: "mine" },
    });
  },

  async getById(req, res) {
    const data = await bookingsService.getById(req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Booking details",
      data: { item: toBookingDto(data.item) },
      meta: { module: "bookings", action: "getById" },
    });
  },

  async cancel(req, res) {
    const data = await bookingsService.cancel(req.user, req.params.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Booking cancelled",
      data: { booking: toBookingDto(data.booking) },
      meta: { module: "bookings", action: "cancel" },
    });
  },
};
