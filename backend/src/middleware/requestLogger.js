import { logger } from "../common/logger/logger.js";

export function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;

    logger.info("http_request", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(elapsedMs.toFixed(2)),
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
      userId: req.user?.id || null,
    });
  });

  return next();
}
