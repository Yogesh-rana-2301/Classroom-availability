export function toTimetableItemsDto(payload = {}) {
  const items = payload.items || [];
  return {
    items,
    total: payload.total ?? items.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? items.length,
    count: items.length,
  };
}

export function toTimetableImportResultDto(result) {
  return {
    message: result.message,
    received: result.received,
  };
}
