import { authService } from "./auth.service.js";
import { env } from "../../config/env.js";
import { sendSuccess } from "../../common/response/formatter.js";
import {
  toAuthMessageDto,
  toAuthSessionDto,
  toCurrentUserDto,
} from "./auth.dto.js";

export const authController = {
  async login(req, res) {
    const result = await authService.login(req.body, {
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: Math.max(result.refreshTokenExpiresAt.getTime() - Date.now(), 0),
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Login successful",
      data: toAuthSessionDto({
        user: result.user,
        accessToken: result.accessToken,
      }),
      meta: { module: "auth", action: "login" },
    });
  },

  async refresh(req, res) {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const result = await authService.refresh(token, {
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: Math.max(result.refreshTokenExpiresAt.getTime() - Date.now(), 0),
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Token refreshed",
      data: toAuthSessionDto({
        user: result.user,
        accessToken: result.accessToken,
      }),
      meta: { module: "auth", action: "refresh" },
    });
  },

  async logout(req, res) {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logout(token);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Logged out",
      data: toAuthMessageDto("Logged out"),
      meta: { module: "auth", action: "logout" },
    });
  },

  async logoutAll(req, res) {
    await authService.logoutAll(req.user.id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: "Logged out from all devices",
      data: toAuthMessageDto("Logged out from all devices"),
      meta: { module: "auth", action: "logoutAll" },
    });
  },

  async me(req, res) {
    return sendSuccess(res, {
      statusCode: 200,
      message: "Current user",
      data: toCurrentUserDto(req.user),
      meta: { module: "auth", action: "me" },
    });
  },
};
