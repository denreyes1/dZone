import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { BoardTask } from '@/types/kanban';
import type { Task } from '@/types';

function boardTasksRef(uid: string) {
  return collection(db!, 'users', uid, 'boardTasks');
}

function legacyTasksRef(uid: string) {
  return collection(db!, 'users', uid, 'tasks');
}

export async function addBoardTask(
  uid: string,
  title: string,
  description: string,
  column: string,
  order: number,
): Promise<string> {
  if (!db) throw new Error('Firestore not available');
  const docRef = await addDoc(boardTasksRef(uid), {
    title,
    description,
    column,
    order,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateBoardTask(
  uid: string,
  taskId: string,
  updates: Partial<Omit<BoardTask, 'id' | 'createdAt'>>,
) {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid, 'boardTasks', taskId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBoardTask(uid: string, taskId: string) {
  if (!db) return;
  await deleteDoc(doc(db, 'users', uid, 'boardTasks', taskId));
}

export function subscribeBoardTasks(
  uid: string,
  callback: (tasks: BoardTask[]) => void,
): Unsubscribe {
  if (!db) return () => {};
  const q = query(boardTasksRef(uid), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as BoardTask[];
    callback(tasks);
  });
}

export async function migrateLegacyTasks(uid: string): Promise<BoardTask[]> {
  if (!db) return [];

  const legacySnap = await getDocs(legacyTasksRef(uid));
  if (legacySnap.empty) return [];

  const boardSnap = await getDocs(boardTasksRef(uid));
  if (!boardSnap.empty) return [];

  const batch = writeBatch(db);
  const migrated: BoardTask[] = [];

  legacySnap.docs.forEach((d, index) => {
    const old = d.data() as Omit<Task, 'id'>;
    const column = old.completed ? 'done' : 'backlog';
    const newRef = doc(boardTasksRef(uid));
    const task: Omit<BoardTask, 'id'> = {
      title: old.text,
      description: '',
      column,
      order: index,
      createdAt: old.createdAt ?? null,
      updatedAt: null,
    };
    batch.set(newRef, { ...task, updatedAt: serverTimestamp() });
    migrated.push({ id: newRef.id, ...task });
  });

  await batch.commit();
  return migrated;
}
