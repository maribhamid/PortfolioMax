const env: Record<string, any> =
  typeof import.meta !== 'undefined' && (import.meta as any).env
    ? (import.meta as any).env
    : typeof process !== 'undefined'
    ? process.env
    : {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'AIzaSyAqs_8u-A2Etf2Lr3j7_OEDXh4GrdHUuG8',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'portfoliomax-c4b26.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'portfoliomax-c4b26',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'portfoliomax-c4b26.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '941042857914',
  appId: env.VITE_FIREBASE_APP_ID || '1:941042857914:web:e12542456d666e0b444f83',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);
