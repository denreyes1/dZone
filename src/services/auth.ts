import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const googleProvider = new GoogleAuthProvider();

export async function signUp(email: string, password: string, displayName: string) {
  if (!auth) throw new Error('Firebase not configured');
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  await createUserDoc(user.uid, displayName, email);
  return user;
}

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase not configured');
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase not configured');
  const { user } = await signInWithPopup(auth, googleProvider);
  const userDoc = await getDoc(doc(db!, 'users', user.uid));
  if (!userDoc.exists()) {
    await createUserDoc(user.uid, user.displayName ?? 'User', user.email ?? '');
  }
  return user;
}

export async function signOut() {
  if (!auth) throw new Error('Firebase not configured');
  await firebaseSignOut(auth);
}

async function createUserDoc(uid: string, displayName: string, email: string) {
  if (!db) return;
  await setDoc(doc(db, 'users', uid), {
    displayName,
    email,
    createdAt: serverTimestamp(),
    streak: 0,
    lastActiveDate: '',
  });
}
