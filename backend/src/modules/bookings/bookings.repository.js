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

  async findByUser(userId) {
    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { classroom: true },
    });
  },

  async findById(id) {
    return prisma.booking.findUnique({ where: { id } });
  },

  async cancel(bookingId, userId, canOverride) {
    const current = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!current) {
      return null;
    }

    if (!canOverride && current.userId !== userId) {
      throw new Error("Not allowed to cancel this booking");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  },
};
