import { z } from "zod";

const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const timetableEntrySchema = z.object({
  course: z.string().trim().min(1),
  venue: z.string().trim().min(1),
});

const timeSlotMapSchema = z.record(
  z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/),
  z.array(timetableEntrySchema),
);

export const timetableImportBodySchema = z.object({
  academic_year: z.string().trim().optional(),
  department: z.string().trim().optional(),
  schedule: z.record(z.string().min(1), timeSlotMapSchema),
});

export const maintenanceParamsSchema = z.object({
  id: z.string().min(1),
});

export const maintenanceBodySchema = z.object({
  isMaintenance: z.boolean(),
});

export const adminBookingsQuerySchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED"]).optional(),
  userId: z.string().min(1).optional(),
  classroomId: z.string().min(1).optional(),
  fromDate: dateOnlySchema.optional(),
  toDate: dateOnlySchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export const adminAuditLogsQuerySchema = z.object({
  action: z.string().trim().min(1).optional(),
  entity: z.string().trim().min(1).optional(),
  userId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

export const adminTimetableQuerySchema = z.object({
  includeHistory: z.coerce.boolean().optional().default(false),
  dayOfWeek: z.coerce.number().int().min(0).max(7).optional(),
  classroomId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});
