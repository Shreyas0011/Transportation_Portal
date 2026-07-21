import { SafetyAlert } from '../models/SafetyAlert.model.js';

export const SafetyRepository = {
  findAll: async () => SafetyAlert.find().sort({ timestamp: -1 }),
  create: async (data) => SafetyAlert.create(data)
};
