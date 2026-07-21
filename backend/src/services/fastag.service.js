import { FastagRepository } from '../repositories/fastag.repository.js';

export const FastagService = {
  getAllLogs: async () => FastagRepository.findAll(),
  createLogs: async (logs) => {
    const list = Array.isArray(logs) ? logs : [logs];
    const results = [];
    for (const item of list) {
      const payload = {
        ...item,
        id: item.id || `FT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: item.timestamp || new Date().toISOString()
      };
      const created = await FastagRepository.create(payload);
      results.push(created);
    }
    return results;
  }
};
