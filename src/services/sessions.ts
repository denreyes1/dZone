import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { FocusSession, SessionType } from '@/types';

function sessionsRef(uid: string) {
  return collection(db!, 'users', uid, 'sessions');
}

export async function saveSession(
  uid: string,
  sceneId: string,
  duration: number,
  type: SessionType,
): Promise<string> {
  if (!db) throw new Error('Firestore not available');
  const docRef = await addDoc(sessionsRef(uid), {
    sceneId,
    duration,
    type,
    startedAt: Timestamp.fromMillis(Date.now() - duration * 1000),
    endedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTodaySessions(uid: string): Promise<FocusSession[]> {
  if (!db) return [];
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const q = query(
    sessionsRef(uid),
    where('endedAt', '>=', Timestamp.fromDate(startOfDay)),
    orderBy('endedAt', 'desc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FocusSession[];
}

export async function getRecentSessions(uid: string, limit = 10): Promise<FocusSession[]> {
  if (!db) return [];
  const q = query(sessionsRef(uid), orderBy('endedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => ({ id: d.id, ...d.data() })) as FocusSession[];
}
