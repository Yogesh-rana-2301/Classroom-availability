import { prisma } from "../../config/db.js";
import {
  getUtcDayBounds,
  parseDateOnlyUtc,
} from "../../common/validators/dateOnly.js";

export const bookingsRepository = {
  async createWithAudit(userId, payload) {
    const parsedDate = parseDateOnlyUtc(payload.date);
    if (!parsedDate) {
      const error = new Error("Invalid date format, expected YYYY-MM-DD");
      error.status = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          classroomId: payload.roomId,
          date: parsedDate.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          purpose: payload.purpose || null,
        },
        include: {
          classroom: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "BOOKING_CREATED",
          entity: "BOOKING",
          entityId: booking.id,
          metadata: {
            classroomId: payload.roomId,
            date: payload.date,
            startTime: payload.startTime,
            endTime: payload.endTime,
            purpose: payload.purpose || null,
          },
        },
      });

      return booking;
    });
  },

  async findByUser(userId, query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const parsedFromDate = query.fromDate
      ? parseDateOnlyUtc(query.fromDate)
      : null;
    const parsedToDate = query.toDate ? parseDateOnlyUtc(query.toDate) : null;

    if (query.fromDate && !parsedFromDate) {
      const error = new Error("Invalid fromDate format, expected YYYY-MM-DD");
      error.status = 400;
      throw error;
    }

    if (query.toDate && !parsedToDate) {
      const error = new Error("Invalid toDate format, expected YYYY-MM-DD");
      error.status = 400;
      throw error;
    }

    const dateFilter = {};
    if (parsedFromDate) {
      dateFilter.gte = parsedFromDate.date;
    }
    if (parsedToDate) {
      dateFilter.lt = getUtcDayBounds(parsedToDate.date).dayEnd;
    }

    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.classroomId ? { classroomId: query.classroomId } : {}),
      ...(Object.keys(dateFilter).length
        ? {
            date: {
              ...dateFilter,
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { classroom: true },
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  async findById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        classroom: true,
      },
    });
  },

  async cancel(bookingId, userId, canOverride) {
    const current = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!current) {
      return null;
    }

    if (!canOverride && current.userId !== userId) {
      const error = new Error("Not allowed to cancel this booking");
      error.status = 403;
      throw error;
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  },
};
