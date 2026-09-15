import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all critical Firebase environment variables are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let appInstance: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    dbInstance = getFirestore(appInstance);
    
    // Initialize storage if storageBucket is provided
    if (firebaseConfig.storageBucket) {
      storageInstance = getStorage(appInstance);
    }
  } catch (error) {
    console.warn('Failed to initialize Firebase SDK:', error);
  }
} else {
  console.info('Firebase environment variables not detected. Operating in local storage mode.');
}

export const app = appInstance;
export const db = dbInstance;
export const storage = storageInstance;

/**
 * Safely upload a file (image, PDF, document) to Firebase Cloud Storage.
 * Returns public HTTPS CDN URL on success, or null if Storage is unavailable/unconfigured.
 */
export async function uploadFileToStorage(
  folder: string,
  file: File
): Promise<string | null> {
  if (!storageInstance) return null;

  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${cleanName}`;
    const storageRef = ref(storageInstance, storagePath);

    // Set content type metadata
    const metadata = {
      contentType: file.type || 'application/octet-stream',
    };

    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn('Firebase Storage upload failed (falling back to optimized client storage):', errorMsg);
    return null;
  }
}

