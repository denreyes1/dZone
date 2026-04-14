import {
  doc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { TaskTag } from '@/types/kanban';

function tagHistoryDocRef(uid: string) {
  return doc(db!, 'users', uid, 'boardConfig', 'tagHistory');
}

export function subscribeTagHistory(
  uid: string,
  callback: (tags: TaskTag[]) => void,
): Unsubscribe {
  if (!db) return () => {};

  return onSnapshot(tagHistoryDocRef(uid), (snap) => {
    if (snap.exists()) {
      callback((snap.data().tags ?? []) as TaskTag[]);
    } else {
      callback([]);
    }
  });
}

export async function saveTagHistory(uid: string, tags: TaskTag[]) {
  if (!db) return;
  await setDoc(tagHistoryDocRef(uid), { tags }, { merge: true });
}
