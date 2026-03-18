import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { adminController } from "./admin.controller.js";
import {
  maintenanceBodySchema,
  maintenanceParamsSchema,
} from "./admin.schemas.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["ADMIN"]));

adminRouter.post(
  "/timetable/import",
  asyncHandler(adminController.importTimetable),
);

adminRouter.get("/timetable", asyncHandler(adminController.listTimetable));

adminRouter.patch(
  "/classrooms/:id/maintenance",
  validateRequest({
    params: maintenanceParamsSchema,
    body: maintenanceBodySchema,
  }),
  asyncHandler(adminController.toggleMaintenance),
);

adminRouter.get("/bookings", asyncHandler(adminController.bookings));

adminRouter.get("/audit-logs", asyncHandler(adminController.auditLogs));
