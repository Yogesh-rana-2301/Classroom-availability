function emit(level, message, context = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

export const logger = {
  info: (message, context = {}) => emit("info", message, context),
  warn: (message, context = {}) => emit("warn", message, context),
  error: (message, context = {}) => emit("error", message, context),
};
