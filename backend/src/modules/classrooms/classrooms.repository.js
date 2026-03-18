import { prisma } from "../../config/db.js";

export const classroomsRepository = {
  async list(_filters) {
    return prisma.classroom.findMany({
      orderBy: { roomCode: "asc" },
    });
  },

  async getById(id) {
    return prisma.classroom.findUnique({ where: { id } });
  },
};
