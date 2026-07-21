import { SafetyService } from '../services/safety.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const SafetyController = {
  getAllAlerts: async (req, res) => {
    try {
      const alerts = await SafetyService.getAllAlerts();
      return sendSuccess(res, alerts, 'Safety alerts retrieved');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createAlerts: async (req, res) => {
    try {
      const alerts = await SafetyService.createAlerts(req.body);
      return sendSuccess(res, alerts, 'Safety alert created', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
