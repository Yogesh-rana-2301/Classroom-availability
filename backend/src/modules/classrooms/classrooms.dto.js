export function toClassroomDto(item) {
  if (!item) {
    return null;
  }

  return {
    id: item.id,
    roomCode: item.roomCode,
    building: item.building,
    capacity: item.capacity,
    facilities: item.facilities,
    isMaintenance: item.isMaintenance,
  };
}

export function toClassroomListDto(payload = {}) {
  const items = payload.items || [];
  return {
    items: items.map(toClassroomDto),
    total: payload.total ?? items.length,
    page: payload.page ?? 1,
    pageSize: payload.pageSize ?? items.length,
    count: items.length,
  };
}

export function toAvailabilityDto(payload) {
  return {
    roomId: payload.roomId,
    date: payload.date,
    slots: payload.slots || [],
    ...(payload.message ? { message: payload.message } : {}),
  };
}
