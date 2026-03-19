import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, logoutSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRouter.post("/refresh", asyncHandler(authController.refresh));

authRouter.post(
  "/logout",
  validateRequest({ body: logoutSchema }),
  asyncHandler(authController.logout),
);

authRouter.post(
  "/logout/all",
  requireAuth,
  asyncHandler(authController.logoutAll),
);

authRouter.get("/me", requireAuth, asyncHandler(authController.me));
