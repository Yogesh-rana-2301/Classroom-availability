function isBlank(value) {
  return !String(value || "").trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function isValidTime(value) {
  return /^\d{2}:\d{2}$/.test(String(value || ""));
}

export function validateLoginForm(payload = {}) {
  const errors = {};

  if (isBlank(payload.email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (isBlank(payload.password)) {
    errors.password = "Password is required.";
  } else if (String(payload.password).length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBookingForm(payload = {}) {
  const errors = {};

  if (isBlank(payload.roomId)) {
    errors.roomId = "Room is required.";
  }

  if (isBlank(payload.date)) {
    errors.date = "Date is required.";
  }

  if (isBlank(payload.startTime)) {
    errors.startTime = "Start time is required.";
  } else if (!isValidTime(payload.startTime)) {
    errors.startTime = "Use HH:mm format.";
  }

  if (isBlank(payload.endTime)) {
    errors.endTime = "End time is required.";
  } else if (!isValidTime(payload.endTime)) {
    errors.endTime = "Use HH:mm format.";
  }

  if (
    !errors.startTime &&
    !errors.endTime &&
    payload.startTime >= payload.endTime
  ) {
    errors.endTime = "End time must be after start time.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateTimetableImportPayload(payload) {
  const errors = {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    errors.payload = "Payload must be a JSON object.";
    return { valid: false, errors };
  }

  const schedule = payload.schedule;
  if (!schedule || typeof schedule !== "object" || Array.isArray(schedule)) {
    errors.schedule = "Schedule object is required.";
  } else if (Object.keys(schedule).length === 0) {
    errors.schedule = "Schedule cannot be empty.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
