import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { bookingsController } from "./bookings.controller.js";
import {
  bookingIdParamsSchema,
  createBookingSchema,
} from "./bookings.schemas.js";

export const bookingsRouter = Router();

bookingsRouter.post(
  "/",
  requireAuth,
  requireRole(["ADMIN", "FACULTY"]),
  validateRequest({ body: createBookingSchema }),
  asyncHandler(bookingsController.create),
);

bookingsRouter.get(
  "/my",
  requireAuth,
  requireRole(["ADMIN", "FACULTY"]),
  asyncHandler(bookingsController.mine),
);

bookingsRouter.get(
  "/:id",
  requireAuth,
  requireRole(["ADMIN", "FACULTY"]),
  validateRequest({ params: bookingIdParamsSchema }),
  asyncHandler(bookingsController.getById),
);

bookingsRouter.patch(
  "/:id/cancel",
  requireAuth,
  requireRole(["ADMIN", "FACULTY"]),
  validateRequest({ params: bookingIdParamsSchema }),
  asyncHandler(bookingsController.cancel),
);
