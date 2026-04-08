import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { todayDateString } from '@/utils/formatTime';

export interface DailyStats {
  totalFocusTime: number;
  sessionsCompleted: number;
  streak: number;
}

export async function updateStreak(uid: string): Promise<number> {
  if (!db) return 0;

  const userDoc = doc(db, 'users', uid);
  const snap = await getDoc(userDoc);
  if (!snap.exists()) return 0;

  const data = snap.data();
  const today = todayDateString();
  const lastActive = data.lastActiveDate as string;
  let streak = (data.streak as number) || 0;

  if (lastActive === today) {
    return streak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    streak += 1;
  } else {
    streak = 1;
  }

  await updateDoc(userDoc, { streak, lastActiveDate: today });
  return streak;
}

export async function getStreak(uid: string): Promise<number> {
  if (!db) return 0;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data().streak as number) || 0 : 0;
}
