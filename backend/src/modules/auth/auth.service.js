import bcrypt from "bcryptjs";
import { authRepository } from "./auth.repository.js";
import { signAccessToken, signRefreshToken } from "./auth.tokens.js";
import { auditService } from "../audit/audit.service.js";

export const authService = {
  async login(payload) {
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

    await auditService.log({
      userId: user.id,
      action: "AUTH_LOGIN",
      entity: "USER",
      entityId: user.id,
      metadata: {
        email: user.email,
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
    };
  },
};
