import { getMessaging } from '../config/firebaseAdmin.js';
import { User } from '../models/User.model.js';
import { Notification } from '../models/Notification.model.js';
import { Student } from '../models/Student.model.js';
import { Vehicle } from '../models/Vehicle.model.js';

export class NotificationService {
  /**
   * Helper to clean up dead/invalid FCM tokens from User documents in MongoDB
   */
  static async removeInvalidTokens(tokenErrorPairs) {
    if (!tokenErrorPairs || tokenErrorPairs.length === 0) return;

    for (const { token, error } of tokenErrorPairs) {
      const code = error?.code || error?.message || '';
      if (
        code.includes('registration-token-not-registered') ||
        code.includes('invalid-registration-token') ||
        code.includes('invalid-argument')
      ) {
        try {
          await User.updateMany(
            { fcmTokens: token },
            { $pull: { fcmTokens: token } }
          );
          console.log(`[NotificationService] Removed dead FCM token: ${token.slice(0, 10)}...`);
        } catch (err) {
          console.error('[NotificationService] Error removing dead token:', err.message);
        }
      }
    }
  }

  /**
   * Internal helper to dispatch FCM push payload to array of tokens
   */
  static async sendFcmPayload(tokens, title, body, data = {}, type = 'General', priority = 'Normal') {
    if (!tokens || tokens.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    const messaging = getMessaging();
    if (!messaging) {
      console.warn('[NotificationService] FCM messaging not initialized. Skipping FCM dispatch.');
      return { successCount: 0, failureCount: tokens.length };
    }

    // Convert all data object properties to string (FCM requirement for data payload)
    const formattedData = {};
    if (data && typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        formattedData[key] = String(data[key]);
      });
    }
    formattedData.title = title;
    formattedData.body = body;
    formattedData.type = type;
    formattedData.priority = priority;

    const messagePayload = {
      tokens,
      notification: { title, body },
      data: formattedData,
      android: {
        priority: priority === 'Emergency' ? 'high' : 'normal',
        notification: {
          sound: priority === 'Emergency' ? 'emergency' : 'default',
          priority: priority === 'Emergency' ? 'max' : 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    try {
      const response = await messaging.sendEachForMulticast(messagePayload);
      const deadTokens = [];

      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          deadTokens.push({ token: tokens[idx], error: resp.error });
        }
      });

      if (deadTokens.length > 0) {
        await this.removeInvalidTokens(deadTokens);
      }

      return {
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('[NotificationService] FCM multicast error:', error.message);
      return { successCount: 0, failureCount: tokens.length };
    }
  }

  /**
   * Send notification to a single user by userId or email
   */
  static async sendToUser(userId, title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    const user = await User.findOne({
      $or: [{ _id: userId }, { email: userId }, { studentId: userId }, { employeeId: userId }]
    });

    const recipientId = user ? user.email : String(userId);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: 'User',
      recipientUsers: [recipientId],
      createdBy,
      data,
      isRead: false
    });

    const tokens = user?.fcmTokens || [];
    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);

    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Send notification to multiple users
   */
  static async sendToUsers(userIds, title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return { successCount: 0, failureCount: 0 };
    }

    const users = await User.find({
      $or: [{ _id: { $in: userIds } }, { email: { $in: userIds } }]
    });

    const recipientEmails = users.map((u) => u.email);
    const tokens = users.flatMap((u) => u.fcmTokens || []).filter(Boolean);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: 'User',
      recipientUsers: recipientEmails,
      createdBy,
      data,
      isRead: false
    });

    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);
    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Send notification to all users matching a specific role (e.g. 'Student', 'Parent', 'Driver')
   */
  static async sendToRole(role, title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    const users = await User.find({ role, isActive: true });
    const recipientEmails = users.map((u) => u.email);
    const tokens = users.flatMap((u) => u.fcmTokens || []).filter(Boolean);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: role === 'Parent' ? 'Parents' : role === 'Student' ? 'Students' : 'Role',
      recipientRole: role,
      recipientUsers: recipientEmails,
      createdBy,
      data,
      isRead: false
    });

    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);
    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Send broadcast notification to all active users in system
   */
  static async sendBroadcast(title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    const users = await User.find({ isActive: true });
    const tokens = users.flatMap((u) => u.fcmTokens || []).filter(Boolean);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: 'All',
      createdBy,
      data,
      isRead: false
    });

    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);
    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Send notification to all students and parents assigned to a specific Route
   */
  static async sendToRoute(routeId, title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    const students = await Student.find({ route: routeId });
    const studentIds = students.map((s) => s.studentId).filter(Boolean);
    const parentEmails = students.map((s) => s.parentEmail).filter(Boolean);

    const users = await User.find({
      $or: [{ studentId: { $in: studentIds } }, { email: { $in: parentEmails } }]
    });

    const tokens = users.flatMap((u) => u.fcmTokens || []).filter(Boolean);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: 'Route',
      routeId,
      recipientUsers: users.map((u) => u.email),
      createdBy,
      data,
      isRead: false
    });

    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);
    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Send notification to all students and parents assigned to a specific Bus
   */
  static async sendToBus(busId, title, body, data = {}, type = 'General', priority = 'Normal', createdBy = 'System') {
    const students = await Student.find({ bus: busId });
    const studentIds = students.map((s) => s.studentId).filter(Boolean);
    const parentEmails = students.map((s) => s.parentEmail).filter(Boolean);

    const users = await User.find({
      $or: [{ studentId: { $in: studentIds } }, { email: { $in: parentEmails } }]
    });

    const tokens = users.flatMap((u) => u.fcmTokens || []).filter(Boolean);

    const doc = await Notification.create({
      title,
      body,
      type,
      priority,
      recipientType: 'Bus',
      busId,
      recipientUsers: users.map((u) => u.email),
      createdBy,
      data,
      isRead: false
    });

    const fcmRes = await this.sendFcmPayload(tokens, title, body, data, type, priority);
    return { notification: doc, fcm: fcmRes };
  }

  /**
   * Register or update an FCM token for a user
   */
  static async registerFcmToken(userId, fcmToken) {
    if (!fcmToken || typeof fcmToken !== 'string') {
      throw new Error('Invalid FCM token');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Ensure array exists & add token without duplicates
    if (!user.fcmTokens) user.fcmTokens = [];

    if (!user.fcmTokens.includes(fcmToken)) {
      user.fcmTokens.push(fcmToken);
      await user.save();
    }

    return user;
  }

  /**
   * Get notification history for a user
   */
  static async getNotificationHistoryForUser(user) {
    const query = {
      $or: [
        { recipientType: 'All' },
        { recipientUsers: user.email },
        { recipientUsers: user.id },
        { recipientRole: user.role }
      ]
    };

    if (user.role === 'Parent') {
      query.$or.push({ recipientType: 'Parents' });
    }
    if (user.role === 'Student') {
      query.$or.push({ recipientType: 'Students' });
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    return notifications.map((n) => {
      const isRead = n.isRead || (n.readBy && n.readBy.includes(user.email));
      return {
        id: n._id,
        title: n.title,
        body: n.body,
        message: n.body,
        type: n.type,
        category: n.type,
        priority: n.priority,
        createdBy: n.createdBy,
        sentBy: n.createdBy,
        data: n.data,
        isRead,
        createdAt: n.createdAt,
        date: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString()
      };
    });
  }

  /**
   * Mark notification as read for a user
   */
  static async markAsRead(notificationId, userEmail) {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    if (!notification.readBy) {
      notification.readBy = [];
    }

    if (!notification.readBy.includes(userEmail)) {
      notification.readBy.push(userEmail);
    }
    notification.isRead = true;

    await notification.save();
    return notification;
  }
}
