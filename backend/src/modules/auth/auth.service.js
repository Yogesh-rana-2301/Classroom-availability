import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository.js";
import {
  getTokenExpiryDate,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.tokens.js";
import { auditService } from "../audit/audit.service.js";
import { env } from "../../config/env.js";

export const authService = {
  async login(payload, context = {}) {
    const user = await authRepository.findByEmail(payload.email);

    if (!user) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      throw error;
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.fullName,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken({ id: user.id, role: user.role });
    const refreshTokenHash = hashToken(refreshToken);
    const refreshTokenExpiresAt = getTokenExpiryDate(refreshToken);

    if (!refreshTokenExpiresAt) {
      const error = new Error("Failed to create refresh token session");
      error.status = 500;
      throw error;
    }

    await authRepository.createRefreshTokenSession({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshTokenExpiresAt,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });

    await authRepository.revokeExpiredRefreshTokenSessionsForUser(user.id);

    await authRepository.revokeOldestActiveSessionsForUser(
      user.id,
      env.AUTH_MAX_REFRESH_SESSIONS,
    );

    await auditService.log({
      userId: user.id,
      action: "AUTH_LOGIN",
      entity: "USER",
      entityId: user.id,
      metadata: {
        email: user.email,
        ipAddress: context.ipAddress || null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
    };
  },

  async refresh(rawRefreshToken, context = {}) {
    let payload;

    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch (_error) {
      const error = new Error("Invalid refresh token");
      error.status = 401;
      throw error;
    }

    const refreshTokenHash = hashToken(rawRefreshToken);
    const session =
      await authRepository.findRefreshTokenSessionByHash(refreshTokenHash);

    if (!session) {
      if (payload?.id) {
        await authRepository.revokeAllRefreshTokenSessionsForUser(
          payload.id,
          "TOKEN_REUSE_DETECTED",
        );

        await auditService.log({
          userId: payload.id,
          action: "AUTH_REFRESH_REUSE_DETECTED",
          entity: "USER",
          entityId: payload.id,
          metadata: {
            ipAddress: context.ipAddress || null,
            reason: "SESSION_NOT_FOUND",
          },
        });
      }
      const error = new Error("Refresh session not found");
      error.status = 401;
      throw error;
    }

    if (session.revokedAt) {
      await authRepository.revokeAllRefreshTokenSessionsForUser(
        session.userId,
        "TOKEN_REUSE_DETECTED",
      );

      await auditService.log({
        userId: session.userId,
        action: "AUTH_REFRESH_REUSE_DETECTED",
        entity: "USER",
        entityId: session.userId,
        metadata: {
          ipAddress: context.ipAddress || null,
          reason: "SESSION_ALREADY_REVOKED",
        },
      });

      const error = new Error("Refresh token has been revoked");
      error.status = 401;
      throw error;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await authRepository.revokeRefreshTokenSessionByHash(
        refreshTokenHash,
        "TOKEN_EXPIRED",
      );
      const error = new Error("Refresh token expired");
      error.status = 401;
      throw error;
    }

    const user =
      session.user || (await authRepository.findById(session.userId));
    if (!user) {
      const error = new Error("User not found for refresh session");
      error.status = 401;
      throw error;
    }

    const accessToken = signAccessToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.fullName,
    });

    const newRefreshToken = signRefreshToken({ id: user.id, role: user.role });
    const newRefreshTokenHash = hashToken(newRefreshToken);
    const newRefreshTokenExpiresAt = getTokenExpiryDate(newRefreshToken);

    if (!newRefreshTokenExpiresAt) {
      const error = new Error("Failed to rotate refresh session");
      error.status = 500;
      throw error;
    }

    await authRepository.rotateRefreshTokenSession({
      oldSessionId: session.id,
      replacedByTokenHash: newRefreshTokenHash,
      revokeReason: "ROTATED",
      newSession: {
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt: newRefreshTokenExpiresAt,
        userAgent: context.userAgent || null,
        ipAddress: context.ipAddress || null,
      },
    });

    await authRepository.revokeExpiredRefreshTokenSessionsForUser(user.id);

    await authRepository.revokeOldestActiveSessionsForUser(
      user.id,
      env.AUTH_MAX_REFRESH_SESSIONS,
    );

    await auditService.log({
      userId: user.id,
      action: "AUTH_REFRESH",
      entity: "USER",
      entityId: user.id,
      metadata: {
        ipAddress: context.ipAddress || null,
      },
    });

    return {
      user,
      accessToken,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: newRefreshTokenExpiresAt,
    };
  },

  async logout(rawRefreshToken) {
    if (!rawRefreshToken) {
      return;
    }

    const refreshTokenHash = hashToken(rawRefreshToken);
    const session =
      await authRepository.findRefreshTokenSessionByHash(refreshTokenHash);

    if (!session) {
      return;
    }

    await authRepository.revokeRefreshTokenSessionByHash(
      refreshTokenHash,
      "LOGOUT",
    );

    await auditService.log({
      userId: session.userId,
      action: "AUTH_LOGOUT",
      entity: "USER",
      entityId: session.userId,
      metadata: {
        sessionId: session.id,
      },
    });
  },

  async logoutAll(userId) {
    await authRepository.revokeAllRefreshTokenSessionsForUser(
      userId,
      "LOGOUT_ALL",
    );

    await auditService.log({
      userId,
      action: "AUTH_LOGOUT_ALL",
      entity: "USER",
      entityId: userId,
      metadata: {
        reason: "USER_REQUEST",
      },
    });
  },
};
