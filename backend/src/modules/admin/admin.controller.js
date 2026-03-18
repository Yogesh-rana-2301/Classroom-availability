import { adminService } from "./admin.service.js";

export const adminController = {
  async importTimetable(req, res) {
    const data = await adminService.importTimetable(req.body);
    return res.status(200).json(data);
  },

  async listTimetable(_req, res) {
    const data = await adminService.listTimetable();
    return res.status(200).json(data);
  },

  async toggleMaintenance(req, res) {
    const data = await adminService.toggleMaintenance(
      req.params.id,
      req.body?.isMaintenance,
    );
    return res.status(200).json(data);
  },

  async bookings(_req, res) {
    const data = await adminService.bookings();
    return res.status(200).json(data);
  },

  async auditLogs(_req, res) {
    const data = await adminService.auditLogs();
    return res.status(200).json(data);
  },
};
