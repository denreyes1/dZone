import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { DEFAULT_PREFERENCES, type UserPreferences } from '@/types';

function prefsDoc(uid: string) {
  return doc(db!, 'users', uid, 'preferences', 'main');
}

export async function getPreferences(uid: string): Promise<UserPreferences> {
  if (!db) return DEFAULT_PREFERENCES;
  const snap = await getDoc(prefsDoc(uid));
  if (!snap.exists()) return DEFAULT_PREFERENCES;
  return { ...DEFAULT_PREFERENCES, ...snap.data() } as UserPreferences;
}

export async function savePreferences(uid: string, prefs: Partial<UserPreferences>) {
  if (!db) return;
  await setDoc(prefsDoc(uid), prefs, { merge: true });
}
