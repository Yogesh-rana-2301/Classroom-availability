import { prisma } from "../../config/db.js";

export const classroomsRepository = {
  async list(filters) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters.building
        ? {
            building: {
              contains: filters.building,
              mode: "insensitive",
            },
          }
        : {}),
      ...(filters.minCapacity || filters.maxCapacity
        ? {
            capacity: {
              ...(filters.minCapacity ? { gte: filters.minCapacity } : {}),
              ...(filters.maxCapacity ? { lte: filters.maxCapacity } : {}),
            },
          }
        : {}),
      ...(typeof filters.isMaintenance === "boolean"
        ? { isMaintenance: filters.isMaintenance }
        : {}),
      ...(filters.search
        ? {
            OR: [
              { roomCode: { contains: filters.search, mode: "insensitive" } },
              { building: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.facilities
        ? {
            facilities: {
              hasSome: filters.facilities
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.classroom.findMany({
        where,
        orderBy: { roomCode: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.classroom.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  async getById(id) {
    return prisma.classroom.findUnique({ where: { id } });
  },

  async getAvailabilityContext({
    classroomId,
    compatibleDayValues,
    dayStart,
    dayEnd,
  }) {
    const [classroom, timetableSlots, bookings] = await prisma.$transaction([
      prisma.classroom.findUnique({
        where: { id: classroomId },
        select: {
          id: true,
          isMaintenance: true,
        },
      }),
      prisma.timetableSlot.findMany({
        where: {
          classroomId,
          isActive: true,
          dayOfWeek: { in: compatibleDayValues },
        },
        orderBy: [{ startTime: "asc" }, { endTime: "asc" }],
        select: {
          id: true,
          startTime: true,
          endTime: true,
          subject: true,
          facultyName: true,
        },
      }),
      prisma.booking.findMany({
        where: {
          classroomId,
          status: "CONFIRMED",
          date: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
        orderBy: [{ startTime: "asc" }, { endTime: "asc" }],
        select: {
          id: true,
          startTime: true,
          endTime: true,
          purpose: true,
          userId: true,
        },
      }),
    ]);

    return {
      classroom,
      timetableSlots,
      bookings,
    };
  },
};
