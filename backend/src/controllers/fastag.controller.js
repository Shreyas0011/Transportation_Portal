import { FastagService } from '../services/fastag.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const FastagController = {
  getAllLogs: async (req, res) => {
    try {
      const logs = await FastagService.getAllLogs();
      return sendSuccess(res, logs, 'Fastag logs retrieved');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createLogs: async (req, res) => {
    try {
      const logs = await FastagService.createLogs(req.body);
      return sendSuccess(res, logs, 'Fastag log created', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
