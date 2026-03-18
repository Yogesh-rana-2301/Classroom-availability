import { prisma } from "../../config/db.js";

export const authRepository = {
  async findByEmail(email) {
    if (!email) {
      return null;
    }
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        passwordHash: true,
      },
    });
  },
};
