import { prisma } from "../../config/db.js";

export const adminService = {
  async importTimetable(payload) {
    return {
      message: "Wire timetable parser",
      payloadPreview: Array.isArray(payload) ? payload.length : 0,
    };
  },

  async listTimetable(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(typeof query.dayOfWeek === "number"
        ? { dayOfWeek: query.dayOfWeek }
        : {}),
      ...(query.classroomId ? { classroomId: query.classroomId } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.timetableSlot.findMany({
        where,
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        skip,
        take: pageSize,
      }),
      prisma.timetableSlot.count({ where }),
    ]);

    return { items, total, page, pageSize };
  },

  async toggleMaintenance(classroomId, isMaintenance = true) {
    const classroom = await prisma.classroom.update({
      where: { id: classroomId },
      data: { isMaintenance: Boolean(isMaintenance) },
    });
    return { classroom };
  },

  async bookings(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.classroomId ? { classroomId: query.classroomId } : {}),
      ...(query.fromDate || query.toDate
        ? {
            date: {
              ...(query.fromDate ? { gte: new Date(query.fromDate) } : {}),
              ...(query.toDate ? { lte: new Date(query.toDate) } : {}),
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        include: { classroom: true, user: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ]);

    return { items, total, page, pageSize };
  },

  async auditLogs(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(query.action
        ? {
            action: {
              contains: query.action,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.entity
        ? {
            entity: {
              contains: query.entity,
              mode: "insensitive",
            },
          }
        : {}),
      ...(query.userId ? { userId: query.userId } : {}),
    };

    const [rows, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { rows, total, page, pageSize };
  },
};
