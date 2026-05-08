import { z } from "zod";

const timeOnlySchema = z.string().regex(/^\d{2}:\d{2}$/);

export const classroomsQuerySchema = z.object({
  building: z.string().optional(),
  minCapacity: z.coerce.number().int().positive().optional(),
  maxCapacity: z.coerce.number().int().positive().optional(),
  facilities: z.string().optional(),
  isMaintenance: z.coerce.boolean().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  date: z.string().optional(),
  startTime: timeOnlySchema.optional(),
  endTime: timeOnlySchema.optional(),
});

export const classroomIdParamsSchema = z.object({
  id: z.string().min(1),
});
