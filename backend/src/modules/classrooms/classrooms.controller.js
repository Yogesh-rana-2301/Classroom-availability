import { classroomsService } from "./classrooms.service.js";

export const classroomsController = {
  async list(req, res) {
    const data = await classroomsService.list(req.query);
    return res.status(200).json(data);
  },

  async getById(req, res) {
    const data = await classroomsService.getById(req.params.id);
    return res.status(200).json(data);
  },

  async availability(req, res) {
    const data = await classroomsService.availability(req.params.id, req.query);
    return res.status(200).json(data);
  },
};
