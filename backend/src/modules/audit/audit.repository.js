import { prisma } from "../../config/db.js";

export const auditRepository = {
  async create(payload) {
    return prisma.auditLog.create({ data: payload });
  },
};
