export function formatISODate(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toISOString().slice(0, 10);
}
