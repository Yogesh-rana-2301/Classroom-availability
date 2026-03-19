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

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
  },

  async createRefreshTokenSession({
    userId,
    tokenHash,
    expiresAt,
    userAgent,
    ipAddress,
  }) {
    return prisma.refreshTokenSession.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
      },
    });
  },

  async findRefreshTokenSessionByHash(tokenHash) {
    return prisma.refreshTokenSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });
  },

  async rotateRefreshTokenSession({
    oldSessionId,
    replacedByTokenHash,
    revokeReason,
    newSession,
  }) {
    return prisma.$transaction(async (tx) => {
      await tx.refreshTokenSession.update({
        where: { id: oldSessionId },
        data: {
          revokedAt: new Date(),
          replacedByTokenHash,
          revokedReason,
        },
      });

      return tx.refreshTokenSession.create({
        data: newSession,
      });
    });
  },

  async revokeRefreshTokenSessionByHash(tokenHash, reason = "LOGOUT") {
    return prisma.refreshTokenSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  },

  async revokeAllRefreshTokenSessionsForUser(userId, reason = "FORCED_REVOKE") {
    return prisma.refreshTokenSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: reason,
      },
    });
  },

  async revokeOldestActiveSessionsForUser(userId, keepCount) {
    const activeSessions = await prisma.refreshTokenSession.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
      },
    });

    const overflowSessions = activeSessions.slice(Math.max(keepCount, 0));
    if (!overflowSessions.length) {
      return { count: 0 };
    }

    return prisma.refreshTokenSession.updateMany({
      where: {
        id: {
          in: overflowSessions.map((session) => session.id),
        },
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
        revokedReason: "SESSION_LIMIT",
      },
    });
  },

  async revokeExpiredRefreshTokenSessionsForUser(userId) {
    return prisma.refreshTokenSession.updateMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        revokedAt: new Date(),
        revokedReason: "TOKEN_EXPIRED",
      },
    });
  },
};
