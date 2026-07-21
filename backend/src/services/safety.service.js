import { SafetyRepository } from '../repositories/safety.repository.js';

export const SafetyService = {
  getAllAlerts: async () => SafetyRepository.findAll(),
  createAlerts: async (alerts) => {
    const list = Array.isArray(alerts) ? alerts : [alerts];
    const results = [];
    for (const alert of list) {
      const created = await SafetyRepository.create(alert);
      results.push(created);
    }
    return results;
  }
};
