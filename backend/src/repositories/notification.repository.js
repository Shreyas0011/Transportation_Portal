import { Notification } from '../models/Notification.model.js';

export const NotificationRepository = {
  findAll: async () => Notification.find().sort({ createdAt: -1 }),
  create: async (data) => Notification.create(data)
};
