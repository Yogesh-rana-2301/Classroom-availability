export function sendResponse(res, statusCode, payload) {
  return res.status(statusCode).json(payload);
}
