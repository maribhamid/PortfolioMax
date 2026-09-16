import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

export { isFirebaseConfigured };

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

function createFirestoreInstance(app: FirebaseApp): Firestore {
  try {
    // In Capacitor / Android WebView, long-polling auto-detection is essential
    // to prevent gRPC streaming hangs on https://localhost
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  if (!appInstance) {
    try {
      appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    } catch (error) {
      console.warn('Failed to initialize Firebase App SDK:', error);
    }
  }
  return appInstance;
}

export function getDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  if (!dbInstance) {
    const initializedApp = getFirebaseApp();
    if (initializedApp) {
      try {
        dbInstance = createFirestoreInstance(initializedApp);
      } catch (error) {
        console.warn('Failed to initialize Firestore SDK:', error);
      }
    }
  }
  return dbInstance;
}

// Eager instances for components that need direct references
if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    dbInstance = createFirestoreInstance(appInstance);
  } catch (error) {
    console.warn('Failed to eagerly initialize Firebase:', error);
  }
} else {
  console.info('Firebase environment variables not detected. Operating in local storage mode.');
}

export const app = appInstance;
export const db = dbInstance;
