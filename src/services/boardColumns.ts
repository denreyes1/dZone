import {
  doc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { DEFAULT_COLUMNS, type ColumnConfig } from '@/types/kanban';

function columnsDocRef(uid: string) {
  return doc(db!, 'users', uid, 'boardConfig', 'columns');
}

export function subscribeBoardColumns(
  uid: string,
  callback: (columns: ColumnConfig[]) => void,
): Unsubscribe {
  if (!db) return () => {};

  return onSnapshot(columnsDocRef(uid), async (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback((data.columns ?? DEFAULT_COLUMNS) as ColumnConfig[]);
    } else {
      await setDoc(columnsDocRef(uid), { columns: DEFAULT_COLUMNS });
      callback(DEFAULT_COLUMNS);
    }
  });
}

export async function saveBoardColumns(uid: string, columns: ColumnConfig[]) {
  if (!db) return;
  await setDoc(columnsDocRef(uid), { columns }, { merge: true });
}
