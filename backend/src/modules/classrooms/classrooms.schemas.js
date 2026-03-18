import { z } from "zod";

export const classroomsQuerySchema = z.object({
  building: z.string().optional(),
  minCapacity: z.coerce.number().int().positive().optional(),
  date: z.string().optional(),
});

export const classroomIdParamsSchema = z.object({
  id: z.string().min(1),
});
