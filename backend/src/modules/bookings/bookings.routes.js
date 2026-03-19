import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ROLE_GROUPS } from "../../common/auth/authorization.js";
import { bookingsController } from "./bookings.controller.js";
import {
  bookingIdParamsSchema,
  bookingsListQuerySchema,
  createBookingSchema,
} from "./bookings.schemas.js";

export const bookingsRouter = Router();

bookingsRouter.post(
  "/",
  requireAuth,
  requireRole(ROLE_GROUPS.STAFF),
  validateRequest({ body: createBookingSchema }),
  asyncHandler(bookingsController.create),
);

bookingsRouter.get(
  "/my",
  requireAuth,
  requireRole(ROLE_GROUPS.STAFF),
  validateRequest({ query: bookingsListQuerySchema }),
  asyncHandler(bookingsController.mine),
);

bookingsRouter.get(
  "/:id",
  requireAuth,
  requireRole(ROLE_GROUPS.STAFF),
  validateRequest({ params: bookingIdParamsSchema }),
  asyncHandler(bookingsController.getById),
);

bookingsRouter.patch(
  "/:id/cancel",
  requireAuth,
  requireRole(ROLE_GROUPS.STAFF),
  validateRequest({ params: bookingIdParamsSchema }),
  asyncHandler(bookingsController.cancel),
);
