import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Task } from '@/types';

function tasksRef(uid: string) {
  return collection(db!, 'users', uid, 'tasks');
}

export async function addTask(uid: string, text: string): Promise<string> {
  if (!db) throw new Error('Firestore not available');
  const docRef = await addDoc(tasksRef(uid), {
    text,
    completed: false,
    createdAt: serverTimestamp(),
    completedAt: null,
  });
  return docRef.id;
}

export async function toggleTask(uid: string, taskId: string, completed: boolean) {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid, 'tasks', taskId), {
    completed,
    completedAt: completed ? serverTimestamp() : null,
  });
}

export async function deleteTask(uid: string, taskId: string) {
  if (!db) return;
  await deleteDoc(doc(db, 'users', uid, 'tasks', taskId));
}

export function subscribeTasks(uid: string, callback: (tasks: Task[]) => void): Unsubscribe {
  if (!db) return () => {};
  const q = query(tasksRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const tasks: Task[] = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Task[];
    callback(tasks);
  });
}
