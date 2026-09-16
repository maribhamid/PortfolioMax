import fs from 'fs';

// Load .env.local into process.env first!
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...vals] = trimmed.split('=');
  process.env[key.trim()] = vals.join('=').trim();
});

const { saveMessageToStorage } = await import('../src/lib/messagesStorage.ts');
const { initializeApp } = await import('firebase/app');
const { getFirestore, doc, getDoc } = await import('firebase/firestore');

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}, 'verify-msg-app');

const db = getFirestore(app);

async function test() {
  const testMsg = await saveMessageToStorage({
    name: 'Sarah Connor',
    email: 'sarah@skynet.ai',
    projectType: 'AI Agent Architecture',
    priority: 'urgent',
    message: 'Hello Marib, we would like to collaborate on an autonomous AI agent workflow!'
  });
  console.log('Saved message id:', testMsg.id);

  // Read back from portfolio/messages in Firestore
  const snap = await getDoc(doc(db, 'portfolio', 'messages'));
  if (snap.exists()) {
    const data = snap.data();
    console.log('SUCCESS! Read back from Firestore portfolio/messages:');
    console.log('Total messages:', data.messages?.length);
    console.log('Latest message sender:', data.messages?.[0]?.name);
    console.log('Latest message text:', data.messages?.[0]?.message);
  } else {
    console.error('Document portfolio/messages does not exist in Firestore!');
  }
  process.exit(0);
}

test();
