import { Router } from "express";
import { timetableController } from "./timetable.controller.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/authorize.js";

export const timetableRouter = Router();

timetableRouter.use(requireAuth, requireRole(["ADMIN"]));

timetableRouter.get("/", timetableController.list);
timetableRouter.post("/import", timetableController.importData);
