import { authService } from "./auth.service.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { signAccessToken } from "./auth.tokens.js";

export const authController = {
  async login(req, res) {
    const result = await authService.login(req.body);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  },

  async refresh(req, res) {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
      const accessToken = signAccessToken({
        id: payload.id,
        role: payload.role,
      });

      return res.status(200).json({ accessToken });
    } catch (_error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  },

  async logout(_req, res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out" });
  },

  async me(req, res) {
    return res.status(200).json({ user: req.user || null });
  },
};
