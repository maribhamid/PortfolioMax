import { ContactMessage } from '../types/portfolio';
import { isFirebaseConfigured } from './firebaseConfig';

const MESSAGES_STORAGE_KEY = 'portfolio_contact_messages_v1';

// Read messages from local cache synchronously
export function getLocalMessages(): ContactMessage[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort((a, b) => b.createdAt - a.createdAt);
        }
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
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  } catch (e) {
    console.warn('Failed to save local messages:', e);
  }
}

/**
 * Save a new message to local storage and Cloud Firestore.
 * Stored securely under the permitted 'portfolio' collection: portfolio/messages
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
  pendingMessageIds.add(newMessage.id);
  const current = getLocalMessages();
  const updated = [newMessage, ...current.filter((m) => m.id !== newMessage.id)];
  setLocalMessages(updated);

  // 2. If Firebase is configured, persist to Firestore portfolio/messages
  if (isFirebaseConfigured) {
    try {
      const [{ doc, getDoc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        const messagesDocRef = doc(db, 'portfolio', 'messages');
        const snap = await getDoc(messagesDocRef);
        let cloudMessages: ContactMessage[] = [];
        if (snap.exists()) {
          const d = snap.data();
          if (Array.isArray(d.messages)) {
            cloudMessages = d.messages;
          }
        }
        const merged = [newMessage, ...cloudMessages.filter((m) => m.id !== newMessage.id)];

        await setDoc(
          messagesDocRef,
          {
            messages: merged,
            lastMessageAt: Date.now(),
            unreadCount: merged.filter((m) => !m.read).length,
          },
          { merge: true }
        );

        // Also save to discrete subcollection document
        try {
          await setDoc(doc(db, 'portfolio', 'inquiries', 'items', newMessage.id), newMessage);
        } catch {}
      }
    } catch (err) {
      console.warn('Failed to sync new message to Firebase Firestore:', err);
    } finally {
      pendingMessageIds.delete(newMessage.id);
    }
  } else {
    pendingMessageIds.delete(newMessage.id);
  }

  return newMessage;
}

/**
 * Delete a message by ID from both local storage and Firestore.
 */
export async function deleteMessageFromStorage(id: string): Promise<boolean> {
  const current = getLocalMessages();
  const filtered = current.filter((m) => m.id !== id);
  setLocalMessages(filtered);

  if (isFirebaseConfigured) {
    try {
      const [{ doc, getDoc, setDoc, deleteDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        const messagesDocRef = doc(db, 'portfolio', 'messages');
        const snap = await getDoc(messagesDocRef);
        if (snap.exists()) {
          const d = snap.data();
          const cloudMessages: ContactMessage[] = Array.isArray(d.messages) ? d.messages : [];
          const updatedCloud = cloudMessages.filter((m) => m.id !== id);
          await setDoc(
            messagesDocRef,
            {
              messages: updatedCloud,
              lastMessageAt: Date.now(),
              unreadCount: updatedCloud.filter((m) => !m.read).length,
            },
            { merge: true }
          );
        }

        try {
          await deleteDoc(doc(db, 'portfolio', 'inquiries', 'items', id));
        } catch {}
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
      const [{ doc, getDoc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        const messagesDocRef = doc(db, 'portfolio', 'messages');
        const snap = await getDoc(messagesDocRef);
        if (snap.exists()) {
          const d = snap.data();
          const cloudMessages: ContactMessage[] = Array.isArray(d.messages) ? d.messages : [];
          const updatedCloud = cloudMessages.map((m) => (m.id === id ? { ...m, read } : m));
          await setDoc(
            messagesDocRef,
            {
              messages: updatedCloud,
              unreadCount: updatedCloud.filter((m) => !m.read).length,
            },
            { merge: true }
          );
        }

        try {
          await setDoc(doc(db, 'portfolio', 'inquiries', 'items', id), { read }, { merge: true });
        } catch {}
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
  setLocalMessages([]);

  if (isFirebaseConfigured) {
    try {
      const [{ doc, setDoc }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);
      const db = getDb();
      if (db) {
        await setDoc(
          doc(db, 'portfolio', 'messages'),
          {
            messages: [],
            lastMessageAt: Date.now(),
            unreadCount: 0,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Failed to clear messages from Firestore:', err);
    }
  }

  return true;
}

// Track locally pending message IDs to avoid race conditions
const pendingMessageIds = new Set<string>();

/**
 * Subscribe to messages with instant local cache and live Firestore updates on portfolio/messages.
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
      const [{ doc, onSnapshot }, { getDb }] = await Promise.all([
        import('firebase/firestore'),
        import('./firebase'),
      ]);

      if (!isSubscribed) return;
      const db = getDb();
      if (!db) return;

      const messagesDocRef = doc(db, 'portfolio', 'messages');

      unsubscribeFirestore = onSnapshot(
        messagesDocRef,
        (snapshot) => {
          if (!isSubscribed) return;
          if (snapshot.exists()) {
            const data = snapshot.data();
            const remoteMessages: ContactMessage[] = Array.isArray(data.messages) ? data.messages : [];

            // Firestore is the authoritative source for synced messages.
            // Only keep local messages that are currently pending cloud write.
            const remoteIds = new Set(remoteMessages.map((m) => m.id));
            const localPending = getLocalMessages().filter((m) => pendingMessageIds.has(m.id) && !remoteIds.has(m.id));
            const merged = [...remoteMessages, ...localPending].sort((a, b) => b.createdAt - a.createdAt);

            setLocalMessages(merged);
            callback(merged);
          }
        },
        (error) => {
          console.warn('Firestore messages listener notice:', error);
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
