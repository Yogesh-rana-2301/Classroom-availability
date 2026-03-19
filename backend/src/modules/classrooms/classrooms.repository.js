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
};
