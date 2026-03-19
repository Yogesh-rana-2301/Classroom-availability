function toIso(value) {
  return value instanceof Date ? value.toISOString() : value;
}

export function toTimetableImportDto(payload) {
  return {
    message: payload.message,
    payloadPreview: payload.payloadPreview,
  };
}

export function toTimetableListDto(payload = {}) {
  const items = payload.items || [];
  return {
    items,
    total: payload.total ?? items.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? items.length,
    count: items.length,
  };
}

export function toMaintenanceDto(classroom) {
  return { classroom };
}

export function toAdminBookingsDto(payload = {}) {
  const items = payload.items || [];
  return {
    items: items.map((item) => ({
      ...item,
      date: toIso(item.date),
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
    })),
    total: payload.total ?? items.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? items.length,
    count: items.length,
  };
}

export function toAuditLogsDto(payload = {}) {
  const rows = payload.rows || [];
  return {
    rows: rows.map((row) => ({
      ...row,
      createdAt: toIso(row.createdAt),
    })),
    total: payload.total ?? rows.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? rows.length,
    count: rows.length,
  };
}
