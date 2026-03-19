import { z } from "zod";

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
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
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
  dayOfWeek: z.coerce.number().int().min(0).max(7).optional(),
  classroomId: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});
