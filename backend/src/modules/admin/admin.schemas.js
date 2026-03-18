import { z } from "zod";

export const maintenanceParamsSchema = z.object({
  id: z.string().min(1),
});

export const maintenanceBodySchema = z.object({
  isMaintenance: z.boolean(),
});
