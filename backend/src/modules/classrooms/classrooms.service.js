import { classroomsRepository } from "./classrooms.repository.js";

export const classroomsService = {
  async list(filters) {
    const items = await classroomsRepository.list(filters);
    return { items };
  },

  async getById(id) {
    const item = await classroomsRepository.getById(id);
    return { item };
  },

  async availability(id, query) {
    return {
      roomId: id,
      date: query.date || null,
      slots: [],
      message: "Compose timetable + bookings + maintenance in this service",
    };
  },
};
