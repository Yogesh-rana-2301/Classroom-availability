import { z } from "zod";

export const timetableListQuerySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(7).optional(),
  classroomId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});
