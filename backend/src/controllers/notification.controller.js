import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  /**
   * POST /api/notifications/send
   * Targeted send by recipientType: User, Students, Parents, Route, Bus, Role
   */
  static async sendNotification(req, res, next) {
    try {
      const {
        title,
        body,
        recipientType,
        recipientId,
        routeId,
        busId,
        role,
        data,
        type = 'General',
        priority = 'Normal'
      } = req.body;

      if (!title || !body) {
        return res.status(400).json({ success: false, message: 'Title and body are required' });
      }

      const createdBy = req.user ? `${req.user.name} (${req.user.role})` : 'Admin';
      let result;

      switch (recipientType) {
        case 'User':
          result = await NotificationService.sendToUser(recipientId, title, body, data, type, priority, createdBy);
          break;
        case 'Students':
          result = await NotificationService.sendToRole('Student', title, body, data, type, priority, createdBy);
          break;
        case 'Parents':
          result = await NotificationService.sendToRole('Parent', title, body, data, type, priority, createdBy);
          break;
        case 'Route':
          result = await NotificationService.sendToRoute(routeId, title, body, data, type, priority, createdBy);
          break;
        case 'Bus':
          result = await NotificationService.sendToBus(busId, title, body, data, type, priority, createdBy);
          break;
        case 'Role':
          result = await NotificationService.sendToRole(role, title, body, data, type, priority, createdBy);
          break;
        case 'All':
        default:
          result = await NotificationService.sendBroadcast(title, body, data, type, priority, createdBy);
          break;
      }

      return res.status(200).json({
        success: true,
        message: 'Notification sent successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/broadcast
   * Broadcast push notification to all users
   */
  static async sendBroadcast(req, res, next) {
    try {
      const { title, body, data, type = 'General', priority = 'Normal' } = req.body;

      if (!title || !body) {
        return res.status(400).json({ success: false, message: 'Title and body are required' });
      }

      const createdBy = req.user ? `${req.user.name} (${req.user.role})` : 'Super Admin';
      const result = await NotificationService.sendBroadcast(title, body, data, type, priority, createdBy);

      return res.status(200).json({
        success: true,
        message: 'Broadcast notification sent successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/token
   * Register or update user FCM token
   */
  static async registerToken(req, res, next) {
    try {
      const { fcmToken } = req.body;
      if (!fcmToken) {
        return res.status(400).json({ success: false, message: 'fcmToken is required' });
      }

      const userId = req.user.id || req.user._id;
      const user = await NotificationService.registerFcmToken(userId, fcmToken);

      return res.status(200).json({
        success: true,
        message: 'FCM token registered successfully',
        data: { email: user.email, tokenCount: user.fcmTokens?.length || 0 }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/history
   * Get user notification history
   */
  static async getHistory(req, res, next) {
    try {
      const user = req.user;
      const history = await NotificationService.getNotificationHistoryForUser(user);

      return res.status(200).json({
        success: true,
        message: 'Notification history retrieved successfully',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark notification as read
   */
  static async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      const updated = await NotificationService.markAsRead(id, userEmail);

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
