import {
  doc,
  setDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Scene } from '@/types';

interface SceneHistoryData {
  scenes: Scene[];
  lastActiveSceneId: string;
}

function sceneHistoryDocRef(uid: string) {
  return doc(db!, 'users', uid, 'boardConfig', 'sceneHistory');
}

export function subscribeSceneHistory(
  uid: string,
  callback: (data: SceneHistoryData) => void,
): Unsubscribe {
  if (!db) return () => {};

  return onSnapshot(sceneHistoryDocRef(uid), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      callback({
        scenes: (data.scenes ?? []) as Scene[],
        lastActiveSceneId: (data.lastActiveSceneId ?? '') as string,
      });
    } else {
      callback({ scenes: [], lastActiveSceneId: '' });
    }
  });
}

export async function saveSceneHistory(uid: string, data: Partial<SceneHistoryData>) {
  if (!db) return;
  await setDoc(sceneHistoryDocRef(uid), data, { merge: true });
}
