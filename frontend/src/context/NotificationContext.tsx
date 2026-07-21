import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { requestFcmToken, onForegroundMessage } from '../firebase';
import { transportApi } from '../api/transportApi';
import { useAuthStore } from '../store';
import { useToast } from '../components/Toast';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  message?: string;
  type?: string;
  category?: string;
  priority?: 'Normal' | 'Important' | 'Emergency' | string;
  createdBy?: string;
  sentBy?: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt?: string;
  date?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  requestPermissionAndToken: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useAuthStore((s) => s.user);
  const toast = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const data = await transportApi.getNotificationHistory();
      setNotifications(data || []);
    } catch (err) {
      console.warn('[NotificationContext] Failed to fetch notification history:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await transportApi.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('[NotificationContext] Failed to mark as read:', err);
    }
  };

  const requestPermissionAndToken = useCallback(async () => {
    if (!user) return;
    const storageKey = `fcm_permission_prompt_asked_${user.email}`;

    // Check if permission has been asked before for this user
    if (localStorage.getItem(storageKey)) {
      return;
    }

    try {
      localStorage.setItem(storageKey, 'true');
      const token = await requestFcmToken();
      if (token) {
        await transportApi.registerFcmToken(token);
        console.log('[NotificationContext] Registered FCM token with backend successfully.');
      }
    } catch (err) {
      console.warn('[NotificationContext] Permission or token registration flow encountered an error:', err);
    }
  }, [user]);

  // Handle Foreground Messages
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    requestPermissionAndToken();

    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || '';
      const priority = payload.data?.priority || 'Normal';

      if (priority === 'Emergency') {
        toast.error(`🚨 EMERGENCY: ${title} - ${body}`);
      } else if (priority === 'Important') {
        toast.warning(`⚠️ IMPORTANT: ${title} - ${body}`);
      } else {
        toast.info(`🔔 ${title}: ${body}`);
      }

      fetchNotifications();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user, fetchNotifications, requestPermissionAndToken, toast]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        requestPermissionAndToken
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
