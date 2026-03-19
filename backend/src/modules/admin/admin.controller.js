import { adminService } from "./admin.service.js";
import { sendSuccess } from "../../common/response/formatter.js";
import {
  toAdminBookingsDto,
  toAuditLogsDto,
  toMaintenanceDto,
  toTimetableImportDto,
  toTimetableListDto,
} from "./admin.dto.js";

export const adminController = {
  async importTimetable(req, res) {
    const data = await adminService.importTimetable(req.body);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Timetable import processed",
      data: toTimetableImportDto(data),
      meta: { module: "admin", action: "importTimetable" },
    });
  },

  async listTimetable(req, res) {
    const data = await adminService.listTimetable(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Timetable list",
      data: toTimetableListDto(data),
      meta: { module: "admin", action: "listTimetable" },
    });
  },

  async toggleMaintenance(req, res) {
    const data = await adminService.toggleMaintenance(
      req.params.id,
      req.body?.isMaintenance,
    );
    return sendSuccess(res, {
      statusCode: 200,
      message: "Maintenance status updated",
      data: toMaintenanceDto(data.classroom),
      meta: { module: "admin", action: "toggleMaintenance" },
    });
  },

  async bookings(req, res) {
    const data = await adminService.bookings(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "All bookings",
      data: toAdminBookingsDto(data),
      meta: { module: "admin", action: "bookings" },
    });
  },

  async auditLogs(req, res) {
    const data = await adminService.auditLogs(req.query);
    return sendSuccess(res, {
      statusCode: 200,
      message: "Audit logs",
      data: toAuditLogsDto(data),
      meta: { module: "admin", action: "auditLogs" },
    });
  },
};
