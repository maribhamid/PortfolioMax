import { ContactMessage } from '../types/portfolio';
import { isFirebaseConfigured } from './firebaseConfig';

const MESSAGES_STORAGE_KEY = 'portfolio_contact_messages_v1';

// Read messages from local cache synchronously
export function getLocalMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
  } catch (e) {
    console.warn('Failed to read local messages:', e);
  }
  return [];
}

// Persist messages to local storage
export function setLocalMessages(messages: ContactMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.warn('Failed to save local messages:', e);
  }
}

/**
 * Save a new message to local storage and Cloud Firestore.
 */
export async function saveMessageToStorage(
  msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>
): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
    read: false,
  };

  // 1. Immediately save to local cache
  const current = getLocalMessages();
  const updated = [newMessage, ...current];
  setLocalMessages(updated);

  // 2. If Firebase is configured, persist to Firestore collection 'messages'
  if (isFirebaseConfigured) {
    try {
      const [{ doc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        await setDoc(doc(db, 'messages', newMessage.id), newMessage);
      }
    } catch (err) {
      console.warn('Failed to sync new message to Firebase Firestore:', err);
    }
  }

  return newMessage;
}

/**
 * Delete a message by ID from both local storage and Firestore.
 */
export async function deleteMessageFromStorage(id: string): Promise<boolean> {
  // Update local storage
  const current = getLocalMessages();
  const filtered = current.filter((m) => m.id !== id);
  setLocalMessages(filtered);

  // Delete from Firestore if configured
  if (isFirebaseConfigured) {
    try {
      const [{ doc, deleteDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        await deleteDoc(doc(db, 'messages', id));
      }
    } catch (err) {
      console.warn('Failed to delete message from Firestore:', err);
    }
  }

  return true;
}

/**
 * Mark a message as read or unread in local storage and Firestore.
 */
export async function markMessageReadInStorage(id: string, read: boolean): Promise<boolean> {
  const current = getLocalMessages();
  const updated = current.map((m) => (m.id === id ? { ...m, read } : m));
  setLocalMessages(updated);

  if (isFirebaseConfigured) {
    try {
      const [{ doc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        await setDoc(doc(db, 'messages', id), { read }, { merge: true });
      }
    } catch (err) {
      console.warn('Failed to update message status in Firestore:', err);
    }
  }

  return true;
}

/**
 * Clear all messages from local storage and Firestore.
 */
export async function clearAllMessagesFromStorage(): Promise<boolean> {
  const current = getLocalMessages();
  setLocalMessages([]);

  if (isFirebaseConfigured && current.length > 0) {
    try {
      const [{ doc, deleteDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        await Promise.all(current.map((m) => deleteDoc(doc(db, 'messages', m.id))));
      }
    } catch (err) {
      console.warn('Failed to clear messages from Firestore:', err);
    }
  }

  return true;
}

/**
 * Subscribe to messages with instant local cache and live Firestore updates.
 */
export function subscribeToMessages(callback: (messages: ContactMessage[]) => void): () => void {
  // Call immediately with local cache
  callback(getLocalMessages());

  if (!isFirebaseConfigured) {
    return () => {};
  }

  let isSubscribed = true;
  let unsubscribeFirestore: (() => void) | undefined;

  const initFirestoreSubscription = async () => {
    try {
      const [{ collection, onSnapshot, query, orderBy }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);

      if (!isSubscribed) return;
      const db = getDb();
      if (!db) return;

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));

      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          if (!isSubscribed) return;
          const remoteMessages: ContactMessage[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Partial<ContactMessage>;
            remoteMessages.push({
              id: docSnap.id,
              name: data.name || 'Anonymous',
              email: data.email || '',
              projectType: data.projectType || 'General Inquiry',
              budget: data.budget || 'Flexible',
              message: data.message || '',
              createdAt: data.createdAt || Date.now(),
              read: Boolean(data.read),
            });
          });

          // Merge with any offline messages from local cache that may not have synced yet
          const local = getLocalMessages();
          const remoteIds = new Set(remoteMessages.map((m) => m.id));
          const unsynced = local.filter((m) => !remoteIds.has(m.id));
          const merged = [...remoteMessages, ...unsynced].sort((a, b) => b.createdAt - a.createdAt);

          setLocalMessages(merged);
          callback(merged);
        },
        (error) => {
          console.warn('Firestore messages listener notice (using local storage):', error);
        }
      );
    } catch (err) {
      console.warn('Could not initialize Firestore messages listener:', err);
    }
  };

  initFirestoreSubscription();

  return () => {
    isSubscribed = false;
    unsubscribeFirestore?.();
  };
}
