import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { env } from './env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (env.isFirebaseConfigured) {
  app = initializeApp(env.firebase);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
export const isFirebaseAvailable = () => app !== null;
