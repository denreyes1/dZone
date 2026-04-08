import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuthStore } from '@/stores/authStore';
import { isFirebaseAvailable } from '@/config/firebase';
import { useUIStore } from '@/stores/uiStore';

export function useAuth() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setOfflineMode = useUIStore((s) => s.setOfflineMode);

  useEffect(() => {
    if (!isFirebaseAvailable() || !auth) {
      setUser(null);
      setLoading(false);
      setOfflineMode(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [setUser, setLoading, setOfflineMode]);
}
