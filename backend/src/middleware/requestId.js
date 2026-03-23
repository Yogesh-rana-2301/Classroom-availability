import { randomUUID } from "crypto";

export function requestId(req, res, next) {
  const inbound = req.get("x-request-id");
  const id = inbound && inbound.trim() ? inbound.trim() : randomUUID();

  req.requestId = id;
  res.locals.requestId = id;
  res.setHeader("x-request-id", id);

  return next();
}
