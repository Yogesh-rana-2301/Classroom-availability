import { bookingsService } from "./bookings.service.js";

export const bookingsController = {
  async create(req, res) {
    const data = await bookingsService.create(req.user, req.body);
    return res.status(201).json(data);
  },

  async mine(req, res) {
    const data = await bookingsService.mine(req.user.id);
    return res.status(200).json(data);
  },

  async getById(req, res) {
    const data = await bookingsService.getById(req.params.id);
    return res.status(200).json(data);
  },

  async cancel(req, res) {
    const data = await bookingsService.cancel(req.user, req.params.id);
    return res.status(200).json(data);
  },
};
