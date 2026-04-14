import { z } from "zod";

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeOnlySchema = z.string().regex(/^\d{2}:\d{2}$/);

export const createBookingSchema = z.object({
  roomId: z.string().min(1),
  date: dateOnlySchema,
  startTime: timeOnlySchema,
  endTime: timeOnlySchema,
  purpose: z.string().max(250).optional(),
});

export const bookingIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const bookingsListQuerySchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
  classroomId: z.string().min(1).optional(),
  fromDate: dateOnlySchema.optional(),
  toDate: dateOnlySchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});
