import { createRateLimiter } from "../../middleware/rateLimit.js";

const WINDOW_15_MINUTES = 15 * 60 * 1000;

function authIdentity(req) {
  const email = req.body?.email
    ? String(req.body.email).toLowerCase()
    : "unknown";
  return `${req.ip || "unknown"}:${email}`;
}

export const loginRateLimiter = createRateLimiter({
  windowMs: WINDOW_15_MINUTES,
  max: 8,
  message: "Too many login attempts. Please try again in a few minutes.",
  keyPrefix: "auth:login",
  keyGenerator: authIdentity,
});

export const refreshRateLimiter = createRateLimiter({
  windowMs: WINDOW_15_MINUTES,
  max: 30,
  message: "Too many token refresh attempts. Please try again later.",
  keyPrefix: "auth:refresh",
});

export const logoutRateLimiter = createRateLimiter({
  windowMs: WINDOW_15_MINUTES,
  max: 60,
  message: "Too many logout requests. Please try again later.",
  keyPrefix: "auth:logout",
});
