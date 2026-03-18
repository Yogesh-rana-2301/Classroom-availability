import { auditRepository } from "./audit.repository.js";

export const auditService = {
  async log(payload) {
    return auditRepository.create(payload);
  },
};
