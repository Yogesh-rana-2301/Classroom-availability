import { prisma } from "../../config/db.js";

export const classroomsRepository = {
  async listFilterOptions() {
    const [buildingRows, facilityRows] = await prisma.$transaction([
      prisma.classroom.findMany({
        select: { building: true },
        distinct: ["building"],
        orderBy: { building: "asc" },
      }),
      prisma.classroom.findMany({
        select: { facilities: true },
      }),
    ]);

    const buildings = buildingRows.map((row) => row.building).filter(Boolean);
    const facilities = Array.from(
      new Set(
        facilityRows.flatMap((row) =>
          Array.isArray(row.facilities) ? row.facilities : [],
        ),
      ),
    ).sort((left, right) => left.localeCompare(right));

    return { buildings, facilities };
  },

  async list(filters) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;
    const availability = filters.availability;

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

    if (availability) {
      where.AND = [
        {
          timetableSlots: {
            none: {
              isActive: true,
              dayOfWeek: { in: availability.compatibleDayValues },
              startTime: { lt: availability.endTime },
              endTime: { gt: availability.startTime },
            },
          },
        },
        {
          bookings: {
            none: {
              status: "CONFIRMED",
              date: {
                gte: availability.dayStart,
                lt: availability.dayEnd,
              },
              startTime: { lt: availability.endTime },
              endTime: { gt: availability.startTime },
            },
          },
        },
      ];
    }

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
