import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { authController } from "./auth.controller.js";
import { loginSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRouter.post("/refresh", asyncHandler(authController.refresh));

authRouter.post("/logout", asyncHandler(authController.logout));

authRouter.get("/me", requireAuth, asyncHandler(authController.me));
