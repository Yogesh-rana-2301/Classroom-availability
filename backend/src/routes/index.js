import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { classroomsRouter } from "../modules/classrooms/classrooms.routes.js";
import { bookingsRouter } from "../modules/bookings/bookings.routes.js";
import { adminRouter } from "../modules/admin/admin.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/classrooms", classroomsRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/admin", adminRouter);
