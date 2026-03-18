import { prisma } from "../../config/db.js";

export const adminService = {
  async importTimetable(payload) {
    return {
      message: "Wire timetable parser",
      payloadPreview: Array.isArray(payload) ? payload.length : 0,
    };
  },

  async listTimetable() {
    const items = await prisma.timetableSlot.findMany({
      orderBy: { dayOfWeek: "asc" },
    });
    return { items };
  },

  async toggleMaintenance(classroomId, isMaintenance = true) {
    const classroom = await prisma.classroom.update({
      where: { id: classroomId },
      data: { isMaintenance: Boolean(isMaintenance) },
    });
    return { classroom };
  },

  async bookings() {
    const items = await prisma.booking.findMany({
      include: { classroom: true, user: true },
    });
    return { items };
  },

  async auditLogs() {
    const rows = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return { rows };
  },
};
