import { timetableRepository } from "./timetable.repository.js";

export const timetableService = {
  async list() {
    const items = await timetableRepository.list();
    return { items };
  },

  async importData(payload) {
    return {
      message: "Implement JSON parser and transactional upsert for timetable",
      received: Array.isArray(payload) ? payload.length : 0,
    };
  },
};
