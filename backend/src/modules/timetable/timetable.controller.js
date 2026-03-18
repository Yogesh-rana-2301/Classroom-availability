import { timetableService } from "./timetable.service.js";

export const timetableController = {
  async list(_req, res) {
    const data = await timetableService.list();
    return res.status(200).json(data);
  },

  async importData(req, res) {
    const data = await timetableService.importData(req.body);
    return res.status(200).json(data);
  },
};
