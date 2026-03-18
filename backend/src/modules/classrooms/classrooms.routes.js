import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { classroomsController } from "./classrooms.controller.js";
import {
  classroomIdParamsSchema,
  classroomsQuerySchema,
} from "./classrooms.schemas.js";

export const classroomsRouter = Router();

classroomsRouter.get(
  "/",
  requireAuth,
  validateRequest({ query: classroomsQuerySchema }),
  asyncHandler(classroomsController.list),
);

classroomsRouter.get(
  "/:id",
  requireAuth,
  validateRequest({ params: classroomIdParamsSchema }),
  asyncHandler(classroomsController.getById),
);

classroomsRouter.get(
  "/:id/availability",
  requireAuth,
  validateRequest({ params: classroomIdParamsSchema }),
  asyncHandler(classroomsController.availability),
);
