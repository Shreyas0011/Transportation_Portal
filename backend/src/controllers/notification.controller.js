import { NotificationService } from '../services/notification.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const NotificationController = {
  getAllNotifications: async (req, res) => {
    try {
      const list = await NotificationService.getAllNotifications();
      return sendSuccess(res, list, 'Notifications retrieved');
    } catch (error) {
      return sendError(res, error.message);
    }
  },
  createNotification: async (req, res) => {
    try {
      const notif = await NotificationService.createNotification(req.body);
      return sendSuccess(res, notif, 'Notification created', 201);
    } catch (error) {
      return sendError(res, error.message, null, 400);
    }
  }
};
