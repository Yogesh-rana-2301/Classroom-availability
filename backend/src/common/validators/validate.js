export function validate(schema, payload) {
  const result = schema.safeParse(payload);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.issues,
    };
  }

  return {
    valid: true,
    data: result.data,
  };
}
