import { FastagLog } from '../models/FastagLog.model.js';

export const FastagRepository = {
  findAll: async () => FastagLog.find().sort({ timestamp: -1 }),
  create: async (data) => FastagLog.create(data)
};
