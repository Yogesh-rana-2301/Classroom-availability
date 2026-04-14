import { prisma } from "../../config/db.js";

export const timetableRepository = {
  async list(query) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const skip = (page - 1) * pageSize;

    const where = {
      isActive: true,
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
};
