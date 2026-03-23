import { prisma } from "../../config/db.js";

export const bookingsRepository = {
  async createWithAudit(userId, payload) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          userId,
          classroomId: payload.roomId,
          date: new Date(payload.date),
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

    const where = {
      userId,
      ...(query.status ? { status: query.status } : {}),
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
