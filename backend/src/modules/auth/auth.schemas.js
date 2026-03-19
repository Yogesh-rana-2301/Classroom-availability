import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
