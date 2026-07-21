// src/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let messaging: Messaging | null = null;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && firebaseConfig.projectId) {
  try {
    messaging = getMessaging(app);
  } catch (err) {
    console.warn('[Firebase Client] Messaging initialization skipped or unsupported:', err);
  }
}

export { app, messaging };

/**
 * Request FCM Token for current browser session
 */
export const requestFcmToken = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn('[Firebase Client] FCM messaging instance unavailable. Ensure VITE_FIREBASE_* environment variables are set.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[Firebase Client] Notification permission denied or dismissed by user.');
      return null;
    }

    // Register service worker if available
    const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration
    });

    if (token) {
      console.log('[Firebase Client] FCM Registration Token generated:', token.slice(0, 15) + '...');
      return token;
    } else {
      console.warn('[Firebase Client] No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('[Firebase Client] Error acquiring FCM token:', error);
    return null;
  }
};

/**
 * Listen to foreground messages
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[Firebase Client] Foreground message received:', payload);
    callback(payload);
  });
};
