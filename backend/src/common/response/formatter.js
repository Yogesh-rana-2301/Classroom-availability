function buildMeta(res, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    requestId: res?.locals?.requestId || null,
    ...meta,
  };
}

export function sendSuccess(
  res,
  { statusCode = 200, message = "OK", data = null, meta = {} } = {},
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: buildMeta(res, meta),
  });
}

export function sendError(
  res,
  {
    statusCode = 500,
    message = "Internal Server Error",
    errors,
    meta = {},
  } = {},
) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    meta: buildMeta(res, meta),
  });
}
