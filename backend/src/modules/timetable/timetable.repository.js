import { prisma } from "../../config/db.js";

export const timetableRepository = {
  async list() {
    return prisma.timetableSlot.findMany({
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  },
};
