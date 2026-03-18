export function validateBookingInput(payload) {
  const requiredFields = ["roomId", "date", "startTime", "endTime"];
  const missing = requiredFields.filter((field) => !payload?.[field]);

  if (missing.length) {
    return { valid: false, message: `Missing fields: ${missing.join(", ")}` };
  }

  return { valid: true };
}
