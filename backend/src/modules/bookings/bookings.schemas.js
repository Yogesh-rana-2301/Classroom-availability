import { z } from "zod";

export const createBookingSchema = z.object({
  roomId: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  purpose: z.string().max(250).optional(),
});

export const bookingIdParamsSchema = z.object({
  id: z.string().min(1),
});
