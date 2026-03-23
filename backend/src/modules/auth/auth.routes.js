import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, logoutSchema } from "./auth.schemas.js";
import {
  loginRateLimiter,
  logoutRateLimiter,
  refreshRateLimiter,
} from "./auth.rate-limit.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  loginRateLimiter,
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRouter.post(
  "/refresh",
  refreshRateLimiter,
  asyncHandler(authController.refresh),
);

authRouter.post(
  "/logout",
  logoutRateLimiter,
  validateRequest({ body: logoutSchema }),
  asyncHandler(authController.logout),
);

authRouter.post(
  "/logout/all",
  logoutRateLimiter,
  requireAuth,
  asyncHandler(authController.logoutAll),
);

authRouter.get("/me", requireAuth, asyncHandler(authController.me));
