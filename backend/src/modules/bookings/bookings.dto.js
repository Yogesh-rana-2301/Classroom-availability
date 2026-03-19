function toIso(value) {
  return value instanceof Date ? value.toISOString() : value;
}

export function toBookingDto(booking) {
  if (!booking) {
    return null;
  }

  return {
    id: booking.id,
    classroomId: booking.classroomId,
    userId: booking.userId,
    date: toIso(booking.date),
    startTime: booking.startTime,
    endTime: booking.endTime,
    purpose: booking.purpose,
    status: booking.status,
    createdAt: toIso(booking.createdAt),
    updatedAt: toIso(booking.updatedAt),
    ...(booking.classroom ? { classroom: booking.classroom } : {}),
  };
}

export function toBookingListDto(payload = {}) {
  const items = payload.items || [];
  return {
    items: items.map(toBookingDto),
    total: payload.total ?? items.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? items.length,
    count: items.length,
  };
}
