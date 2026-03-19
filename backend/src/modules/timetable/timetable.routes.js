import { Router } from "express";
import { timetableController } from "./timetable.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLE_GROUPS } from "../../common/auth/authorization.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { timetableListQuerySchema } from "./timetable.schemas.js";

export const timetableRouter = Router();

timetableRouter.use(requireAuth, requireRole(ROLE_GROUPS.ADMIN_ONLY));

timetableRouter.get(
  "/",
  validateRequest({ query: timetableListQuerySchema }),
  timetableController.list,
);
timetableRouter.post("/import", timetableController.importData);
