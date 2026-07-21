/* eslint-disable no-undef */
/* firebase-messaging-sw.js — Background FCM Push Notification Handler
 * NOTE: Service Workers cannot access Vite environment variables.
 * Firebase config values must be hardcoded here.
 * Update these values if your Firebase project changes.
 */

importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCMgbou2c_ptFvWc3Cpkh6dxbpfZpc9WUM",
  authDomain: "transportation-portal-30595.firebaseapp.com",
  projectId: "transportation-portal-30595",
  storageBucket: "transportation-portal-30595.firebasestorage.app",
  messagingSenderId: "64389593209",
  appId: "1:64389593209:web:887bd156ae8cea58453ca8",
  measurementId: "G-LDVH8TR9JT"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background (app closed / not focused) push messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received:', payload);

    const notificationTitle =
      payload.notification?.title ||
      payload.data?.title ||
      'Transcend Transportation Alert';

    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'You have a new transport update.',
      icon: payload.notification?.icon || '/transcend-logo.png',
      badge: '/transcend-logo.png',
      data: payload.data || {},
      tag: payload.data?.type || 'transport-notification',
      requireInteraction: payload.data?.priority === 'Emergency'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('[firebase-messaging-sw.js] Firebase init skipped:', e.message);
}

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
