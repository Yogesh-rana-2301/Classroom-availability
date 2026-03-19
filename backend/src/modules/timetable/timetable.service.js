import { timetableRepository } from "./timetable.repository.js";

export const timetableService = {
  async list(query) {
    return timetableRepository.list(query);
  },

  async importData(payload) {
    return {
      message: "Implement JSON parser and transactional upsert for timetable",
      received: Array.isArray(payload) ? payload.length : 0,
    };
  },
};
