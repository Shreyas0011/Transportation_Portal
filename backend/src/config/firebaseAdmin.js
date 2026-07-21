import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseApp = null;

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    // 1. Try local serviceAccountKey.json file locations
    const possiblePaths = [
      path.join(__dirname, 'serviceAccountKey.json'),
      path.join(__dirname, '..', 'serviceAccountKey.json'),
      path.join(process.cwd(), 'serviceAccountKey.json'),
      path.join(process.cwd(), 'backend', 'src', 'config', 'serviceAccountKey.json'),
      path.join(process.cwd(), 'backend', 'serviceAccountKey.json')
    ];

    let serviceAccountPath = possiblePaths.find((p) => fs.existsSync(p));

    if (serviceAccountPath) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log(`[Firebase Admin] Initialized from local JSON file: ${serviceAccountPath}`);
      return firebaseApp;
    }

    // 2. Try process.env.FIREBASE_SERVICE_ACCOUNT (raw JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('[Firebase Admin] Initialized from process.env.FIREBASE_SERVICE_ACCOUNT');
      return firebaseApp;
    }

    // 3. Try individual environment variables (for Render deployment)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      console.log('[Firebase Admin] Initialized from environment variables');
      return firebaseApp;
    }

    console.warn('[Firebase Admin] Warning: No serviceAccountKey.json or environment variables found. Push notifications will be stored in DB but live FCM sending is disabled until credentials are configured.');
    return null;
  } catch (error) {
    console.error('[Firebase Admin] Initialization failed:', error.message);
    return null;
  }
};

export const getMessaging = () => {
  const app = initializeFirebaseAdmin();
  if (!app) return null;
  return admin.messaging(app);
};

export default { initializeFirebaseAdmin, getMessaging };
