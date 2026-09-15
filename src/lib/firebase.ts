import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

export { isFirebaseConfigured };

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

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
        dbInstance = getFirestore(initializedApp);
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
    dbInstance = getFirestore(appInstance);
  } catch (error) {
    console.warn('Failed to eagerly initialize Firebase:', error);
  }
} else {
  console.info('Firebase environment variables not detected. Operating in local storage mode.');
}

export const app = appInstance;
export const db = dbInstance;
