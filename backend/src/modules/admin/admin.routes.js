import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ROLE_GROUPS } from "../../common/auth/authorization.js";
import { adminController } from "./admin.controller.js";
import {
  adminAuditLogsQuerySchema,
  adminBookingsQuerySchema,
  adminTimetableQuerySchema,
  maintenanceBodySchema,
  maintenanceParamsSchema,
} from "./admin.schemas.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(ROLE_GROUPS.ADMIN_ONLY));

adminRouter.post(
  "/timetable/import",
  asyncHandler(adminController.importTimetable),
);

adminRouter.get(
  "/timetable",
  validateRequest({ query: adminTimetableQuerySchema }),
  asyncHandler(adminController.listTimetable),
);

adminRouter.patch(
  "/classrooms/:id/maintenance",
  validateRequest({
    params: maintenanceParamsSchema,
    body: maintenanceBodySchema,
  }),
  asyncHandler(adminController.toggleMaintenance),
);

adminRouter.get(
  "/bookings",
  validateRequest({ query: adminBookingsQuerySchema }),
  asyncHandler(adminController.bookings),
);

adminRouter.get(
  "/audit-logs",
  validateRequest({ query: adminAuditLogsQuerySchema }),
  asyncHandler(adminController.auditLogs),
);
