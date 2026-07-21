// src/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import type { Messaging } from 'firebase/messaging';

// Firebase project configuration — values loaded from VITE_ env variables.
// For Vercel deployment, set all VITE_FIREBASE_* variables in the Vercel dashboard.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

// Initialize Firebase app (prevent duplicate initialization during HMR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Analytics (only in browser environments that support it)
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
      console.log('[Firebase] Analytics initialized');
    }
  }).catch(() => {});
}

// Initialize Firebase Cloud Messaging
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
 * Request permission and generate FCM push token for this browser session.
 * Returns the token string if successful, or null if denied / unavailable.
 */
export const requestFcmToken = async (): Promise<string | null> => {
  if (!messaging) {
    console.warn(
      '[Firebase Client] FCM messaging is unavailable. ' +
      'Ensure all VITE_FIREBASE_* environment variables are set.'
    );
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[Firebase Client] Notification permission denied or dismissed.');
      return null;
    }

    // Register service worker for background notifications
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    );

    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration
    });

    if (token) {
      console.log('[Firebase Client] FCM token generated successfully.');
      return token;
    } else {
      console.warn('[Firebase Client] No registration token available. Check VAPID key.');
      return null;
    }
  } catch (error) {
    console.error('[Firebase Client] Error acquiring FCM token:', error);
    return null;
  }
};

/**
 * Listen for push messages while the app is in the foreground.
 * Returns an unsubscribe function.
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[Firebase Client] Foreground push message received:', payload);
    callback(payload);
  });
};
