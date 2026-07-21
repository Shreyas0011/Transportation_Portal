import { NotificationRepository } from '../repositories/notification.repository.js';

export const NotificationService = {
  getAllNotifications: async () => NotificationRepository.findAll(),
  createNotification: async (data) => {
    const payload = {
      ...data,
      id: data.id || `NOT-${Date.now()}`,
      date: data.date || new Date().toISOString().split('T')[0]
    };
    return NotificationRepository.create(payload);
  }
};
